"use strict";
class FabricBreadcrumb extends HTMLElement {
    constructor() {
        super();
        this.MEDIUM = 639;
        this._tabIndex = 2;
        this._currentMaxItems = 0;
        this._items = [];
        this._refs = {};
        this._onResize = this._onResize.bind(this);
        this._openOverflow = this._openOverflow.bind(this);
        this._overflowKeyPress = this._overflowKeyPress.bind(this);
        this._closeOverflow = this._closeOverflow.bind(this);
        this.removeOutlinesOnClick = this.removeOutlinesOnClick.bind(this);
    }
    get items() { return this._items; }
    set items(value) { throw new RangeError('Please set items via component methods.'); }
    connectedCallback() {
        this.__setupUI();
        this.__setListeners();
        this.__createItemCollection();
        this._onResize();
    }
    __setupUI() {
        let markup = `<div class="ms-Breadcrumb">
        <div class="ms-Breadcrumb-overflow">
            <div class="ms-Breadcrumb-overflowButton ms-Icon ms-Icon--More">...</div>
            <div class="ms-Breadcrumb-overflowMenu">
            <ul class="ms-ContextualMenu "></ul>
            </div>
            <i class="ms-Breadcrumb-chevron ms-Icon chevron right ms-Icon--ChevronRight"></i>
        </div>
        <ul class="ms-Breadcrumb-list">
        </ul>
        </div>`;
        if (this.children && this.children.length > 0) {
            let tempItems = [];
            while (this.children.length > 0) {
                if (this.children[0].tagName.toLowerCase() === 'a') {
                    let x = { text: this.children[0].innerText };
                    if (this.children[0].href.trim() !== '')
                        x.link = this.children[0].href.trim();
                    if (this.children[0].getAttribute('tabIndex'))
                        x.tabIndex = parseInt(this.children[0].getAttribute('tabIndex') || '', 10);
                    tempItems.push(x);
                }
                this.removeChild(this.children[0]);
                this._items = tempItems;
            }
        }
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-Breadcrumb'),
            overflow: this.querySelector('.ms-Breadcrumb-overflow'),
            list: this.querySelector('.ms-Breadcrumb-list'),
            overflowButton: this.querySelector('.ms-Breadcrumb-overflowButton'),
            overflowMenu: this.querySelector(".ms-Breadcrumb-overflowMenu"),
            contextMenu: this.querySelector(".ms-ContextualMenu")
        };
    }
    __setListeners() {
        window.addEventListener("resize", this._onResize, !1),
            this._refs.overflowButton.addEventListener("click", this._openOverflow, !1),
            this._refs.overflowButton.addEventListener("keypress", this._overflowKeyPress, !1),
            document.addEventListener("click", this._closeOverflow, !1),
            this._refs.list.addEventListener("click", this.removeOutlinesOnClick, !1);
    }
    __setProperties(property) {
        if (!this._refs.container)
            return;
        if (property == null || property === 'items') {
            this._refs.list.innerHTML = '';
            var container = document.createElement('div');
            (this._items || []).forEach(item => {
                container.innerHTML = `
                    <li class="ms-Breadcrumb-listItem">
                    <a class="ms-Breadcrumb-itemLink">${item}</a> 
                    <i class="ms-Breadcrumb-chevron chevron right ms-Icon ms-Icon--ChevronRight"></i>
                    </li>`;
                this._refs.list.appendChild(container.children[0]);
            });
        }
    }
    static get observedAttributes() {
        return [];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        let n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    }
    removeOutlinesOnClick(e) {
        this._refs.list && this._refs.list.blur();
    }
    addItem(e, t) {
        this._items.push({ text: e, link: t }),
            this._updateBreadcrumbs();
    }
    removeItemByLabel(e) {
        for (var t = this._items.length; t--;)
            this._items[t].text === e && this._items.splice(t, 1);
        this._updateBreadcrumbs();
    }
    removeItemByPosition(e) {
        this._items.splice(e, 1),
            this._updateBreadcrumbs();
    }
    _resetList(e) {
        for (; e.firstChild;)
            e.removeChild(e.firstChild);
    }
    _openOverflow(e) {
        this._refs.overflowMenu.className.indexOf(" is-open") === -1 && (this._refs.overflowMenu.classList.add("is-open"),
            this.removeOutlinesOnClick(),
            this._refs.overflowButton.focus());
    }
    _overflowKeyPress(e) {
        13 === e.keyCode && this._openOverflow(e);
    }
    _closeOverflow(e) {
        e && e.target === this._refs.overflowButton || this._refs.overflowMenu.classList.remove("is-open");
    }
    __createItemCollection() {
        var e, t, i, n, s, o;
        let _listItems = this._refs.list.querySelectorAll(".ms-Breadcrumb-listItem");
        s = _listItems.length,
            o = 0;
        for (o; o < s; o++)
            e = _listItems[o].querySelector(".ms-Breadcrumb-itemLink"),
                t = e.textContent,
                i = e.getAttribute("href"),
                n = parseInt(e.getAttribute("tabindex"), 10),
                this._items.push({ link: i, tabIndex: n, text: t });
    }
    _onResize() {
        this._closeOverflow(null),
            this._renderList();
    }
    _renderList() {
        var t = window.innerWidth > this.MEDIUM ? 4 : 2;
        t !== this._currentMaxItems && this._updateBreadcrumbs(),
            this._currentMaxItems = t;
    }
    _updateBreadcrumbs() {
        this._tabIndex = 2;
        var t = window.innerWidth > this.MEDIUM ? 4 : 2;
        this._items.length > t ? this._refs.container.classList.add("is-overflow") : this._refs.container.classList.remove("is-overflow"),
            this._addItemsToOverflow(t),
            this._addBreadcrumbItems(t);
    }
    _addItemsToOverflow(e) {
        var t = this;
        this._resetList(this._refs.contextMenu);
        var i = this._items.length - e, n = this._items.slice(0, i);
        n.forEach(function (e) {
            var i = document.createElement("li");
            i.className = "ms-ContextualMenu-item";
            var n = document.createElement("a");
            n.className = "ms-ContextualMenu-link";
            if (e.link)
                n.setAttribute("href", e.link);
            n.setAttribute("tabindex", (t._tabIndex++).toString()),
                n.textContent = e.text,
                i.appendChild(n),
                t._refs.contextMenu.appendChild(i);
        });
    }
    _addBreadcrumbItems(e) {
        this._resetList(this._refs.list);
        var t = this._items.length - e;
        if (t = t < 0 ? 0 : t, t >= 0)
            for (t; t < this._items.length; t++) {
                var i = document.createElement("li"), n = this._items[t], s = document.createElement("a"), o = document.createElement("i");
                i.className = "ms-Breadcrumb-listItem",
                    s.className = "ms-Breadcrumb-itemLink";
                if (n.link)
                    n.setAttribute("href", n.link);
                s.setAttribute("tabindex", (this._tabIndex++).toString()),
                    s.textContent = n.text,
                    o.className = "ms-Breadcrumb-chevron ms-Icon chevron right ms-Icon--ChevronRight",
                    i.appendChild(s),
                    i.appendChild(o),
                    this._refs.list.appendChild(i);
            }
    }
}
window.customElements.define('fabric-breadcrumb', FabricBreadcrumb);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `fabric-breadcrumb .ms-Breadcrumb{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;
    -webkit-font-smoothing:antialiased;margin:23px 0 1px}
fabric-breadcrumb .ms-Breadcrumb.is-overflow .ms-Breadcrumb-overflow{display:inline-block;margin-right:-4px}
fabric-breadcrumb .ms-Breadcrumb-chevron-alt{font-size:12px;color:#666;vertical-align:top;margin:13px 4px;line-height:1}
fabric-breadcrumb .ms-Breadcrumb-chevron{font-size:16px;color:#999;vertical-align:top;margin:8px 4px;line-height:1}
fabric-breadcrumb .ms-Breadcrumb-list{display:inline;white-space:nowrap;padding:0;margin:0}
fabric-breadcrumb .ms-Breadcrumb-list .ms-Breadcrumb-listItem{list-style-type:none;vertical-align:top;margin:0;padding:0;display:inline-block}
fabric-breadcrumb .ms-Breadcrumb-list .ms-Breadcrumb-listItem:last-of-type .ms-Breadcrumb-chevron{display:none}
fabric-breadcrumb .ms-Breadcrumb-overflow{display:none;position:relative}
fabric-breadcrumb .ms-Breadcrumb-overflow .ms-Breadcrumb-overflowButton-alt{font-size:16px;display:inline-block;color:#0078d7;padding:8px;cursor:pointer;vertical-align:top}
fabric-breadcrumb .ms-Breadcrumb-overflow .ms-Breadcrumb-overflowButton{font-size:24px;line-height:4px;font-weight:lighter;display:inline-block;color:#0078d7;padding:8px;cursor:pointer;vertical-align:top}
fabric-breadcrumb .ms-Breadcrumb-overflowMenu{display:none;position:absolute}
fabric-breadcrumb .ms-Breadcrumb-overflowMenu.is-open{display:block;top:36px;left:0;box-shadow:0 0 5px 0 rgba(0,0,0,.4);background-color:#fff;border:1px solid #c8c8c8;z-index:105}
fabric-breadcrumb .ms-Breadcrumb-overflowMenu:before{position:absolute;box-shadow:0 0 5px 0 rgba(0,0,0,.4);top:-6px;left:6px;content:" ";width:16px;height:16px;transform:rotate(45deg);background-color:#fff}
fabric-breadcrumb .ms-Breadcrumb-overflowMenu .ms-ContextualMenu{border:0;box-shadow:none;position:relative;width:190px}
fabric-breadcrumb .ms-Breadcrumb-overflowMenu .ms-ContextualMenu.is-open{margin-bottom:0}
fabric-breadcrumb .ms-Breadcrumb-itemLink,
fabric-breadcrumb .ms-Breadcrumb-overflowButton{text-decoration:none;outline:transparent}
fabric-breadcrumb .ms-Breadcrumb-itemLink:hover,
fabric-breadcrumb .ms-Breadcrumb-overflowButton:hover{background-color:#f4f4f4;cursor:pointer}
fabric-breadcrumb .ms-Breadcrumb-itemLink:focus,
fabric-breadcrumb .ms-Breadcrumb-overflowButton:focus{outline:1px solid #767676;color:#000}
fabric-breadcrumb .ms-Breadcrumb-itemLink:active,
fabric-breadcrumb .ms-Breadcrumb-overflowButton:active{outline:transparent;background-color:#c8c8c8}
fabric-breadcrumb .ms-Breadcrumb-itemLink{font-weight:100;font-size:21px;color:#333;display:inline-block;padding:0 4px;max-width:160px;white-space:nowrap;
text-overflow:ellipsis;overflow:hidden;vertical-align:top}
@media screen and (max-width:639px){
    fabric-breadcrumb .ms-Breadcrumb{margin:10px 0}
    fabric-breadcrumb .ms-Breadcrumb-itemLink{font-size:17px}
    fabric-breadcrumb .ms-Breadcrumb-chevron{font-size:10px;margin:9px 3px}
    fabric-breadcrumb .ms-Breadcrumb-overflow .ms-Breadcrumb-overflowButton{font-size:16px;padding:2px 0}
}
@media screen and (max-width:479px){
    fabric-breadcrumb .ms-Breadcrumb-itemLink{font-size:14px;max-width:116px}
    fabric-breadcrumb .ms-Breadcrumb-chevron{margin:5px 4px}
    fabric-breadcrumb .ms-Breadcrumb-overflow .ms-Breadcrumb-overflowButton{padding:2px 4px}
}

fabric-breadcrumb .chevron::before {
	border-style: solid;
	border-width: 0.15em 0.15em 0 0;
	content: '';
	display: inline-block;
	height: 0.45em;
	left: 0.25em;
	position: relative;
	top: 0.25em;
	transform: rotate(-45deg);
	vertical-align: top;
	width: 0.45em;
}
fabric-breadcrumb .chevron.right:before { left: 0; transform: rotate(45deg); }
`;
    d.head.appendChild(style);
})(window, document);
