class FabricTabs extends HTMLElement {

  private _links: any[];
  private _tabs: boolean;
  private _large: boolean;
  private _ellipsis: boolean;
  private _refs: { [index: string]: HTMLElement | null };
  private _selected: any;

  constructor() {

    super();
    this._links = []; // { text: '', name: '', disabled: false}
    this._tabs = false;
    this._large = false;
    this._ellipsis = false;
    this._selected = null;
    this._refs = {};
  }

  get links() { return this._links }
  set links(value) { if (JSON.stringify(value) === JSON.stringify(this._links)) return; this._links = value; this.__setProperties('links') }

  get selected() { return this._selected }
  set selected(value) {
    if (value === this.selected) return;
    this._selected = value;
    this.__setProperties('selected');
    try {
      this.dispatchEvent(
        new CustomEvent('onTabSelected',
          {
            bubbles: true,
            cancelable: true,
            detail: {
              selected: this._selected
            }
          }
        )
      );
    } catch (e) {
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent('onTabSelected', true, true, {
        'selected': this._selected
      });
      this.dispatchEvent(evt)
    }
  }

  get tabs() { return this._tabs; }
  get large() { return this._large; }
  get ellipsis() { return this._ellipsis; }

  set tabs(value) { if (!!value === this._tabs) return; this._tabs = value; this.__setProperties('tabs') }
  set large(value) { if (!!value === this._large) return; this._large = value; this.__setProperties('large') }
  set ellipsis(value) { if (!!value === this._ellipsis) return; this._ellipsis = value; this.__setProperties('ellipsis') }

  connectedCallback() {
    this.__setupUI();
    this.__setProperties();
    this.__addListeners();
  }

  private __setupUI() {

    let markup = `<div class="ms-Tabs">
		  <ul class="ms-Tabs-links">
			<li class="ms-Tabs-link ms-Tabs-ellipsis hidden" tabindex="1"><i>…</i></li>
		  </ul>
		</div>`;

    this.innerHTML = markup;

    this._refs = {
      container: this.querySelector('.ms-Tabs'),
      links: this.querySelector('.ms-Tabs-links'),
      ellipsis: this.querySelector('.ms-Tabs-link.ms-Tabs-ellipsis')
    }
  }

  private __setProperties(property?: string) {

    // console.log('__setProperties', property, this[property]);

    if (!this._refs || !this._refs.container) return;

    if (property == null || property === 'tabs') { this._refs.container.classList[(this._tabs) ? 'add' : 'remove']('ms-Tabs--tabs') }
    if (property == null || property === 'large') { this._refs.container.classList[(this._large) ? 'add' : 'remove']('ms-Tabs--large') }
    if ((property == null || property === 'ellipsis') && this._refs.ellipsis) { this._refs.ellipsis.classList[(this._ellipsis) ? 'remove' : 'add']('hidden') }

    if (property == null || property === 'selected') {
      // Unselect previous
      let previous = (this._refs.links) ? this._refs.links.querySelector('.is-selected') : null;
      if (previous) previous.classList.remove('is-selected');

      // Select new
      let selection = (this._refs.links) ? this._refs.links.querySelector('[data-content="' + this._selected + '"]') : null;
      if (selection) selection.classList.add('is-selected');
    }

    if (property == null || property === 'links') {

      if (!Array.isArray(this._links) || this._links.length == 0) return;

      // Clear links container
      let previousLinks = (this._refs.links) ? this._refs.links.querySelectorAll('.ms-Tabs-link:not(.ms-Tabs-ellipsis)') : [];
      if (this._refs.links && previousLinks && previousLinks.length > 0) {
        //@ts-ignore
        [].forEach.call(previousLinks, (entry) => {
          //@ts-ignore
          this._refs.links.removeChild(entry);
        });
      }

      // Insert nodes 
      var li = null;
      //@ts-ignore
      [].concat(this.links).forEach(entry => {
        li = document.createElement('LI');
        li.tabIndex = 1;
        li.classList.add('ms-Tabs-link');
        li.title = li.textContent = entry.text || '';
        li.dataset.content = entry.name || '';
        if (entry.disabled === true) li.classList.add('is-disabled');
        if (entry.name === this.selected) li.classList.add('is-selected');

        if (this._refs.links) this._refs.links.insertBefore(li, this._refs.ellipsis);
      });

    }
  }

