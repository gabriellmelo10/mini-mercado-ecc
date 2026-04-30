/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Person, Product, Transaction } from '../types';

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  if (response.status === 204) return {} as T;
  return response.json();
}

export const apiService = {
  // Pessoas
  async getPeople(): Promise<Person[]> {
    const data = await fetch(`${API_BASE_URL}/pessoas`).then(handleResponse<any[]>);
    return data.map(p => ({
      id: p.id,
      name: p.nome,
      role: p.funcao,
      balance: p.saldoDevedor,
    }));
  },

  async addPerson(person: Omit<Person, 'id' | 'balance'>): Promise<Person> {
    const data = await fetch(`${API_BASE_URL}/pessoas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: person.name,
        funcao: person.role,
      }),
    }).then(handleResponse<any>);
    
    return {
      id: data.id,
      name: data.nome,
      role: data.funcao,
      balance: data.saldoDevedor,
    };
  },

  async updatePerson(id: number, person: Omit<Person, 'id' | 'balance'>): Promise<Person> {
    const data = await fetch(`${API_BASE_URL}/pessoas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: person.name,
        funcao: person.role,
      }),
    }).then(handleResponse<any>);
    
    return {
      id: data.id,
      name: data.nome,
      role: data.funcao,
      balance: data.saldoDevedor,
    };
  },

  async deletePerson(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/pessoas/${id}`, {
      method: 'DELETE',
    }).then(handleResponse);
  },

  async quitarDebito(personId: number, formaPagamento?: string): Promise<Person> {
    const url = new URL(`${API_BASE_URL}/pessoas/${personId}/quitar`);
    if (formaPagamento) url.searchParams.append('formaPagamento', formaPagamento);

    const data = await fetch(url.toString(), {
      method: 'POST',
    }).then(handleResponse<any>);
    
    return {
      id: data.id,
      name: data.nome,
      role: data.funcao,
      balance: data.saldoDevedor,
    };
  },

  // Produtos
  async getProducts(): Promise<Product[]> {
    const data = await fetch(`${API_BASE_URL}/produtos`).then(handleResponse<any[]>);
    return data.map(p => ({
      id: p.id,
      name: p.nome,
      price: p.preco,
      category: p.categoria || 'Diversos',
    }));
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const data = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: product.name,
        preco: product.price,
        categoria: product.category,
      }),
    }).then(handleResponse<any>);
    
    return {
      id: data.id,
      name: data.nome,
      price: data.preco,
      category: data.categoria,
    };
  },

  async updateProduct(id: number, product: Omit<Product, 'id'>): Promise<Product> {
    const data = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: product.name,
        preco: product.price,
        categoria: product.category,
      }),
    }).then(handleResponse<any>);
    
    return {
      id: data.id,
      name: data.nome,
      price: data.preco,
      category: data.categoria,
    };
  },

  async deleteProduct(productId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/produtos/${productId}`, {
      method: 'DELETE',
    }).then(handleResponse);
  },

  // Vendas / Transações
  async getTransactions(personId?: number, apenasPendentes?: boolean): Promise<Transaction[]> {
    let url = personId 
      ? `${API_BASE_URL}/vendas/pessoa/${personId}`
      : `${API_BASE_URL}/vendas`;
    
    const params = new URLSearchParams();
    if (personId && apenasPendentes) {
        params.append('apenasPendentes', 'true');
    }
    
    const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;
    
    try {
        const [vendasData, pagamentosData] = await Promise.all([
            fetch(finalUrl).then(handleResponse<any[]>),
            personId ? Promise.resolve([]) : fetch(`${API_BASE_URL}/pagamentos`).then(handleResponse<any[]>)
        ]);

        const consumptions: Transaction[] = vendasData.map(v => ({
          id: v.id,
          personId: v.pessoaId || 0, 
          productName: v.nomeProduto,
          quantity: v.quantidade,
          amount: v.valorTotal,
          type: 'CONSUMPTION',
          timestamp: v.dataHora,
          operatorId: 'system',
          paid: v.pago,
        }));

        const payments: Transaction[] = pagamentosData.map(p => ({
            id: p.id,
            personId: p.pessoaId,
            amount: p.valor,
            type: 'PAYMENT',
            paymentMethod: p.formaPagamento,
            timestamp: p.dataHora,
            operatorId: 'system'
        }));

        return [...consumptions, ...payments].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    } catch (e) {
        console.warn('Failed to fetch transactions', e);
        return [];
    }
  },

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<any> {
    if (transaction.type === 'PAYMENT') {
        return this.quitarDebito(transaction.personId, transaction.paymentMethod);
    }

    return fetch(`${API_BASE_URL}/vendas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pessoaId: transaction.personId,
        produtoId: transaction.productId,
        quantidade: transaction.quantity || 1,
      }),
    }).then(handleResponse);
  },

  async bulkCreateTransactions(transactions: Omit<Transaction, 'id'>[]): Promise<any[]> {
    if (transactions.length === 0) return [];
    
    const personId = transactions[0].personId;
    const body = {
      pessoaId: personId,
      itens: transactions.map(tx => ({
        produtoId: tx.productId,
        quantidade: tx.quantity || 1
      }))
    };

    return fetch(`${API_BASE_URL}/vendas/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse);
  },

  async deleteTransaction(transactionId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/vendas/${transactionId}`, {
      method: 'DELETE',
    }).then(handleResponse);
  }
};
