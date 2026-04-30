package com.minimercado.ecc.backend.api.dto;

import java.math.BigDecimal;

/**
 * Record para retorno de dados de Produto.
 */
public record ProdutoResponseDTO(
    Long id,
    String nome,
    BigDecimal preco,
    String categoria
) {}
