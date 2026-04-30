package com.minimercado.ecc.backend.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para retorno de dados de um pagamento.
 */
public record PagamentoResponseDTO(
    Long id,
    Long pessoaId,
    String nomePessoa,
    BigDecimal valor,
    String formaPagamento,
    LocalDateTime dataHora
) {}
