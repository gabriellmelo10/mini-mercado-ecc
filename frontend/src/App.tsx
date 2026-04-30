/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Users, History, Store, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Person, Product, Transaction, PaymentMethod } from './types';
import { SaleFlow } from './components/SaleFlow';
import { PeopleList } from './components/PeopleList';
import { ProductManagement } from './components/ProductManagement';
import { SettlementView } from './components/SettlementView';
import { apiService } from './services/apiService';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sales' | 'people' | 'products' | 'history'>('sales');
  const [people, setPeople] = useState<Person[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPersonForSettlement, setSelectedPersonForSettlement] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [peopleData, txData, productsData] = await Promise.all([
        apiService.getPeople(),
        apiService.getTransactions(),
        apiService.getProducts()
      ]);
      setPeople(peopleData);
      setTransactions(txData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const totalSales = transactions.filter(t => t.type === 'CONSUMPTION').reduce((acc, t) => acc + t.amount, 0);
    const totalPayments = transactions.filter(t => t.type === 'PAYMENT').reduce((acc, t) => acc + t.amount, 0);
    const totalDebt = people.reduce((acc, p) => acc + p.balance, 0);
    return { totalSales, totalPayments, totalDebt };
  }, [transactions, people]);

  const handleSaleComplete = async (personId: number, items: { product: Product; quantity: number }[]) => {
    const newTxPayloads: Omit<Transaction, 'id'>[] = items.map(item => ({
      personId,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      amount: item.product.price * item.quantity,
      type: 'CONSUMPTION',
      timestamp: new Date().toISOString(),
      operatorId: 'voluntario_1'
    }));

    try {
      await apiService.bulkCreateTransactions(newTxPayloads);
      await loadData(); // Recarregar para garantir sincronia
      toast.success('Venda registrada com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar venda:', err);
      toast.error('Erro ao salvar venda.');
    }
  };

  const handleAddPerson = async (name: string, role: string) => {
    try {
      await apiService.addPerson({ name, role });
      await loadData();
      toast.success('Participante cadastrado!');
    } catch (err) {
      console.error('Erro ao adicionar pessoa:', err);
      toast.error('Erro ao cadastrar participante.');
    }
  };

  const handleUpdatePerson = async (id: number, name: string, role: string) => {
    try {
      await apiService.updatePerson(id, { name, role });
      await loadData();
      toast.success('Cadastro atualizado!');
    } catch (err) {
      console.error('Erro ao atualizar pessoa:', err);
      toast.error('Erro ao atualizar cadastro.');
    }
  };

  const handleDeletePerson = async (id: number) => {
    try {
      await apiService.deletePerson(id);
      await loadData();
      toast.success('Participante removido.');
    } catch (err) {
      console.error('Erro ao excluir pessoa:', err);
      toast.error('Não foi possível excluir. Verifique o histórico.');
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await apiService.addProduct(product);
      await loadData();
      toast.success('Produto adicionado!');
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      toast.error('Erro ao adicionar produto.');
    }
  };

  const handleUpdateProduct = async (id: number, product: Omit<Product, 'id'>) => {
    try {
      await apiService.updateProduct(id, product);
      await loadData();
      toast.success('Produto atualizado!');
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      toast.error('Erro ao atualizar produto.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await apiService.deleteProduct(productId);
      await loadData();
      toast.success('Produto excluído.');
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      toast.error('Erro ao excluir produto. Verifique vendas vinculadas.');
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      await apiService.deleteTransaction(transactionId);
      
      // Carregar os dados atualizados das pessoas e transações
      const [updatedPeople, updatedTransactions] = await Promise.all([
        apiService.getPeople(),
        apiService.getTransactions()
      ]);
      
      setPeople(updatedPeople);
      setTransactions(updatedTransactions);
      
      // Atualizar a pessoa selecionada para refletir o novo saldo no SettlementView
      if (selectedPersonForSettlement) {
        const found = updatedPeople.find(p => p.id === selectedPersonForSettlement.id);
        if (found) {
          setSelectedPersonForSettlement(found);
        }
      }
      toast.success('Lançamento removido.');
    } catch (err) {
      console.error('Erro ao deletar transação:', err);
      toast.error('Não foi possível excluir o item.');
    }
  };

  const handleSettleDebt = async (method: PaymentMethod, amount: number) => {
    if (!selectedPersonForSettlement) return;

    try {
      await apiService.createTransaction({
        personId: selectedPersonForSettlement.id,
        amount: amount,
        type: 'PAYMENT',
        paymentMethod: method,
        timestamp: new Date().toISOString(),
        operatorId: 'voluntario_1'
      });
      await loadData();
      // Atualizar local para refletir no SettlementView
      const updatedPerson = await apiService.getPeople().then(pp => pp.find(p => p.id === selectedPersonForSettlement.id));
      if (updatedPerson) setSelectedPersonForSettlement(updatedPerson);
      toast.success('Pagamento registrado!');
    } catch (err) {
      console.error('Erro ao quitar débito:', err);
      toast.error('Erro ao registrar pagamento.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-sans transition-all">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Store className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase text-slate-800">
              MINI-MERCADO <span className="text-blue-600">ECC</span>
            </h1>
          </div>
          <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Caixa Aberto</span>
          </div>
        </div>
      </header>

      {/* Content Rendering */}
      <main className="max-w-7xl mx-auto min-h-[60vh] relative p-2 sm:p-4">
        {loading && (
          <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] z-30 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
        <AnimatePresence mode="wait">
          {selectedPersonForSettlement ? (
            <SettlementView 
              person={selectedPersonForSettlement}
              transactions={transactions.filter(t => t.personId === selectedPersonForSettlement.id && t.type === 'CONSUMPTION' && !t.paid)}
              onBack={() => setSelectedPersonForSettlement(null)}
              onSettle={handleSettleDebt}
              onDeleteTransaction={handleDeleteTransaction}
            />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'sales' && (
                <SaleFlow
                  people={people}
                  products={products}
                  onAddPerson={handleAddPerson}
                  onSaleComplete={handleSaleComplete}
                />
              )}
              {activeTab === 'people' && (
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800">Participantes</h2>
                    <span className="bg-slate-200 px-2 py-1 rounded text-xs font-bold text-slate-600">{people.length}</span>
                  </div>
                  <PeopleList 
                    people={people} 
                    onSelect={setSelectedPersonForSettlement} 
                    onAdd={handleAddPerson} 
                    onUpdate={handleUpdatePerson}
                    onDelete={handleDeletePerson}
                  />
                </div>
              )}

              {activeTab === 'products' && (
                <div className="p-4">
                  <ProductManagement 
                    products={products} 
                    onAdd={handleAddProduct} 
                    onUpdate={handleUpdateProduct}
                    onDelete={handleDeleteProduct} 
                  />
                </div>
              )}

              {activeTab === 'history' && (
                <div className="p-4 space-y-6">
                  <h2 className="text-2xl font-black text-slate-800">Resumo do Evento</h2>
                  
                  {/* Dashboard Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vendas Totais</div>
                      <div className="text-2xl font-black text-slate-800">{stats.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </div>
                    <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 shadow-sm">
                      <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Total Recebido</div>
                      <div className="text-2xl font-black text-emerald-700">{stats.totalPayments.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </div>
                    <div className="bg-red-50 p-5 rounded-3xl border border-red-100 shadow-sm text-right">
                      <div className="text-[10px] font-bold text-red-600 uppercase mb-1">Total Pendente (Fiado)</div>
                      <div className="text-2xl font-black text-red-700">{stats.totalDebt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-700 pt-4 border-t border-slate-200">Últimos Lançamentos</h3>
                  <div className="space-y-2">
                    {transactions.slice(0).reverse().map(t => {
                      const person = people.find(p => p.id === t.personId);
                      return (
                        <div key={t.id} className="bg-white p-3 rounded-2xl border border-slate-100 flex justify-between items-center text-sm shadow-sm">
                          <div className="flex gap-3 items-center">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              t.type === 'CONSUMPTION' ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                            )}>
                              {t.type === 'CONSUMPTION' ? <ShoppingBag className="w-4 h-4" /> : <History className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-bold">
                                {t.type === 'CONSUMPTION' ? t.productName : `Pagamento (${t.paymentMethod})`}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {person ? `${person.name} (${person.role})` : 'Ex-participante'} • {new Date(t.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <div className={cn(
                            "font-black text-base",
                            t.type === 'CONSUMPTION' ? "text-slate-700" : "text-emerald-600"
                          )}>
                            {t.type === 'CONSUMPTION' ? '-' : '+'}{t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        </div>
                      );
                    })}
                    {transactions.length === 0 && (
                      <div className="text-center py-10 text-slate-400 italic">Nenhuma transação registrada ainda hoje.</div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-4 pb-8 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {[
            { id: 'sales', icon: ShoppingBag, label: 'Vendas' },
            { id: 'people', icon: Users, label: 'Participantes' },
            { id: 'products', icon: Store, label: 'Produtos' },
            { id: 'history', icon: History, label: 'Registros' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setSelectedPersonForSettlement(null);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all relative",
                activeTab === item.id ? "text-blue-600 scale-110" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn("w-6 h-6", activeTab === item.id ? "fill-blue-50" : "")} />
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="nav-pill" className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
