"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FabricBreadcrumb = (function (_super) {
    __extends(FabricBreadcrumb, _super);
    function FabricBreadcrumb() {
        var _this = _super.call(this) || this;
        _this.MEDIUM = 639;
        _this._tabIndex = 2;
        _this._currentMaxItems = 0;
        _this._items = [];
        _this._refs = {};
        _this._onResize = _this._onResize.bind(_this);
        _this._openOverflow = _this._openOverflow.bind(_this);
        _this._overflowKeyPress = _this._overflowKeyPress.bind(_this);
        _this._closeOverflow = _this._closeOverflow.bind(_this);
        _this.removeOutlinesOnClick = _this.removeOutlinesOnClick.bind(_this);
        return _this;
    }
    Object.defineProperty(FabricBreadcrumb.prototype, "items", {
        get: function () { return this._items; },
        set: function (value) { throw new RangeError('Please set items via component methods.'); },
        enumerable: false,
        configurable: true
    });
    FabricBreadcrumb.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setListeners();
        this.__createItemCollection();
        this._onResize();
    };
    FabricBreadcrumb.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-Breadcrumb\">\n        <div class=\"ms-Breadcrumb-overflow\">\n            <div class=\"ms-Breadcrumb-overflowButton ms-Icon ms-Icon--More\">...</div>\n            <div class=\"ms-Breadcrumb-overflowMenu\">\n            <ul class=\"ms-ContextualMenu \"></ul>\n            </div>\n            <i class=\"ms-Breadcrumb-chevron ms-Icon chevron right ms-Icon--ChevronRight\"></i>\n        </div>\n        <ul class=\"ms-Breadcrumb-list\">\n        </ul>\n        </div>";
        if (this.children && this.children.length > 0) {
            var tempItems = [];
            while (this.children.length > 0) {
                if (this.children[0].tagName.toLowerCase() === 'a') {
                    var x = { text: this.children[0].innerText };
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
    };
    FabricBreadcrumb.prototype.__setListeners = function () {
        window.addEventListener("resize", this._onResize, !1),
            this._refs.overflowButton.addEventListener("click", this._openOverflow, !1),
            this._refs.overflowButton.addEventListener("keypress", this._overflowKeyPress, !1),
            document.addEventListener("click", this._closeOverflow, !1),
            this._refs.list.addEventListener("click", this.removeOutlinesOnClick, !1);
    };
    FabricBreadcrumb.prototype.__setProperties = function (property) {
        if (!this._refs.container)
            return;
        if (property == null || property === 'items') {
            this._updateBreadcrumbs();
        }
    };
    Object.defineProperty(FabricBreadcrumb, "observedAttributes", {
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    FabricBreadcrumb.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        var n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    };
    FabricBreadcrumb.prototype.removeOutlinesOnClick = function (e) {
        this._refs.list && this._refs.list.blur();
    };
    FabricBreadcrumb.prototype.addItem = function (e, t) {
        this._items.push({ text: e, link: t }),
            this._updateBreadcrumbs();
    };
    FabricBreadcrumb.prototype.removeItemByLabel = function (e) {
        for (var t = this._items.length; t--;)
            this._items[t].text === e && this._items.splice(t, 1);
        this._updateBreadcrumbs();
    };
    FabricBreadcrumb.prototype.removeItemByPosition = function (e) {
        this._items.splice(e, 1),
            this._updateBreadcrumbs();
    };
    FabricBreadcrumb.prototype._resetList = function (e) {
        for (; e.firstChild;)
            e.removeChild(e.firstChild);
    };
    FabricBreadcrumb.prototype._openOverflow = function (e) {
        this._refs.overflowMenu.className.indexOf(" is-open") === -1 && (this._refs.overflowMenu.classList.add("is-open"),
            this.removeOutlinesOnClick(),
            this._refs.overflowButton.focus());
    };
    FabricBreadcrumb.prototype._overflowKeyPress = function (e) {
        13 === e.keyCode && this._openOverflow(e);
    };
    FabricBreadcrumb.prototype._closeOverflow = function (e) {
        e && e.target === this._refs.overflowButton || this._refs.overflowMenu.classList.remove("is-open");
    };
    FabricBreadcrumb.prototype.__createItemCollection = function () {
        var e, t, i, n, s, o;
        var _listItems = this._refs.list.querySelectorAll(".ms-Breadcrumb-listItem");
        s = _listItems.length,
            o = 0;
        for (o; o < s; o++)
            e = _listItems[o].querySelector(".ms-Breadcrumb-itemLink"),
                t = e.textContent,
                i = e.getAttribute("href"),
                n = parseInt(e.getAttribute("tabindex"), 10),
                this._items.push({ link: i, tabIndex: n, text: t });
    };
    FabricBreadcrumb.prototype._sanitize = function (html) {
        var e = document.createElement('div');
        e.innerText = html;
        return e.innerHTML;
    };
    FabricBreadcrumb.prototype._onResize = function () {
        this._closeOverflow(null),
            this._renderList();
    };
    FabricBreadcrumb.prototype._renderList = function () {
        var t = window.innerWidth > this.MEDIUM ? 4 : 2;
        t !== this._currentMaxItems && this._updateBreadcrumbs(),
            this._currentMaxItems = t;
    };
    FabricBreadcrumb.prototype._updateBreadcrumbs = function () {
        this._tabIndex = 2;
        var t = window.innerWidth > this.MEDIUM ? 4 : 2;
        this._items.length > t ? this._refs.container.classList.add("is-overflow") : this._refs.container.classList.remove("is-overflow"),
            this._addItemsToOverflow(t),
            this._addBreadcrumbItems(t);
    };
    FabricBreadcrumb.prototype._addItemsToOverflow = function (e) {
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
    };
    FabricBreadcrumb.prototype._addBreadcrumbItems = function (e) {
        this._resetList(this._refs.list);
        var t = this._items.length - e;
        if (t = t < 0 ? 0 : t, t >= 0)
            for (t; t < this._items.length; t++) {
                var n = this._items[t];
                var container = document.createElement('div');
                container.innerHTML = "\n        <li class=\"ms-Breadcrumb-listItem\">\n          <a class=\"ms-Breadcrumb-itemLink\" " + ((n.link) ? 'href="' + n.link + '"' : '') + ">" + this._sanitize(n.text) + "</a> \n          <svg  class=\"ms-Breadcrumb-chevron chevron right ms-Icon ms-Icon--ChevronRight\"\n          xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 12 12\" height=\"12\" width=\"12\">\n            <g transform=\"translate(-6.7008429,-1035.2699)\">\n              <g transform=\"matrix(0.24251286,0,0,0.24251286,-104.3292,905.33618)\">\n                <path style=\"fill:#666666;stroke:none\"\n                  d=\"m 497.44535,557.75486 -24.64454,24.64453 2.86328,2.86328 24.64454,-24.64453 -2.86328,-2.86328 z\" />\n                <path style=\"fill:#666666;stroke:none\"\n                  d=\"m 475.66409,535.7821 24.64454,24.64453 -2.86328,2.86328 -24.64454,-24.64453 2.86328,-2.86328 z\" />\n              </g>\n            </g>\n          </svg>\n        </li>";
                this._refs.list.appendChild(container.children[0]);
            }
    };
    return FabricBreadcrumb;
}(HTMLElement));
window.customElements.define('fabric-breadcrumb', FabricBreadcrumb);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-breadcrumb .ms-Breadcrumb{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;\n    -webkit-font-smoothing:antialiased;margin:23px 0 1px}\nfabric-breadcrumb .ms-Breadcrumb.is-overflow .ms-Breadcrumb-overflow{display:inline-block;margin-right:-4px}\nfabric-breadcrumb .ms-Breadcrumb-chevron-alt{font-size:12px;color:#666;vertical-align:top;margin:13px 4px;line-height:1}\nfabric-breadcrumb .ms-Breadcrumb-chevron{font-size:12px;height:12px;width:12px;color:#999;vertical-align:top;margin:11px 4px;line-height:1}\nfabric-breadcrumb .ms-Breadcrumb-list{display:inline;white-space:nowrap;padding:0;margin:0}\nfabric-breadcrumb .ms-Breadcrumb-list .ms-Breadcrumb-listItem{list-style-type:none;vertical-align:top;margin:0;padding:0;display:inline-block}\nfabric-breadcrumb .ms-Breadcrumb-list .ms-Breadcrumb-listItem:last-of-type .ms-Breadcrumb-chevron{display:none}\nfabric-breadcrumb .ms-Breadcrumb-overflow{display:none;position:relative}\nfabric-breadcrumb .ms-Breadcrumb-overflow .ms-Breadcrumb-overflowButton-alt{font-size:16px;display:inline-block;color:#0078d7;padding:8px;cursor:pointer;vertical-align:top}\nfabric-breadcrumb .ms-Breadcrumb-overflow .ms-Breadcrumb-overflowButton{font-size:24px;line-height:4px;font-weight:lighter;display:inline-block;color:#0078d7;padding:8px;cursor:pointer;vertical-align:top}\nfabric-breadcrumb .ms-Breadcrumb-overflowMenu{display:none;position:absolute}\nfabric-breadcrumb .ms-Breadcrumb-overflowMenu.is-open{display:block;top:36px;left:0;box-shadow:0 0 5px 0 rgba(0,0,0,.4);background-color:#fff;border:1px solid #c8c8c8;z-index:105}\nfabric-breadcrumb .ms-Breadcrumb-overflowMenu:before{position:absolute;box-shadow:0 0 5px 0 rgba(0,0,0,.4);top:-6px;left:6px;content:\" \";width:16px;height:16px;transform:rotate(45deg);background-color:#fff}\nfabric-breadcrumb .ms-Breadcrumb-overflowMenu .ms-ContextualMenu{border:0;box-shadow:none;position:relative;width:190px}\nfabric-breadcrumb .ms-Breadcrumb-overflowMenu .ms-ContextualMenu.is-open{margin-bottom:0}\nfabric-breadcrumb .ms-Breadcrumb-itemLink,\nfabric-breadcrumb .ms-Breadcrumb-overflowButton{text-decoration:none;outline:transparent}\nfabric-breadcrumb .ms-Breadcrumb-itemLink:hover,\nfabric-breadcrumb .ms-Breadcrumb-overflowButton:hover{background-color:#f4f4f4;cursor:pointer}\nfabric-breadcrumb .ms-Breadcrumb-itemLink:focus,\nfabric-breadcrumb .ms-Breadcrumb-overflowButton:focus{outline:1px solid #767676;color:#000}\nfabric-breadcrumb .ms-Breadcrumb-itemLink:active,\nfabric-breadcrumb .ms-Breadcrumb-overflowButton:active{outline:transparent;background-color:#c8c8c8}\nfabric-breadcrumb .ms-Breadcrumb-itemLink{font-weight:100;font-size:21px;color:#333;display:inline-block;padding:0 4px;max-width:160px;white-space:nowrap;\ntext-overflow:ellipsis;overflow:hidden;vertical-align:top}\n@media screen and (max-width:639px){\n  fabric-breadcrumb .ms-Breadcrumb{margin:10px 0}\n  fabric-breadcrumb .ms-Breadcrumb-itemLink{font-size:17px}\n  fabric-breadcrumb .ms-Breadcrumb-chevron{font-size:10px;height:10px;width:10px;margin:7px 3px}\n  fabric-breadcrumb .ms-Breadcrumb-overflow .ms-Breadcrumb-overflowButton{font-size:16px;padding:2px 0}\n}\n@media screen and (max-width:479px){\n  fabric-breadcrumb .ms-Breadcrumb-itemLink{font-size:14px;max-width:116px}\n  fabric-breadcrumb .ms-Breadcrumb-chevron{margin:5px 3px}\n  fabric-breadcrumb .ms-Breadcrumb-overflow .ms-Breadcrumb-overflowButton{padding:2px 4px}\n}\n\nfabric-breadcrumb .chevron::before {\n\tborder-style: solid;\n\tborder-width: 0.15em 0.15em 0 0;\n\tcontent: '';\n\tdisplay: inline-block;\n\theight: 0.45em;\n\tleft: 0.25em;\n\tposition: relative;\n\ttop: 0.25em;\n\ttransform: rotate(-45deg);\n\tvertical-align: top;\n\twidth: 0.45em;\n}\nfabric-breadcrumb .chevron.right:before { left: 0; transform: rotate(45deg); }\n";
    d.head.appendChild(style);
})(window, document);
