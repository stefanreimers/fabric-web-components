"use strict";
class FabricSelect extends HTMLElement {
    constructor() {
        super();
        this._refs = {};
        this._disabled = false;
        this._required = false;
        this._multiple = false;
        this._name = null;
        this._label = null;
    }
    get disabled() { return this._disabled; }
    set disabled(value) { if (this._disabled === value)
        return; this._disabled = !!value; this.__setProperties('disabled'); }
    get required() { return this._required; }
    set required(value) { if (this._required === value)
        return; this._required = !!value; this.__setProperties('required'); }
    get multiple() { return this._multiple; }
    set multiple(value) { if (this._multiple === value)
        return; this._multiple = !!value; this.__setProperties('multiple'); }
    get value() {
        if (!this._refs.select)
            return null;
        if (!this.multiple)
            return this._refs.select.value;
        return Object.keys(this._refs.select.selectedOptions).map(i => { let j = this._refs.select.selectedOptions[i]; return j.value || j.textContent; });
    }
    set value(val) { if (this._refs.select && val != this.value)
        this._refs.select.value = val; }
    get label() { return this._label; }
    set label(value) { if (value === this._label)
        return; this._label = value; this.__setProperties('label'); }
    get name() { return this._name; }
    set name(value) { if (value === this._name)
        return; this._name = value; }
    get options() { return (this._refs.select) ? this._refs.select.querySelectorAll('option:not([hidden])') : null; }
    connectedCallback() {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    }
    __setupUI() {
        let markup = `<div class="ms-Dropdown" tabindex="0">
			<label class="ms-Label"></label>
			<select class="ms-Dropdown-select">
				<option value="" disabled selected hidden>Choose an option...</option>
			</select>
			<i class="ms-Dropdown-caretDown _ms-Icon ms-Icon--ChevronDown chevron"></i></div>`;
        if (this.children && this.children.length > 0) {
            const div = document.createElement('DIV');
            div.innerHTML = markup;
            const contentContainer = div.querySelector('select');
            if (contentContainer) {
                while (this.children.length > 0) {
                    if (this.children[0].tagName.toLowerCase() === 'option') {
                        contentContainer.appendChild(this.children[0]);
                    }
                    else {
                        this.removeChild(this.children[0]);
                    }
                }
                this.appendChild(div.children[0]);
            }
            else {
                this.innerHTML = markup;
            }
        }
        this._refs = {
            container: this.querySelector('.ms-Dropdown'),
            select: this.querySelector('select'),
            label: this.querySelector('label'),
            chevron: this.querySelector('i')
        };
    }
    __setProperties(property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            if (this._refs.select)
                this._refs.select.disabled = this._disabled;
            this._refs.container.classList[(this._disabled) ? 'add' : 'remove']('is-disabled');
        }
        if (property == null || property === 'required') {
            if (this._refs.select)
                this._refs.select.required = this._required;
            this._refs.container.classList[(this._required) ? 'add' : 'remove']('is-required');
        }
        if (property == null || property === 'multiple') {
            if (this._refs.select)
                this._refs.select.multiple = this._multiple;
            this._refs.container.classList[(this._multiple) ? 'add' : 'remove']('is-multiple');
            try {
                if (this.multiple === true) {
                    if (this._refs.select) {
                        let hidden = this._refs.select.querySelector('option[value=""][selected]');
                        if (hidden)
                            hidden.removeAttribute('selected');
                    }
                }
                else {
                    if (this.value == null || this.value === '') {
                        if (this._refs.select) {
                            let hidden = this._refs.select.querySelector('option[value=""]');
                            if (hidden)
                                hidden.setAttribute('selected', '');
                        }
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        if (property == null || property === 'label') {
            if (this._refs.label)
                this._refs.label.textContent = this._label || '';
        }
    }
    __addListeners() {
        if (!this._refs.select)
            return;
        this._refs.select.addEventListener('change', (e) => {
            if (this.multiple === true)
                return;
            let value = (e && e.target) ? e.target.value : null;
            if (!value)
                return;
            let unselect = this._refs.select.querySelectorAll('option.is-selected:not([value="' + value + '"])');
            if (unselect && unselect.length > 0) {
                [].forEach.call(unselect, (element) => {
                    element.classList.remove('is-selected');
                });
            }
            let select = this._refs.select.querySelector('option[value="' + value + '"]');
            if (select && !select.classList.contains('is-selected')) {
                select.classList.add('is-selected');
            }
        });
    }
    static get observedAttributes() {
        return ['label', 'disabled', 'required', 'multiple', 'name'];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        let n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    }
    checkValidity() {
        if (this.required === true) {
            return (this.value !== '' && this.value != null);
        }
        return this._refs.select.checkValidity();
    }
}
window.customElements.define('fabric-select', FabricSelect);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `fabric-select { 
	display: inline-block;
	font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;
}
fabric-select select {
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	
	border:1px solid #c8c8c8;
	border-radius: 0;
	font-size: 14px;
	
	width: 100%;
	min-width: 100px;
	min-height: 32px;

	padding: 0px 30px 0px 10px;
	/*background-color:#fff;*/
	color:black;
	
	box-sizing: border-box;
}

fabric-select select:hover {
border-color: #767676;
}

fabric-select select:focus {
border-color: #0078d7;
}
	
fabric-select select::-ms-expand {
  display:none;
}

fabric-select select option {
  padding: 5px 8px 5px 10px;
  border-top:0px /*solid #444;*/

}
fabric-select select option{
	box-shadow: 0 0 5px 0 rgba(0,0,0,.4)
}

fabric-select select:not([multiple]) option.is-selected {
	background-color: #b3d6f2;
	color: #000;
}

fabric-select .chevron{
    display:inline-block;
    height:12px;/*height should be double border*/
	
}
fabric-select .chevron:before,
fabric-select .chevron:after{
    position:absolute;
    display:block;
    content:"";
    border:6px solid transparent;/*adjust size*/
	left: -20px;
	margin-top: 5px;
}
/* Replace all text top below with left/right/bottom to rotate the chevron */
fabric-select .chevron:before{
    top:0;
    border-top-color:#aaa;/*chevron Color*/
}
fabric-select .chevron:after{
    top:-1px;/*adjust thickness*/
    border-top-color:#fff;/*Match background colour*/
}
fabric-select .is-disabled .chevron:after{
    top:-1px;/*adjust thickness*/
    border-top-color:#f4f4f4;/*Match background colour*/
}

fabric-select select[disabled] {
	background-color: #f4f4f4;
	color: #a6a6a6;
	border-color: #f4f4f4
}

.ms-Dropdown{
	font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;
	box-sizing:border-box;margin:0;padding:0;box-shadow:none;color:#333;font-size:14px;font-weight:400;margin-bottom:10px;position:relative;outline:0}
.ms-Dropdown:active .ms-Dropdown-caretDown:before,
.ms-Dropdown:focus .ms-Dropdown-caretDown:before,
.ms-Dropdown:hover .ms-Dropdown-caretDown:before{
	border-top-color:#000
}

.ms-Dropdown .ms-Label{
	display:inline-block;
	margin-bottom:8px;
	font-size: 12px
}

.ms-Dropdown.is-disabled .ms-Dropdown-caretDown:before{
	border-top-color:#a6a6a6
}

.ms-Dropdown-caretDown{
	color:#212121;font-size:12px;position:absolute;right:5px;bottom:11px;z-index:1;pointer-events:none
}

fabric-select select[multiple]{
	padding: 0;
}

fabric-select select[multiple] > option {
	box-shadow: none;
}

fabric-select select[multiple] ~ i {
	display: none
}`;
    d.head.appendChild(style);
})(window, document);
