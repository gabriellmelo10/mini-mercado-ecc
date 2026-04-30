package com.minimercado.ecc.backend.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

/**
 * Entidade JPA para representar um participante (Pessoa).
 */
@Entity
@Table(name = "pessoas")
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private String funcao;

    @Column(name = "saldo_devedor", nullable = false)
    private BigDecimal saldoDevedor = BigDecimal.ZERO;

    @Column(name = "total_pago", nullable = false)
    private BigDecimal totalPago = BigDecimal.ZERO;

    // Construtores
    public Pessoa() {}

    public Pessoa(String nome, String funcao) {
        this.nome = nome;
        this.funcao = funcao;
        this.saldoDevedor = BigDecimal.ZERO;
        this.totalPago = BigDecimal.ZERO;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getFuncao() { return funcao; }
    public void setFuncao(String funcao) { this.funcao = funcao; }
    public BigDecimal getSaldoDevedor() { return saldoDevedor; }
    public void setSaldoDevedor(BigDecimal saldoDevedor) { this.saldoDevedor = saldoDevedor; }
    public BigDecimal getTotalPago() { return totalPago; }
    public void setTotalPago(BigDecimal totalPago) { this.totalPago = totalPago; }
}
