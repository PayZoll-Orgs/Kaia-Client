
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
Copy

MINI DAPP
MINI DAPP SDK
Initiate DappPortalSDK
Initiate SDK
1. Initialize SDK via init() method 
Copy
import DappPortalSDK from '@linenext/dapp-portal-sdk'

const sdk = await DappPortalSDK.init({ clientId: '<CLIENT_ID>', chainId: '1001 });
Parameters
Name
Description
clientId*required
string
the clientId provided when applying for the SDK
chainId
string
The default value is 1001(testnet).
To use the mainnet after development, set the value to 8217(mainnet).
Response
Returns a DappPortalSDK object through which the following methods can be called.
Copy
DappPortalSDK
method name
description
getWalletProvider  function 
Initialize walletProvider
getPaymentProvider function
Initialize paymentProvider
isSupportedBrowser function
Returns true if the current browser is supported; otherwise, returns false.
We highly recommend executing DappPortalSDK.init() only once and managing it as a singleton object. If you create a new DappPortalSDK object by calling DappPortalSDK.init() every time you make a request to the wallet, it may lead to malfunction. The reason we do not enforce this as a singleton is to support scenarios where multi-configurations are needed. For example, if you want to use both testnet and mainnet in a single app. In such cases, we also recommend managing one singleton DappPortalSDK object for testnet and another singleton for mainnet.
Previous
How to Get SDK Authorization
Next
Wallet
Last updated 2 months ago
This site uses cookies to deliver its service and to analyze traffic. By browsing this site, you accept the privacy policy.

Accept
Reject