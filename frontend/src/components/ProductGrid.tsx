/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductGridProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {products.map((product) => (
        <motion.button
          key={product.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(product)}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col text-left gap-1 active:bg-slate-50 transition-colors h-full"
        >
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {product.category}
          </div>
          <div className="font-semibold text-slate-800 line-clamp-2 flex-grow">
            {product.name}
          </div>
          <div className="text-blue-600 font-bold mt-1">
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </motion.button>
      ))}
    </div>
  );
};
