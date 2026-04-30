package com.minimercado.ecc.backend.domain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidade para registrar um pagamento (quitação de débito).
 */
@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "pessoa_id")
    private Pessoa pessoa;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(name = "forma_pagamento", nullable = false)
    private String formaPagamento;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    public Pagamento() {}

    public Pagamento(Pessoa pessoa, BigDecimal valor, String formaPagamento) {
        this.pessoa = pessoa;
        this.valor = valor;
        this.formaPagamento = formaPagamento;
        this.dataHora = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Pessoa getPessoa() { return pessoa; }
    public void setPessoa(Pessoa pessoa) { this.pessoa = pessoa; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
}
