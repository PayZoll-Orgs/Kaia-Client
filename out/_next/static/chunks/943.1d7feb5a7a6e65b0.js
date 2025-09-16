"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[943],{20943:(t,e,i)=>{var r,a=i(83138),s=i(98410),o=i(12232),n=i(93481),c=i(24369),l=i(12319),u=i(67869),p=i(55480),d=i(70417),h=i(71305),m=i(36211);i(40575),i(90721),i(48352),i(41163);var g=i(78964);i(24772);var w=i(71084);!function(t){t.approve="approved",t.bought="bought",t.borrow="borrowed",t.burn="burnt",t.cancel="canceled",t.claim="claimed",t.deploy="deployed",t.deposit="deposited",t.execute="executed",t.mint="minted",t.receive="received",t.repay="repaid",t.send="sent",t.sell="sold",t.stake="staked",t.trade="swapped",t.unstake="unstaked",t.withdraw="withdrawn"}(r||(r={}));var y=i(47327);i(45166),i(84042);var f=i(20296);let x=(0,f.AH)`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.core.glass010};
    background-color: ${({tokens:t})=>t.core.glass010};
  }

  :host([data-no-images='true']) > wui-flex {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[3]} !important;
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }

  wui-flex.status-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
    border-radius: ${({borderRadius:t})=>t[4]};
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    box-shadow: 0 0 0 2px ${({tokens:t})=>t.theme.backgroundPrimary};
    overflow: hidden;
    width: 16px;
    height: 16px;
  }
