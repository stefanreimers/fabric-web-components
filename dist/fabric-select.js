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
var FabricSelect = (function (_super) {
    __extends(FabricSelect, _super);
    function FabricSelect() {
        var _this = _super.call(this) || this;
        _this._refs = {};
        _this._disabled = false;
        _this._required = false;
        _this._multiple = false;
        _this._name = null;
        _this._label = null;
        return _this;
    }
    Object.defineProperty(FabricSelect.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (this._disabled === value)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSelect.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) { if (this._required === value)
            return; this._required = !!value; this.__setProperties('required'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSelect.prototype, "multiple", {
        get: function () { return this._multiple; },
        set: function (value) { if (this._multiple === value)
            return; this._multiple = !!value; this.__setProperties('multiple'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSelect.prototype, "value", {
        get: function () {
            var _this = this;
            if (!this._refs.select)
                return null;
            if (!this.multiple)
                return this._refs.select.value;
            return Object.keys(this._refs.select.selectedOptions).map(function (i) { var j = _this._refs.select.selectedOptions[i]; return j.value || j.textContent; });
        },
        set: function (val) { if (this._refs.select && val != this.value)
            this._refs.select.value = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSelect.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { if (value === this._label)
            return; this._label = value; this.__setProperties('label'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSelect.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { if (value === this._name)
            return; this._name = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSelect.prototype, "options", {
        get: function () { return (this._refs.select) ? this._refs.select.querySelectorAll('option:not([hidden])') : null; },
        enumerable: false,
        configurable: true
    });
    FabricSelect.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricSelect.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-Dropdown\" tabindex=\"0\">\n\t\t\t<label class=\"ms-Label\"></label>\n\t\t\t<select class=\"ms-Dropdown-select\">\n\t\t\t\t<option value=\"\" disabled selected hidden>Choose an option...</option>\n\t\t\t</select>\n\t\t\t<i class=\"ms-Dropdown-caretDown _ms-Icon ms-Icon--ChevronDown chevron\"></i></div>";
        if (this.children && this.children.length > 0) {
            var div = document.createElement('DIV');
            div.innerHTML = markup;
            var contentContainer = div.querySelector('select');
            if (contentContainer) {
                while (this.children.length > 0) {
                    if (this.children[0].tagName.toLowerCase() === 'option') {
                        contentContainer.appendChild(this.children[0]);
                    }
                    else {
                        this.removeChild(this.children[0]);
                    }
                }
                this.appendChild(div.children[0]);
            }
            else {
                this.innerHTML = markup;
            }
        }
        this._refs = {
            container: this.querySelector('.ms-Dropdown'),
            select: this.querySelector('select'),
            label: this.querySelector('label'),
            chevron: this.querySelector('i')
        };
    };
    FabricSelect.prototype.__setProperties = function (property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            if (this._refs.select)
                this._refs.select.disabled = this._disabled;
            this._refs.container.classList[(this._disabled) ? 'add' : 'remove']('is-disabled');
        }
        if (property == null || property === 'required') {
            if (this._refs.select)
                this._refs.select.required = this._required;
            this._refs.container.classList[(this._required) ? 'add' : 'remove']('is-required');
        }
        if (property == null || property === 'multiple') {
            if (this._refs.select)
                this._refs.select.multiple = this._multiple;
            this._refs.container.classList[(this._multiple) ? 'add' : 'remove']('is-multiple');
            try {
                if (this.multiple === true) {
                    if (this._refs.select) {
                        var hidden = this._refs.select.querySelector('option[value=""][selected]');
                        if (hidden)
                            hidden.removeAttribute('selected');
                    }
                }
                else {
                    if (this.value == null || this.value === '') {
                        if (this._refs.select) {
                            var hidden = this._refs.select.querySelector('option[value=""]');
                            if (hidden)
                                hidden.setAttribute('selected', '');
                        }
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        if (property == null || property === 'label') {
            if (this._refs.label)
                this._refs.label.textContent = this._label || '';
        }
    };
    FabricSelect.prototype.__addListeners = function () {
        var _this = this;
        if (!this._refs.select)
            return;
        this._refs.select.addEventListener('change', function (e) {
            if (_this.multiple === true)
                return;
            var value = (e && e.target) ? e.target.value : null;
            if (!value)
                return;
            var unselect = _this._refs.select.querySelectorAll('option.is-selected:not([value="' + value + '"])');
            if (unselect && unselect.length > 0) {
                [].forEach.call(unselect, function (element) {
                    element.classList.remove('is-selected');
                });
            }
            var select = _this._refs.select.querySelector('option[value="' + value + '"]');
            if (select && !select.classList.contains('is-selected')) {
                select.classList.add('is-selected');
            }
        });
    };
    Object.defineProperty(FabricSelect, "observedAttributes", {
        get: function () {
            return ['label', 'disabled', 'required', 'multiple', 'name'];
        },
        enumerable: false,
        configurable: true
    });
    FabricSelect.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        var n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    };
    FabricSelect.prototype.checkValidity = function () {
        if (this.required === true) {
            return (this.value !== '' && this.value != null);
        }
        return this._refs.select.checkValidity();
    };
    return FabricSelect;
}(HTMLElement));
window.customElements.define('fabric-select', FabricSelect);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-select { \n\tdisplay: inline-block;\n\tfont-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;\n}\nfabric-select select {\n\t-webkit-appearance: none;\n\t-moz-appearance: none;\n\tappearance: none;\n\t\n\tborder:1px solid #c8c8c8;\n\tborder-radius: 0;\n\tfont-size: 14px;\n\t\n\twidth: 100%;\n\tmin-width: 100px;\n\tmin-height: 32px;\n\n\tpadding: 0px 30px 0px 10px;\n\t/*background-color:#fff;*/\n\tcolor:black;\n\t\n\tbox-sizing: border-box;\n}\n\nfabric-select select:hover {\nborder-color: #767676;\n}\n\nfabric-select select:focus {\nborder-color: #0078d7;\n}\n\t\nfabric-select select::-ms-expand {\n  display:none;\n}\n\nfabric-select select option {\n  padding: 5px 8px 5px 10px;\n  border-top:0px /*solid #444;*/\n\n}\nfabric-select select option{\n\tbox-shadow: 0 0 5px 0 rgba(0,0,0,.4)\n}\n\nfabric-select select:not([multiple]) option.is-selected {\n\tbackground-color: #b3d6f2;\n\tcolor: #000;\n}\n\nfabric-select .chevron{\n    display:inline-block;\n    height:12px;/*height should be double border*/\n\t\n}\nfabric-select .chevron:before,\nfabric-select .chevron:after{\n    position:absolute;\n    display:block;\n    content:\"\";\n    border:6px solid transparent;/*adjust size*/\n\tleft: -20px;\n\tmargin-top: 5px;\n}\n/* Replace all text top below with left/right/bottom to rotate the chevron */\nfabric-select .chevron:before{\n    top:0;\n    border-top-color:#aaa;/*chevron Color*/\n}\nfabric-select .chevron:after{\n    top:-1px;/*adjust thickness*/\n    border-top-color:#fff;/*Match background colour*/\n}\nfabric-select .is-disabled .chevron:after{\n    top:-1px;/*adjust thickness*/\n    border-top-color:#f4f4f4;/*Match background colour*/\n}\n\nfabric-select select[disabled] {\n\tbackground-color: #f4f4f4;\n\tcolor: #a6a6a6;\n\tborder-color: #f4f4f4\n}\n\n.ms-Dropdown{\n\tfont-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;\n\tbox-sizing:border-box;margin:0;padding:0;box-shadow:none;color:#333;font-size:14px;font-weight:400;margin-bottom:10px;position:relative;outline:0}\n.ms-Dropdown:active .ms-Dropdown-caretDown:before,\n.ms-Dropdown:focus .ms-Dropdown-caretDown:before,\n.ms-Dropdown:hover .ms-Dropdown-caretDown:before{\n\tborder-top-color:#000\n}\n\n.ms-Dropdown .ms-Label{\n\tdisplay:inline-block;\n\tmargin-bottom:8px;\n\tfont-size: 12px\n}\n\n.ms-Dropdown.is-disabled .ms-Dropdown-caretDown:before{\n\tborder-top-color:#a6a6a6\n}\n\n.ms-Dropdown-caretDown{\n\tcolor:#212121;font-size:12px;position:absolute;right:5px;bottom:11px;z-index:1;pointer-events:none\n}\n\nfabric-select select[multiple]{\n\tpadding: 0;\n}\n\nfabric-select select[multiple] > option {\n\tbox-shadow: none;\n}\n\nfabric-select select[multiple] ~ i {\n\tdisplay: none\n}";
    d.head.appendChild(style);
})(window, document);
