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
var FabricTabs = (function (_super) {
    __extends(FabricTabs, _super);
    function FabricTabs() {
        var _this = _super.call(this) || this;
        _this._links = [];
        _this._tabs = false;
        _this._large = false;
        _this._ellipsis = false;
        _this._selected = null;
        _this._refs = {};
        return _this;
    }
    Object.defineProperty(FabricTabs.prototype, "links", {
        get: function () { return this._links; },
        set: function (value) { if (JSON.stringify(value) === JSON.stringify(this._links))
            return; this._links = value; this.__setProperties('links'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTabs.prototype, "selected", {
        get: function () { return this._selected; },
        set: function (value) {
            if (value === this.selected)
                return;
            this._selected = value;
            this.__setProperties('selected');
            try {
                this.dispatchEvent(new CustomEvent('onTabSelected', {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        selected: this._selected
                    }
                }));
            }
            catch (e) {
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent('onTabSelected', true, true, {
                    'selected': this._selected
                });
                this.dispatchEvent(evt);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTabs.prototype, "tabs", {
        get: function () { return this._tabs; },
        set: function (value) { if (!!value === this._tabs)
            return; this._tabs = value; this.__setProperties('tabs'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTabs.prototype, "large", {
        get: function () { return this._large; },
        set: function (value) { if (!!value === this._large)
            return; this._large = value; this.__setProperties('large'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTabs.prototype, "ellipsis", {
        get: function () { return this._ellipsis; },
        set: function (value) { if (!!value === this._ellipsis)
            return; this._ellipsis = value; this.__setProperties('ellipsis'); },
        enumerable: false,
        configurable: true
    });
    FabricTabs.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricTabs.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-Tabs\">\n\t\t  <ul class=\"ms-Tabs-links\">\n\t\t\t<li class=\"ms-Tabs-link ms-Tabs-ellipsis hidden\" tabindex=\"1\"><i>\u2026</i></li>\n\t\t  </ul>\n\t\t</div>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-Tabs'),
            links: this.querySelector('.ms-Tabs-links'),
            ellipsis: this.querySelector('.ms-Tabs-link.ms-Tabs-ellipsis')
        };
    };
    FabricTabs.prototype.__setProperties = function (property) {
        var _this = this;
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'tabs') {
            this._refs.container.classList[(this._tabs) ? 'add' : 'remove']('ms-Tabs--tabs');
        }
        if (property == null || property === 'large') {
            this._refs.container.classList[(this._large) ? 'add' : 'remove']('ms-Tabs--large');
        }
        if ((property == null || property === 'ellipsis') && this._refs.ellipsis) {
            this._refs.ellipsis.classList[(this._ellipsis) ? 'remove' : 'add']('hidden');
        }
        if (property == null || property === 'selected') {
            var previous = (this._refs.links) ? this._refs.links.querySelector('.is-selected') : null;
            if (previous)
                previous.classList.remove('is-selected');
            var selection = (this._refs.links) ? this._refs.links.querySelector('[data-content="' + this._selected + '"]') : null;
            if (selection)
                selection.classList.add('is-selected');
        }
        if (property == null || property === 'links') {
            if (!Array.isArray(this._links) || this._links.length == 0)
                return;
            var previousLinks = (this._refs.links) ? this._refs.links.querySelectorAll('.ms-Tabs-link:not(.ms-Tabs-ellipsis)') : [];
            if (this._refs.links && previousLinks && previousLinks.length > 0) {
                [].forEach.call(previousLinks, function (entry) {
                    _this._refs.links.removeChild(entry);
                });
            }
            var li = null;
            [].concat(this.links).forEach(function (entry) {
                li = document.createElement('LI');
                li.tabIndex = 1;
                li.classList.add('ms-Tabs-link');
                li.title = li.textContent = entry.text || '';
                li.dataset.content = entry.name || '';
                if (entry.disabled === true)
                    li.classList.add('is-disabled');
                if (entry.name === _this.selected)
                    li.classList.add('is-selected');
                if (_this._refs.links)
                    _this._refs.links.insertBefore(li, _this._refs.ellipsis);
            });
        }
    };
    FabricTabs.prototype.__addListeners = function () {
        var _this = this;
        if (this._refs.links)
            this._refs.links.addEventListener('click', function (event) {
                console.log('clicked');
                if (!event.target || !event.target.tagName.toLowerCase() === 'li')
                    return;
                if (event.target.classList.contains('is-disabled'))
                    return;
                var selected = event.target.dataset.content;
                if (!selected)
                    return;
                _this.selected = selected;
            });
    };
    Object.defineProperty(FabricTabs, "observedAttributes", {
        get: function () {
            return [
                'selected',
                'links',
                'tabs',
                'large',
                'ellipsis'
            ];
        },
        enumerable: false,
        configurable: true
    });
    FabricTabs.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (oldValue === newValue || newValue === this[attr])
            return;
        var n = newValue;
        if (attr === 'links') {
            try {
                n = JSON.parse(newValue);
            }
            catch (e) { }
        }
        else if (attr === 'selected') {
            this.selected = n;
        }
        else {
            n = this.hasAttribute(attr);
        }
        this[attr] = n;
    };
    return FabricTabs;
}(HTMLElement));
window.customElements.define('fabric-tabs', FabricTabs);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-tabs{display:block}\n.ms-Tabs{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;font-size:14px;font-weight:400}\n.ms-Tabs-links{font-size:0;height:40px;list-style-type:none;padding:0;white-space:nowrap}\n.ms-Tabs-link{color:#333;display:inline-block;font-size:14px;font-weight:400;line-height:40px;margin-right:8px;padding:0 8px;text-align:center;vertical-align:top}\n.ms-Tabs-link:hover{cursor:pointer}\n.ms-Tabs-link:before{background-color:transparent;bottom:0;content:\"\";height:2px;left:8px;position:absolute;right:8px;/*transition:background-color .267s cubic-bezier(.1,.25,.75,.9)*/}\n.ms-Tabs-link:after{color:transparent;content:attr(title);display:block;font-weight:700;height:1px;overflow:hidden;visibility:hidden}\n.ms-Tabs-link.is-selected{font-weight:600;position:relative}\n.ms-Tabs-link.is-selected:before{background-color:#0078d7}\n.ms-Tabs-link.is-disabled{color:#a6a6a6}\n.ms-Tabs-link.ms-Tabs-link--overflow{color:#666}\n.ms-Tabs-link.ms-Tabs-link--overflow.is-selected{color:#0078d7}\n.ms-Tabs-link.ms-Tabs-link--overflow:focus:not(.is-selected),.ms-Tabs-link.ms-Tabs-link--overflow:hover:not(.is-selected){color:#212121}\n.ms-Tabs-link.ms-Tabs-link--overflow:active{color:#0078d7}\n.ms-Tabs-ellipsis > i{font-size:15px;position:relative;top:0} \n.ms-Tabs-link.ms-Tabs-ellipsis.hidden {display:none}\n.ms-Tabs.ms-Tabs--large .ms-Tabs-link{font-size:17px}\n.ms-Tabs.ms-Tabs--large .ms-Tabs-link.is-selected{font-weight:300}\n.ms-Tabs.ms-Tabs--large .ms-Tabs-link.ms-Tabs-link--overflow:after{font-size:17px}\n.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link{height:40px;background-color:#f4f4f4;line-height:40px;margin-right:-2px;padding:0 10px}\n.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link:focus:not(.is-selected):not(.ms-Tabs-link--overflow),.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link:hover:not(.is-selected):not(.ms-Tabs-link--overflow){color:#000}\n.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link:active{color:#fff;background-color:#0078d7}\n.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.is-selected{background-color:#0078d7;color:#fff;font-weight:300}\n.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.ms-Tabs-link--overflow:focus:not(.is-selected),.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.ms-Tabs-link--overflow:hover:not(.is-selected){background-color:#fff}\n.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.ms-Tabs-link--overflow:active{background-color:#0078d7}\n@media screen and (-ms-high-contrast:active){.ms-Tabs.ms-Tabs--tabs .ms-Tabs-link.is-selected{font-weight:600}\n}";
    d.head.appendChild(style);
})(window, document);
