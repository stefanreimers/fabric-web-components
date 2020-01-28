"use strict";
class FabricTextfield extends HTMLElement {

  private _modifier: string;
  private _disabled: boolean;
  private _required: boolean;
  private _readonly: boolean;
  private _label: string;
  private _placeholder: string;
  private _description: string;
  private _type: string;
  private _name: string;
  private _value: string;
  private _refs: { [index: string]: HTMLElement | HTMLInputElement | null };

  constructor() {
    super();
    this._modifier = '';
    this._disabled = false;
    this._required = false;
    this._readonly = false;
    this._label = '';
    this._placeholder = '';
    this._description = '';
    this._type = 'text';
    this._name = '';
    this._value = '';
    this._refs = {};
  }
  get modifier() { return this._modifier; }
  get disabled() { return this._disabled; }
  get required() { return this._required; }
  get readonly() { return this._readonly; }
  get label() { return this._label; }
  get placeholder() { return this._placeholder; }
  get description() { return this._description; }
  get type() { return this._type; }
  get name() { return this._name; }
  get value() { return this._value; }

  set modifier(value) { throw new RangeError('Modifier is a static property'); }
  set type(value) { throw new RangeError('Input type is a static property'); }
  set name(value) { this._name = value; this.__setProperties('name'); }
  set disabled(value) { this._disabled = !!value; this.__setProperties('disabled'); }
  set required(value) { this._required = !!value; this.__setProperties('required'); }
  set readonly(value) { this._readonly = !!value; this.__setProperties('readonly'); }
  set label(value) { this._label = value; this.__setProperties('label'); }
  set placeholder(value) { this._placeholder = value; this.__setProperties('placeholder'); }
  set description(value) { this._description = value; this.__setProperties('description'); }
  set value(newValue) { this._value = (newValue || '').toString(); this.__setProperties('value'); }

