class FabricListItem extends HTMLElement {

  private _selectable: boolean;
  private _modifier: string | null;
  private _selected: boolean;
  private _primarytext: string | null;
  private _secondarytext: string | null;
  private _tertiarytext: string | null;
  private _metatext: string | null;
  private _actions: string[];
  private _refs: { [index: string]: HTMLElement | null };


  private _listicon: string | null;
  private _image: any;
  private _state: string | null;

  constructor() {
    super();

    this._selectable = false;
    this._modifier = null;
    this._selected = false;

    this._state = null;

    this._image = null;
    this._primarytext = null;
    this._secondarytext = null;
    this._tertiarytext = null;
    this._metatext = null;
    this._listicon = null;

    this._actions = ['Mail', 'Delete', 'Flag', 'Pinned'];

    this._refs = {}
  }

  get selectable() { return this._selectable; }
  set selectable(value) { throw new RangeError('The selectable property is static') }

  get modifier() { return this._modifier; }
  set modifier(value) { throw new RangeError('The modifier property is static.') }

  get state() { return this._state || ''; }
  set state(value: string) { if (value === this._state || (['unread', 'unseen'].indexOf(value) === -1) && value != null) return; this._state = value; this.__setProperties('state'); }

  get selected() { return this._selected; }
  set selected(value) { if (value === this._selected) return; this._toggleHandler() }

  get image() { return this._image; }
  set image(value) { if (value === this._image) return; this._image = value; this.__setProperties('image'); }

  get primarytext() { return this._primarytext; }
  set primarytext(value) { if (value === this._primarytext) return; this._primarytext = value; this.__setProperties('primaryText'); }

  get secondarytext() { return this._secondarytext; }
  set secondarytext(value) { if (value === this._secondarytext) return; this._secondarytext = value; this.__setProperties('secondaryText'); }

  get tertiarytext() { return this._tertiarytext; }
  set tertiarytext(value) { if (value === this._tertiarytext) return; this._tertiarytext = value; this.__setProperties('tertiaryText'); }

  get metatext() { return this._metatext; }
  set metatext(value) { if (value === this._metatext) return; this._metatext = value; this.__setProperties('metaText'); }

  get listicon() { return this._listicon; }
  set listicon(value) { if (value === this._listicon) return; this._listicon = value; this.__setProperties('listicon'); }

  get actions() { return this._actions; }
  set actions(value) { if (value == null || Array.isArray(value)) { this._actions = value; this.__setProperties('actions'); } }

  connectedCallback() {
    this.__getStaticAttributes();
    this.__setupUI();
    this.__setProperties();
    this.__setListeners();
  }

  // disconnectedCallback() {
  //   console.log('disconnectedCallback')
  // }

  private __setupUI() {

    // Define static properties
    let modifier = (this._modifier) ? 'ms-ListItem--' + this._modifier : '';
    let selectable = (this._selectable === true) ? 'is-selectable' : '';

    let markup = `<li class="ms-ListItem ${modifier} ${selectable}" tabindex="0">
		  <div class="ms-ListItem-image"></div>
		  <span class="ms-ListItem-primaryText"></span>
		  <span class="ms-ListItem-secondaryText"></span>
		  <span class="ms-ListItem-tertiaryText"></span>
		  <span class="ms-ListItem-metaText"></span>
		  <div class="ms-ListItem-itemIcon"></div>
		  <div class="ms-ListItem-selectionTarget"></div>
		  <div class="ms-ListItem-actions"></div>
		</li>`;

    this.innerHTML = markup;

    this._refs = {
      container: this.querySelector('.ms-ListItem'),
      image: this.querySelector('.ms-ListItem-image'),
      primaryText: this.querySelector('.ms-ListItem-primaryText'),
      secondaryText: this.querySelector('.ms-ListItem-secondaryText'),
      tertiaryText: this.querySelector('.ms-ListItem-tertiaryText'),
      metaText: this.querySelector('.ms-ListItem-metaText'),
      itemIcon: this.querySelector('.ms-ListItem-itemIcon'),
      actions: this.querySelector('.ms-ListItem-actions'),
      selectionTarget: this.querySelector('.ms-ListItem-selectionTarget')
    }
  }

