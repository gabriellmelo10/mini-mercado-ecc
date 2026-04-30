/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { Trash2, ShoppingCart } from 'lucide-react';

interface CartProps {
  personName: string;
  items: { product: Product; quantity: number }[];
  onRemove: (productId: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Cart: React.FC<CartProps> = ({ personName, items, onRemove, onConfirm, onCancel }) => {
  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-24 p-4 z-30 pointer-events-none">
      <div className="max-w-xl mx-auto bg-blue-600 text-white rounded-3xl shadow-2xl p-5 pointer-events-auto border border-blue-500 animate-in fade-in slide-in-from-bottom-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold">Lançar para: <span className="text-blue-100 underline decoration-blue-300 underline-offset-4">{personName}</span></h3>
          </div>
          <div className="text-xl font-black">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>

        <div className="max-h-40 overflow-y-auto mb-4 space-y-2 pr-2 custom-scrollbar">
          {items.map(item => (
            <div key={item.product.id} className="flex justify-between items-center bg-blue-700/50 rounded-xl p-2 px-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-200">{item.quantity}x</span>
                <span className="text-sm font-medium">{item.product.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">{(item.product.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                <button onClick={() => onRemove(item.product.id)} className="p-1 hover:text-red-300 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 bg-blue-700/50 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-[2] bg-white text-blue-600 font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all text-center"
          >
            Confirmar Lançamento
          </button>
        </div>
      </div>
    </div>
  );
};
