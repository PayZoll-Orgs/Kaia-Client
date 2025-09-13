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
  lastTransaction?: {
    amount: number;
    date: string;
    type: 'sent' | 'received';
  };
}

interface PayAnyonePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Arnav Saikia",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    profilePhoto: "/next.svg",
    phoneNumber: "+91 82992 24950",
    lastTransaction: {
      amount: 20,
      date: "30 Aug, 9:02 pm",
      type: 'received'
    }
  },
  {
    id: "2",
    name: "Sarah Johnson",
    walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    profilePhoto: "/next.svg",
    phoneNumber: "+91 98765 43210",
    lastTransaction: {
      amount: 150,
      date: "25 Aug, 2:30 pm",
      type: 'sent'
    }
  },
  {
    id: "3",
    name: "Mike Chen",
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    profilePhoto: "/next.svg",
    phoneNumber: "+91 87654 32109",
    lastTransaction: {
      amount: 75,
      date: "20 Aug, 11:15 am",
      type: 'received'
    }
  }
];

export default function PayAnyonePopup({ isOpen, onClose, onSelectContact }: PayAnyonePopupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(mockContacts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockContacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.walletAddress.toLowerCase().includes(query.toLowerCase()) ||
      contact.phoneNumber.includes(query)
    );
    setFilteredContacts(filtered);
  };

  const handleContactSelect = (contact: Contact) => {
    onSelectContact(contact);
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
                    Pay Anyone
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

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, wallet address, or phone"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="overflow-y-auto max-h-96">
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No contacts found</p>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-green-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Image src={contact.profilePhoto} alt={contact.name} width={24} height={24} className="rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 font-medium truncate">{contact.name}</h3>
                      <p className="text-gray-500 text-sm truncate">{contact.phoneNumber}</p>
                      <p className="text-gray-400 text-xs font-mono truncate">{contact.walletAddress.slice(0, 10)}...{contact.walletAddress.slice(-8)}</p>
                    </div>
                    {contact.lastTransaction && (
                      <div className="text-right">
                        <p className={`text-sm font-medium ${contact.lastTransaction.type === 'sent' ? 'text-red-500' : 'text-green-500'}`}>
                          {contact.lastTransaction.type === 'sent' ? '-' : '+'}₹{contact.lastTransaction.amount}
                        </p>
                        <p className="text-gray-400 text-xs">{contact.lastTransaction.date}</p>
                      </div>
                    )}
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
