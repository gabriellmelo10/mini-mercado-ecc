package com.minimercado.ecc.backend.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Record para recebimento de dados de criação/atualização de Pessoa.
 * RF01 - Cadastro Rápido de Pessoas
 */
public record PessoaRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    String nome,

    @NotBlank(message = "A função/círculo é obrigatória")
    String funcao
) {}
