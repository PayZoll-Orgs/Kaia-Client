"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5589],{10338:(e,t,o)=>{o.r(t),o.d(t,{AppKitModal:()=>el,W3mModal:()=>ec,W3mModalBase:()=>es,W3mRouterContainer:()=>ep});var r=o(83138),i=o(98410),a=o(78964),n=o(65103),s=o(45553),c=o(55480),l=o(81701),d=o(93481),u=o(10899),p=o(72880),h=o(67869),w=o(3824),g=o(67243);let m={isUnsupportedChainView:()=>"UnsupportedChain"===h.I.state.view||"SwitchNetwork"===h.I.state.view&&h.I.state.history.includes("UnsupportedChain"),async safeClose(){if(this.isUnsupportedChainView()||await g.U.isSIWXCloseDisabled())return void l.W.shake();("DataCapture"===h.I.state.view||"DataCaptureOtpConfirm"===h.I.state.view)&&w.x.disconnect(),l.W.close()}};var f=o(45069),b=o(65374),y=o(12319),v=o(24836),x=o(36211),k=o(71084),$=o(47327),C=o(20296);let S=(0,C.AH)`
  :host {
    display: block;
    border-radius: clamp(0px, ${({borderRadius:e})=>e["8"]}, 44px);
    box-shadow: 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    overflow: hidden;
  }
`,W=class extends r.WF{render(){return(0,r.qy)`<slot></slot>`}};W.styles=[k.W5,S],W=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n}([(0,$.E)("wui-card")],W),o(40575);var P=o(52502);o(99691),o(24772),o(38534);let A=(0,C.AH)`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[6]};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  :host > wui-flex[data-type='info'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};

      wui-icon {
        color: ${({tokens:e})=>e.theme.iconDefault};
      }
    }
  }
  :host > wui-flex[data-type='success'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderSuccess};
      }
    }
  }
  :host > wui-flex[data-type='warning'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundWarning};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderWarning};
      }
    }
  }
  :host > wui-flex[data-type='error'] {
    .icon-box {
      background-color: ${({tokens:e})=>e.core.backgroundError};

      wui-icon {
        color: ${({tokens:e})=>e.core.borderError};
      }
    }
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e["2"]};
    background-color: var(--local-icon-bg-value);
  }
