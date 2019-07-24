class FabricCommandButton extends HTMLElement {

  private _refs: { [index: string]: any };
  private _modifier: string | null;
  private _disabled: boolean = false;
  private _split: boolean = false;
  private _label: string = '';
  private _icon: string = '';
  private _items: any[];

  constructor() {
    super();

    this._refs = {};
    this._modifier = null;
    this._items = [];

  }

  get modifier() { return this._modifier }
  get disabled() { return this._disabled }
  get split() { return this._split }
  get label() { return this._label }
  get icon() { return this._icon }
  get items() { return this._items || [] }

  set modifier(value) { throw new RangeError('The modifier property is static.') }
  set disabled(value) { if (!!value === this._disabled) return; this._disabled = !!value; this.__setProperties('disabled') }
  set split(value) { if (!!value === this._split) return; this._split = !!value; this.__setProperties('split') }
  set label(value) { if (value === this._label) return; this._label = value; this.__setProperties('label') }
  set icon(value) { if (value === this._icon) return; this._icon = value; this.__setProperties('icon') }
  set items(value) { this._items = value; this.__setProperties('items') }

  connectedCallback() {

    this.__getStaticAttributes();
    this.__deriveLabelFromText();
    this.__setupUI();
    this.__setProperties();
    //this.__addListeners();
  }

  __setupUI() {

    // Define static properties
    let modifier = (this._modifier) ? 'ms-CommandButton--' + this._modifier : '';

    let markup = `<div class="ms-CommandButton ${modifier}">
            <button class="ms-CommandButton-button">
                <span class="ms-CommandButton-icon ms-fontColor-themePrimary"><i class="ms-Icon"></i></span> 
                <span class="ms-CommandButton-label"></span> 
				<span class="ms-CommandButton-dropdownIcon"><i class="ms-Icon ms-Icon--ChevronDown"></i></span> 
            </button>
			<button class="ms-CommandButton-splitIcon">
				<i class="ms-Icon ms-Icon--ChevronDown"></i>
			</button>
            </div>`;

    this.innerHTML = markup;

    this._refs = {
      container: this.querySelector('.ms-CommandButton'),
      button: this.querySelector('.ms-CommandButton-button'),
      iconContainer: this.querySelector('.ms-CommandButton-icon'),
      icon: this.querySelector('.ms-CommandButton-icon > .ms-Icon'),
      label: this.querySelector('.ms-CommandButton-label'),
      splitIcon: this.querySelector('.ms-CommandButton-splitIcon'),
      dropdown: this.querySelector('.ms-CommandButton-dropdownIcon')
    }

  }

  __deriveLabelFromText() {
    if ((this._label == null || this._label === '') && this.textContent)
      this.label = this.textContent;
  }

  __setProperties(property?: string) {

    if (!this._refs.container) return;

    if (property == null || property === 'icon') {
      let icon = (this._icon) ? ' ms-Icon--' + this._icon : '';
      this._refs.icon.className = 'ms-Icon' + icon
    }

    if (property == null || property === 'disabled') {
      this._refs.container.classList[(this.disabled === true) ? 'add' : 'remove']('is-disabled');
    }

    if (property == null || property === 'split') {
      this._refs.splitIcon.classList[(this.split === false) ? 'add' : 'remove']('is-hidden');
    }

    if (property == null || property === 'label') {
      this._refs.label.textContent = this._label || '';
    }

    if (property == null || property === 'items') {
      let action = (this.items.length === 0) ? 'add' : 'remove';
      ['splitIcon', 'dropdown', 'contextualMenu'].forEach(element => {
        if (this._refs[element]) this._refs[element].classList[action]('is-hidden');
      });

      // Handle contextual menu
      if (this.items.length > 0 && !this.querySelector('fabric-contextual-menu')) {
        // Add menu
        console.log('Add menu')
        let menu = <FabricContextualMenu>document.createElement('fabric-contextual-menu');
        //menu.setAttribute('host', '.ms-CommandButton-button')
        menu._host = this._refs.button;

        this.items.forEach(item => {
          let li = document.createElement('LI');
          if (typeof item === 'string') {
            li.textContent = item;
          } else {
            li.textContent = item.text;
            if (item.class) li.className = item.class
          }
          menu.appendChild(li)
        })

        this._refs.container.appendChild(menu);
        this._refs.contextualMenu = this.querySelector('fabric-contextual-menu')


      } else if (this.items.length === 0 && this._refs.contextualMenu) {
        console.log('remove menu')
        // Remove menu
        this._refs.container.removeChild(this._refs.contextualMenu);
        delete this._refs.contextualMenu;
      }
    }

  }

  // __addListeners(){}

  private __getStaticAttributes() {
    let modifier = this.getAttribute('modifier');
    if (modifier && ['actionButton', 'inline', 'noLabel', 'pivot', 'textOnly'].indexOf(modifier) !== -1) this._modifier = modifier;
  }

  static get observedAttributes() {
    return ['disabled', 'label', 'icon', 'split'];
  }

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {


    let n: any = newValue;
    //@ts-ignore
    if (typeof this[attr] === 'boolean') { n = this.hasAttribute(attr) }

    //@ts-ignore
    if (oldValue === n || n === this[attr]) return;
    //@ts-ignore
    this[attr] = n;
  }

}
window.customElements.define('fabric-command-button', FabricCommandButton);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `
fabric-command-button{display:inline-block}
.ms-CommandButton{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;
-webkit-font-smoothing:antialiased;display:inline-block;vertical-align:top}
.ms-CommandButton.is-hidden{display:none}
.ms-CommandButton.is-disabled .ms-CommandButton-button,
.ms-CommandButton:disabled .ms-CommandButton-button{cursor:default}
.ms-CommandButton.is-disabled .ms-CommandButton-button:hover,
.ms-CommandButton:disabled .ms-CommandButton-button:hover{background-color:#eff6fc}
.ms-CommandButton.is-disabled .ms-CommandButton-button .ms-CommandButton-icon,
.ms-CommandButton.is-disabled .ms-CommandButton-button .ms-CommandButton-label,
.ms-CommandButton:disabled .ms-CommandButton-button .ms-CommandButton-icon,
.ms-CommandButton:disabled .ms-CommandButton-button .ms-CommandButton-label{color:#a6a6a6}
.ms-CommandButton2 .ms-ContextualMenu{display:none}
.ms-CommandButton-button,
.ms-CommandButton-splitIcon{box-sizing:border-box;margin:0;padding:0;box-shadow:none;color:#333;font-size:14px;font-weight:400;
cursor:pointer;display:inline-block;height:40px;line-height:40px;outline:1px solid transparent;padding:0 8px;position:relative;
vertical-align:top;background:transparent}
.ms-CommandButton-button:hover,
.ms-CommandButton-splitIcon:hover{background-color:#eaeaea}
.ms-CommandButton-button:hover .ms-CommandButton-label,
.ms-CommandButton-splitIcon:hover .ms-CommandButton-label{color:#212121}
.ms-CommandButton-button:active,
.ms-CommandButton-splitIcon:active{background-color:#eaeaea}
.ms-CommandButton-button:focus:before,
.ms-CommandButton-splitIcon:focus:before{top:3px;left:3px;right:3px;bottom:3px;border:1px solid #333;position:absolute;z-index:10;content:"";outline:none}
.ms-CommandButton-button:focus,
.ms-CommandButton-splitIcon:focus{outline:0}
@media only screen and (max-width:639px){
	.ms-CommandButton-button,
	.ms-CommandButton-splitIcon{height:44px}
	.ms-CommandButton-button .ms-CommandButton-icon,
	.ms-CommandButton-splitIcon .ms-CommandButton-icon{font-size:20px}
	.ms-CommandButton-button .ms-CommandButton-label,
	.ms-CommandButton-splitIcon .ms-CommandButton-label{line-height:44px}
}
.ms-CommandButton-button{border:0;margin:0}
.ms-CommandButton+.ms-CommandButton{margin-left:8px}
@media only screen and (max-width:639px){
	.ms-CommandButton+.ms-CommandButton{margin-left:4px}
}
.ms-CommandButton-icon{display:inline-block;margin-right:8px;position:relative;font-size:16px;min-width:16px;height:100%}.
ms-CommandButton-icon .ms-Icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.ms-CommandButton-label{font-size:14px;font-weight:400;color:#333;line-height:40px;height:100%;display:inline-block;vertical-align:top}
.ms-CommandButton-label:hover{color:#212121}
fabric-command-button[split] .ms-CommandButton-dropdownIcon {display: none}
.ms-CommandButton-dropdownIcon,
.ms-CommandButton-splitIcon{display:inline-block;position:relative;color:#333;font-size:12px;font-weight:300;min-width:12px;height:40px;
vertical-align:top;margin-left:8px}
.ms-CommandButton-dropdownIcon .ms-Icon,
.ms-CommandButton-splitIcon .ms-Icon{line-height:normal;padding-top:16px}
.ms-CommandButton-dropdownIcon:focus:before,
.ms-CommandButton-splitIcon:focus:before{top:3px;left:3px;right:3px;bottom:3px;border:1px solid #333;position:absolute;z-index:10;content:"";outline:none}
@media only screen and (max-width:639px){
	.ms-CommandButton-dropdownIcon,
	.ms-CommandButton-splitIcon{display:none}
}
.ms-CommandButton-splitIcon{margin-left:-2px;width:27px;border:0}
.ms-CommandButton-splitIcon .ms-Icon{margin-left:-1px;position:relative;padding-top:16px}
.ms-CommandButton-splitIcon .ms-Icon:after{position:absolute;content:" ";width:1px;height:16px;top:12px;left:-8px;border-left:1px solid #c8c8c8}
.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-icon{margin-right:0}
.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-label{display:none}
.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-button{padding:0 12px}
.ms-CommandButton.ms-CommandButton--inline .ms-CommandButton-button{background:none}
.ms-CommandButton.ms-CommandButton--actionButton .ms-CommandButton-button{width:50px;height:40px}
.ms-CommandButton.ms-CommandButton--actionButton .ms-CommandButton-icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
width:16px;height:16px;padding-right:0}
.ms-CommandButton.ms-CommandButton--actionButton .ms-CommandButton-icon > i {display:block}
.ms-CommandButton.ms-CommandButton--actionButton .ms-CommandButton-label {display:none}
.ms-CommandButton.ms-CommandButton--pivot.is-active:before,
.ms-CommandButton.ms-CommandButton--pivot:hover:before{content:"";height:2px;position:absolute;left:0;right:0;background-color:#0078d7;bottom:0;z-index:5}
.ms-CommandButton.ms-CommandButton--pivot .ms-CommandButton-label,
.ms-CommandButton.ms-CommandButton--textOnly .ms-CommandButton-label{display:inline-block}
.ms-CommandButton.ms-CommandButton--textOnly .ms-CommandButton-icon{display:none}
@media only screen and (max-width:479px){
	.ms-CommandButton.ms-CommandButton--pivot .ms-CommandButton-label,
	.ms-CommandButton.ms-CommandButton--textOnly .ms-CommandButton-label{font-size:16px}
}
.ms-fontColor-themePrimary { color: #0078d7 }
.is-hidden{display: none !important}
`;
  d.head.appendChild(style);
})(window, document);