/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
              }`}>
                <AlertCircle className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
                {title}
              </h3>
              <p className="text-slate-500 font-medium">
                {message}
              </p>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={onCancel}
                className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-all"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className={`flex-1 py-4 font-bold text-white rounded-2xl shadow-lg active:scale-95 transition-all ${
                  type === 'danger' ? 'bg-red-500 shadow-red-200' : 'bg-blue-600 shadow-blue-200'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
            
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
