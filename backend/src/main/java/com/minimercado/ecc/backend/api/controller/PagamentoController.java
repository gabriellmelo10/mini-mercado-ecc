package com.minimercado.ecc.backend.api.controller;

import com.minimercado.ecc.backend.api.dto.PagamentoResponseDTO;
import com.minimercado.ecc.backend.domain.service.PagamentoService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pagamentos")
@CrossOrigin(origins = "*")
public class PagamentoController {

    private final PagamentoService service;

    public PagamentoController(PagamentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<PagamentoResponseDTO> listarTodos() {
        return service.listarTodos();
    }
}
