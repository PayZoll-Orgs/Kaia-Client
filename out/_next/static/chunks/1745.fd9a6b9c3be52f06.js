"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1745],{4959:(e,t,o)=>{o.d(t,{I:()=>s});var i=o(12661),n=o(98866),r=o(36964);let a=(0,i.BX)({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),s=(0,r.X)({state:a,subscribe:e=>(0,i.B1)(a,()=>e(a)),subscribeKey:(e,t)=>(0,n.u$)(a,e,t),showTooltip({message:e,triggerRect:t,variant:o}){a.open=!0,a.message=e,a.triggerRect=t,a.variant=o},hide(){a.open=!1,a.message="",a.triggerRect={width:0,height:0,top:0,left:0}}})},35135:(e,t,o)=>{var i=o(83138),n=o(98410),r=o(4959),a=o(36211);o(40575),o(77237),o(41163);let s=(0,a.AH)`
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
`;var l=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let c=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.open=r.I.state.open,this.message=r.I.state.message,this.triggerRect=r.I.state.triggerRect,this.variant=r.I.state.variant,this.unsubscribe.push(r.I.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;let e=this.triggerRect.top,t=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${e}px;
    --w3m-tooltip-left: ${t}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${+!!this.open};
    `,(0,i.qy)`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};c.styles=[s],l([(0,n.wk)()],c.prototype,"open",void 0),l([(0,n.wk)()],c.prototype,"message",void 0),l([(0,n.wk)()],c.prototype,"triggerRect",void 0),l([(0,n.wk)()],c.prototype,"variant",void 0),c=l([(0,a.EM)("w3m-tooltip")],c)},40284:(e,t,o)=>{o(5089)},40396:(e,t,o)=>{var i=o(83138),n=o(98410),r=o(47327),a=o(20296);let s=(0,a.AH)`
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
`;var l=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let c=class extends i.WF{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",(0,i.qy)`<slot></slot>`}};c.styles=[s],l([(0,n.MZ)()],c.prototype,"width",void 0),l([(0,n.MZ)()],c.prototype,"height",void 0),l([(0,n.MZ)()],c.prototype,"variant",void 0),l([(0,n.MZ)({type:Boolean})],c.prototype,"rounded",void 0),c=l([(0,r.E)("wui-shimmer")],c)},41699:(e,t,o)=>{o(40396)},42103:(e,t,o)=>{var i=o(83138),n=o(98410);o(99691),o(45166),o(40396),o(24772),o(38534);var r=o(71084),a=o(47327),s=o(20296);let l=(0,s.AH)`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
    padding-right: ${({spacing:e})=>e[1]};
  }

  .left-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
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

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
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
`;var c=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let u={lg:"lg-regular",md:"lg-regular",sm:"md-regular"},d={lg:"lg",md:"md",sm:"sm"},p=class extends i.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.text="",this.loading=!1}render(){return this.loading?(0,i.qy)` <wui-flex alignItems="center" gap="01" padding="01">
        <wui-shimmer width="20px" height="20px"></wui-shimmer>
        <wui-shimmer width="32px" height="18px" borderRadius="4xs"></wui-shimmer>
      </wui-flex>`:(0,i.qy)`
      <button ?disabled=${this.disabled} data-size=${this.size}>
        ${this.imageTemplate()} ${this.textTemplate()}
      </button>
    `}imageTemplate(){if(this.imageSrc)return(0,i.qy)`<wui-image src=${this.imageSrc}></wui-image>`;let e=d[this.size];return(0,i.qy)` <wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}textTemplate(){let e=u[this.size];return(0,i.qy)`<wui-text color="primary" variant=${e}
      >${this.text}</wui-text
    >`}};p.styles=[r.W5,r.fD,l],c([(0,n.MZ)()],p.prototype,"size",void 0),c([(0,n.MZ)()],p.prototype,"imageSrc",void 0),c([(0,n.MZ)({type:Boolean})],p.prototype,"disabled",void 0),c([(0,n.MZ)()],p.prototype,"text",void 0),c([(0,n.MZ)({type:Boolean})],p.prototype,"loading",void 0),p=c([(0,a.E)("wui-token-button")],p)},51745:(e,t,o)=>{o.r(t),o.d(t,{W3mSwapPreviewView:()=>E,W3mSwapSelectTokenView:()=>V,W3mSwapView:()=>D});var i=o(83138),n=o(98410),r=o(12182),a=o(67869),s=o(58051),l=o(93481),c=o(24836),u=o(12319),d=o(81701),p=o(70417),h=o(71305),w=o(36211);o(41028),o(40575),o(77237),o(90721),o(41163);var g=o(73537),m=o(28977);o(61896),o(35135);let k=(0,w.AH)`
  :host {
    width: 100%;
  }

  .details-container > wui-flex {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["3"]};
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    cursor: pointer;
  }

  .details-content-container {
    padding: ${({spacing:e})=>e["2"]};
    padding-top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: ${({spacing:e})=>e["3"]};
    padding-left: ${({spacing:e})=>e["3"]};
    padding-right: ${({spacing:e})=>e["2"]};
    border-radius: calc(
      ${({borderRadius:e})=>e["1"]} + ${({borderRadius:e})=>e["1"]}
    );
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .details-row-title {
    white-space: nowrap;
  }

  .details-row.provider-free-row {
    padding-right: ${({spacing:e})=>e["2"]};
  }
`;var f=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let b=m.oU.CONVERT_SLIPPAGE_TOLERANCE,x=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.networkName=l.W.state.activeCaipNetwork?.name,this.detailsOpen=!1,this.sourceToken=c.GN.state.sourceToken,this.toToken=c.GN.state.toToken,this.toTokenAmount=c.GN.state.toTokenAmount,this.sourceTokenPriceInUSD=c.GN.state.sourceTokenPriceInUSD,this.toTokenPriceInUSD=c.GN.state.toTokenPriceInUSD,this.priceImpact=c.GN.state.priceImpact,this.maxSlippage=c.GN.state.maxSlippage,this.networkTokenSymbol=c.GN.state.networkTokenSymbol,this.inputError=c.GN.state.inputError,this.unsubscribe.push(c.GN.subscribe(e=>{this.sourceToken=e.sourceToken,this.toToken=e.toToken,this.toTokenAmount=e.toTokenAmount,this.priceImpact=e.priceImpact,this.maxSlippage=e.maxSlippage,this.sourceTokenPriceInUSD=e.sourceTokenPriceInUSD,this.toTokenPriceInUSD=e.toTokenPriceInUSD,this.inputError=e.inputError}))}render(){let e=this.toTokenAmount&&this.maxSlippage?r.S.bigNumber(this.toTokenAmount).minus(this.maxSlippage).toString():null;if(!this.sourceToken||!this.toToken||this.inputError)return null;let t=this.sourceTokenPriceInUSD&&this.toTokenPriceInUSD?1/this.toTokenPriceInUSD*this.sourceTokenPriceInUSD:0;return(0,i.qy)`
      <wui-flex flexDirection="column" alignItems="center" gap="01" class="details-container">
        <wui-flex flexDirection="column">
          <button @click=${this.toggleDetails.bind(this)}>
            <wui-flex justifyContent="space-between" .padding=${["0","2","0","2"]}>
              <wui-flex justifyContent="flex-start" flexGrow="1" gap="2">
                <wui-text variant="sm-regular" color="primary">
                  1 ${this.sourceToken.symbol} =
                  ${r.S.formatNumberToLocalString(t,3)}
                  ${this.toToken.symbol}
                </wui-text>
                <wui-text variant="sm-regular" color="secondary">
                  $${r.S.formatNumberToLocalString(this.sourceTokenPriceInUSD)}
                </wui-text>
              </wui-flex>
              <wui-icon name="chevronBottom"></wui-icon>
            </wui-flex>
          </button>
          ${this.detailsOpen?(0,i.qy)`
                <wui-flex flexDirection="column" gap="2" class="details-content-container">
                  ${this.priceImpact?(0,i.qy)` <wui-flex flexDirection="column" gap="2">
                        <wui-flex
                          justifyContent="space-between"
                          alignItems="center"
                          class="details-row"
                        >
                          <wui-flex alignItems="center" gap="2">
                            <wui-text
                              class="details-row-title"
                              variant="sm-regular"
                              color="secondary"
                            >
                              Price impact
                            </wui-text>
                            <w3m-tooltip-trigger
                              text="Price impact reflects the change in market price due to your trade"
                            >
                              <wui-icon size="sm" color="default" name="info"></wui-icon>
                            </w3m-tooltip-trigger>
                          </wui-flex>
                          <wui-flex>
                            <wui-text variant="sm-regular" color="secondary">
                              ${r.S.formatNumberToLocalString(this.priceImpact,3)}%
                            </wui-text>
                          </wui-flex>
                        </wui-flex>
                      </wui-flex>`:null}
                  ${this.maxSlippage&&this.sourceToken.symbol?(0,i.qy)`<wui-flex flexDirection="column" gap="2">
                        <wui-flex
                          justifyContent="space-between"
                          alignItems="center"
                          class="details-row"
                        >
                          <wui-flex alignItems="center" gap="2">
                            <wui-text
                              class="details-row-title"
                              variant="sm-regular"
                              color="secondary"
                            >
                              Max. slippage
                            </wui-text>
                            <w3m-tooltip-trigger
                              text=${`Max slippage sets the minimum amount you must receive for the transaction to proceed. ${e?`Transaction will be reversed if you receive less than ${r.S.formatNumberToLocalString(e,6)} ${this.toToken.symbol} due to price changes.`:""}`}
                            >
                              <wui-icon size="sm" color="default" name="info"></wui-icon>
                            </w3m-tooltip-trigger>
                          </wui-flex>
                          <wui-flex>
                            <wui-text variant="sm-regular" color="secondary">
                              ${r.S.formatNumberToLocalString(this.maxSlippage,6)}
                              ${this.toToken.symbol} ${b}%
                            </wui-text>
                          </wui-flex>
                        </wui-flex>
                      </wui-flex>`:null}
                  <wui-flex flexDirection="column" gap="2">
                    <wui-flex
                      justifyContent="space-between"
                      alignItems="center"
                      class="details-row provider-free-row"
                    >
                      <wui-flex alignItems="center" gap="2">
                        <wui-text class="details-row-title" variant="sm-regular" color="secondary">
                          Provider fee
                        </wui-text>
                      </wui-flex>
                      <wui-flex>
                        <wui-text variant="sm-regular" color="secondary">0.85%</wui-text>
                      </wui-flex>
                    </wui-flex>
                  </wui-flex>
                </wui-flex>
              `:null}
        </wui-flex>
      </wui-flex>
    `}toggleDetails(){this.detailsOpen=!this.detailsOpen}};x.styles=[k],f([(0,n.wk)()],x.prototype,"networkName",void 0),f([(0,n.MZ)()],x.prototype,"detailsOpen",void 0),f([(0,n.wk)()],x.prototype,"sourceToken",void 0),f([(0,n.wk)()],x.prototype,"toToken",void 0),f([(0,n.wk)()],x.prototype,"toTokenAmount",void 0),f([(0,n.wk)()],x.prototype,"sourceTokenPriceInUSD",void 0),f([(0,n.wk)()],x.prototype,"toTokenPriceInUSD",void 0),f([(0,n.wk)()],x.prototype,"priceImpact",void 0),f([(0,n.wk)()],x.prototype,"maxSlippage",void 0),f([(0,n.wk)()],x.prototype,"networkTokenSymbol",void 0),f([(0,n.wk)()],x.prototype,"inputError",void 0),x=f([(0,w.EM)("w3m-swap-details")],x),o(41699);let y=(0,w.AH)`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: ${({borderRadius:e})=>e["5"]};
    padding: ${({spacing:e})=>e["5"]};
    padding-right: ${({spacing:e})=>e["3"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    position: relative;
  }

  wui-shimmer.market-value {
    opacity: 0;
  }

  :host > wui-flex > svg.input_mask {
    position: absolute;
    inset: 0;
    z-index: 5;
  }

  :host wui-flex .input_mask__border,
  :host wui-flex .input_mask__background {
    transition: fill ${({durations:e})=>e.md}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: fill;
  }

  :host wui-flex .input_mask__border {
    fill: ${({tokens:e})=>e.core.glass010};
  }

  :host wui-flex .input_mask__background {
    fill: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var v=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let T=class extends i.WF{constructor(){super(...arguments),this.target="sourceToken"}render(){return(0,i.qy)`
      <wui-flex class justifyContent="space-between">
        <wui-flex
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          class="swap-input"
          gap="1"
        >
          <wui-shimmer width="80px" height="40px" rounded variant="light"></wui-shimmer>
        </wui-flex>
        ${this.templateTokenSelectButton()}
      </wui-flex>
    `}templateTokenSelectButton(){return(0,i.qy)`
      <wui-flex
        class="swap-token-button"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        gap="1"
      >
        <wui-shimmer width="80px" height="40px" rounded variant="light"></wui-shimmer>
      </wui-flex>
    `}};T.styles=[y],v([(0,n.MZ)()],T.prototype,"target",void 0),T=v([(0,w.EM)("w3m-swap-input-skeleton")],T);let $={numericInputKeyDown(e,t,o){let i=e.metaKey||e.ctrlKey,n=e.key,r=n.toLocaleLowerCase(),a=","===n,s="."===n,l=n>="0"&&n<="9";i||"a"!==r&&"c"!==r&&"v"!==r&&"x"!==r||e.preventDefault(),"0"!==t||a||s||"0"!==n||e.preventDefault(),"0"===t&&l&&(o(n),e.preventDefault()),(a||s)&&(t||(o("0."),e.preventDefault()),(t?.includes(".")||t?.includes(","))&&e.preventDefault()),l||["Backspace","Meta","Ctrl","a","A","c","C","x","X","v","V","ArrowLeft","ArrowRight","Tab"].includes(n)||s||a||e.preventDefault()}};o(42103);let S=(0,w.AH)`
  :host > wui-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: ${({borderRadius:e})=>e["5"]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e["5"]};
    padding-right: ${({spacing:e})=>e["3"]};
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    position: relative;
    transition: box-shadow ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.lg};
    will-change: background-color;
  }

  :host wui-flex.focus {
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.core.glass010};
  }

  :host > wui-flex .swap-input,
  :host > wui-flex .swap-token-button {
    z-index: 10;
  }

  :host > wui-flex .swap-input {
    -webkit-mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
    mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
  }

  :host > wui-flex .swap-input input {
    background: none;
    border: none;
    height: 42px;
    width: 100%;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    letter-spacing: -1.28px;
    outline: none;
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
    color: ${({tokens:e})=>e.theme.textPrimary};
    padding: 0px;
  }

  :host > wui-flex .swap-input input:focus-visible {
    outline: none;
  }

  :host > wui-flex .swap-input input::-webkit-outer-spin-button,
  :host > wui-flex .swap-input input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .max-value-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${({tokens:e})=>e.core.glass010};
    padding-left: 0px;
  }

  .market-value {
    min-height: 18px;
  }
