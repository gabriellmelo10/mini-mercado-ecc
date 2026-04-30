package com.minimercado.ecc.backend.api.controller;

import com.minimercado.ecc.backend.api.dto.VendaBulkRequestDTO;
import com.minimercado.ecc.backend.api.dto.VendaRequestDTO;
import com.minimercado.ecc.backend.api.dto.VendaResponseDTO;
import com.minimercado.ecc.backend.domain.service.VendaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "*")
public class VendaController {

    private final VendaService service;

    public VendaController(VendaService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VendaResponseDTO registrar(@RequestBody @Valid VendaRequestDTO request) {
        return service.registrar(request);
    }

    @PostMapping("/bulk")
    @ResponseStatus(HttpStatus.CREATED)
    public List<VendaResponseDTO> registrarEmLote(@RequestBody @Valid VendaBulkRequestDTO request) {
        return service.registrarEmLote(request);
    }

    @GetMapping
    public List<VendaResponseDTO> listar() {
        return service.listarTodas();
    }

    @GetMapping("/pessoa/{pessoaId}")
    public List<VendaResponseDTO> listarPorPessoa(
            @PathVariable Long pessoaId,
            @RequestParam(required = false, defaultValue = "false") Boolean apenasPendentes) {
        return service.listarPorPessoa(pessoaId, apenasPendentes);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluirVenda(id);
    }
}
