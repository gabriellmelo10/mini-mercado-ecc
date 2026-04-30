package com.minimercado.ecc.backend.domain.service;

import com.minimercado.ecc.backend.api.dto.VendaBulkRequestDTO;
import com.minimercado.ecc.backend.api.dto.VendaRequestDTO;
import com.minimercado.ecc.backend.api.dto.VendaResponseDTO;
import com.minimercado.ecc.backend.domain.model.Pessoa;
import com.minimercado.ecc.backend.domain.model.Produto;
import com.minimercado.ecc.backend.domain.model.Venda;
import com.minimercado.ecc.backend.domain.repository.PessoaRepository;
import com.minimercado.ecc.backend.domain.repository.ProdutoRepository;
import com.minimercado.ecc.backend.domain.repository.VendaRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VendaService {

    private final VendaRepository vendaRepository;
    private final PessoaRepository pessoaRepository;
    private final ProdutoRepository produtoRepository;

    public VendaService(VendaRepository vendaRepository, 
                        PessoaRepository pessoaRepository, 
                        ProdutoRepository produtoRepository) {
        this.vendaRepository = vendaRepository;
        this.pessoaRepository = pessoaRepository;
        this.produtoRepository = produtoRepository;
    }

    /**
     * Registra um lançamento e atualiza o saldo da pessoa.
     * RF04 - Registro de Consumo
     */
    @Transactional
    public VendaResponseDTO registrar(VendaRequestDTO request) {
        Pessoa pessoa = pessoaRepository.findById(request.pessoaId())
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));

        Produto produto = produtoRepository.findById(request.produtoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        BigDecimal valorTotal = produto.getPreco().multiply(new BigDecimal(request.quantidade()));

        Venda venda = new Venda(pessoa, produto, request.quantidade(), valorTotal);
        Venda salva = vendaRepository.save(venda);

        pessoa.setSaldoDevedor(pessoa.getSaldoDevedor().add(valorTotal));
        pessoaRepository.save(pessoa);

        return toResponseDTO(salva);
    }

    /**
     * Registra múltiplos lançamentos em uma única transação atômica.
     */
    @Transactional
    public List<VendaResponseDTO> registrarEmLote(VendaBulkRequestDTO request) {
        Pessoa pessoa = pessoaRepository.findById(request.pessoaId())
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));

        List<Venda> vendasParaSalvar = new ArrayList<>();
        BigDecimal valorTotalGeral = BigDecimal.ZERO;

        for (VendaBulkRequestDTO.ItemVendaDTO item : request.itens()) {
            Produto produto = produtoRepository.findById(item.produtoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + item.produtoId()));

            BigDecimal valorItem = produto.getPreco().multiply(new BigDecimal(item.quantidade()));
            valorTotalGeral = valorTotalGeral.add(valorItem);

            vendasParaSalvar.add(new Venda(pessoa, produto, item.quantidade(), valorItem));
        }

        List<Venda> salvas = vendaRepository.saveAll(vendasParaSalvar);

        // Atualiza o saldo uma única vez ao final
        pessoa.setSaldoDevedor(pessoa.getSaldoDevedor().add(valorTotalGeral));
        pessoaRepository.save(pessoa);

        return salvas.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VendaResponseDTO> listarPorPessoa(Long pessoaId, Boolean apenasPendentes) {
        List<Venda> vendas;
        if (apenasPendentes != null && apenasPendentes) {
            vendas = vendaRepository.findByPessoaIdAndPagoFalse(pessoaId);
        } else {
            vendas = vendaRepository.findByPessoaIdOrderByDataHoraDesc(pessoaId);
        }
        return vendas.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Exclui uma venda (estorno) e abate o valor do saldo da pessoa.
     */
    @Transactional
    public void excluirVenda(Long vendaId) {
        Venda venda = vendaRepository.findById(vendaId)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));

        Pessoa pessoa = venda.getPessoa();
        
        // Se a venda já estiver paga, talvez não devesse ser excluída ou deveria subtrair do totalPago.
        // Por simplicidade no ECC, vamos assumir estorno de pendentes.
        if (!venda.isPago()) {
            pessoa.setSaldoDevedor(pessoa.getSaldoDevedor().subtract(venda.getValorTotal()));
            pessoaRepository.save(pessoa);
        }

        vendaRepository.delete(venda);
    }

    /**
     * Marca todas as vendas pendentes de uma pessoa como pagas.
     */
    @Transactional
    public void quitarVendasPessoa(Long pessoaId) {
        List<Venda> pendentes = vendaRepository.findByPessoaIdAndPagoFalse(pessoaId);
        pendentes.forEach(v -> v.setPago(true));
        vendaRepository.saveAll(pendentes);
    }

    @Transactional(readOnly = true)
    public List<VendaResponseDTO> listarTodas() {
        return vendaRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private VendaResponseDTO toResponseDTO(Venda venda) {
        return new VendaResponseDTO(
                venda.getId(),
                venda.getPessoa().getId(),
                venda.getPessoa().getNome(),
                venda.getProduto().getNome(),
                venda.getQuantidade(),
                venda.getValorTotal(),
                venda.getDataHora(),
                venda.isPago()
        );
    }
}
