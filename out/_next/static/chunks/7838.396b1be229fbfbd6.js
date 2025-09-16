"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7838],{17838:(e,t,r)=>{r.r(t),r.d(t,{W3mBuyInProgressView:()=>T,W3mFundWalletView:()=>L,W3mOnRampProvidersView:()=>A,W3mOnrampFiatSelectView:()=>h,W3mOnrampTokensView:()=>R,W3mOnrampWidget:()=>Z,W3mWhatIsABuyView:()=>U});var i=r(83138),s=r(98410),a=r(78964),n=r(63621),o=r(29936),c=r(75751),u=r(55480),l=r(81701),d=r(36211);r(40575),r(26670),r(41163),r(82886);let p=(0,d.AH)`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var m=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let h=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=n.aG.state.paymentCurrency,this.currencies=n.aG.state.paymentCurrencies,this.currencyImages=o.j.state.currencyImages,this.checked=c.o.state.isLegalCheckboxChecked,this.unsubscribe.push(n.aG.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),o.j.subscribeKey("currencyImages",e=>this.currencyImages=e),c.o.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.H.state,r=u.H.state.features?.legalCheckbox,s=!!(e||t)&&!!r&&!this.checked;return(0,i.qy)`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${(0,a.J)(s?"disabled":void 0)}
      >
        ${this.currenciesTemplate(s)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.currencies.map(t=>(0,i.qy)`
        <wui-list-item
          imageSrc=${(0,a.J)(this.currencyImages?.[t.id])}
          @click=${()=>this.selectCurrency(t)}
          variant="image"
          tabIdx=${(0,a.J)(e?-1:void 0)}
        >
          <wui-text variant="md-medium" color="primary">${t.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(n.aG.setPaymentCurrency(e),l.W.close())}};h.styles=p,m([(0,s.wk)()],h.prototype,"selectedCurrency",void 0),m([(0,s.wk)()],h.prototype,"currencies",void 0),m([(0,s.wk)()],h.prototype,"currencyImages",void 0),m([(0,s.wk)()],h.prototype,"checked",void 0),h=m([(0,d.EM)("w3m-onramp-fiat-select-view")],h);var y=r(93481),w=r(67869),g=r(12319),f=r(70417),b=r(71305),v=r(73537),x=r(14744);r(77237),r(80205),r(75484),r(76275);let k=(0,d.AH)`
  button {
    padding: ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["4"]};
    border: none;
    outline: none;
    background-color: ${({tokens:e})=>e.core.glass010};
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${({spacing:e})=>e["3"]};
    transition: background-color ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
    will-change: background-color;
    cursor: pointer;
  }

  button:hover {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .provider-image {
    width: ${({spacing:e})=>e["10"]};
    min-width: ${({spacing:e})=>e["10"]};
    height: ${({spacing:e})=>e["10"]};
    border-radius: calc(
      ${({borderRadius:e})=>e["4"]} - calc(${({spacing:e})=>e["3"]} / 2)
    );
    position: relative;
    overflow: hidden;
  }

  .network-icon {
    width: ${({spacing:e})=>e["3"]};
    height: ${({spacing:e})=>e["3"]};
    border-radius: calc(${({spacing:e})=>e["3"]} / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px ${({tokens:e})=>e.theme.foregroundPrimary},
      0 0 0 3px ${({tokens:e})=>e.theme.backgroundPrimary};
    transition: box-shadow ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
    will-change: box-shadow;
  }

  button:hover .network-icon {
    box-shadow:
      0 0 0 3px ${({tokens:e})=>e.core.glass010},
      0 0 0 3px ${({tokens:e})=>e.theme.backgroundPrimary};
  }
`;var $=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let C=class extends i.WF{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return(0,i.qy)`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${(0,a.J)(this.name)} class="provider-image"></wui-visual>
        <wui-flex flexDirection="column" gap="01">
          <wui-text variant="md-regular" color="primary">${this.label}</wui-text>
          <wui-flex alignItems="center" justifyContent="flex-start" gap="4">
            <wui-text variant="sm-medium" color="primary">
              <wui-text variant="sm-regular" color="secondary">Fees</wui-text>
              ${this.feeRange}
            </wui-text>
            <wui-flex gap="2">
              <wui-icon name="bank" size="sm" color="default"></wui-icon>
              <wui-icon name="card" size="sm" color="default"></wui-icon>
            </wui-flex>
            ${this.networksTemplate()}
          </wui-flex>
        </wui-flex>
        ${this.loading?(0,i.qy)`<wui-loading-spinner color="secondary" size="md"></wui-loading-spinner>`:(0,i.qy)`<wui-icon name="chevronRight" color="default" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){let e=y.W.getAllRequestedCaipNetworks(),t=e?.filter(e=>e?.assets?.imageId)?.slice(0,5);return(0,i.qy)`
      <wui-flex class="networks">
        ${t?.map(e=>(0,i.qy)`
            <wui-flex class="network-icon">
              <wui-image src=${(0,a.J)(x.$.getNetworkImage(e))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};C.styles=[k],$([(0,s.MZ)({type:Boolean})],C.prototype,"disabled",void 0),$([(0,s.MZ)()],C.prototype,"color",void 0),$([(0,s.MZ)()],C.prototype,"name",void 0),$([(0,s.MZ)()],C.prototype,"label",void 0),$([(0,s.MZ)()],C.prototype,"feeRange",void 0),$([(0,s.MZ)({type:Boolean})],C.prototype,"loading",void 0),$([(0,s.MZ)()],C.prototype,"onClick",void 0),C=$([(0,d.EM)("w3m-onramp-provider-item")],C),r(25784);var P=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let A=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.providers=n.aG.state.providers,this.unsubscribe.push(n.aG.subscribeKey("providers",e=>{this.providers=e}))}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes(y.W.state.activeChain??"eip155")).map(e=>(0,i.qy)`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){n.aG.setSelectedProvider(e),w.I.push("BuyInProgress"),g.w.openHref(n.aG.state.selectedProvider?.url||e.url,"popupWindow","width=600,height=800,scrollbars=yes"),f.E.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:(0,b.lj)(y.W.state.activeChain)===v.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}})}};P([(0,s.wk)()],A.prototype,"providers",void 0),A=P([(0,d.EM)("w3m-onramp-providers-view")],A),r(65685);let E=(0,d.AH)`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.md};
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var I=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let R=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=n.aG.state.purchaseCurrencies,this.tokens=n.aG.state.purchaseCurrencies,this.tokenImages=o.j.state.tokenImages,this.checked=c.o.state.isLegalCheckboxChecked,this.unsubscribe.push(n.aG.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),o.j.subscribeKey("tokenImages",e=>this.tokenImages=e),c.o.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=u.H.state,r=u.H.state.features?.legalCheckbox,s=!!(e||t)&&!!r&&!this.checked;return(0,i.qy)`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${(0,a.J)(s?"disabled":void 0)}
      >
        ${this.currenciesTemplate(s)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.tokens.map(t=>(0,i.qy)`
        <wui-list-item
          imageSrc=${(0,a.J)(this.tokenImages?.[t.symbol])}
          @click=${()=>this.selectToken(t)}
          variant="image"
          tabIdx=${(0,a.J)(e?-1:void 0)}
        >
          <wui-flex gap="1" alignItems="center">
            <wui-text variant="md-medium" color="primary">${t.name}</wui-text>
            <wui-text variant="sm-regular" color="secondary">${t.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `)}selectToken(e){e&&(n.aG.setPurchaseCurrency(e),l.W.close())}};R.styles=E,I([(0,s.wk)()],R.prototype,"selectedCurrency",void 0),I([(0,s.wk)()],R.prototype,"tokens",void 0),I([(0,s.wk)()],R.prototype,"tokenImages",void 0),I([(0,s.wk)()],R.prototype,"checked",void 0),R=I([(0,d.EM)("w3m-onramp-token-select-view")],R);var O=r(3824),W=r(45069),S=r(65374);r(41028),r(90721),r(48352),r(64731);let j=(0,d.AH)`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-visual {
    border-radius: calc(
      ${({borderRadius:e})=>e["1"]} * 9 - ${({borderRadius:e})=>e["3"]}
    );
    position: relative;
    overflow: hidden;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:e})=>e["1"]} * -1);
    bottom: calc(${({spacing:e})=>e["1"]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e["4"]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:e})=>e["01"]} ${({spacing:e})=>e["2"]};
  }
`;var N=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let T=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=n.aG.state.selectedProvider,this.uri=O.x.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(n.aG.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e}))}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let t=this.error?"Buy can be declined from your side or due to and error on the provider app":`We’ll notify you once your Buy is processed`;return(0,i.qy)`
      <wui-flex
        data-error=${(0,a.J)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${(0,a.J)(this.selectedOnRampProvider?.name)}
            size="lg"
            class="provider-image"
          >
          </wui-visual>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["4","0","0","0"]}
        >
          <wui-text variant="md-medium" color=${this.error?"error":"primary"}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="sm-medium" color="secondary">${t}</wui-text>
        </wui-flex>

        ${this.error?this.tryAgainTemplate():null}
      </wui-flex>

      <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
        <wui-link @click=${this.onCopyUri} color="secondary">
          <wui-icon size="sm" color="default" slot="iconLeft" name="copy"></wui-icon>
          Copy link
        </wui-link>
      </wui-flex>
    `}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,g.w.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?(0,i.qy)`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=W.W.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return(0,i.qy)`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){S.P.showError("No link found"),w.I.goBack();return}try{g.w.copyToClopboard(this.selectedOnRampProvider.url),S.P.showSuccess("Link copied")}catch{S.P.showError("Failed to copy")}}};T.styles=j,N([(0,s.wk)()],T.prototype,"intervalId",void 0),N([(0,s.wk)()],T.prototype,"selectedOnRampProvider",void 0),N([(0,s.wk)()],T.prototype,"uri",void 0),N([(0,s.wk)()],T.prototype,"ready",void 0),N([(0,s.wk)()],T.prototype,"showRetry",void 0),N([(0,s.wk)()],T.prototype,"buffering",void 0),N([(0,s.wk)()],T.prototype,"error",void 0),N([(0,s.MZ)({type:Boolean})],T.prototype,"isMobile",void 0),N([(0,s.MZ)()],T.prototype,"onRetry",void 0),T=N([(0,d.EM)("w3m-buy-in-progress-view")],T);let U=class extends i.WF{render(){return(0,i.qy)`
      <wui-flex
        flexDirection="column"
        .padding=${["6","10","5","10"]}
        alignItems="center"
        gap="5"
      >
        <wui-visual name="onrampCard"></wui-visual>
        <wui-flex flexDirection="column" gap="2" alignItems="center">
          <wui-text align="center" variant="md-medium" color="primary">
            Quickly and easily buy digital assets!
          </wui-text>
          <wui-text align="center" variant="sm-regular" color="secondary">
            Simply select your preferred onramp provider and add digital assets to your account
            using your credit card or bank transfer
          </wui-text>
        </wui-flex>
        <wui-button @click=${w.I.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};U=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n}([(0,d.EM)("w3m-what-is-a-buy-view")],U);var D=r(55549),q=r(28977),F=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let L=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.activeCaipNetwork=y.W.state.activeCaipNetwork,this.features=u.H.state.features,this.remoteFeatures=u.H.state.remoteFeatures,this.exchangesLoading=D.g.state.isLoading,this.exchanges=D.g.state.exchanges,this.unsubscribe.push(u.H.subscribeKey("features",e=>this.features=e),u.H.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),y.W.subscribeKey("activeCaipNetwork",e=>{this.activeCaipNetwork=e,this.setDefaultPaymentAsset()}),D.g.subscribeKey("isLoading",e=>this.exchangesLoading=e),D.g.subscribeKey("exchanges",e=>this.exchanges=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}async firstUpdated(){D.g.isPayWithExchangeSupported()&&(await this.setDefaultPaymentAsset(),await D.g.fetchExchanges())}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" .padding=${["1","3","3","3"]} gap="2">
        ${this.onrampTemplate()} ${this.receiveTemplate()} ${this.depositFromExchangeTemplate()}
      </wui-flex>
    `}async setDefaultPaymentAsset(){if(!this.activeCaipNetwork)return;let e=await D.g.getAssetsForNetwork(this.activeCaipNetwork.caipNetworkId),t=e.find(e=>"USDC"===e.metadata.symbol)||e[0];t&&D.g.setPaymentAsset(t)}onrampTemplate(){if(!this.activeCaipNetwork)return null;let e=this.remoteFeatures?.onramp,t=q.oU.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.activeCaipNetwork.chainNamespace);return e&&t?(0,i.qy)`
      <wui-list-item
        @click=${this.onBuyCrypto.bind(this)}
        icon="card"
        data-testid="wallet-features-onramp-button"
      >
        <wui-text variant="lg-regular" color="primary">Buy crypto</wui-text>
      </wui-list-item>
    `:null}depositFromExchangeTemplate(){return this.activeCaipNetwork&&D.g.isPayWithExchangeSupported()?(0,i.qy)`
      <wui-list-item
        @click=${this.onDepositFromExchange.bind(this)}
        icon="download"
        data-testid="wallet-features-deposit-from-exchange-button"
        ?loading=${this.exchangesLoading}
        ?disabled=${this.exchangesLoading||!this.exchanges.length}
      >
        <wui-text variant="lg-regular" color="primary">Deposit from exchange</wui-text>
      </wui-list-item>
    `:null}receiveTemplate(){return this.features?.receive?(0,i.qy)`
      <wui-list-item
        @click=${this.onReceive.bind(this)}
        icon="qrCode"
        data-testid="wallet-features-receive-button"
      >
        <wui-text variant="lg-regular" color="primary">Receive funds</wui-text>
      </wui-list-item>
    `:null}onBuyCrypto(){w.I.push("OnRampProviders")}onReceive(){w.I.push("WalletReceive")}onDepositFromExchange(){w.I.push("PayWithExchange")}};F([(0,s.wk)()],L.prototype,"activeCaipNetwork",void 0),F([(0,s.wk)()],L.prototype,"features",void 0),F([(0,s.wk)()],L.prototype,"remoteFeatures",void 0),F([(0,s.wk)()],L.prototype,"exchangesLoading",void 0),F([(0,s.wk)()],L.prototype,"exchanges",void 0),L=F([(0,d.EM)("w3m-fund-wallet-view")],L),r(40284);let G=(0,d.AH)`
  :host {
    width: 100%;
  }

  wui-loading-spinner {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .currency-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e["2"]};
    height: 40px;
    padding: ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["2"]}
      ${({spacing:e})=>e["2"]} ${({spacing:e})=>e["2"]};
    min-width: 95px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    cursor: pointer;
  }

  .currency-container > wui-image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
`;var M=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let H=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=o.j.state.currencyImages,this.tokenImages=o.j.state.tokenImages,this.unsubscribe.push(n.aG.subscribeKey("purchaseCurrency",e=>{e&&"Fiat"!==this.type&&(this.selectedCurrency=this.formatPurchaseCurrency(e))}),n.aG.subscribeKey("paymentCurrency",e=>{e&&"Token"!==this.type&&(this.selectedCurrency=this.formatPaymentCurrency(e))}),n.aG.subscribe(e=>{"Fiat"===this.type?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),o.j.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){n.aG.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||"",t=this.currencyImages[e]||this.tokenImages[e];return(0,i.qy)`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?(0,i.qy)` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="1"
            @click=${()=>l.W.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${(0,a.J)(t)}></wui-image>
            <wui-text color="primary">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:(0,i.qy)`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};H.styles=G,M([(0,s.MZ)({type:String})],H.prototype,"type",void 0),M([(0,s.MZ)({type:Number})],H.prototype,"value",void 0),M([(0,s.wk)()],H.prototype,"currencies",void 0),M([(0,s.wk)()],H.prototype,"selectedCurrency",void 0),M([(0,s.wk)()],H.prototype,"currencyImages",void 0),M([(0,s.wk)()],H.prototype,"tokenImages",void 0),H=M([(0,d.EM)("w3m-onramp-input")],H);let B=(0,d.AH)`
  :host > wui-flex {
    width: 100%;
    max-width: 360px;
  }

  :host > wui-flex > wui-flex {
    border-radius: ${({borderRadius:e})=>e["8"]};
    width: 100%;
  }

  .amounts-container {
    width: 100%;
  }
`;var _=function(e,t,r,i){var s,a=arguments.length,n=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(a<3?s(n):a>3?s(t,r,n):s(t,r))||n);return a>3&&n&&Object.defineProperty(t,r,n),n};let K={USD:"$",EUR:"€",GBP:"\xa3"},z=[100,250,500,1e3],Z=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=y.W.state.activeCaipAddress,this.loading=l.W.state.loading,this.paymentCurrency=n.aG.state.paymentCurrency,this.paymentAmount=n.aG.state.paymentAmount,this.purchaseAmount=n.aG.state.purchaseAmount,this.quoteLoading=n.aG.state.quotesLoading,this.unsubscribe.push(y.W.subscribeKey("activeCaipAddress",e=>this.caipAddress=e),l.W.subscribeKey("loading",e=>{this.loading=e}),n.aG.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center">
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <w3m-onramp-input
            type="Fiat"
            @inputChange=${this.onPaymentAmountChange.bind(this)}
            .value=${this.paymentAmount||0}
          ></w3m-onramp-input>
          <w3m-onramp-input
            type="Token"
            .value=${this.purchaseAmount||0}
            .loading=${this.quoteLoading}
          ></w3m-onramp-input>
          <wui-flex justifyContent="space-evenly" class="amounts-container" gap="2">
            ${z.map(e=>(0,i.qy)`<wui-button
                  variant=${this.paymentAmount===e?"accent-secondary":"neutral-secondary"}
                  size="md"
                  textVariant="md-medium"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${K[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?(0,i.qy)`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="accent-primary"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:(0,i.qy)`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||l.W.open({view:"OnRampProviders"})}openModal(){l.W.open({view:"Connect"})}async onPaymentAmountChange(e){n.aG.setPaymentAmount(Number(e.detail)),await n.aG.getQuote()}async selectPresetAmount(e){n.aG.setPaymentAmount(e),await n.aG.getQuote()}};Z.styles=B,_([(0,s.MZ)({type:Boolean})],Z.prototype,"disabled",void 0),_([(0,s.wk)()],Z.prototype,"caipAddress",void 0),_([(0,s.wk)()],Z.prototype,"loading",void 0),_([(0,s.wk)()],Z.prototype,"paymentCurrency",void 0),_([(0,s.wk)()],Z.prototype,"paymentAmount",void 0),_([(0,s.wk)()],Z.prototype,"purchaseAmount",void 0),_([(0,s.wk)()],Z.prototype,"quoteLoading",void 0),Z=_([(0,d.EM)("w3m-onramp-widget")],Z)},55549:(e,t,r)=>{r.d(t,{g:()=>g});var i=r(12661),s=r(98866),a=r(71305),n=r(28977),o=r(12319),c=r(44161),u=r(58051),l=r(44826),d=r(93481),p=r(70417),m=r(55480),h=r(65374);let y={paymentAsset:null,amount:0,tokenAmount:0,priceLoading:!1,error:null,exchanges:[],isLoading:!1,currentPayment:void 0,isPaymentInProgress:!1,paymentId:"",assets:[]},w=(0,i.BX)(y),g={state:w,subscribe:e=>(0,i.B1)(w,()=>e(w)),subscribeKey:(e,t)=>(0,s.u$)(w,e,t),resetState(){Object.assign(w,{...y})},async getAssetsForNetwork(e){let t=(0,c.nj)(e),r=await g.getAssetsImageAndPrice(t),i=t.map(e=>{let t="native"===e.asset?(0,a.K1)():`${e.network}:${e.asset}`,i=r.find(e=>e.fungibles?.[0]?.address?.toLowerCase()===t.toLowerCase());return{...e,price:i?.fungibles?.[0]?.price||1,metadata:{...e.metadata,iconUrl:i?.fungibles?.[0]?.iconUrl}}});return w.assets=i,i},async getAssetsImageAndPrice(e){let t=e.map(e=>"native"===e.asset?(0,a.K1)():`${e.network}:${e.asset}`);return await Promise.all(t.map(e=>l.T.fetchTokenPrice({addresses:[e]})))},getTokenAmount(){if(!w?.paymentAsset?.price)throw Error("Cannot get token price");return Number(new Intl.NumberFormat("en-US",{minimumFractionDigits:0,maximumFractionDigits:8}).format(w.amount/w.paymentAsset.price))},setAmount(e){w.amount=e,w.paymentAsset?.price&&(w.tokenAmount=g.getTokenAmount())},setPaymentAsset(e){w.paymentAsset=e},isPayWithExchangeEnabled:()=>m.H.state.remoteFeatures?.payWithExchange||m.H.state.remoteFeatures?.payments||m.H.state.features?.pay,isPayWithExchangeSupported:()=>g.isPayWithExchangeEnabled()&&d.W.state.activeCaipNetwork&&n.oU.PAY_WITH_EXCHANGE_SUPPORTED_CHAIN_NAMESPACES.includes(d.W.state.activeCaipNetwork.chainNamespace),async fetchExchanges(){try{let e=g.isPayWithExchangeSupported();if(!w.paymentAsset||!e){w.exchanges=[],w.isLoading=!1;return}w.isLoading=!0;let t=await (0,c.ro)({page:0,asset:(0,c.lZ)(w.paymentAsset.network,w.paymentAsset.asset),amount:w.amount.toString()});w.exchanges=t.exchanges.slice(0,2)}catch(e){throw h.P.showError("Unable to get exchanges"),Error("Unable to get exchanges")}finally{w.isLoading=!1}},async getPayUrl(e,t){try{let r=Number(t.amount),i=await (0,c.cz)({exchangeId:e,asset:(0,c.lZ)(t.network,t.asset),amount:r.toString(),recipient:`${t.network}:${t.recipient}`});return p.E.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:r},currentPayment:{type:"exchange",exchangeId:e},source:"fund-from-exchange",headless:!1}}),i}catch(e){if(e instanceof Error&&e.message.includes("is not supported"))throw Error("Asset not supported");throw Error(e.message)}},async handlePayWithExchange(e){try{if(!u.U.state.address)throw Error("No account connected");if(!w.paymentAsset)throw Error("No payment asset selected");let t=o.w.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!t)throw Error("Could not create popup window");w.isPaymentInProgress=!0,w.paymentId=crypto.randomUUID(),w.currentPayment={type:"exchange",exchangeId:e};let{network:r,asset:i}=w.paymentAsset,s={network:r,asset:i,amount:w.tokenAmount,recipient:u.U.state.address},a=await g.getPayUrl(e,s);if(!a){try{t.close()}catch(e){console.error("Unable to close popup window",e)}throw Error("Unable to initiate payment")}w.currentPayment.sessionId=a.sessionId,w.currentPayment.status="IN_PROGRESS",w.currentPayment.exchangeId=e,t.location.href=a.url}catch(e){w.error="Unable to initiate payment",h.P.showError(w.error)}},async waitUntilComplete({exchangeId:e,sessionId:t,paymentId:r,retries:i=20}){let s=await g.getBuyStatus(e,t,r);if("SUCCESS"===s.status||"FAILED"===s.status)return s;if(0===i)throw Error("Unable to get deposit status");return await new Promise(e=>{setTimeout(e,5e3)}),g.waitUntilComplete({exchangeId:e,sessionId:t,paymentId:r,retries:i-1})},async getBuyStatus(e,t,r){try{if(!w.currentPayment)throw Error("No current payment");let i=await (0,c.V1)({sessionId:t,exchangeId:e});return w.currentPayment.status=i.status,("SUCCESS"===i.status||"FAILED"===i.status)&&(w.currentPayment.result=i.txHash,w.isPaymentInProgress=!1,p.E.sendEvent({type:"track",event:"SUCCESS"===i.status?"PAY_SUCCESS":"PAY_ERROR",properties:{source:"fund-from-exchange",paymentId:r,configuration:{network:w.paymentAsset?.network||"",asset:w.paymentAsset?.asset||"",recipient:u.U.state.address||"",amount:w.amount},currentPayment:{type:"exchange",exchangeId:w.currentPayment?.exchangeId,sessionId:w.currentPayment?.sessionId,result:i.txHash}}})),i}catch(e){return{status:"UNKNOWN",txHash:""}}},reset(){w.currentPayment=void 0,w.isPaymentInProgress=!1,w.paymentId="",w.paymentAsset=null,w.amount=0,w.tokenAmount=0,w.priceLoading=!1,w.error=null,w.exchanges=[],w.isLoading=!1}}},80205:(e,t,r)=>{r(45166)}}]);