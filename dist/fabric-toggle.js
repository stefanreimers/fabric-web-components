"use strict";
class FabricToggle extends HTMLElement {
    constructor() {
        super();
        this._on = 'On';
        this._off = 'Off';
        this._description = '';
        this._disabled = false;
        this._textleft = false;
        this._refs = {};
        this._value = null;
    }
    get disabled() { return this._disabled; }
    set disabled(value) { if (this._disabled === !!value)
        return; this._disabled = !!value; this.__setProperties('disabled'); }
    get textleft() { return this._textleft; }
    set textleft(value) { if (this._textleft === !!value)
        return; this._textleft = !!value; this.__setProperties('textleft'); }
    get on() { return this._on; }
    set on(val) { if (val != this._on) {
        this._on = val;
        this.__setProperties('on');
    } }
    get off() { return this._off; }
    set off(val) { if (val != this._off) {
        this._off = val;
        this.__setProperties('off');
    } }
    get description() { return this._description; }
    set description(val) { if (val != this._description) {
        this._description = val;
        this.__setProperties('description');
    } }
    get value() {
        if (this._value == null) {
            return (this._refs.label.classList.toggle("is-selected")) ? this._on : this._off;
        }
        else {
            return (this._refs.label.classList.toggle("is-selected")) ? this._value : null;
        }
    }
    set value(val) { if (val === this._value || this.disabled)
        return; this._value = val; }
    connectedCallback() {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    }
    __setupUI() {
        let markup = `<div class="ms-Toggle">
		  <span class="ms-Toggle-description"></span>
		  <input type="checkbox" class="ms-Toggle-input" />
		  <label class="ms-Toggle-field">
			<span class="ms-Label ms-Label--off"></span>
			<span class="ms-Label ms-Label--on"></span>
		  </label>
		</div>`;
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-Toggle'),
            label: this.querySelector('.ms-Toggle-field'),
            on: this.querySelector('.ms-Label--on'),
            off: this.querySelector('.ms-Label--off'),
            description: this.querySelector('.ms-Toggle-description')
        };
    }
    __setProperties(property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            if (this._disabled === false) {
                this._refs.label.setAttribute("tabindex", "0");
            }
            else {
                this._refs.label.removeAttribute("tabindex");
            }
        }
        if (property == null || property === 'textleft') {
            this._refs.container.classList[(!!this._textleft) ? 'add' : 'remove']('ms-Toggle--textLeft');
        }
        ['on', 'off', 'description'].forEach((prop) => {
            if (property == null || property === prop) {
                this._refs[prop].textContent = this[prop] || '';
            }
        });
    }
    __addListeners() {
        if (this._refs.label) {
            this._refs.label.addEventListener("click", this.__toggleHandler.bind(this), false);
            this._refs.label.addEventListener("keyup", (e) => { (e.keyCode === 32) ? this.__toggleHandler() : null; }, false);
        }
    }
    __toggleHandler() {
        if (this._refs.label)
            this._refs.label.classList.toggle("is-selected");
    }
    static get observedAttributes() {
        return ['textleft', 'disabled', 'on', 'off', 'description'];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        if (typeof this[attr] === 'boolean') {
            this[attr] = this.hasAttribute(attr);
        }
        else {
            if (this[attr] != newValue)
                this[attr] = newValue;
        }
    }
}
window.customElements.define('fabric-toggle', FabricToggle);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `.ms-Toggle{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;font-weight:400;box-sizing:border-box;margin:0;padding:0;box-shadow:none;position:relative;display:block;margin-bottom:26px}
.ms-Toggle .ms-Label{position:relative;top:-2px;padding:0 0 0 50px}
.ms-Toggle .ms-Toggle-field:before{position:absolute;top:3px;width:10px;height:10px;border-radius:10px;content:"";left:4px;background-color:#666;outline:1px solid transparent;transition-property:background,left;transition-duration:.25s;transition-timing-function:cubic-bezier(.4,0,.23,1)}
@media screen and (-ms-high-contrast:active){.ms-Toggle .ms-Toggle-field:before{border:2.5px solid #fff;height:15px;outline:0}
}
@media screen and (-ms-high-contrast:black-on-white){.ms-Toggle .ms-Toggle-field:before{border-color:#000}
}
.ms-Toggle .ms-Toggle-field:before{right:auto}
.ms-Toggle .ms-Toggle-field .ms-Label--off{display:block}
.ms-Toggle .ms-Toggle-field .ms-Label--on{display:none}
.ms-Toggle .ms-Toggle-field.is-selected{background-color:#0078d7;border-color:#0078d7}
.ms-Toggle .ms-Toggle-field.is-selected:before{position:absolute;top:3px;width:10px;height:10px;border-radius:10px;content:"";right:4px;background-color:#666;outline:1px solid transparent;transition-property:background,left;transition-duration:.25s;transition-timing-function:cubic-bezier(.4,0,.23,1)}
@media screen and (-ms-high-contrast:active){.ms-Toggle .ms-Toggle-field.is-selected:before{border:2.5px solid #fff;height:15px;outline:0}
}
@media screen and (-ms-high-contrast:black-on-white){.ms-Toggle .ms-Toggle-field.is-selected:before{border-color:#000}
}
.ms-Toggle .ms-Toggle-field.is-selected:before{background-color:#fff;left:28px}
.ms-Toggle .ms-Toggle-field.is-selected .ms-Label--off{display:none}
.ms-Toggle .ms-Toggle-field.is-selected .ms-Label--on{display:block}
@media screen and (-ms-high-contrast:active){.ms-Toggle .ms-Toggle-field.is-selected{background-color:#fff}
}
@media screen and (-ms-high-contrast:black-on-white){.ms-Toggle .ms-Toggle-field.is-selected{background-color:#000}
}
.ms-Toggle:focus+.ms-Toggle-field,.ms-Toggle:hover+.ms-Toggle-field{border-color:#666}
.ms-Toggle:focus+.ms-Toggle-field:before,.ms-Toggle:hover+.ms-Toggle-field:before{background-color:#333}
.ms-Toggle:focus:checked+.ms-Toggle-field,.ms-Toggle:hover:checked+.ms-Toggle-field{background-color:#106ebe;border-color:#106ebe}
.ms-Toggle:focus:checked+.ms-Toggle-field:before,.ms-Toggle:hover:checked+.ms-Toggle-field:before{background-color:#fff}
.ms-Toggle:active:checked+.ms-Toggle-field{background-color:#005a9e;border-color:#005a9e}
.ms-Toggle .ms-Toggle-field:focus,.ms-Toggle .ms-Toggle-field:hover{border-color:#333}
.ms-Toggle .ms-Toggle-field.is-selected:focus,.ms-Toggle .ms-Toggle-field.is-selected:hover{background-color:#106ebe;border-color:#106ebe}
.ms-Toggle .ms-Toggle-field .ms-Label{color:#000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}
.ms-Toggle .ms-Toggle-field:hover .ms-Label{color:#000}
.ms-Toggle .ms-Toggle-field:active .ms-Label{color:#333}
.ms-Toggle.is-disabled .ms-Label{color:#a6a6a6}
.ms-Toggle.is-disabled .ms-Toggle-field{background-color:#fff;border-color:#c8c8c8;pointer-events:none;cursor:default}
.ms-Toggle.is-disabled .ms-Toggle-field:before{background-color:#c8c8c8}
@media screen and (-ms-high-contrast:active){.ms-Toggle.is-disabled .ms-Toggle-field,.ms-Toggle.is-disabled .ms-Toggle-field:before{border-color:#0f0}
}
@media screen and (-ms-high-contrast:black-on-white){.ms-Toggle.is-disabled .ms-Toggle-field,.ms-Toggle.is-disabled .ms-Toggle-field:before{border-color:#600000}
}
.ms-Toggle-description{position:relative;font-size:14px;vertical-align:top;display:block;margin-bottom:8px}
.ms-Toggle-field{position:relative;display:inline-block;width:45px;height:20px;box-sizing:border-box;border:2px solid #a6a6a6;border-radius:20px;cursor:pointer;transition-property:background,left,border-color;transition-duration:.25s;transition-timing-function:cubic-bezier(.4,0,.23,1);outline:0}
.ms-Toggle-field:focus,.ms-Toggle-field:hover{border-color:#666}
.ms-Toggle-input{display:none}
.ms-Toggle.ms-Toggle--textLeft{width:225px;margin-bottom:40px}
.ms-Toggle.ms-Toggle--textLeft .ms-Toggle-description{display:inline-block;max-width:150px;top:-3px;margin-bottom:0}
.ms-Toggle.ms-Toggle--textLeft .ms-Toggle-field{float:right}`;
    d.head.appendChild(style);
})(window, document);
