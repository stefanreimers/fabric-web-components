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
var FabricPivot = (function (_super) {
    __extends(FabricPivot, _super);
    function FabricPivot() {
        var _this = _super.call(this) || this;
        _this._refs = {};
        _this._tabs = false;
        _this._large = false;
        return _this;
    }
    Object.defineProperty(FabricPivot.prototype, "tabs", {
        get: function () { return this._tabs; },
        set: function (value) { if (!!value === this._tabs)
            return; this._tabs = value; this.__setProperties('tabs'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricPivot.prototype, "large", {
        get: function () { return this._large; },
        set: function (value) { if (!!value === this._large)
            return; this._large = value; this.__setProperties('large'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricPivot.prototype, "links", {
        get: function () { return (this._refs && this._refs.links) ? this._refs.links.links : null; },
        set: function (value) { throw Error('Links / tabs cannot be set directly'); },
        enumerable: false,
        configurable: true
    });
    FabricPivot.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
        var first = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content') : null;
        if (this._refs.links && first)
            this._refs.links.selected = first.dataset.name;
    };
    FabricPivot.prototype.disconnectedCallback = function () {
    };
    FabricPivot.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-Pivot\">\n\t\t  <fabric-tabs class=\"ms-Pivot-links\"></fabric-tabs>\n\t\t  <div class=\"ms-Pivot-content-container\"/>\n\t\t</div>";
        if (this.children && this.children.length > 0) {
            var div = document.createElement('DIV');
            div.innerHTML = markup;
            var contentContainer = div.querySelector('.ms-Pivot-content-container');
            if (contentContainer) {
                while (this.children.length > 0) {
                    if (this.children[0].dataset.name == undefined || this.children[0].dataset.text == undefined)
                        this.removeChild(this.children[0]);
                    this.children[0].classList.add('ms-Pivot-content');
                    contentContainer.appendChild(this.children[0]);
                }
            }
            this.appendChild(div.children[0]);
        }
        else {
            this.innerHTML = markup;
        }
        this._refs = {
            container: this.querySelector('.ms-Pivot'),
            links: this.querySelector('.ms-Pivot-links'),
            content: this.querySelector('.ms-Pivot-content-container')
        };
        this.__updateTabs();
    };
    FabricPivot.prototype.__setProperties = function (property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'tabs') {
            this._refs.links.tabs = this._tabs;
        }
        if (property == null || property === 'large') {
            this._refs.links.large = this._large;
        }
    };
    FabricPivot.prototype.__addListeners = function () {
        var _this = this;
        if (this._refs.links)
            this._refs.links.addEventListener('onTabSelected', function (event) {
                if (event.detail && event.detail.selected)
                    _this.show(event.detail.selected);
            });
    };
    FabricPivot.prototype.show = function (name) {
        var visible = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content.visible') : null;
        if (visible)
            visible.classList.remove('visible');
        var toShow = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content[data-name="' + name + '"]') : null;
        if (toShow)
            toShow.classList.add('visible');
    };
    FabricPivot.prototype.__updateTabs = function () {
        var tabs = (this._refs.content) ? this._refs.content.querySelectorAll('.ms-Pivot-content') : null;
        if (tabs && this._refs.links) {
            var links_1 = [];
            [].forEach.call(tabs, function (tab) {
                links_1.push({ text: tab.dataset.text, name: tab.dataset.name, disabled: false });
            });
            this._refs.links.links = links_1;
        }
    };
    Object.defineProperty(FabricPivot, "observedAttributes", {
        get: function () {
            return ['tabs', 'large'];
        },
        enumerable: false,
        configurable: true
    });
    FabricPivot.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (oldValue === newValue || newValue === this[attr])
            return;
        this[attr] = this.hasAttribute(attr);
    };
    return FabricPivot;
}(HTMLElement));
window.customElements.define('fabric-pivot', FabricPivot);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-pivot {display: inline-block}\n.ms-Pivot{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;font-size:14px;font-weight:400;overflow:hidden}\n.ms-Pivot-content{display:none;margin-top:20px}\n.ms-Pivot-content.visible{display:block;overflow:auto;position:absolute;top:0;bottom:0;left:0;right:0}\n.ms-Pivot-content-container {position: relative; flex: 1 1 auto !important;}\n.ms-Pivot {\n    display: flex;\n    flex-direction: column;\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n    align-content: stretch;\n    align-items: stretch;\n}\n.ms-Pivot > * {order: 0; flex: 0 1 auto; align-self: auto;}\n";
    d.head.appendChild(style);
})(window, document);
