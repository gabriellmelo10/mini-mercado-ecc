package com.minimercado.ecc.backend.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTO para registrar um novo lançamento de consumo.
 */
public record VendaRequestDTO(
    @NotNull(message = "A pessoa é obrigatória")
    Long pessoaId,

    @NotNull(message = "O produto é obrigatório")
    Long produtoId,

    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser maior que zero")
    Integer quantidade
) {}
