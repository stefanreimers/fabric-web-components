"use strict";
class FabricContextualMenu extends FabricContextualHost {
    constructor() {
        super();
        this._hostEvent = 'click';
        this._refs = {};
        this._modifier = null;
        this._host = null;
    }
    get modifier() { return this._modifier; }
    set modifier(value) { throw new RangeError('The modifier property is static.'); }
    get host() { return this._host; }
    ;
    set host(value) { throw new RangeError('The host property is static.'); }
    get hostEvent() { return this._hostEvent; }
    ;
    set hostEvent(value) { throw new RangeError('The hostEvent property is static.'); }
    connectedCallback() {
        super.connectedCallback();
        this.__getStaticAttributes();
        this.__setupUI();
        this.__boundHostEventHandler = this.__hostEventHandler.bind(this);
        this.__setListeners();
    }
    disconnectedCallback() {
        if (!this._host)
            return;
        let hostNode = document.querySelector(this._host);
        if (hostNode == null)
            return;
        hostNode.removeEventListener(this._hostEvent, this.__boundHostEventHandler);
    }
    __setupUI() {
        let modifier = (this._modifier) ? 'ms-ContextualMenu--' + this._modifier : '';
        let markup = `<ul class="ms-ContextualMenu ${modifier}"></ul>`;
        var fragment = document.createElement('DIV');
        fragment.innerHTML = markup;
        while (this.childNodes.length > 0) {
            let fragmentUl = fragment.querySelector('ul');
            if (fragmentUl)
                fragmentUl.appendChild(this.childNodes[0]);
        }
        super.__setupUI();
        if (this._refs.main)
            this._refs.main.innerHTML = fragment.innerHTML;
        this._refs.menu = this.querySelector('.ms-ContextualMenu');
        [].forEach.call(this.querySelectorAll('.ms-ContextualMenu > li'), (entry) => {
            entry.classList.add('ms-ContextualMenu-item');
            if (!entry.classList.contains('header') && !entry.classList.contains('divider'))
                entry.innerHTML = '<a class="ms-ContextualMenu-link" tabindex="1">' + entry.textContent + '</a>';
            if (entry.classList.contains('header')) {
                entry.classList.add('ms-ContextualMenu-item--header');
                entry.classList.remove('header');
            }
            if (entry.classList.contains('divider')) {
                entry.classList.add('ms-ContextualMenu-item--divider');
                entry.classList.remove('divider');
            }
        });
    }
    setMenuContent(content) {
        if (this._refs.menu)
            this._refs.menu.innerHTML = content;
    }
    getMenuNode() {
        return this.querySelector('.ms-ContextualMenu');
    }
    __getStaticAttributes() {
        let modifier = this.getAttribute('modifier');
        if (modifier && ['multiselect'].indexOf(modifier) !== -1)
            this._modifier = modifier;
        let host = this.getAttribute('host');
        if (host)
            this._host = host;
        let hostEvent = this.getAttribute('hostevent');
        if (hostEvent)
            this._hostEvent = hostEvent;
    }
    __setListeners() {
        if (!this._host) {
            console.log('No host defined');
            return;
        }
        let hostNode = (typeof this._host === 'string') ? this.closest(this._host) || document.querySelector(this._host) : this._host;
        if (hostNode == null)
            throw TypeError('No node available for host');
        super.target = hostNode;
        hostNode.addEventListener(this._hostEvent, this.__boundHostEventHandler, true);
    }
    setHost(host, event) {
        let h = host || this._host;
        if (!h)
            throw RangeError('No host given');
        if (typeof h === 'string')
            h = document.querySelector(h);
        let e = event || this._hostEvent;
        if (!e)
            throw RangeError('No event specified');
        console.log('setHost', { h, e });
        if (this._hostEvent && super.target) {
            super.target.removeEventListener(this._hostEvent, this.__boundHostEventHandler);
        }
        this._host = h;
        this._hostEvent = e;
    }
    __hostEventHandler(event) {
        console.log('__hostEventHandler', event);
        super.__openModal();
    }
    close() {
        this.__disposeModal();
    }
}
window.customElements.define('fabric-contextual-menu', FabricContextualMenu);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `.ms-ContextualMenu{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;color:#333;font-size:14px;font-weight:400;display:block;min-width:180px;max-width:220px;list-style-type:none;position:relative;background-color:#fff}
.ms-ContextualMenu.is-hidden{display:none}
.ms-ContextualMenu-item{position:relative}
.ms-ContextualMenu-link{box-sizing:border-box;text-decoration:none;color:#333;border:1px solid transparent;cursor:pointer;display:block;height:36px;overflow:hidden;line-height:34px;padding:0 16px 0 25px;position:relative;text-overflow:ellipsis;white-space:nowrap}
.ms-ContextualMenu-link:active,.ms-ContextualMenu-link:focus,.ms-ContextualMenu-link:hover{background-color:#f4f4f4;color:#212121}
.ms-ContextualMenu-link:active .ms-ContextualMenu-subMenuIcon,.ms-ContextualMenu-link:focus .ms-ContextualMenu-subMenuIcon,.ms-ContextualMenu-link:hover .ms-ContextualMenu-subMenuIcon{color:#212121}
.ms-ContextualMenu-link:focus{outline:transparent;border:1px solid #666}
.ms-ContextualMenu-link.is-selected{background-color:#dadada;color:#000;font-weight:600}
.ms-ContextualMenu-link.is-selected~.ms-ContextualMenu-subMenuIcon{color:#000}
.ms-ContextualMenu-link.is-selected:hover{background-color:#d0d0d0}
.ms-ContextualMenu-link.is-disabled{color:#a6a6a6;background-color:#fff;pointer-events:none}
.ms-ContextualMenu-link.is-disabled:active,.ms-ContextualMenu-link.is-disabled:focus{border-color:#fff}
.ms-ContextualMenu-link.is-disabled .ms-Icon{color:#a6a6a6;pointer-events:none;cursor:default}
.ms-ContextualMenu-item.ms-ContextualMenu-item--divider{cursor:default;display:block;height:1px;background-color:#eaeaea;position:relative}
.ms-ContextualMenu-item.ms-ContextualMenu-item--header{color:#0078d7;font-size:12px;text-transform:uppercase;height:36px;line-height:36px;padding:0 18px}
.ms-ContextualMenu-item.ms-ContextualMenu-item--hasMenu .ms-ContextualMenu{position:absolute;top:-1px;left:178px}
.ms-ContextualMenu-caretRight,.ms-ContextualMenu-subMenuIcon{color:#333;font-size:8px;font-weight:600;width:24px;height:36px;line-height:36px;position:absolute;text-align:center;top:0;right:0;z-index:1;pointer-events:none}
.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-item.ms-ContextualMenu-item--header{padding:0 16px 0 26px}
.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected{background-color:#fff;font-weight:600;color:#333}
.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:after{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-family:FabricMDL2Icons;font-style:normal;font-weight:400;speak:none;color:#333;content:"\E73E";font-size:10px;font-weight:800;height:36px;line-height:36px;position:absolute;left:7px}
.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:focus,.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:hover{color:#212121;background-color:#f4f4f4}
.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:focus:after,.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:hover:after{color:#212121}
.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:active{color:#000;background-color:#d0d0d0}
.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:active:after{color:#000}
.ms-ContextualMenu.ms-ContextualMenu--hasChecks .ms-ContextualMenu-link,.ms-ContextualMenu.ms-ContextualMenu--hasIcons .ms-ContextualMenu-link{padding-left:40px}
.ms-ContextualMenu.ms-ContextualMenu--hasChecks .ms-Icon,.ms-ContextualMenu.ms-ContextualMenu--hasIcons .ms-Icon{position:absolute;top:50%;transform:translateY(-50%);width:40px;text-align:center}
.ms-ContextualMenu.ms-ContextualMenu--hasIcons{width:220px}`;
    d.head.appendChild(style);
})(window, document);
