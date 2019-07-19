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
var FabricRadioButton = (function (_super) {
    __extends(FabricRadioButton, _super);
    function FabricRadioButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = '';
        _this._name = '';
        _this._refs = {};
        _this._disabled = false;
        _this._checked = false;
        return _this;
    }
    Object.defineProperty(FabricRadioButton.prototype, "disabled", {
        get: function () { return this._disabled || false; },
        set: function (value) { if (!!value === this._disabled)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricRadioButton.prototype, "checked", {
        get: function () { return this._checked || false; },
        set: function (value) { if (!!value === this._checked)
            return; this._checked = !!value; this.__setProperties('checked'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricRadioButton.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { if (value === this._label)
            return; this._label = value; this.__setProperties('label'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricRadioButton.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { if (value === this._name)
            return; this._name = value; this.__setProperties('name'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricRadioButton.prototype, "value", {
        get: function () { return this.checked; },
        set: function (val) { if (val === this.value || this.disabled)
            return; this._checked = val; this.__setProperties('checked'); },
        enumerable: true,
        configurable: true
    });
    FabricRadioButton.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricRadioButton.prototype.__setupUI = function () {
        var markup = "<li class=\"ms-RadioButton\"> \n\t\t  <input tabindex=\"-1\" type=\"radio\" class=\"ms-RadioButton-input\">\n\t\t  <label role=\"radio\"\n\t\t\tclass=\"ms-RadioButton-field\"\n\t\t\ttabindex=\"0\"\n\t\t\taria-checked=\"{{props.checked}}\"\n\t\t\tname=\"\"\n\t\t\taria-disabled=\"false\">\n\t\t\t<span class=\"ms-Label\"></span>\n\t\t  </label>\n\t\t</li>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-RadioButton'),
            input: this.querySelector('.ms-RadioButton-input'),
            field: this.querySelector('.ms-RadioButton-field'),
            label: this.querySelector('.ms-RadioButton-field > .ms-Label')
        };
    };
    FabricRadioButton.prototype.__addListeners = function () {
        this._refs.field.addEventListener("focus", this._onFocusHandler.bind(this), false);
        this._refs.field.addEventListener("blur", this.__onBlurHandler.bind(this), false);
        this._refs.field.addEventListener("click", this.__onClickHandler.bind(this), false);
        this._refs.field.addEventListener("keydown", this.__onKeydownHandler.bind(this), false);
    };
    FabricRadioButton.prototype._onFocusHandler = function () {
        this._refs.field.classList.add("in-focus");
    };
    FabricRadioButton.prototype.__onBlurHandler = function () {
        this._refs.field.classList.remove("in-focus");
    };
    FabricRadioButton.prototype.__onClickHandler = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._disabled) {
            this._dispatchSelectEvent();
        }
    };
    FabricRadioButton.prototype.__onKeydownHandler = function (event) {
        if (event.keyCode === 32) {
            event.stopPropagation();
            event.preventDefault();
            if (!this._disabled) {
                this._dispatchSelectEvent();
            }
        }
    };
    FabricRadioButton.prototype._dispatchSelectEvent = function () {
        var objDict = {
            bubbles: true,
            cancelable: true,
            detail: {
                name: this.name,
                item: this
            }
        };
        this.dispatchEvent(new CustomEvent("fabricRadioSelect", objDict));
    };
    FabricRadioButton.prototype.__setProperties = function (property) {
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
    };
    Object.defineProperty(FabricRadioButton, "observedAttributes", {
        get: function () {
            return ['disabled', 'checked', 'label', 'name'];
        },
        enumerable: true,
        configurable: true
    });
    FabricRadioButton.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (['disabled', 'checked'].indexOf(attr) !== -1) {
            newValue = this.hasAttribute(attr);
        }
        if (oldValue === newValue || newValue === this[attr])
            return;
        this[attr] = newValue;
    };
    return FabricRadioButton;
}(HTMLElement));
window.customElements.define('fabric-radiobutton', FabricRadioButton);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = ".ms-RadioButton{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;color:#333;font-size:14px;font-weight:400;min-height:36px;position:relative}\n.ms-RadioButton .ms-Label{font-size:14px;padding:0 0 0 26px;cursor:pointer;display:inline-block}\n.ms-RadioButton-input{position:absolute;opacity:0}\n.ms-RadioButton-field:before{content:\"\";display:inline-block;border:2px solid #a6a6a6;width:20px;height:20px;cursor:pointer;font-weight:400;position:absolute;box-sizing:border-box;transition-property:border-color;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.23,1);border-radius:50%}\n.ms-RadioButton-field:after{content:\"\";width:0;height:0;border-radius:50%;position:absolute;top:8px;left:8px;bottom:0;right:0;transition-property:top,left,width,height;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.23,1);box-sizing:border-box}\n@media screen and (-ms-high-contrast:active){.ms-RadioButton-field:after{color:#0f0}}\n@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field:after{color:#600000}}\n.ms-RadioButton-field{display:inline-block;cursor:pointer;margin-top:8px;position:relative;outline:0;vertical-align:top}\n.ms-RadioButton-field:focus:before,.ms-RadioButton-field:hover:before{border-color:#767676}\n.ms-RadioButton-field:focus .ms-Label,.ms-RadioButton-field:hover .ms-Label{color:#000}\n.ms-RadioButton-field.is-disabled{cursor:default}\n.ms-RadioButton-field.is-disabled:before{background-color:#c8c8c8;border-color:#c8c8c8;color:#c8c8c8}\n@media screen and (-ms-high-contrast:active){.ms-RadioButton-field.is-disabled:before{border-color:#0f0}}\n@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field.is-disabled:before{border-color:#600000}}\n.ms-RadioButton-field.is-disabled .ms-Label{color:#a6a6a6}\n@media screen and (-ms-high-contrast:active){.ms-RadioButton-field.is-disabled .ms-Label{color:#0f0}}\n@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field.is-disabled .ms-Label{color:#600000}}\n.ms-RadioButton-field.is-disabled:focus:before,.ms-RadioButton-field.is-disabled:hover:before{border-color:#c8c8c8}\n.ms-RadioButton-field.in-focus:before{border-color:#767676}\n.ms-RadioButton-field.is-checked:before{border:2px solid #0078d7;background-color:transparent}\n@media screen and (-ms-high-contrast:active){.ms-RadioButton-field.is-checked:before{border-color:#1aebff}}\n@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field.is-checked:before{border-color:#37006e}}\n.ms-RadioButton-field.is-checked:after{background-color:#0078d7;top:5px;left:5px;width:10px;height:10px}\n@media screen and (-ms-high-contrast:active){.ms-RadioButton-field.is-checked:after{background-color:#1aebff}}\n@media screen and (-ms-high-contrast:black-on-white){.ms-RadioButton-field.is-checked:after{background-color:#37006e}}\n.ms-RadioButton-field.is-checked.in-focus:before,.ms-RadioButton-field.is-checked:focus:before,.ms-RadioButton-field.is-checked:hover:before{border-color:#0078d7}";
    d.head.appendChild(style);
})(window, document);
