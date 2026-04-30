package com.minimercado.ecc.backend.api.controller;

import com.minimercado.ecc.backend.api.dto.PessoaRequestDTO;
import com.minimercado.ecc.backend.api.dto.PessoaResponseDTO;
import com.minimercado.ecc.backend.domain.service.PessoaService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller REST para operações com Pessoas.
 */
@RestController
@RequestMapping("/api/pessoas")
@CrossOrigin(origins = "*") // Simplificado para dev. Em prod, restringir.
public class PessoaController {

    private final PessoaService service;

    public PessoaController(PessoaService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PessoaResponseDTO cadastrar(@RequestBody @Valid PessoaRequestDTO request) {
        return service.cadastrar(request);
    }

    @PutMapping("/{id}")
    public PessoaResponseDTO atualizar(@PathVariable Long id, @RequestBody @Valid PessoaRequestDTO request) {
        return service.atualizar(id, request);
    }

    @GetMapping
    public List<PessoaResponseDTO> listar(@RequestParam(required = false) String nome) {
        return service.listar(nome);
    }

    @PostMapping("/{id}/quitar")
    public PessoaResponseDTO quitar(@PathVariable Long id, @RequestParam(required = false) String formaPagamento) {
        return service.quitarDebito(id, formaPagamento);
    }

    @GetMapping("/total-quitado")
    public BigDecimal obterTotalQuitado() {
        return service.obterTotalGlobalQuitado();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
