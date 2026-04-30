package com.minimercado.ecc.backend.domain.repository;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.minimercado.ecc.backend.domain.model.Pessoa;

/**
 * Repositório para operações de banco de dados da entidade Pessoa.
 */
@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
    
    /**
     * Busca pessoas cujo nome contenha o termo pesquisado (case-insensitive).
     * RF02 - Busca Inteligente
     */
    List<Pessoa> findByNomeContainingIgnoreCase(String nome);

    /**
     * Calcula a soma total de todos os débitos quitados no evento.
     */
    @Query("SELECT SUM(p.totalPago) FROM Pessoa p")
    BigDecimal sumTotalPago();
}
