package com.minimercado.ecc.backend.domain.repository;

import com.minimercado.ecc.backend.domain.model.Venda;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    
    /**
     * Busca todos os lançamentos de uma pessoa específica.
     * RF05 - Extrato Individual
     */
    List<Venda> findByPessoaIdOrderByDataHoraDesc(Long pessoaId);

    List<Venda> findByPessoaIdAndPagoFalse(Long pessoaId);
}
