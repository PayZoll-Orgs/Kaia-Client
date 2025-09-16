"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[113],{4959:(e,t,a)=>{a.d(t,{I:()=>s});var i=a(12661),r=a(98866),o=a(36964);let n=(0,i.BX)({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),s=(0,o.X)({state:n,subscribe:e=>(0,i.B1)(n,()=>e(n)),subscribeKey:(e,t)=>(0,r.u$)(n,e,t),showTooltip({message:e,triggerRect:t,variant:a}){n.open=!0,n.message=e,n.triggerRect=t,n.variant=a},hide(){n.open=!1,n.message="",n.triggerRect={width:0,height:0,top:0,left:0}}})},21471:(e,t,a)=>{a.d(t,{y:()=>s});var i=a(45553),r=a(55480),o=a(67869),n=a(91867);let s={getTabsByNamespace:e=>e&&e===i.o.CHAIN.EVM?r.H.state.remoteFeatures?.activity===!1?n.o.ACCOUNT_TABS.filter(e=>"Activity"!==e.label):n.o.ACCOUNT_TABS:[],isValidReownName:e=>/^[a-zA-Z0-9]+$/gu.test(e),isValidEmail:e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(e),validateReownName:e=>e.replace(/\^/gu,"").toLowerCase().replace(/[^a-zA-Z0-9]/gu,""),hasFooter(){let e=o.I.state.view;if(n.o.VIEWS_WITH_LEGAL_FOOTER.includes(e)){let{termsConditionsUrl:e,privacyPolicyUrl:t}=r.H.state,a=r.H.state.features?.legalCheckbox;return(!!e||!!t)&&!a}return n.o.VIEWS_WITH_DEFAULT_FOOTER.includes(e)}}},22588:(e,t,a)=>{a.d(t,{J:()=>w});var i=a(83138),r=a(98410),o=a(67869),n=a(36211);a(65110);let s=(0,n.AH)`
  :host {
    display: block;
    width: inherit;
  }
