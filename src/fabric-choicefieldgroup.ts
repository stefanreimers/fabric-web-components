class FabricChoiceFieldGroup extends HTMLElement {

  private _label: string = '';
  private _name: string = '';
  private _refs: { [index: string]: any } = {};
  private _form: any = '';

  private _disabled: boolean = false;
  private _required: boolean = false;

  get disabled() { return this._disabled || false }
  get required() { return this._required || false }
  get label() { return this._label }
  get name() { return this._name }
  get form() { return this._form }
  get value() {
    var radios = this.querySelectorAll('fabric-radiobutton[name="' + this.name + '"]');
    var selected = null;
    if (radios && radios.length > 0) {
      [].forEach.call(radios, (radio: HTMLInputElement) => {
        //@ts-ignore
        if (radio.checked === true) selected = radio.label;
      });
    }
    return selected;
  }


  set disabled(value) { if (!!value === this._disabled) return; this._disabled = !!value; this.__setProperties('disabled') }
  set required(value) { if (!!value === this._required) return; this._required = !!value; this.__setProperties('required') }
  set label(value) { if (value === this._label) return; this._label = value; this.__setProperties('label') }
  set form(value) { if (value === this._form) return; this._form = value; this.__setProperties('form') }
  set name(value) { if (value === this._name) return; this._name = value; }
  set value(val) { this.__setProperties('value') }

  connectedCallback() {

    this.__setupUI();
    this.__setProperties();
    this.__addListeners();
  }

  private __setupUI() {

    let markup = `<div class="ms-ChoiceFieldGroup" role="radiogroup">
			  <div class="ms-ChoiceFieldGroup-title">
				<label class="ms-Label"></label>
			  </div>
			<ul class="ms-ChoiceFieldGroup-list">
			</ul>
			</div>`;

    var fragment = document.createElement('DIV');
    fragment.innerHTML = markup;

    // Move current nodes
    var radios = this.querySelectorAll('fabric-radiobutton[name="' + this.name + '"]');
    if (radios && radios.length > 0) {
      var list = fragment.querySelector('.ms-ChoiceFieldGroup-list');
      [].forEach.call(radios, (radio: FabricRadioButton) => {
        list && list.appendChild(radio);
      });
    }

    this.innerHTML = fragment.innerHTML;

    this._refs = {
      container: this.querySelector('.ms-ChoiceFieldGroup'),
      label: this.querySelector('.ms-ChoiceFieldGroup-title > .ms-Label'),
      list: this.querySelector('.ms-ChoiceFieldGroup-list')
    }
  }

  private __addListeners() {
    this._refs.list.addEventListener("fabricRadioSelect", this._onChangeHandler.bind(this), false);
  }

  private _onChangeHandler(event: CustomEvent) {
    let name = event.detail.name;
    let selectedChoice = event.detail.item;
    if (this.name === name) {

      var _choiceFieldComponents = this._refs.list.querySelectorAll('fabric-radiobutton[name="' + this.name + '"]');
      if (!_choiceFieldComponents || _choiceFieldComponents.length === 0) return;

      [].forEach.call(_choiceFieldComponents, (item: FabricRadioButton) => {
        if (item === selectedChoice) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });

    }
  }

  private __setProperties(property?: string) {

    if (!this._refs.container) return;

    if (property == null || property === 'disabled') {

      var radios = this.querySelectorAll('fabric-radiobutton[name="' + this.name + '"]');
      if (radios && radios.length > 0) {
        [].forEach.call(radios, (radio: FabricRadioButton) => {
          radio.disabled = this.disabled;
        });
      }
    }

    if (property == null || property === 'required') {
      this._refs.label.classList[(!!this._required) ? 'add' : 'remove']('is-required');
    }

    if (property == null || property === 'label') { this._refs.label.textContent = this._label || ''; }

    if (property == null || property === 'form') {
      if (this._form != null && this._form !== '') {
        this.setAttribute('form', this._form);
      } else {
        this.removeAttribute('form');
      }
    }

  }

  static get observedAttributes() {
    return ['disabled', 'requried', 'label', 'name', 'form'];
  }

  attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null) {

    // Gather boolean properties
    if (['disabled', 'required'].indexOf(attr) !== -1) {
      //@ts-ignore
      newValue = this.hasAttribute(attr);
    }
    //@ts-ignore
    if (oldValue === newValue || newValue === this[attr]) return;
    //@ts-ignore
    this[attr] = newValue;
  }

  checkValidity() {
    return (!(this.required && this.value === null));
  }

}
window.customElements.define('fabric-choicefieldgroup', FabricChoiceFieldGroup);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `.ms-ChoiceFieldGroup{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;margin-bottom:4px}
.ms-ChoiceFieldGroup .ms-ChoiceFieldGroup-list{padding:0;margin:0;list-style:none}`;
  d.head.appendChild(style);
})(window, document);