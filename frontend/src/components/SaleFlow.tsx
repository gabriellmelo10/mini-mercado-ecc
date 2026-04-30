/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Person, Product } from '../types';
import { PeopleList } from './PeopleList';
import { ProductGrid } from './ProductGrid';
import { Cart } from './Cart';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SaleFlowProps {
  people: Person[];
  products: Product[];
  onAddPerson: (name: string, role: string) => void;
  onSaleComplete: (personId: number, items: { product: Product; quantity: number }[]) => void;
}

export const SaleFlow: React.FC<SaleFlowProps> = ({ people, products, onAddPerson, onSaleComplete }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);

  const handleSelectProduct = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleConfirmSale = () => {
    if (selectedPerson && cartItems.length > 0) {
      onSaleComplete(selectedPerson.id, cartItems);
      setSelectedPerson(null);
      setCartItems([]);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {!selectedPerson ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <h2 className="text-xl font-bold">Quem está comprando?</h2>
            </div>
            <PeopleList 
              people={people} 
              onSelect={setSelectedPerson} 
              onAdd={onAddPerson} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setSelectedPerson(null);
                  setCartItems([]);
                }}
                className="flex items-center gap-1 text-slate-500 font-medium hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Voltar
              </button>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">{selectedPerson.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <h2 className="text-xl font-bold">O que {selectedPerson.name} ({selectedPerson.role}) consumiram?</h2>
            </div>

            <ProductGrid products={products} onSelect={handleSelectProduct} />
            
            <Cart 
              personName={selectedPerson.name}
              items={cartItems}
              onRemove={handleRemoveItem}
              onConfirm={handleConfirmSale}
              onCancel={() => {
                setSelectedPerson(null);
                setCartItems([]);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
