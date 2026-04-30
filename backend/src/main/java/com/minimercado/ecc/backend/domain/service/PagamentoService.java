package com.minimercado.ecc.backend.domain.service;

import com.minimercado.ecc.backend.api.dto.PagamentoResponseDTO;
import com.minimercado.ecc.backend.domain.model.Pagamento;
import com.minimercado.ecc.backend.domain.model.Pessoa;
import com.minimercado.ecc.backend.domain.repository.PagamentoRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PagamentoService {

    private final PagamentoRepository repository;

    public PagamentoService(PagamentoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void registrar(Pessoa pessoa, BigDecimal valor, String formaPagamento) {
        Pagamento pagamento = new Pagamento(pessoa, valor, formaPagamento);
        repository.save(pagamento);
    }

    @Transactional(readOnly = true)
    public List<PagamentoResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private PagamentoResponseDTO toResponseDTO(Pagamento p) {
        return new PagamentoResponseDTO(
                p.getId(),
                p.getPessoa().getId(),
                p.getPessoa().getNome(),
                p.getValor(),
                p.getFormaPagamento(),
                p.getDataHora()
        );
    }
}
