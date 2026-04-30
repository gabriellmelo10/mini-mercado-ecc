package com.minimercado.ecc.backend.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para retorno de dados de um lançamento.
 */
public record VendaResponseDTO(
    Long id,
    Long pessoaId,
    String nomePessoa,
    String nomeProduto,
    Integer quantidade,
    BigDecimal valorTotal,
    LocalDateTime dataHora,
    boolean pago
) {}
