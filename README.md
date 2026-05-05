# 🛒 Mini-Mercado ECC

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg)](https://www.sqlite.org/)

O **Mini-Mercado ECC** é um Progressive Web App (PWA) desenvolvido para otimizar a gestão de consumo e vendas em eventos. Focado em simplicidade e agilidade, o sistema permite o registro de vendas "fiadas" e o acerto de contas individual de forma intuitiva, garantindo integridade dos dados mesmo em condições de rede instáveis.

---

## 🚀 Funcionalidades

- **👥 Gestão de Participantes:** Cadastro rápido e busca inteligente em tempo real.
- **🛍️ Catálogo Touch-Friendly:** Grade de produtos com botões amplos para lançamento rápido.
- **💳 Registro de Consumo (Fiado):** Lançamento de itens no saldo devedor sem necessidade de pagamento imediato.
- **📄 Extrato Detalhado:** Visualização de todo o histórico de consumo por pessoa para conferência.
- **💰 Quitação de Débitos:** Suporte a múltiplas formas de pagamento (Dinheiro, PIX, Cartão).
- **📡 PWA (Offline-First):** Funciona como um aplicativo nativo e mantém cache básico para resiliência de rede.
- **📊 Resumo do Evento:** Dashboard simples com total de vendas, valores recebidos e pendências.

---

## 🏗️ Arquitetura e Tech Stack

O projeto segue uma arquitetura desacoplada, priorizando a estabilidade e a facilidade de manutenção.

### **Backend**
- **Java 17 (LTS):** Uso de Records e APIs modernas.
- **Spring Boot 3:** Framework robusto para API REST e segurança.
- **Spring Data JPA:** Abstração de persistência.
- **SQLite:** Banco de dados local e embarcado, ideal para deploys simplificados e funcionamento offline.

### **Frontend**
- **React 19 + TypeScript:** Interface reativa e tipagem estrita.
- **Vite:** Build tool ultra-rápida.
- **Tailwind CSS:** Estilização baseada em utilitários para performance e padronização.
- **Lucide React:** Conjunto de ícones consistentes.
- **Motion:** Animações fluidas para feedback do usuário.

---

## 🛠️ Como Executar

### **1. Via Docker (Recomendado)**
Certifique-se de ter o [Docker](https://www.docker.com/) e o [Docker Compose](https://docs.docker.com/compose/) instalados.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/mini-mercado-ecc.git
cd mini-mercado-ecc

# Suba os containers
docker-compose up -d
```
A aplicação estará disponível em:
- **Frontend:** `http://localhost:3000`
- **Backend (API):** `http://localhost:8080`

### **2. Desenvolvimento Local**

#### **Backend**
```bash
cd backend
./mvnw spring-boot:run
```

#### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Configurações (Variáveis de Ambiente)

O sistema utiliza variáveis de ambiente para se adaptar a diferentes cenários (Desenvolvimento vs. Produção).

### **Backend (Spring Boot)**

| Variável | Descrição | Padrão (Local) |
| :--- | :--- | :--- |
| `SPRING_JPA_SHOW_SQL` | Habilita a exibição do SQL no console. | `false` |
| `SPRING_JPA_FORMAT_SQL` | Formata o SQL exibido para melhor leitura. | `false` |
| `SPRING_JPA_DDL_AUTO` | Estratégia de geração de DDL (ex: validate, update). | `validate` |

### **Como configurar**

> [!NOTE]
> Este passo é **opcional** e serve para logar os comandos DDL/SQL no console ou habilitar a atualização automática do banco em ambiente de desenvolvimento.

Para configurar essas variáveis, crie um arquivo `.env` na raiz do projeto:

1. Na raiz do projeto, crie o arquivo:
   ```bash
   touch .env
   ```
2. Adicione as configurações desejadas (exemplo para desenvolvimento):
   ```env
   SPRING_JPA_SHOW_SQL=true
   SPRING_JPA_FORMAT_SQL=true
   SPRING_JPA_DDL_AUTO=update
   ```

---

## 📂 Estrutura do Projeto

```text
├── backend/            # API REST Spring Boot
├── frontend/           # Aplicação PWA React
├── data/               # Volume compartilhado para o SQLite
└── docker-compose.yml  # Orquestração dos serviços
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir **Issues** ou enviar **Pull Requests**.

1. Faça um Fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`).
3. Faça o commit das suas alterações (`git commit -m 'Add: Nova Feature'`).
4. Envie para o GitHub (`git push origin feature/NovaFeature`).
5. Abra um Pull Request.

---

## 📄 Licença

Este projeto está sob a licença **Apache-2.0**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
<p align="center">
  Desenvolvido com ❤️ para a comunidade do ECC.
</p>
