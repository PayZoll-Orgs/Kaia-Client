"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3513],{20840:(t,o,e)=>{e.r(o),e.d(o,{W3mTransactionsView:()=>n});var r=e(83138),i=e(36211);e(40575),e(20943);let a=(0,r.AH)`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`,n=class extends r.WF{render(){return(0,r.qy)`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="3">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `}};n.styles=a,n=function(t,o,e,r){var i,a=arguments.length,n=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,e):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,o,e,r);else for(var c=t.length-1;c>=0;c--)(i=t[c])&&(n=(a<3?i(n):a>3?i(o,e,n):i(o,e))||n);return a>3&&n&&Object.defineProperty(o,e,n),n}([(0,i.EM)("w3m-transactions-view")],n)},38534:(t,o,e)=>{var r=e(83138),i=e(98410),a=e(71084),n=e(8821),c=e(47327);let s=(0,r.AH)`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
    box-sizing: border-box;
  }
`;var d=function(t,o,e,r){var i,a=arguments.length,n=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,e):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,o,e,r);else for(var c=t.length-1;c>=0;c--)(i=t[c])&&(n=(a<3?i(n):a>3?i(o,e,n):i(o,e))||n);return a>3&&n&&Object.defineProperty(o,e,n),n};let l=class extends r.WF{render(){return this.style.cssText=`
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
    `,(0,r.qy)`<slot></slot>`}};l.styles=[a.W5,s],d([(0,i.MZ)()],l.prototype,"flexDirection",void 0),d([(0,i.MZ)()],l.prototype,"flexWrap",void 0),d([(0,i.MZ)()],l.prototype,"flexBasis",void 0),d([(0,i.MZ)()],l.prototype,"flexGrow",void 0),d([(0,i.MZ)()],l.prototype,"flexShrink",void 0),d([(0,i.MZ)()],l.prototype,"alignItems",void 0),d([(0,i.MZ)()],l.prototype,"justifyContent",void 0),d([(0,i.MZ)()],l.prototype,"columnGap",void 0),d([(0,i.MZ)()],l.prototype,"rowGap",void 0),d([(0,i.MZ)()],l.prototype,"gap",void 0),d([(0,i.MZ)()],l.prototype,"padding",void 0),d([(0,i.MZ)()],l.prototype,"margin",void 0),d([(0,i.MZ)()],l.prototype,"width",void 0),l=d([(0,c.E)("wui-flex")],l)},40575:(t,o,e)=>{e(38534)},41163:(t,o,e)=>{e(24772)},48352:(t,o,e)=>{var r=e(83138),i=e(98410);e(99691),e(24772);var a=e(71084),n=e(47327),c=e(20296);let s=(0,c.AH)`
  button {
    border: none;
    background: transparent;
    height: 20px;
    padding: ${({spacing:t})=>t[2]};
    column-gap: ${({spacing:t})=>t[1]};
    border-radius: ${({borderRadius:t})=>t[1]};
    padding: 0 ${({spacing:t})=>t[1]};
    border-radius: ${({spacing:t})=>t[1]};
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent'] {
    color: ${({tokens:t})=>t.core.textAccentPrimary};
  }

  button[data-variant='secondary'] {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[data-variant='accent']:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-variant='accent']:hover:enabled {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:hover:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var d=function(t,o,e,r){var i,a=arguments.length,n=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,e):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,o,e,r);else for(var c=t.length-1;c>=0;c--)(i=t[c])&&(n=(a<3?i(n):a>3?i(o,e,n):i(o,e))||n);return a>3&&n&&Object.defineProperty(o,e,n),n};let l={sm:"sm-medium",md:"md-medium"},p={accent:"accent-primary",secondary:"secondary"},g=class extends r.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.variant="accent",this.icon=void 0}render(){return(0,r.qy)`
      <button ?disabled=${this.disabled} data-variant=${this.variant}>
        <slot name="iconLeft"></slot>
        <wui-text
          color=${p[this.variant]}
          variant=${l[this.size]}
        >
          <slot></slot>
        </wui-text>
        ${this.iconTemplate()}
      </button>
    `}iconTemplate(){return this.icon?(0,r.qy)`<wui-icon name=${this.icon} size="sm"></wui-icon>`:null}};g.styles=[a.W5,a.fD,s],d([(0,i.MZ)()],g.prototype,"size",void 0),d([(0,i.MZ)({type:Boolean})],g.prototype,"disabled",void 0),d([(0,i.MZ)()],g.prototype,"variant",void 0),d([(0,i.MZ)()],g.prototype,"icon",void 0),g=d([(0,n.E)("wui-link")],g)},84042:(t,o,e)=>{var r=e(83138),i=e(98410),a=e(78964);e(99691);var n=e(71084),c=e(47327),s=e(20296);let d=(0,s.AH)`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${({borderRadius:t})=>t[2]};
    padding: ${({spacing:t})=>t[1]} !important;
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    position: relative;
  }

  :host([data-padding='2']) {
    padding: ${({spacing:t})=>t[2]} !important;
  }

  :host:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host > wui-icon {
    z-index: 10;
  }

  /* -- Colors --------------------------------------------------- */
  :host([data-color='accent-primary']) {
    color: ${({tokens:t})=>t.core.iconAccentPrimary};
  }

  :host([data-color='accent-primary']):after {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  :host([data-color='default']),
  :host([data-color='secondary']) {
    color: ${({tokens:t})=>t.theme.iconDefault};
  }

  :host([data-color='default']):after {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  :host([data-color='secondary']):after {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  :host([data-color='success']) {
    color: ${({tokens:t})=>t.core.iconSuccess};
  }

  :host([data-color='success']):after {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
  }

  :host([data-color='error']) {
    color: ${({tokens:t})=>t.core.iconError};
  }

  :host([data-color='error']):after {
    background-color: ${({tokens:t})=>t.core.backgroundError};
  }

  :host([data-color='warning']) {
    color: ${({tokens:t})=>t.core.iconWarning};
  }

  :host([data-color='warning']):after {
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
  }

  :host([data-color='inverse']) {
    color: ${({tokens:t})=>t.theme.iconInverse};
  }

  :host([data-color='inverse']):after {
    background-color: transparent;
  }
`;var l=function(t,o,e,r){var i,a=arguments.length,n=a<3?o:null===r?r=Object.getOwnPropertyDescriptor(o,e):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,o,e,r);else for(var c=t.length-1;c>=0;c--)(i=t[c])&&(n=(a<3?i(n):a>3?i(o,e,n):i(o,e))||n);return a>3&&n&&Object.defineProperty(o,e,n),n};let p=class extends r.WF{constructor(){super(...arguments),this.icon="copy",this.size="md",this.padding="1",this.color="default"}render(){return this.dataset.padding=this.padding,this.dataset.color=this.color,(0,r.qy)`
      <wui-icon size=${(0,a.J)(this.size)} name=${this.icon} color="inherit"></wui-icon>
    `}};p.styles=[n.W5,n.fD,d],l([(0,i.MZ)()],p.prototype,"icon",void 0),l([(0,i.MZ)()],p.prototype,"size",void 0),l([(0,i.MZ)()],p.prototype,"padding",void 0),l([(0,i.MZ)()],p.prototype,"color",void 0),p=l([(0,c.E)("wui-icon-box")],p)},90721:(t,o,e)=>{e(84042)}}]);