`;var I=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let P=class extends i.WF{constructor(){super(...arguments),this.focused=!1,this.price=0,this.target="sourceToken",this.onSetAmount=null,this.onSetMaxValue=null}render(){let e=this.marketValue||"0",t=r.S.bigNumber(e).gt("0");return(0,i.qy)`
      <wui-flex
        class="${this.focused?"focus":""}"
        justifyContent="space-between"
        alignItems="center"
      >
        <wui-flex
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          class="swap-input"
        >
          <input
            data-testid="swap-input-${this.target}"
            @focusin=${()=>this.onFocusChange(!0)}
            @focusout=${()=>this.onFocusChange(!1)}
            ?disabled=${this.disabled}
            value=${this.value||""}
            @input=${this.dispatchInputChangeEvent}
            @keydown=${this.handleKeydown}
            placeholder="0"
            type="text"
            inputmode="decimal"
            pattern="[0-9,.]*"
          />
          <wui-text class="market-value" variant="sm-regular" color="secondary">
            ${t?`$${r.S.formatNumberToLocalString(this.marketValue,2)}`:null}
          </wui-text>
        </wui-flex>
        ${this.templateTokenSelectButton()}
      </wui-flex>
    `}handleKeydown(e){return $.numericInputKeyDown(e,this.value,e=>this.onSetAmount?.(this.target,e))}dispatchInputChangeEvent(e){if(!this.onSetAmount)return;let t=e.target.value.replace(/[^0-9.]/gu,"");","===t||"."===t?this.onSetAmount(this.target,"0."):t.endsWith(",")?this.onSetAmount(this.target,t.replace(",",".")):this.onSetAmount(this.target,t)}setMaxValueToInput(){this.onSetMaxValue?.(this.target,this.balance)}templateTokenSelectButton(){return this.token?(0,i.qy)`
      <wui-flex
        class="swap-token-button"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        gap="1"
      >
        <wui-token-button
          data-testid="swap-input-token-${this.target}"
          text=${this.token.symbol}
          imageSrc=${this.token.logoUri}
          @click=${this.onSelectToken.bind(this)}
        >
        </wui-token-button>
        <wui-flex alignItems="center" gap="1"> ${this.tokenBalanceTemplate()} </wui-flex>
      </wui-flex>
    `:(0,i.qy)` <wui-button
        data-testid="swap-select-token-button-${this.target}"
        class="swap-token-button"
        size="md"
        variant="neutral-secondary"
        @click=${this.onSelectToken.bind(this)}
      >
        Select token
      </wui-button>`}tokenBalanceTemplate(){let e=r.S.multiply(this.balance,this.price),t=!!e&&e?.gt(5e-5);return(0,i.qy)`
      ${t?(0,i.qy)`<wui-text variant="sm-regular" color="secondary">
            ${r.S.formatNumberToLocalString(this.balance,2)}
          </wui-text>`:null}
      ${"sourceToken"===this.target?this.tokenActionButtonTemplate(t):null}
    `}tokenActionButtonTemplate(e){return e?(0,i.qy)` <button class="max-value-button" @click=${this.setMaxValueToInput.bind(this)}>
        <wui-text color="accent-primary" variant="sm-medium">Max</wui-text>
      </button>`:(0,i.qy)` <button class="max-value-button" @click=${this.onBuyToken.bind(this)}>
      <wui-text color="accent-primary" variant="sm-medium">Buy</wui-text>
    </button>`}onFocusChange(e){this.focused=e}onSelectToken(){p.E.sendEvent({type:"track",event:"CLICK_SELECT_TOKEN_TO_SWAP"}),a.I.push("SwapSelectToken",{target:this.target})}onBuyToken(){a.I.push("OnRampProviders")}};P.styles=[S],I([(0,n.MZ)()],P.prototype,"focused",void 0),I([(0,n.MZ)()],P.prototype,"balance",void 0),I([(0,n.MZ)()],P.prototype,"value",void 0),I([(0,n.MZ)()],P.prototype,"price",void 0),I([(0,n.MZ)()],P.prototype,"marketValue",void 0),I([(0,n.MZ)()],P.prototype,"disabled",void 0),I([(0,n.MZ)()],P.prototype,"target",void 0),I([(0,n.MZ)()],P.prototype,"token",void 0),I([(0,n.MZ)()],P.prototype,"onSetAmount",void 0),I([(0,n.MZ)()],P.prototype,"onSetMaxValue",void 0),P=I([(0,w.EM)("w3m-swap-input")],P);let N=(0,w.AH)`
  :host > wui-flex:first-child {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .action-button {
    width: 100%;
    border-radius: ${({borderRadius:e})=>e["4"]};
  }

  .action-button:disabled {
    border-color: 1px solid ${({tokens:e})=>e.core.glass010};
  }

  .swap-inputs-container {
    position: relative;
  }

  wui-icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e["10"]} !important;
    border: 4px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }

  .replace-tokens-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: ${({spacing:e})=>e["2"]};
    border-radius: ${({borderRadius:e})=>e["4"]};
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: ${({spacing:e})=>e["2"]};
  }

  .details-container > wui-flex {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["3"]};
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    transition: background ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background;
  }

  .details-container > wui-flex > button:hover {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .details-content-container {
    padding: ${({spacing:e})=>e["2"]};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["5"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var A=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let D=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.initialParams=a.I.state.data?.swap,this.detailsOpen=!1,this.caipAddress=s.U.state.caipAddress,this.caipNetworkId=l.W.state.activeCaipNetwork?.caipNetworkId,this.initialized=c.GN.state.initialized,this.loadingQuote=c.GN.state.loadingQuote,this.loadingPrices=c.GN.state.loadingPrices,this.loadingTransaction=c.GN.state.loadingTransaction,this.sourceToken=c.GN.state.sourceToken,this.sourceTokenAmount=c.GN.state.sourceTokenAmount,this.sourceTokenPriceInUSD=c.GN.state.sourceTokenPriceInUSD,this.toToken=c.GN.state.toToken,this.toTokenAmount=c.GN.state.toTokenAmount,this.toTokenPriceInUSD=c.GN.state.toTokenPriceInUSD,this.inputError=c.GN.state.inputError,this.fetchError=c.GN.state.fetchError,this.lastTokenPriceUpdate=0,this.minTokenPriceUpdateInterval=1e4,this.visibilityChangeHandler=()=>{document?.hidden?(clearInterval(this.interval),this.interval=void 0):this.startTokenPriceInterval()},this.startTokenPriceInterval=()=>{this.interval&&Date.now()-this.lastTokenPriceUpdate<this.minTokenPriceUpdateInterval||(this.lastTokenPriceUpdate&&Date.now()-this.lastTokenPriceUpdate>this.minTokenPriceUpdateInterval&&this.fetchTokensAndValues(),clearInterval(this.interval),this.interval=setInterval(()=>{this.fetchTokensAndValues()},this.minTokenPriceUpdateInterval))},this.watchTokensAndValues=()=>{this.sourceToken&&this.toToken&&(this.subscribeToVisibilityChange(),this.startTokenPriceInterval())},this.onDebouncedGetSwapCalldata=u.w.debounce(async()=>{await c.GN.swapTokens()},200),l.W.subscribeKey("activeCaipNetwork",e=>this.onCaipNetworkChange({newCaipNetwork:e,resetSwapState:!0,initializeSwapState:!1})),s.U.subscribeKey("caipAddress",e=>this.onCaipAddressChange({newCaipAddress:e,resetSwapState:!0,initializeSwapState:!1})),this.unsubscribe.push(l.W.subscribeKey("activeCaipNetwork",e=>this.onCaipNetworkChange({newCaipNetwork:e,resetSwapState:!1,initializeSwapState:!0})),s.U.subscribeKey("caipAddress",e=>this.onCaipAddressChange({newCaipAddress:e,resetSwapState:!1,initializeSwapState:!0})),d.W.subscribeKey("open",e=>{e||c.GN.resetState()}),a.I.subscribeKey("view",e=>{e.includes("Swap")||c.GN.resetValues()}),c.GN.subscribe(e=>{this.initialized=e.initialized,this.loadingQuote=e.loadingQuote,this.loadingPrices=e.loadingPrices,this.loadingTransaction=e.loadingTransaction,this.sourceToken=e.sourceToken,this.sourceTokenAmount=e.sourceTokenAmount,this.sourceTokenPriceInUSD=e.sourceTokenPriceInUSD,this.toToken=e.toToken,this.toTokenAmount=e.toTokenAmount,this.toTokenPriceInUSD=e.toTokenPriceInUSD,this.inputError=e.inputError,this.fetchError=e.fetchError,e.sourceToken&&e.toToken&&this.watchTokensAndValues()}))}async firstUpdated(){c.GN.initializeState(),this.watchTokensAndValues(),await this.handleSwapParameters()}disconnectedCallback(){this.unsubscribe.forEach(e=>e?.()),clearInterval(this.interval),document?.removeEventListener("visibilitychange",this.visibilityChangeHandler)}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="3">
        ${this.initialized?this.templateSwap():this.templateLoading()}
      </wui-flex>
    `}subscribeToVisibilityChange(){document?.removeEventListener("visibilitychange",this.visibilityChangeHandler),document?.addEventListener("visibilitychange",this.visibilityChangeHandler)}fetchTokensAndValues(){c.GN.getNetworkTokenPrice(),c.GN.getMyTokensWithBalance(),c.GN.swapTokens(),this.lastTokenPriceUpdate=Date.now()}templateSwap(){return(0,i.qy)`
      <wui-flex flexDirection="column" gap="3">
        <wui-flex flexDirection="column" alignItems="center" gap="2" class="swap-inputs-container">
          ${this.templateTokenInput("sourceToken",this.sourceToken)}
          ${this.templateTokenInput("toToken",this.toToken)} ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateDetails()} ${this.templateActionButton()}
      </wui-flex>
    `}actionButtonLabel(){return this.fetchError?"Swap":this.sourceToken&&this.toToken?this.sourceTokenAmount?this.inputError?this.inputError:"Review swap":"Enter amount":"Select token"}templateReplaceTokensButton(){return(0,i.qy)`
      <wui-flex class="replace-tokens-button-container">
        <wui-icon-box
          @click=${this.onSwitchTokens.bind(this)}
          icon="recycleHorizontal"
          size="md"
          variant="default"
        ></wui-icon-box>
      </wui-flex>
    `}templateLoading(){return(0,i.qy)`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex flexDirection="column" alignItems="center" gap="2" class="swap-inputs-container">
          <w3m-swap-input-skeleton target="sourceToken"></w3m-swap-input-skeleton>
          <w3m-swap-input-skeleton target="toToken"></w3m-swap-input-skeleton>
          ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateActionButton()}
      </wui-flex>
    `}templateTokenInput(e,t){let o=c.GN.state.myTokensWithBalance?.find(e=>e?.address===t?.address),n="toToken"===e?this.toTokenAmount:this.sourceTokenAmount,a="toToken"===e?this.toTokenPriceInUSD:this.sourceTokenPriceInUSD,s=r.S.parseLocalStringToNumber(n)*a;return(0,i.qy)`<w3m-swap-input
      .value=${"toToken"===e?this.toTokenAmount:this.sourceTokenAmount}
      .disabled=${"toToken"===e}
      .onSetAmount=${this.handleChangeAmount.bind(this)}
      target=${e}
      .token=${t}
      .balance=${o?.quantity?.numeric}
      .price=${o?.price}
      .marketValue=${s}
      .onSetMaxValue=${this.onSetMaxValue.bind(this)}
    ></w3m-swap-input>`}onSetMaxValue(e,t){let o=r.S.bigNumber(t||"0");this.handleChangeAmount(e,o.gt(0)?o.toFixed(20):"0")}templateDetails(){return this.sourceToken&&this.toToken&&!this.inputError?(0,i.qy)`<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`:null}handleChangeAmount(e,t){c.GN.clearError(),"sourceToken"===e?c.GN.setSourceTokenAmount(t):c.GN.setToTokenAmount(t),this.onDebouncedGetSwapCalldata()}templateActionButton(){let e=!this.toToken||!this.sourceToken,t=!this.sourceTokenAmount,o=this.loadingQuote||this.loadingPrices||this.loadingTransaction,n=o||e||t||this.inputError;return(0,i.qy)` <wui-flex gap="2">
      <wui-button
        data-testid="swap-action-button"
        class="action-button"
        fullWidth
        size="lg"
        borderRadius="xs"
        variant="accent-primary"
        ?loading=${!!o}
        ?disabled=${!!n}
        @click=${this.onSwapPreview.bind(this)}
      >
        ${this.actionButtonLabel()}
      </wui-button>
    </wui-flex>`}onSwitchTokens(){c.GN.switchTokens()}async onSwapPreview(){this.fetchError&&await c.GN.swapTokens(),p.E.sendEvent({type:"track",event:"INITIATE_SWAP",properties:{network:this.caipNetworkId||"",swapFromToken:this.sourceToken?.symbol||"",swapToToken:this.toToken?.symbol||"",swapFromAmount:this.sourceTokenAmount||"",swapToAmount:this.toTokenAmount||"",isSmartAccount:(0,h.lj)(l.W.state.activeChain)===g.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}}),a.I.push("SwapPreview")}async handleSwapParameters(){if(this.initialParams){if(!c.GN.state.initialized){let e=new Promise(e=>{let t=c.GN.subscribeKey("initialized",o=>{o&&(t?.(),e())})});await e}await this.setSwapParameters(this.initialParams)}}async setSwapParameters({amount:e,fromToken:t,toToken:o}){if(!c.GN.state.tokens||!c.GN.state.myTokensWithBalance){let e=new Promise(e=>{let t=c.GN.subscribeKey("myTokensWithBalance",o=>{o&&o.length>0&&(t?.(),e())});setTimeout(()=>{t?.(),e()},5e3)});await e}let i=[...c.GN.state.tokens||[],...c.GN.state.myTokensWithBalance||[]];if(t){let e=i.find(e=>e.symbol.toLowerCase()===t.toLowerCase());e&&c.GN.setSourceToken(e)}if(o){let e=i.find(e=>e.symbol.toLowerCase()===o.toLowerCase());e&&c.GN.setToToken(e)}e&&!isNaN(Number(e))&&c.GN.setSourceTokenAmount(e)}onCaipAddressChange({newCaipAddress:e,resetSwapState:t,initializeSwapState:o}){this.caipAddress!==e&&(this.caipAddress=e,t&&c.GN.resetState(),o&&c.GN.initializeState())}onCaipNetworkChange({newCaipNetwork:e,resetSwapState:t,initializeSwapState:o}){this.caipNetworkId!==e?.caipNetworkId&&(this.caipNetworkId=e?.caipNetworkId,t&&c.GN.resetState(),o&&c.GN.initializeState())}};D.styles=N,A([(0,n.MZ)({type:Object})],D.prototype,"initialParams",void 0),A([(0,n.wk)()],D.prototype,"interval",void 0),A([(0,n.wk)()],D.prototype,"detailsOpen",void 0),A([(0,n.wk)()],D.prototype,"caipAddress",void 0),A([(0,n.wk)()],D.prototype,"caipNetworkId",void 0),A([(0,n.wk)()],D.prototype,"initialized",void 0),A([(0,n.wk)()],D.prototype,"loadingQuote",void 0),A([(0,n.wk)()],D.prototype,"loadingPrices",void 0),A([(0,n.wk)()],D.prototype,"loadingTransaction",void 0),A([(0,n.wk)()],D.prototype,"sourceToken",void 0),A([(0,n.wk)()],D.prototype,"sourceTokenAmount",void 0),A([(0,n.wk)()],D.prototype,"sourceTokenPriceInUSD",void 0),A([(0,n.wk)()],D.prototype,"toToken",void 0),A([(0,n.wk)()],D.prototype,"toTokenAmount",void 0),A([(0,n.wk)()],D.prototype,"toTokenPriceInUSD",void 0),A([(0,n.wk)()],D.prototype,"inputError",void 0),A([(0,n.wk)()],D.prototype,"fetchError",void 0),A([(0,n.wk)()],D.prototype,"lastTokenPriceUpdate",void 0),D=A([(0,w.EM)("w3m-swap-view")],D);let C=(0,w.AH)`
  :host > wui-flex:first-child {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  .preview-container,
  .details-container {
    width: 100%;
  }

  .token-image {
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.core.glass010};
    border-radius: 12px;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .token-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e["2"]};
    padding: ${({spacing:e})=>e["2"]};
    height: 40px;
    border: none;
    border-radius: 80px;
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    cursor: pointer;
    transition: background ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background;
  }

  .token-item:hover {
    background: ${({tokens:e})=>e.core.glass010};
  }

  .preview-token-details-container {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["5"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .action-buttons-container {
    width: 100%;
    gap: ${({spacing:e})=>e["2"]};
  }

  .action-buttons-container > button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    height: 48px;
    border-radius: ${({borderRadius:e})=>e["4"]};
    border: none;
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }

  .action-buttons-container > button:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  .action-button > wui-loading-spinner {
    display: inline-block;
  }

  .cancel-button:hover,
  .action-button:hover {
    cursor: pointer;
  }

  .action-buttons-container > wui-button.cancel-button {
    flex: 2;
  }

  .action-buttons-container > wui-button.action-button {
    flex: 4;
  }

  .action-buttons-container > button.action-button > wui-text {
    color: white;
  }

  .details-container > wui-flex {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e["3"]};
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: ${({spacing:e})=>e["3"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    transition: background ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background;
  }

  .details-container > wui-flex > button:hover {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .details-content-container {
    padding: ${({spacing:e})=>e["2"]};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: ${({spacing:e})=>e["3"]} ${({spacing:e})=>e["5"]};
    border-radius: ${({borderRadius:e})=>e["3"]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }
`;var G=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let E=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.detailsOpen=!0,this.approvalTransaction=c.GN.state.approvalTransaction,this.swapTransaction=c.GN.state.swapTransaction,this.sourceToken=c.GN.state.sourceToken,this.sourceTokenAmount=c.GN.state.sourceTokenAmount??"",this.sourceTokenPriceInUSD=c.GN.state.sourceTokenPriceInUSD,this.toToken=c.GN.state.toToken,this.toTokenAmount=c.GN.state.toTokenAmount??"",this.toTokenPriceInUSD=c.GN.state.toTokenPriceInUSD,this.caipNetwork=l.W.state.activeCaipNetwork,this.balanceSymbol=s.U.state.balanceSymbol,this.inputError=c.GN.state.inputError,this.loadingQuote=c.GN.state.loadingQuote,this.loadingApprovalTransaction=c.GN.state.loadingApprovalTransaction,this.loadingBuildTransaction=c.GN.state.loadingBuildTransaction,this.loadingTransaction=c.GN.state.loadingTransaction,this.unsubscribe.push(s.U.subscribeKey("balanceSymbol",e=>{this.balanceSymbol!==e&&a.I.goBack()}),l.W.subscribeKey("activeCaipNetwork",e=>{this.caipNetwork!==e&&(this.caipNetwork=e)}),c.GN.subscribe(e=>{this.approvalTransaction=e.approvalTransaction,this.swapTransaction=e.swapTransaction,this.sourceToken=e.sourceToken,this.toToken=e.toToken,this.toTokenPriceInUSD=e.toTokenPriceInUSD,this.sourceTokenAmount=e.sourceTokenAmount??"",this.toTokenAmount=e.toTokenAmount??"",this.inputError=e.inputError,e.inputError&&a.I.goBack(),this.loadingQuote=e.loadingQuote,this.loadingApprovalTransaction=e.loadingApprovalTransaction,this.loadingBuildTransaction=e.loadingBuildTransaction,this.loadingTransaction=e.loadingTransaction}))}firstUpdated(){c.GN.getTransaction(),this.refreshTransaction()}disconnectedCallback(){this.unsubscribe.forEach(e=>e?.()),clearInterval(this.interval)}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="3">
        ${this.templateSwap()}
      </wui-flex>
    `}refreshTransaction(){this.interval=setInterval(()=>{c.GN.getApprovalLoadingState()||c.GN.getTransaction()},1e4)}templateSwap(){let e=`${r.S.formatNumberToLocalString(parseFloat(this.sourceTokenAmount))} ${this.sourceToken?.symbol}`,t=`${r.S.formatNumberToLocalString(parseFloat(this.toTokenAmount))} ${this.toToken?.symbol}`,o=parseFloat(this.sourceTokenAmount)*this.sourceTokenPriceInUSD,n=parseFloat(this.toTokenAmount)*this.toTokenPriceInUSD,a=r.S.formatNumberToLocalString(o),s=r.S.formatNumberToLocalString(n),l=this.loadingQuote||this.loadingBuildTransaction||this.loadingTransaction||this.loadingApprovalTransaction;return(0,i.qy)`
      <wui-flex flexDirection="column" alignItems="center" gap="4">
        <wui-flex class="preview-container" flexDirection="column" alignItems="flex-start" gap="4">
          <wui-flex
            class="preview-token-details-container"
            alignItems="center"
            justifyContent="space-between"
            gap="4"
          >
            <wui-flex flexDirection="column" alignItems="flex-start" gap="01">
              <wui-text variant="sm-regular" color="secondary">Send</wui-text>
              <wui-text variant="md-regular" color="primary">$${a}</wui-text>
            </wui-flex>
            <wui-token-button
              flexDirection="row-reverse"
              text=${e}
              imageSrc=${this.sourceToken?.logoUri}
            >
            </wui-token-button>
          </wui-flex>
          <wui-icon name="recycleHorizontal" color="default" size="md"></wui-icon>
          <wui-flex
            class="preview-token-details-container"
            alignItems="center"
            justifyContent="space-between"
            gap="4"
          >
            <wui-flex flexDirection="column" alignItems="flex-start" gap="01">
              <wui-text variant="sm-regular" color="secondary">Receive</wui-text>
              <wui-text variant="md-regular" color="primary">$${s}</wui-text>
            </wui-flex>
            <wui-token-button
              flexDirection="row-reverse"
              text=${t}
              imageSrc=${this.toToken?.logoUri}
            >
            </wui-token-button>
          </wui-flex>
        </wui-flex>

        ${this.templateDetails()}

        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="2">
          <wui-icon size="sm" color="default" name="info"></wui-icon>
          <wui-text variant="sm-regular" color="secondary">Review transaction carefully</wui-text>
        </wui-flex>

        <wui-flex
          class="action-buttons-container"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-button
            class="cancel-button"
            fullWidth
            size="lg"
            borderRadius="xs"
            variant="neutral-secondary"
            @click=${this.onCancelTransaction.bind(this)}
          >
            <wui-text variant="md-medium" color="secondary">Cancel</wui-text>
          </wui-button>
          <wui-button
            class="action-button"
            fullWidth
            size="lg"
            borderRadius="xs"
            variant="accent-primary"
            ?loading=${l}
            ?disabled=${l}
            @click=${this.onSendTransaction.bind(this)}
          >
            <wui-text variant="md-medium" color="invert"> ${this.actionButtonLabel()} </wui-text>
          </wui-button>
        </wui-flex>
      </wui-flex>
    `}templateDetails(){return this.sourceToken&&this.toToken&&!this.inputError?(0,i.qy)`<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`:null}actionButtonLabel(){return this.loadingApprovalTransaction?"Approving...":this.approvalTransaction?"Approve":"Swap"}onCancelTransaction(){a.I.goBack()}onSendTransaction(){this.approvalTransaction?c.GN.sendTransactionForApproval(this.approvalTransaction):c.GN.sendTransactionForSwap(this.swapTransaction)}};E.styles=C,G([(0,n.wk)()],E.prototype,"interval",void 0),G([(0,n.wk)()],E.prototype,"detailsOpen",void 0),G([(0,n.wk)()],E.prototype,"approvalTransaction",void 0),G([(0,n.wk)()],E.prototype,"swapTransaction",void 0),G([(0,n.wk)()],E.prototype,"sourceToken",void 0),G([(0,n.wk)()],E.prototype,"sourceTokenAmount",void 0),G([(0,n.wk)()],E.prototype,"sourceTokenPriceInUSD",void 0),G([(0,n.wk)()],E.prototype,"toToken",void 0),G([(0,n.wk)()],E.prototype,"toTokenAmount",void 0),G([(0,n.wk)()],E.prototype,"toTokenPriceInUSD",void 0),G([(0,n.wk)()],E.prototype,"caipNetwork",void 0),G([(0,n.wk)()],E.prototype,"balanceSymbol",void 0),G([(0,n.wk)()],E.prototype,"inputError",void 0),G([(0,n.wk)()],E.prototype,"loadingQuote",void 0),G([(0,n.wk)()],E.prototype,"loadingApprovalTransaction",void 0),G([(0,n.wk)()],E.prototype,"loadingBuildTransaction",void 0),G([(0,n.wk)()],E.prototype,"loadingTransaction",void 0),E=G([(0,w.EM)("w3m-swap-preview-view")],E),o(40284),o(45166),o(24772),o(38534);var R=o(71084),j=o(47327),U=o(20296);let L=(0,U.AH)`
  :host {
    width: 100%;
    height: 60px;
    min-height: 60px;
  }

  :host > wui-flex {
    cursor: pointer;
    height: 100%;
    display: flex;
    column-gap: ${({spacing:e})=>e["3"]};
    padding: ${({spacing:e})=>e["2"]};
    padding-right: ${({spacing:e})=>e["4"]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e["4"]};
    color: ${({tokens:e})=>e.theme.foregroundSecondary};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, opacity;
  }

  @media (hover: hover) and (pointer: fine) {
    :host > wui-flex:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }

    :host > wui-flex:active {
      background-color: ${({tokens:e})=>e.core.glass010};
    }
  }

  :host([disabled]) > wui-flex {
    opacity: 0.6;
  }

  :host([disabled]) > wui-flex:hover {
    background-color: transparent;
  }

  :host > wui-flex > wui-flex {
    flex: 1;
  }

  :host > wui-flex > wui-image,
  :host > wui-flex > .token-item-image-placeholder {
    width: 40px;
    max-width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e["20"]};
    position: relative;
  }

  :host > wui-flex > .token-item-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host > wui-flex > wui-image::after,
  :host > wui-flex > .token-item-image-placeholder::after {
    position: absolute;
    content: '';
    inset: 0;
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
    border-radius: ${({borderRadius:e})=>e["8"]};
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: ${({borderRadius:e})=>e["2"]};
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }
`;var O=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let q=class extends i.WF{constructor(){super(),this.observer=new IntersectionObserver(()=>void 0),this.imageSrc=void 0,this.name=void 0,this.symbol=void 0,this.price=void 0,this.amount=void 0,this.visible=!1,this.imageError=!1,this.observer=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?this.visible=!0:this.visible=!1})},{threshold:.1})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){if(!this.visible)return null;let e=this.amount&&this.price?r.S.multiply(this.price,this.amount)?.toFixed(3):null;return(0,i.qy)`
      <wui-flex alignItems="center">
        ${this.visualTemplate()}
        <wui-flex flexDirection="column" gap="1">
          <wui-flex justifyContent="space-between">
            <wui-text variant="md-medium" color="primary" lineClamp="1">${this.name}</wui-text>
            ${e?(0,i.qy)`
                  <wui-text variant="md-medium" color="primary">
                    $${r.S.formatNumberToLocalString(e,3)}
                  </wui-text>
                `:null}
          </wui-flex>
          <wui-flex justifyContent="space-between">
            <wui-text variant="sm-regular" color="secondary" lineClamp="1">${this.symbol}</wui-text>
            ${this.amount?(0,i.qy)`<wui-text variant="sm-regular" color="secondary">
                  ${r.S.formatNumberToLocalString(this.amount,5)}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}visualTemplate(){return this.imageError?(0,i.qy)`<wui-flex class="token-item-image-placeholder">
        <wui-icon name="image" color="inherit"></wui-icon>
      </wui-flex>`:this.imageSrc?(0,i.qy)`<wui-image
        width="40"
        height="40"
        src=${this.imageSrc}
        @onLoadError=${this.imageLoadError}
      ></wui-image>`:null}imageLoadError(){this.imageError=!0}};q.styles=[R.W5,R.fD,L],O([(0,n.MZ)()],q.prototype,"imageSrc",void 0),O([(0,n.MZ)()],q.prototype,"name",void 0),O([(0,n.MZ)()],q.prototype,"symbol",void 0),O([(0,n.MZ)()],q.prototype,"price",void 0),O([(0,n.MZ)()],q.prototype,"amount",void 0),O([(0,n.wk)()],q.prototype,"visible",void 0),O([(0,n.wk)()],q.prototype,"imageError",void 0),q=O([(0,j.E)("wui-token-list-item")],q),o(40396);let z=(0,U.AH)`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    cursor: pointer;
    height: 100%;
    width: 100%;
    display: flex;
    column-gap: ${({spacing:e})=>e["3"]};
    padding: ${({spacing:e})=>e["2"]};
    padding-right: ${({spacing:e})=>e["4"]};
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`,M=class extends i.WF{render(){return(0,i.qy)`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="1">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-flex flexDirection="column" gap="1" alignItems="flex-end">
          <wui-shimmer width="24px" height="12px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="32px" height="12px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};M.styles=[R.W5,z],M=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a}([(0,j.E)("wui-token-list-item-loader")],M);let B=(0,w.AH)`
  :host {
    --tokens-scroll--top-opacity: 0;
    --tokens-scroll--bottom-opacity: 1;
    --suggested-tokens-scroll--left-opacity: 0;
    --suggested-tokens-scroll--right-opacity: 1;
  }

  :host > wui-flex:first-child {
    overflow-y: hidden;
    overflow-x: hidden;
    scrollbar-width: none;
    scrollbar-height: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .suggested-tokens-container {
    overflow-x: auto;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, calc(1 - var(--suggested-tokens-scroll--left-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--suggested-tokens-scroll--left-opacity))) 1px,
      black 50px,
      black 90px,
      black calc(100% - 90px),
      black calc(100% - 50px),
      rgba(155, 155, 155, calc(1 - var(--suggested-tokens-scroll--right-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--suggested-tokens-scroll--right-opacity))) 100%
    );
  }

  .suggested-tokens-container::-webkit-scrollbar {
    display: none;
  }

  .tokens-container {
    border-top: 1px solid ${({tokens:e})=>e.core.glass010};
    height: 100%;
    max-height: 390px;
  }

  .tokens {
    width: 100%;
    overflow-y: auto;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--tokens-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--tokens-scroll--top-opacity))) 1px,
      black 50px,
      black 90px,
      black calc(100% - 90px),
      black calc(100% - 50px),
      rgba(155, 155, 155, calc(1 - var(--tokens-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--tokens-scroll--bottom-opacity))) 100%
    );
  }

  .network-search-input,
  .select-network-button {
    height: 40px;
  }

  .select-network-button {
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:e})=>e["2"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e["3"]};
    padding: ${({spacing:e})=>e["2"]};
    align-items: center;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  .select-network-button:hover {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .select-network-button > wui-image {
    width: 26px;
    height: 26px;
    border-radius: ${({borderRadius:e})=>e["4"]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }
`;var W=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let V=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.targetToken=a.I.state.data?.target,this.sourceToken=c.GN.state.sourceToken,this.sourceTokenAmount=c.GN.state.sourceTokenAmount,this.toToken=c.GN.state.toToken,this.myTokensWithBalance=c.GN.state.myTokensWithBalance,this.popularTokens=c.GN.state.popularTokens,this.suggestedTokens=c.GN.state.suggestedTokens,this.tokensLoading=c.GN.state.tokensLoading,this.searchValue="",this.unsubscribe.push(c.GN.subscribe(e=>{this.sourceToken=e.sourceToken,this.toToken=e.toToken,this.myTokensWithBalance=e.myTokensWithBalance,this.popularTokens=e.popularTokens,this.suggestedTokens=e.suggestedTokens,this.tokensLoading=e.tokensLoading}))}async firstUpdated(){await c.GN.getTokenList()}updated(){let e=this.renderRoot?.querySelector(".suggested-tokens-container");e?.addEventListener("scroll",this.handleSuggestedTokensScroll.bind(this));let t=this.renderRoot?.querySelector(".tokens");t?.addEventListener("scroll",this.handleTokenListScroll.bind(this))}disconnectedCallback(){super.disconnectedCallback();let e=this.renderRoot?.querySelector(".suggested-tokens-container"),t=this.renderRoot?.querySelector(".tokens");e?.removeEventListener("scroll",this.handleSuggestedTokensScroll.bind(this)),t?.removeEventListener("scroll",this.handleTokenListScroll.bind(this)),clearInterval(this.interval)}render(){return(0,i.qy)`
      <wui-flex flexDirection="column" gap="3">
        ${this.templateSearchInput()} ${this.templateSuggestedTokens()} ${this.templateTokens()}
      </wui-flex>
    `}onSelectToken(e){"sourceToken"===this.targetToken?c.GN.setSourceToken(e):(c.GN.setToToken(e),this.sourceToken&&this.sourceTokenAmount&&c.GN.swapTokens()),a.I.goBack()}templateSearchInput(){return(0,i.qy)`
      <wui-flex .padding=${["1","3","0","3"]} gap="2">
        <wui-input-text
          data-testid="swap-select-token-search-input"
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
          .value=${this.searchValue}
          @inputChange=${this.onSearchInputChange.bind(this)}
        ></wui-input-text>
      </wui-flex>
    `}templateMyTokens(){let e=this.myTokensWithBalance?Object.values(this.myTokensWithBalance):[],t=this.filterTokensWithText(e,this.searchValue);return t?.length>0?(0,i.qy)`<wui-flex justifyContent="flex-start" padding="2">
          <wui-text variant="md-medium" color="secondary">Your tokens</wui-text>
        </wui-flex>
        ${t.map(e=>{let t=e.symbol===this.sourceToken?.symbol||e.symbol===this.toToken?.symbol;return(0,i.qy)`
            <wui-token-list-item
              data-testid="swap-select-token-item-${e.symbol}"
              name=${e.name}
              ?disabled=${t}
              symbol=${e.symbol}
              price=${e?.price}
              amount=${e?.quantity?.numeric}
              imageSrc=${e.logoUri}
              @click=${()=>{t||this.onSelectToken(e)}}
            >
            </wui-token-list-item>
          `})}`:null}templateAllTokens(){let e=this.popularTokens?this.popularTokens:[],t=this.filterTokensWithText(e,this.searchValue);return this.tokensLoading?(0,i.qy)`
        <wui-token-list-item-loader></wui-token-list-item-loader>
        <wui-token-list-item-loader></wui-token-list-item-loader>
        <wui-token-list-item-loader></wui-token-list-item-loader>
        <wui-token-list-item-loader></wui-token-list-item-loader>
        <wui-token-list-item-loader></wui-token-list-item-loader>
      `:t?.length>0?(0,i.qy)`
        ${t.map(e=>(0,i.qy)`
            <wui-token-list-item
              data-testid="swap-select-token-item-${e.symbol}"
              name=${e.name}
              symbol=${e.symbol}
              imageSrc=${e.logoUri}
              @click=${()=>this.onSelectToken(e)}
            >
            </wui-token-list-item>
          `)}
      `:null}templateTokens(){return(0,i.qy)`
      <wui-flex class="tokens-container">
        <wui-flex class="tokens" .padding=${["0","2","2","2"]} flexDirection="column">
          ${this.templateMyTokens()}
          <wui-flex justifyContent="flex-start" padding="3">
            <wui-text variant="md-medium" color="secondary">Tokens</wui-text>
          </wui-flex>
          ${this.templateAllTokens()}
        </wui-flex>
      </wui-flex>
    `}templateSuggestedTokens(){let e=this.suggestedTokens?this.suggestedTokens.slice(0,8):null;return this.tokensLoading?(0,i.qy)`
        <wui-flex
          class="suggested-tokens-container"
          .padding=${["0","3","0","3"]}
          gap="2"
        >
          <wui-token-button loading></wui-token-button>
          <wui-token-button loading></wui-token-button>
          <wui-token-button loading></wui-token-button>
          <wui-token-button loading></wui-token-button>
          <wui-token-button loading></wui-token-button>
        </wui-flex>
      `:e?(0,i.qy)`
      <wui-flex
        class="suggested-tokens-container"
        .padding=${["0","3","0","3"]}
        gap="2"
      >
        ${e.map(e=>(0,i.qy)`
            <wui-token-button
              text=${e.symbol}
              imageSrc=${e.logoUri}
              @click=${()=>this.onSelectToken(e)}
            >
            </wui-token-button>
          `)}
      </wui-flex>
    `:null}onSearchInputChange(e){this.searchValue=e.detail}handleSuggestedTokensScroll(){let e=this.renderRoot?.querySelector(".suggested-tokens-container");e&&(e.style.setProperty("--suggested-tokens-scroll--left-opacity",w.z8.interpolate([0,100],[0,1],e.scrollLeft).toString()),e.style.setProperty("--suggested-tokens-scroll--right-opacity",w.z8.interpolate([0,100],[0,1],e.scrollWidth-e.scrollLeft-e.offsetWidth).toString()))}handleTokenListScroll(){let e=this.renderRoot?.querySelector(".tokens");e&&(e.style.setProperty("--tokens-scroll--top-opacity",w.z8.interpolate([0,100],[0,1],e.scrollTop).toString()),e.style.setProperty("--tokens-scroll--bottom-opacity",w.z8.interpolate([0,100],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString()))}filterTokensWithText(e,t){return e.filter(e=>`${e.symbol} ${e.name} ${e.address}`.toLowerCase().includes(t.toLowerCase())).sort((e,o)=>{let i=`${e.symbol} ${e.name} ${e.address}`.toLowerCase(),n=`${o.symbol} ${o.name} ${o.address}`.toLowerCase();return i.indexOf(t.toLowerCase())-n.indexOf(t.toLowerCase())})}};V.styles=B,W([(0,n.wk)()],V.prototype,"interval",void 0),W([(0,n.wk)()],V.prototype,"targetToken",void 0),W([(0,n.wk)()],V.prototype,"sourceToken",void 0),W([(0,n.wk)()],V.prototype,"sourceTokenAmount",void 0),W([(0,n.wk)()],V.prototype,"toToken",void 0),W([(0,n.wk)()],V.prototype,"myTokensWithBalance",void 0),W([(0,n.wk)()],V.prototype,"popularTokens",void 0),W([(0,n.wk)()],V.prototype,"suggestedTokens",void 0),W([(0,n.wk)()],V.prototype,"tokensLoading",void 0),W([(0,n.wk)()],V.prototype,"searchValue",void 0),V=W([(0,w.EM)("w3m-swap-select-token-view")],V)},61896:(e,t,o)=>{var i=o(83138),n=o(98410),r=o(4959),a=o(67869),s=o(81701),l=o(36211);let c=(0,i.AH)`
  :host {
    width: 100%;
    display: block;
  }
`;var u=function(e,t,o,i){var n,r=arguments.length,a=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(r<3?n(a):r>3?n(t,o,a):n(t,o))||a);return r>3&&a&&Object.defineProperty(t,o,a),a};let d=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.text="",this.open=r.I.state.open,this.unsubscribe.push(a.I.subscribeKey("view",()=>{r.I.hide()}),s.W.subscribeKey("open",e=>{e||r.I.hide()}),r.I.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),r.I.hide()}render(){return(0,i.qy)`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return(0,i.qy)`<slot></slot> `}onMouseEnter(){let e=this.getBoundingClientRect();if(!this.open){let t=document.querySelector("w3m-modal"),o={width:e.width,height:e.height,left:e.left,top:e.top};if(t){let i=t.getBoundingClientRect();o.left=e.left-(window.innerWidth-i.width)/2,o.top=e.top-(window.innerHeight-i.height)/2}r.I.showTooltip({message:this.text,triggerRect:o,variant:"shade"})}}onMouseLeave(e){this.contains(e.relatedTarget)||r.I.hide()}};d.styles=[c],u([(0,n.MZ)()],d.prototype,"text",void 0),u([(0,n.wk)()],d.prototype,"open",void 0),d=u([(0,l.EM)("w3m-tooltip-trigger")],d)}}]);