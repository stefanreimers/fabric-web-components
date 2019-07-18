class FabricMultiSelect extends HTMLElement {

  private _refs: { [index: string]: any };
  private _disabled: boolean = false;
  private _required: boolean = false;

  private _value: any[];
  private _options: any[];
  private _label: string = '';

  constructor() {
    super();
    this._refs = {};

    this._value = [];
    this._options = [];

  }

  get disabled() { return this._disabled; }
  set disabled(value) { if (this._disabled === value) return; this._disabled = !!value; this.__setProperties('disabled'); }

  get required() { return this._required; }
  set required(value) { if (this._required === value) return; this._required = !!value; this.__setProperties('required'); }


  get value() { return this._value || [] }
  //@ts-ignore
  set value(value) { value = [].concat(value); if (value.sort().join(',') === this._value.sort().join(',')) return; this._value = value; this.__setProperties('value') }

  get options() { return this._options || [] }
  set options(value) { this._options = value; this.__setProperties('options'); }

  get label() { return this._label }
  set label(value) { if (value === this._label) return; this._label = value; this.__setProperties('label'); }

  connectedCallback() {

    this.__setupUI();
    this.__setProperties();
    this.__addListeners();

  }

  private __setupUI() {

    let markup = `<div class="ms-MultiSelect" tabindex="0">
			<label class="ms-Label"></label>
			<div class="ms-MultiSelect--container flex-container">
				<fabric-table  modifier="selectable" columns='[{\"id\":\"value\",\"label\":\"Selected\"}]' rowid="value" itemheight="20" class="ms-MultiSelect--selected stretch"></fabric-table>
				<ul class="ms-MultiSelect--controls flex-container vertical">
					<li><button data-action="select-all">&lt;&lt;</button></li>
					<li><button data-action="select">&lt;</button></li>
					<li><button data-action="unselect">&gt;</button></li>
					<li><button data-action="unselect-all">&gt;&gt;</button></li>
				</ul>
				<fabric-table modifier="selectable" columns='[{\"id\":\"value\",\"label\":\"Selectable\"}]' rowid="value" itemheight="20" class="ms-MultiSelect--selectable stretch"></fabric-table>
			</div>
			</div>`;

    // Move predefined options to new markup
    if (this.children && this.children.length > 0) {

      let options = [];
      let value = [];

      while (this.children.length > 0) {

        // Check conditions - remove non-matching children
        if (this.children[0].tagName.toLowerCase() === 'option') {

          // Move child to options
          //@ts-ignore
          options.push({ id: this.children[0].value || this.children[0].label || this.children[0].textContent, value: this.children[0].textContent })
          //@ts-ignore
          if (this.children[0].hasAttribute('selected')) value.push(this.children[0].value || this.children[0].label || this.children[0].textContent);

        }

        this.removeChild(this.children[0]);
      }

      if (options.length > 0) this._options = options;
      if (value.length > 0) this._value = value;

    }

    // Create new markup
    this.innerHTML = markup;

    // Update references
    this._refs = {
      container: this.querySelector('.ms-MultiSelect--container'),
      label: this.querySelector('label'),
      selected: this.querySelector('.ms-MultiSelect--selected'),
      selectable: this.querySelector('.ms-MultiSelect--selectable'),
      controls: this.querySelector('.ms-MultiSelect--controls')
    }

  }

  private __setProperties(property?: string) {

    if (!this._refs || !this._refs.container) return;

    if (property == null || property === 'disabled') {
      this._refs.container.classList[(this._disabled) ? 'add' : 'remove']('is-disabled');
    }

    if (property == null || property === 'label') {
      this._refs.label.textContent = this._label || ''
    }

    if (property == null || property === 'options' || property === 'value') {
      this._refs.selectable.items = (this._options || []).filter(option => this._value.indexOf(option.id) === -1)
      this._refs.selected.items = (this._options || []).filter(option => this._value.indexOf(option.id) !== -1)
    }

  }

  private __addListeners() {

    if (this._refs.controls)

      this._refs.controls.addEventListener('click', (e: MouseEvent) => {

        //@ts-ignore
        if (e.target && e.target.tagName === 'BUTTON') {

          // console.log('onControlClick', e, e.target.dataset.action)

          //@ts-ignore
          switch (e.target.dataset.action) {

            case 'select-all':
              this.value = this.options.map(o => o.value)
              break;
            case 'select':
              let toSelect = this._refs.selectable.selected;
              if (toSelect && toSelect.length > 0) this.value = this.value.concat(toSelect)
              break;
            case 'unselect':
              let toDeselect = this._refs.selected.selected;
              if (toDeselect && toDeselect.length > 0) {
                //@ts-ignore
                let value = [].concat(this.value);
                //@ts-ignore
                toDeselect.forEach(element => {
                  let position = value.indexOf(element);
                  if (position !== -1) value.splice(position, 1)
                });
                this.value = value;
              }
              break;
            case 'unselect-all':
              this.value = [];
              break;

          }

        }

      })

  }


  checkValidity() {
    return (this.required === true) ? this.value.length > 0 : true;
  }

  static get observedAttributes() {
    return ['label', 'value', 'disabled', 'required'];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    // console.log('attributeChangedCallback', attr, oldValue, newValue);

    let n: string | string[] = (attr === 'value') ? newValue.split(',') : newValue;

    //@ts-ignore
    if (typeof this[attr] === 'boolean') { n = this.hasAttribute(attr) }

    //@ts-ignore
    if (oldValue === n || n === this[attr]) return;
    //@ts-ignore
    this[attr] = n;
  }

}
window.customElements.define('fabric-multiselect', FabricMultiSelect);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `fabric-multiselect  { 
	display: inline-block;
	font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;
	height: 250px;
}

fabric-multiselect .flex-container {
	display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;	
    flex-direction: row;
    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-content: stretch;
    -ms-flex-line-pack: stretch;
    align-content: stretch;
    -webkit-align-items: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
}
fabric-multiselect .flex-container.vertical{
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}

fabric-multiselect .flex-container > * {
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
}
fabric-multiselect .flex-container > *.stretch {
	flex: 1 1 auto;
} 

fabric-multiselect .ms-MultiSelect--controls{
	margin: 5px;
	padding: 0px;
	width: 50px;
	list-style-type: none
}

fabric-multiselect .ms-MultiSelect{
	height: 100%
}
fabric-multiselect .ms-MultiSelect--container{
	height: calc(100% - 25px)
}

.ms-MultiSelect .ms-Label {
    display: inline-block;
    margin-bottom: 8px;
    font-size: 12px;
}

.ms-MultiSelect fabric-table {
	box-sizing: border-box;
	border: 1px solid #eaeaea
}

.ms-MultiSelect--controls li {
	text-align:center
}
.ms-MultiSelect--controls button {
	background: none;
	border: 0;
	color: #666666;
	font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;
}
`;

  d.head.appendChild(style);
})(window, document);