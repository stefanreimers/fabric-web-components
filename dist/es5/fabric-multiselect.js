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
var FabricMultiSelect = (function (_super) {
    __extends(FabricMultiSelect, _super);
    function FabricMultiSelect() {
        var _this = _super.call(this) || this;
        _this._disabled = false;
        _this._required = false;
        _this._label = '';
        _this._refs = {};
        _this._value = [];
        _this._options = [];
        return _this;
    }
    Object.defineProperty(FabricMultiSelect.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (this._disabled === value)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricMultiSelect.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) { if (this._required === value)
            return; this._required = !!value; this.__setProperties('required'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricMultiSelect.prototype, "value", {
        get: function () { return this._value || []; },
        set: function (value) { value = [].concat(value); if (value.sort().join(',') === this._value.sort().join(','))
            return; this._value = value; this.__setProperties('value'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricMultiSelect.prototype, "options", {
        get: function () { return this._options || []; },
        set: function (value) { this._options = value; this.__setProperties('options'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricMultiSelect.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { if (value === this._label)
            return; this._label = value; this.__setProperties('label'); },
        enumerable: true,
        configurable: true
    });
    FabricMultiSelect.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricMultiSelect.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-MultiSelect\" tabindex=\"0\">\n\t\t\t<label class=\"ms-Label\"></label>\n\t\t\t<div class=\"ms-MultiSelect--container flex-container\">\n\t\t\t\t<fabric-table  modifier=\"selectable\" columns='[{\"id\":\"value\",\"label\":\"Selected\"}]' rowid=\"value\" itemheight=\"20\" class=\"ms-MultiSelect--selected stretch\"></fabric-table>\n\t\t\t\t<ul class=\"ms-MultiSelect--controls flex-container vertical\">\n\t\t\t\t\t<li><button data-action=\"select-all\">&lt;&lt;</button></li>\n\t\t\t\t\t<li><button data-action=\"select\">&lt;</button></li>\n\t\t\t\t\t<li><button data-action=\"unselect\">&gt;</button></li>\n\t\t\t\t\t<li><button data-action=\"unselect-all\">&gt;&gt;</button></li>\n\t\t\t\t</ul>\n\t\t\t\t<fabric-table modifier=\"selectable\" columns='[{\"id\":\"value\",\"label\":\"Selectable\"}]' rowid=\"value\" itemheight=\"20\" class=\"ms-MultiSelect--selectable stretch\"></fabric-table>\n\t\t\t</div>\n\t\t\t</div>";
        if (this.children && this.children.length > 0) {
            var options = [];
            var value = [];
            while (this.children.length > 0) {
                if (this.children[0].tagName.toLowerCase() === 'option') {
                    options.push({ id: this.children[0].value || this.children[0].label || this.children[0].textContent, value: this.children[0].textContent });
                    if (this.children[0].hasAttribute('selected'))
                        value.push(this.children[0].value || this.children[0].label || this.children[0].textContent);
                }
                this.removeChild(this.children[0]);
            }
            if (options.length > 0)
                this._options = options;
            if (value.length > 0)
                this._value = value;
        }
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-MultiSelect--container'),
            label: this.querySelector('label'),
            selected: this.querySelector('.ms-MultiSelect--selected'),
            selectable: this.querySelector('.ms-MultiSelect--selectable'),
            controls: this.querySelector('.ms-MultiSelect--controls')
        };
    };
    FabricMultiSelect.prototype.__setProperties = function (property) {
        var _this = this;
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            this._refs.container.classList[(this._disabled) ? 'add' : 'remove']('is-disabled');
        }
        if (property == null || property === 'label') {
            this._refs.label.textContent = this._label || '';
        }
        if (property == null || property === 'options' || property === 'value') {
            this._refs.selectable.items = (this._options || []).filter(function (option) { return _this._value.indexOf(option.id) === -1; });
            this._refs.selected.items = (this._options || []).filter(function (option) { return _this._value.indexOf(option.id) !== -1; });
        }
    };
    FabricMultiSelect.prototype.__addListeners = function () {
        var _this = this;
        if (this._refs.controls)
            this._refs.controls.addEventListener('click', function (e) {
                if (e.target && e.target.tagName === 'BUTTON') {
                    switch (e.target.dataset.action) {
                        case 'select-all':
                            _this.value = _this.options.map(function (o) { return o.value; });
                            break;
                        case 'select':
                            var toSelect = _this._refs.selectable.selected;
                            if (toSelect && toSelect.length > 0)
                                _this.value = _this.value.concat(toSelect);
                            break;
                        case 'unselect':
                            var toDeselect = _this._refs.selected.selected;
                            if (toDeselect && toDeselect.length > 0) {
                                var value_1 = [].concat(_this.value);
                                toDeselect.forEach(function (element) {
                                    var position = value_1.indexOf(element);
                                    if (position !== -1)
                                        value_1.splice(position, 1);
                                });
                                _this.value = value_1;
                            }
                            break;
                        case 'unselect-all':
                            _this.value = [];
                            break;
                    }
                }
            });
    };
    FabricMultiSelect.prototype.checkValidity = function () {
        return (this.required === true) ? this.value.length > 0 : true;
    };
    Object.defineProperty(FabricMultiSelect, "observedAttributes", {
        get: function () {
            return ['label', 'value', 'disabled', 'required'];
        },
        enumerable: true,
        configurable: true
    });
    FabricMultiSelect.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        var n = (attr === 'value') ? newValue.split(',') : newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    };
    return FabricMultiSelect;
}(HTMLElement));
window.customElements.define('fabric-multiselect', FabricMultiSelect);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-multiselect  { \n\tdisplay: inline-block;\n\tfont-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;\n\theight: 250px;\n}\n\nfabric-multiselect .flex-container {\n\tdisplay: -ms-flexbox;\n    display: -webkit-flex;\n    display: flex;\n    -webkit-flex-direction: row;\n    -ms-flex-direction: row;\t\n    flex-direction: row;\n    -webkit-flex-wrap: nowrap;\n    -ms-flex-wrap: nowrap;\n    flex-wrap: nowrap;\n    -webkit-justify-content: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    -webkit-align-content: stretch;\n    -ms-flex-line-pack: stretch;\n    align-content: stretch;\n    -webkit-align-items: stretch;\n    -ms-flex-align: stretch;\n    align-items: stretch;\n}\nfabric-multiselect .flex-container.vertical{\n    -webkit-flex-direction: column;\n    -ms-flex-direction: column;\n    flex-direction: column;\n}\n\nfabric-multiselect .flex-container > * {\n    order: 0;\n    flex: 0 1 auto;\n    align-self: auto;\n}\nfabric-multiselect .flex-container > *.stretch {\n\tflex: 1 1 auto;\n} \n\nfabric-multiselect .ms-MultiSelect--controls{\n\tmargin: 5px;\n\tpadding: 0px;\n\twidth: 50px;\n\tlist-style-type: none\n}\n\nfabric-multiselect .ms-MultiSelect{\n\theight: 100%\n}\nfabric-multiselect .ms-MultiSelect--container{\n\theight: calc(100% - 25px)\n}\n\n.ms-MultiSelect .ms-Label {\n    display: inline-block;\n    margin-bottom: 8px;\n    font-size: 12px;\n}\n\n.ms-MultiSelect fabric-table {\n\tbox-sizing: border-box;\n\tborder: 1px solid #eaeaea\n}\n\n.ms-MultiSelect--controls li {\n\ttext-align:center\n}\n.ms-MultiSelect--controls button {\n\tbackground: none;\n\tborder: 0;\n\tcolor: #666666;\n\tfont-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;\n}\n";
    d.head.appendChild(style);
})(window, document);
