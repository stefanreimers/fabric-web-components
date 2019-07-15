class FabricButton extends HTMLElement {

  private _modifier: any;
  private _disabled: boolean;
  private _label: string;
  private _icon: string;
  private _description: string;
  private _refs: { [index: string]: HTMLElement | null };

  constructor() {
    super();

    this._modifier = null;
    this._disabled = false;
    this._label = '';
    this._icon = '';
    this._description = '';

    this._refs = {};

  }

  get modifier() { return this._modifier }
  get disabled() { return this._disabled }
  get label() { return this._label }
  get icon() { return this._icon }
  get description() { return this._description }

  set modifier(value) { throw new RangeError('The modifier property is static.') }
  set disabled(value) { if (!!value === this._disabled) return; this._disabled = !!value; this.__setProperties('disabled') }
  set label(value) { if (value === this._label) return; this._label = value; this.__setProperties('label') }
  set icon(value) { if (value === this._icon) return; this._icon = value; this.__setProperties('icon') }
  set description(value) { if (value === this._description) return; this._description = value; this.__setProperties('description') }

  connectedCallback() {

    this.getStaticAttributes();
    this.__deriveLabelFromText();
    this.__setupUI();
    this.__setProperties();
  }

  private __setupUI() {

    // Define static properties
    let modifier = (this._modifier) ? 'ms-Button--' + this._modifier : '';

    let markup = `<button class="ms-Button ${modifier}">
			<span class="ms-Button-icon"><i class="ms-Icon"></i></span>
			<span class="ms-Button-label"></span>
			<span class="ms-Button-description"></span>
		</button>`;

    this.innerHTML = markup;

    this._refs = {
      container: this.querySelector('.ms-Button'),
      icon: this.querySelector('.ms-Button-icon > .ms-Icon'),
      label: this.querySelector('.ms-Button-label'),
      description: this.querySelector('.ms-Button-description')
    }
  }

  private __deriveLabelFromText() {
    if ((this._label == null || this._label === '') && this.textContent)
      this.label = this.textContent;
  }

  private __setProperties(property?: string) {

    if (!this._refs.container) return;

    if (property == null || property === 'disabled') { (<HTMLButtonElement>this._refs.container).disabled = !!this._disabled }
    if (property == null || property === 'label') {

      // For use in CommandBar add noLabel class to container
      if (this._label == null || this.label === '') {
        this._refs.container.classList.add('ms-Button--noLabel');
      } else {
        this._refs.container.classList.remove('ms-Button--noLabel');
      }

      if (this._refs.label) this._refs.label.textContent = this._label || '';

    }

    if (property == null || property === 'description') { if (this._refs.description) this._refs.description.textContent = this._description || '' }

    if (property == null || property === 'icon') {

      if (this._icon == null || this._icon === '') {
        this._refs.container.classList.add('ms-Button--noIcon');
      } else {
        this._refs.container.classList.remove('ms-Button--noIcon');
      }

      if (this._refs.icon) this._refs.icon.className = 'ms-Icon ' + (this._icon == null || this._icon === '') ? '' : 'ms-Icon--' + this._icon;

    }

  }

  getStaticAttributes() {
    let modifier = this.getAttribute('modifier');
    if (modifier && ['primary', 'hero', 'compound', 'small'].indexOf(modifier) !== -1) this._modifier = modifier;
  }

  static get observedAttributes() {
    return ['disabled', 'label', 'icon', 'description'];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    // console.log('attributeChangedCallback', attr, oldValue, newValue);

    let n = newValue;
    //@ts-ignore
    if (typeof this[attr] === 'boolean') { n = this.hasAttribute(attr) }

    //@ts-ignore
    if (oldValue === n || n === this[attr]) return;
    //@ts-ignore
    this[attr] = n;
  }

}
window.customElements.define('fabric-button', FabricButton);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `.ms-Button{box-sizing:border-box;margin:0;padding:0;box-shadow:none;font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;color:#333;font-size:14px;font-weight:400;background-color:#f4f4f4;border:1px solid #f4f4f4;cursor:pointer;display:inline-block;height:32px;min-width:80px;padding:4px 20px 6px}
.ms-Button.is-hidden, .ms-Button.ms-Button--noIcon .ms-Button-icon {display:none}
.ms-Button:hover{background-color:#eaeaea;border-color:#eaeaea}
.ms-Button:hover .ms-Button-label{color:#000}
@media screen and (-ms-high-contrast:active){.ms-Button:hover{color:#1aebff;border-color:#1aebff} }
@media screen and (-ms-high-contrast:black-on-white){.ms-Button:hover{color:#37006e;border-color:#37006e} }
.ms-Button:focus{background-color:#eaeaea;border-color:#0078d7;outline:1px solid transparent}
.ms-Button:focus .ms-Button-label{color:#000}
.ms-Button:active{background-color:#0078d7;border-color:#0078d7}
.ms-Button:active .ms-Button-label{color:#fff}
.ms-Button.is-disabled,.ms-Button:disabled{background-color:#f4f4f4;border-color:#f4f4f4;cursor:default}
.ms-Button.is-disabled .ms-Button-label,.ms-Button:disabled .ms-Button-label{color:#a6a6a6}
.ms-Button.is-disabled:focus,.ms-Button.is-disabled:hover,.ms-Button:disabled:focus,.ms-Button:disabled:hover{outline:0}
.ms-Button-label{color:#333;font-weight:600;font-size:14px}
.ms-Button-description,.ms-Button-icon{display:none}
.ms-Button.ms-Button--primary{background-color:#0078d7;border-color:#0078d7}
.ms-Button.ms-Button--primary .ms-Button-label{color:#fff}
.ms-Button.ms-Button--primary:hover{background-color:#005a9e;border-color:#005a9e}
.ms-Button.ms-Button--primary:focus{background-color:#005a9e;border-color:#004578}
.ms-Button.ms-Button--primary:active{background-color:#0078d7;border-color:#0078d7}
.ms-Button.ms-Button--primary.is-disabled,.ms-Button.ms-Button--primary:disabled{background-color:#f4f4f4;border-color:#f4f4f4}
.ms-Button.ms-Button--primary.is-disabled .ms-Button-label,.ms-Button.ms-Button--primary:disabled .ms-Button-label{color:#a6a6a6}
.ms-Button.ms-Button--small{min-width:60px;min-height:24px;height:auto;padding-top:0;padding-bottom:4px}
.ms-Button.ms-Button--small .ms-Button-label{font-weight:400;font-size:12px}
.ms-Button.ms-Button--hero{-ms-flex-align:center;align-items:center;background-color:transparent;border:0;padding:0;position:relative}
.ms-Button.ms-Button--hero .ms-Button-icon{color:#0078d7;display:inline-block;font-size:12px;margin-right:4px;padding-top:5px;text-align:center}
.ms-Button.ms-Button--hero .ms-Button-icon .ms-Icon{border-radius:18px;border:1px solid #0078d7;font-size:12px;height:18px;line-height:18px;width:18px}
.ms-Button.ms-Button--hero .ms-Button-label{color:#0078d7;font-size:21px;font-weight:100;position:relative;text-decoration:none;vertical-align:top}
.ms-Button.ms-Button--hero:focus .ms-Button-icon,.ms-Button.ms-Button--hero:hover .ms-Button-icon{color:#005a9e}
.ms-Button.ms-Button--hero:focus .ms-Button-icon .ms-Icon,.ms-Button.ms-Button--hero:hover .ms-Button-icon .ms-Icon{border:1px solid #005a9e}
.ms-Button.ms-Button--hero:focus .ms-Button-label,.ms-Button.ms-Button--hero:hover .ms-Button-label{color:#004578}
.ms-Button.ms-Button--hero:active .ms-Button-icon{color:#0078d7}
.ms-Button.ms-Button--hero:active .ms-Button-icon .ms-Icon{border:1px solid #0078d7}
.ms-Button.ms-Button--hero:active .ms-Button-label{color:#0078d7}
.ms-Button.ms-Button--hero.is-disabled .ms-Button-icon,.ms-Button.ms-Button--hero:disabled .ms-Button-icon{color:#c8c8c8}
.ms-Button.ms-Button--hero.is-disabled .ms-Button-icon .ms-Icon,.ms-Button.ms-Button--hero:disabled .ms-Button-icon .ms-Icon{border:1px solid #c8c8c8}
.ms-Button.ms-Button--hero.is-disabled .ms-Button-label,.ms-Button.ms-Button--hero:disabled .ms-Button-label{color:#a6a6a6}
.ms-Button.ms-Button--compound{display:block;height:auto;max-width:280px;min-height:72px;padding:20px}
.ms-Button.ms-Button--compound .ms-Button-label{display:block;font-weight:600;position:relative;text-align:left;margin-top:-5px}
.ms-Button.ms-Button--compound .ms-Button-description{color:#666;display:block;font-weight:400;font-size:12px;position:relative;text-align:left;top:3px}
.ms-Button.ms-Button--compound:hover .ms-Button-description{color:#212121}
.ms-Button.ms-Button--compound:focus{border-color:#0078d7;background-color:#f4f4f4}
.ms-Button.ms-Button--compound:focus .ms-Button-label{color:#333}
.ms-Button.ms-Button--compound:focus .ms-Button-description{color:#666}
.ms-Button.ms-Button--compound:active{background-color:#0078d7}
.ms-Button.ms-Button--compound:active .ms-Button-description,.ms-Button.ms-Button--compound:active .ms-Button-label{color:#fff}
.ms-Button.ms-Button--compound.is-disabled .ms-Button-description,.ms-Button.ms-Button--compound.is-disabled .ms-Button-label,.ms-Button.ms-Button--compound:disabled .ms-Button-description,.ms-Button.ms-Button--compound:disabled .ms-Button-label{color:#a6a6a6}
.ms-Button.ms-Button--compound.is-disabled:active,.ms-Button.ms-Button--compound.is-disabled:focus,.ms-Button.ms-Button--compound:disabled:active,.ms-Button.ms-Button--compound:disabled:focus{border-color:#f4f4f4;background-color:#f4f4f4}
.ms-Button.ms-Button--compound.is-disabled:active .ms-Button-description,.ms-Button.ms-Button--compound.is-disabled:active .ms-Button-label,.ms-Button.ms-Button--compound.is-disabled:focus .ms-Button-description,.ms-Button.ms-Button--compound.is-disabled:focus .ms-Button-label,.ms-Button.ms-Button--compound:disabled:active .ms-Button-description,.ms-Button.ms-Button--compound:disabled:active .ms-Button-label,.ms-Button.ms-Button--compound:disabled:focus .ms-Button-description,.ms-Button.ms-Button--compound:disabled:focus .ms-Button-label{color:#a6a6a6}`;
  d.head.appendChild(style);
})(window, document);
