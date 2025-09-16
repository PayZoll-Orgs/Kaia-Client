"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9858],{16226:(t,e,i)=>{i.r(e),i.d(e,{W3mDataCaptureOtpConfirmView:()=>x,W3mDataCaptureView:()=>k,W3mEmailSuffixesWidget:()=>c,W3mRecentEmailsWidget:()=>h});var a=i(83138),r=i(98410),s=i(36211);let o=(0,a.AH)`
  .email-sufixes {
    display: flex;
    flex-direction: row;
    gap: var(--wui-spacing-3xs);
    overflow-x: auto;
    max-width: 100%;
    margin-top: var(--wui-spacing-s);
    margin-bottom: calc(-1 * var(--wui-spacing-m));
    padding-bottom: var(--wui-spacing-m);
    margin-left: calc(-1 * var(--wui-spacing-m));
    margin-right: calc(-1 * var(--wui-spacing-m));
    padding-left: var(--wui-spacing-m);
    padding-right: var(--wui-spacing-m);

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;var n=function(t,e,i,a){var r,s=arguments.length,o=s<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,a);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(s<3?r(o):s>3?r(e,i,o):r(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let l=["@gmail.com","@outlook.com","@yahoo.com","@hotmail.com","@aol.com","@icloud.com","@zoho.com"],c=class extends a.WF{constructor(){super(...arguments),this.email=""}render(){let t=l.filter(this.filter.bind(this)).map(this.item.bind(this));return 0===t.length?null:(0,a.qy)`<div class="email-sufixes">${t}</div>`}filter(t){if(!this.email)return!1;let e=this.email.split("@");if(e.length<2)return!0;let i=e.pop();return t.includes(i)&&t!==`@${i}`}item(t){let e=()=>{let e=this.email.split("@");e.length>1&&e.pop();let i=e[0]+t;this.dispatchEvent(new CustomEvent("change",{detail:i,bubbles:!0,composed:!0}))};return(0,a.qy)`<wui-button variant="neutral" size="sm" @click=${e}
      >${t}</wui-button
    >`}};c.styles=[o],n([(0,r.MZ)()],c.prototype,"email",void 0),c=n([(0,s.EM)("w3m-email-suffixes-widget")],c);let d=(0,a.AH)`
  .recent-emails {
    display: flex;
    flex-direction: column;
    padding: var(--wui-spacing-s) 0;
    border-top: 1px solid var(--wui-color-gray-glass-005);
    border-bottom: 1px solid var(--wui-color-gray-glass-005);
  }

  .recent-emails-heading {
    margin-bottom: var(--wui-spacing-s);
  }

  .recent-emails-list-item {
    --wui-color-gray-glass-002: transparent;
  }
`;var u=function(t,e,i,a){var r,s=arguments.length,o=s<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,a);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(s<3?r(o):s>3?r(e,i,o):r(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let h=class extends a.WF{constructor(){super(...arguments),this.emails=[]}render(){return 0===this.emails.length?null:(0,a.qy)`<div class="recent-emails">
      <wui-text variant="micro-600" color="fg-200" class="recent-emails-heading"
        >Recently used emails</wui-text
      >
      ${this.emails.map(this.item.bind(this))}
    </div>`}item(t){let e=()=>{this.dispatchEvent(new CustomEvent("select",{detail:t,bubbles:!0,composed:!0}))};return(0,a.qy)`<wui-list-item
      @click=${e}
      ?chevron=${!0}
      icon="mail"
      iconVariant="overlay"
      class="recent-emails-list-item"
    >
      <wui-text variant="paragraph-500" color="fg-100">${t}</wui-text>
    </wui-list-item>`}};h.styles=[d],u([(0,r.MZ)()],h.prototype,"emails",void 0),h=u([(0,s.EM)("w3m-recent-emails-widget")],h);var p=i(55480),g=i(67869),m=i(93481),f=i(65374),w=i(38663),y=i(74883),v=function(t,e,i,a){var r,s=arguments.length,o=s<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,a);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(s<3?r(o):s>3?r(e,i,o):r(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let x=class extends y.H{constructor(){super(...arguments),this.siwx=p.H.state.siwx,this.onOtpSubmit=async t=>{await this.siwx.confirmEmailOtp({code:t}),g.I.replace("SIWXSignMessage")},this.onOtpResend=async t=>{let e=m.W.getAccountData();if(!e?.caipAddress)throw Error("No account data found");await this.siwx.requestEmailOtp({email:t,account:e.caipAddress})}}connectedCallback(){this.siwx&&this.siwx instanceof w.u||f.P.showError("ReownAuthentication is not initialized."),super.connectedCallback()}shouldSubmitOnOtpChange(){return this.otp.length===y.H.OTP_LENGTH}};v([(0,r.wk)()],x.prototype,"siwx",void 0),x=v([(0,s.EM)("w3m-data-capture-otp-confirm-view")],x);var b=i(93965);let S=(0,a.AH)`
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-3xs);

    transition-property: margin, height;
    transition-duration: var(--wui-duration-md);
    transition-timing-function: var(--wui-ease-out-power-1);
    margin-top: -100px;

    &[data-state='loading'] {
      margin-top: 0px;
    }

    position: relative;
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      height: 252px;
      width: 360px;
      background: radial-gradient(
        96.11% 53.95% at 50% 51.28%,
        transparent 0%,
        color-mix(in srgb, var(--wui-color-bg-100) 5%, transparent) 49%,
        color-mix(in srgb, var(--wui-color-bg-100) 65%, transparent) 99.43%
      );
    }
  }

  .hero-main-icon {
    width: 176px;
    transition-property: background-color;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-1);

    &[data-state='loading'] {
      width: 56px;
    }
  }

  .hero-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-3xs);
    flex-wrap: nowrap;
    min-width: fit-content;

    &:nth-child(1) {
      transform: translateX(-30px);
    }

    &:nth-child(2) {
      transform: translateX(30px);
    }

    &:nth-child(4) {
      transform: translateX(40px);
    }

    transition-property: height;
    transition-duration: var(--wui-duration-md);
    transition-timing-function: var(--wui-ease-out-power-1);
    height: 68px;

    &[data-state='loading'] {
      height: 0px;
    }
  }

  .hero-row-icon {
    opacity: 0.1;
    transition-property: opacity;
    transition-duration: var(--wui-duration-md);
    transition-timing-function: var(--wui-ease-out-power-1);

    &[data-state='loading'] {
      opacity: 0;
    }
  }
`;var $=function(t,e,i,a){var r,s=arguments.length,o=s<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,a);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(s<3?r(o):s>3?r(e,i,o):r(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let k=class extends a.WF{constructor(){super(...arguments),this.email=g.I.state.data?.email??m.W.getAccountData()?.user?.email??"",this.address=m.W.getAccountData()?.address??"",this.loading=!1,this.appName=p.H.state.metadata?.name??"AppKit",this.siwx=p.H.state.siwx,this.isRequired=Array.isArray(p.H.state.remoteFeatures?.emailCapture)&&p.H.state.remoteFeatures?.emailCapture.includes("required"),this.recentEmails=this.getRecentEmails()}connectedCallback(){this.siwx&&this.siwx instanceof w.u||f.P.showError("ReownAuthentication is not initialized. Please contact support."),super.connectedCallback()}firstUpdated(){this.loading=!1,this.recentEmails=this.getRecentEmails(),this.email&&this.onSubmit()}render(){return(0,a.qy)`
      <wui-flex flexDirection="column" .padding=${["3xs","m","m","m"]} gap="l">
        ${this.hero()} ${this.paragraph()} ${this.emailInput()} ${this.recentEmailsWidget()}
        ${this.footerActions()}
      </wui-flex>
    `}hero(){return(0,a.qy)`
      <div class="hero" data-state=${this.loading?"loading":"default"}>
        ${this.heroRow(["id","mail","wallet","x","solana","qrCode"])}
        ${this.heroRow(["mail","farcaster","wallet","discord","mobile","qrCode"])}
        <div class="hero-row">
          ${this.heroIcon("github")} ${this.heroIcon("bank")}
          <wui-icon-box
            size="xl"
            iconSize="xxl"
            iconColor=${this.loading?"fg-100":"accent-100"}
            backgroundColor=${this.loading?"fg-100":"accent-100"}
            icon=${this.loading?"id":"user"}
            isOpaque
            class="hero-main-icon"
            data-state=${this.loading?"loading":"default"}
          >
          </wui-icon-box>
          ${this.heroIcon("id")} ${this.heroIcon("card")}
        </div>
        ${this.heroRow(["google","id","github","verify","apple","mobile"])}
      </div>
    `}heroRow(t){return(0,a.qy)`
      <div class="hero-row" data-state=${this.loading?"loading":"default"}>
        ${t.map(this.heroIcon.bind(this))}
      </div>
    `}heroIcon(t){return(0,a.qy)`
      <wui-icon-box
        size="xl"
        iconSize="xxl"
        iconColor="fg-100"
        backgroundColor="fg-100"
        icon=${t}
        data-state=${this.loading?"loading":"default"}
        isOpaque
        class="hero-row-icon"
      >
      </wui-icon-box>
    `}paragraph(){return this.loading?(0,a.qy)`
        <wui-text variant="paragraph-400" color="fg-200" align="center"
          >We are verifying your account with email
          <wui-text variant="paragraph-600" color="accent-100">${this.email}</wui-text> and address
          <wui-text variant="paragraph-600" color="fg-100">
            ${s.Zv.getTruncateString({string:this.address,charsEnd:4,charsStart:4,truncate:"middle"})} </wui-text
          >, please wait a moment.</wui-text
        >
      `:this.isRequired?(0,a.qy)`
        <wui-text variant="paragraph-600" color="fg-100" align="center">
          ${this.appName} requires your email for authentication.
        </wui-text>
      `:(0,a.qy)`
      <wui-flex flexDirection="column" gap="xs" alignItems="center">
        <wui-text variant="paragraph-600" color="fg-100" align="center" size>
          ${this.appName} would like to collect your email.
        </wui-text>

        <wui-text variant="small-400" color="fg-200" align="center">
          Don't worry, it's optional&mdash;you can skip this step.
        </wui-text>
      </wui-flex>
    `}emailInput(){if(this.loading)return null;let t=t=>{"Enter"===t.key&&this.onSubmit()},e=t=>{this.email=t.detail};return(0,a.qy)`
      <wui-flex flexDirection="column">
        <wui-email-input
          .value=${this.email}
          .disabled=${this.loading}
          @inputChange=${e}
          @keydown=${t}
        ></wui-email-input>

        <w3m-email-suffixes-widget
          .email=${this.email}
          @change=${e}
        ></w3m-email-suffixes-widget>
      </wui-flex>
    `}recentEmailsWidget(){if(0===this.recentEmails.length||this.loading)return null;let t=t=>{this.email=t.detail,this.onSubmit()};return(0,a.qy)`
      <w3m-recent-emails-widget
        .emails=${this.recentEmails}
        @select=${t}
      ></w3m-recent-emails-widget>
    `}footerActions(){return(0,a.qy)`
      <wui-flex flexDirection="row" fullWidth gap="s">
        ${this.isRequired?null:(0,a.qy)`<wui-button
              size="lg"
              variant="neutral"
              fullWidth
              .disabled=${this.loading}
              @click=${this.onSkip.bind(this)}
              >Skip this step</wui-button
            >`}

        <wui-button
          size="lg"
          variant="main"
          type="submit"
          fullWidth
          .disabled=${!this.email||!this.isValidEmail(this.email)}
          .loading=${this.loading}
          @click=${this.onSubmit.bind(this)}
        >
          Continue
        </wui-button>
      </wui-flex>
    `}async onSubmit(){if(!(this.siwx instanceof w.u))return void f.P.showError("ReownAuthentication is not initialized. Please contact support.");let t=m.W.getActiveCaipAddress();if(!t)throw Error("Account is not connected.");if(!this.isValidEmail(this.email))return void f.P.showError("Please provide a valid email.");try{this.loading=!0;let e=await this.siwx.requestEmailOtp({email:this.email,account:t});this.pushRecentEmail(this.email),null===e.uuid?g.I.replace("SIWXSignMessage"):g.I.replace("DataCaptureOtpConfirm",{email:this.email})}catch(t){f.P.showError("Failed to send email OTP"),this.loading=!1}}onSkip(){g.I.replace("SIWXSignMessage")}getRecentEmails(){let t=b.Ud.getItem(b.Ws.RECENT_EMAILS);return(t?t.split(","):[]).filter(this.isValidEmail.bind(this)).slice(0,3)}pushRecentEmail(t){let e=Array.from(new Set([t,...this.getRecentEmails()])).slice(0,3);b.Ud.setItem(b.Ws.RECENT_EMAILS,e.join(","))}isValidEmail(t){return/^\S+@\S+\.\S+$/u.test(t)}};k.styles=[S],$([(0,r.wk)()],k.prototype,"email",void 0),$([(0,r.wk)()],k.prototype,"address",void 0),$([(0,r.wk)()],k.prototype,"loading",void 0),$([(0,r.wk)()],k.prototype,"appName",void 0),$([(0,r.wk)()],k.prototype,"siwx",void 0),$([(0,r.wk)()],k.prototype,"isRequired",void 0),$([(0,r.wk)()],k.prototype,"recentEmails",void 0),k=$([(0,s.EM)("w3m-data-capture-view")],k)},38534:(t,e,i)=>{var a=i(83138),r=i(98410),s=i(71084),o=i(8821),n=i(47327);let l=(0,a.AH)`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
    box-sizing: border-box;
  }
`;var c=function(t,e,i,a){var r,s=arguments.length,o=s<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,a);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(s<3?r(o):s>3?r(e,i,o):r(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let d=class extends a.WF{render(){return this.style.cssText=`
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
      padding-top: ${this.padding&&o.Z.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&o.Z.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&o.Z.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&o.Z.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&o.Z.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&o.Z.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&o.Z.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&o.Z.getSpacingStyles(this.margin,3)};
      width: ${this.width};
    `,(0,a.qy)`<slot></slot>`}};d.styles=[s.W5,l],c([(0,r.MZ)()],d.prototype,"flexDirection",void 0),c([(0,r.MZ)()],d.prototype,"flexWrap",void 0),c([(0,r.MZ)()],d.prototype,"flexBasis",void 0),c([(0,r.MZ)()],d.prototype,"flexGrow",void 0),c([(0,r.MZ)()],d.prototype,"flexShrink",void 0),c([(0,r.MZ)()],d.prototype,"alignItems",void 0),c([(0,r.MZ)()],d.prototype,"justifyContent",void 0),c([(0,r.MZ)()],d.prototype,"columnGap",void 0),c([(0,r.MZ)()],d.prototype,"rowGap",void 0),c([(0,r.MZ)()],d.prototype,"gap",void 0),c([(0,r.MZ)()],d.prototype,"padding",void 0),c([(0,r.MZ)()],d.prototype,"margin",void 0),c([(0,r.MZ)()],d.prototype,"width",void 0),d=c([(0,n.E)("wui-flex")],d)},38663:(t,e,i)=>{i.d(e,{u:()=>h});var a=i(93965),r=i(45553),s=i(58051),o=i(72880),n=i(44826),l=i(93481),c=i(71305),d=i(76190);class u{constructor(t){this.getNonce=t.getNonce}async createMessage(t){let e={accountAddress:t.accountAddress,chainId:t.chainId,version:"1",domain:"undefined"==typeof document?"Unknown Domain":document.location.host,uri:"undefined"==typeof document?"Unknown URI":document.location.href,resources:this.resources,nonce:await this.getNonce(t),issuedAt:this.stringifyDate(new Date),statement:void 0,expirationTime:void 0,notBefore:void 0};return Object.assign(e,{toString:()=>this.stringify(e)})}stringify(t){let e=this.getNetworkName(t.chainId);return[`${t.domain} wants you to sign in with your ${e} account:`,t.accountAddress,t.statement?`
${t.statement}
`:"",`URI: ${t.uri}`,`Version: ${t.version}`,`Chain ID: ${t.chainId}`,`Nonce: ${t.nonce}`,t.issuedAt&&`Issued At: ${t.issuedAt}`,t.expirationTime&&`Expiration Time: ${t.expirationTime}`,t.notBefore&&`Not Before: ${t.notBefore}`,t.requestId&&`Request ID: ${t.requestId}`,t.resources?.length&&t.resources.reduce((t,e)=>`${t}
- ${e}`,"Resources:")].filter(t=>"string"==typeof t).join("\n").trim()}getNetworkName(t){let e=l.W.getAllRequestedCaipNetworks();return d.L.getNetworkNameByCaipNetworkId(e,t)}stringifyDate(t){return t.toISOString()}}class h{constructor(t={}){this.otpUuid=null,this.listeners={sessionChanged:[]},this.localAuthStorageKey=t.localAuthStorageKey||a.Ws.SIWX_AUTH_TOKEN,this.localNonceStorageKey=t.localNonceStorageKey||a.Ws.SIWX_NONCE_TOKEN,this.required=t.required??!0,this.messenger=new u({getNonce:this.getNonce.bind(this)})}async createMessage(t){return this.messenger.createMessage(t)}async addSession(t){let e=await this.request({method:"POST",key:"authenticate",body:{data:t.data,message:t.message,signature:t.signature,clientId:this.getClientId(),walletInfo:this.getWalletInfo()},headers:["nonce","otp"]});this.setStorageToken(e.token,this.localAuthStorageKey),this.emit("sessionChanged",t),this.setAppKitAccountUser(function(t){let e=t.split(".");if(3!==e.length)throw Error("Invalid token");let i=e[1];if("string"!=typeof i)throw Error("Invalid token");let a=i.replace(/-/gu,"+").replace(/_/gu,"/");return JSON.parse(atob(a.padEnd(a.length+(4-a.length%4)%4,"=")))}(e.token)),this.otpUuid=null}async getSessions(t,e){try{if(!this.getStorageToken(this.localAuthStorageKey))return[];let i=await this.request({method:"GET",key:"me",query:{},headers:["auth"]});if(!i)return[];let a=i.address.toLowerCase()===e.toLowerCase(),r=i.caip2Network===t;if(!a||!r)return[];let s={data:{accountAddress:i.address,chainId:i.caip2Network},message:"",signature:""};return this.emit("sessionChanged",s),this.setAppKitAccountUser(i),[s]}catch{return[]}}async revokeSession(t,e){return Promise.resolve(this.clearStorageTokens())}async setSessions(t){if(0===t.length)this.clearStorageTokens();else{let e=t.find(t=>t.data.chainId===(0,c.kg)()?.caipNetworkId)||t[0];await this.addSession(e)}}getRequired(){return this.required}async getSessionAccount(){if(!this.getStorageToken(this.localAuthStorageKey))throw Error("Not authenticated");return this.request({method:"GET",key:"me",body:void 0,query:{includeAppKitAccount:!0},headers:["auth"]})}async setSessionAccountMetadata(t=null){if(!this.getStorageToken(this.localAuthStorageKey))throw Error("Not authenticated");return this.request({method:"PUT",key:"account-metadata",body:{metadata:t},headers:["auth"]})}on(t,e){return this.listeners[t].push(e),()=>{this.listeners[t]=this.listeners[t].filter(t=>t!==e)}}removeAllListeners(){Object.keys(this.listeners).forEach(t=>{this.listeners[t]=[]})}async requestEmailOtp({email:t,account:e}){let i=await this.request({method:"POST",key:"otp",body:{email:t,account:e}});return this.otpUuid=i.uuid,this.messenger.resources=[`email:${t}`],i}confirmEmailOtp({code:t}){return this.request({method:"PUT",key:"otp",body:{code:t},headers:["otp"]})}async request({method:t,key:e,query:i,body:a,headers:s}){let{projectId:o,st:n,sv:l}=this.getSDKProperties(),c=new URL(`${r.o.W3M_API_URL}/auth/v1/${String(e)}`);c.searchParams.set("projectId",o),c.searchParams.set("st",n),c.searchParams.set("sv",l),i&&Object.entries(i).forEach(([t,e])=>c.searchParams.set(t,String(e)));let d=await fetch(c,{method:t,body:a?JSON.stringify(a):void 0,headers:Array.isArray(s)?s.reduce((t,e)=>{switch(e){case"nonce":t["x-nonce-jwt"]=`Bearer ${this.getStorageToken(this.localNonceStorageKey)}`;break;case"auth":t.Authorization=`Bearer ${this.getStorageToken(this.localAuthStorageKey)}`;break;case"otp":this.otpUuid&&(t["x-otp"]=this.otpUuid)}return t},{}):void 0});if(!d.ok)throw Error(await d.text());return d.headers.get("content-type")?.includes("application/json")?d.json():null}getStorageToken(t){return a.Ud.getItem(t)}setStorageToken(t,e){a.Ud.setItem(e,t)}clearStorageTokens(){this.otpUuid=null,a.Ud.removeItem(this.localAuthStorageKey),a.Ud.removeItem(this.localNonceStorageKey),this.emit("sessionChanged",void 0)}async getNonce(){let{nonce:t,token:e}=await this.request({method:"GET",key:"nonce"});return this.setStorageToken(e,this.localNonceStorageKey),t}getClientId(){return n.T.state.clientId}getWalletInfo(){let{connectedWalletInfo:t}=s.U.state;if(!t)return;if("social"in t)return{type:"social",social:t.social,identifier:t.identifier};let{name:e,icon:i}=t,a="unknown";switch(t.type){case"EXTERNAL":case"INJECTED":case"ANNOUNCED":a="extension";break;case"WALLET_CONNECT":a="walletconnect";break;default:a="unknown"}return{type:a,name:e,icon:i}}getSDKProperties(){return o.N._getSdkProperties()}emit(t,e){this.listeners[t].forEach(t=>t(e))}setAppKitAccountUser(t){let{email:e}=t;e&&Object.values(r.o.CHAIN).forEach(t=>{l.W.setAccountProp("user",{email:e},t)})}}},40575:(t,e,i)=>{i(38534)},41163:(t,e,i)=>{i(24772)}}]);