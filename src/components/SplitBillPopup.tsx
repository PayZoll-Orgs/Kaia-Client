"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import Image from "next/image";

interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  profilePhoto: string;
  phoneNumber: string;
}

interface SelectedContact extends Contact {
  amount: number;
  isCustomAmount: boolean;
}

interface SplitBillPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSplit: (contacts: SelectedContact[], totalAmount: number) => void;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Arnav Saikia",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    profilePhoto: "/next.svg",
    phoneNumber: "+91 82992 24950"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    profilePhoto: "/next.svg",
    phoneNumber: "+91 98765 43210"
  },
  {
    id: "3",
    name: "Mike Chen",
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    profilePhoto: "/next.svg",
    phoneNumber: "+91 87654 32109"
  },
  {
    id: "4",
    name: "Emma Wilson",
    walletAddress: "0x5555555555555555555555555555555555555555",
    profilePhoto: "/next.svg",
    phoneNumber: "+91 76543 21098"
  }
];

export default function SplitBillPopup({ isOpen, onClose, onConfirmSplit }: SplitBillPopupProps) {
  const [step, setStep] = useState<'select' | 'preview' | 'amount'>('select');
  const [selectedContacts, setSelectedContacts] = useState<SelectedContact[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.includes(searchQuery)
  );

  const handleContactToggle = (contact: Contact) => {
    const isSelected = selectedContacts.some(c => c.id === contact.id);
    if (isSelected) {
      setSelectedContacts(prev => prev.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts(prev => [...prev, { ...contact, amount: 0, isCustomAmount: false }]);
    }
  };

  const handlePreview = () => {
    if (selectedContacts.length === 0) return;
    setStep('preview');
  };

  const handleBackToSelection = () => {
    setStep('select');
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const handleDropAll = () => {
    setSelectedContacts([]);
    setStep('select');
  };

  const handleProceedToAmount = () => {
    setStep('amount');
  };

  const handleSplitEqually = () => {
    const amountPerPerson = totalAmount / selectedContacts.length;
    setSelectedContacts(prev => prev.map(contact => ({
      ...contact,
      amount: amountPerPerson,
      isCustomAmount: false
    })));
  };

  const handleCustomAmountChange = (contactId: string, amount: number) => {
    setSelectedContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, amount, isCustomAmount: true }
        : contact
    ));
  };

  const handleCustomSplit = () => {
    // Reset all amounts to 0 when switching to custom split
    setSelectedContacts(prev => prev.map(contact => ({
      ...contact,
      amount: 0,
      isCustomAmount: true
    })));
  };

  const currentTotal = selectedContacts.reduce((sum, contact) => sum + contact.amount, 0);
  const isValidAmount = Math.abs(currentTotal - totalAmount) < 0.01;

  const handleConfirmSplit = () => {
    if (isValidAmount) {
      onConfirmSplit(selectedContacts, totalAmount);
      onClose();
    }
  };

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
                  <Dialog.Title as="h2" className="text-gray-900 text-xl font-bold">
                    {step === 'select' && 'Select People'}
                    {step === 'preview' && 'Preview Selection'}
                    {step === 'amount' && 'Split Amount'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

        {step === 'select' && (
          <>
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="overflow-y-auto max-h-96 p-6">
              <div className="space-y-3">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContacts.some(c => c.id === contact.id);
                  return (
                    <div
                      key={contact.id}
                      onClick={() => handleContactToggle(contact)}
                      className={`bg-gray-50 rounded-xl p-4 cursor-pointer transition-colors border ${
                        isSelected ? 'ring-2 ring-green-500 bg-green-50 border-green-200' : 'hover:bg-green-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Image src={contact.profilePhoto} alt={contact.name} width={24} height={24} className="rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 font-medium truncate">{contact.name}</h3>
                          <p className="text-gray-500 text-sm truncate">{contact.phoneNumber}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handlePreview}
                disabled={selectedContacts.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Preview Selection ({selectedContacts.length})
              </button>
            </div>
          </>
        )}

        {step === 'preview' && (
          <>
            {/* Selected Contacts */}
            <div className="overflow-y-auto max-h-96 p-6">
              <div className="space-y-3">
                {selectedContacts.map((contact) => (
                  <div key={contact.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Image src={contact.profilePhoto} alt={contact.name} width={24} height={24} className="rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 font-medium truncate">{contact.name}</h3>
                        <p className="text-gray-500 text-sm truncate">{contact.phoneNumber}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveContact(contact.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 space-y-3">
              <button
                onClick={handleBackToSelection}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Back to Selection
              </button>
              <button
                onClick={handleDropAll}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Drop All
              </button>
              <button
                onClick={handleProceedToAmount}
                disabled={selectedContacts.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Proceed to Amount
              </button>
            </div>
          </>
        )}

        {step === 'amount' && (
          <>
            {/* Total Amount Input */}
            <div className="p-6 border-b border-gray-200">
              <label className="block text-gray-600 text-sm mb-2">Total Amount to Split</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 text-gray-900 pl-8 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Split Options */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleSplitEqually}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Split Equally
                </button>
                <button
                  onClick={handleCustomSplit}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Custom Split
                </button>
              </div>
            </div>

            {/* Amount Distribution */}
            <div className="overflow-y-auto max-h-64 p-6">
              <div className="space-y-3">
                {selectedContacts.map((contact) => (
                  <div key={contact.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Image src={contact.profilePhoto} alt={contact.name} width={20} height={20} className="rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 font-medium truncate">{contact.name}</h3>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={contact.amount}
                        onChange={(e) => handleCustomAmountChange(contact.id, Number(e.target.value))}
                        className="w-full bg-white text-gray-900 pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Confirm */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total:</span>
                <span className={`text-lg font-bold ${isValidAmount ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{currentTotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleConfirmSplit}
                disabled={!isValidAmount || totalAmount === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Confirm Split
              </button>
            </div>
          </>
        )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
