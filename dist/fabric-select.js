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
        this._options = [];
        this._value = null;
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
    get value() { return this._value; }
    set value(val) {
        console.log('TODO');
    }
    get label() { return this._label; }
    set label(value) { if (value === this._label)
        return; this._label = value; this.__setProperties('label'); }
    get name() { return this._name; }
    set name(value) { if (value === this._name)
        return; this._name = value; }
    get options() { return this._options || []; }
    set options(value) { this._options = [].concat(value); this.__setProperties('options'); }
    connectedCallback() {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    }
    __setupUI() {
        let markup = `
      <label class="ms-Label hide-when-empty"></label>
      <div style="display:flex">
        <fabric-command-button class="selector" style="flex-grow:1"></fabric-command-button>
        <button class="ms-SelectClearButton is-hidden">
          X
			</button>
      </div>`;
        this.innerHTML = markup;
        this._refs = {
            button: this.querySelector('fabric-command-button.selector'),
            label: this.querySelector('.ms-Label')
        };
    }
    __setProperties(property) {
        if (!this._refs || !this._refs.button)
            return;
        if (property == null || property === 'disabled') {
            if (this._refs.button)
                this._refs.button.disabled = this._disabled;
        }
        if (property == null || property === 'options') {
            console.log('__setProperties, options');
            if (this._refs.button) {
                this._refs.button.items = this.options;
            }
            else {
                console.log('Too early');
            }
        }
        if (property == null || property === 'required') {
            if (this._refs.label)
                this._refs.label.classList[this._required ? 'add' : 'remove']('is-required');
        }
        if (property == null || property === 'label') {
            if (this._refs.label)
                this._refs.label.textContent = this._label || '';
        }
    }
    __addListeners() {
        if (!this._refs.button)
            return;
        this.addEventListener('contextual-menu-link-click', (e) => {
            var _a;
            console.log('contextual-menu-link-click on select menu', e);
            e.preventDefault();
            var newlySelected = (_a = e.detail) === null || _a === void 0 ? void 0 : _a.node;
            if (!newlySelected) {
                this._refs.button.click();
                return;
            }
            var contextualMenuItem = newlySelected.closest('.ms-ContextualMenu-item');
            if (newlySelected.classList.contains('is-disabled') || (contextualMenuItem && contextualMenuItem.classList.contains('ms-ContextualMenu-item--header'))) {
                this._refs.button.click();
                return;
            }
            if (this.multiple !== true) {
                var preSelected = this._refs.button.querySelector('.is-selected');
                if (preSelected)
                    preSelected.classList.remove('is-selected');
            }
            newlySelected.classList.add('is-selected');
            this._value = JSON.parse(window.atob(newlySelected.parentElement.dataset.source));
            if (this.multiple === true) {
            }
            else {
                var icon = contextualMenuItem.querySelector('.ms-Icon');
                this._refs.button.icon = (icon) ? (/ms-Icon--(\w+)/.exec(icon.className))[1] : null;
                this._refs.button.label = newlySelected.textContent;
                this._refs.button.click();
            }
        }, { capture: true });
    }
    static get observedAttributes() {
        return ['label', 'disabled', 'required', 'multiple', 'name', 'value', 'items'];
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
        return true;
    }
}
window.customElements.define('fabric-select', FabricSelect);
(function (w, d) {
    'use strict';
    let id = 'select';
    const node = document.querySelector('style[data-fabric="' + id + '"]');
    if (node) {
        return;
    }
    var styles = document.createElement("style");
    styles.type = 'text/css';
    styles.innerHTML = _getStyles();
    styles.dataset.fabric = id;
    document.getElementsByTagName('head')[0].appendChild(styles);
    function _getStyles() {
        const tag = 'fabric-select';
        return `${tag} {
	display: inline-block;
	font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;
  min-width: 180px;
}

${tag} > div {
    box-sizing: border-box;
margin: 0;
padding: 0;
box-shadow: none;
border-width: 1px;
border-style: solid;
border-color: var(--fabric-structured-textfield-border, #c8c8c8);
border-radius: 0;
font-weight: 300;
font-size: 14px;
color: #333333;
min-width: 180px;
outline: 0;
text-overflow: ellipsis;
background-color: white;
}

${tag} > div:hover {
  border-color: var(--${tag}-border-hover, #767676);
}

${tag} > div:focus,
${tag} > div:focus-within {
  border-color: var(--${tag}-border-focus, #0078d7);
}

${tag} .selector {
  width: 100%;
  height: 100%;
  display:block;
  box-sizing: border-box;
  height: 32px;
--size: 32px;

}

${tag} .selector .ms-CommandButton .ms-CommandButton-button,
${tag} .selector .ms-CommandButton{
  max-height: 100%;
  width: 100%;
  display: flex;
  border: 0;
}

${tag} .selector .ms-CommandButton .ms-CommandButton-button .ms-CommandButton-label {
  flex-grow: 1;
  text-align: left;
  line-height: calc(var(--size, 40px) - 2px);
}

${tag} .selector .ms-CommandButton .ms-CommandButton-button:focus:before,
${tag} .selector .ms-CommandButton .ms-CommandButton-splitIcon:focus:before{top:0;left:0px;right:0px;bottom:0px;border:0;position:absolute;z-index:10;content:"";outline:none}



${tag} .ms-CommandButton-button:hover,
${tag} .ms-CommandButton-splitIcon:hover{background-color:transparent}



${tag} .ms-CommandButton-icon{
  min-width: auto;
  margin-right: 0;
}

${tag} .ms-CommandButton-icon i[class="ms-Icon"]{
  display: none;
}

${tag} .ms-CommandButton-icon i.ms-Icon{
  margin-right: 8px;
}

${tag} .ms-Label:empty,
${tag} .ms-Label:empty::after,
${tag} .ms-TextField-description:empty {
  display: none
}

${tag} .ms-Label {
  font-size: 14px;
  font-weight: 600;
  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

${tag} .ms-Label.is-required::after {
    content: ' *';
    color: #a80000;
}

.ms-SelectClearButton {
  background-color: transparent;
border: 0;
}

}`;
    }
}(window, document));
