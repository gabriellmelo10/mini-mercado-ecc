package com.minimercado.ecc.backend.api.dto;

import java.math.BigDecimal;

/**
 * Record para retorno de dados de Pessoa.
 */
public record PessoaResponseDTO(
    Long id,
    String nome,
    String funcao,
    BigDecimal saldoDevedor,
    BigDecimal totalPago
) {}
