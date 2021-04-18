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
var FabricSearch = (function (_super) {
    __extends(FabricSearch, _super);
    function FabricSearch() {
        var _this = _super.call(this) || this;
        _this._refs = {};
        _this._disabled = false;
        _this._modifier = null;
        _this._label = '';
        _this._icon = '';
        _this._timer = null;
        return _this;
    }
    Object.defineProperty(FabricSearch.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { this._label = value; this.__setProperties('label'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSearch.prototype, "icon", {
        get: function () { return this._icon; },
        set: function (value) { this._icon = value; this.__setProperties('icon'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSearch.prototype, "modifier", {
        get: function () { return this._modifier; },
        set: function (value) { throw new RangeError('The modifier property is static.'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSearch.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSearch.prototype, "value", {
        get: function () { return (this._refs.input) ? this._refs.input.value : null; },
        set: function (val) { if (this._refs.input && val != this.value)
            this._refs.input.value = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSearch.prototype, "timer", {
        get: function () { return this._timer; },
        set: function (value) {
            var val = (typeof value === 'string') ? Math.floor(parseInt(value, 10)) : value;
            if (value == null || typeof val === 'number') {
                if (this._timer == value)
                    return;
                this._timer = value;
                this.__setProperties('timer');
            }
            else {
                throw RangeError('timer must be a number');
            }
        },
        enumerable: false,
        configurable: true
    });
    FabricSearch.prototype.connectedCallback = function () {
        this.__getStaticAttributes();
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricSearch.prototype.__setupUI = function () {
        var modifier = (this._modifier) ? 'ms-SearchBox--' + this._modifier : '';
        var markup = "<div class=\"ms-SearchBox " + modifier + "\">\n\t\t  <input class=\"ms-SearchBox-field\" type=\"text\" value=\"\">\n\t\t  <label class=\"ms-SearchBox-label\">\n\t\t\t<i class=\"ms-SearchBox-icon ms-Icon--Search ms-Icon\"></i>\n\t\t\t<span class=\"ms-SearchBox-text\"></span>\n\t\t  </label>\n\t\t  <div class=\"ms-CommandButton ms-SearchBox-clear ms-CommandButton--noLabel is-hidden\">\n\t\t\t  <button class=\"ms-CommandButton-button\" tabIndex=\"-1\">\n\t\t\t\t<span class=\"ms-CommandButton-icon\"><i class=\"ms-Icon ms-Icon--Clear\"></i></span>\n\t\t\t\t<span class=\"ms-CommandButton-label\"></span>\n\t\t\t  </button>\n\t\t  </div>\n\t\t</div>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-SearchBox'),
            input: this.querySelector('.ms-SearchBox-field'),
            icon: this.querySelector('.ms-SearchBox-icon'),
            label: this.querySelector('.ms-SearchBox-text'),
            clear: this.querySelector('.ms-CommandButton-button')
        };
    };
    FabricSearch.prototype.__setProperties = function (property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            if (this._refs.input)
                this._refs.input.disabled = this._disabled;
            this._refs.container.classList[(this._disabled) ? 'add' : 'remove']('is-disabled');
        }
        if (property == null || property === 'label') {
            if (this._refs.label)
                this._refs.label.textContent = this._label;
        }
    };
    FabricSearch.prototype.__setHasText = function () {
        this._refs.container.classList[(this._refs.input.value != null && this._refs.input.value !== "") ? 'add' : 'remove']('has-text');
    };
    FabricSearch.prototype.__search = function () {
        this.dispatchEvent(new CustomEvent('search', { detail: { query: this._refs.input.value }, bubbles: true, cancelable: true }));
    };
    FabricSearch.prototype.__addListeners = function () {
        var _this = this;
        if (this._refs.input)
            this._refs.input.addEventListener('input', function (e) {
                console.log('input', e);
                _this.__setHasText();
            });
        if (this._refs.clear)
            this._refs.clear.addEventListener('click', function (e) {
                _this._refs.input.value = null;
                _this.__setHasText();
                _this.__search();
                e.target.blur();
            });
        if (this._refs.input)
            this._refs.input.addEventListener("keydown", function (e) {
                var keyCode = e.keyCode;
                if (keyCode === 13) {
                    var value = _this._refs.input.value;
                    if (value != null && value !== '') {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.__search();
                    }
                }
            }, false);
    };
    FabricSearch.prototype.__getStaticAttributes = function () {
        var modifier = this.getAttribute('modifier');
        if (modifier && ['commandBar'].indexOf(modifier) !== -1)
            this._modifier = modifier;
        var host = this.getAttribute('host');
        if (host)
            this._host = host;
    };
    Object.defineProperty(FabricSearch, "observedAttributes", {
        get: function () {
            return ['icon', 'label'];
        },
        enumerable: false,
        configurable: true
    });
    FabricSearch.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (oldValue !== newValue)
            this[attr] = newValue;
    };
    return FabricSearch;
}(HTMLElement));
window.customElements.define('fabric-search', FabricSearch);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-search { display: block; margin-bottom: 10px }\nfabric-search .ms-Icon--Search { -webkit-filter: hue-rotate(220deg) saturate(100); filter: hue-rotate(220deg) saturate(5);  fill: #0078d7 }\n.ms-Icon--Search {background-image: url(\"data:image/svg+xml,%3C?xml version='1.0' encoding='UTF-8' standalone='no'?%3E%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' class='ms-Icon--Search' viewBox='0 0 48 48.000001' height='48' width='48'%3E%3Cdefs/%3E%3Cg transform='translate(0,-1004.3622)'%3E%3Cg fill='red' style='stroke:none' transform='matrix(0.64148279,0,0,0.64148279,26.413744,684.62217)'%3E%3Cpath style='stroke:none' d='m -9.203125,539.98633 -30.414063,30.41406 2.865235,2.86523 30.398437,-30.39843 a 25,25 0 0 1 -2.849609,-2.88086 z' /%3E%3Cpath style='stroke:none' d='m 7.0916734,500.25079 a 25,25 0 0 0 -25.0000004,25 25,25 0 0 0 25.0000004,25 25,25 0 0 0 24.9999996,-25 25,25 0 0 0 -24.9999996,-25 z m 0,4 a 21,21 0 0 1 20.9999996,21 21,21 0 0 1 -20.9999996,21 21,21 0 0 1 -21.0000004,-21 21,21 0 0 1 21.0000004,-21 z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")}\n.ms-Icon--Clear {background-image: url(\"data:image/svg+xml,%3C?xml version='1.0' encoding='UTF-8' standalone='no'?%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48.000001' height='48' width='48'%3E%3Cdefs/%3E%3Cg transform='translate(0,-1004.3622)'%3E%3Cg fill='white' transform='translate(114.04091,527.99014)'%3E%3Crect style='stroke:none' width='4.0501809' height='63.832069' x='288.12283' y='385.56897' transform='matrix(0.70710678,0.70710678,-0.70710678,0.70710678,0,0)' /%3E%3Crect style='stroke:none' width='4.0501809' height='63.832069' x='415.45993' y='258.2319' transform='matrix(-0.70710678,0.70710678,0.70710678,0.70710678,0,0)' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\");}\n.ms-Icon {background-size: 16px 16px;height: 16px;width: 16px;display: inline-block}\n.ms-SearchBox.has-text .ms-SearchBox-label{ display: none }\n.ms-SearchBox{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;height:36px;color:#333;font-size:14px;font-weight:400;position:relative;display:block;overflow:hidden;background-color:#fff}\n.ms-SearchBox.is-active{z-index:10}\n.ms-SearchBox.is-active .ms-SearchBox-label{display:none}\n.ms-SearchBox.is-active .ms-SearchBox-clear, .ms-SearchBox.has-text .ms-SearchBox-clear, .ms-SearchBox-field:focus ~ .ms-SearchBox-clear {display:block !important}\n.ms-SearchBox:hover{background-color:#deecf9}\n.ms-SearchBox:hover .ms-SearchBox-label{color:#000}\n.ms-SearchBox:hover .ms-SearchBox-label .ms-Icon{color:#333; -webkit-filter: grayscale(100%) brightness(500%) brightness(20%); filter: grayscale(100%) brightness(500%) brightness(20%) }\n.ms-SearchBox.is-disabled{background-color:#f4f4f4;pointer-events:none}\n.ms-SearchBox.is-disabled .ms-SearchBox-icon,.ms-SearchBox.is-disabled .ms-SearchBox-label{color:#a6a6a6}\n.ms-SearchBox.is-disabled .ms-SearchBox-field{color:#a6a6a6;background-color:transparent;border-color:#f4f4f4;cursor:default}\n.ms-SearchBox-clear{display:none;position:absolute;top:0;right:0;z-index:10}\n.ms-SearchBox-clear .ms-CommandButton-button{background-color:#0078d7;color:#fff;height:36px}\n.ms-SearchBox-clear .ms-CommandButton-icon{color:#fff}\n.ms-SearchBox-icon{position:relative;top:50%;transform:translateY(-50%);display:inline-block;font-size:16px;width:16px;margin-left:12px;margin-right:6px;color:#0078d7;vertical-align:top}\n.ms-SearchBox-icon.is-hidden {display: none}\n.ms-SearchBox-field{position:relative;box-sizing:border-box;margin:0;padding:0;box-shadow:none;border:1px solid #69afe5;outline:1px solid transparent;font-weight:300;font-size:14px;color:#000;height:36px;padding:6px 3px 7px 45px;width:100%;display:block;background-color:transparent;z-index:5;transition:padding-left .167s}\n.ms-SearchBox-field:focus{padding:6px 32px 7px 10px;border-color:#0078d7;background-color:#deecf9}\n.ms-SearchBox-field::-ms-clear{display:none}\n.ms-SearchBox-label{position:absolute;top:0;left:0;height:36px;line-height:36px;color:#666}\n.ms-SearchBox.ms-SearchBox--commandBar{background-color:#fff;width:208px;height:40px}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-label{height:40px}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field{transition:none;border:0}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field:focus{background-color:transparent;padding:6px 3px 7px 45px}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter{display:none;position:absolute;top:0;z-index:10;color:#a6a6a6}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter .ms-CommandButton-button{height:40px;background-color:transparent}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter{right:8px}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter .ms-CommandButton-icon{color:#0078d7}\n.ms-SearchBox.ms-SearchBox--commandBar:before{position:absolute;content:\" \";right:0;bottom:0;left:0;margin:0 8px;border-bottom:1px solid #eaeaea}\n.ms-SearchBox.ms-SearchBox--commandBar:hover{background-color:#fff}\n.ms-SearchBox.ms-SearchBox--commandBar:hover .ms-SearchBox-label{color:#212121}\n.ms-SearchBox.ms-SearchBox--commandBar:hover .ms-SearchBox-icon{color:#0078d7}\n.ms-SearchBox.ms-SearchBox--commandBar:focus{background-color:transparent}\n.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-CommandButton .ms-SearchBox-exit,.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-CommandButton .ms-SearchBox-filter{display:block}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed{width:50px;min-height:40px;z-index:0;background-color:#f4f4f4}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed .ms-SearchBox-text{display:none}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed .ms-SearchBox-field{cursor:pointer;width:calc(100% - 50px)}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed:before{visibility:hidden}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active{width:100%}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active .ms-SearchBox-field{display:block;cursor:text}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active .ms-SearchBox-text{display:inline-block}\n@media only screen and (max-width:639px){.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active{width:100%}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active .ms-SearchBox-clear{display:inline-block;right:58px}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active .ms-SearchBox-filter{display:inline-block}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active.is-animated{transition:width .167s cubic-bezier(.1,.9,.2,1)}\n}\n.ms-SearchBox.ms-SearchBox--commandBar.is-collapsed.is-active:before{visibility:visible}\n.ms-SearchBox.ms-SearchBox--commandBar.has-text .ms-SearchBox-clear{display:inline-block}\n.ms-SearchBox.ms-SearchBox--commandBar.has-text .ms-SearchBox-clear .ms-CommandButton-icon{color:#a6a6a6}\n.ms-SearchBox.ms-SearchBox--commandBar.has-text .ms-SearchBox-clear .ms-CommandButton-icon:active{color:#0078d7}\n@media only screen and (min-width:1024px){.ms-SearchBox.ms-SearchBox--commandBar{background-color:#fff;border-right:1px solid #eaeaea}\n}\n@media only screen and (max-width:639px){.ms-SearchBox.ms-SearchBox--commandBar{height:44px}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-icon,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-label{height:44px;line-height:44px}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-icon{font-size:20px}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-clear .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-exit .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-filter .ms-CommandButton-button,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-icon .ms-CommandButton-button{height:44px}\n.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-field,.ms-SearchBox.ms-SearchBox--commandBar .ms-SearchBox-label{font-size:16px}\n}\n.ms-SearchBox.ms-SearchBox--commandBar.is-active{background-color:#fff}\n.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-label{display:block;line-height:40px;height:40px}\n.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-label .ms-SearchBox-text{display:none}\n.ms-SearchBox.ms-SearchBox--commandBar.is-active:before{visibility:visible}\n@media only screen and (max-width:639px){.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-field{width:100%;padding-right:100px}\n.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-icon{display:none}\n.ms-SearchBox.ms-SearchBox--commandBar.is-active .ms-SearchBox-exit{display:inline-block}\n.ms-SearchBox.ms-SearchBox--commandBar.is-active.has-text .ms-SearchBox-filter .ms-CommandButton-icon{color:#a6a6a6}\n}\n@media only screen and (max-width:639px){.ms-CommandButton-button,.ms-CommandButton-splitIcon{height:44px}\n.ms-CommandButton-button .ms-CommandButton-icon,.ms-CommandButton-splitIcon .ms-CommandButton-icon{font-size:20px}\n.ms-CommandButton-button .ms-CommandButton-label,.ms-CommandButton-splitIcon .ms-CommandButton-label{line-height:44px}\n}\n.ms-CommandButton-button{border:0;margin:0}\n.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-icon{margin-right:0}\n.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-label{display:none}\n.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-button{padding:0 12px}";
    d.head.appendChild(style);
})(window, document);
