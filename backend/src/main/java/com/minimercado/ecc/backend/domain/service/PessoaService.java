package com.minimercado.ecc.backend.domain.service;

import com.minimercado.ecc.backend.api.dto.PessoaRequestDTO;
import com.minimercado.ecc.backend.api.dto.PessoaResponseDTO;
import com.minimercado.ecc.backend.domain.model.Pessoa;
import com.minimercado.ecc.backend.domain.repository.PessoaRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Serviço para gerenciar a lógica de negócio de Pessoas.
 */
@Service
public class PessoaService {

    private final PessoaRepository repository;
    private final VendaService vendaService;
    private final PagamentoService pagamentoService;

    public PessoaService(PessoaRepository repository, VendaService vendaService, PagamentoService pagamentoService) {
        this.repository = repository;
        this.vendaService = vendaService;
        this.pagamentoService = pagamentoService;
    }

    /**
     * Cadastra uma nova pessoa.
     * RF01 - Cadastro Rápido de Pessoas
     */
    @Transactional
    public PessoaResponseDTO cadastrar(PessoaRequestDTO request) {
        Pessoa pessoa = new Pessoa(request.nome(), request.funcao());
        Pessoa salva = repository.save(pessoa);
        return toResponseDTO(salva);
    }

    /**
     * Atualiza os dados de uma pessoa.
     */
    @Transactional
    public PessoaResponseDTO atualizar(Long id, PessoaRequestDTO request) {
        Pessoa pessoa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));
        
        pessoa.setNome(request.nome());
        pessoa.setFuncao(request.funcao());
        
        Pessoa salva = repository.save(pessoa);
        return toResponseDTO(salva);
    }

    /**
     * Lista todas as pessoas ou filtra por nome.
     * RF02 - Busca Inteligente
     */
    @Transactional(readOnly = true)
    public List<PessoaResponseDTO> listar(String nome) {
        List<Pessoa> pessoas;
        if (nome != null && !nome.isBlank()) {
            pessoas = repository.findByNomeContainingIgnoreCase(nome);
        } else {
            pessoas = repository.findAll();
        }
        
        return pessoas.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BigDecimal obterTotalGlobalQuitado() {
        BigDecimal total = repository.sumTotalPago();
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Quita o débito de uma pessoa, zerando seu saldo.
     * RF06 - Quitação de Débito
     */
    @Transactional
    public PessoaResponseDTO quitarDebito(Long id, String formaPagamento) {
        Pessoa pessoa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));
        
        BigDecimal valorPago = pessoa.getSaldoDevedor();

        // 1. Marcar todas as vendas como pagas
        vendaService.quitarVendasPessoa(id);

        // 2. Registrar o pagamento histórico
        pagamentoService.registrar(pessoa, valorPago, formaPagamento != null ? formaPagamento : "Dinheiro");

        // 3. Acumular o saldo atual no total pago e zerar o saldo devedor
        pessoa.setTotalPago(pessoa.getTotalPago().add(valorPago));
        pessoa.setSaldoDevedor(BigDecimal.ZERO);
        
        Pessoa salva = repository.save(pessoa);
        return toResponseDTO(salva);
    }

    /**
     * Exclui uma pessoa do sistema.
     */
    @Transactional
    public void excluir(Long id) {
        Pessoa pessoa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));
        
        if (pessoa.getSaldoDevedor().compareTo(BigDecimal.ZERO) > 0) {
            throw new RuntimeException("Não é possível excluir uma pessoa com saldo devedor pendente. Quite a conta primeiro.");
        }
        
        repository.delete(pessoa);
    }

    /**
     * Mapeamento manual de Entidade para DTO (Response).
     */
    private PessoaResponseDTO toResponseDTO(Pessoa pessoa) {
        return new PessoaResponseDTO(
                pessoa.getId(),
                pessoa.getNome(),
                pessoa.getFuncao(),
                pessoa.getSaldoDevedor(),
                pessoa.getTotalPago()
        );
    }
}
