/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Person } from '../types';
import { User, Plus, Search, Trash2, Pencil, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';

interface PeopleListProps {
  people: Person[];
  onSelect: (person: Person) => void;
  onAdd?: (name: string, role: string) => Promise<void>;
  onUpdate?: (id: number, name: string, role: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

export const PeopleList: React.FC<PeopleListProps> = ({ people, onSelect, onAdd, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  // Estados para Edição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  // Estado para Confirmação de Exclusão
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

  const handleStartEdit = (e: React.MouseEvent, person: Person) => {
    e.stopPropagation(); // Evita selecionar a pessoa para acerto
    setEditingId(person.id);
    setEditName(person.name);
    setEditRole(person.role);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleSaveEdit = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (editName && onUpdate) {
      await onUpdate(id, editName, editRole);
      setEditingId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, person: Person) => {
    e.stopPropagation();
    if (!onDelete) return;

    if (person.balance > 0) {
      toast.error(`Não podemos excluir ${person.name} ainda. Existe um saldo pendente de ${person.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`);
      return;
    }
    
    setPersonToDelete(person);
  };

  const filteredPeople = people.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <ConfirmationModal 
        isOpen={!!personToDelete}
        title="Remover Participante"
        message={`Deseja realmente remover o cadastro de ${personToDelete?.name}? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        onConfirm={() => personToDelete && onDelete?.(personToDelete.id)}
        onCancel={() => setPersonToDelete(null)}
      />

      {/* Search & Add Header */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou círculo..." 
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
        {onAdd && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-blue-600 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Add New Persona Form */}
      {showAdd && onAdd && (
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-bold text-blue-800 mb-3 text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Cadastrar Nova Pessoa
          </h3>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Nome Completo" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              placeholder="Função (ex: Círculo Amarelo, Equipe)" 
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={async () => {
                if (newName && onAdd) {
                  await onAdd(newName, newRole);
                  setNewName('');
                  setNewRole('');
                  setShowAdd(false);
                }
              }}
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md active:bg-blue-700 transition-colors"
            >
              Confirmar Cadastro
            </button>
          </div>
        </div>
      )}

      {/* People List */}
      <div className="space-y-2">
        {filteredPeople.map(person => (
          <div key={person.id} className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {editingId === person.id ? (
              <div className="p-4 bg-blue-50 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-blue-600">
                  <Pencil className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Editando Cadastro</span>
                </div>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome"
                />
                <input 
                  type="text" 
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Função"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleCancelEdit}
                    className="flex-1 py-2 font-bold text-slate-500 bg-white border border-slate-200 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={(e) => handleSaveEdit(e, person.id)}
                    className="flex-1 py-2 font-bold text-white bg-blue-600 rounded-lg shadow-sm"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onSelect(person)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all active:scale-[0.99] text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{person.name}</div>
                    <div className="text-xs text-slate-500">{person.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={cn(
                      "font-bold",
                      person.balance > 0 ? "text-red-500" : "text-emerald-500"
                    )}>
                      {person.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter text-right">Saldo</div>
                  </div>
                  <div className="flex gap-1">
                    {onUpdate && (
                      <button 
                        onClick={(e) => handleStartEdit(e, person)}
                        className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={(e) => handleDelete(e, person)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </button>
            )}
          </div>
        ))}
        {filteredPeople.length === 0 && (
          <div className="text-center py-10 text-slate-400 italic bg-white rounded-3xl border border-dashed border-slate-300">
            Nenhuma pessoa encontrada.
          </div>
        )}
      </div>
    </div>
  );
};
