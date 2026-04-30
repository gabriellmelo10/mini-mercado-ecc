package com.minimercado.ecc.backend.domain.service;

import com.minimercado.ecc.backend.api.dto.ProdutoRequestDTO;
import com.minimercado.ecc.backend.api.dto.ProdutoResponseDTO;
import com.minimercado.ecc.backend.domain.model.Produto;
import com.minimercado.ecc.backend.domain.repository.ProdutoRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ProdutoResponseDTO cadastrar(ProdutoRequestDTO request) {
        Produto produto = new Produto(request.nome(), request.preco(), request.categoria());
        Produto salvo = repository.save(produto);
        return toResponseDTO(salvo);
    }

    /**
     * Atualiza os dados de um produto.
     */
    @Transactional
    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO request) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        
        produto.setNome(request.nome());
        produto.setPreco(request.preco());
        produto.setCategoria(request.categoria());
        
        Produto salvo = repository.save(produto);
        return toResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado");
        }
        repository.deleteById(id);
    }

    private ProdutoResponseDTO toResponseDTO(Produto produto) {
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getPreco(),
                produto.getCategoria()
        );
    }
}
