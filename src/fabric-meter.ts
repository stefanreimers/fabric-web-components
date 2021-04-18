class FabricMeter extends HTMLElement {

  private _refs: { meter: HTMLMeterElement | null };
  private _min: number;
  private _max: number;
  private _value: number;
  private _disabled: boolean;

  constructor() {
    super();
    this._refs = { meter: null };
    this._min = 0;
    this._max = 5;
    this._value = 4;
    this._disabled = false;
  }

  get disabled() { return this._disabled; }
  set disabled(value) { if (this._disabled === !!value) return; this._disabled = !!value; this.__setProperties('disabled'); }

  get min() { return this._min }
  set min(value) {
    value = (typeof value === 'number') ? value : parseFloat(value);
    if (isNaN(value) || this._min === value) return; this._min = value; this.__setProperties('min');
  }

  get max() { return this._max }
  set max(value) {
    value = (typeof value === 'number') ? value : parseFloat(value);
    if (isNaN(value) || this._max === value) return; this._max = value; this.__setProperties('max');
  }

  get value() { return this._value }
  set value(value) {
    value = (typeof value === 'number') ? value : parseFloat(value);
    if (isNaN(value) || this._value === value) return; this._value = value; this.__setProperties('value');
  }

  connectedCallback() {

    this.__setupUI();
    this.__setProperties();

  }

  private __setupUI() {

    let markup = `<meter></meter>`;
    this.innerHTML = markup;

    // Update references
    this._refs = {
      meter: this.querySelector('meter')
    }

  }

  private __setProperties(property?: string) {

    if (!this._refs || !this._refs.meter) return;

    if (property == null && this._refs.meter != null) {
      //@ts-ignore
      ['min', 'max', 'value'].forEach((p: string) => { this._refs.meter[p] = this[p] })
    }

    if (property != null && ['min', 'max', 'value'].indexOf(property) > -1) {
      //@ts-ignore
      this._refs.meter[property] = this[property]
    }

    if (property === 'disabled') {
      this._refs.meter.classList[this.disabled ? 'add' : 'remove']('disabled');
    }

  }

  static get observedAttributes() {
    return ['min', 'max', 'value', 'disabled'];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    //@ts-ignore
    if (oldValue != newValue) this[attr] = newValue;
  }

}
window.customElements.define('fabric-meter', FabricMeter);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `fabric-meter{display:inline-block}
  fabric-meter meter{width:5em;height:1em;background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text font-size="100" y=".8em" opacity=".2">★</text></svg>') 0 / auto 100%;}
  fabric-meter meter::-webkit-meter-optimum-value,
  fabric-meter meter::-moz-meter-bar {background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text font-size="100" y=".8em">★</text></svg>') 0 / auto 100%;
  `;

  d.head.appendChild(style);
})(window, document);