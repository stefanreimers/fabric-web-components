class FabricCheckbox extends HTMLElement {

  private _label: string;
  private _name: string;
  private _refs: { [index: string]: any };
  private _form: any;
  private _value: string;
  private _disabled: boolean;
  private _checked: boolean;

  constructor() {
    super();

    this._label = '';
    this._name = '';
    this._refs = {};
    this._form = '';
    this._value = 'on';
    this._disabled = false;
    this._checked = false;
  }

  get disabled() { return this._disabled || false }
  get checked() { return this._checked || false }
  get label() { return this._label }
  get name() { return this._name }
  get form() { return this._form }
  get value() { return this._value }


  set disabled(value) { if (!!value === this._disabled) return; this._disabled = !!value; this.__setProperties('disabled') }
  set checked(value) { if (!!value === this._checked) return; this._checked = !!value; this.__setProperties('checked') }
  set label(value) { if (value === this._label) return; this._label = value; this.__setProperties('label') }
  set name(value) { if (value === this._name) return; this._name = value; this.__setProperties('name') }
  set form(value) { if (value === this._form) return; this._form = value; this.__setProperties('form') }
  set value(val) { if (val === this.value || this.disabled) return; this._value = val; this.__setProperties('value') }

  connectedCallback() {

    this.__setupUI();
    this.__setProperties();
    this.__addListeners();
  }

  private __setupUI() {


    let markup = `<div class="ms-CheckBox"> 
		  <input tabindex="-1" type="checkbox" class="ms-CheckBox-input">
		  <label class="ms-CheckBox-field"
			tabindex="0"
			aria-checked="false"
			name=""
			aria-disabled="false">
			<span class="ms-Label"></span>
		  </label>
		</div>`;

    this.innerHTML = markup;

    this._refs = {
      container: this.querySelector('.ms-CheckBox'),
      input: this.querySelector('.ms-CheckBox-input'),
      field: this.querySelector('.ms-CheckBox-field'),
      label: this.querySelector('.ms-CheckBox-field > .ms-Label')
    }
  }

  private __addListeners() {

    if (this._refs.field) {

      this._refs.field.addEventListener("focus", this._onFocusHandler.bind(this), false);
      this._refs.field.addEventListener("blur", this.__onBlurHandler.bind(this), false);
      //@ts-ignore
      this._refs.field.addEventListener("click", this.__onClickHandler.bind(this), false);
      this._refs.field.addEventListener("keydown", this.__onKeydownHandler.bind(this), false);

    }
  }


  private _onFocusHandler() {
    if (this._refs.field) this._refs.field.classList.add("in-focus");
  }

  private __onBlurHandler() {
    if (this._refs.field) this._refs.field.classList.remove("in-focus");
  }

  private __onClickHandler(event: PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (!this._disabled) {
      this.toggle();
    }
  }

  private __onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      event.stopPropagation();
      event.preventDefault();
      if (!this._disabled) {
        this.toggle();
      }
    }
  }

  toggle() {
    if (!this._disabled) this.checked = !this.checked;
  }

  __setProperties(property?: string) {

    if (!this._refs.container) return;

    if (property == null || property === 'disabled') {
      this._refs.input.disabled = !!this._disabled;
      this._refs.field.classList[(!!this._disabled) ? 'add' : 'remove']('is-disabled');
      this._refs.field.setAttribute('aria-disabled', (!!this._disabled) ? 'true' : 'false');
    }

    if (property == null || property === 'checked') {
      this._refs.input.checked = !!this._checked;
      this._refs.field.classList[(!!this._checked) ? 'add' : 'remove']('is-checked');
      this._refs.field.setAttribute('aria-checked', (!!this._checked) ? 'true' : 'false');
    }

    if (property == null || property === 'label') { this._refs.label.textContent = this._label || ''; }
    if (property == null || property === 'name') { this._refs.field.name = this._name || ''; }

    if (property == null || property === 'name') { this._refs.input.value = this._value || ''; }

    if (property == null || property === 'form') {
      if (this._form != null && this._form !== '') {
        this.setAttribute('form', this._form);
      } else {
        this.removeAttribute('form');
      }
    }

  }

  static get observedAttributes() {
    return ['disabled', 'checked', 'label', 'name', 'form', 'value'];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: any) {

    // Gather boolean properties
    if (['disabled', 'checked'].indexOf(attr) !== -1) {
      newValue = this.hasAttribute(attr);
    }

    //@ts-ignore
    if (oldValue === newValue || newValue === this[attr]) return;
    //@ts-ignore
    this[attr] = newValue;
  }

  checkValidity() {
    return (this._refs.input) ? (<HTMLInputElement>this._refs.input).checkValidity() : false;
  }

}
window.customElements.define('fabric-checkbox', FabricCheckbox);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `.ms-CheckBox{box-sizing:border-box;color:#333;font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;font-size:14px;font-weight:400;min-height:36px;position:relative}
.ms-CheckBox .ms-Label{font-size:14px;padding:0 0 0 26px;cursor:pointer;display:inline-block}
.ms-CheckBox-input{position:absolute;opacity:0}
.ms-CheckBox-field:before{content:"";display:inline-block;border:2px solid #a6a6a6;width:20px;height:20px;cursor:pointer;font-weight:400;position:absolute;box-sizing:border-box;transition-property:background,border,border-color;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.23,1)}
.ms-CheckBox-field:after{content:"✓";display:none;position:absolute;font-weight:900;background-color:transparent;font-size:14px;top:0;color:#fff;line-height:20px;width:20px;text-align:center}
@media screen and (-ms-high-contrast:active){.ms-CheckBox-field:after{color:#000}}
@media screen and (-ms-high-contrast:black-on-white){.ms-CheckBox-field:after{color:#fff}}
.ms-CheckBox-field{display:inline-block;cursor:pointer;margin-top:8px;position:relative;outline:0;vertical-align:top}
.ms-CheckBox-field:focus:before,.ms-CheckBox-field:hover:before{border-color:#767676}
.ms-CheckBox-field:focus .ms-Label,.ms-CheckBox-field:hover .ms-Label{color:#000}
.ms-CheckBox-field.is-disabled{cursor:default}
.ms-CheckBox-field.is-disabled:before{background-color:#c8c8c8;border-color:#c8c8c8;color:#c8c8c8}
@media screen and (-ms-high-contrast:active){.ms-CheckBox-field.is-disabled:before{border-color:#0f0}}
@media screen and (-ms-high-contrast:black-on-white){.ms-CheckBox-field.is-disabled:before{border-color:#600000}}
.ms-CheckBox-field.is-disabled .ms-Label{color:#a6a6a6}
@media screen and (-ms-high-contrast:active){.ms-CheckBox-field.is-disabled .ms-Label{color:#0f0}}
@media screen and (-ms-high-contrast:black-on-white){.ms-CheckBox-field.is-disabled .ms-Label{color:#600000}}
.ms-CheckBox-field.in-focus:before{border-color:#767676}
.ms-CheckBox-field.in-focus.is-disabled:before{border-color:#c8c8c8}
.ms-CheckBox-field.in-focus.is-checked:before{border-color:#106ebe}
.ms-CheckBox-field.is-checked:before{border:10px solid #0078d7;background-color:#0078d7}
@media screen and (-ms-high-contrast:active){.ms-CheckBox-field.is-checked:before{border-color:#1aebff}
}
@media screen and (-ms-high-contrast:black-on-white){.ms-CheckBox-field.is-checked:before{border-color:#37006e}
}
.ms-CheckBox-field.is-checked:after{display:block}
.ms-CheckBox-field.is-checked:focus:before,.ms-CheckBox-field.is-checked:hover:before{border-color:#106ebe}`;
  d.head.appendChild(style);
})(window, document);