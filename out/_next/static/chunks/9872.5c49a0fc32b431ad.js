"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9872],{19872:(e,t,i)=>{i.r(t),i.d(t,{W3mWalletReceiveView:()=>C});var r=i(83138),o=i(98410),s=i(78964),a=i(58051),n=i(93481),l=i(65374),c=i(14744),p=i(45069),d=i(71305),h=i(67869),u=i(12319),g=i(36211);i(99691),i(45166),i(24772),i(38534);var w=i(71084),f=i(47327),m=i(20296);let y=(0,m.AH)`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[4]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[3]};
    border: none;
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:active:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-text {
    flex: 1;
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-flex {
    width: auto;
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e["01"]};
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  .network-icon {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[4]};
    overflow: hidden;
    margin-left: -8px;
  }

  .network-icon:first-child {
    margin-left: 0px;
  }

  .network-icon:after {
    position: absolute;
    inset: 0;
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }
`;var b=function(e,t,i,r){var o,s=arguments.length,a=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let k=class extends r.WF{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return(0,r.qy)`
      <button>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
        <wui-flex>
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="inherit"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let e=this.networkImages.slice(0,5);return(0,r.qy)` <wui-flex class="networks">
      ${e?.map(e=>(0,r.qy)` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`)}
    </wui-flex>`}};k.styles=[w.W5,w.fD,y],b([(0,o.MZ)({type:Array})],k.prototype,"networkImages",void 0),b([(0,o.MZ)()],k.prototype,"text",void 0),k=b([(0,f.E)("wui-compatible-network")],k),i(40575),i(34563),i(41163);var v=i(73537);let x=(0,g.AH)`
  wui-compatible-network {
    margin-top: ${({spacing:e})=>e["4"]};
    width: 100%;
  }

  wui-qr-code {
    width: unset !important;
    height: unset !important;
  }

  wui-icon {
    align-items: normal;
  }
`;var $=function(e,t,i,r){var o,s=arguments.length,a=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let C=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.address=a.U.state.address,this.profileName=a.U.state.profileName,this.network=n.W.state.activeCaipNetwork,this.unsubscribe.push(a.U.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName):l.P.showError("Account not found")}),n.W.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw Error("w3m-wallet-receive-view: No account provided");let e=c.$.getNetworkImage(this.network);return(0,r.qy)` <wui-flex
      flexDirection="column"
      .padding=${["0","4","4","4"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${g.Zv.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:4*!this.profileName,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${e||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["4","0","0","0"]}
        alignItems="center"
        gap="4"
      >
        <wui-qr-code
          size=${232}
          theme=${p.W.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${(0,s.J)(p.W.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="lg-regular" color="primary" align="center">
          Copy your address or scan this QR code
        </wui-text>
        <wui-button @click=${this.onCopyClick.bind(this)} size="sm" variant="neutral-secondary">
          <wui-icon slot="iconLeft" size="sm" color="inherit" name="copy"></wui-icon>
          <wui-text variant="md-regular" color="inherit">Copy address</wui-text>
        </wui-button>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=n.W.getAllRequestedCaipNetworks(),t=n.W.checkIfSmartAccountEnabled(),i=n.W.state.activeCaipNetwork,o=e.filter(e=>e?.chainNamespace===i?.chainNamespace);if((0,d.lj)(i?.chainNamespace)===v.Vl.ACCOUNT_TYPES.SMART_ACCOUNT&&t)return i?(0,r.qy)`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[c.$.getNetworkImage(i)??""]}
      ></wui-compatible-network>`:null;let s=(o?.filter(e=>e?.assets?.imageId)?.slice(0,5)).map(c.$.getNetworkImage).filter(Boolean);return(0,r.qy)`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${s}
    ></wui-compatible-network>`}onReceiveClick(){h.I.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(u.w.copyToClopboard(this.address),l.P.showSuccess("Address copied"))}catch{l.P.showError("Failed to copy")}}};C.styles=x,$([(0,o.wk)()],C.prototype,"address",void 0),$([(0,o.wk)()],C.prototype,"profileName",void 0),$([(0,o.wk)()],C.prototype,"network",void 0),C=$([(0,g.EM)("w3m-wallet-receive-view")],C)},38534:(e,t,i)=>{var r=i(83138),o=i(98410),s=i(71084),a=i(8821),n=i(47327);let l=(0,r.AH)`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
    box-sizing: border-box;
  }
`;var c=function(e,t,i,r){var o,s=arguments.length,a=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let p=class extends r.WF{render(){return this.style.cssText=`
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
      padding-top: ${this.padding&&a.Z.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&a.Z.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&a.Z.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&a.Z.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&a.Z.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&a.Z.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&a.Z.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&a.Z.getSpacingStyles(this.margin,3)};
      width: ${this.width};
    `,(0,r.qy)`<slot></slot>`}};p.styles=[s.W5,l],c([(0,o.MZ)()],p.prototype,"flexDirection",void 0),c([(0,o.MZ)()],p.prototype,"flexWrap",void 0),c([(0,o.MZ)()],p.prototype,"flexBasis",void 0),c([(0,o.MZ)()],p.prototype,"flexGrow",void 0),c([(0,o.MZ)()],p.prototype,"flexShrink",void 0),c([(0,o.MZ)()],p.prototype,"alignItems",void 0),c([(0,o.MZ)()],p.prototype,"justifyContent",void 0),c([(0,o.MZ)()],p.prototype,"columnGap",void 0),c([(0,o.MZ)()],p.prototype,"rowGap",void 0),c([(0,o.MZ)()],p.prototype,"gap",void 0),c([(0,o.MZ)()],p.prototype,"padding",void 0),c([(0,o.MZ)()],p.prototype,"margin",void 0),c([(0,o.MZ)()],p.prototype,"width",void 0),p=c([(0,n.E)("wui-flex")],p)},40575:(e,t,i)=>{i(38534)},41163:(e,t,i)=>{i(24772)}}]);