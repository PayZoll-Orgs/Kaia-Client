"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import Image from "next/image";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'sent' | 'received';
  message: string;
  status: 'paid' | 'pending' | 'failed';
}

interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  profilePhoto: string;
  phoneNumber: string;
}

interface PastInteractionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onPay: (contact: Contact) => void;
  onRequest: (contact: Contact) => void;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 20,
    date: "30 Aug, 9:02 pm",
    type: 'received',
    message: "Payment to you",
    status: 'paid'
  },
  {
    id: "2",
    amount: 30,
    date: "2 Apr, 9:14 am",
    type: 'sent',
    message: "Payment to Arnav",
    status: 'paid'
  },
  {
    id: "3",
    amount: 50,
    date: "10 Jan, 5:59 pm",
    type: 'sent',
    message: "Payment to Arnav",
    status: 'paid'
  }
];

export default function PastInteractionPopup({ isOpen, onClose, contact, onPay, onRequest }: PastInteractionPopupProps) {
  const [message, setMessage] = useState("");

  if (!contact) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Image src={contact.profilePhoto} alt={contact.name} width={24} height={24} className="rounded-full" />
            </div>
            <div>
              <h2 className="text-gray-900 text-lg font-bold">{contact.name}</h2>
              <p className="text-gray-500 text-sm">{contact.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'received' ? (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 font-medium truncate">{transaction.message}</div>
                    <div className="text-gray-500 text-sm">{transaction.date}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-500 text-xs">Paid • {transaction.date.split(',')[0]}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className={`text-lg font-bold ${transaction.type === 'received' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'received' ? '+' : '-'}₹{transaction.amount}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => onPay(contact)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Pay
            </button>
            <button
              onClick={() => onRequest(contact)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Request
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:outline-none"
            />
            <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
