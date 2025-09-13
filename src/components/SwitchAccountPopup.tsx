"use client";
import { Fragment } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';

interface Account {
  id: string;
  name: string;
  network: string;
  balance: string;
  address: string;
  isActive: boolean;
}

interface SwitchAccountPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: Account) => void;
  accounts: Account[];
}

export default function SwitchAccountPopup({ isOpen, onClose, onSelectAccount, accounts }: SwitchAccountPopupProps) {
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 mb-4">
                  Switch Account
                </Dialog.Title>

                <div className="space-y-3">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => {
                        onSelectAccount(account);
                        onClose();
                      }}
                      className={`w-full p-4 rounded-xl border ${
                        account.isActive ? 'border-green-500 bg-green-50' : 'border-gray-100'
                      } hover:border-green-500 transition-colors`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Image src="/next.svg" alt={account.network} width={24} height={24} />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{account.name}</div>
                            <div className="text-sm text-gray-500">{account.network}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{account.balance}</div>
                          <div className="text-xs text-gray-500">{account.address}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
