"use strict";
class FabricCommandBar extends HTMLElement {
    constructor() {
        super();
        this._navbar = false;
        this._disabled = false;
        this._refs = {};
    }
    connectedCallback() {
        this.__setupUI();
        this.__addListeners();
        this.__setProperties();
    }
    get navbar() { return this._navbar; }
    set navbar(value) { if (!!value === this._navbar)
        return; this._navbar = !!value; this.__setProperties('navbar'); }
    get disabled() { return this._disabled; }
    set disabled(value) { if (!!value === this._disabled)
        return; this._disabled = !!value; this.__setProperties('disabled'); }
    __setupUI() {
        let container = document.createElement('div');
        let markup = `<div class="ms-CommandBar">
			<div class="ms-CommandBar-sideCommands"></div>
			<div class="ms-CommandBar-mainArea"></div>
		</div>`;
        container.innerHTML = markup;
        this.appendChild(container.children[0]);
        this._refs = {
            container: this.querySelector('.ms-CommandBar'),
            main: this.querySelector('.ms-CommandBar-mainArea'),
            side: this.querySelector('.ms-CommandBar-sideCommands')
        };
        [].forEach.call(this.querySelectorAll('fabric-command-button'), (f) => {
            this._refs[(f.classList.contains('side')) ? 'side' : 'main'].appendChild(f);
        });
    }
    __setProperties(property) {
        if (!this._refs.container)
            return;
        if (property == null || property === 'navbar') {
            this._refs.container.classList[(this.disabled === true) ? 'add' : 'remove']('is-disabled');
        }
    }
    __addListeners() {
        this.addEventListener('fabric-command-button-init', (e) => {
            console.info('FabricCommandBar fabric-command-button-init', e.target);
        });
    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        let n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    }
}
window.customElements.define('fabric-command-bar', FabricCommandBar);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `.ms-CommandBar{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;
-webkit-font-smoothing:antialiased;background-color:#f4f4f4;height:40px;white-space:nowrap;padding-left:0;border:0;position:relative}
.ms-CommandBar:focus{outline:none}
.ms-CommandBar .ms-CommandButton--actionButton{border-right:1px solid #eaeaea}
.ms-CommandBar .ms-Button{height:100%}
.ms-CommandBar .ms-Button.ms-Button--noLabel .ms-Button-icon{padding-right:0}
.ms-CommandBar .ms-Button.is-hidden{display:none}
.ms-CommandBar .ms-SearchBox,.ms-CommandBar .ms-SearchBox-field,.ms-CommandBar .ms-SearchBox-label{height:100%}
.ms-CommandBar .ms-SearchBox{display:inline-block;vertical-align:top;transition:margin-right .267s}
.ms-CommandBar .ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active{width:220px}
@media only screen and (max-width:639px){
	.ms-CommandBar .ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active{width:100%;position:absolute;left:0;right:0;z-index:10}
}
.ms-CommandBar .ms-CommandBar-overflowButton .ms-CommandButton-button{font-size:18px;padding:0 11px}
@media only screen and (min-width:1024px){
	.ms-CommandBar .ms-SearchBox{margin-right:24px}
}
@media only screen and (max-width:639px){
	.ms-CommandBar{height:44px}
}
@media only screen and (min-width:640px){
	.ms-CommandBar.search-expanded .ms-SearchBox{margin-right:8px}
	.ms-CommandBar .ms-SearchBox.ms-SearchBox--commandBar.is-collapsed{transition:none}
}
.ms-CommandBar-mainArea{overflow-x:hidden;display:block;height:100%;overflow:hidden}
.ms-CommandBar-sideCommands{float:right;text-align:right;width:auto;padding-right:4px;height:100%}
.ms-CommandBar-sideCommands .ms-Button:last-child{margin-right:0}
@media only screen and (min-width:640px){
	.ms-CommandBar-sideCommands{min-width:128px}
}
@media only screen and (min-width:1024px){
	.ms-CommandBar-sideCommands{padding-right:20px}
}
.ms-CommandBar-mainArea:empty, .ms-CommandBar-sideCommands:empty{display: none}
fabric-command-bar > fabric-command-button{display:none}`;
    d.head.appendChild(style);
})(window, document);
