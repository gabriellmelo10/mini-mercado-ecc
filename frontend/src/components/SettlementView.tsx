/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Person, Transaction, PaymentMethod } from '../types';
import { ArrowLeft, CreditCard, Banknote, QrCode, CheckCircle2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ConfirmationModal } from './ConfirmationModal';

interface SettlementViewProps {
  person: Person;
  transactions: Transaction[];
  onBack: () => void;
  onSettle: (method: PaymentMethod, amount: number) => void;
  onDeleteTransaction: (id: number) => void;
}

export const SettlementView: React.FC<SettlementViewProps> = ({ person, transactions, onBack, onSettle, onDeleteTransaction }) => {
  const [step, setStep] = useState<'extract' | 'method' | 'success'>('extract');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [settledAmount, setSettledAmount] = useState<number>(0);

  // Estado para Confirmação de Exclusão
  const [txToDelete, setTxToDelete] = useState<{id: number, name: string} | null>(null);

  const consumptionTransactions = transactions.filter(t => t.type === 'CONSUMPTION');
  const itemsTotal = consumptionTransactions.reduce((acc, t) => acc + t.amount, 0);

  const handleSettle = () => {
    if (selectedMethod) {
      setSettledAmount(itemsTotal);
      onSettle(selectedMethod, itemsTotal);
      setStep('success');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-32">
      <ConfirmationModal 
        isOpen={!!txToDelete}
        title="Remover Lançamento"
        message={`Deseja realmente remover "${txToDelete?.name}" do extrato?`}
        confirmLabel="Remover"
        onConfirm={() => txToDelete && onDeleteTransaction(txToDelete.id)}
        onCancel={() => setTxToDelete(null)}
      />

      <AnimatePresence mode="wait">
        {step === 'extract' && (
          <motion.div key="extract" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={onBack} className="flex items-center gap-1 text-slate-500 mb-4 font-medium">
              <ArrowLeft className="w-5 h-5" /> Voltar
            </button>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{person.name}</h2>
                  <p className="text-slate-500">{person.role}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-red-500">
                    {itemsTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total a Pagar</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-700 border-b pb-2">Extrato de Consumo</h3>
                <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                  {consumptionTransactions.length > 0 ? (
                    consumptionTransactions.map(t => (
                      <div key={t.id} className="flex justify-between items-center text-sm group">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setTxToDelete({ id: t.id, name: t.productName })}
                            className="p-1.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="font-semibold text-slate-700">{t.productName}</div>
                            <div className="text-xs text-slate-400">
                              {t.quantity}x • {new Date(t.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-slate-600">
                          {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 italic">Sem consumos registrados.</div>
                  )}
                </div>
              </div>
            </div>

            <button 
              disabled={itemsTotal <= 0}
              onClick={() => setStep('method')}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95",
                itemsTotal > 0 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"
              )}
            >
              Realizar Acerto / Quitar
            </button>
          </motion.div>
        )}

        {step === 'method' && (
          <motion.div key="method" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Qual a forma de pagamento?</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { method: PaymentMethod.PIX, icon: QrCode, label: 'PIX', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
                { method: PaymentMethod.CASH, icon: Banknote, label: 'Dinheiro', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { method: PaymentMethod.CARD, icon: CreditCard, label: 'Cartão', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
              ].map(item => (
                <button
                  key={item.method}
                  onClick={() => setSelectedMethod(item.method)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all active:scale-95",
                    item.bg, item.border,
                    selectedMethod === item.method ? "ring-4 ring-blue-500/20 border-blue-500" : "opacity-80"
                  )}
                >
                  <item.icon className={cn("w-8 h-8", item.color)} />
                  <span className={cn("text-xl font-bold", item.color)}>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep('extract')} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl">
                Cancelar
              </button>
              <button 
                disabled={!selectedMethod}
                onClick={handleSettle}
                className="flex-[2] py-4 font-bold text-white bg-blue-600 rounded-2xl shadow-lg disabled:opacity-50"
              >
                Confirmar Quitação
              </button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-6">
            <div className="bg-emerald-100 text-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-800">Conta Quitada!</h2>
            <p className="text-slate-500 max-w-[200px] mx-auto">Total de {settledAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} pago por {person.name}.</p>
            <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-all">
              Voltar ao Início
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
