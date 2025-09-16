// Generated TypeScript interfaces for KaiaPay contracts
// Auto-generated on 2025-09-14T11:50:59.540Z

import { ethers } from 'ethers';

// MyDummyTokenWithFaucet Interface
export interface MyDummyTokenWithFaucet {
  FAUCET_AMOUNT(): Promise<bigint>;
  FAUCET_COOLDOWN(): Promise<bigint>;
  allowance(owner: string, spender: string): Promise<bigint>;
  approve(spender: string, amount: bigint): Promise<boolean>;
  balanceOf(account: string): Promise<bigint>;
  decimals(): Promise<bigint>;
  decreaseAllowance(spender: string, subtractedValue: bigint): Promise<boolean>;
  faucet(): Promise<ethers.ContractTransactionResponse>;
  increaseAllowance(spender: string, addedValue: bigint): Promise<boolean>;
  mint(to: string, amount: bigint): Promise<ethers.ContractTransactionResponse>;
  name(): Promise<string>;
  owner(): Promise<string>;
  safeTransfer(recipient: string, amount: bigint): Promise<ethers.ContractTransactionResponse>;
  safeTransfer(recipient: string, amount: bigint, _data: string): Promise<ethers.ContractTransactionResponse>;
  safeTransferFrom(sender: string, recipient: string, amount: bigint): Promise<ethers.ContractTransactionResponse>;
  safeTransferFrom(sender: string, recipient: string, amount: bigint, _data: string): Promise<ethers.ContractTransactionResponse>;
  supportsInterface(interfaceId: string): Promise<boolean>;
  symbol(): Promise<string>;
  totalSupply(): Promise<bigint>;
  transfer(to: string, amount: bigint): Promise<boolean>;
  transferFrom(from: string, to: string, amount: bigint): Promise<boolean>;
  withdrawFaucetFunds(): Promise<ethers.ContractTransactionResponse>;
}

// BulkPayroll Interface
export interface BulkPayroll {
  GAS_LIMIT(): Promise<bigint>;
  MAX_RECIPIENTS(): Promise<bigint>;
  bulkTransfer(token: string, recipients: string[], amounts: bigint): Promise<ethers.ContractTransactionResponse>;
  claimFailedTransfer(token: string): Promise<ethers.ContractTransactionResponse>;
  emergencyWithdraw(token: string): Promise<ethers.ContractTransactionResponse>;
  failedTransfers(recipient: string, token: string): Promise<bigint>;
  getFailedAmount(recipient: string, token: string): Promise<bigint>;
  owner(): Promise<string>;
  renounceOwnership(): Promise<ethers.ContractTransactionResponse>;
  transferOwnership(newOwner: string): Promise<ethers.ContractTransactionResponse>;
}

// InvoiceSubscriptionService Interface
export interface InvoiceSubscriptionService {
  applyCouponDiscount(_invoiceId: bigint, _discountAmount: bigint): Promise<ethers.ContractTransactionResponse>;
  buyerInvoices(buyer: string, index: bigint): Promise<bigint>;
  contributeToSplitPayment(_invoiceId: bigint, _amount: bigint): Promise<ethers.ContractTransactionResponse>;
  feeCollector(): Promise<string>;
  getBuyerInvoices(_buyer: string): Promise<bigint>;
  getInvoice(_invoiceId: bigint): Promise<any>;
  getSellerServices(_seller: string): Promise<bigint>;
  getService(_serviceId: bigint): Promise<any>;
  getSplitPaymentDetails(_invoiceId: bigint): Promise<any[]>;
  invoices(id: bigint): Promise<any[]>;
  listService(_serviceName: string, _description: string, _imageUrl: string, _priceInWei: bigint, _paymentToken: string): Promise<bigint>;
  markInvoiceOverdue(_invoiceId: bigint): Promise<ethers.ContractTransactionResponse>;
  owner(): Promise<string>;
  payInvoice(_invoiceId: bigint): Promise<ethers.ContractTransactionResponse>;
  platformFeeRate(): Promise<bigint>;
  purchaseService(_serviceId: bigint, _allowSplitPayment: boolean, _daysUntilDue: bigint): Promise<bigint>;
  renounceOwnership(): Promise<ethers.ContractTransactionResponse>;
  sellerServices(seller: string, index: bigint): Promise<bigint>;
  services(id: bigint): Promise<any[]>;
  splitPayments(id: bigint): Promise<any[]>;
  transferOwnership(newOwner: string): Promise<ethers.ContractTransactionResponse>;
  updateFeeCollector(_newFeeCollector: string): Promise<ethers.ContractTransactionResponse>;
  updatePlatformFee(_newFeeRate: bigint): Promise<ethers.ContractTransactionResponse>;
  updateServiceStatus(_serviceId: bigint, _isActive: boolean): Promise<ethers.ContractTransactionResponse>;
  usedCouponCodes(code: string): Promise<boolean>;
}

// SplitBilling Interface
export interface SplitBilling {
  ETH_TOKEN(): Promise<string>;
  GAS_LIMIT(): Promise<bigint>;
  MAX_RECIPIENTS(): Promise<bigint>;
  cancelSplit(splitId: bigint): Promise<ethers.ContractTransactionResponse>;
  checkOverduePayments(splitId: bigint): Promise<ethers.ContractTransactionResponse>;
  createSplit(payee: string, debtors: string[], amounts: bigint, token: string, deadline: bigint, description: string): Promise<bigint>;
  getOwedAmount(splitId: bigint, debtor: string): Promise<bigint>;
  getPaidAmount(splitId: bigint, debtor: string): Promise<bigint>;
  getSplitDetails(splitId: bigint): Promise<any[]>;
  getUserSplits(user: string): Promise<bigint>;
  hasPaid(splitId: bigint, debtor: string): Promise<boolean>;
  isSplitComplete(splitId: bigint): Promise<boolean>;
  payForSomeone(splitId: bigint, debtor: string): Promise<ethers.ContractTransactionResponse>;
  payShare(splitId: bigint): Promise<ethers.ContractTransactionResponse>;
  splitCounter(): Promise<bigint>;
  splitRequests(id: bigint): Promise<any[]>;
  userSplits(user: string, id: bigint): Promise<bigint>;
}

