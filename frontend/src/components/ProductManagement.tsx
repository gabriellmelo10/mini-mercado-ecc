/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { Store, Plus, Search, Trash2, Tag, Pencil, X, Check } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { ConfirmationModal } from './ConfirmationModal';

interface ProductManagementProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => Promise<void>;
  onUpdate: (id: number, product: Omit<Product, 'id'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);

  // Estados para Edição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Estado para Confirmação de Exclusão
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditCategory(product.category);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: number) => {
    if (editName && editPrice) {
      await onUpdate(id, {
        name: editName,
        price: parseFloat(editPrice),
        category: editCategory
      });
      setEditingId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ConfirmationModal 
        isOpen={!!productToDelete}
        title="Excluir Produto"
        message={`Deseja realmente excluir "${productToDelete?.name}"? Esta ação não pode ser desfeita e pode afetar históricos.`}
        confirmLabel="Excluir"
        onConfirm={() => productToDelete && onDelete(productToDelete.id)}
        onCancel={() => setProductToDelete(null)}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800">Gestão de Produtos</h2>
        <span className="bg-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-600">{products.length}</span>
      </div>

      {/* Busca e Botão Novo */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar produto ou categoria..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-blue-600 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Formulário de Cadastro */}
      {showAdd && (
        <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-bold text-blue-800 flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4" /> Novo Produto
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <input 
              type="text" 
              placeholder="Nome do Produto" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Preço (ex: 5.00)" 
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-1/2 bg-white border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
              />
              <select 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-1/2 bg-white border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={async () => {
                if (newName && newPrice) {
                  await onAdd({ name: newName, price: parseFloat(newPrice), category: newCategory });
                  setNewName('');
                  setNewPrice('');
                  setShowAdd(false);
                }
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl shadow-lg active:bg-blue-700 transition-all"
            >
              Confirmar Cadastro
            </button>
          </div>
        </div>
      )}

      {/* Lista de Produtos */}
      <div className="space-y-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group">
            {editingId === product.id ? (
              /* MODO EDIÇÃO */
              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Pencil className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Editando Item</span>
                </div>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-semibold"
                  placeholder="Nome do Produto"
                />
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="Preço"
                  />
                  <select 
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={handleCancelEdit}
                    className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                  <button 
                    onClick={() => handleSaveEdit(product.id)}
                    className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-md active:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Salvar
                  </button>
                </div>
              </div>
            ) : (
              /* MODO VISUALIZAÇÃO */
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{product.name}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {product.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <div className="font-black text-blue-600 text-lg">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleStartEdit(product)}
                      className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setProductToDelete(product)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-slate-400 italic bg-white rounded-3xl border border-dashed border-slate-300">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
    </div>
  );
};
