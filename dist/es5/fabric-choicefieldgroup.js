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
var FabricChoiceFieldGroup = (function (_super) {
    __extends(FabricChoiceFieldGroup, _super);
    function FabricChoiceFieldGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._label = '';
        _this._name = '';
        _this._refs = {};
        _this._form = '';
        _this._disabled = false;
        _this._required = false;
        return _this;
    }
    Object.defineProperty(FabricChoiceFieldGroup.prototype, "disabled", {
        get: function () { return this._disabled || false; },
        set: function (value) { if (!!value === this._disabled)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricChoiceFieldGroup.prototype, "required", {
        get: function () { return this._required || false; },
        set: function (value) { if (!!value === this._required)
            return; this._required = !!value; this.__setProperties('required'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricChoiceFieldGroup.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { if (value === this._label)
            return; this._label = value; this.__setProperties('label'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricChoiceFieldGroup.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { if (value === this._name)
            return; this._name = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricChoiceFieldGroup.prototype, "form", {
        get: function () { return this._form; },
        set: function (value) { if (value === this._form)
            return; this._form = value; this.__setProperties('form'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricChoiceFieldGroup.prototype, "value", {
        get: function () {
            var radios = this.querySelectorAll('fabric-radiobutton[name="' + this.name + '"]');
            var selected = null;
            if (radios && radios.length > 0) {
                [].forEach.call(radios, function (radio) {
                    if (radio.checked === true)
                        selected = radio.label;
                });
            }
            return selected;
        },
        set: function (val) { this.__setProperties('value'); },
        enumerable: true,
        configurable: true
    });
    FabricChoiceFieldGroup.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricChoiceFieldGroup.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-ChoiceFieldGroup\" role=\"radiogroup\">\n\t\t\t  <div class=\"ms-ChoiceFieldGroup-title\">\n\t\t\t\t<label class=\"ms-Label\"></label>\n\t\t\t  </div>\n\t\t\t<ul class=\"ms-ChoiceFieldGroup-list\">\n\t\t\t</ul>\n\t\t\t</div>";
        var fragment = document.createElement('DIV');
        fragment.innerHTML = markup;
        var radios = this.querySelectorAll('fabric-radiobutton[name="' + this.name + '"]');
        if (radios && radios.length > 0) {
            var list = fragment.querySelector('.ms-ChoiceFieldGroup-list');
            [].forEach.call(radios, function (radio) {
                list && list.appendChild(radio);
            });
        }
        this.innerHTML = fragment.innerHTML;
        this._refs = {
            container: this.querySelector('.ms-ChoiceFieldGroup'),
            label: this.querySelector('.ms-ChoiceFieldGroup-title > .ms-Label'),
            list: this.querySelector('.ms-ChoiceFieldGroup-list')
        };
    };
    FabricChoiceFieldGroup.prototype.__addListeners = function () {
        this._refs.list.addEventListener("fabricRadioSelect", this._onChangeHandler.bind(this), false);
    };
    FabricChoiceFieldGroup.prototype._onChangeHandler = function (event) {
        var name = event.detail.name;
        var selectedChoice = event.detail.item;
        if (this.name === name) {
            var _choiceFieldComponents = this._refs.list.querySelectorAll('fabric-radiobutton[name="' + this.name + '"]');
            if (!_choiceFieldComponents || _choiceFieldComponents.length === 0)
                return;
            [].forEach.call(_choiceFieldComponents, function (item) {
                if (item === selectedChoice) {
                    item.checked = true;
                }
                else {
                    item.checked = false;
                }
            });
        }
    };
    FabricChoiceFieldGroup.prototype.__setProperties = function (property) {
        var _this = this;
        if (!this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            var radios = this.querySelectorAll('fabric-radiobutton[name="' + this.name + '"]');
            if (radios && radios.length > 0) {
                [].forEach.call(radios, function (radio) {
                    radio.disabled = _this.disabled;
                });
            }
        }
        if (property == null || property === 'required') {
            this._refs.label.classList[(!!this._required) ? 'add' : 'remove']('is-required');
        }
        if (property == null || property === 'label') {
            this._refs.label.textContent = this._label || '';
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
    Object.defineProperty(FabricChoiceFieldGroup, "observedAttributes", {
        get: function () {
            return ['disabled', 'requried', 'label', 'name', 'form'];
        },
        enumerable: true,
        configurable: true
    });
    FabricChoiceFieldGroup.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (['disabled', 'required'].indexOf(attr) !== -1) {
            newValue = this.hasAttribute(attr);
        }
        if (oldValue === newValue || newValue === this[attr])
            return;
        this[attr] = newValue;
    };
    FabricChoiceFieldGroup.prototype.checkValidity = function () {
        return (!(this.required && this.value === null));
    };
    return FabricChoiceFieldGroup;
}(HTMLElement));
window.customElements.define('fabric-choicefieldgroup', FabricChoiceFieldGroup);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = ".ms-ChoiceFieldGroup{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;margin-bottom:4px}\n.ms-ChoiceFieldGroup .ms-ChoiceFieldGroup-list{padding:0;margin:0;list-style:none}";
    d.head.appendChild(style);
})(window, document);
