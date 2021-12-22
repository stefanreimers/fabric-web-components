class FabricSelect extends HTMLElement {

  private _refs: {
    label?: any,
    button?: any
  };
  private _disabled: boolean;
  private _required: boolean;
  private _multiple: boolean;
  private _name: string | null;
  private _label: string | null;
  private _options: any[];
  private _value: any;

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
  set disabled(value) { if (this._disabled === value) return; this._disabled = !!value; this.__setProperties('disabled'); }

  get required() { return this._required; }
  set required(value) { if (this._required === value) return; this._required = !!value; this.__setProperties('required'); }

  get multiple() { return this._multiple; }
  set multiple(value) { if (this._multiple === value) return; this._multiple = !!value; this.__setProperties('multiple'); }

  get value() { return this._value; }
  //@ts-ignore
  set value(val) { if (this._disabled === true) return; const changed = this.__setValue(val); if (changed) this.__setProperties('value'); }

  get label() { return this._label }
  set label(value) { if (value === this._label) return; this._label = value; this.__setProperties('label'); }

  get name() { return this._name }
  set name(value) { if (value === this._name) return; this._name = value; }

  get options(): any { return this._options || []; }
  set options(value) { this._options = [].concat(value); this.__setProperties('options'); }

  connectedCallback() {

    this.__setupUI();
    this.__setProperties();
    this.__addListeners();

  }

  private __setupUI() {

    let markup = `
      <label class="ms-Label hide-when-empty"></label>
      <div style="display:flex">
        <fabric-command-button class="selector" style="flex-grow:1"></fabric-command-button>
        <button type="button" class="ms-SelectClearButton is-hidden">X</button>
      </div>`;

    this.innerHTML = markup;

    // Update references
    this._refs = {
      button: this.querySelector('fabric-command-button.selector'),
      label: this.querySelector('.ms-Label')
    }

  }

  private __setProperties(property?: string) {

    if (!this._refs || !this._refs.button) return;


    if (property == null || property === 'disabled') {
      if (this._refs.button) this._refs.button.disabled = this._disabled;
    }

    if (property == null || property === 'options') {

      if (this._refs.button) {
        this._refs.button.items = this.options;
      } else {
        // console.log('Too early');
      }
    }

    if (property == null || property === 'required') {
      if (this._refs.label) this._refs.label.classList[this._required ? 'add' : 'remove']('is-required');
    }

    if (property == null || property === 'value') {

      if (this._refs.button) {
        this._refs.button.icon = (this._value && this._value.icon) ? this._value.icon : null;
        this._refs.button.label = (this._value) ? this._value.text || this._value.value || this._value.id : '-';

        // Remove .is-selected from previous entry
        if (this.multiple !== true) {
          // Remove previous selected item
          var preSelected = this._refs.button.querySelector('.is-selected');
          if (preSelected) preSelected.classList.remove('is-selected')
        }

        // Set .is-selected on new entry
        const key = window.btoa(JSON.stringify(this._value));
        let selection = this._refs.button.querySelector('[data-source="' + key + '"]> .ms-ContextualMenu-link');
        if (selection) selection.classList.add('is-selected');

      }

    }

    if (property == null || property === 'label') {
      if (this._refs.label) this._refs.label.textContent = this._label || ''
    }

  }

  private __addListeners() {

    if (!this._refs.button) return;

    this.addEventListener('contextual-menu-link-click', (e: any) => {
      e.preventDefault();

      var newlySelected = e.detail?.node;
      if (!newlySelected) {
        this._refs.button.click();
        // console.log(1);
        return;
      }

      var contextualMenuItem = newlySelected.closest('.ms-ContextualMenu-item');

      // Maybe cancel
      if (newlySelected.classList.contains('is-disabled') || (contextualMenuItem && contextualMenuItem.classList.contains('ms-ContextualMenu-item--header'))) {
        this._refs.button.click();
        // console.log(2);
        return;
      }


      if (this.multiple !== true) {
        // Remove previous selected item
        var preSelected = this._refs.button.querySelector('.is-selected');
        if (preSelected) preSelected.classList.remove('is-selected')
      }

      newlySelected.classList.add('is-selected');
      this._value = JSON.parse(window.atob(newlySelected.parentElement.dataset.source));

      // Update UI
      if (this.multiple === true) {

      } else {
        var icon = contextualMenuItem.querySelector('.ms-Icon');
        //@ts-expect-error
        this._refs.button.icon = (icon) ? (/ms-Icon--(\w+)/.exec(icon.className))[1] : null;
        this._refs.button.label = newlySelected.textContent;

        // Close menu
        this._refs.button.click();
      }


      // Stop original event and emit own event
      e.stopPropagation();
      this.dispatchEvent(
        new CustomEvent(
          'fabric-select-change',
          { detail: { value: this._value }, bubbles: true, cancelable: true, composed: true }
        )
      );

    }, { capture: true })

  }

  private __setValue(val: any): boolean {

    if (val == null) {
      if (this._value != null) {
        this._value = null; return true;
      } else {
        return false;
      }
    }


    // value can be either number|string or an object
    // When scalar the value will be searched in id, value, text fields of options
    // When object the value will be searched by key in options
    if (typeof val == 'string' || typeof val === 'number') {

      let selected = this.options.filter((item: any) => {
        return (item.hasOwnProperty('id') && item.id === val) ||
          (item.hasOwnProperty('value') && item.value === val) ||
          (item.hasOwnProperty('text') && item.text === val)
      })

      if (selected.length === 0) {
        return false;
      } else {
        selected = selected[0];

        if (Object.is(selected, this._value)) {
          return false;
        } else {
          this._value = selected;
          return true;
        }
      }

    } else if (typeof val == 'object' && !Array.isArray(val)) {

      // Direct copy
      if (Object.is(this._value, val)) return false;

      // For now: Take first property 
      let key = Object.keys(val)[0];
      if (key == null) return false;

      let selected = this.options.filter((item: any) => {
        return (item.hasOwnProperty(key) && item[key] === val[key])
      })

      if (selected.length === 0) {
        return false;
      } else {
        selected = selected[0];
        if (Object.is(selected, this._value)) {
          return false;
        } else {
          this._value = selected;
          return true;
        }
      }


      return false;
    }

    return false;



    // // var newlySelected = this._refs.menu.

    // if (this.multiple !== true) {
    //   // Remove previous selected item
    //   var preSelected = this._refs.menu.querySelector('.is-selected');
    //   if (preSelected) preSelected.classList.remove('is-selected')
    // }

    // newlySelected.classList.add('.is-selected');

    // // Update UI
    // if (this.multiple === true) {

    // } else {
    //   var icon = contextualMenuItem.querySelector('.ms-Icon');
    //   //@ts-expect-error
    //   this._refs.button.icon = (icon) ? (/ms-Icon--(\w+)/.exec(icon.className))[1] : null;
    //   this._refs.button.label = newlySelected.textContent;

    //   // Close menu
    //   this._refs.button.click();
    // }

  }

  static get observedAttributes() {
    return ['label', 'disabled', 'required', 'multiple', 'name', 'value', 'items'];
  }

  attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null) {

    let n = newValue;
    //@ts-ignore
    if (typeof this[attr] === 'boolean') { n = this.hasAttribute(attr) }

    //@ts-ignore
    if (oldValue === n || n === this[attr]) return;
    //@ts-ignore
    this[attr] = n;
  }

  checkValidity() {

    if (this.required === true) {
      return (this.value !== '' && this.value != null);
    }

    //@ts-ignore
    return true
  }

}
window.customElements.define('fabric-select', FabricSelect);

// Set styles
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