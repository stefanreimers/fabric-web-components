"use strict";
class FabricSelect extends HTMLElement {
    constructor() {
        super();
        this._refs = {};
        this._disabled = false;
    }
    get disabled() { return this._disabled; }
    set disabled(value) { }
    get value() { return (this._refs.select) ? this._refs.select.value : null; }
    set value(val) { if (this._refs.select && val != this.value)
        this._refs.select.value = val; }
    connectedCallback() {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    }
    __setupUI() {
        let markup = `<select></select>`;
        if (this.children && this.children.length > 0) {
            const div = document.createElement('DIV');
            div.innerHTML = markup;
            const contentContainer = div.querySelector('select');
            if (!contentContainer)
                throw new TypeError('Markup not svailable');
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
        const chevron = document.createElement('I');
        chevron.classList.add('chevron');
        this.appendChild(chevron);
        this._refs = {
            select: this.querySelector('select'),
            chevron: this.querySelector('i')
        };
    }
    __setProperties(property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            if (this._refs.select)
                this._refs.select.disabled = this._disabled;
        }
    }
    __addListeners() {
        this.addEventListener('mouseover', (e) => {
            if (e.target && e.target.tagName === 'OPTION')
                e.target.classList.add('hover');
        });
        this.addEventListener('mouseout', (e) => {
            if (e.target && e.target.tagName === 'OPTION')
                e.target.classList.remove('hover');
        });
    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
    }
}
window.customElements.define('fabric-select', FabricSelect);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `fabric-select { display: inline-block; }
fabric-select > select {
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	
	border:1px solid #c8c8c8;
	border-radius: 0;
	font-size: 14px;
	
	width: 100%;
	min-width: 100px;

	padding: 0px 30px 0px 10px;
	/*background-color:#fff;*/
	color:black;
	
	box-sizing: border-box;
	
	

	}
	
fabric-select select:after {
	content: "▼";
	position: absolute;
	right: -20px;
	color: #aaa;
	font-size: 14px;
}

fabric-select > select:hover {
border-color: #767676;
}

fabric-select > select:focus {
border-color: #0078d7;
}
	
fabric-select > select::-ms-expand {
  display:none;
}

fabric-select > select option {
  padding: 5px 8px 5px 10px;
  border-top:0px /*solid #444;*/

}

fabric-select > select option:hover {
		background: #aaa
}

fabric-select option.hover {
	background-color: yellow
}


fabric-select .chevron{
    position:relative;
    display:inline-block;
    height:14px;/*height should be double border*/
	
}
fabric-select .chevron:before,
fabric-select .chevron:after{
    position:absolute;
    display:block;
    content:"";
    border:7px solid transparent;/*adjust size*/
	left: -20px;
	margin-top: 5px;
}
/* Replace all text top below with left/right/bottom to rotate the chevron */
fabric-select .chevron:before{
    top:0;
    border-top-color:#aaa;/*chevron Color*/
}
fabric-select .chevron:after{
    top:-2px;/*adjust thickness*/
    border-top-color:#fff;/*Match background colour*/
}`;
    d.head.appendChild(style);
})(window, document);
