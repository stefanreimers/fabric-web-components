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
var FabricMeter = (function (_super) {
    __extends(FabricMeter, _super);
    function FabricMeter() {
        var _this = _super.call(this) || this;
        _this._refs = { meter: null };
        _this._min = 0;
        _this._max = 5;
        _this._value = 4;
        _this._disabled = false;
        return _this;
    }
    Object.defineProperty(FabricMeter.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (this._disabled === !!value)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricMeter.prototype, "min", {
        get: function () { return this._min; },
        set: function (value) {
            value = (typeof value === 'number') ? value : parseFloat(value);
            if (isNaN(value) || this._min === value)
                return;
            this._min = value;
            this.__setProperties('min');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricMeter.prototype, "max", {
        get: function () { return this._max; },
        set: function (value) {
            value = (typeof value === 'number') ? value : parseFloat(value);
            if (isNaN(value) || this._max === value)
                return;
            this._max = value;
            this.__setProperties('max');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricMeter.prototype, "value", {
        get: function () { return this._value; },
        set: function (value) {
            value = (typeof value === 'number') ? value : parseFloat(value);
            if (isNaN(value) || this._value === value)
                return;
            this._value = value;
            this.__setProperties('value');
        },
        enumerable: false,
        configurable: true
    });
    FabricMeter.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
    };
    FabricMeter.prototype.__setupUI = function () {
        var markup = "<meter></meter>";
        this.innerHTML = markup;
        this._refs = {
            meter: this.querySelector('meter')
        };
    };
    FabricMeter.prototype.__setProperties = function (property) {
        var _this = this;
        if (!this._refs || !this._refs.meter)
            return;
        if (property == null && this._refs.meter != null) {
            ['min', 'max', 'value'].forEach(function (p) { _this._refs.meter[p] = _this[p]; });
        }
        if (property != null && ['min', 'max', 'value'].indexOf(property) > -1) {
            this._refs.meter[property] = this[property];
        }
        if (property === 'disabled') {
            this._refs.meter.classList[this.disabled ? 'add' : 'remove']('disabled');
        }
    };
    Object.defineProperty(FabricMeter, "observedAttributes", {
        get: function () {
            return ['min', 'max', 'value', 'disabled'];
        },
        enumerable: false,
        configurable: true
    });
    FabricMeter.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (oldValue != newValue)
            this[attr] = newValue;
    };
    return FabricMeter;
}(HTMLElement));
window.customElements.define('fabric-meter', FabricMeter);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-meter{display:inline-block}\n  fabric-meter meter{width:5em;height:1em;background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><text font-size=\"100\" y=\".8em\" opacity=\".2\">\u2605</text></svg>') 0 / auto 100%;}\n  fabric-meter meter::-webkit-meter-optimum-value,\n  fabric-meter meter::-moz-meter-bar {background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><text font-size=\"100\" y=\".8em\">\u2605</text></svg>') 0 / auto 100%;\n  ";
    d.head.appendChild(style);
})(window, document);