`;var c=function(e,t,a,i){var r,o=arguments.length,n=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(o<3?r(n):o>3?r(t,a,n):r(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let w=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.viewState=o.I.state.view,this.history=o.I.state.history.join(","),this.unsubscribe.push(o.I.subscribeKey("view",()=>{this.history=o.I.state.history.join(","),document.documentElement.style.setProperty("--apkt-duration-dynamic","var(--apkt-durations-lg)")}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),document.documentElement.style.setProperty("--apkt-duration-dynamic","0s")}render(){return(0,i.qy)`${this.templatePageContainer()}`}templatePageContainer(){return(0,i.qy)`<w3m-router-container
      history=${this.history}
      .setView=${()=>{this.viewState=o.I.state.view}}
    >
      ${this.viewTemplate(this.viewState)}
    </w3m-router-container>`}viewTemplate(e){switch(e){case"AccountSettings":return(0,i.qy)`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return(0,i.qy)`<w3m-account-view></w3m-account-view>`;case"AllWallets":return(0,i.qy)`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return(0,i.qy)`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return(0,i.qy)`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return(0,i.qy)`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return(0,i.qy)`<w3m-connect-view></w3m-connect-view>`;case"Create":return(0,i.qy)`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return(0,i.qy)`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return(0,i.qy)`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return(0,i.qy)`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return(0,i.qy)`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return(0,i.qy)`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return(0,i.qy)`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return(0,i.qy)`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"DataCapture":return(0,i.qy)`<w3m-data-capture-view></w3m-data-capture-view>`;case"DataCaptureOtpConfirm":return(0,i.qy)`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case"Downloads":return(0,i.qy)`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return(0,i.qy)`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return(0,i.qy)`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return(0,i.qy)`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return(0,i.qy)`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return(0,i.qy)`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return(0,i.qy)`<w3m-network-switch-view></w3m-network-switch-view>`;case"ProfileWallets":return(0,i.qy)`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case"Transactions":return(0,i.qy)`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return(0,i.qy)`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampTokenSelect":return(0,i.qy)`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return(0,i.qy)`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return(0,i.qy)`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return(0,i.qy)`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return(0,i.qy)`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return(0,i.qy)`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return(0,i.qy)`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return(0,i.qy)`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return(0,i.qy)`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return(0,i.qy)`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return(0,i.qy)`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return(0,i.qy)`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return(0,i.qy)`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WalletSendConfirmed":return(0,i.qy)`<w3m-send-confirmed-view></w3m-send-confirmed-view>`;case"WhatIsABuy":return(0,i.qy)`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return(0,i.qy)`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return(0,i.qy)`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return(0,i.qy)`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return(0,i.qy)`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return(0,i.qy)`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return(0,i.qy)`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return(0,i.qy)`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return(0,i.qy)`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return(0,i.qy)`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return(0,i.qy)`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return(0,i.qy)`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return(0,i.qy)`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return(0,i.qy)`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return(0,i.qy)`<w3m-pay-loading-view></w3m-pay-loading-view>`;case"FundWallet":return(0,i.qy)`<w3m-fund-wallet-view></w3m-fund-wallet-view>`;case"PayWithExchange":return(0,i.qy)`<w3m-deposit-from-exchange-view></w3m-deposit-from-exchange-view>`;case"PayWithExchangeSelectAsset":return(0,i.qy)`<w3m-deposit-from-exchange-select-asset-view></w3m-deposit-from-exchange-select-asset-view>`}}};w.styles=[s],c([(0,r.wk)()],w.prototype,"viewState",void 0),c([(0,r.wk)()],w.prototype,"history",void 0),w=c([(0,n.EM)("w3m-router")],w)},35135:(e,t,a)=>{var i=a(83138),r=a(98410),o=a(4959),n=a(36211);a(40575),a(77237),a(41163);let s=(0,n.AH)`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px ${({spacing:e})=>e["3"]} 10px ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    color: ${({tokens:e})=>e.theme.backgroundPrimary};
    position: absolute;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--apkt-modal-width) - ${({spacing:e})=>e["5"]});
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.textPrimary};
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var c=function(e,t,a,i){var r,o=arguments.length,n=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(o<3?r(n):o>3?r(t,a,n):r(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let w=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.open=o.I.state.open,this.message=o.I.state.message,this.triggerRect=o.I.state.triggerRect,this.variant=o.I.state.variant,this.unsubscribe.push(o.I.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;let e=this.triggerRect.top,t=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${e}px;
    --w3m-tooltip-left: ${t}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${+!!this.open};
    `,(0,i.qy)`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};w.styles=[s],c([(0,r.wk)()],w.prototype,"open",void 0),c([(0,r.wk)()],w.prototype,"message",void 0),c([(0,r.wk)()],w.prototype,"triggerRect",void 0),c([(0,r.wk)()],w.prototype,"variant",void 0),w=c([(0,n.EM)("w3m-tooltip")],w)},44036:(e,t,a)=>{a(50505)},50505:(e,t,a)=>{var i=a(83138),r=a(98410);a(99691),a(24772);var o=a(71084),n=a(47327),s=a(20296);let c=(0,s.AH)`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    text-transform: uppercase;
  }

  :host([data-variant='accent']) {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  :host([data-variant='info']) {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  :host([data-variant='success']) {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    color: ${({tokens:e})=>e.core.textSuccess};
  }

  :host([data-variant='warning']) {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
    color: ${({tokens:e})=>e.core.textWarning};
  }

  :host([data-variant='error']) {
    background-color: ${({tokens:e})=>e.core.backgroundError};
    color: ${({tokens:e})=>e.core.textError};
  }

  :host([data-variant='certified']) {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  :host([data-size='md']) {
    height: 30px;
    padding: 0 ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-size='sm']) {
    height: 20px;
    padding: 0 ${({spacing:e})=>e[1]};
    border-radius: ${({borderRadius:e})=>e[1]};
  }
`;var w=function(e,t,a,i){var r,o=arguments.length,n=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(o<3?r(n):o>3?r(t,a,n):r(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let l=class extends i.WF{constructor(){super(...arguments),this.variant="accent",this.size="md",this.icon=void 0}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let e="md"===this.size?"md-medium":"sm-medium",t="md"===this.size?"md":"sm";return(0,i.qy)`
      ${this.icon?(0,i.qy)`<wui-icon size=${t} name=${this.icon}></wui-icon>`:null}
      <wui-text data-variant=${this.variant} variant=${e} color="inherit">
        <slot></slot>
      </wui-text>
    `}};l.styles=[o.W5,c],w([(0,r.MZ)()],l.prototype,"variant",void 0),w([(0,r.MZ)()],l.prototype,"size",void 0),w([(0,r.MZ)()],l.prototype,"icon",void 0),l=w([(0,n.E)("wui-tag")],l)},65110:(e,t,a)=>{a.d(t,{H:()=>m});var i=a(83138),r=a(98410),o=a(67869),n=a(70417),s=a(36211);a(65685),a(25784);var c=a(21471);let w=(0,s.AH)`
  :host {
    display: block;
  }

  div.container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    height: auto;
    display: block;
  }

  div.container[status='hide'] {
    animation: fade-out;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: both;
    animation-delay: 0s;
  }

  div.container[status='show'] {
    animation: fade-in;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      filter: blur(6px);
    }
    to {
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
      filter: blur(0px);
    }
    to {
      opacity: 0;
      filter: blur(6px);
    }
  }
