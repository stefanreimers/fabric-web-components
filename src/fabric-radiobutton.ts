class FabricRadioButton extends HTMLElement {

  private _label: string = '';
  private _name: string = '';
  private _refs: { [index: string]: any } = {};

  private _disabled: boolean = false;
  private _checked: boolean = false;

  get disabled() { return this._disabled || false }
  get checked() { return this._checked || false }
  get label() { return this._label }
  get name() { return this._name }
  get value() { return this.checked }


  set disabled(value) { if (!!value === this._disabled) return; this._disabled = !!value; this.__setProperties('disabled') }
  set checked(value) { if (!!value === this._checked) return; this._checked = !!value; this.__setProperties('checked') }
  set label(value) { if (value === this._label) return; this._label = value; this.__setProperties('label') }
  set name(value) { if (value === this._name) return; this._name = value; this.__setProperties('name') }
  set value(val) { if (val === this.value || this.disabled) return; this._checked = val; this.__setProperties('checked') }

  connectedCallback() {

    this.__setupUI();
    this.__setProperties();
    this.__addListeners();
  }

  private __setupUI() {

    let markup = `<li class="ms-RadioButton"> 
		  <input tabindex="-1" type="radio" class="ms-RadioButton-input">
		  <label role="radio"
			class="ms-RadioButton-field"
			tabindex="0"
			aria-checked="{{props.checked}}"
			name=""
			aria-disabled="false">
			<span class="ms-Label"></span>
		  </label>
		</li>`;

    this.innerHTML = markup;

    this._refs = {
      container: this.querySelector('.ms-RadioButton'),
      input: this.querySelector('.ms-RadioButton-input'),
      field: this.querySelector('.ms-RadioButton-field'),
      label: this.querySelector('.ms-RadioButton-field > .ms-Label')
    }
  }

  private __addListeners() {
    this._refs.field.addEventListener("focus", this._onFocusHandler.bind(this), false);
    this._refs.field.addEventListener("blur", this.__onBlurHandler.bind(this), false);
    this._refs.field.addEventListener("click", this.__onClickHandler.bind(this), false);
    this._refs.field.addEventListener("keydown", this.__onKeydownHandler.bind(this), false);
  }


  private _onFocusHandler() {
    this._refs.field.classList.add("in-focus");
  }

  __onBlurHandler() {
    this._refs.field.classList.remove("in-focus");
  }

  private __onClickHandler(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (!this._disabled) {
      this._dispatchSelectEvent();
    }
  }

  private __onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      event.stopPropagation();
      event.preventDefault();
      if (!this._disabled) {
        this._dispatchSelectEvent();
      }
    }
  }

  private _dispatchSelectEvent() {
    let objDict = {
      bubbles: true,
      cancelable: true,
      detail: {
        name: this.name,
        item: this
      }
    };
    this.dispatchEvent(new CustomEvent("fabricRadioSelect", objDict));
  }

  private __setProperties(property?: string) {

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

  }

  static get observedAttributes() {
    return ['disabled', 'checked', 'label', 'name'];
  }

  attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null) {

    // Gather boolean properties
    if (['disabled', 'checked'].indexOf(attr) !== -1) {
      //@ts-ignore
      newValue = this.hasAttribute(attr);
    }

    //@ts-ignore
    if (oldValue === newValue || newValue === this[attr]) return;
    //@ts-ignore
    this[attr] = newValue;
  }

}
window.customElements.define('fabric-radiobutton', FabricRadioButton);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `.ms-RadioButton{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;color:#333;font-size:14px;font-weight:400;min-height:36px;position:relative}
.ms-RadioButton .ms-Label{font-size:14px;padding:0 0 0 26px;cursor:pointer;display:inline-block}
.ms-RadioButton-input{position:absolute;opacity:0}
.ms-RadioButton-field:before{content:"";display:inline-block;border:2px solid #a6a6a6;width:20px;height:20px;cursor:pointer;font-weight:400;position:absolute;box-sizing:border-box;transition-property:border-color;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.23,1);border-radius:50%}
.ms-RadioButton-field:after{content:"";width:0;height:0;border-radius:50%;position:absolute;top:8px;left:8px;bottom:0;right:0;transition-property:top,left,width,height;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.23,1);box-sizing:border-box}
@media screen and (-ms-high-contrast:active){.ms-RadioButton-field:after{color:#0f0}}
@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field:after{color:#600000}}
.ms-RadioButton-field{display:inline-block;cursor:pointer;margin-top:8px;position:relative;outline:0;vertical-align:top}
.ms-RadioButton-field:focus:before,.ms-RadioButton-field:hover:before{border-color:#767676}
.ms-RadioButton-field:focus .ms-Label,.ms-RadioButton-field:hover .ms-Label{color:#000}
.ms-RadioButton-field.is-disabled{cursor:default}
.ms-RadioButton-field.is-disabled:before{background-color:#c8c8c8;border-color:#c8c8c8;color:#c8c8c8}
@media screen and (-ms-high-contrast:active){.ms-RadioButton-field.is-disabled:before{border-color:#0f0}}
@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field.is-disabled:before{border-color:#600000}}
.ms-RadioButton-field.is-disabled .ms-Label{color:#a6a6a6}
@media screen and (-ms-high-contrast:active){.ms-RadioButton-field.is-disabled .ms-Label{color:#0f0}}
@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field.is-disabled .ms-Label{color:#600000}}
.ms-RadioButton-field.is-disabled:focus:before,.ms-RadioButton-field.is-disabled:hover:before{border-color:#c8c8c8}
.ms-RadioButton-field.in-focus:before{border-color:#767676}
.ms-RadioButton-field.is-checked:before{border:2px solid #0078d7;background-color:transparent}
@media screen and (-ms-high-contrast:active){.ms-RadioButton-field.is-checked:before{border-color:#1aebff}}
@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field.is-checked:before{border-color:#37006e}}
.ms-RadioButton-field.is-checked:after{background-color:#0078d7;top:5px;left:5px;width:10px;height:10px}
@media screen and (-ms-high-contrast:active){.ms-RadioButton-field.is-checked:after{background-color:#1aebff}}
@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field.is-checked:after{background-color:#37006e}}
.ms-RadioButton-field.is-checked.in-focus:before,.ms-RadioButton-field.is-checked:focus:before,.ms-RadioButton-field.is-checked:hover:before{border-color:#0078d7}`;
  d.head.appendChild(style);
})(window, document);