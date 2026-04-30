package com.minimercado.ecc.backend.domain.repository;

import com.minimercado.ecc.backend.domain.model.Produto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<ByCategoria> findByCategoria(String categoria);
    
    // Projeção simples para filtros
    interface ByCategoria {
        String getCategoria();
    }
}