  private __setProperties(property?: string) {

    // console.log('setProperties', property);
    if (!this._refs.container) return;

    let texts = ['primaryText', 'secondaryText', 'tertiaryText', 'metaText'];

    if (property == null || property === 'state') {
      if (!this._refs.container) return; if (this.state === '') {
        this._refs.container.classList.remove('is-unseen');
        this._refs.container.classList.remove('is-unread');
      } else {
        this._refs.container.classList[(this.state !== 'unread') ? 'add' : 'remove']('is-unseen');
        this._refs.container.classList[(this.state !== 'unseen') ? 'add' : 'remove']('is-unread');
      }
    }
    if (property == null || property === 'selected') { if (this._selected === true) { this._refs.container.classList.add('is-selected'); } else { this._refs.container.classList.remove('is-selected'); } }
    if (property == null || property === 'image') { }
    if (property && texts.indexOf(property) !== -1) {
      let node = this._refs[property];
      //@ts-ignore
      if (node) node.textContent = this[property.toLowerCase()] || '';
    } else if (property == null) {
      texts.forEach(text => {
        //@ts-ignore
        this._refs[text].textContent = this[text.toLowerCase()] || '';
      });
    }

    if (property == null || property === 'listicon') {
      //@ts-ignore
      this._refs.itemIcon.className = 'ms-ListItem-itemIcon ' + ((!this._listicon) ? 'display-none' : 'ms-ListItem-itemIcon--' + this._listicon);
    }

    if (property == null || property === 'actions') {
      if (this._actions != null && Array.isArray(this._actions)) {
        if (this._refs.actions) this._refs.actions.innerHTML = this._actions.map(action => '<div class="ms-ListItem-action" data-action="' + action.toString() + '"><i class="ms-Icon ms-Icon--' + action.toString() + '"></i></div>').join('');
      }
    }
  }

  private __setListeners() {

    if (this._refs.selectionTarget) this._refs.selectionTarget.addEventListener("click", this._toggleHandler.bind(this), false);
    if (this._refs.actions) this._refs.actions.addEventListener('click', this._actionClickHandler.bind(this), false);
  }

  private _toggleHandler() {
    this._selected = !this._selected;
    if (this._refs.container) this._refs.container.classList.toggle("is-selected");
  }

  private _actionClickHandler(e: MouseEvent) {

    if (!e.target) return;
    const target = (<HTMLElement>e.target).closest('.ms-ListItem-action');


    if (target && (<HTMLElement>target).classList.contains('ms-ListItem-action')) {

      //@ts-ignore
      let action = (target && target.dataset) ? target.dataset.action : null;
      if (action == null) return;

      this.dispatchEvent(new CustomEvent('listitemActionClick', {
        bubbles: true,
        cancelable: true,
        detail: {
          action: action
        }
      }));


    }

  }

  private __getStaticAttributes() {
    let modifier = this.getAttribute('modifier');
    if (modifier && ['image', 'document'].indexOf(modifier) !== -1) this._modifier = modifier;

    let isSelectable = this.hasAttribute('selectable');
    if (isSelectable) this._selectable = true;
  }

  static get observedAttributes() {
    return ['state', 'selected', 'image', 'primarytext', 'secondarytext', 'tertiarytext', 'metatext', 'listicon'];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    // console.log('attributeChangedCallback', attr, oldValue, newValue);
    //@ts-ignore
    if (oldValue === newValue || newValue === this[attr]) return;

    //@ts-expect-error
    if (Array.isArray(this[attr])) { this[attr] = newValue.split(','); } else this[attr] = newValue;
  }

}
window.customElements.define('fabric-list-item', FabricListItem);

