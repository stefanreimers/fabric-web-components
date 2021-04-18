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
var FabricToggle = (function (_super) {
    __extends(FabricToggle, _super);
    function FabricToggle() {
        var _this = _super.call(this) || this;
        _this._on = 'On';
        _this._off = 'Off';
        _this._description = '';
        _this._disabled = false;
        _this._textleft = false;
        _this._refs = {};
        _this._value = null;
        return _this;
    }
    Object.defineProperty(FabricToggle.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (this._disabled === !!value)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricToggle.prototype, "textleft", {
        get: function () { return this._textleft; },
        set: function (value) { if (this._textleft === !!value)
            return; this._textleft = !!value; this.__setProperties('textleft'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricToggle.prototype, "on", {
        get: function () { return this._on; },
        set: function (val) { if (val != this._on) {
            this._on = val;
            this.__setProperties('on');
        } },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricToggle.prototype, "off", {
        get: function () { return this._off; },
        set: function (val) { if (val != this._off) {
            this._off = val;
            this.__setProperties('off');
        } },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricToggle.prototype, "description", {
        get: function () { return this._description; },
        set: function (val) { if (val != this._description) {
            this._description = val;
            this.__setProperties('description');
        } },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricToggle.prototype, "value", {
        get: function () {
            if (this._value == null) {
                return (this._refs.label.classList.contains("is-selected")) ? this._on : this._off;
            }
            else {
                return (this._refs.label.classList.contains("is-selected")) ? this._value : null;
            }
        },
        set: function (val) { if (val === this._value || this.disabled)
            return; this._value = val; },
        enumerable: false,
        configurable: true
    });
    FabricToggle.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricToggle.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-Toggle\">\n\t\t  <span class=\"ms-Toggle-description\"></span>\n\t\t  <input type=\"checkbox\" class=\"ms-Toggle-input\" />\n\t\t  <label class=\"ms-Toggle-field\">\n\t\t\t<span class=\"ms-Label ms-Label--off\"></span>\n\t\t\t<span class=\"ms-Label ms-Label--on\"></span>\n\t\t  </label>\n\t\t</div>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-Toggle'),
            label: this.querySelector('.ms-Toggle-field'),
            on: this.querySelector('.ms-Label--on'),
            off: this.querySelector('.ms-Label--off'),
            description: this.querySelector('.ms-Toggle-description')
        };
    };
    FabricToggle.prototype.__setProperties = function (property) {
        var _this = this;
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            if (this._disabled === false) {
                this._refs.label.setAttribute("tabindex", "0");
            }
            else {
                this._refs.label.removeAttribute("tabindex");
            }
        }
        if (property == null || property === 'textleft') {
            this._refs.container.classList[(!!this._textleft) ? 'add' : 'remove']('ms-Toggle--textLeft');
        }
        ['on', 'off', 'description'].forEach(function (prop) {
            if (property == null || property === prop) {
                _this._refs[prop].textContent = _this[prop] || '';
            }
        });
    };
    FabricToggle.prototype.__addListeners = function () {
        var _this = this;
        if (this._refs.label) {
            this._refs.label.addEventListener("click", this.__toggleHandler.bind(this), false);
            this._refs.label.addEventListener("keyup", function (e) { (e.keyCode === 32) ? _this.__toggleHandler() : null; }, false);
        }
    };
    FabricToggle.prototype.__toggleHandler = function () {
        if (this._refs.label)
            this._refs.label.classList.toggle("is-selected");
    };
    Object.defineProperty(FabricToggle, "observedAttributes", {
        get: function () {
            return ['textleft', 'disabled', 'on', 'off', 'description'];
        },
        enumerable: false,
        configurable: true
    });
    FabricToggle.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (typeof this[attr] === 'boolean') {
            this[attr] = this.hasAttribute(attr);
        }
        else {
            if (this[attr] != newValue)
                this[attr] = newValue;
        }
    };
    return FabricToggle;
}(HTMLElement));
window.customElements.define('fabric-toggle', FabricToggle);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = ".ms-Toggle{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;font-weight:400;box-sizing:border-box;margin:0;padding:0;box-shadow:none;position:relative;display:block;margin-bottom:26px}\n.ms-Toggle .ms-Label{position:relative;top:-2px;padding:0 0 0 50px}\n.ms-Toggle .ms-Toggle-field:before{position:absolute;top:3px;width:10px;height:10px;border-radius:10px;content:\"\";left:4px;background-color:#666;outline:1px solid transparent;transition-property:background,left;transition-duration:.25s;transition-timing-function:cubic-bezier(.4,0,.23,1)}\n@media screen and (-ms-high-contrast:active){.ms-Toggle .ms-Toggle-field:before{border:2.5px solid #fff;height:15px;outline:0}\n}\n@media screen and (-ms-high-contrast:black-on-white){.ms-Toggle .ms-Toggle-field:before{border-color:#000}\n}\n.ms-Toggle .ms-Toggle-field:before{right:auto}\n.ms-Toggle .ms-Toggle-field .ms-Label--off{display:block}\n.ms-Toggle .ms-Toggle-field .ms-Label--on{display:none}\n.ms-Toggle .ms-Toggle-field.is-selected{background-color:#0078d7;border-color:#0078d7}\n.ms-Toggle .ms-Toggle-field.is-selected:before{position:absolute;top:3px;width:10px;height:10px;border-radius:10px;content:\"\";right:4px;background-color:#666;outline:1px solid transparent;transition-property:background,left;transition-duration:.25s;transition-timing-function:cubic-bezier(.4,0,.23,1)}\n@media screen and (-ms-high-contrast:active){.ms-Toggle .ms-Toggle-field.is-selected:before{border:2.5px solid #fff;height:15px;outline:0}\n}\n@media screen and (-ms-high-contrast:black-on-white){.ms-Toggle .ms-Toggle-field.is-selected:before{border-color:#000}\n}\n.ms-Toggle .ms-Toggle-field.is-selected:before{background-color:#fff;left:28px}\n.ms-Toggle .ms-Toggle-field.is-selected .ms-Label--off{display:none}\n.ms-Toggle .ms-Toggle-field.is-selected .ms-Label--on{display:block}\n@media screen and (-ms-high-contrast:active){.ms-Toggle .ms-Toggle-field.is-selected{background-color:#fff}\n}\n@media screen and (-ms-high-contrast:black-on-white){.ms-Toggle .ms-Toggle-field.is-selected{background-color:#000}\n}\n.ms-Toggle:focus+.ms-Toggle-field,.ms-Toggle:hover+.ms-Toggle-field{border-color:#666}\n.ms-Toggle:focus+.ms-Toggle-field:before,.ms-Toggle:hover+.ms-Toggle-field:before{background-color:#333}\n.ms-Toggle:focus:checked+.ms-Toggle-field,.ms-Toggle:hover:checked+.ms-Toggle-field{background-color:#106ebe;border-color:#106ebe}\n.ms-Toggle:focus:checked+.ms-Toggle-field:before,.ms-Toggle:hover:checked+.ms-Toggle-field:before{background-color:#fff}\n.ms-Toggle:active:checked+.ms-Toggle-field{background-color:#005a9e;border-color:#005a9e}\n.ms-Toggle .ms-Toggle-field:focus,.ms-Toggle .ms-Toggle-field:hover{border-color:#333}\n.ms-Toggle .ms-Toggle-field.is-selected:focus,.ms-Toggle .ms-Toggle-field.is-selected:hover{background-color:#106ebe;border-color:#106ebe}\n.ms-Toggle .ms-Toggle-field .ms-Label{color:#000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}\n.ms-Toggle .ms-Toggle-field:hover .ms-Label{color:#000}\n.ms-Toggle .ms-Toggle-field:active .ms-Label{color:#333}\n.ms-Toggle.is-disabled .ms-Label{color:#a6a6a6}\n.ms-Toggle.is-disabled .ms-Toggle-field{background-color:#fff;border-color:#c8c8c8;pointer-events:none;cursor:default}\n.ms-Toggle.is-disabled .ms-Toggle-field:before{background-color:#c8c8c8}\n@media screen and (-ms-high-contrast:active){.ms-Toggle.is-disabled .ms-Toggle-field,.ms-Toggle.is-disabled .ms-Toggle-field:before{border-color:#0f0}\n}\n@media screen and (-ms-high-contrast:black-on-white){.ms-Toggle.is-disabled .ms-Toggle-field,.ms-Toggle.is-disabled .ms-Toggle-field:before{border-color:#600000}\n}\n.ms-Toggle-description{position:relative;font-size:14px;vertical-align:top;display:block;margin-bottom:8px}\n.ms-Toggle-field{position:relative;display:inline-block;width:45px;height:20px;box-sizing:border-box;border:2px solid #a6a6a6;border-radius:20px;cursor:pointer;transition-property:background,left,border-color;transition-duration:.25s;transition-timing-function:cubic-bezier(.4,0,.23,1);outline:0}\n.ms-Toggle-field:focus,.ms-Toggle-field:hover{border-color:#666}\n.ms-Toggle-input{display:none}\n.ms-Toggle.ms-Toggle--textLeft{width:225px;margin-bottom:40px}\n.ms-Toggle.ms-Toggle--textLeft .ms-Toggle-description{display:inline-block;max-width:150px;top:-3px;margin-bottom:0}\n.ms-Toggle.ms-Toggle--textLeft .ms-Toggle-field{float:right}";
    d.head.appendChild(style);
})(window, document);
