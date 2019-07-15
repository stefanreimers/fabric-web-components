class FabricPivot extends HTMLElement {

  private _refs: { [index: string]: HTMLElement | null };
  private _tabs: boolean;
  private _large: boolean;

  constructor() {
    super();
    // this._links = {}; // { name: { text: '', state: '' } } 
    this._refs = {};
    this._tabs = false;
    this._large = false;
  }

  get tabs() { return this._tabs; }
  get large() { return this._large; }

  set tabs(value) { if (!!value === this._tabs) return; this._tabs = value; this.__setProperties('tabs') }
  set large(value) { if (!!value === this._large) return; this._large = value; this.__setProperties('large') }

  //@ts-ignore
  get links() { return (this._refs && this._refs.links) ? this._refs.links.links : null }
  set links(value) { throw Error('Links / tabs cannot be set directly'); }

  connectedCallback() {

    this.__setupUI();
    this.__setProperties();
    this.__addListeners();

    // Show first
    let first = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content') : null;
    //@ts-ignore
    if (this._refs.links && first) this._refs.links.selected = first.dataset.name;
  }

  disconnectedCallback() {

  }

  private __setupUI() {

    let markup = `<div class="ms-Pivot">
		  <fabric-tabs class="ms-Pivot-links"></fabric-tabs>
		  <div class="ms-Pivot-content-container"/>
		</div>`;

    // <div class="ms-Pivot-content" data-content="{{name}}"></div>

    // Move predefined tabs to new markup
    if (this.children && this.children.length > 0) {

      const div = document.createElement('DIV');
      div.innerHTML = markup;
      const contentContainer = div.querySelector('.ms-Pivot-content-container');

      if (contentContainer) {
        while (this.children.length > 0) {

          // Check conditions - remove non-matching children
          if ((<HTMLElement>this.children[0]).dataset.name == undefined || (<HTMLElement>this.children[0]).dataset.text == undefined)
            this.removeChild(this.children[0]);

          this.children[0].classList.add('ms-Pivot-content');

          // Move child to container
          contentContainer.appendChild(this.children[0]);
        }
      }

      this.appendChild(div.children[0]);



    } else {
      this.innerHTML = markup;
    }

    // Update references
    this._refs = {
      container: this.querySelector('.ms-Pivot'),
      links: this.querySelector('.ms-Pivot-links'),
      content: this.querySelector('.ms-Pivot-content-container')
    }

    // Update tab list
    this.__updateTabs()

  }

  private __setProperties(property?: string) {

    if (!this._refs || !this._refs.container) return;

    //@ts-ignore
    if (property == null || property === 'tabs') { this._refs.links.tabs = this._tabs; }
    //@ts-ignore
    if (property == null || property === 'large') { this._refs.links.large = this._large; }

  }

  private __addListeners() {

    if (this._refs.links)
      // Tab selection
      this._refs.links.addEventListener('onTabSelected', (event) => {
        //@ts-ignore
        if (event.detail && event.detail.selected) this.show(event.detail.selected);
      });



  }

  show(name: string) {

    // Hide all other visible pages
    let visible = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content.visible') : null;
    if (visible) visible.classList.remove('visible');

    // Show page
    let toShow = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content[data-name="' + name + '"]') : null;
    if (toShow) toShow.classList.add('visible');
  }

  // appendTab(element, before) {

  //   // Check input
  //   if (typeof element != 'HTMLElement') throw new TypeError('Invalid element');

  //   // Determine place



  // }

  // removeTab(name) {

  // }

  private __updateTabs() {
    let tabs = (this._refs.content) ? this._refs.content.querySelectorAll('.ms-Pivot-content') : null;
    if (tabs && this._refs.links) {

      let links: any[] = [];
      [].forEach.call(tabs, (tab: HTMLElement) => {
        //@ts-ignore
        links.push({ text: tab.dataset.text, name: tab.dataset.name, disabled: false });
      });

      //@ts-ignore
      this._refs.links.links = links;
    }
  }


  static get observedAttributes() {
    return ['tabs', 'large'];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    //@ts-ignore
    if (oldValue === newValue || newValue === this[attr]) return;

    // Boolean values
    //@ts-ignore
    this[attr] = this.hasAttribute(attr);

  }

}
window.customElements.define('fabric-pivot', FabricPivot);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `fabric-pivot {display: inline-block}
.ms-Pivot{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;font-size:14px;font-weight:400;overflow:hidden}
.ms-Pivot-content{display:none;margin-top:20px}
.ms-Pivot-content.visible{display:block;overflow:auto;position:absolute;top:0;bottom:0;left:0;right:0}
.ms-Pivot-content-container {position: relative; flex: 1 1 auto !important;}
.ms-Pivot {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: stretch;
}
.ms-Pivot > * {order: 0; flex: 0 1 auto; align-self: auto;}
`;
  d.head.appendChild(style);
})(window, document);