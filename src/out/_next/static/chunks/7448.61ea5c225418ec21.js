"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7448],{4693:(e,t,o)=>{var n=o(83138),r=o(98410);o(99691);var a=o(71084),i=o(47327),s=o(20296);let c=(0,s.AH)`
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
`;var u=function(e,t,o,n){var r,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,o,i):r(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i};let l=class extends n.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="default",this.variant="accent"}render(){return(0,n.qy)`
      <button data-variant=${this.variant} ?disabled=${this.disabled} data-size=${this.size}>
        <wui-icon
          color=${({accent:"accent-primary",primary:"inverse",secondary:"default"})[this.variant]||this.iconColor}
          size=${this.size}
          name=${this.icon}
        ></wui-icon>
      </button>
    `}};l.styles=[a.W5,a.fD,c],u([(0,r.MZ)()],l.prototype,"size",void 0),u([(0,r.MZ)({type:Boolean})],l.prototype,"disabled",void 0),u([(0,r.MZ)()],l.prototype,"icon",void 0),u([(0,r.MZ)()],l.prototype,"iconColor",void 0),u([(0,r.MZ)()],l.prototype,"variant",void 0),l=u([(0,i.E)("wui-icon-link")],l)},7448:(e,t,o)=>{o.r(t),o.d(t,{W3mDepositFromExchangeSelectAssetView:()=>f,W3mDepositFromExchangeView:()=>g});var n=o(83138),r=o(98410),a=o(93481),i=o(55549),s=o(67869),c=o(65374),u=o(58051),l=o(3824),d=o(36211);o(41028),o(40575),o(51568),o(80205),o(26670),o(41699),o(41163);let p=(0,d.AH)`
  .amount-input-container {
    border-radius: ${({borderRadius:e})=>e["5"]};
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom: 1px solid ${({tokens:e})=>e.core.glass010};
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .container {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: 30px;
  }
`;var h=function(e,t,o,n){var r,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,o,i):r(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i};let m=[10,50,100],g=class extends n.WF{constructor(){super(),this.unsubscribe=[],this.network=a.W.state.activeCaipNetwork,this.exchanges=i.g.state.exchanges,this.isLoading=i.g.state.isLoading,this.amount=i.g.state.amount,this.tokenAmount=i.g.state.tokenAmount,this.priceLoading=i.g.state.priceLoading,this.isPaymentInProgress=i.g.state.isPaymentInProgress,this.currentPayment=i.g.state.currentPayment,this.paymentId=i.g.state.paymentId,this.paymentAsset=i.g.state.paymentAsset,this.unsubscribe.push(a.W.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.setDefaultPaymentAsset()}),i.g.subscribe(e=>{this.exchanges=e.exchanges,this.isLoading=e.isLoading,this.amount=e.amount,this.tokenAmount=e.tokenAmount,this.priceLoading=e.priceLoading,this.paymentId=e.paymentId,this.isPaymentInProgress=e.isPaymentInProgress,this.currentPayment=e.currentPayment,this.paymentAsset=e.paymentAsset,e.isPaymentInProgress&&e.currentPayment?.exchangeId&&e.currentPayment?.sessionId&&e.paymentId&&this.handlePaymentInProgress()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),i.g.reset()}async firstUpdated(){await this.getPaymentAssets(),this.paymentAsset||await this.setDefaultPaymentAsset(),this.onPresetAmountClick(m[0]),await i.g.fetchExchanges()}render(){return(0,n.qy)`
      <wui-flex flexDirection="column" gap="2" class="container">
        ${this.amountInputTemplate()} ${this.exchangesTemplate()}
      </wui-flex>
    `}exchangesLoadingTemplate(){return Array.from({length:2}).map(()=>(0,n.qy)`<wui-shimmer width="100%" height="65px" borderRadius="xxs"></wui-shimmer>`)}_exchangesTemplate(){return this.exchanges.length>0?this.exchanges.map(e=>(0,n.qy)`<wui-list-item
              @click=${()=>this.onExchangeClick(e)}
              chevron
              variant="image"
              imageSrc=${e.imageUrl}
              ?loading=${this.isLoading}
            >
              <wui-text variant="md-regular" color="secondary">
                Deposit from ${e.name}
              </wui-text>
            </wui-list-item>`):(0,n.qy)`<wui-flex flexDirection="column" alignItems="center" gap="4" padding="4">
          <wui-text variant="lg-medium" align="center" color="primary">
            No exchanges support this asset on this network
          </wui-text>
        </wui-flex>`}exchangesTemplate(){return(0,n.qy)`<wui-flex
      flexDirection="column"
      gap="2"
      .padding=${["3","3","3","3"]}
      class="exchanges-container"
    >
      ${this.isLoading?this.exchangesLoadingTemplate():this._exchangesTemplate()}
    </wui-flex>`}amountInputTemplate(){return(0,n.qy)`
      <wui-flex flexDirection="column" gap="3" .padding=${["0","3","3","3"]} class="amount-input-container">
        <wui-flex justifyContent="space-between" alignItems="center">
          <wui-text variant="md-medium" color="secondary">Asset</wui-text>

          <wui-token-button
            data-testid="deposit-from-exchange-asset-button"
            flexDirection="row-reverse"
            text=${this.paymentAsset?.metadata.symbol||""}
            imageSrc=${this.paymentAsset?.metadata.iconUrl||""}
            @click=${()=>s.I.push("PayWithExchangeSelectAsset")}
            >
          </wui-token-button>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" justifyContent="center">
          <wui-flex alignItems="center" gap="1">
            <wui-text variant="h2-regular" color="secondary">${this.amount}</wui-text>
            <wui-text variant="md-regular" color="secondary">USD</wui-text>
          </wui-flex>
          ${this.tokenAmountTemplate()}
          </wui-flex>
          <wui-flex justifyContent="space-between" gap="2">
            ${m.map(e=>(0,n.qy)`<wui-button @click=${()=>this.onPresetAmountClick(e)} variant=${this.amount===e?"neutral-primary":"neutral-secondary"} size="sm" fullWidth>$${e}</wui-button>`)}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}tokenAmountTemplate(){return this.priceLoading?(0,n.qy)`<wui-shimmer
        width="65px"
        height="20px"
        borderRadius="xxs"
        variant="light"
      ></wui-shimmer>`:(0,n.qy)`
      <wui-text variant="md-regular" color="secondary">
        ${this.tokenAmount.toFixed(4)} ${this.paymentAsset?.metadata.symbol}
      </wui-text>
    `}async onExchangeClick(e){if(!this.amount)return void c.P.showError("Please enter an amount");await i.g.handlePayWithExchange(e.id)}handlePaymentInProgress(){let e=a.W.state.activeChain;this.isPaymentInProgress&&this.currentPayment?.exchangeId&&this.currentPayment?.sessionId&&this.paymentId&&(i.g.waitUntilComplete({exchangeId:this.currentPayment.exchangeId,sessionId:this.currentPayment.sessionId,paymentId:this.paymentId}).then(t=>{"SUCCESS"===t.status?(c.P.showSuccess("Deposit completed"),e&&(u.U.fetchTokenBalance(),l.x.updateBalance(e))):"FAILED"===t.status&&c.P.showError("Deposit failed")}),c.P.showLoading("Deposit in progress..."),s.I.replace("Account"))}onPresetAmountClick(e){i.g.setAmount(e)}async getPaymentAssets(){this.network&&await i.g.getAssetsForNetwork(this.network.caipNetworkId)}async setDefaultPaymentAsset(){if(this.network){let e=await i.g.getAssetsForNetwork(this.network.caipNetworkId);e[0]&&i.g.setPaymentAsset(e[0])}}};g.styles=p,h([(0,r.wk)()],g.prototype,"network",void 0),h([(0,r.wk)()],g.prototype,"exchanges",void 0),h([(0,r.wk)()],g.prototype,"isLoading",void 0),h([(0,r.wk)()],g.prototype,"amount",void 0),h([(0,r.wk)()],g.prototype,"tokenAmount",void 0),h([(0,r.wk)()],g.prototype,"priceLoading",void 0),h([(0,r.wk)()],g.prototype,"isPaymentInProgress",void 0),h([(0,r.wk)()],g.prototype,"currentPayment",void 0),h([(0,r.wk)()],g.prototype,"paymentId",void 0),h([(0,r.wk)()],g.prototype,"paymentAsset",void 0),g=h([(0,d.EM)("w3m-deposit-from-exchange-view")],g);var y=o(12319);o(77237),o(90721),o(40284),o(48352),o(64501),o(39752);let w=(0,d.AH)`
  .contentContainer {
    height: 440px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }

  wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e["3"]};
  }
`;var b=function(e,t,o,n){var r,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,o,i):r(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i};let f=class extends n.WF{constructor(){super(),this.unsubscribe=[],this.assets=i.g.state.assets,this.search="",this.onDebouncedSearch=y.w.debounce(e=>{this.search=e}),this.unsubscribe.push(i.g.subscribe(e=>{this.assets=e.assets}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,n.qy)`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}templateSearchInput(){return(0,n.qy)`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){let e=this.assets.filter(e=>e.metadata.name.toLowerCase().includes(this.search.toLowerCase())),t=e.length>0;return(0,n.qy)`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Available tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${t?e.map(e=>(0,n.qy)`<wui-list-item
                    .imageSrc=${e.metadata.iconUrl}
                    ?clickable=${!0}
                    @click=${this.handleTokenClick.bind(this,e)}
                  >
                    <wui-text variant="md-medium" color="primary">${e.metadata.name}</wui-text>
                    <wui-text variant="md-regular" color="secondary"
                      >${e.metadata.symbol}</wui-text
                    >
                  </wui-list-item>`):(0,n.qy)`<wui-flex
                .padding=${["20","0","0","0"]}
                alignItems="center"
                flexDirection="column"
                gap="4"
              >
                <wui-icon-box icon="coinPlaceholder" color="default" size="lg"></wui-icon-box>
                <wui-flex
                  class="textContent"
                  gap="2"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <wui-text variant="lg-medium" align="center" color="primary">
                    No tokens found
                  </wui-text>
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){s.I.push("OnRampProviders")}onInputChange(e){this.onDebouncedSearch(e.detail)}handleTokenClick(e){i.g.setPaymentAsset(e),s.I.goBack()}};f.styles=w,b([(0,r.wk)()],f.prototype,"assets",void 0),b([(0,r.wk)()],f.prototype,"search",void 0),f=b([(0,d.EM)("w3m-deposit-from-exchange-select-asset-view")],f)},26670:(e,t,o)=>{var n=o(83138),r=o(98410),a=o(78964);o(21129),o(24772);var i=o(71084),s=o(47327),c=o(20296);let u=(0,c.AH)`
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
`;var l=function(e,t,o,n){var r,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,o,i):r(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i};let d=class extends n.WF{constructor(){super(...arguments),this.imageSrc="google",this.loading=!1,this.disabled=!1,this.rightIcon=!0,this.rounded=!1,this.fullSize=!1}render(){return this.dataset.rounded=this.rounded?"true":"false",(0,n.qy)`
      <button
        ?disabled=${!!this.loading||!!this.disabled}
        data-loading=${this.loading}
        tabindex=${(0,a.J)(this.tabIdx)}
      >
        <wui-flex gap="2" alignItems="center">
          ${this.templateLeftIcon()}
          <wui-flex gap="1">
            <slot></slot>
          </wui-flex>
        </wui-flex>
        ${this.templateRightIcon()}
      </button>
    `}templateLeftIcon(){return this.icon?(0,n.qy)`<wui-image
        icon=${this.icon}
        iconColor=${(0,a.J)(this.iconColor)}
        ?boxed=${!0}
        ?rounded=${this.rounded}
      ></wui-image>`:(0,n.qy)`<wui-image
      ?boxed=${!0}
      ?rounded=${this.rounded}
      ?fullSize=${this.fullSize}
      src=${this.imageSrc}
    ></wui-image>`}templateRightIcon(){return this.rightIcon?this.loading?(0,n.qy)`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:(0,n.qy)`<wui-icon name="chevronRight" size="lg" color="default"></wui-icon>`:null}};d.styles=[i.W5,i.fD,u],l([(0,r.MZ)()],d.prototype,"imageSrc",void 0),l([(0,r.MZ)()],d.prototype,"icon",void 0),l([(0,r.MZ)()],d.prototype,"iconColor",void 0),l([(0,r.MZ)({type:Boolean})],d.prototype,"loading",void 0),l([(0,r.MZ)()],d.prototype,"tabIdx",void 0),l([(0,r.MZ)({type:Boolean})],d.prototype,"disabled",void 0),l([(0,r.MZ)({type:Boolean})],d.prototype,"rightIcon",void 0),l([(0,r.MZ)({type:Boolean})],d.prototype,"rounded",void 0),l([(0,r.MZ)({type:Boolean})],d.prototype,"fullSize",void 0),d=l([(0,s.E)("wui-list-item")],d)},39752:(e,t,o)=>{var n=o(83138),r=o(98410);o(24772);var a=o(71084),i=o(47327),s=o(20296);let c=(0,s.AH)`
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
`;var u=function(e,t,o,n){var r,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,o,i):r(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i};let l=class extends n.WF{constructor(){super(...arguments),this.text=""}render(){return(0,n.qy)`${this.template()}`}template(){return this.text?(0,n.qy)`<wui-text variant="md-regular" color="secondary">${this.text}</wui-text>`:null}};l.styles=[a.W5,c],u([(0,r.MZ)()],l.prototype,"text",void 0),l=u([(0,i.E)("wui-separator")],l)},40284:(e,t,o)=>{o(5089)},40396:(e,t,o)=>{var n=o(83138),r=o(98410),a=o(47327),i=o(20296);let s=(0,i.AH)`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundSecondary} 0%,
      ${({tokens:e})=>e.theme.foregroundTertiary} 50%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1s ease-in-out infinite;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;var c=function(e,t,o,n){var r,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,o,i):r(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i};let u=class extends n.WF{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",(0,n.qy)`<slot></slot>`}};u.styles=[s],c([(0,r.MZ)()],u.prototype,"width",void 0),c([(0,r.MZ)()],u.prototype,"height",void 0),c([(0,r.MZ)()],u.prototype,"variant",void 0),c([(0,r.MZ)({type:Boolean})],u.prototype,"rounded",void 0),u=c([(0,a.E)("wui-shimmer")],u)},41699:(e,t,o)=>{o(40396)},48352:(e,t,o)=>{var n=o(83138),r=o(98410);o(99691),o(24772);var a=o(71084),i=o(47327),s=o(20296);let c=(0,s.AH)`
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
`;var u=function(e,t,o,n){var r,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,o,i):r(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i};let l={sm:"sm-medium",md:"md-medium"},d={accent:"accent-primary",secondary:"secondary"},p=class extends n.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.variant="accent",this.icon=void 0}render(){return(0,n.qy)`
      <button ?disabled=${this.disabled} data-variant=${this.variant}>
        <slot name="iconLeft"></slot>
        <wui-text
          color=${d[this.variant]}
          variant=${l[this.size]}
        >
          <slot></slot>
        </wui-text>
        ${this.iconTemplate()}
      </button>
    `}iconTemplate(){return this.icon?(0,n.qy)`<wui-icon name=${this.icon} size="sm"></wui-icon>`:null}};p.styles=[a.W5,a.fD,c],u([(0,r.MZ)()],p.prototype,"size",void 0),u([(0,r.MZ)({type:Boolean})],p.prototype,"disabled",void 0),u([(0,r.MZ)()],p.prototype,"variant",void 0),u([(0,r.MZ)()],p.prototype,"icon",void 0),p=u([(0,i.E)("wui-link")],p)},51568:(e,t,o)=>{o(4693)},55549:(e,t,o)=>{o.d(t,{g:()=>w});var n=o(12661),r=o(98866),a=o(71305),i=o(28977),s=o(12319),c=o(44161),u=o(58051),l=o(44826),d=o(93481),p=o(70417),h=o(55480),m=o(65374);let g={paymentAsset:null,amount:0,tokenAmount:0,priceLoading:!1,error:null,exchanges:[],isLoading:!1,currentPayment:void 0,isPaymentInProgress:!1,paymentId:"",assets:[]},y=(0,n.BX)(g),w={state:y,subscribe:e=>(0,n.B1)(y,()=>e(y)),subscribeKey:(e,t)=>(0,r.u$)(y,e,t),resetState(){Object.assign(y,{...g})},async getAssetsForNetwork(e){let t=(0,c.nj)(e),o=await w.getAssetsImageAndPrice(t),n=t.map(e=>{let t="native"===e.asset?(0,a.K1)():`${e.network}:${e.asset}`,n=o.find(e=>e.fungibles?.[0]?.address?.toLowerCase()===t.toLowerCase());return{...e,price:n?.fungibles?.[0]?.price||1,metadata:{...e.metadata,iconUrl:n?.fungibles?.[0]?.iconUrl}}});return y.assets=n,n},async getAssetsImageAndPrice(e){let t=e.map(e=>"native"===e.asset?(0,a.K1)():`${e.network}:${e.asset}`);return await Promise.all(t.map(e=>l.T.fetchTokenPrice({addresses:[e]})))},getTokenAmount(){if(!y?.paymentAsset?.price)throw Error("Cannot get token price");return Number(new Intl.NumberFormat("en-US",{minimumFractionDigits:0,maximumFractionDigits:8}).format(y.amount/y.paymentAsset.price))},setAmount(e){y.amount=e,y.paymentAsset?.price&&(y.tokenAmount=w.getTokenAmount())},setPaymentAsset(e){y.paymentAsset=e},isPayWithExchangeEnabled:()=>h.H.state.remoteFeatures?.payWithExchange||h.H.state.remoteFeatures?.payments||h.H.state.features?.pay,isPayWithExchangeSupported:()=>w.isPayWithExchangeEnabled()&&d.W.state.activeCaipNetwork&&i.oU.PAY_WITH_EXCHANGE_SUPPORTED_CHAIN_NAMESPACES.includes(d.W.state.activeCaipNetwork.chainNamespace),async fetchExchanges(){try{let e=w.isPayWithExchangeSupported();if(!y.paymentAsset||!e){y.exchanges=[],y.isLoading=!1;return}y.isLoading=!0;let t=await (0,c.ro)({page:0,asset:(0,c.lZ)(y.paymentAsset.network,y.paymentAsset.asset),amount:y.amount.toString()});y.exchanges=t.exchanges.slice(0,2)}catch(e){throw m.P.showError("Unable to get exchanges"),Error("Unable to get exchanges")}finally{y.isLoading=!1}},async getPayUrl(e,t){try{let o=Number(t.amount),n=await (0,c.cz)({exchangeId:e,asset:(0,c.lZ)(t.network,t.asset),amount:o.toString(),recipient:`${t.network}:${t.recipient}`});return p.E.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:o},currentPayment:{type:"exchange",exchangeId:e},source:"fund-from-exchange",headless:!1}}),n}catch(e){if(e instanceof Error&&e.message.includes("is not supported"))throw Error("Asset not supported");throw Error(e.message)}},async handlePayWithExchange(e){try{if(!u.U.state.address)throw Error("No account connected");if(!y.paymentAsset)throw Error("No payment asset selected");let t=s.w.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!t)throw Error("Could not create popup window");y.isPaymentInProgress=!0,y.paymentId=crypto.randomUUID(),y.currentPayment={type:"exchange",exchangeId:e};let{network:o,asset:n}=y.paymentAsset,r={network:o,asset:n,amount:y.tokenAmount,recipient:u.U.state.address},a=await w.getPayUrl(e,r);if(!a){try{t.close()}catch(e){console.error("Unable to close popup window",e)}throw Error("Unable to initiate payment")}y.currentPayment.sessionId=a.sessionId,y.currentPayment.status="IN_PROGRESS",y.currentPayment.exchangeId=e,t.location.href=a.url}catch(e){y.error="Unable to initiate payment",m.P.showError(y.error)}},async waitUntilComplete({exchangeId:e,sessionId:t,paymentId:o,retries:n=20}){let r=await w.getBuyStatus(e,t,o);if("SUCCESS"===r.status||"FAILED"===r.status)return r;if(0===n)throw Error("Unable to get deposit status");return await new Promise(e=>{setTimeout(e,5e3)}),w.waitUntilComplete({exchangeId:e,sessionId:t,paymentId:o,retries:n-1})},async getBuyStatus(e,t,o){try{if(!y.currentPayment)throw Error("No current payment");let n=await (0,c.V1)({sessionId:t,exchangeId:e});return y.currentPayment.status=n.status,("SUCCESS"===n.status||"FAILED"===n.status)&&(y.currentPayment.result=n.txHash,y.isPaymentInProgress=!1,p.E.sendEvent({type:"track",event:"SUCCESS"===n.status?"PAY_SUCCESS":"PAY_ERROR",properties:{source:"fund-from-exchange",paymentId:o,configuration:{network:y.paymentAsset?.network||"",asset:y.paymentAsset?.asset||"",recipient:u.U.state.address||"",amount:y.amount},currentPayment:{type:"exchange",exchangeId:y.currentPayment?.exchangeId,sessionId:y.currentPayment?.sessionId,result:n.txHash}}})),n}catch(e){return{status:"UNKNOWN",txHash:""}}},reset(){y.currentPayment=void 0,y.isPaymentInProgress=!1,y.paymentId="",y.paymentAsset=null,y.amount=0,y.tokenAmount=0,y.priceLoading=!1,y.error=null,y.exchanges=[],y.isLoading=!1}}},64501:(e,t,o)=>{var n=o(83138),r=o(98410),a=o(12182);o(99691),o(45166),o(24772),o(38534);var i=o(71084),s=o(47327),c=o(20296);let u=(0,c.AH)`
  :host {
    width: 100%;
  }

  button {
    padding: ${({spacing:e})=>e[3]};
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: transparent;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  button[data-clickable='false'] {
    pointer-events: none;
    background-color: transparent;
  }

  wui-image,
  wui-icon {
    width: ${({spacing:e})=>e[10]};
    height: ${({spacing:e})=>e[10]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[16]};
  }
`;var l=function(e,t,o,n){var r,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,o,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(i=(a<3?r(i):a>3?r(t,o,i):r(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i};let d=class extends n.WF{constructor(){super(...arguments),this.tokenName="",this.tokenImageUrl="",this.tokenValue=0,this.tokenAmount="0.0",this.tokenCurrency="",this.clickable=!1}render(){return(0,n.qy)`
      <button data-clickable=${String(this.clickable)}>
        <wui-flex gap="2" alignItems="center">
          ${this.visualTemplate()}
          <wui-flex flexDirection="column" justifyContent="space-between" gap="1">
            <wui-text variant="md-regular" color="primary">${this.tokenName}</wui-text>
            <wui-text variant="sm-regular-mono" color="secondary">
              ${a.S.formatNumberToLocalString(this.tokenAmount,4)} ${this.tokenCurrency}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          justifyContent="space-between"
          gap="1"
          alignItems="flex-end"
        >
          <wui-text variant="md-regular-mono" color="primary"
            >$${this.tokenValue.toFixed(2)}</wui-text
          >
          <wui-text variant="sm-regular-mono" color="secondary">
            ${a.S.formatNumberToLocalString(this.tokenAmount,4)}
          </wui-text>
        </wui-flex>
      </button>
    `}visualTemplate(){return this.tokenName&&this.tokenImageUrl?(0,n.qy)`<wui-image alt=${this.tokenName} src=${this.tokenImageUrl}></wui-image>`:(0,n.qy)`<wui-icon name="coinPlaceholder" color="default"></wui-icon>`}};d.styles=[i.W5,i.fD,u],l([(0,r.MZ)()],d.prototype,"tokenName",void 0),l([(0,r.MZ)()],d.prototype,"tokenImageUrl",void 0),l([(0,r.MZ)({type:Number})],d.prototype,"tokenValue",void 0),l([(0,r.MZ)()],d.prototype,"tokenAmount",void 0),l([(0,r.MZ)()],d.prototype,"tokenCurrency",void 0),l([(0,r.MZ)({type:Boolean})],d.prototype,"clickable",void 0),d=l([(0,s.E)("wui-list-token")],d)},77237:(e,t,o)=>{o(99691)},80205:(e,t,o)=>{o(45166)}}]);