`;var l=function(e,t,a,i){var r,o=arguments.length,n=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,a,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(o<3?r(n):o>3?r(t,a,n):r(t,a))||n);return o>3&&n&&Object.defineProperty(t,a,n),n};let m=class extends i.WF{constructor(){super(...arguments),this.resizeObserver=void 0,this.unsubscribe=[],this.status="hide",this.view=o.I.state.view}firstUpdated(){this.status=c.y.hasFooter()?"show":"hide",this.unsubscribe.push(o.I.subscribeKey("view",e=>{this.view=e,this.status=c.y.hasFooter()?"show":"hide","hide"===this.status&&document.documentElement.style.setProperty("--apkt-footer-height","0px")})),this.resizeObserver=new ResizeObserver(e=>{for(let t of e)if(t.target===this.getWrapper()){let e=`${t.contentRect.height}px`;document.documentElement.style.setProperty("--apkt-footer-height",e)}}),this.resizeObserver.observe(this.getWrapper())}render(){return(0,i.qy)`
      <div class="container" status=${this.status}>${this.templatePageContainer()}</div>
    `}templatePageContainer(){return c.y.hasFooter()?(0,i.qy)` ${this.templateFooter()}`:null}templateFooter(){switch(this.view){case"Networks":return this.templateNetworksFooter();case"Connect":case"ConnectWallets":case"OnRampFiatSelect":case"OnRampTokenSelect":return(0,i.qy)`<w3m-legal-footer></w3m-legal-footer>`;case"OnRampProviders":return(0,i.qy)`<w3m-onramp-providers-footer></w3m-onramp-providers-footer>`;default:return null}}templateNetworksFooter(){return(0,i.qy)` <wui-flex
      class="footer-in"
      padding="3"
      flexDirection="column"
      gap="3"
      alignItems="center"
    >
      <wui-text variant="md-regular" color="secondary" align="center">
        Your connected wallet may not support some of the networks available for this dApp
      </wui-text>
      <wui-link @click=${this.onNetworkHelp.bind(this)}>
        <wui-icon size="sm" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
        What is a network
      </wui-link>
    </wui-flex>`}onNetworkHelp(){n.E.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),o.I.push("WhatIsANetwork")}getWrapper(){return this.shadowRoot?.querySelector("div.container")}};m.styles=[w],l([(0,r.wk)()],m.prototype,"status",void 0),l([(0,r.wk)()],m.prototype,"view",void 0),m=l([(0,s.EM)("w3m-footer")],m)}}]);