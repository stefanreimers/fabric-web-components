"use strict";
class FabricSearch extends HTMLElement {
    constructor() {
        super();
        this._refs = {};
        this._disabled = false;
        this._modifier = null;
        this._label = '';
        this._icon = '';
        this._timer = null;
    }
    get label() { return this._label; }
    set label(value) { this._label = value; this.__setProperties('label'); }
    get icon() { return this._icon; }
    set icon(value) { this._icon = value; this.__setProperties('icon'); }
    get modifier() { return this._modifier; }
    set modifier(value) { throw new RangeError('The modifier property is static.'); }
    get disabled() { return this._disabled; }
    set disabled(value) { this._disabled = !!value; this.__setProperties('disabled'); }
    get value() { return (this._refs.input) ? this._refs.input.value : null; }
    set value(val) { if (this._refs.input && val != this.value)
        this._refs.input.value = val; }
    get timer() { return this._timer; }
    set timer(value) {
        let val = (typeof value === 'string') ? Math.floor(parseInt(value, 10)) : value;
        if (value == null || typeof val === 'number') {
            if (this._timer == value)
                return;
            this._timer = value;
            this.__setProperties('timer');
        }
        else {
            throw RangeError('timer must be a number');
        }
    }
    connectedCallback() {
        this.__getStaticAttributes();
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    }
    __setupUI() {
        let modifier = (this._modifier) ? 'ms-SearchBox--' + this._modifier : '';
        let markup = `<div class="ms-SearchBox ${modifier}">
		  <input class="ms-SearchBox-field" type="text" value="">
		  <label class="ms-SearchBox-label">
			<i class="ms-SearchBox-icon ms-Icon--Search ms-Icon"></i>
			<span class="ms-SearchBox-text"></span>
		  </label>
		  <div class="ms-CommandButton ms-SearchBox-clear ms-CommandButton--noLabel is-hidden">
			  <button class="ms-CommandButton-button" tabIndex="-1">
				<span class="ms-CommandButton-icon"><i class="ms-Icon ms-Icon--Clear"></i></span>
				<span class="ms-CommandButton-label"></span>
			  </button>
		  </div>
		</div>`;
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-SearchBox'),
            input: this.querySelector('.ms-SearchBox-field'),
            icon: this.querySelector('.ms-SearchBox-icon'),
            label: this.querySelector('.ms-SearchBox-text'),
            clear: this.querySelector('.ms-CommandButton-button')
        };
    }
    __setProperties(property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            if (this._refs.input)
                this._refs.input.disabled = this._disabled;
            this._refs.container.classList[(this._disabled) ? 'add' : 'remove']('is-disabled');
        }
        if (property == null || property === 'label') {
            if (this._refs.label)
                this._refs.label.textContent = this._label;
        }
    }
    __setHasText() {
        this._refs.container.classList[(this._refs.input.value != null && this._refs.input.value !== "") ? 'add' : 'remove']('has-text');
    }
    __search() {
        this.dispatchEvent(new CustomEvent('search', { detail: { query: this._refs.input.value }, bubbles: true, cancelable: true }));
    }
    __addListeners() {
        if (this._refs.input)
            this._refs.input.addEventListener('input', (e) => {
                console.log('input', e);
                this.__setHasText();
            });
        if (this._refs.clear)
            this._refs.clear.addEventListener('click', (e) => {
                this._refs.input.value = null;
                this.__setHasText();
                this.__search();
                e.target.blur();
            });
        if (this._refs.input)
            this._refs.input.addEventListener("keydown", (e) => {
                let keyCode = e.keyCode;
                if (keyCode === 13) {
                    let value = this._refs.input.value;
                    if (value != null && value !== '') {
                        e.preventDefault();
                        e.stopPropagation();
                        this.__search();
                    }
                }
            }, false);
    }
    __getStaticAttributes() {
        let modifier = this.getAttribute('modifier');
        if (modifier && ['commandBar'].indexOf(modifier) !== -1)
            this._modifier = modifier;
        let host = this.getAttribute('host');
        if (host)
            this._host = host;
    }
    static get observedAttributes() {
        return ['icon', 'label'];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue !== newValue)
            this[attr] = newValue;
    }
}
window.customElements.define('fabric-search', FabricSearch);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `fabric-search { display: block; margin-bottom: 10px }
fabric-search .ms-Icon--Search { -webkit-filter: hue-rotate(220deg) saturate(100); filter: hue-rotate(220deg) saturate(5);  fill: #0078d7 }
.ms-Icon--Search {background-image: url("data:image/svg+xml,%3C?xml version='1.0' encoding='UTF-8' standalone='no'?%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' class='ms-Icon--Search' viewBox='0 0 48 48.000001' height='48' width='48'%3E%3Cdefs/%3E%3Cg transform='translate(0,-1004.3622)'%3E%3Cg fill='red' style='stroke:none' transform='matrix(0.64148279,0,0,0.64148279,26.413744,684.62217)'%3E%3Cpath style='stroke:none' d='m -9.203125,539.98633 -30.414063,30.41406 2.865235,2.86523 30.398437,-30.39843 a 25,25 0 0 1 -2.849609,-2.88086 z' /%3E%3Cpath style='stroke:none' d='m 7.0916734,500.25079 a 25,25 0 0 0 -25.0000004,25 25,25 0 0 0 25.0000004,25 25,25 0 0 0 24.9999996,-25 25,25 0 0 0 -24.9999996,-25 z m 0,4 a 21,21 0 0 1 20.9999996,21 21,21 0 0 1 -20.9999996,21 21,21 0 0 1 -21.0000004,-21 21,21 0 0 1 21.0000004,-21 z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.ms-Icon--Clear {background-image: url("data:image/svg+xml,%3C?xml version='1.0' encoding='UTF-8' standalone='no'?%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48.000001' height='48' width='48'%3E%3Cdefs/%3E%3Cg transform='translate(0,-1004.3622)'%3E%3Cg fill='white' transform='translate(114.04091,527.99014)'%3E%3Crect style='stroke:none' width='4.0501809' height='63.832069' x='288.12283' y='385.56897' transform='matrix(0.70710678,0.70710678,-0.70710678,0.70710678,0,0)' /%3E%3Crect style='stroke:none' width='4.0501809' height='63.832069' x='415.45993' y='258.2319' transform='matrix(-0.70710678,0.70710678,0.70710678,0.70710678,0,0)' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");}
.ms-Icon {background-size: 16px 16px;height: 16px;width: 16px;display: inline-block}
.ms-SearchBox.has-text .ms-SearchBox-label{ display: none }
.ms-SearchBox{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;height:36px;color:#333;font-size:14px;font-weight:400;position:relative;display:block;overflow:hidden;background-color:#fff}
.ms-SearchBox.is-active{z-index:10}
.ms-SearchBox.is-active .ms-SearchBox-label{display:none}
.ms-SearchBox.is-active .ms-SearchBox-clear, .ms-SearchBox.has-text .ms-SearchBox-clear, .ms-SearchBox-field:focus ~ .ms-SearchBox-clear {display:block !important}
.ms-SearchBox:hover{background-color:#deecf9}
.ms-SearchBox:hover .ms-SearchBox-label{color:#000}
.ms-SearchBox:hover .ms-SearchBox-label .ms-Icon{color:#333; -webkit-filter: grayscale(100%) brightness(500%) brightness(20%); filter: grayscale(100%) brightness(500%) brightness(20%) }
.ms-SearchBox.is-disabled{background-color:#f4f4f4;pointer-events:none}
.ms-SearchBox.is-disabled .ms-SearchBox-icon,.ms-SearchBox.is-disabled .ms-SearchBox-label{color:#a6a6a6}
.ms-SearchBox.is-disabled .ms-SearchBox-field{color:#a6a6a6;background-color:transparent;border-color:#f4f4f4;cursor:default}
.ms-SearchBox-clear{display:none;position:absolute;top:0;right:0;z-index:10}
.ms-SearchBox-clear .ms-CommandButton-button{background-color:#0078d7;color:#fff;height:36px}
.ms-SearchBox-clear .ms-CommandButton-icon{color:#fff}
.ms-SearchBox-icon{position:relative;top:50%;transform:translateY(-50%);display:inline-block;font-size:16px;width:16px;margin-left:12px;margin-right:6px;color:#0078d7;vertical-align:top}
.ms-SearchBox-icon.is-hidden {display: none}
.ms-SearchBox-field{position:relative;box-sizing:border-box;margin:0;padding:0;box-shadow:none;border:1px solid #69afe5;outline:1px solid transparent;font-weight:300;font-size:14px;color:#000;height:36px;padding:6px 3px 7px 45px;width:100%;display:block;background-color:transparent;z-index:5;transition:padding-left .167s}
.ms-SearchBox-field:focus{padding:6px 32px 7px 10px;border-color:#0078d7;background-color:#deecf9}
.ms-SearchBox-field::-ms-clear{display:none}
.ms-SearchBox-label{position:absolute;top:0;left:0;height:36px;line-height:36px;color:#666}
.ms-SearchBox.ms-SearchBox--commandBar{background-color:#fff;width:208px;height:40px}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-label{height:40px}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field{transition:none;border:0}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field:focus{background-color:transparent;padding:6px 3px 7px 45px}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter{display:none;position:absolute;top:0;z-index:10;color:#a6a6a6}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter .ms-CommandButton-button{height:40px;background-color:transparent}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter{right:8px}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter .ms-CommandButton-icon{color:#0078d7}
.ms-SearchBox.ms-SearchBox--commandBar:before{position:absolute;content:" ";right:0;bottom:0;left:0;margin:0 8px;border-bottom:1px solid #eaeaea}
.ms-SearchBox.ms-SearchBox--commandBar:hover{background-color:#fff}
.ms-SearchBox.ms-SearchBox--commandBar:hover .ms-SearchBox-label{color:#212121}
.ms-SearchBox.ms-SearchBox--commandBar:hover .ms-SearchBox-icon{color:#0078d7}
.ms-SearchBox.ms-SearchBox--commandBar:focus{background-color:transparent}
.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-CommandButton .ms-SearchBox-exit,.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-CommandButton .ms-SearchBox-filter{display:block}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed{width:50px;min-height:40px;z-index:0;background-color:#f4f4f4}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed .ms-SearchBox-text{display:none}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed .ms-SearchBox-field{cursor:pointer;width:calc(100% - 50px)}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed:before{visibility:hidden}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active{width:100%}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active .ms-SearchBox-field{display:block;cursor:text}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active .ms-SearchBox-text{display:inline-block}
@media only screen and (max-width:639px){.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active{width:100%}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active .ms-SearchBox-clear{display:inline-block;right:58px}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active .ms-SearchBox-filter{display:inline-block}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active.is-animated{transition:width .167s cubic-bezier(.1,.9,.2,1)}
}
.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active:before{visibility:visible}
.ms-SearchBox.ms-SearchBox--commandBar.has-text .ms-SearchBox-clear{display:inline-block}
.ms-SearchBox.ms-SearchBox--commandBar.has-text .ms-SearchBox-clear .ms-CommandButton-icon{color:#a6a6a6}
.ms-SearchBox.ms-SearchBox--commandBar.has-text .ms-SearchBox-clear .ms-CommandButton-icon:active{color:#0078d7}
@media only screen and (min-width:1024px){.ms-SearchBox.ms-SearchBox--commandBar{background-color:#fff;border-right:1px solid #eaeaea}
}
@media only screen and (max-width:639px){.ms-SearchBox.ms-SearchBox--commandBar{height:44px}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-icon,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-label{height:44px;line-height:44px}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-icon{font-size:20px}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-icon .ms-CommandButton-button{height:44px}
.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-label{font-size:16px}
}
.ms-SearchBox.ms-SearchBox--commandBar.is-active{background-color:#fff}
.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-label{display:block;line-height:40px;height:40px}
.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-label .ms-SearchBox-text{display:none}
.ms-SearchBox.ms-SearchBox--commandBar.is-active:before{visibility:visible}
@media only screen and (max-width:639px){.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-field{width:100%;padding-right:100px}
.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-icon{display:none}
.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-exit{display:inline-block}
.ms-SearchBox.ms-SearchBox--commandBar.is-active.has-text .ms-SearchBox-filter .ms-CommandButton-icon{color:#a6a6a6}
}
@media only screen and (max-width:639px){.ms-CommandButton-button,.ms-CommandButton-splitIcon{height:44px}
.ms-CommandButton-button .ms-CommandButton-icon,.ms-CommandButton-splitIcon .ms-CommandButton-icon{font-size:20px}
.ms-CommandButton-button .ms-CommandButton-label,.ms-CommandButton-splitIcon .ms-CommandButton-label{line-height:44px}
}
.ms-CommandButton-button{border:0;margin:0}
.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-icon{margin-right:0}
.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-label{display:none}
.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-button{padding:0 12px}`;
    d.head.appendChild(style);
})(window, document);
