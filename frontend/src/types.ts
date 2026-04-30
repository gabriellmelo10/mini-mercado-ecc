/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Person {
  id: number;
  name: string;
  role: string; // Círculo ou Equipe
  balance: number; // Saldo devedor atual
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export enum PaymentMethod {
  CASH = 'Dinheiro',
  PIX = 'PIX',
  CARD = 'Cartão'
}

export interface Transaction {
  id: number;
  personId: number;
  productId?: number; // Se for venda de produto
  productName?: string;
  quantity?: number;
  amount: number;
  type: 'CONSUMPTION' | 'PAYMENT';
  paymentMethod?: PaymentMethod;
  timestamp: any; // Firestore Timestamp
  operatorId: string;
  paid?: boolean;
}
