package com.minimercado.ecc.backend.api.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * DTO para registrar múltiplos lançamentos de consumo de uma vez.
 */
public record VendaBulkRequestDTO(
    @NotNull(message = "A pessoa é obrigatória")
    Long pessoaId,

    @NotEmpty(message = "A lista de itens não pode estar vazia")
    List<ItemVendaDTO> itens
) {
    public record ItemVendaDTO(
        @NotNull(message = "O produto é obrigatório")
        Long produtoId,

        @NotNull(message = "A quantidade é obrigatória")
        Integer quantidade
    ) {}
}