`;var b=function(t,e,i,r){var a,s=arguments.length,o=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let v=class extends a.WF{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){let[t,e]=this.images;this.images.length||(this.dataset.noImages="true");let i=t?.type==="NFT",r=e?.url?"NFT"===e.type:i;return this.style.cssText=`
    --local-left-border-radius: ${i?"var(--apkt-borderRadius-3)":"var(--apkt-borderRadius-5)"};
    --local-right-border-radius: ${r?"var(--apkt-borderRadius-3)":"var(--apkt-borderRadius-5)"};
    `,(0,a.qy)`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){let[t,e]=this.images,i=t?.type;return 2===this.images.length&&(t?.url||e?.url)?(0,a.qy)`<div class="swap-images-container">
        ${t?.url?(0,a.qy)`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${e?.url?(0,a.qy)`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:null}
      </div>`:t?.url?(0,a.qy)`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:"NFT"===i?(0,a.qy)`<wui-icon size="inherit" color="default" name="nftPlaceholder"></wui-icon>`:(0,a.qy)`<wui-icon size="inherit" color="default" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t,e="accent-primary";return(t=this.getIcon(),this.status&&(e=this.getStatusColor()),t)?(0,a.qy)`
      <wui-flex alignItems="center" justifyContent="center" class="status-box">
        <wui-icon-box size="sm" color=${e} icon=${t}></wui-icon-box>
      </wui-flex>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():"trade"===this.type?"swapHorizontal":"approve"===this.type?"checkmark":"cancel"===this.type?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success";case"failed":return"error";case"pending":return"inverse";default:return"accent-primary"}}};v.styles=[x],b([(0,s.MZ)()],v.prototype,"type",void 0),b([(0,s.MZ)()],v.prototype,"status",void 0),b([(0,s.MZ)()],v.prototype,"direction",void 0),b([(0,s.MZ)({type:Boolean})],v.prototype,"onlyDirectionIcon",void 0),b([(0,s.MZ)({type:Array})],v.prototype,"images",void 0),b([(0,s.MZ)({type:Object})],v.prototype,"secondImage",void 0),v=b([(0,y.E)("wui-transaction-visual")],v);let $=(0,f.AH)`
  :host {
    width: 100%;
  }

  :host > wui-flex:first-child {
    align-items: center;
    column-gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]};
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var k=function(t,e,i,r){var a,s=arguments.length,o=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let T=class extends a.WF{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[]}render(){return(0,a.qy)`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${(0,g.J)(this.direction)}
          type=${this.type}
          .onlyDirectionIcon=${this.onlyDirectionIcon}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="lg-medium" color="primary">
            ${r[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="sm-medium" color="secondary"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){let t=this.descriptions?.[0];return t?(0,a.qy)`
          <wui-text variant="md-regular" color="secondary">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){let t=this.descriptions?.[1];return t?(0,a.qy)`
          <wui-icon class="description-separator-icon" size="sm" name="arrowRight"></wui-icon>
          <wui-text variant="md-regular" color="secondary">
            <span>${t}</span>
          </wui-text>
        `:null}};T.styles=[w.W5,$],k([(0,s.MZ)()],T.prototype,"type",void 0),k([(0,s.MZ)({type:Array})],T.prototype,"descriptions",void 0),k([(0,s.MZ)()],T.prototype,"date",void 0),k([(0,s.MZ)({type:Boolean})],T.prototype,"onlyDirectionIcon",void 0),k([(0,s.MZ)()],T.prototype,"status",void 0),k([(0,s.MZ)()],T.prototype,"direction",void 0),k([(0,s.MZ)({type:Array})],T.prototype,"images",void 0),T=k([(0,y.E)("wui-transaction-list-item")],T),i(40396),i(38534),i(99691);let I=(0,f.AH)`
  wui-flex {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  wui-image {
    border-radius: ${({borderRadius:t})=>t[128]};
  }

  .fallback-icon {
    color: ${({tokens:t})=>t.theme.iconInverse};
    border-radius: ${({borderRadius:t})=>t[3]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .direction-icon,
  .status-image {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: ${({borderRadius:t})=>t[128]};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  .direction-icon {
    padding: ${({spacing:t})=>t["01"]};
    color: ${({tokens:t})=>t.core.iconSuccess};

    background-color: color-mix(
      in srgb,
      ${({tokens:t})=>t.core.textSuccess} 30%,
      ${({tokens:t})=>t.theme.backgroundPrimary} 70%
    );
  }

  /* -- Sizes --------------------------------------------------- */
  :host([data-size='sm']) > wui-image:not(.status-image),
  :host([data-size='sm']) > wui-flex {
    width: 24px;
    height: 24px;
  }

  :host([data-size='lg']) > wui-image:not(.status-image),
  :host([data-size='lg']) > wui-flex {
    width: 40px;
    height: 40px;
  }

  :host([data-size='sm']) .fallback-icon {
    height: 16px;
    width: 16px;
    padding: ${({spacing:t})=>t[1]};
  }

  :host([data-size='lg']) .fallback-icon {
    height: 32px;
    width: 32px;
    padding: ${({spacing:t})=>t[1]};
  }

  :host([data-size='sm']) .direction-icon,
  :host([data-size='sm']) .status-image {
    transform: translate(40%, 30%);
  }

  :host([data-size='lg']) .direction-icon,
  :host([data-size='lg']) .status-image {
    transform: translate(40%, 10%);
  }

  :host([data-size='sm']) .status-image {
    height: 14px;
    width: 14px;
  }

  :host([data-size='lg']) .status-image {
    height: 20px;
    width: 20px;
  }

  /* -- Crop effects --------------------------------------------------- */
  .swap-crop-left-image,
  .swap-crop-right-image {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .swap-crop-left-image {
    left: 0;
    clip-path: inset(0px calc(50% + 1.5px) 0px 0%);
  }

  .swap-crop-right-image {
    right: 0;
    clip-path: inset(0px 0px 0px calc(50% + 1.5px));
  }
`;var A=function(t,e,i,r){var a,s=arguments.length,o=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let q={sm:"xxs",lg:"md"},O=class extends a.WF{constructor(){super(...arguments),this.type="approve",this.size="lg",this.statusImageUrl="",this.images=[]}render(){return(0,a.qy)`<wui-flex>${this.templateVisual()} ${this.templateIcon()}</wui-flex>`}templateVisual(){switch(this.dataset.size=this.size,this.type){case"trade":return this.swapTemplate();case"fiat":return this.fiatTemplate();case"unknown":return this.unknownTemplate();default:return this.tokenTemplate()}}swapTemplate(){let[t,e]=this.images;return 2===this.images.length&&(t||e)?(0,a.qy)`
        <wui-image class="swap-crop-left-image" src=${t} alt="Swap image"></wui-image>
        <wui-image class="swap-crop-right-image" src=${e} alt="Swap image"></wui-image>
      `:t?(0,a.qy)`<wui-image src=${t} alt="Swap image"></wui-image>`:null}fiatTemplate(){return(0,a.qy)`<wui-icon
      class="fallback-icon"
      size=${q[this.size]}
      name="dollar"
    ></wui-icon>`}unknownTemplate(){return(0,a.qy)`<wui-icon
      class="fallback-icon"
      size=${q[this.size]}
      name="questionMark"
    ></wui-icon>`}tokenTemplate(){let[t]=this.images;return t?(0,a.qy)`<wui-image src=${t} alt="Token image"></wui-image> `:(0,a.qy)`<wui-icon
      class="fallback-icon"
      name=${"nft"===this.type?"image":"coinPlaceholder"}
    ></wui-icon>`}templateIcon(){return this.statusImageUrl?(0,a.qy)`<wui-image
        class="status-image"
        src=${this.statusImageUrl}
        alt="Status image"
      ></wui-image>`:(0,a.qy)`<wui-icon
      class="direction-icon"
      size=${q[this.size]}
      name=${this.getTemplateIcon()}
    ></wui-icon>`}getTemplateIcon(){return"trade"===this.type?"arrowClockWise":"arrowBottom"}};O.styles=[I],A([(0,s.MZ)()],O.prototype,"type",void 0),A([(0,s.MZ)()],O.prototype,"size",void 0),A([(0,s.MZ)()],O.prototype,"statusImageUrl",void 0),A([(0,s.MZ)({type:Array})],O.prototype,"images",void 0),O=A([(0,y.E)("wui-transaction-thumbnail")],O);let D=(0,f.AH)`
  :host > wui-flex:first-child {
    gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[3]};
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`,z=class extends a.WF{render(){return(0,a.qy)`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px" rounded></wui-shimmer>
        <wui-flex flexDirection="column" gap="1">
          <wui-shimmer width="124px" height="16px" rounded></wui-shimmer>
          <wui-shimmer width="60px" height="14px" rounded></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" rounded></wui-shimmer>
      </wui-flex>
    `}};z.styles=[w.W5,D],z=function(t,e,i,r){var a,s=arguments.length,o=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o}([(0,y.E)("wui-transaction-list-item-loader")],z);var P=i(73537);let R=(0,m.AH)`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: ${({spacing:t})=>t["3"]};
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:t})=>t["3"]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;var C=function(t,e,i,r){var a,s=arguments.length,o=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let j="last-transaction",M=class extends a.WF{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=n.W.state.activeCaipAddress,this.transactionsByYear=c.W.state.transactionsByYear,this.loading=c.W.state.loading,this.empty=c.W.state.empty,this.next=c.W.state.next,c.W.clearCursor(),this.unsubscribe.push(n.W.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(c.W.resetTransactions(),c.W.fetchTransactions(t)),this.caipAddress=t}),n.W.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),c.W.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return(0,a.qy)` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){c.W.resetTransactions(),this.caipAddress&&c.W.fetchTransactions(l.w.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(t=>{let e=parseInt(t,10),i=Array(12).fill(null).map((t,i)=>({groupTitle:m.tt.getTransactionGroupTitle(e,i),transactions:this.transactionsByYear[e]?.[i]})).filter(({transactions:t})=>t).reverse();return i.map(({groupTitle:t,transactions:e},r)=>{let s=r===i.length-1;return e?(0,a.qy)`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${s?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["2","3","3","3"]}
            >
              <wui-text variant="md-medium" color="secondary" data-testid="group-title">
                ${t}
              </wui-text>
            </wui-flex>
            <wui-flex flexDirection="column" gap="2">
              ${this.templateTransactions(e,s)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,e){let{date:i,descriptions:r,direction:s,isAllNFT:o,images:n,status:c,transfers:l,type:u}=this.getTransactionListItemProps(t),p=l?.length>1;return l?.length!==2||o?p?l.map((t,r)=>{let s=m.tt.getTransferDescription(t),o=e&&r===l.length-1;return(0,a.qy)` <wui-transaction-list-item
          date=${i}
          direction=${t.direction}
          id=${o&&this.next?j:""}
          status=${c}
          type=${u}
          .onlyDirectionIcon=${!0}
          .images=${[n[r]]}
          .descriptions=${[s]}
        ></wui-transaction-list-item>`}):(0,a.qy)`
      <wui-transaction-list-item
        date=${i}
        .direction=${s}
        id=${e&&this.next?j:""}
        status=${c}
        type=${u}
        .images=${n}
        .descriptions=${r}
      ></wui-transaction-list-item>
    `:(0,a.qy)`
        <wui-transaction-list-item
          date=${i}
          .direction=${s}
          id=${e&&this.next?j:""}
          status=${c}
          type=${u}
          .images=${n}
          .descriptions=${r}
        ></wui-transaction-list-item>
      `}templateTransactions(t,e){return t.map((i,r)=>{let s=e&&r===t.length-1;return(0,a.qy)`${this.templateRenderTransaction(i,s)}`})}emptyStateActivity(){return(0,a.qy)`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["10","5","10","5"]}
      gap="5"
      data-testid="empty-activity-state"
    >
      <wui-icon-box color="default" icon="wallet" size="xl"></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="lg-medium" color="primary">No Transactions yet</wui-text>
        <wui-text align="center" variant="lg-regular" color="secondary"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return(0,a.qy)`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="4"
      data-testid="empty-account-state"
    >
      <wui-icon-box icon="swapHorizontal" size="lg" color="default"></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="2"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="md-regular" align="center" color="primary">No activity yet</wui-text>
        <wui-text variant="sm-regular" align="center" color="secondary"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return"account"===this.page?(0,a.qy)`${this.emptyStateAccount()}`:(0,a.qy)`${this.emptyStateActivity()}`}templateLoading(){return"activity"===this.page?Array(7).fill((0,a.qy)` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t):null}onReceiveClick(){u.I.push("WalletReceive")}createPaginationObserver(){let{projectId:t}=p.H.state;this.paginationObserver=new IntersectionObserver(([e])=>{e?.isIntersecting&&!this.loading&&(c.W.fetchTransactions(l.w.getPlainAddress(this.caipAddress)),d.E.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:l.w.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:(0,h.lj)(n.W.state.activeChain)===P.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();let t=this.shadowRoot?.querySelector(`#${j}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){let e=o.r.formatDate(t?.metadata?.minedAt),i=m.tt.getTransactionDescriptions(t),r=t?.transfers,a=t?.transfers?.[0],s=!!a&&t?.transfers?.every(t=>!!t.nft_info),n=m.tt.getTransactionImages(r);return{date:e,direction:a?.direction,descriptions:i,isAllNFT:s,images:n,status:t.metadata?.status,transfers:r,type:t.metadata?.operationType}}};M.styles=R,C([(0,s.MZ)()],M.prototype,"page",void 0),C([(0,s.wk)()],M.prototype,"caipAddress",void 0),C([(0,s.wk)()],M.prototype,"transactionsByYear",void 0),C([(0,s.wk)()],M.prototype,"loading",void 0),C([(0,s.wk)()],M.prototype,"empty",void 0),C([(0,s.wk)()],M.prototype,"next",void 0),M=C([(0,m.EM)("w3m-activity-list")],M)},40396:(t,e,i)=>{var r=i(83138),a=i(98410),s=i(47327),o=i(20296);let n=(0,o.AH)`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:t})=>t.theme.foregroundSecondary} 0%,
      ${({tokens:t})=>t.theme.foregroundTertiary} 50%,
      ${({tokens:t})=>t.theme.foregroundSecondary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1s ease-in-out infinite;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:t})=>t[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;var c=function(t,e,i,r){var a,s=arguments.length,o=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o};let l=class extends r.WF{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",(0,r.qy)`<slot></slot>`}};l.styles=[n],c([(0,a.MZ)()],l.prototype,"width",void 0),c([(0,a.MZ)()],l.prototype,"height",void 0),c([(0,a.MZ)()],l.prototype,"variant",void 0),c([(0,a.MZ)({type:Boolean})],l.prototype,"rounded",void 0),l=c([(0,s.E)("wui-shimmer")],l)}}]);