// Set styles
(function (w, d) {
  const id = 'list-item';
  const node = document.querySelector('style[data-fabric="' + id + '"]');
  if (node) {
    return;
  }
  const tag = 'fabric-list-item';
  let style = d.createElement('STYLE');
  style.dataset.fabric = id;
  style.textContent = `${tag} {font-size: var(--fabric-list-item-font-size, 14px )}
  ${tag} .ms-ListItem > span:empty,
${tag} .ms-ListItem > .ms-ListItem-image:empty,
${tag} .display-none {display:none}
${tag} .ms-ListItem{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;
  -webkit-font-smoothing:antialiased;
  box-sizing:border-box;margin:0;box-shadow:none;
  color:#333;font-size:1em;font-weight:400}
${tag} .ms-ListItem{padding:0;*zoom:1;padding:9px 28px 3px;position:relative;display:block}
${tag} .ms-ListItem:after{clear:both}
${tag} .ms-ListItem-primaryText,${tag} .ms-ListItem-secondaryText,${tag} .ms-ListItem-tertiaryText{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}
${tag} .ms-ListItem-primaryText{color:#212121;font-weight:300;font-size:1.5em;padding-right:80px;position:relative;top:-4px}
${tag} .ms-ListItem-secondaryText{color:#333;font-weight:400;font-size:1em;line-height:25px;position:relative;top:-7px;padding-right:30px}
${tag} .ms-ListItem-tertiaryText{color:#767676;font-weight:300;font-size:1em;position:relative;top:-9px;margin-bottom:-4px;padding-right:30px}
${tag} .ms-ListItem-metaText{color:#333;font-weight:300;font-size:0.8em;position:absolute;right:30px;top:39px}
${tag} .ms-ListItem-image{float:left;height:70px;margin-left:-8px;margin-right:10px;width:70px;background-color:#333}
${tag} .ms-ListItem-selectionTarget{display:none; height:14px;left:6px;position:absolute;top:13px;width:14px;border:1px solid #333}
${tag} .ms-ListItem-actions{max-width:80px;position:absolute;right:30px;text-align:right;top:10px}
${tag} .ms-ListItem-action{color:#a6a6a6;display:inline-block;font-size:1.1em;position:relative;text-align:center;top:3px;cursor:pointer;height:1.1em;width:1.1em}
${tag} .ms-ListItem-action .ms-Icon{vertical-align:top}
${tag} .ms-ListItem-action:hover{color:#666;outline:1px solid transparent}
${tag} .ms-ListItem.is-unread{border-left:3px solid #0078d7;padding-left:27px}
${tag} .ms-ListItem.is-unread .ms-ListItem-metaText,.ms-ListItem.is-unread .ms-ListItem-secondaryText{color:#0078d7;font-weight:600}
${tag} .ms-ListItem.is-unseen:after{border-right:10px solid transparent;border-top:10px solid #0078d7;left:0;position:absolute;top:0;display:table;content:"";line-height:0}
${tag} .ms-ListItem.is-selectable .ms-ListItem-image{margin-left:0}
${tag} .ms-ListItem.is-selectable:hover{background-color:#eaeaea;cursor:pointer;outline:1px solid transparent}
${tag} .ms-ListItem.is-selectable:hover:before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-style:normal;font-weight:400;speak:none;position:absolute;top:14px;left:7px;height:15px;width:15px;border:1px solid #767676}
${tag} .ms-ListItem.is-selectable:hover .ms-ListItem-selectionTarget,${tag} .ms-ListItem.is-selected .ms-ListItem-selectionTarget {display: initial}
${tag} .ms-ListItem.is-selected:before{border:1px solid transparent}
${tag} .ms-ListItem.is-selected:before,${tag} .ms-ListItem.is-selected:hover:before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-style:normal;font-weight:400;speak:none;font-size:17px;color:#767676;position:absolute;top:23px;left:7px;border:0}
${tag} .ms-ListItem.is-selected:hover{background-color:#b3d6f2;outline:1px solid transparent}
${tag} .ms-ListItem.ms-ListItem--document{padding:0}
${tag} .ms-ListItem.ms-ListItem--document .ms-ListItem-itemIcon{width:70px;height:70px;float:left;text-align:center}
${tag} .ms-ListItem.ms-ListItem--document .ms-ListItem-itemIcon .ms-Icon{font-size:38px;line-height:70px;color:#666}
${tag} .ms-ListItem.ms-ListItem--document .ms-ListItem-primaryText{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;padding-top:15px;padding-right:0;position:static}
${tag} .ms-ListItem.ms-ListItem--document .ms-ListItem-secondaryText{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#666;font-weight:400;font-size:11px;padding-top:6px}
${tag} .ms-ListItem.is-selected .ms-ListItem-selectionTarget {transition-property:background,border,border-color;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.23,1);border-color: #0078d7;background-color:#0078d7}
${tag} .ms-ListItem.is-selected .ms-ListItem-selectionTarget:after {content:"✓";position:absolute;left:3px;font-weight:900;font-size:10px;color:white}`
  d.head.appendChild(style);


})(window, document);
