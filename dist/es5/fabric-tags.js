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
var FabricTags = (function (_super) {
    __extends(FabricTags, _super);
    function FabricTags() {
        var _this_1 = _super.call(this) || this;
        _this_1._refs = {};
        _this_1._disabled = false;
        _this_1._refs = {};
        _this_1._disabled = false;
        _this_1._value = null;
        _this_1._items = [];
        _this_1._uuid = _this_1.__uuid();
        return _this_1;
    }
    Object.defineProperty(FabricTags.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (this._disabled === !!value)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricTags.prototype, "value", {
        get: function () { return this._value; },
        set: function (val) { if (val === this._value)
            return; this._value = val; this.__setProperties('value'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricTags.prototype, "items", {
        get: function () { return this._items; },
        set: function (value) {
            if (value == null)
                value = [];
            if (!Array.isArray(value))
                value = [].concat(value);
            this._items = value;
            this.__setProperties('items');
        },
        enumerable: true,
        configurable: true
    });
    FabricTags.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricTags.prototype.__setupUI = function () {
        var markup = "<div class=\"tags\">\n\t\t\t\t<input list=\"" + this._uuid + "\" tabindex=\"0\"></input>\n\t\t\t</div><datalist id=\"" + this._uuid + "\"/>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.tags'),
            input: this.querySelector('input'),
            datalist: this.querySelector('datalist')
        };
    };
    FabricTags.prototype.__setProperties = function (property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            this._refs.input.disabled = this._disabled;
        }
        if (property == null || property === 'items') {
            this.__updateItemList();
        }
        if (property == null || property === 'value') {
            this.__updateTagList();
        }
    };
    FabricTags.prototype.__addListeners = function () {
        this._onClickListener = this.__OnClickListener.bind(this);
        if (this._refs.container)
            this._refs.container.addEventListener('click', this._onClickListener);
        var _this = this;
        this._refs.input.addEventListener('keyup', function (e) {
            var key = e.which || e.keyCode;
            if (([13, 32].indexOf(key) !== -1) && (this.value != null)) {
                if (this.value.trim() != '')
                    _this.__addTag(this.value);
                this.value = '';
            }
        });
    };
    FabricTags.prototype.__OnClickListener = function (e) {
        var target = e.target;
        if (target && target.classList.contains('delete')) {
            var item = target.parentNode.parentNode;
            item.parentNode.removeChild(item);
            return;
        }
        this._refs.input.focus();
    };
    FabricTags.prototype.__addTag = function (value) {
        if (!this._refs.container)
            return;
        var item = document.createElement('div');
        item.classList.add('tagItem');
        item.innerHTML = '<span>' + value + ' <span class="delete">x</span></span>';
        this._refs.container.insertBefore(item, this._refs.input);
    };
    FabricTags.prototype.__updateTagList = function () {
        var _this_1 = this;
        [].forEach.call(this.querySelectorAll('.tagItem'), function (item) {
            item.parentNode.removeChild(item);
        });
        [].concat(this.value).forEach(function (item) {
            _this_1.__addTag(item);
        });
    };
    FabricTags.prototype.__updateItemList = function () {
        if (!this._refs.datalist || !this._items)
            return;
        var fragment = document.createElement('DIV');
        this.items.forEach(function (item) {
            var option = document.createElement('OPTION');
            option.innerText = item.toString();
            fragment.appendChild(option);
        });
        this._refs.datalist.innerHTML = fragment.innerHTML;
    };
    Object.defineProperty(FabricTags, "observedAttributes", {
        get: function () {
            return ['value', 'items', 'disabled'];
        },
        enumerable: true,
        configurable: true
    });
    FabricTags.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        var n = (typeof this[attr] === 'boolean') ? this.hasAttribute(attr) : newValue;
        if (oldValue === n || this[attr] === n)
            return;
        if (attr === 'disabled') {
            this.disabled = !!n;
            return;
        }
        this[attr] = (Array.isArray(newValue)) ? newValue : newValue.toString().split(',');
    };
    FabricTags.prototype.__uuid = function () {
        function _() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return _() + _() + '-' + _() + '-' + _() + '-' + _() + '-' + _() + _() + _();
    };
    return FabricTags;
}(HTMLElement));
window.customElements.define('fabric-tags', FabricTags);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-tags {\ndisplay: inline-block;\n}\nfabric-tags .tags {\n\tmargin: auto;\n\tmax-width:100%;\n\tborder: 1px solid #EAEAEA;\n\tmin-height: 30px;\n\tbox-sizing: border-box;\n\tdisplay: flex;\n\tflex-wrap: wrap;\n}\nfabric-tags .tagItem {\n\tbackground-color: #F4F4F4;\n\tmargin: 1px;\n\theight: 28px;\n\tline-height: 28px;\n}\nfabric-tags .tagItem > span {\n\tmin-width: 20px;\n\tdisplay: inline-block;\n\tmargin: 0 8px;\n}\nfabric-tags .tagItem .delete {\n\tcursor: pointer;\n}\nfabric-tags input {\n\tmin-height: 28px;\n\tflex-grow: 1;\n\tmin-width: 1px;\n\tmax-width:100%; \n\twidth: 1px;\n\tpadding: 0 6px;\n\tmargin: 1px;\n\tborder: none;\n}";
    d.head.appendChild(style);
})(window, document);
