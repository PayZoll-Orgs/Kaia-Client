"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5920],{1805:(e,t,a)=>{a(18294)},4693:(e,t,a)=>{var r=a(83138),i=a(98410);a(99691);var o=a(71084),n=a(47327),s=a(20296);let c=(0,s.AH)`
  button {
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button[data-variant='accent']:hover:enabled,
  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='primary']:hover:enabled,
  button[data-variant='primary']:focus-visible,
  button[data-variant='secondary']:hover:enabled,
  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button[data-size='xs'] > wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='xs'],
  button[data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'],
  button[data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='md'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:hover:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
  }

  button:focus-visible:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
`;var l=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let d=class extends r.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="default",this.variant="accent"}render(){return(0,r.qy)`
      <button data-variant=${this.variant} ?disabled=${this.disabled} data-size=${this.size}>
        <wui-icon
          color=${({accent:"accent-primary",primary:"inverse",secondary:"default"})[this.variant]||this.iconColor}
          size=${this.size}
          name=${this.icon}
        ></wui-icon>
      </button>
    `}};d.styles=[o.W5,o.fD,c],l([(0,i.MZ)()],d.prototype,"size",void 0),l([(0,i.MZ)({type:Boolean})],d.prototype,"disabled",void 0),l([(0,i.MZ)()],d.prototype,"icon",void 0),l([(0,i.MZ)()],d.prototype,"iconColor",void 0),l([(0,i.MZ)()],d.prototype,"variant",void 0),d=l([(0,n.E)("wui-icon-link")],d)},15920:(e,t,a)=>{a.r(t),a.d(t,{W3mPayLoadingView:()=>F,W3mPayView:()=>G,arbitrumUSDC:()=>es,arbitrumUSDT:()=>ep,baseETH:()=>ea,baseSepoliaETH:()=>ei,baseUSDC:()=>er,ethereumUSDC:()=>eo,ethereumUSDT:()=>ed,getExchanges:()=>J,getIsPaymentInProgress:()=>ee,getPayError:()=>Q,getPayResult:()=>X,openPay:()=>H,optimismUSDC:()=>en,optimismUSDT:()=>eu,pay:()=>K,polygonUSDC:()=>ec,polygonUSDT:()=>eh,solanaSOL:()=>em,solanaUSDC:()=>el,solanaUSDT:()=>eg});var r=a(83138),i=a(98410),o=a(78964),n=a(58051),s=a(93481),c=a(81701),l=a(12319),d=a(65374),u=a(3824),p=a(36211);a(41028),a(40575),a(77237),a(71596),a(51568),a(80205),a(26670),a(75484),a(56975),a(39752),a(41163),a(1805);var h=a(12661),g=a(98866),m=a(45553),y=a(65103),w=a(70417),f=a(32009),b=a(67869);let v={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},x={[v.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[v.INVALID_RECIPIENT]:"Invalid recipient address",[v.INVALID_ASSET]:"Invalid asset specified",[v.INVALID_AMOUNT]:"Invalid payment amount",[v.UNKNOWN_ERROR]:"Unknown payment error occurred",[v.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[v.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[v.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[v.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[v.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[v.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[v.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"};class E extends Error{get message(){return x[this.code]}constructor(e,t){super(x[e]),this.name="AppKitPayError",this.code=e,this.details=t,Error.captureStackTrace&&Error.captureStackTrace(this,E)}}var I=a(55480);class A extends Error{}async function P(e,t){let a=function(){let e=I.H.getSnapshot().projectId;return`https://rpc.walletconnect.org/v1/json-rpc?projectId=${e}`}(),{sdkType:r,sdkVersion:i,projectId:o}=I.H.getSnapshot(),n={jsonrpc:"2.0",id:1,method:e,params:{...t||{},st:r,sv:i,projectId:o}},s=await fetch(a,{method:"POST",body:JSON.stringify(n),headers:{"Content-Type":"application/json"}}),c=await s.json();if(c.error)throw new A(c.error.message);return c}async function N(e){return(await P("reown_getExchanges",e)).result}async function k(e){return(await P("reown_getExchangePayUrl",e)).result}async function S(e){return(await P("reown_getExchangeBuyStatus",e)).result}let $=["eip155","solana"],T={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function _(e,t){let{chainNamespace:a,chainId:r}=y.C.parseCaipNetworkId(e),i=T[a];if(!i)throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${a}`);let o=i.native.assetNamespace,n=i.native.assetReference;"native"!==t&&(o=i.defaultTokenNamespace,n=t);let s=`${a}:${r}`;return`${s}/${o}:${n}`}var C=a(425);async function R(e){let{paymentAssetNetwork:t,activeCaipNetwork:a,approvedCaipNetworkIds:r,requestedCaipNetworks:i}=e,o=l.w.sortRequestedNetworks(r,i).find(e=>e.caipNetworkId===t);if(!o)throw new E(v.INVALID_PAYMENT_CONFIG);if(o.caipNetworkId===a.caipNetworkId)return;let n=s.W.getNetworkProp("supportsAllNetworks",o.chainNamespace);if(!(r?.includes(o.caipNetworkId)||n))throw new E(v.INVALID_PAYMENT_CONFIG);try{await s.W.switchActiveNetwork(o)}catch(e){throw new E(v.GENERIC_PAYMENT_ERROR,e)}}async function M(e,t,a){if(t!==m.o.CHAIN.EVM)throw new E(v.INVALID_CHAIN_NAMESPACE);if(!a.fromAddress)throw new E(v.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");let r="string"==typeof a.amount?parseFloat(a.amount):a.amount;if(isNaN(r))throw new E(v.INVALID_PAYMENT_CONFIG);let i=e.metadata?.decimals??18,o=u.x.parseUnits(r.toString(),i);if("bigint"!=typeof o)throw new E(v.GENERIC_PAYMENT_ERROR);return await u.x.sendTransaction({chainNamespace:t,to:a.recipient,address:a.fromAddress,value:o,data:"0x"})??void 0}async function D(e,t){if(!t.fromAddress)throw new E(v.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");let a=e.asset,r=t.recipient,i=Number(e.metadata.decimals),o=u.x.parseUnits(t.amount.toString(),i);if(void 0===o)throw new E(v.GENERIC_PAYMENT_ERROR);return await u.x.writeContract({fromAddress:t.fromAddress,tokenAddress:a,args:[r,o],method:"transfer",abi:C.v.getERC20Abi(a),chainNamespace:m.o.CHAIN.EVM})??void 0}async function O(e,t){if(e!==m.o.CHAIN.SOLANA)throw new E(v.INVALID_CHAIN_NAMESPACE);if(!t.fromAddress)throw new E(v.INVALID_PAYMENT_CONFIG,"fromAddress is required for Solana payments.");let a="string"==typeof t.amount?parseFloat(t.amount):t.amount;if(isNaN(a)||a<=0)throw new E(v.INVALID_PAYMENT_CONFIG,"Invalid payment amount.");try{if(!f.G.getProvider(e))throw new E(v.GENERIC_PAYMENT_ERROR,"No Solana provider available.");let r=await u.x.sendTransaction({chainNamespace:m.o.CHAIN.SOLANA,to:t.recipient,value:a,tokenMint:t.tokenMint});if(!r)throw new E(v.GENERIC_PAYMENT_ERROR,"Transaction failed.");return r}catch(e){if(e instanceof E)throw e;throw new E(v.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${e}`)}}let U="unknown",z=(0,h.BX)({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),L={state:z,subscribe:e=>(0,h.B1)(z,()=>e(z)),subscribeKey:(e,t)=>(0,g.u$)(z,e,t),async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.subscribeEvents(),this.initializeAnalytics(),z.isConfigured=!0,w.E.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:z.exchanges,configuration:{network:z.paymentAsset.network,asset:z.paymentAsset.asset,recipient:z.recipient,amount:z.amount}}}),await c.W.open({view:"Pay"})},resetState(){z.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},z.recipient="0x0",z.amount=0,z.isConfigured=!1,z.error=null,z.isPaymentInProgress=!1,z.isLoading=!1,z.currentPayment=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new E(v.INVALID_PAYMENT_CONFIG);try{z.paymentAsset=e.paymentAsset,z.recipient=e.recipient,z.amount=e.amount,z.openInNewTab=e.openInNewTab??!0,z.redirectUrl=e.redirectUrl,z.payWithExchange=e.payWithExchange,z.error=null}catch(e){throw new E(v.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset:()=>z.paymentAsset,getExchanges:()=>z.exchanges,async fetchExchanges(){try{z.isLoading=!0;let e=await N({page:0,asset:_(z.paymentAsset.network,z.paymentAsset.asset),amount:z.amount.toString()});z.exchanges=e.exchanges.slice(0,2)}catch(e){throw d.P.showError(x.UNABLE_TO_GET_EXCHANGES),new E(v.UNABLE_TO_GET_EXCHANGES)}finally{z.isLoading=!1}},async getAvailableExchanges(e){try{let t=e?.asset&&e?.network?_(e.network,e.asset):void 0;return await N({page:e?.page??0,asset:t,amount:e?.amount?.toString()})}catch(e){throw new E(v.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(e,t,a=!1){try{let r=Number(t.amount),i=await k({exchangeId:e,asset:_(t.network,t.asset),amount:r.toString(),recipient:`${t.network}:${t.recipient}`});return w.E.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:r},currentPayment:{type:"exchange",exchangeId:e},headless:a}}),a&&(this.initiatePayment(),w.E.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:z.paymentId||U,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:r},currentPayment:{type:"exchange",exchangeId:e}}})),i}catch(e){if(e instanceof Error&&e.message.includes("is not supported"))throw new E(v.ASSET_NOT_SUPPORTED);throw Error(e.message)}},async openPayUrl(e,t,a=!1){try{let r=await this.getPayUrl(e.exchangeId,t,a);if(!r)throw new E(v.UNABLE_TO_GET_PAY_URL);let i=e.openInNewTab??!0;return l.w.openHref(r.url,i?"_blank":"_self"),r}catch(e){throw e instanceof E?z.error=e.message:z.error=x.GENERIC_PAYMENT_ERROR,new E(v.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){z.isConfigured||(u.x.subscribeKey("connections",e=>{e.size>0&&this.handlePayment()}),n.U.subscribeKey("caipAddress",e=>{let t=u.x.hasAnyConnection(m.o.CONNECTOR_ID.WALLET_CONNECT);e&&(t?setTimeout(()=>{this.handlePayment()},100):this.handlePayment())}))},async handlePayment(){z.currentPayment={type:"wallet",status:"IN_PROGRESS"};let e=n.U.state.caipAddress;if(!e)return;let{chainId:t,address:a}=y.C.parseCaipAddress(e),r=s.W.state.activeChain;if(!a||!t||!r||!f.G.getProvider(r))return;let i=s.W.state.activeCaipNetwork;if(i&&!z.isPaymentInProgress)try{this.initiatePayment();let e=s.W.getAllRequestedCaipNetworks(),t=s.W.getAllApprovedCaipNetworkIds();switch(await R({paymentAssetNetwork:z.paymentAsset.network,activeCaipNetwork:i,approvedCaipNetworkIds:t,requestedCaipNetworks:e}),await c.W.open({view:"PayLoading"}),r){case m.o.CHAIN.EVM:"native"===z.paymentAsset.asset&&(z.currentPayment.result=await M(z.paymentAsset,r,{recipient:z.recipient,amount:z.amount,fromAddress:a})),z.paymentAsset.asset.startsWith("0x")&&(z.currentPayment.result=await D(z.paymentAsset,{recipient:z.recipient,amount:z.amount,fromAddress:a})),z.currentPayment.status="SUCCESS";break;case m.o.CHAIN.SOLANA:z.currentPayment.result=await O(r,{recipient:z.recipient,amount:z.amount,fromAddress:a,tokenMint:"native"===z.paymentAsset.asset?void 0:z.paymentAsset.asset}),z.currentPayment.status="SUCCESS";break;default:throw new E(v.INVALID_CHAIN_NAMESPACE)}}catch(e){e instanceof E?z.error=e.message:z.error=x.GENERIC_PAYMENT_ERROR,z.currentPayment.status="FAILED",d.P.showError(z.error)}finally{z.isPaymentInProgress=!1}},getExchangeById:e=>z.exchanges.find(t=>t.id===e),validatePayConfig(e){let{paymentAsset:t,recipient:a,amount:r}=e;if(!t)throw new E(v.INVALID_PAYMENT_CONFIG);if(!a)throw new E(v.INVALID_RECIPIENT);if(!t.asset)throw new E(v.INVALID_ASSET);if(null==r||r<=0)throw new E(v.INVALID_AMOUNT)},handlePayWithWallet(){let e=n.U.state.caipAddress;if(!e)return void b.I.push("Connect");let{chainId:t,address:a}=y.C.parseCaipAddress(e),r=s.W.state.activeChain;if(!a||!t||!r)return void b.I.push("Connect");this.handlePayment()},async handlePayWithExchange(e){try{z.currentPayment={type:"exchange",exchangeId:e};let{network:t,asset:a}=z.paymentAsset,r={network:t,asset:a,amount:z.amount,recipient:z.recipient},i=await this.getPayUrl(e,r);if(!i)throw new E(v.UNABLE_TO_INITIATE_PAYMENT);return z.currentPayment.sessionId=i.sessionId,z.currentPayment.status="IN_PROGRESS",z.currentPayment.exchangeId=e,this.initiatePayment(),{url:i.url,openInNewTab:z.openInNewTab}}catch(e){return e instanceof E?z.error=e.message:z.error=x.GENERIC_PAYMENT_ERROR,z.isPaymentInProgress=!1,d.P.showError(z.error),null}},async getBuyStatus(e,t){try{let a=await S({sessionId:t,exchangeId:e});return("SUCCESS"===a.status||"FAILED"===a.status)&&w.E.sendEvent({type:"track",event:"SUCCESS"===a.status?"PAY_SUCCESS":"PAY_ERROR",properties:{source:"pay",paymentId:z.paymentId||U,configuration:{network:z.paymentAsset.network,asset:z.paymentAsset.asset,recipient:z.recipient,amount:z.amount},currentPayment:{type:"exchange",exchangeId:z.currentPayment?.exchangeId,sessionId:z.currentPayment?.sessionId,result:a.txHash}}}),a}catch(e){throw new E(v.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(e,t){try{let a=await this.getBuyStatus(e,t);z.currentPayment&&(z.currentPayment.status=a.status,z.currentPayment.result=a.txHash),("SUCCESS"===a.status||"FAILED"===a.status)&&(z.isPaymentInProgress=!1)}catch(e){throw new E(v.UNABLE_TO_GET_BUY_STATUS)}},initiatePayment(){z.isPaymentInProgress=!0,z.paymentId=crypto.randomUUID()},initializeAnalytics(){z.analyticsSet||(z.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{if(z.currentPayment?.status&&"UNKNOWN"!==z.currentPayment.status){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[z.currentPayment.status];w.E.sendEvent({type:"track",event:e,properties:{source:"pay",paymentId:z.paymentId||U,configuration:{network:z.paymentAsset.network,asset:z.paymentAsset.asset,recipient:z.recipient,amount:z.amount},currentPayment:{type:z.currentPayment.type,exchangeId:z.currentPayment.exchangeId,sessionId:z.currentPayment.sessionId,result:z.currentPayment.result}}})}}))}},W=(0,r.AH)`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }
`;var Z=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let G=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=L.state.exchanges,this.isLoading=L.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=n.U.state.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(L.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(L.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(n.U.subscribe(e=>this.connectedWalletInfo=e.connectedWalletInfo)),L.fetchExchanges()}get isWalletConnected(){return"connected"===n.U.state.status}render(){return(0,r.qy)`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="3">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="3">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){let e=L.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=L.state.amount.toString()}renderPayWithWallet(){return!function(e){let{chainNamespace:t}=y.C.parseCaipNetworkId(e);return $.includes(t)}(this.networkName)?(0,r.qy)``:(0,r.qy)`<wui-flex flexDirection="column" gap="3">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`}renderPaymentHeader(){let e=this.networkName;if(this.networkName){let t=s.W.getAllRequestedCaipNetworks().find(e=>e.caipNetworkId===this.networkName);t&&(e=t.name)}return(0,r.qy)`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="2">
          <wui-text variant="h1-regular" color="primary">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="1">
            <wui-text variant="md-medium" color="primary">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?(0,r.qy)`
                  <wui-text variant="sm-medium" color="secondary">
                    on ${e}
                  </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){let e=this.connectedWalletInfo?.name||"connected wallet";return(0,r.qy)`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        ?fullSize=${!0}
        ?rounded=${!0}
        data-testid="wallet-payment-option"
        imageSrc=${(0,o.J)(this.connectedWalletInfo?.icon)}
      >
        <wui-text variant="lg-regular" color="primary">Pay with ${e}</wui-text>
      </wui-list-item>

      <wui-list-item
        icon="power"
        ?rounded=${!0}
        iconColor="error"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
      </wui-list-item>
    `}renderDisconnectedView(){return(0,r.qy)`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="wallet"
      ?rounded=${!0}
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?(0,r.qy)`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:0===this.exchanges.length?(0,r.qy)`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>(0,r.qy)`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${null!==this.loadingExchangeId}
          ?loading=${this.loadingExchangeId===e.id}
          imageSrc=${(0,o.J)(e.imageUrl)}
        >
          <wui-flex alignItems="center" gap="3">
            <wui-text flexGrow="1" variant="md-medium" color="primary"
              >Pay with ${e.name} <wui-spinner size="sm" color="secondary"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){L.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;let t=await L.handlePayWithExchange(e);t&&(await c.W.open({view:"PayLoading"}),l.w.openHref(t.url,t.openInNewTab?"_blank":"_self"))}catch(e){console.error("Failed to pay with exchange",e),d.P.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await u.x.disconnect()}catch{console.error("Failed to disconnect"),d.P.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};G.styles=W,Z([(0,i.wk)()],G.prototype,"amount",void 0),Z([(0,i.wk)()],G.prototype,"tokenSymbol",void 0),Z([(0,i.wk)()],G.prototype,"networkName",void 0),Z([(0,i.wk)()],G.prototype,"exchanges",void 0),Z([(0,i.wk)()],G.prototype,"isLoading",void 0),Z([(0,i.wk)()],G.prototype,"loadingExchangeId",void 0),Z([(0,i.wk)()],G.prototype,"connectedWalletInfo",void 0),G=Z([(0,p.EM)("w3m-pay-view")],G);var B=a(45069),j=a(10899),Y=a(14744);a(64731);let V=(0,r.AH)`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }
`;var q=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let F=class extends r.WF{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=L.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return(0,r.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["7","5","5","5"]}
        gap="9"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="lg-medium" color="primary">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}updateMessages(){switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;default:L.state.currentPayment?.type==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet")}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();default:return this.loaderTemplate()}}setupExchangeSubscription(){L.state.currentPayment?.type==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{let e=L.state.currentPayment?.exchangeId,t=L.state.currentPayment?.sessionId;e&&t&&(await L.updateBuyStatus(e,t),L.state.currentPayment?.status==="SUCCESS"&&clearInterval(this.exchangeSubscription))},4e3))}setupSubscription(){L.subscribeKey("isPaymentInProgress",e=>{e||"in-progress"!==this.paymentState||(L.state.error||!L.state.currentPayment?.result?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{"disconnected"!==u.x.state.status&&c.W.close()},3e3))}),L.subscribeKey("error",e=>{e&&"in-progress"===this.paymentState&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){let e=B.W.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4,a=this.getPaymentIcon();return(0,r.qy)`
      <wui-flex justifyContent="center" alignItems="center" style="position: relative;">
        ${a?(0,r.qy)`<wui-wallet-image size="lg" imageSrc=${a}></wui-wallet-image>`:null}
        <wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>
      </wui-flex>
    `}getPaymentIcon(){let e=L.state.currentPayment;if(e){if("exchange"===e.type){let t=e.exchangeId;if(t){let e=L.getExchangeById(t);return e?.imageUrl}}if("wallet"===e.type){let e=n.U.state.connectedWalletInfo?.icon;if(e)return e;let t=s.W.state.activeChain;if(!t)return;let a=j.a.getConnectorId(t);if(!a)return;let r=j.a.getConnectorById(a);if(!r)return;return Y.$.getConnectorImage(r)}}}successTemplate(){return(0,r.qy)`<wui-icon size="xl" color="success" name="checkmark"></wui-icon>`}errorTemplate(){return(0,r.qy)`<wui-icon size="xl" color="error" name="close"></wui-icon>`}};async function H(e){return L.handleOpenPay(e)}async function K(e,t=3e5){if(t<=0)throw new E(v.INVALID_PAYMENT_CONFIG,"Timeout must be greater than 0");try{await H(e)}catch(e){if(e instanceof E)throw e;throw new E(v.UNABLE_TO_INITIATE_PAYMENT,e.message)}return new Promise((e,a)=>{var r;let i=!1,o=setTimeout(()=>{i||(i=!0,c(),a(new E(v.GENERIC_PAYMENT_ERROR,"Payment timeout")))},t);function n(){if(i)return;let t=L.state.currentPayment,a=L.state.error,r=L.state.isPaymentInProgress;if(t?.status==="SUCCESS"){i=!0,c(),clearTimeout(o),e({success:!0,result:t.result});return}if(t?.status==="FAILED"){i=!0,c(),clearTimeout(o),e({success:!1,error:a||"Payment failed"});return}!a||r||t||(i=!0,c(),clearTimeout(o),e({success:!1,error:a}))}let s=et("currentPayment",n),c=(r=[s,et("error",n),et("isPaymentInProgress",n)],()=>{r.forEach(e=>{try{e()}catch{}})});n()})}function J(){return L.getExchanges()}function X(){return L.state.currentPayment?.result}function Q(){return L.state.error}function ee(){return L.state.isPaymentInProgress}function et(e,t){return L.subscribeKey(e,t)}F.styles=V,q([(0,i.wk)()],F.prototype,"loadingMessage",void 0),q([(0,i.wk)()],F.prototype,"subMessage",void 0),q([(0,i.wk)()],F.prototype,"paymentState",void 0),F=q([(0,p.EM)("w3m-pay-loading-view")],F);let ea={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},er={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ei={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},eo={network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},en={network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},es={network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ec={network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},el={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ed={network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},eu={network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},ep={network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},eh={network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},eg={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},em={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}}},18294:(e,t,a)=>{var r=a(83138),i=a(98410);a(99691),a(45166);var o=a(71084),n=a(47327);a(84042);var s=a(20296);let c=(0,s.AH)`
  :host {
    position: relative;
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host([data-image='true']) {
    background-color: transparent;
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host([data-size='sm']) {
    width: 32px;
    height: 32px;
  }

  :host([data-size='md']) {
    width: 40px;
    height: 40px;
  }

  :host([data-size='lg']) {
    width: 56px;
    height: 56px;
  }

  :host([name='Extension'])::after {
    border: 1px solid ${({colors:e})=>e.accent010};
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid ${({colors:e})=>e.accent010};
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 32px;
    height: 32px;
  }

  wui-icon[data-parent-size='md'] {
    width: 40px;
    height: 40px;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: 1px;
  }
`;var l=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let d=class extends r.WF{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let e="1";return"lg"===this.size?e="4":"md"===this.size?e="2":"sm"===this.size&&(e="1"),this.style.cssText=`
       --local-border-radius: var(--apkt-borderRadius-${e});
   `,this.dataset.size=this.size,this.imageSrc&&(this.dataset.image="true"),this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),(0,r.qy)`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?(0,r.qy)`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?(0,r.qy)`<wui-icon size="md" color="default" name=${this.walletIcon}></wui-icon>`:(0,r.qy)`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="wallet"
    ></wui-icon>`}};d.styles=[o.W5,c],l([(0,i.MZ)()],d.prototype,"size",void 0),l([(0,i.MZ)()],d.prototype,"name",void 0),l([(0,i.MZ)()],d.prototype,"imageSrc",void 0),l([(0,i.MZ)()],d.prototype,"walletIcon",void 0),l([(0,i.MZ)({type:Boolean})],d.prototype,"installed",void 0),l([(0,i.MZ)()],d.prototype,"badgeSize",void 0),d=l([(0,n.E)("wui-wallet-image")],d)},26670:(e,t,a)=>{var r=a(83138),i=a(98410),o=a(78964);a(21129),a(24772);var n=a(71084),s=a(47327),c=a(20296);let l=(0,c.AH)`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      scale ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, scale;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-image {
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var d=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let u=class extends r.WF{constructor(){super(...arguments),this.imageSrc="google",this.loading=!1,this.disabled=!1,this.rightIcon=!0,this.rounded=!1,this.fullSize=!1}render(){return this.dataset.rounded=this.rounded?"true":"false",(0,r.qy)`
      <button
        ?disabled=${!!this.loading||!!this.disabled}
        data-loading=${this.loading}
        tabindex=${(0,o.J)(this.tabIdx)}
      >
        <wui-flex gap="2" alignItems="center">
          ${this.templateLeftIcon()}
          <wui-flex gap="1">
            <slot></slot>
          </wui-flex>
        </wui-flex>
        ${this.templateRightIcon()}
      </button>
    `}templateLeftIcon(){return this.icon?(0,r.qy)`<wui-image
        icon=${this.icon}
        iconColor=${(0,o.J)(this.iconColor)}
        ?boxed=${!0}
        ?rounded=${this.rounded}
      ></wui-image>`:(0,r.qy)`<wui-image
      ?boxed=${!0}
      ?rounded=${this.rounded}
      ?fullSize=${this.fullSize}
      src=${this.imageSrc}
    ></wui-image>`}templateRightIcon(){return this.rightIcon?this.loading?(0,r.qy)`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:(0,r.qy)`<wui-icon name="chevronRight" size="lg" color="default"></wui-icon>`:null}};u.styles=[n.W5,n.fD,l],d([(0,i.MZ)()],u.prototype,"imageSrc",void 0),d([(0,i.MZ)()],u.prototype,"icon",void 0),d([(0,i.MZ)()],u.prototype,"iconColor",void 0),d([(0,i.MZ)({type:Boolean})],u.prototype,"loading",void 0),d([(0,i.MZ)()],u.prototype,"tabIdx",void 0),d([(0,i.MZ)({type:Boolean})],u.prototype,"disabled",void 0),d([(0,i.MZ)({type:Boolean})],u.prototype,"rightIcon",void 0),d([(0,i.MZ)({type:Boolean})],u.prototype,"rounded",void 0),d([(0,i.MZ)({type:Boolean})],u.prototype,"fullSize",void 0),u=d([(0,s.E)("wui-list-item")],u)},27313:(e,t,a)=>{a.d(t,{a:()=>i});var r=a(83138);let i=(0,r.JW)`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`},37465:(e,t,a)=>{var r=a(83138),i=a(98410);a(99691),a(21129),a(24772);var o=a(71084),n=a(47327),s=a(20296);let c=(0,s.AH)`
  :host {
    width: var(--local-width);
  }

  button {
    width: var(--local-width);
    white-space: nowrap;
    column-gap: ${({spacing:e})=>e[2]};
    transition:
      scale ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: scale, background-color, border-radius;
    cursor: pointer;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[2]};
    padding: 0 ${({spacing:e})=>e[2]};
    height: 28px;
  }

  button[data-size='md'] {
    border-radius: ${({borderRadius:e})=>e[3]};
    padding: 0 ${({spacing:e})=>e[4]};
    height: 38px;
  }

  button[data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: 0 ${({spacing:e})=>e[5]};
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent-primary'] {
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='accent-secondary'] {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button[data-variant='neutral-primary'] {
    background-color: ${({tokens:e})=>e.theme.backgroundInvert};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='neutral-secondary'] {
    background-color: transparent;
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-variant='neutral-tertiary'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-variant='error-primary'] {
    background-color: ${({tokens:e})=>e.core.textError};
    color: ${({tokens:e})=>e.theme.textInvert};
  }

  button[data-variant='error-secondary'] {
    background-color: ${({tokens:e})=>e.core.backgroundError};
    color: ${({tokens:e})=>e.core.textError};
  }

  button[data-variant='shade'] {
    background: var(--wui-color-gray-glass-002);
    color: var(--wui-color-fg-200);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-size='sm']:focus-visible:enabled {
    border-radius: 28px;
  }

  button[data-size='md']:focus-visible:enabled {
    border-radius: 38px;
  }

  button[data-size='lg']:focus-visible:enabled {
    border-radius: 48px;
  }
  button[data-variant='shade']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button[data-size='sm']:hover:enabled {
      border-radius: 28px;
    }

    button[data-size='md']:hover:enabled {
      border-radius: 38px;
    }

    button[data-size='lg']:hover:enabled {
      border-radius: 48px;
    }

    button[data-variant='shade']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='shade']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }
  }

  button[data-size='sm']:active:enabled {
    border-radius: 28px;
  }

  button[data-size='md']:active:enabled {
    border-radius: 38px;
  }

  button[data-size='lg']:active:enabled {
    border-radius: 48px;
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    opacity: 0.3;
  }
`;var l=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let d={lg:"lg-regular-mono",md:"md-regular-mono",sm:"sm-regular-mono"},u={lg:"md",md:"md",sm:"sm"},p=class extends r.WF{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="accent-primary"}render(){this.style.cssText=`
    --local-width: ${this.fullWidth?"100%":"auto"};
     `;let e=this.textVariant??d[this.size];return(0,r.qy)`
      <button data-variant=${this.variant} data-size=${this.size} ?disabled=${this.disabled}>
        ${this.loadingTemplate()}
        <slot name="iconLeft"></slot>
        <wui-text variant=${e} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}loadingTemplate(){if(this.loading){let e=u[this.size],t="neutral-primary"===this.variant||"accent-primary"===this.variant?"invert":"primary";return(0,r.qy)`<wui-loading-spinner color=${t} size=${e}></wui-loading-spinner>`}return null}};p.styles=[o.W5,o.fD,c],l([(0,i.MZ)()],p.prototype,"size",void 0),l([(0,i.MZ)({type:Boolean})],p.prototype,"disabled",void 0),l([(0,i.MZ)({type:Boolean})],p.prototype,"fullWidth",void 0),l([(0,i.MZ)({type:Boolean})],p.prototype,"loading",void 0),l([(0,i.MZ)()],p.prototype,"variant",void 0),l([(0,i.MZ)()],p.prototype,"textVariant",void 0),p=l([(0,n.E)("wui-button")],p)},38534:(e,t,a)=>{var r=a(83138),i=a(98410),o=a(71084),n=a(8821),s=a(47327);let c=(0,r.AH)`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
    box-sizing: border-box;
  }
`;var l=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let d=class extends r.WF{render(){return this.style.cssText=`
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&n.Z.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&n.Z.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&n.Z.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&n.Z.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&n.Z.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&n.Z.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&n.Z.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&n.Z.getSpacingStyles(this.margin,3)};
      width: ${this.width};
    `,(0,r.qy)`<slot></slot>`}};d.styles=[o.W5,c],l([(0,i.MZ)()],d.prototype,"flexDirection",void 0),l([(0,i.MZ)()],d.prototype,"flexWrap",void 0),l([(0,i.MZ)()],d.prototype,"flexBasis",void 0),l([(0,i.MZ)()],d.prototype,"flexGrow",void 0),l([(0,i.MZ)()],d.prototype,"flexShrink",void 0),l([(0,i.MZ)()],d.prototype,"alignItems",void 0),l([(0,i.MZ)()],d.prototype,"justifyContent",void 0),l([(0,i.MZ)()],d.prototype,"columnGap",void 0),l([(0,i.MZ)()],d.prototype,"rowGap",void 0),l([(0,i.MZ)()],d.prototype,"gap",void 0),l([(0,i.MZ)()],d.prototype,"padding",void 0),l([(0,i.MZ)()],d.prototype,"margin",void 0),l([(0,i.MZ)()],d.prototype,"width",void 0),d=l([(0,s.E)("wui-flex")],d)},39752:(e,t,a)=>{var r=a(83138),i=a(98410);a(24772);var o=a(71084),n=a(47327),s=a(20296);let c=(0,s.AH)`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: ${({tokens:e})=>e.theme.borderPrimary};
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 8px;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }
`;var l=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let d=class extends r.WF{constructor(){super(...arguments),this.text=""}render(){return(0,r.qy)`${this.template()}`}template(){return this.text?(0,r.qy)`<wui-text variant="md-regular" color="secondary">${this.text}</wui-text>`:null}};d.styles=[o.W5,c],l([(0,i.MZ)()],d.prototype,"text",void 0),d=l([(0,n.E)("wui-separator")],d)},40575:(e,t,a)=>{a(38534)},41028:(e,t,a)=>{a(37465)},41163:(e,t,a)=>{a(24772)},51568:(e,t,a)=>{a(4693)},56975:(e,t,a)=>{var r=a(83138),i=a(98410);let o=(0,r.JW)`<svg width="86" height="96" fill="none">
  <path
    d="M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z"
  />
</svg>`;var n=a(27313);let s=(0,r.JW)`
  <svg fill="none" viewBox="0 0 36 40">
    <path
      d="M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z"
    />
  </svg>
`;a(99691),a(45166);var c=a(71084),l=a(47327),d=a(20296);let u=(0,d.AH)`
  :host {
    position: relative;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-round='true']) {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 100%;
    outline: 1px solid ${({tokens:e})=>e.core.glass010};
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  svg > path {
    stroke: var(--local-stroke);
  }

  wui-image {
    width: 100%;
    height: 100%;
    -webkit-clip-path: var(--local-path);
    clip-path: var(--local-path);
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon {
    transform: translateY(-5%);
    width: var(--local-icon-size);
    height: var(--local-icon-size);
  }
`;var p=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let h=class extends r.WF{constructor(){super(...arguments),this.size="md",this.name="uknown",this.networkImagesBySize={sm:s,md:n.a,lg:o},this.selected=!1,this.round=!1}render(){return this.round?(this.dataset.round="true",this.style.cssText=`
      --local-width: var(--apkt-spacing-10);
      --local-height: var(--apkt-spacing-10);
      --local-icon-size: var(--apkt-spacing-4);
    `):this.style.cssText=`

      --local-path: var(--apkt-path-network-${this.size});
      --local-width:  var(--apkt-width-network-${this.size});
      --local-height:  var(--apkt-height-network-${this.size});
      --local-icon-size:  var(--apkt-spacing-${({sm:"4",md:"6",lg:"10"})[this.size]});
    `,(0,r.qy)`${this.templateVisual()} ${this.svgTemplate()} `}svgTemplate(){return this.round?null:this.networkImagesBySize[this.size]}templateVisual(){return this.imageSrc?(0,r.qy)`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:(0,r.qy)`<wui-icon size="inherit" color="default" name="networkPlaceholder"></wui-icon>`}};h.styles=[c.W5,u],p([(0,i.MZ)()],h.prototype,"size",void 0),p([(0,i.MZ)()],h.prototype,"name",void 0),p([(0,i.MZ)({type:Object})],h.prototype,"networkImagesBySize",void 0),p([(0,i.MZ)()],h.prototype,"imageSrc",void 0),p([(0,i.MZ)({type:Boolean})],h.prototype,"selected",void 0),p([(0,i.MZ)({type:Boolean})],h.prototype,"round",void 0),h=p([(0,l.E)("wui-network-image")],h)},64731:(e,t,a)=>{var r=a(83138),i=a(98410),o=a(71084),n=a(47327),s=a(20296);let c=(0,s.AH)`
  :host {
    display: block;
    width: 100px;
    height: 100px;
  }

  svg {
    width: 100px;
    height: 100px;
  }

  rect {
    fill: none;
    stroke: ${e=>e.colors.accent100};
    stroke-width: 3px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var l=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let d=class extends r.WF{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let e=this.radius>50?50:this.radius,t=36-e;return(0,r.qy)`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${116+t} ${245+t}"
          stroke-dashoffset=${360+1.75*t}
        />
      </svg>
    `}};d.styles=[o.W5,c],l([(0,i.MZ)({type:Number})],d.prototype,"radius",void 0),d=l([(0,n.E)("wui-loading-thumbnail")],d)},71596:(e,t,a)=>{var r=a(83138),i=a(98410);a(99691);var o=a(71084),n=a(47327),s=a(20296);let c=(0,s.AH)`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var l=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let d=class extends r.WF{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.fullWidth=!1,this.disabled=!1}render(){return(0,r.qy)`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon}></wui-icon>
    </button>`}};d.styles=[o.W5,o.fD,c],l([(0,i.MZ)()],d.prototype,"icon",void 0),l([(0,i.MZ)()],d.prototype,"variant",void 0),l([(0,i.MZ)()],d.prototype,"type",void 0),l([(0,i.MZ)()],d.prototype,"size",void 0),l([(0,i.MZ)({type:Boolean})],d.prototype,"fullWidth",void 0),l([(0,i.MZ)({type:Boolean})],d.prototype,"disabled",void 0),d=l([(0,n.E)("wui-icon-button")],d)},75484:(e,t,a)=>{a(21129)},77237:(e,t,a)=>{a(99691)},80205:(e,t,a)=>{a(45166)},84042:(e,t,a)=>{var r=a(83138),i=a(98410),o=a(78964);a(99691);var n=a(71084),s=a(47327),c=a(20296);let l=(0,c.AH)`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({borderRadius:e})=>e[2]};
    padding: ${({spacing:e})=>e[1]} !important;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    position: relative;
  }

  :host([data-padding='2']) {
    padding: ${({spacing:e})=>e[2]} !important;
  }

  :host:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host > wui-icon {
    z-index: 10;
  }

  /* -- Colors --------------------------------------------------- */
  :host([data-color='accent-primary']) {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  :host([data-color='accent-primary']):after {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  :host([data-color='default']),
  :host([data-color='secondary']) {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  :host([data-color='default']):after {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-color='secondary']):after {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  :host([data-color='success']) {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  :host([data-color='success']):after {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  :host([data-color='error']) {
    color: ${({tokens:e})=>e.core.iconError};
  }

  :host([data-color='error']):after {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  :host([data-color='warning']) {
    color: ${({tokens:e})=>e.core.iconWarning};
  }

  :host([data-color='warning']):after {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
  }

  :host([data-color='inverse']) {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  :host([data-color='inverse']):after {
    background-color: transparent;
  }
`;var d=function(e,t,a,r){var i,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(o<3?i(n):o>3?i(t,a,n):i(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let u=class extends r.WF{constructor(){super(...arguments),this.icon="copy",this.size="md",this.padding="1",this.color="default"}render(){return this.dataset.padding=this.padding,this.dataset.color=this.color,(0,r.qy)`
      <wui-icon size=${(0,o.J)(this.size)} name=${this.icon} color="inherit"></wui-icon>
    `}};u.styles=[n.W5,n.fD,l],d([(0,i.MZ)()],u.prototype,"icon",void 0),d([(0,i.MZ)()],u.prototype,"size",void 0),d([(0,i.MZ)()],u.prototype,"padding",void 0),d([(0,i.MZ)()],u.prototype,"color",void 0),u=d([(0,s.E)("wui-icon-box")],u)}}]);