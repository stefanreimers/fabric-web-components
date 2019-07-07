"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FabricCheckbox = (function (_super) {
    __extends(FabricCheckbox, _super);
    function FabricCheckbox() {
        var _this = _super.call(this) || this;
        _this._label = '';
        _this._name = '';
        _this._refs = {};
        _this._form = '';
        _this._value = 'on';
        _this._disabled = false;
        _this._checked = false;
        return _this;
    }
    Object.defineProperty(FabricCheckbox.prototype, "disabled", {
        get: function () { return this._disabled || false; },
        set: function (value) { if (!!value === this._disabled)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCheckbox.prototype, "checked", {
        get: function () { return this._checked || false; },
        set: function (value) { if (!!value === this._checked)
            return; this._checked = !!value; this.__setProperties('checked'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCheckbox.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { if (value === this._label)
            return; this._label = value; this.__setProperties('label'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCheckbox.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { if (value === this._name)
            return; this._name = value; this.__setProperties('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCheckbox.prototype, "form", {
        get: function () { return this._form; },
        set: function (value) { if (value === this._form)
            return; this._form = value; this.__setProperties('form'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCheckbox.prototype, "value", {
        get: function () { return this._value; },
        set: function (val) { if (val === this.value || this.disabled)
            return; this._value = val; this.__setProperties('value'); },
        enumerable: true,
        configurable: true
    });
    FabricCheckbox.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricCheckbox.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-CheckBox\"> \n\t\t  <input tabindex=\"-1\" type=\"checkbox\" class=\"ms-CheckBox-input\">\n\t\t  <label class=\"ms-CheckBox-field\"\n\t\t\ttabindex=\"0\"\n\t\t\taria-checked=\"false\"\n\t\t\tname=\"\"\n\t\t\taria-disabled=\"false\">\n\t\t\t<span class=\"ms-Label\"></span>\n\t\t  </label>\n\t\t</div>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-CheckBox'),
            input: this.querySelector('.ms-CheckBox-input'),
            field: this.querySelector('.ms-CheckBox-field'),
            label: this.querySelector('.ms-CheckBox-field > .ms-Label')
        };
    };
    FabricCheckbox.prototype.__addListeners = function () {
        if (this._refs.field) {
            this._refs.field.addEventListener("focus", this._onFocusHandler.bind(this), false);
            this._refs.field.addEventListener("blur", this.__onBlurHandler.bind(this), false);
            this._refs.field.addEventListener("click", this.__onClickHandler.bind(this), false);
            this._refs.field.addEventListener("keydown", this.__onKeydownHandler.bind(this), false);
        }
    };
    FabricCheckbox.prototype._onFocusHandler = function () {
        if (this._refs.field)
            this._refs.field.classList.add("in-focus");
    };
    FabricCheckbox.prototype.__onBlurHandler = function () {
        if (this._refs.field)
            this._refs.field.classList.remove("in-focus");
    };
    FabricCheckbox.prototype.__onClickHandler = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._disabled) {
            this.toggle();
        }
    };
    FabricCheckbox.prototype.__onKeydownHandler = function (event) {
        if (event.keyCode === 32) {
            event.stopPropagation();
            event.preventDefault();
            if (!this._disabled) {
                this.toggle();
            }
        }
    };
    FabricCheckbox.prototype.toggle = function () {
        if (!this._disabled)
            this.checked = !this.checked;
    };
    FabricCheckbox.prototype.__setProperties = function (property) {
        if (!this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            this._refs.input.disabled = !!this._disabled;
            this._refs.field.classList[(!!this._disabled) ? 'add' : 'remove']('is-disabled');
            this._refs.field.setAttribute('aria-disabled', (!!this._disabled) ? 'true' : 'false');
        }
        if (property == null || property === 'checked') {
            this._refs.input.checked = !!this._checked;
            this._refs.field.classList[(!!this._checked) ? 'add' : 'remove']('is-checked');
            this._refs.field.setAttribute('aria-checked', (!!this._checked) ? 'true' : 'false');
        }
        if (property == null || property === 'label') {
            this._refs.label.textContent = this._label || '';
        }
        if (property == null || property === 'name') {
            this._refs.field.name = this._name || '';
        }
        if (property == null || property === 'name') {
            this._refs.input.value = this._value || '';
        }
        if (property == null || property === 'form') {
            if (this._form != null && this._form !== '') {
                this.setAttribute('form', this._form);
            }
            else {
                this.removeAttribute('form');
            }
        }
    };
    Object.defineProperty(FabricCheckbox, "observedAttributes", {
        get: function () {
            return ['disabled', 'checked', 'label', 'name', 'form', 'value'];
        },
        enumerable: true,
        configurable: true
    });
    FabricCheckbox.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (['disabled', 'checked'].indexOf(attr) !== -1) {
            newValue = this.hasAttribute(attr);
        }
        if (oldValue === newValue || newValue === this[attr])
            return;
        this[attr] = newValue;
    };
    FabricCheckbox.prototype.checkValidity = function () {
        return (this._refs.input) ? this._refs.input.checkValidity() : false;
    };
    return FabricCheckbox;
}(HTMLElement));
window.customElements.define('fabric-checkbox', FabricCheckbox);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = ".ms-CheckBox{box-sizing:border-box;color:#333;font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;font-size:14px;font-weight:400;min-height:36px;position:relative}\n.ms-CheckBox .ms-Label{font-size:14px;padding:0 0 0 26px;cursor:pointer;display:inline-block}\n.ms-CheckBox-input{position:absolute;opacity:0}\n.ms-CheckBox-field:before{content:\"\";display:inline-block;border:2px solid #a6a6a6;width:20px;height:20px;cursor:pointer;font-weight:400;position:absolute;box-sizing:border-box;transition-property:background,border,border-color;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.23,1)}\n.ms-CheckBox-field:after{content:\"\u2713\";display:none;position:absolute;font-weight:900;background-color:transparent;font-size:14px;top:0;color:#fff;line-height:20px;width:20px;text-align:center}\n@media screen and (-ms-high-contrast:active){.ms-CheckBox-field:after{color:#000}}\n@media screen and (-ms-high-contrast:black-on-white){.ms-CheckBox-field:after{color:#fff}}\n.ms-CheckBox-field{display:inline-block;cursor:pointer;margin-top:8px;position:relative;outline:0;vertical-align:top}\n.ms-CheckBox-field:focus:before,.ms-CheckBox-field:hover:before{border-color:#767676}\n.ms-CheckBox-field:focus .ms-Label,.ms-CheckBox-field:hover .ms-Label{color:#000}\n.ms-CheckBox-field.is-disabled{cursor:default}\n.ms-CheckBox-field.is-disabled:before{background-color:#c8c8c8;border-color:#c8c8c8;color:#c8c8c8}\n@media screen and (-ms-high-contrast:active){.ms-CheckBox-field.is-disabled:before{border-color:#0f0}}\n@media screen and (-ms-high-contrast:black-on-white){.ms-CheckBox-field.is-disabled:before{border-color:#600000}}\n.ms-CheckBox-field.is-disabled .ms-Label{color:#a6a6a6}\n@media screen and (-ms-high-contrast:active){.ms-CheckBox-field.is-disabled .ms-Label{color:#0f0}}\n@media screen and (-ms-high-contrast:black-on-white){.ms-CheckBox-field.is-disabled .ms-Label{color:#600000}}\n.ms-CheckBox-field.in-focus:before{border-color:#767676}\n.ms-CheckBox-field.in-focus.is-disabled:before{border-color:#c8c8c8}\n.ms-CheckBox-field.in-focus.is-checked:before{border-color:#106ebe}\n.ms-CheckBox-field.is-checked:before{border:10px solid #0078d7;background-color:#0078d7}\n@media screen and (-ms-high-contrast:active){.ms-CheckBox-field.is-checked:before{border-color:#1aebff}\n}\n@media screen and (-ms-high-contrast:black-on-white){.ms-CheckBox-field.is-checked:before{border-color:#37006e}\n}\n.ms-CheckBox-field.is-checked:after{display:block}\n.ms-CheckBox-field.is-checked:focus:before,.ms-CheckBox-field.is-checked:hover:before{border-color:#106ebe}";
    d.head.appendChild(style);
})(window, document);
