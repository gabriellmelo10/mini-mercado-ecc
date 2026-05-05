-- Criação da tabela de Pessoas
CREATE TABLE pessoas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    funcao VARCHAR(255) NOT NULL,
    saldo_devedor DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    total_pago DECIMAL(19,2) NOT NULL DEFAULT 0.00
);

-- Criação da tabela de Produtos
CREATE TABLE produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(19,2) NOT NULL,
    categoria VARCHAR(255) NOT NULL
);

-- Criação da tabela de Vendas (Consumo)
CREATE TABLE vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pessoa_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_total DECIMAL(19,2) NOT NULL,
    data_hora DATETIME NOT NULL,
    pago BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Criação da tabela de Pagamentos (Histórico)
CREATE TABLE pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pessoa_id INTEGER NOT NULL,
    valor DECIMAL(19,2) NOT NULL,
    forma_pagamento VARCHAR(255) NOT NULL,
    data_hora DATETIME NOT NULL,
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id)
);
