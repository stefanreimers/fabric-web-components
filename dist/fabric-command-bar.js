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
var FabricCommandBar = (function (_super) {
    __extends(FabricCommandBar, _super);
    function FabricCommandBar() {
        var _this = _super.call(this) || this;
        _this._navbar = false;
        _this._disabled = false;
        _this._refs = {};
        return _this;
    }
    FabricCommandBar.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__addListeners();
        this.__setProperties();
    };
    Object.defineProperty(FabricCommandBar.prototype, "navbar", {
        get: function () { return this._navbar; },
        set: function (value) { if (!!value === this._navbar)
            return; this._navbar = !!value; this.__setProperties('navbar'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricCommandBar.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (!!value === this._disabled)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: false,
        configurable: true
    });
    FabricCommandBar.prototype.__setupUI = function () {
        var _this = this;
        var container = document.createElement('div');
        var markup = "<div class=\"ms-CommandBar\">\n\t\t\t<div class=\"ms-CommandBar-sideCommands\"></div>\n\t\t\t<div class=\"ms-CommandBar-mainArea\"></div>\n\t\t</div>";
        container.innerHTML = markup;
        this.appendChild(container.children[0]);
        this._refs = {
            container: this.querySelector('.ms-CommandBar'),
            main: this.querySelector('.ms-CommandBar-mainArea'),
            side: this.querySelector('.ms-CommandBar-sideCommands')
        };
        [].forEach.call(this.querySelectorAll('fabric-command-button'), function (f) {
            _this._refs[(f.classList.contains('side')) ? 'side' : 'main'].appendChild(f);
        });
    };
    FabricCommandBar.prototype.__setProperties = function (property) {
        if (!this._refs.container)
            return;
        if (property == null || property === 'navbar') {
            this._refs.container.classList[(this.disabled === true) ? 'add' : 'remove']('is-disabled');
        }
    };
    FabricCommandBar.prototype.__addListeners = function () {
        this.addEventListener('fabric-command-button-init', function (e) {
            console.info('FabricCommandBar fabric-command-button-init', e.target);
        });
    };
    Object.defineProperty(FabricCommandBar, "observedAttributes", {
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    FabricCommandBar.prototype.attributeChangedCallback = function (attrName, oldValue, newValue) {
        var n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    };
    return FabricCommandBar;
}(HTMLElement));
window.customElements.define('fabric-command-bar', FabricCommandBar);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = ".ms-CommandBar{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;\n-webkit-font-smoothing:antialiased;background-color:#f4f4f4;height:40px;white-space:nowrap;padding-left:0;border:0;position:relative}\n.ms-CommandBar:focus{outline:none}\n.ms-CommandBar .ms-CommandButton--actionButton{border-right:1px solid #eaeaea}\n.ms-CommandBar .ms-Button{height:100%}\n.ms-CommandBar .ms-Button.ms-Button--noLabel .ms-Button-icon{padding-right:0}\n.ms-CommandBar .ms-Button.is-hidden{display:none}\n.ms-CommandBar .ms-SearchBox,.ms-CommandBar .ms-SearchBox-field,.ms-CommandBar .ms-SearchBox-label{height:100%}\n.ms-CommandBar .ms-SearchBox{display:inline-block;vertical-align:top;transition:margin-right .267s}\n.ms-CommandBar .ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active{width:220px}\n@media only screen and (max-width:639px){\n\t.ms-CommandBar .ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active{width:100%;position:absolute;left:0;right:0;z-index:10}\n}\n.ms-CommandBar .ms-CommandBar-overflowButton .ms-CommandButton-button{font-size:18px;padding:0 11px}\n@media only screen and (min-width:1024px){\n\t.ms-CommandBar .ms-SearchBox{margin-right:24px}\n}\n@media only screen and (max-width:639px){\n\t.ms-CommandBar{height:44px}\n}\n@media only screen and (min-width:640px){\n\t.ms-CommandBar.search-expanded .ms-SearchBox{margin-right:8px}\n\t.ms-CommandBar .ms-SearchBox.ms-SearchBox--commandBar.is-collapsed{transition:none}\n}\n.ms-CommandBar-mainArea{overflow-x:hidden;display:block;height:100%;overflow:hidden}\n.ms-CommandBar-sideCommands{float:right;text-align:right;width:auto;padding-right:4px;height:100%}\n.ms-CommandBar-sideCommands .ms-Button:last-child{margin-right:0}\n@media only screen and (min-width:640px){\n\t.ms-CommandBar-sideCommands{min-width:128px}\n}\n@media only screen and (min-width:1024px){\n\t.ms-CommandBar-sideCommands{padding-right:20px}\n}\n.ms-CommandBar-mainArea:empty, .ms-CommandBar-sideCommands:empty{display: none}\nfabric-command-bar > fabric-command-button{display:none}";
    d.head.appendChild(style);
})(window, document);
