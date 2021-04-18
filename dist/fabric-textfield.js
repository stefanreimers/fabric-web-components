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
var FabricTextfield = (function (_super) {
    __extends(FabricTextfield, _super);
    function FabricTextfield() {
        var _this = _super.call(this) || this;
        _this._modifier = '';
        _this._disabled = false;
        _this._required = false;
        _this._readonly = false;
        _this._label = '';
        _this._placeholder = '';
        _this._description = '';
        _this._type = 'text';
        _this._name = '';
        _this._value = '';
        _this._refs = {};
        return _this;
    }
    Object.defineProperty(FabricTextfield.prototype, "modifier", {
        get: function () { return this._modifier; },
        set: function (value) { throw new RangeError('Modifier is a static property'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) { this._required = !!value; this.__setProperties('required'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "readonly", {
        get: function () { return this._readonly; },
        set: function (value) { this._readonly = !!value; this.__setProperties('readonly'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { this._label = value; this.__setProperties('label'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "placeholder", {
        get: function () { return this._placeholder; },
        set: function (value) { this._placeholder = value; this.__setProperties('placeholder'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "description", {
        get: function () { return this._description; },
        set: function (value) { this._description = value; this.__setProperties('description'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "type", {
        get: function () { return this._type; },
        set: function (value) { throw new RangeError('Input type is a static property'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { this._name = value; this.__setProperties('name'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTextfield.prototype, "value", {
        get: function () { return this._value; },
        set: function (newValue) { this._value = (newValue || '').toString(); this.__setProperties('value'); },
        enumerable: false,
        configurable: true
    });
    FabricTextfield.prototype.__setProperties = function (property) {
        if (!this._refs.container)
            return;
        try {
            if (property == null || property === 'name')
                if (this._refs.input)
                    this._refs.input.name = this._name;
            if (property == null || property === 'value') {
                if (this._modifier === 'multiline') {
                    if (this._refs.input)
                        this._refs.input.textContent = this._value;
                }
                else {
                    if (this._refs.input)
                        this._refs.input.value = this._value;
                }
            }
            if (property == null || property === 'label')
                if (this._refs.label)
                    this._refs.label.innerText = this._label;
            if (property == null || property === 'placeholder')
                if (this._refs.input)
                    this._refs.input.placeholder = this._placeholder;
            if (property == null || property === 'description')
                if (this._refs.description)
                    this._refs.description.innerText = this._description;
            if (property == null || property === 'disabled') {
                if (this._refs.input)
                    this._refs.input.disabled = this._disabled;
                if (this._disabled === true) {
                    this._refs.container.classList.add('is-disabled');
                }
                else {
                    this._refs.container.classList.remove('is-disabled');
                }
            }
            if (property == null || property === 'required') {
                if (this._refs.input)
                    this._refs.input.required = this._required;
                if (this._required == true) {
                    this._refs.container.classList.add('is-required');
                }
                else {
                    this._refs.container.classList.remove('is-required');
                }
            }
            if (property == null || property === 'readonly') {
                this._refs.input.readOnly = this.readonly;
                if (this.readonly === true) {
                    this._refs.input.setAttribute('readonly', 'readonly');
                }
                else {
                    this._refs.input.removeAttribute('readonly');
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    FabricTextfield.prototype.__setupUI = function () {
        this.innerHTML = this.template();
        this._refs = {
            container: this.querySelector('.ms-TextField'),
            input: this.querySelector('.ms-TextField-field'),
            label: this.querySelector('.ms-Label'),
            description: this.querySelector('.ms-TextField-description')
        };
    };
    FabricTextfield.prototype.connectedCallback = function () {
        this.__getStaticAttributes();
        this.__setupUI();
        this.__setProperties();
        this.__setListeners();
    };
    FabricTextfield.prototype.__getStaticAttributes = function () {
        var modifier = this.getAttribute('modifier');
        if (modifier && ['multiline', 'underlined'].indexOf(modifier) > -1) {
            this._modifier = modifier;
            if (modifier === 'multiline' && (this._value == null || this._value === '')) {
                this.value = this.textContent || '';
            }
        }
        var type = this.getAttribute('type');
        if (type)
            this._type = type;
    };
    FabricTextfield.prototype.__setListeners = function () {
        var _this = this;
        if (this._refs.label)
            this._refs.label.addEventListener("click", function (event) {
                if (_this._refs.input)
                    _this._refs.input.focus();
            });
        if (this._refs.input)
            this._refs.input.addEventListener("input", function (event) {
                if (event.target)
                    _this._value = event.target.value;
            });
        if (this._modifier === 'underlined' && this._refs.input) {
            this._refs.input.addEventListener("focus", function (event) {
                if (_this._refs.container)
                    _this._refs.container.classList.add("is-active");
            });
            this._refs.input.addEventListener("blur", function (event) {
                if (_this._refs.container)
                    _this._refs.container.classList.remove("is-active");
            });
        }
    };
    FabricTextfield.prototype.template = function () {
        var modifierClass = (this._modifier) ? 'ms-TextField--' + this._modifier : '';
        return "<div class=\"ms-TextField " + modifierClass + "\">\n      <label class=\"ms-Label\"></label>\n      " + ((this._modifier === 'multiline') ?
            '<textarea class="ms-TextField-field" name=""></textarea>' :
            '<input class="ms-TextField-field" type="' + this._type + '" name="" value="" placeholder=""/>') + "\n      <span class=\"ms-TextField-description\"></span>\n    </div>";
    };
    Object.defineProperty(FabricTextfield, "observedAttributes", {
        get: function () {
            return [
                'disabled',
                'required',
                'readonly',
                'label',
                'placeholder',
                'description',
                'name',
                'value'
            ];
        },
        enumerable: false,
        configurable: true
    });
    FabricTextfield.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
        if (oldVal !== newVal) {
            var nw = (typeof this[attrName] === 'boolean' && newVal === '') ? true : newVal;
            this[attrName] = nw;
        }
    };
    return FabricTextfield;
}(HTMLElement));
customElements.define('fabric-textfield', FabricTextfield);
(function (w, d) {
    'use strict';
    var id = 'textfield';
    var node = document.querySelector('style[data-fabric="' + id + '"]');
    if (node) {
        return;
    }
    var styles = document.createElement("style");
    styles.type = 'text/css';
    styles.innerHTML = _getStyles();
    styles.dataset.fabric = id;
    document.getElementsByTagName('head')[0].appendChild(styles);
    function _getStyles() {
        return "fabric-textfield:unresolved,\n    fabric-textfield:not(:defined),\n    fabric-textfield > *:not(.ms-TextField) {\n      opacity: 0;\n      visibility: hidden;\n    }\n    \n    fabric-textfield .ms-TextField.ms-TextField--multiline {\n      height: 100%\n    }\n\n    fabric-textfield .ms-TextField.ms-TextField--multiline label + textarea {\n      height: calc(100% - 20px)\n    }\n\n    fabric-textfield .ms-TextField.ms-TextField--multiline label:empty + textarea {\n      height: 100%\n    }\n\nfabric-textfield .ms-TextField {\n  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;\n  -webkit-font-smoothing: antialiased;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  box-shadow: none;\n  color: #333333;\n  font-size: 14px;\n  font-weight: 400;\n  margin-bottom: 8px;\n}\n\nfabric-textfield .ms-TextField .ms-Label:empty,\nfabric-textfield .ms-TextField .ms-Label:empty::after,\nfabric-textfield .ms-TextField .ms-TextField-description:empty {\n  display: none\n}\n\nfabric-textfield .ms-TextField .ms-Label {\n  font-size: 14px;\n  font-weight: 600;\n  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;\n  -webkit-font-smoothing: antialiased;\n}\n\nfabric-textfield .ms-TextField.is-disabled .ms-TextField-field {\n  background-color: #f4f4f4;\n  border-color: #f4f4f4;\n  pointer-events: none;\n  cursor: default;\n}\n\nfabric-textfield .ms-TextField.is-disabled::-webkit-input-placeholder {\n  color: #a6a6a6;\n}\n\nfabric-textfield .ms-TextField.is-disabled::-moz-placeholder {\n  color: #a6a6a6;\n}\n\nfabric-textfield .ms-TextField.is-disabled:-moz-placeholder {\n  color: #a6a6a6;\n}\n\nfabric-textfield .ms-TextField.is-disabled:-ms-input-placeholder {\n  color: #a6a6a6;\n}\n\nfabric-textfield .ms-TextField-field[readonly]{\n  background: #fafafa;\n}\n\nfabric-textfield[required] .ms-Label::after {\n  content: ' *';\n  color: #a80000;\n} \nfabric-textfield .ms-TextField.is-required .ms-Label::after {\n  content: ' *';\n  color: #a80000;\n}\n.ms-TextField.is-required::-webkit-input-placeholder::after {\n  content: ' *';\n  color: #a80000;\n}\n.ms-TextField.is-required::-moz-placeholder::after {\n  content: ' *';\n  color: #a80000;\n}\n.ms-TextField.is-required:-moz-placeholder::after {\n  content: ' *';\n  color: #a80000;\n}\n.ms-TextField.is-required:-ms-input-placeholder::after {\n  content: ' *';\n  color: #a80000;\n}\n\n.ms-TextField.is-active {\n  border-color: #0078d7;\n}\n\n.ms-TextField-field {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  box-shadow: none;\n  border: 1px solid #c8c8c8;\n  border-radius: 0;\n  font-weight: 300;\n  font-size: 14px;\n  color: #333333;\n  height: 32px;\n  padding: 6px 12px;\n  width: 100%;\n  min-width: 180px;\n  outline: 0;\n  text-overflow: ellipsis;\n}\n\n.ms-TextField-field:hover {\n  border-color: #767676;\n}\n\n.ms-TextField-field:focus {\n  border-color: #0078d7;\n}\n\n@media screen and (-ms-high-contrast: active) {\n  .ms-TextField-field:hover,\n  .ms-TextField-field:focus {\n    border-color: #1aebff;\n  }\n}\n\n@media screen and (-ms-high-contrast: black-on-white) {\n  .ms-TextField-field:hover,\n  .ms-TextField-field:focus {\n    border-color: #37006e;\n  }\n}\n\n.ms-TextField-field[disabled] {\n  background-color: #f4f4f4;\n  border-color: #f4f4f4;\n  pointer-events: none;\n  cursor: default;\n}\n\n.ms-TextField-field::-webkit-input-placeholder {\n  color: #666666;\n}\n\n.ms-TextField-field::-moz-placeholder {\n  color: #666666;\n}\n\n.ms-TextField-field:-moz-placeholder {\n  color: #666666;\n}\n\n.ms-TextField-field:-ms-input-placeholder {\n  color: #666666;\n}\n\n.ms-TextField-description {\n  color: #767676;\n  font-size: 11px;\n}\n\n.ms-TextField.ms-TextField--placeholder {\n  position: relative;\n  background-color: #ffffff;\n}\n\n.ms-TextField.ms-TextField--placeholder .ms-TextField-field {\n  position: relative;\n  background-color: transparent;\n  z-index: 5;\n}\n\n.ms-TextField.ms-TextField--placeholder .ms-Label {\n  position: absolute;\n  font-weight: 300;\n  font-size: 14px;\n  color: #666666;\n  padding: 6px 12px 7px;\n  pointer-events: none;\n  z-index: 0;\n}\n\n.ms-TextField.ms-TextField--placeholder.is-disabled {\n  color: #a6a6a6;\n}\n\n.ms-TextField.ms-TextField--placeholder.is-disabled .ms-Label {\n  color: #a6a6a6;\n}\n\n.ms-TextField.ms-TextField--underlined {\n  border-bottom: 1px solid #c8c8c8;\n  display: table;\n  width: 100%;\n  min-width: 180px;\n}\n\n.ms-TextField.ms-TextField--underlined:hover {\n  border-color: #767676;\n}\n\n@media screen and (-ms-high-contrast: active) {\n  .ms-TextField.ms-TextField--underlined:hover {\n    border-color: #1aebff;\n  }\n}\n\n@media screen and (-ms-high-contrast: black-on-white) {\n  .ms-TextField.ms-TextField--underlined:hover {\n    border-color: #37006e;\n  }\n}\n\n.ms-TextField.ms-TextField--underlined:active,\n.ms-TextField.ms-TextField--underlined:focus {\n  border-color: #0078d7;\n}\n\n.ms-TextField.ms-TextField--underlined .ms-Label {\n  font-size: 14px;\n  margin-right: 8px;\n  display: table-cell;\n  vertical-align: top;\n  padding-left: 12px;\n  padding-top: 9px;\n  height: 32px;\n  width: 1%;\n  white-space: nowrap;\n}\n\n.ms-TextField.ms-TextField--underlined .ms-TextField-field {\n  border: 0;\n  float: left;\n  display: table-cell;\n  text-align: left;\n  padding-top: 8px;\n  padding-bottom: 3px;\n}\n\n.ms-TextField.ms-TextField--underlined .ms-TextField-field:active,\n.ms-TextField.ms-TextField--underlined .ms-TextField-field:focus,\n.ms-TextField.ms-TextField--underlined .ms-TextField-field:hover {\n  outline: 0;\n}\n\n.ms-TextField.ms-TextField--underlined.is-disabled {\n  border-bottom-color: #eaeaea;\n}\n\n.ms-TextField.ms-TextField--underlined.is-disabled .ms-Label {\n  color: #a6a6a6;\n}\n\n.ms-TextField.ms-TextField--underlined.is-disabled .ms-TextField-field {\n  background-color: transparent;\n  color: #a6a6a6;\n}\n\n.ms-TextField.ms-TextField--underlined.is-active {\n  border-color: #0078d7;\n}\n\n@media screen and (-ms-high-contrast: active) {\n  .ms-TextField.ms-TextField--underlined.is-active {\n    border-color: #1aebff;\n  }\n}\n\n@media screen and (-ms-high-contrast: black-on-white) {\n  .ms-TextField.ms-TextField--underlined.is-active {\n    border-color: #37006e;\n  }\n}\n\n.ms-TextField.ms-TextField--multiline .ms-TextField-field {\n  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;\n  -webkit-font-smoothing: antialiased;\n  color: #666666;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 17px;\n  min-height: 60px;\n  min-width: 260px;\n  padding-top: 6px;\n  overflow: auto;\n}";
    }
}(window, document));