  private __setProperties(property?: string) {

    // console.log('__setProperties', property, this._refs.container);

    if (!this._refs.container)
      return;
    try {
      if (property == null || property === 'name')
        if (this._refs.input) (<HTMLInputElement>this._refs.input).name = this._name;
      if (property == null || property === 'value') {
        if (this._modifier === 'multiline') {
          if (this._refs.input) this._refs.input.textContent = this._value;
        }
        else {
          //@ts-ignore
          if (this._refs.input) this._refs.input.value = this._value;
        }
      }
      if (property == null || property === 'label')
        if (this._refs.label) this._refs.label.innerText = this._label;
      if (property == null || property === 'placeholder')
        if (this._refs.input) (<HTMLInputElement>this._refs.input).placeholder = this._placeholder;
      if (property == null || property === 'description')
        if (this._refs.description) this._refs.description.innerText = this._description;
      if (property == null || property === 'disabled') {
        if (this._refs.input) (<HTMLInputElement>this._refs.input).disabled = this._disabled;
        if (this._disabled === true) {
          this._refs.container.classList.add('is-disabled');
        }
        else {
          this._refs.container.classList.remove('is-disabled');
        }
      }
      if (property == null || property === 'required') {
        if (this._refs.input) (<HTMLInputElement>this._refs.input).required = this._required;
        if (this._required == true) {
          this._refs.container.classList.add('is-required');
        }
        else {
          this._refs.container.classList.remove('is-required');
        }
      }
      if (property == null || property === 'readonly') {
        (<HTMLInputElement>this._refs.input).readOnly = this.readonly;
        if(this.readonly === true){
          (<HTMLInputElement>this._refs.input).setAttribute('readonly', 'readonly')
        } else {
          (<HTMLInputElement>this._refs.input).removeAttribute('readonly')
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  private __setupUI() {
    this.innerHTML = this.template();
    this._refs = {
      container: this.querySelector('.ms-TextField'),
      input: this.querySelector('.ms-TextField-field'),
      label: this.querySelector('.ms-Label'),
      description: this.querySelector('.ms-TextField-description')
    };
  }
  connectedCallback() {
    this.__getStaticAttributes();
    this.__setupUI();
    this.__setProperties();
    this.__setListeners();
  }

  private __getStaticAttributes() {
    let modifier = this.getAttribute('modifier');
    if (modifier && ['multiline', 'underlined'].indexOf(modifier) > -1) {
      this._modifier = modifier;
      if (modifier === 'multiline' && (this._value == null || this._value === '')) {
        this.value = this.textContent || '';
      }
    }
    let type = this.getAttribute('type');
    if (type)
      this._type = type;
  }

  private __setListeners() {
    if (this._refs.label)
      this._refs.label.addEventListener("click", (event) => {
        if (this._refs.input) this._refs.input.focus();
      });
    if (this._refs.input)
      this._refs.input.addEventListener("input", (event) => {
        if (event.target)
          this._value = (<HTMLInputElement>event.target).value;
      });
    if (this._modifier === 'underlined' && this._refs.input) {
      this._refs.input.addEventListener("focus", (event) => {
        if (this._refs.container) this._refs.container.classList.add("is-active");
      });
      this._refs.input.addEventListener("blur", (event) => {
        if (this._refs.container) this._refs.container.classList.remove("is-active");
      });
    }
  }
  template() {
    let modifierClass = (this._modifier) ? 'ms-TextField--' + this._modifier : '';
    return `<div class="ms-TextField ${modifierClass}">
      <label class="ms-Label"></label>
      ${(this._modifier === 'multiline') ?
        '<textarea class="ms-TextField-field" name=""></textarea>' :
        '<input class="ms-TextField-field" type="' + this._type + '" name="" value="" placeholder=""/>'}
      <span class="ms-TextField-description"></span>
    </div>`;
  }

  static get observedAttributes() {
    return [
      'disabled',
      'required',
      'readonly',
      'label',
      'placeholder',
      'description',
      'name',
      'value'
    ];
  }

  attributeChangedCallback(attrName: string, oldVal: string | null, newVal: string | null) {
    // console.info('attributeChangedCallback', attrName, "@" + oldVal + "@", "@" + newVal + "@");
    if (oldVal !== newVal) {
      //@ts-ignore
      const nw = (typeof this[attrName] === 'boolean' && newVal === '') ? true : newVal;
      //@ts-ignore
      this[attrName] = nw;
    }
  }
}
customElements.define('fabric-textfield', FabricTextfield);
(function (w, d) {
  'use strict';
  let id = 'textfield';
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
    return `fabric-textfield:unresolved,
    fabric-textfield:not(:defined),
    fabric-textfield > *:not(.ms-TextField) {
      opacity: 0;
      visibility: hidden;
    }
    
    fabric-textfield .ms-TextField.ms-TextField--multiline {
      height: 100%
    }

    fabric-textfield .ms-TextField.ms-TextField--multiline label + textarea {
      height: calc(100% - 20px)
    }

    fabric-textfield .ms-TextField.ms-TextField--multiline label:empty + textarea {
      height: 100%
    }

fabric-textfield .ms-TextField {
  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  box-shadow: none;
  color: #333333;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 8px;
}

fabric-textfield .ms-TextField .ms-Label:empty,
fabric-textfield .ms-TextField .ms-Label:empty::after,
fabric-textfield .ms-TextField .ms-TextField-description:empty {
  display: none
}

fabric-textfield .ms-TextField .ms-Label {
  font-size: 14px;
  font-weight: 600;
  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

fabric-textfield .ms-TextField.is-disabled .ms-TextField-field {
  background-color: #f4f4f4;
  border-color: #f4f4f4;
  pointer-events: none;
  cursor: default;
}

fabric-textfield .ms-TextField.is-disabled::-webkit-input-placeholder {
  color: #a6a6a6;
}

fabric-textfield .ms-TextField.is-disabled::-moz-placeholder {
  color: #a6a6a6;
}

fabric-textfield .ms-TextField.is-disabled:-moz-placeholder {
  color: #a6a6a6;
}

fabric-textfield .ms-TextField.is-disabled:-ms-input-placeholder {
  color: #a6a6a6;
}

fabric-textfield .ms-TextField-field[readonly]{
  background: #fafafa;
}

fabric-textfield[required] .ms-Label::after {
  content: ' *';
  color: #a80000;
} 
fabric-textfield .ms-TextField.is-required .ms-Label::after {
  content: ' *';
  color: #a80000;
}
.ms-TextField.is-required::-webkit-input-placeholder::after {
  content: ' *';
  color: #a80000;
}
.ms-TextField.is-required::-moz-placeholder::after {
  content: ' *';
  color: #a80000;
}
.ms-TextField.is-required:-moz-placeholder::after {
  content: ' *';
  color: #a80000;
}
.ms-TextField.is-required:-ms-input-placeholder::after {
  content: ' *';
  color: #a80000;
}

.ms-TextField.is-active {
  border-color: #0078d7;
}

.ms-TextField-field {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  box-shadow: none;
  border: 1px solid #c8c8c8;
  border-radius: 0;
  font-weight: 300;
  font-size: 14px;
  color: #333333;
  height: 32px;
  padding: 6px 12px;
  width: 100%;
  min-width: 180px;
  outline: 0;
  text-overflow: ellipsis;
}

.ms-TextField-field:hover {
  border-color: #767676;
}

.ms-TextField-field:focus {
  border-color: #0078d7;
}

@media screen and (-ms-high-contrast: active) {
  .ms-TextField-field:hover,
  .ms-TextField-field:focus {
    border-color: #1aebff;
  }
}

@media screen and (-ms-high-contrast: black-on-white) {
  .ms-TextField-field:hover,
  .ms-TextField-field:focus {
    border-color: #37006e;
  }
}

.ms-TextField-field[disabled] {
  background-color: #f4f4f4;
  border-color: #f4f4f4;
  pointer-events: none;
  cursor: default;
}

.ms-TextField-field::-webkit-input-placeholder {
  color: #666666;
}

.ms-TextField-field::-moz-placeholder {
  color: #666666;
}

.ms-TextField-field:-moz-placeholder {
  color: #666666;
}

.ms-TextField-field:-ms-input-placeholder {
  color: #666666;
}

.ms-TextField-description {
  color: #767676;
  font-size: 11px;
}

.ms-TextField.ms-TextField--placeholder {
  position: relative;
  background-color: #ffffff;
}

.ms-TextField.ms-TextField--placeholder .ms-TextField-field {
  position: relative;
  background-color: transparent;
  z-index: 5;
}

.ms-TextField.ms-TextField--placeholder .ms-Label {
  position: absolute;
  font-weight: 300;
  font-size: 14px;
  color: #666666;
  padding: 6px 12px 7px;
  pointer-events: none;
  z-index: 0;
}

.ms-TextField.ms-TextField--placeholder.is-disabled {
  color: #a6a6a6;
}

.ms-TextField.ms-TextField--placeholder.is-disabled .ms-Label {
  color: #a6a6a6;
}

.ms-TextField.ms-TextField--underlined {
  border-bottom: 1px solid #c8c8c8;
  display: table;
  width: 100%;
  min-width: 180px;
}

.ms-TextField.ms-TextField--underlined:hover {
  border-color: #767676;
}

@media screen and (-ms-high-contrast: active) {
  .ms-TextField.ms-TextField--underlined:hover {
    border-color: #1aebff;
  }
}

@media screen and (-ms-high-contrast: black-on-white) {
  .ms-TextField.ms-TextField--underlined:hover {
    border-color: #37006e;
  }
}

.ms-TextField.ms-TextField--underlined:active,
.ms-TextField.ms-TextField--underlined:focus {
  border-color: #0078d7;
}

.ms-TextField.ms-TextField--underlined .ms-Label {
  font-size: 14px;
  margin-right: 8px;
  display: table-cell;
  vertical-align: top;
  padding-left: 12px;
  padding-top: 9px;
  height: 32px;
  width: 1%;
  white-space: nowrap;
}

.ms-TextField.ms-TextField--underlined .ms-TextField-field {
  border: 0;
  float: left;
  display: table-cell;
  text-align: left;
  padding-top: 8px;
  padding-bottom: 3px;
}

.ms-TextField.ms-TextField--underlined .ms-TextField-field:active,
.ms-TextField.ms-TextField--underlined .ms-TextField-field:focus,
.ms-TextField.ms-TextField--underlined .ms-TextField-field:hover {
  outline: 0;
}

.ms-TextField.ms-TextField--underlined.is-disabled {
  border-bottom-color: #eaeaea;
}

.ms-TextField.ms-TextField--underlined.is-disabled .ms-Label {
  color: #a6a6a6;
}

.ms-TextField.ms-TextField--underlined.is-disabled .ms-TextField-field {
  background-color: transparent;
  color: #a6a6a6;
}

.ms-TextField.ms-TextField--underlined.is-active {
  border-color: #0078d7;
}

@media screen and (-ms-high-contrast: active) {
  .ms-TextField.ms-TextField--underlined.is-active {
    border-color: #1aebff;
  }
}

@media screen and (-ms-high-contrast: black-on-white) {
  .ms-TextField.ms-TextField--underlined.is-active {
    border-color: #37006e;
  }
}

.ms-TextField.ms-TextField--multiline .ms-TextField-field {
  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #666666;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  min-height: 60px;
  min-width: 260px;
  padding-top: 6px;
  overflow: auto;
}`;
  }
}(window, document));
