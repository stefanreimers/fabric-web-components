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
var FabricSelect = (function (_super) {
    __extends(FabricSelect, _super);
    function FabricSelect() {
        var _this = _super.call(this) || this;
        _this._refs = {};
        _this._disabled = false;
        return _this;
    }
    Object.defineProperty(FabricSelect.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricSelect.prototype, "value", {
        get: function () { return (this._refs.select) ? this._refs.select.value : null; },
        set: function (val) { if (this._refs.select && val != this.value)
            this._refs.select.value = val; },
        enumerable: true,
        configurable: true
    });
    FabricSelect.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricSelect.prototype.__setupUI = function () {
        var markup = "<select></select>";
        if (this.children && this.children.length > 0) {
            var div = document.createElement('DIV');
            div.innerHTML = markup;
            var contentContainer = div.querySelector('select');
            if (!contentContainer)
                throw new TypeError('Markup not svailable');
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
        var chevron = document.createElement('I');
        chevron.classList.add('chevron');
        this.appendChild(chevron);
        this._refs = {
            select: this.querySelector('select'),
            chevron: this.querySelector('i')
        };
    };
    FabricSelect.prototype.__setProperties = function (property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            if (this._refs.select)
                this._refs.select.disabled = this._disabled;
        }
    };
    FabricSelect.prototype.__addListeners = function () {
        this.addEventListener('mouseover', function (e) {
            if (e.target && e.target.tagName === 'OPTION')
                e.target.classList.add('hover');
        });
        this.addEventListener('mouseout', function (e) {
            if (e.target && e.target.tagName === 'OPTION')
                e.target.classList.remove('hover');
        });
    };
    Object.defineProperty(FabricSelect, "observedAttributes", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    FabricSelect.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
    };
    return FabricSelect;
}(HTMLElement));
window.customElements.define('fabric-select', FabricSelect);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-select { display: inline-block; }\nfabric-select > select {\n\t-webkit-appearance: none;\n\t-moz-appearance: none;\n\tappearance: none;\n\t\n\tborder:1px solid #c8c8c8;\n\tborder-radius: 0;\n\tfont-size: 14px;\n\t\n\twidth: 100%;\n\tmin-width: 100px;\n\n\tpadding: 0px 30px 0px 10px;\n\t/*background-color:#fff;*/\n\tcolor:black;\n\t\n\tbox-sizing: border-box;\n\t\n\t\n\n\t}\n\t\nfabric-select select:after {\n\tcontent: \"\u25BC\";\n\tposition: absolute;\n\tright: -20px;\n\tcolor: #aaa;\n\tfont-size: 14px;\n}\n\nfabric-select > select:hover {\nborder-color: #767676;\n}\n\nfabric-select > select:focus {\nborder-color: #0078d7;\n}\n\t\nfabric-select > select::-ms-expand {\n  display:none;\n}\n\nfabric-select > select option {\n  padding: 5px 8px 5px 10px;\n  border-top:0px /*solid #444;*/\n\n}\n\nfabric-select > select option:hover {\n\t\tbackground: #aaa\n}\n\nfabric-select option.hover {\n\tbackground-color: yellow\n}\n\n\nfabric-select .chevron{\n    position:relative;\n    display:inline-block;\n    height:14px;/*height should be double border*/\n\t\n}\nfabric-select .chevron:before,\nfabric-select .chevron:after{\n    position:absolute;\n    display:block;\n    content:\"\";\n    border:7px solid transparent;/*adjust size*/\n\tleft: -20px;\n\tmargin-top: 5px;\n}\n/* Replace all text top below with left/right/bottom to rotate the chevron */\nfabric-select .chevron:before{\n    top:0;\n    border-top-color:#aaa;/*chevron Color*/\n}\nfabric-select .chevron:after{\n    top:-2px;/*adjust thickness*/\n    border-top-color:#fff;/*Match background colour*/\n}";
    d.head.appendChild(style);
})(window, document);