  private __addListeners() {

    if (this._refs.links)
      this._refs.links.addEventListener('click', (event: MouseEvent) => {

        console.log('clicked');

        //@ts-ignore
        if (!event.target || !event.target.tagName.toLowerCase() === 'li') return;
        //@ts-ignore
        if (event.target.classList.contains('is-disabled')) return;
        //@ts-ignore
        const selected = event.target.dataset.content;
        if (!selected) return;

        this.selected = selected;

      });
  }

  static get observedAttributes() {
    return [
      'selected',	// Name of link that should be displayed as selected
      'links', 	// Collection of links consisting
      'tabs', 	// Boolean whether to display links in tab style or underlined
      'large', 	// Boolean whether or not to show links enlarged
      'ellipsis'	// Boolean whether or not to show an overflow
    ];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {

    //@ts-ignore
    if (oldValue === newValue || newValue === this[attr]) return;

    let n = newValue;
    if (attr === 'links') {
      try { n = JSON.parse(newValue) } catch (e) { }
    } else if (attr === 'selected') {
      this.selected = n;
    } else {

      // Boolean attributes
      //@ts-ignore
      n = this.hasAttribute(attr);
    }

    //@ts-ignore
    this[attr] = n;

  }

}
window.customElements.define('fabric-tabs', FabricTabs);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `fabric-tabs{display:block}
.ms-Tabs{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;font-size:14px;font-weight:400}
.ms-Tabs-links{font-size:0;height:40px;list-style-type:none;padding:0;white-space:nowrap}
.ms-Tabs-link{color:#333;display:inline-block;font-size:14px;font-weight:400;line-height:40px;margin-right:8px;padding:0 8px;text-align:center;vertical-align:top}
.ms-Tabs-link:hover{cursor:pointer}
.ms-Tabs-link:before{background-color:transparent;bottom:0;content:"";height:2px;left:8px;position:absolute;right:8px;/*transition:background-color .267s cubic-bezier(.1,.25,.75,.9)*/}
.ms-Tabs-link:after{color:transparent;content:attr(title);display:block;font-weight:700;height:1px;overflow:hidden;visibility:hidden}
.ms-Tabs-link.is-selected{font-weight:600;position:relative}
.ms-Tabs-link.is-selected:before{background-color:#0078d7}
.ms-Tabs-link.is-disabled{color:#a6a6a6}
.ms-Tabs-link.ms-Tabs-link--overflow{color:#666}
.ms-Tabs-link.ms-Tabs-link--overflow.is-selected{color:#0078d7}
.ms-Tabs-link.ms-Tabs-link--overflow:focus:not(.is-selected),.ms-Tabs-link.ms-Tabs-link--overflow:hover:not(.is-selected){color:#212121}
.ms-Tabs-link.ms-Tabs-link--overflow:active{color:#0078d7}
.ms-Tabs-ellipsis > i{font-size:15px;position:relative;top:0} 
.ms-Tabs-link.ms-Tabs-ellipsis.hidden {display:none}
.ms-Tabs.ms-Tabs--large .ms-Tabs-link{font-size:17px}
.ms-Tabs.ms-Tabs--large .ms-Tabs-link.is-selected{font-weight:300}
.ms-Tabs.ms-Tabs--large .ms-Tabs-link.ms-Tabs-link--overflow:after{font-size:17px}
.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link{height:40px;background-color:#f4f4f4;line-height:40px;margin-right:-2px;padding:0 10px}
.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link:focus:not(.is-selected):not(.ms-Tabs-link--overflow),.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link:hover:not(.is-selected):not(.ms-Tabs-link--overflow){color:#000}
.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link:active{color:#fff;background-color:#0078d7}
.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.is-selected{background-color:#0078d7;color:#fff;font-weight:300}
.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.ms-Tabs-link--overflow:focus:not(.is-selected),.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.ms-Tabs-link--overflow:hover:not(.is-selected){background-color:#fff}
.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.ms-Tabs-link--overflow:active{background-color:#0078d7}
@media screen and (-ms-high-contrast:active){.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.is-selected{font-weight:600}
}`;
  d.head.appendChild(style);
})(window, document);