`;var E=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let I={info:"info",success:"checkmark",warning:"warningCircle",error:"warning"},O=class extends r.WF{constructor(){super(...arguments),this.message="",this.type="info"}render(){return(0,r.qy)`
      <wui-flex
        data-type=${(0,a.J)(this.type)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="2"
      >
        <wui-flex columnGap="2" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color="inherit" size="md" name=${I[this.type]}></wui-icon>
          </wui-flex>
          <wui-text variant="md-medium" color="inherit" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="inherit"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){P.h.close()}};O.styles=[k.W5,A],E([(0,i.MZ)()],O.prototype,"message",void 0),E([(0,i.MZ)()],O.prototype,"type",void 0),O=E([(0,$.E)("wui-alertbar")],O);let R=(0,x.AH)`
  :host {
    display: block;
    position: absolute;
    top: ${({spacing:e})=>e["3"]};
    left: ${({spacing:e})=>e["4"]};
    right: ${({spacing:e})=>e["4"]};
    opacity: 0;
    pointer-events: none;
  }
`;var N=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let T={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"warning"}},D=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.open=P.h.state.open,this.onOpen(!0),this.unsubscribe.push(P.h.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t}=P.h.state,o=T[t];return(0,r.qy)`
      <wui-alertbar
        message=${e}
        backgroundColor=${o?.backgroundColor}
        iconColor=${o?.iconColor}
        icon=${o?.icon}
        type=${t}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};D.styles=R,N([(0,i.wk)()],D.prototype,"open",void 0),D=N([(0,x.EM)("w3m-alertbar")],D);var z=o(58051),j=o(14744),M=o(29936),H=o(70417);o(71596),o(45166);let Z=(0,C.AH)`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-image {
    border-radius: 100%;
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
  }

  .left-icon-container,
  .right-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='lg'] wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .left-icon-container {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .left-icon-container {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .left-icon-container {
    width: 16px;
    height: 16px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-type='filled-dropdown'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button[data-type='text-dropdown'] {
    background-color: transparent;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    opacity: 0.5;
  }
`;var B=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let q={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},F={lg:"lg",md:"md",sm:"sm"},U=class extends r.WF{constructor(){super(...arguments),this.imageSrc="",this.text="",this.size="lg",this.type="text-dropdown",this.disabled=!1}render(){return(0,r.qy)`<button ?disabled=${this.disabled} data-size=${this.size} data-type=${this.type}>
      ${this.imageTemplate()} ${this.textTemplate()}
      <wui-flex class="right-icon-container">
        <wui-icon name="chevronBottom"></wui-icon>
      </wui-flex>
    </button>`}textTemplate(){let e=q[this.size];return this.text?(0,r.qy)`<wui-text color="primary" variant=${e}>${this.text}</wui-text>`:null}imageTemplate(){if(this.imageSrc)return(0,r.qy)`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`;let e=F[this.size];return(0,r.qy)` <wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}};U.styles=[k.W5,k.fD,Z],B([(0,i.MZ)()],U.prototype,"imageSrc",void 0),B([(0,i.MZ)()],U.prototype,"text",void 0),B([(0,i.MZ)()],U.prototype,"size",void 0),B([(0,i.MZ)()],U.prototype,"type",void 0),B([(0,i.MZ)({type:Boolean})],U.prototype,"disabled",void 0),U=B([(0,$.E)("wui-select")],U),o(44036),o(41163);var L=o(91867);let K=(0,x.AH)`
  :host {
    height: 60px;
  }

  :host > wui-flex {
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  wui-text {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards ${({easings:e})=>e["ease-out-power-2"]},
      slide-down-in 120ms forwards ${({easings:e})=>e["ease-out-power-2"]};
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards ${({easings:e})=>e["ease-out-power-2"]},
      slide-up-in 120ms forwards ${({easings:e})=>e["ease-out-power-2"]};
    animation-delay: 0ms, 200ms;
  }

  wui-icon-button[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;var _=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let V=["SmartSessionList"];function Y(){let e=h.I.state.data?.connector?.name,t=h.I.state.data?.wallet?.name,o=h.I.state.data?.network?.name,r=t??e,i=u.a.getConnectors(),a=1===i.length&&i[0]?.id==="w3m-email";return{Connect:`Connect ${a?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",ConnectingExternal:r??"Connect Wallet",ConnectingWalletConnect:r??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview Convert",Downloads:r?`Get ${r}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a Wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:o??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade Your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose Name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select Token",SwapPreview:"Preview Swap",WalletSend:"Send",WalletSendPreview:"Review Send",WalletSendSelectToken:"Select Token",WalletSendConfirmed:"Confirmed",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a Wallet?",ConnectWallets:"Connect Wallet",ConnectSocials:"All Socials",ConnectingSocial:z.U.state.socialProvider?z.U.state.socialProvider.charAt(0).toUpperCase()+z.U.state.socialProvider.slice(1):"Connect Social",ConnectingMultiChain:"Select Chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch Chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Payment in Progress",DataCapture:"Profile",DataCaptureOtpConfirm:"Confirm Email",FundWallet:"Fund Wallet",PayWithExchange:"Deposit from Exchange",PayWithExchangeSelectAsset:"Select Asset"}}let X=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.heading=Y()[h.I.state.view],this.network=d.W.state.activeCaipNetwork,this.networkImage=j.$.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=h.I.state.view,this.viewDirection="",this.unsubscribe.push(M.j.subscribeNetworkImages(()=>{this.networkImage=j.$.getNetworkImage(this.network)}),h.I.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.heading=Y()[e]},L.o.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),d.W.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=j.$.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,r.qy)`
      <wui-flex
        .padding=${["0","4","0","4"]}
        justifyContent="space-between"
        alignItems="center"
      >
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){H.E.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),h.I.push("WhatIsAWallet")}async onClose(){await m.safeClose()}rightHeaderTemplate(){let e=c.H?.state?.features?.smartSessions;return"Account"===h.I.state.view&&e?(0,r.qy)`<wui-flex>
      <wui-icon-button
        icon="clock"
        size="lg"
        type="neutral"
        variant="primary"
        @click=${()=>h.I.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-button>
      ${this.closeButtonTemplate()}
    </wui-flex> `:this.closeButtonTemplate()}closeButtonTemplate(){return(0,r.qy)`
      <wui-icon-button
        icon="close"
        size="lg"
        type="neutral"
        variant="primary"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-button>
    `}titleTemplate(){let e=V.includes(this.view);return(0,r.qy)`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="2"
      >
        <wui-text variant="lg-regular" color="primary" data-testid="w3m-header-text">
          ${this.heading}
        </wui-text>
        ${e?(0,r.qy)`<wui-tag variant="accent" size="md">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){let{view:e}=h.I.state,t="Connect"===e,o=c.H.state.enableEmbedded,i=c.H.state.enableNetworkSwitch;return"Account"===e&&i?(0,r.qy)`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${(0,a.J)(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${(0,a.J)(this.networkImage)}
      ></wui-select>`:this.showBack&&!("ApproveTransaction"===e||"ConnectingSiwe"===e||t&&o)?(0,r.qy)`<wui-icon-button
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        size="lg"
        type="neutral"
        variant="primary"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-button>`:(0,r.qy)`<wui-icon-button
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      size="lg"
      type="neutral"
      variant="primary"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-button>`}onNetworks(){this.isAllowedNetworkSwitch()&&(H.E.sendEvent({type:"track",event:"CLICK_NETWORKS"}),h.I.push("Networks"))}isAllowedNetworkSwitch(){let e=d.W.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,o=e?.find(({id:e})=>e===this.network?.id);return t||!o}onViewChange(){let{history:e}=h.I.state,t=L.o.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=L.o.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){let{history:e}=h.I.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){h.I.goBack()}};X.styles=K,_([(0,i.wk)()],X.prototype,"heading",void 0),_([(0,i.wk)()],X.prototype,"network",void 0),_([(0,i.wk)()],X.prototype,"networkImage",void 0),_([(0,i.wk)()],X.prototype,"showBack",void 0),_([(0,i.wk)()],X.prototype,"prevHistoryLength",void 0),_([(0,i.wk)()],X.prototype,"view",void 0),_([(0,i.wk)()],X.prototype,"viewDirection",void 0),X=_([(0,x.EM)("w3m-header")],X),o(21129),o(84042);let G=(0,C.AH)`
  :host {
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow:
      0px 0px 8px 0px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px ${({tokens:e})=>e.theme.borderPrimary};
    max-width: 320px;
  }

  wui-icon-box {
    border-radius: ${({borderRadius:e})=>e.round} !important;
    overflow: hidden;
  }

  wui-loading-spinner {
    padding: ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    border-radius: ${({borderRadius:e})=>e.round} !important;
  }
`;var J=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let Q=class extends r.WF{constructor(){super(...arguments),this.message="",this.variant="success"}render(){return(0,r.qy)`
      ${this.templateIcon()}
      <wui-text variant="lg-regular" color="primary" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return"loading"===this.variant?(0,r.qy)`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:(0,r.qy)`<wui-icon-box
      size="md"
      color=${({success:"success",error:"error",warning:"warning",info:"default"})[this.variant]}
      icon=${({success:"checkmark",error:"warning",warning:"warningCircle",info:"info"})[this.variant]}
    ></wui-icon-box>`}};Q.styles=[k.W5,G],J([(0,i.MZ)()],Q.prototype,"message",void 0),J([(0,i.MZ)()],Q.prototype,"variant",void 0),Q=J([(0,$.E)("wui-snackbar")],Q);let ee=(0,r.AH)`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var et=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let eo=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=b.P.state.open,this.unsubscribe.push(b.P.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t}=b.P.state;return(0,r.qy)` <wui-snackbar message=${e} variant=${t}></wui-snackbar> `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),b.P.state.autoClose&&(this.timeout=setTimeout(()=>b.P.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};eo.styles=ee,et([(0,i.wk)()],eo.prototype,"open",void 0),eo=et([(0,x.EM)("w3m-snackbar")],eo),o(35135);var er=o(21471);o(65110),o(22588);let ei=(0,x.AH)`
  :host {
    z-index: ${({tokens:e})=>e.core.zIndex};
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: ${({tokens:e})=>e.theme.overlay};
    backdrop-filter: blur(0px);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      backdrop-filter ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
    backdrop-filter: blur(8px);
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--apkt-modal-width);
    width: 100%;
    position: relative;
    outline: none;
    transform: translateY(4px);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    transition:
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: border-radius, background-color, transform, box-shadow;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: ${({spacing:e})=>e[1]};
    box-sizing: border-box;
  }

  :host(.open) wui-card {
    transform: translateY(0px);
  }

  wui-card::before {
    z-index: 1;
    pointer-events: none;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    transition: box-shadow ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    transition-delay: ${({durations:e})=>e.md};
    will-change: box-shadow;
  }

  :host([data-border='true']) wui-card::before {
    box-shadow: inset 0px 0px 0px 4px ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  :host([data-border='false']) wui-card::before {
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.borderPrimaryDark};
  }

  :host([data-border='true']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      card-background-border var(--apkt-duration-dynamic)
        ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: backwards, both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  :host([data-border='false']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      card-background-default var(--apkt-duration-dynamic)
        ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: backwards, both;
    animation-delay: 0s;
  }

  :host(.appkit-modal) wui-card {
    max-width: var(--apkt-modal-width);
  }

  wui-card[shake='true'] {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      w3m-shake ${({durations:e})=>e.xl}
        ${({easings:e})=>e["ease-out-power-2"]};
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--apkt-spacing-6) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: var(--local-border-bottom-mobile-radius);
      border-bottom-right-radius: var(--local-border-bottom-mobile-radius);
      border-bottom: none;
    }

    wui-card[shake='true'] {
      animation: w3m-shake 0.5s ${({easings:e})=>e["ease-out-power-2"]};
    }
  }

  @keyframes fade-in {
    0% {
      transform: scale(0.99) translateY(4px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes card-background-border {
    from {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  @keyframes card-background-default {
    from {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
  }
`;var ea=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let en="scroll-lock";class es extends r.WF{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=c.H.state.enableEmbedded,this.open=l.W.state.open,this.caipAddress=d.W.state.activeCaipAddress,this.caipNetwork=d.W.state.activeCaipNetwork,this.shake=l.W.state.shake,this.filterByNamespace=u.a.state.filterByNamespace,this.initializeTheming(),p.N.prefetchAnalyticsConfig(),this.unsubscribe.push(l.W.subscribeKey("open",e=>e?this.onOpen():this.onClose()),l.W.subscribeKey("shake",e=>this.shake=e),d.W.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),d.W.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),c.H.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),u.a.subscribeKey("filterByNamespace",e=>{this.filterByNamespace===e||d.W.getAccountData(e)?.caipAddress||(p.N.fetchRecommendedWallets(),this.filterByNamespace=e)}),h.I.subscribeKey("view",()=>{this.dataset.border=er.y.hasFooter()?"true":"false"}))}firstUpdated(){if(this.dataset.border=er.y.hasFooter()?"true":"false",this.caipAddress){if(this.enableEmbedded){l.W.close(),this.prefetch();return}this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return(this.style.cssText=`
      --local-border-bottom-mobile-radius: ${this.enableEmbedded?"clamp(0px, var(--apkt-borderRadius-8), 44px)":"0px"};
    `,this.enableEmbedded)?(0,r.qy)`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?(0,r.qy)`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return(0,r.qy)` <wui-card
      shake="${this.shake}"
      data-embedded="${(0,a.J)(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-footer></w3m-footer>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){await m.safeClose()}initializeTheming(){let{themeVariables:e,themeMode:t}=f.W.state,o=x.Zv.getColorTheme(t);(0,x.RF)(e,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),b.P.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement("style");e.dataset.w3m=en,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${en}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){let{tagName:o}=t.target;!o||o.includes("W3M-")||o.includes("WUI-")||e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){let t=d.W.state.isSwitchingNamespace,o="ProfileWallets"===h.I.state.view;e?await this.onConnected({caipAddress:e,isSwitchingNamespace:t,isInProfileView:o}):t||this.enableEmbedded||o||l.W.close(),await g.U.initializeIfEnabled(e),this.caipAddress=e,d.W.setIsSwitchingNamespace(!1)}async onConnected(e){if(e.isInProfileView)return;let{chainNamespace:t,chainId:o,address:r}=n.C.parseCaipAddress(e.caipAddress),i=`${t}:${o}`,a=!y.w.getPlainAddress(this.caipAddress),s=await g.U.getSessions({address:r,caipNetworkId:i}),c=!g.U.getSIWX()||s.some(e=>e.data.accountAddress===r),d=e.isSwitchingNamespace&&c&&!this.enableEmbedded,u=this.enableEmbedded&&a;d?h.I.goBack():u&&l.W.close()}onNewNetwork(e){let t=this.caipNetwork,o=t?.caipNetworkId?.toString(),r=t?.chainNamespace,i=e?.caipNetworkId?.toString(),a=e?.chainNamespace,n=o!==i,c=t?.name===s.o.UNSUPPORTED_NETWORK_NAME,u="ConnectingExternal"===h.I.state.view,p="ProfileWallets"===h.I.state.view,w=!d.W.getAccountData(e?.chainNamespace)?.caipAddress,g="UnsupportedChain"===h.I.state.view,m=l.W.state.open,f=!1;this.enableEmbedded&&"SwitchNetwork"===h.I.state.view&&(f=!0),n&&v.GN.resetState(),m&&!u&&!p&&(w?n&&(f=!0):g?f=!0:n&&r===a&&!c&&(f=!0)),f&&"SIWXSignMessage"!==h.I.state.view&&h.I.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(p.N.prefetch(),p.N.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}es.styles=ei,ea([(0,i.MZ)({type:Boolean})],es.prototype,"enableEmbedded",void 0),ea([(0,i.wk)()],es.prototype,"open",void 0),ea([(0,i.wk)()],es.prototype,"caipAddress",void 0),ea([(0,i.wk)()],es.prototype,"caipNetwork",void 0),ea([(0,i.wk)()],es.prototype,"shake",void 0),ea([(0,i.wk)()],es.prototype,"filterByNamespace",void 0);let ec=class extends es{};ec=ea([(0,x.EM)("w3m-modal")],ec);let el=class extends es{};el=ea([(0,x.EM)("appkit-modal")],el);let ed=(0,x.AH)`
  :host {
    --local-duration-height: 0s;
    --local-duration: ${({durations:e})=>e.lg};
    --local-transition: ${({easings:e})=>e["ease-out-power-2"]};
  }

  .container {
    display: block;
    overflow: hidden;
    overflow: hidden;
    position: relative;
    height: var(--local-container-height);
    transition: height var(--local-duration-height) var(--local-transition);
    will-change: height, padding-bottom;
  }

  .page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    width: inherit;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-bottom-left-radius: var(--local-border-bottom-radius);
    border-bottom-right-radius: var(--local-border-bottom-radius);
    transition: border-bottom-left-radius var(--local-duration) var(--local-transition);
  }

  .footer {
    height: var(--apkt-footer-height);
  }

  div.page[view-direction^='prev-'] .page-content {
    animation:
      slide-left-out var(--local-duration) forwards var(--local-transition),
      slide-left-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  div.page[view-direction^='next-'] .page-content {
    animation:
      slide-right-out var(--local-duration) forwards var(--local-transition),
      slide-right-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }
`;var eu=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let ep=class extends r.WF{constructor(){super(...arguments),this.resizeObserver=void 0,this.transitionDuration="0.15s",this.transitionFunction="",this.history="",this.view="",this.setView=void 0,this.viewDirection="",this.historyState="",this.previousHeight="0px"}updated(e){if(e.has("history")){let e=this.history;""!==this.historyState&&this.historyState!==e&&this.onViewChange(e)}e.has("transitionDuration")&&this.style.setProperty("--local-duration",this.transitionDuration),e.has("transitionFunction")&&this.style.setProperty("--local-transition",this.transitionFunction)}firstUpdated(){this.transitionFunction&&this.style.setProperty("--local-transition",this.transitionFunction),this.style.setProperty("--local-duration",this.transitionDuration),this.historyState=this.history,this.resizeObserver=new ResizeObserver(e=>{for(let t of e)if(t.target===this.getWrapper()){let e=t.contentRect.height,o=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");e+=o,this.style.setProperty("--local-border-bottom-radius",o?"var(--apkt-borderRadius-5)":"0px"),this.style.setProperty("--local-container-height",`${e}px`),"0px"!==this.previousHeight&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${e}px`}}),this.resizeObserver.observe(this.getWrapper())}disconnectedCallback(){let e=this.getWrapper();e&&this.resizeObserver&&this.resizeObserver.unobserve(e)}render(){return(0,r.qy)`
      <div class="container">
        <div class="page" view-direction="${this.viewDirection}">
          <div class="page-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}onViewChange(e){let t=e.split(",").filter(Boolean),o=this.historyState.split(",").filter(Boolean),r=o.length,i=t.length,a=t[t.length-1]||"",n=x.Zv.cssDurationToNumber(this.transitionDuration),s="";i>r?s="next":i<r?s="prev":i===r&&t[i-1]!==o[r-1]&&(s="next"),this.viewDirection=`${s}-${a}`,setTimeout(()=>{this.historyState=e,this.setView?.(a)},n),setTimeout(()=>{this.viewDirection=""},2*n)}getWrapper(){return this.shadowRoot?.querySelector("div.page")}};ep.styles=[ed],eu([(0,i.MZ)({type:String})],ep.prototype,"transitionDuration",void 0),eu([(0,i.MZ)({type:String})],ep.prototype,"transitionFunction",void 0),eu([(0,i.MZ)({type:String})],ep.prototype,"history",void 0),eu([(0,i.MZ)({type:String})],ep.prototype,"view",void 0),eu([(0,i.MZ)({attribute:!1})],ep.prototype,"setView",void 0),eu([(0,i.wk)()],ep.prototype,"viewDirection",void 0),eu([(0,i.wk)()],ep.prototype,"historyState",void 0),eu([(0,i.wk)()],ep.prototype,"previousHeight",void 0),ep=eu([(0,x.EM)("w3m-router-container")],ep)},13188:(e,t,o)=>{o.d(t,{C5:()=>a,Ky:()=>i,PG:()=>r});let r=/[.*+?^${}()|[\]\\]/gu,i=/[0-9,.]/u,a="https://reown.com"},25784:(e,t,o)=>{var r=o(83138),i=o(55480),a=o(70417),n=o(71305),s=o(93481),c=o(67869),l=o(36211);o(40575),o(77237),o(48352),o(41163);var d=o(73537);let u=(0,r.AH)``,p=class extends r.WF{render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=i.H.state;return e||t?(0,r.qy)`
      <wui-flex
        .padding=${["4","3","3","3"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
      >
        <wui-text color="secondary" variant="md-regular" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `:null}howDoesItWorkTemplate(){return(0,r.qy)` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){a.E.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:(0,n.lj)(s.W.state.activeChain)===d.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}}),c.I.push("WhatIsABuy")}};p.styles=[u],p=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n}([(0,l.EM)("w3m-onramp-providers-footer")],p)},36790:(e,t,o)=>{var r=o(83138);o(99691),o(24772),o(38534);var i=o(13188),a=o(71084),n=o(47327),s=o(20296);let c=(0,s.AH)`
  .reown-logo {
    height: 24px;
  }

  a {
    text-decoration: none;
    cursor: pointer;
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  a:hover {
    opacity: 0.9;
  }
`,l=class extends r.WF{render(){return(0,r.qy)`
      <a
        data-testid="ux-branding-reown"
        href=${i.C5}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="1"
          .padding=${["01","0","3","0"]}
        >
          <wui-text variant="sm-regular" color="inherit"> UX by </wui-text>
          <wui-icon name="reown" size="inherit" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};l.styles=[a.W5,a.fD,c],l=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n}([(0,n.E)("wui-ux-by-reown")],l)},38534:(e,t,o)=>{var r=o(83138),i=o(98410),a=o(71084),n=o(8821),s=o(47327);let c=(0,r.AH)`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
    box-sizing: border-box;
  }
`;var l=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let d=class extends r.WF{render(){return this.style.cssText=`
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
    `,(0,r.qy)`<slot></slot>`}};d.styles=[a.W5,c],l([(0,i.MZ)()],d.prototype,"flexDirection",void 0),l([(0,i.MZ)()],d.prototype,"flexWrap",void 0),l([(0,i.MZ)()],d.prototype,"flexBasis",void 0),l([(0,i.MZ)()],d.prototype,"flexGrow",void 0),l([(0,i.MZ)()],d.prototype,"flexShrink",void 0),l([(0,i.MZ)()],d.prototype,"alignItems",void 0),l([(0,i.MZ)()],d.prototype,"justifyContent",void 0),l([(0,i.MZ)()],d.prototype,"columnGap",void 0),l([(0,i.MZ)()],d.prototype,"rowGap",void 0),l([(0,i.MZ)()],d.prototype,"gap",void 0),l([(0,i.MZ)()],d.prototype,"padding",void 0),l([(0,i.MZ)()],d.prototype,"margin",void 0),l([(0,i.MZ)()],d.prototype,"width",void 0),d=l([(0,s.E)("wui-flex")],d)},40575:(e,t,o)=>{o(38534)},41163:(e,t,o)=>{o(24772)},48352:(e,t,o)=>{var r=o(83138),i=o(98410);o(99691),o(24772);var a=o(71084),n=o(47327),s=o(20296);let c=(0,s.AH)`
  button {
    border: none;
    background: transparent;
    height: 20px;
    padding: ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    border-radius: ${({borderRadius:e})=>e[1]};
    padding: 0 ${({spacing:e})=>e[1]};
    border-radius: ${({spacing:e})=>e[1]};
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent'] {
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button[data-variant='secondary'] {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[data-variant='accent']:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-variant='accent']:hover:enabled {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='secondary']:hover:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var l=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let d={sm:"sm-medium",md:"md-medium"},u={accent:"accent-primary",secondary:"secondary"},p=class extends r.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.variant="accent",this.icon=void 0}render(){return(0,r.qy)`
      <button ?disabled=${this.disabled} data-variant=${this.variant}>
        <slot name="iconLeft"></slot>
        <wui-text
          color=${u[this.variant]}
          variant=${d[this.size]}
        >
          <slot></slot>
        </wui-text>
        ${this.iconTemplate()}
      </button>
    `}iconTemplate(){return this.icon?(0,r.qy)`<wui-icon name=${this.icon} size="sm"></wui-icon>`:null}};p.styles=[a.W5,a.fD,c],l([(0,i.MZ)()],p.prototype,"size",void 0),l([(0,i.MZ)({type:Boolean})],p.prototype,"disabled",void 0),l([(0,i.MZ)()],p.prototype,"variant",void 0),l([(0,i.MZ)()],p.prototype,"icon",void 0),p=l([(0,n.E)("wui-link")],p)},65685:(e,t,o)=>{var r=o(83138),i=o(98410),a=o(55480),n=o(36211);o(40575),o(41163),o(36790);let s=(0,n.AH)`
  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: ${({spacing:e})=>e["3"]};
  }

  a {
    text-decoration: none;
    color: ${({tokens:e})=>e.core.textAccentPrimary};
    font-weight: 500;
  }
`;var c=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let l=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=a.H.state.remoteFeatures,this.unsubscribe.push(a.H.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=a.H.state,o=a.H.state.features?.legalCheckbox;return(e||t)&&!o?(0,r.qy)`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["4","3","3","3"]} justifyContent="center">
          <wui-text color="secondary" variant="md-regular" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `:(0,r.qy)`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=a.H.state;return e&&t?"and":""}termsTemplate(){let{termsConditionsUrl:e}=a.H.state;return e?(0,r.qy)`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){let{privacyPolicyUrl:e}=a.H.state;return e?(0,r.qy)`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?(0,r.qy)`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:(0,r.qy)`<wui-ux-by-reown></wui-ux-by-reown>`:null}};l.styles=[s],c([(0,i.wk)()],l.prototype,"remoteFeatures",void 0),l=c([(0,n.EM)("w3m-legal-footer")],l)},71596:(e,t,o)=>{var r=o(83138),i=o(98410);o(99691);var a=o(71084),n=o(47327),s=o(20296);let c=(0,s.AH)`
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
`;var l=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let d=class extends r.WF{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.fullWidth=!1,this.disabled=!1}render(){return(0,r.qy)`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon}></wui-icon>
    </button>`}};d.styles=[a.W5,a.fD,c],l([(0,i.MZ)()],d.prototype,"icon",void 0),l([(0,i.MZ)()],d.prototype,"variant",void 0),l([(0,i.MZ)()],d.prototype,"type",void 0),l([(0,i.MZ)()],d.prototype,"size",void 0),l([(0,i.MZ)({type:Boolean})],d.prototype,"fullWidth",void 0),l([(0,i.MZ)({type:Boolean})],d.prototype,"disabled",void 0),d=l([(0,n.E)("wui-icon-button")],d)},84042:(e,t,o)=>{var r=o(83138),i=o(98410),a=o(78964);o(99691);var n=o(71084),s=o(47327),c=o(20296);let l=(0,c.AH)`
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
`;var d=function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let u=class extends r.WF{constructor(){super(...arguments),this.icon="copy",this.size="md",this.padding="1",this.color="default"}render(){return this.dataset.padding=this.padding,this.dataset.color=this.color,(0,r.qy)`
      <wui-icon size=${(0,a.J)(this.size)} name=${this.icon} color="inherit"></wui-icon>
    `}};u.styles=[n.W5,n.fD,l],d([(0,i.MZ)()],u.prototype,"icon",void 0),d([(0,i.MZ)()],u.prototype,"size",void 0),d([(0,i.MZ)()],u.prototype,"padding",void 0),d([(0,i.MZ)()],u.prototype,"color",void 0),u=d([(0,s.E)("wui-icon-box")],u)}}]);