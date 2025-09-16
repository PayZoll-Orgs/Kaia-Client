// Generated TypeScript interfaces for KaiaPay contracts
// Auto-generated on 2025-09-14T11:50:59.540Z

// Generic transaction response type compatible with wallet providers
export interface ContractTransactionResponse {
  hash: string;
  wait?: () => Promise<any>;
}

// MyDummyTokenWithFaucet Interface
export interface MyDummyTokenWithFaucet {
  FAUCET_AMOUNT(): Promise<bigint>;
  FAUCET_COOLDOWN(): Promise<bigint>;
  allowance(owner: string, spender: string): Promise<bigint>;
  approve(spender: string, amount: bigint): Promise<boolean>;
  balanceOf(account: string): Promise<bigint>;
  decimals(): Promise<bigint>;
  decreaseAllowance(spender: string, subtractedValue: bigint): Promise<boolean>;
  faucet(): Promise<ContractTransactionResponse>;
  increaseAllowance(spender: string, addedValue: bigint): Promise<boolean>;
  mint(to: string, amount: bigint): Promise<ContractTransactionResponse>;
  name(): Promise<string>;
  owner(): Promise<string>;
  safeTransfer(recipient: string, amount: bigint): Promise<ContractTransactionResponse>;
  safeTransfer(recipient: string, amount: bigint, _data: string): Promise<ContractTransactionResponse>;
  safeTransferFrom(sender: string, recipient: string, amount: bigint): Promise<ContractTransactionResponse>;
  safeTransferFrom(sender: string, recipient: string, amount: bigint, _data: string): Promise<ContractTransactionResponse>;
  supportsInterface(interfaceId: string): Promise<boolean>;
  symbol(): Promise<string>;
  totalSupply(): Promise<bigint>;
  transfer(to: string, amount: bigint): Promise<boolean>;
  transferFrom(from: string, to: string, amount: bigint): Promise<boolean>;
  withdrawFaucetFunds(): Promise<ContractTransactionResponse>;
}

// BulkPayroll Interface
export interface BulkPayroll {
  GAS_LIMIT(): Promise<bigint>;
  MAX_RECIPIENTS(): Promise<bigint>;
  bulkTransfer(token: string, recipients: string[], amounts: bigint): Promise<ContractTransactionResponse>;
  claimFailedTransfer(token: string): Promise<ContractTransactionResponse>;
  emergencyWithdraw(token: string): Promise<ContractTransactionResponse>;
  failedTransfers(recipient: string, token: string): Promise<bigint>;
  getFailedAmount(recipient: string, token: string): Promise<bigint>;
  owner(): Promise<string>;
  renounceOwnership(): Promise<ContractTransactionResponse>;
  transferOwnership(newOwner: string): Promise<ContractTransactionResponse>;
}

// InvoiceSubscriptionService Interface
export interface InvoiceSubscriptionService {
  applyCouponDiscount(_invoiceId: bigint, _discountAmount: bigint): Promise<ContractTransactionResponse>;
  buyerInvoices(buyer: string, index: bigint): Promise<bigint>;
  contributeToSplitPayment(_invoiceId: bigint, _amount: bigint): Promise<ContractTransactionResponse>;
  feeCollector(): Promise<string>;
  getBuyerInvoices(_buyer: string): Promise<bigint>;
  getInvoice(_invoiceId: bigint): Promise<any>;
  getSellerServices(_seller: string): Promise<bigint>;
  getService(_serviceId: bigint): Promise<any>;
  getSplitPaymentDetails(_invoiceId: bigint): Promise<any[]>;
  invoices(id: bigint): Promise<any[]>;
  listService(_serviceName: string, _description: string, _imageUrl: string, _priceInWei: bigint, _paymentToken: string): Promise<bigint>;
  markInvoiceOverdue(_invoiceId: bigint): Promise<ContractTransactionResponse>;
  owner(): Promise<string>;
  payInvoice(_invoiceId: bigint): Promise<ContractTransactionResponse>;
  platformFeeRate(): Promise<bigint>;
  purchaseService(_serviceId: bigint, _allowSplitPayment: boolean, _daysUntilDue: bigint): Promise<bigint>;
  renounceOwnership(): Promise<ContractTransactionResponse>;
  sellerServices(seller: string, index: bigint): Promise<bigint>;
  services(id: bigint): Promise<any[]>;
  splitPayments(id: bigint): Promise<any[]>;
  transferOwnership(newOwner: string): Promise<ContractTransactionResponse>;
  updateFeeCollector(_newFeeCollector: string): Promise<ContractTransactionResponse>;
  updatePlatformFee(_newFeeRate: bigint): Promise<ContractTransactionResponse>;
  updateServiceStatus(_serviceId: bigint, _isActive: boolean): Promise<ContractTransactionResponse>;
  usedCouponCodes(code: string): Promise<boolean>;
}

// SplitBilling Interface
export interface SplitBilling {
  ETH_TOKEN(): Promise<string>;
  GAS_LIMIT(): Promise<bigint>;
  MAX_RECIPIENTS(): Promise<bigint>;
  cancelSplit(splitId: bigint): Promise<ContractTransactionResponse>;
  checkOverduePayments(splitId: bigint): Promise<ContractTransactionResponse>;
  createSplit(payee: string, debtors: string[], amounts: bigint, token: string, deadline: bigint, description: string): Promise<bigint>;
  getOwedAmount(splitId: bigint, debtor: string): Promise<bigint>;
  getPaidAmount(splitId: bigint, debtor: string): Promise<bigint>;
  getSplitDetails(splitId: bigint): Promise<any[]>;
  getUserSplits(user: string): Promise<bigint>;
  hasPaid(splitId: bigint, debtor: string): Promise<boolean>;
  isSplitComplete(splitId: bigint): Promise<boolean>;
  payForSomeone(splitId: bigint, debtor: string): Promise<ContractTransactionResponse>;
  payShare(splitId: bigint): Promise<ContractTransactionResponse>;
  splitCounter(): Promise<bigint>;
  splitRequests(id: bigint): Promise<any[]>;
  userSplits(user: string, id: bigint): Promise<bigint>;
}

