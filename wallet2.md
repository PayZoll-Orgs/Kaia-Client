
LINE's Mini Dapp Docs

⌘
K
LINE's Mini Dapp & Dapp Portal
How to build successful Mini Dapp
Join Us
Mini Dapp
Overview
LINE Integration
Mini Dapp SDK
How to Get SDK Authorization
Initiate DappPortalSDK
Wallet
Domain Verification via Reown
Payment
Release Note
Integration Guide for Game Engine
Design Guide
Dapp Portal
Mini Dapp Information
Collection & Drops
Reward
Policy
Extra Packages
Review Guidelines
Update Note
Powered by GitBook
sdk.getWalletProvider()
walletProvider.getWalletType()
walletProvider.request()
walletProvider.disconnectWallet()
walletProvider.getErc20TokenBalance()
Compatible Libraries
Copy

MINI DAPP
MINI DAPP SDK
Wallet
The WalletProvider follows the EIP-1193 standard and supports the EventEmitter interface defined in it.
sdk.getWalletProvider()
Initializes the walletProvider, allowing developers to use various wallet features.
Copy
const walletProvider = sdk.getWalletProvider();
Parameters

N/A
Responses
Copy
WalletProvider
walletProvider.getWalletType()
Returns the type of the currently connected wallet.
Copy
const walletType = walletProvider.getWalletType();
Parameters

N/A

Responses
Copy
enum WalletType {
    Web = "Web",
    Liff = "Liff",
    Extension = "Extension",
    Mobile = "Mobile",
    OKX = "OKX",
    BITGET = "BITGET"
}
walletProvider.request()
This function provides JSON-RPC API format on request. You can send request to retrieve healthy status of chain and sign transaction with wallet. If you send it before wallet connection, user will see a screen to select wallet type to connect.
You can find the available KAIA-related methods, their parameters, and corresponding responses in the table below. RPC methods that are not included in the table will be requested directly to the chain node and please refer to Kaia docs' RPC API Reference.
Copy
const getAccount = async() => {
   const accounts = await walletProvider.request({ method: 'kaia_accounts' }) as string[]; 
   return accounts[0]; 
} 

const requestAccount = async () => {
   const addresses = await walletProvider.request({ method: 'kaia_requestAccounts' }) as string[];
   return accounts[0];
}

const connectAndSign = async (msg:string) => {
   const [account, signature] = await walletProvider.request({ method: 'kaia_connectAndSign', params: [msg]}) as string[];
   return [account, signature];
}

const getBalance = async(params: [account:string,blockNumberOrHash:'latest' | 'earliest'])=>{
   return await walletProvider.request({ method: 'kaia_getBalance', params: params });
}

const transaction = {
  from: 0xYourWalletAddress, //The currently connected wallet account can be retrieved using the kaia_accounts method.
  to: '0xRecipientAddress', //Please replace it with a valid wallet address.
  value: '0x10',
  gas: '0x5208', //general gas usage for Kaia transaction
};

const sendTransaction = async(transaction) => {
    const transactionHash = await walletProvider.request({ method: 'kaia_sendTransaction', params: [transaction]});
    return transactionHash;
};

Parameters

RequestArguments *required · object
  
  - method *required · string
  - params unknown[]

Responses
Copy
Promise<unknown>
method
params
Responses
kaia_accounts

Returns the list of addresses currently connected to the wallet.
If no wallet is connected, an empty array is returned.
null
Copy
['Account1']
kaia_requestAccounts

Initiates wallet connection.
During the process, a window is displayed for the user to select a wallet provider.
Returns a list of addresses associated with the selected wallet.
null
Copy
['Account1']
kaia_signLegacy (KIP-97) deprecated
[message: string, account: string]
personal_sign (EIP-191) recommended

Initiate sign procedure. We recommend to use personal_sign to get compatibility with various wallets including OKX Wallet.
[message: string, account: string]
Copy
"0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
signature
kaia_connectAndSign  (EIP-191) recommended 

Iniitiates wallet connection and signing.
Prompts the user to select a wallet provider, then signs the provided message.
Returns [account, signature] as an array.
[message: string]
Copy
["account","0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"]
account and signature as Array
kaia_getBalance

Returns the kaia balance. 
[account: string, blockNumberOrHash: string]

blockNumberOrHash can be set as latest or earliest

latest: the most recent block 
earliest: the genesis block (block 0)



Copy
"0x00000000000000000"
the balance value in kei, the smallest unit of the KAIA blockchain. 
1 KAIA = 10^18 kei
kaia_sendTransaction

Constructs a transaction with given parameters
[{
    from: string,
    to: string,
    value: string,
    gas: string 
}]

from field should be the account that achieved from 'kaia_accounts','kaia_requestAccounts' or 'kaia_connectAndSign'
Copy
"0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d059210"26d1527331
transactionHash
Error
Copy
{code: -32001, message: 'User canceled'}
Code
Description
-32001
Copy
{
  "code": -32001,
  "message": "User canceled" 
}
Copy
//When the user dismissed the wallet connection popup.
{code: -32001, message: 'User closed popup', data: null}
Copy
//When the user clicks the dismiss button on the signature popup
{
  "code": -32001,
  "message": "User denied message signature"
}
Copy
//When the user clicks the dismiss button on the transaction popup
{
  "code": -32001,
  "message": "User denied transaction send."
}
-32004
Invalid from address (Please retry methohs after executing walletProvider.disconnectWallet())
-32005
User logged out due to incorrect password input (Please retry methohs after executing walletProvider.disconnectWallet())
-32006
Wallet is not connected yet (If an error occurs while the wallet in connected, Please retry methods after executing walletProvider.disconnectWallet(). If an error occurs while the wallet is not connected, please connect wallet first)
walletProvider.disconnectWallet()
Disconnects the wallet.
When this function is called, a confirmation window will appear to confirm the disconnection.
Copy
 const disconnectWallet = async ()=>{
    await walletProvider.disconnectWallet();
    window.location.reload();
}
Parameters

N/A

Responses

N/A

walletProvider.getErc20TokenBalance()
Copy
const getErc20TokenBalance = async(contractAddress:string,account:string)=> {
    return await walletProvider.getErc20TokenBalance(contractAddress,account);
}

const USDTContractAddress = '0xd077a400968890eacc75cdc901f0356c943e4fdb';
const account = 'my_account_address';
getErc20TokenBalance(USDTContractAddress, account).then(balance => {
    const formattedUSDTBalance = Number(microUSDTHexToUSDTDecimal(balance as string)).toFixed(2);
    //microUSDTHexToUSDTDecimal is format function to transform hexadecimal string to decimal string
    //https://github.com/techreadiness/dapp-starter/blob/main/src/utils/format.ts
    console.log(formattedUSDTBalance);
    //0.00
})
Parameters
contactAddress *required · string
account *required · string
Responses
64-byte hexadecimal string.
The returned value includes the token’s decimal scaling according to its decimals specification.
For example, USDT uses a decimal scale of 10⁶, while DELABS uses a decimal scale of 10¹⁸.
Copy
string
Compatible Libraries
https://docs.kaia.io/ko/references/sdk/ethers-ext/getting-started/
https://docs.kaia.io/ko/references/sdk/web3js-ext/getting-started/
https://docs.kaia.io/ko/references/sdk/caver-js/
Previous
Initiate DappPortalSDK
Next
Domain Verification via Reown
Last updated 13 days ago
This site uses cookies to deliver its service and to analyze traffic. By browsing this site, you accept the privacy policy.

Accept
Reject