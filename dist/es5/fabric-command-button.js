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
var FabricCommandButton = (function (_super) {
    __extends(FabricCommandButton, _super);
    function FabricCommandButton() {
        var _this = _super.call(this) || this;
        _this._disabled = false;
        _this._split = false;
        _this._label = '';
        _this._icon = '';
        _this._refs = {};
        _this._modifier = null;
        _this._items = [];
        return _this;
    }
    Object.defineProperty(FabricCommandButton.prototype, "modifier", {
        get: function () { return this._modifier; },
        set: function (value) { throw new RangeError('The modifier property is static.'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCommandButton.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (!!value === this._disabled)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCommandButton.prototype, "split", {
        get: function () { return this._split; },
        set: function (value) { if (!!value === this._split)
            return; this._split = !!value; this.__setProperties('split'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCommandButton.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { if (value === this._label)
            return; this._label = value; this.__setProperties('label'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCommandButton.prototype, "icon", {
        get: function () { return this._icon; },
        set: function (value) { if (value === this._icon)
            return; this._icon = value; this.__setProperties('icon'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricCommandButton.prototype, "items", {
        get: function () { return this._items || []; },
        set: function (value) { this._items = value; this.__setProperties('items'); },
        enumerable: true,
        configurable: true
    });
    FabricCommandButton.prototype.connectedCallback = function () {
        this.__getStaticAttributes();
        this.__deriveLabelFromText();
        this.__setupUI();
        this.__setProperties();
    };
    FabricCommandButton.prototype.__setupUI = function () {
        var modifier = (this._modifier) ? 'ms-CommandButton--' + this._modifier : '';
        var markup = "<div class=\"ms-CommandButton " + modifier + "\">\n            <button class=\"ms-CommandButton-button\">\n                <span class=\"ms-CommandButton-icon ms-fontColor-themePrimary\"><i class=\"ms-Icon\"></i></span> \n                <span class=\"ms-CommandButton-label\"></span> \n\t\t\t\t<span class=\"ms-CommandButton-dropdownIcon\"><i class=\"ms-Icon ms-Icon--ChevronDown\"></i></span> \n            </button>\n\t\t\t<button class=\"ms-CommandButton-splitIcon\">\n\t\t\t\t<i class=\"ms-Icon ms-Icon--ChevronDown\"></i>\n\t\t\t</button>\n            </div>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-CommandButton'),
            button: this.querySelector('.ms-CommandButton-button'),
            iconContainer: this.querySelector('.ms-CommandButton-icon'),
            icon: this.querySelector('.ms-CommandButton-icon > .ms-Icon'),
            label: this.querySelector('.ms-CommandButton-label'),
            splitIcon: this.querySelector('.ms-CommandButton-splitIcon'),
            dropdown: this.querySelector('.ms-CommandButton-dropdownIcon')
        };
    };
    FabricCommandButton.prototype.__deriveLabelFromText = function () {
        if ((this._label == null || this._label === '') && this.textContent)
            this.label = this.textContent;
    };
    FabricCommandButton.prototype.__setProperties = function (property) {
        var _this = this;
        if (!this._refs.container)
            return;
        if (property == null || property === 'icon') {
            var icon = (this._icon) ? ' ms-Icon--' + this._icon : '';
            this._refs.icon.className = 'ms-Icon' + icon;
        }
        if (property == null || property === 'disabled') {
            this._refs.container.classList[(this.disabled === true) ? 'add' : 'remove']('is-disabled');
        }
        if (property == null || property === 'split') {
            this._refs.splitIcon.classList[(this.split === false) ? 'add' : 'remove']('is-hidden');
        }
        if (property == null || property === 'label') {
            this._refs.label.textContent = this._label || '';
        }
        if (property == null || property === 'items') {
            var action_1 = (this.items.length === 0) ? 'add' : 'remove';
            ['splitIcon', 'dropdown', 'contextualMenu'].forEach(function (element) {
                if (_this._refs[element])
                    _this._refs[element].classList[action_1]('is-hidden');
            });
            if (this.items.length > 0 && !this.querySelector('fabric-contextual-menu')) {
                console.log('Add menu');
                var menu_1 = document.createElement('fabric-contextual-menu');
                menu_1._host = this._refs.button;
                this.items.forEach(function (item) {
                    var li = document.createElement('LI');
                    if (typeof item === 'string') {
                        li.textContent = item;
                    }
                    else {
                        li.textContent = item.text;
                        if (item.class)
                            li.className = item.class;
                    }
                    menu_1.appendChild(li);
                });
                this._refs.container.appendChild(menu_1);
                this._refs.contextualMenu = this.querySelector('fabric-contextual-menu');
            }
            else if (this.items.length === 0 && this._refs.contextualMenu) {
                console.log('remove menu');
                this._refs.container.removeChild(this._refs.contextualMenu);
                delete this._refs.contextualMenu;
            }
        }
    };
    FabricCommandButton.prototype.__getStaticAttributes = function () {
        var modifier = this.getAttribute('modifier');
        if (modifier && ['actionButton', 'inline', 'noLabel', 'pivot', 'textOnly'].indexOf(modifier) !== -1)
            this._modifier = modifier;
    };
    Object.defineProperty(FabricCommandButton, "observedAttributes", {
        get: function () {
            return ['disabled', 'label', 'icon', 'split'];
        },
        enumerable: true,
        configurable: true
    });
    FabricCommandButton.prototype.attributeChangedCallback = function (attrName, oldValue, newValue) {
        var n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    };
    return FabricCommandButton;
}(HTMLElement));
window.customElements.define('fabric-command-button', FabricCommandButton);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "\nfabric-command-button{display:inline-block}\n.ms-CommandButton{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;\n-webkit-font-smoothing:antialiased;display:inline-block;vertical-align:top}\n.ms-CommandButton.is-hidden{display:none}\n.ms-CommandButton.is-disabled .ms-CommandButton-button,\n.ms-CommandButton:disabled .ms-CommandButton-button{cursor:default}\n.ms-CommandButton.is-disabled .ms-CommandButton-button:hover,\n.ms-CommandButton:disabled .ms-CommandButton-button:hover{background-color:#eff6fc}\n.ms-CommandButton.is-disabled .ms-CommandButton-button .ms-CommandButton-icon,\n.ms-CommandButton.is-disabled .ms-CommandButton-button .ms-CommandButton-label,\n.ms-CommandButton:disabled .ms-CommandButton-button .ms-CommandButton-icon,\n.ms-CommandButton:disabled .ms-CommandButton-button .ms-CommandButton-label{color:#a6a6a6}\n.ms-CommandButton2 .ms-ContextualMenu{display:none}\n.ms-CommandButton-button,\n.ms-CommandButton-splitIcon{box-sizing:border-box;margin:0;padding:0;box-shadow:none;color:#333;font-size:14px;font-weight:400;\ncursor:pointer;display:inline-block;height:40px;line-height:40px;outline:1px solid transparent;padding:0 8px;position:relative;\nvertical-align:top;background:transparent}\n.ms-CommandButton-button:hover,\n.ms-CommandButton-splitIcon:hover{background-color:#eaeaea}\n.ms-CommandButton-button:hover .ms-CommandButton-label,\n.ms-CommandButton-splitIcon:hover .ms-CommandButton-label{color:#212121}\n.ms-CommandButton-button:active,\n.ms-CommandButton-splitIcon:active{background-color:#eaeaea}\n.ms-CommandButton-button:focus:before,\n.ms-CommandButton-splitIcon:focus:before{top:3px;left:3px;right:3px;bottom:3px;border:1px solid #333;position:absolute;z-index:10;content:\"\";outline:none}\n.ms-CommandButton-button:focus,\n.ms-CommandButton-splitIcon:focus{outline:0}\n@media only screen and (max-width:639px){\n\t.ms-CommandButton-button,\n\t.ms-CommandButton-splitIcon{height:44px}\n\t.ms-CommandButton-button .ms-CommandButton-icon,\n\t.ms-CommandButton-splitIcon .ms-CommandButton-icon{font-size:20px}\n\t.ms-CommandButton-button .ms-CommandButton-label,\n\t.ms-CommandButton-splitIcon .ms-CommandButton-label{line-height:44px}\n}\n.ms-CommandButton-button{border:0;margin:0}\n.ms-CommandButton+.ms-CommandButton{margin-left:8px}\n@media only screen and (max-width:639px){\n\t.ms-CommandButton+.ms-CommandButton{margin-left:4px}\n}\n.ms-CommandButton-icon{display:inline-block;margin-right:8px;position:relative;font-size:16px;min-width:16px;height:100%}.\nms-CommandButton-icon .ms-Icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}\n.ms-CommandButton-label{font-size:14px;font-weight:400;color:#333;line-height:40px;height:100%;display:inline-block;vertical-align:top}\n.ms-CommandButton-label:hover{color:#212121}\nfabric-command-button[split] .ms-CommandButton-dropdownIcon {display: none}\n.ms-CommandButton-dropdownIcon,\n.ms-CommandButton-splitIcon{display:inline-block;position:relative;color:#333;font-size:12px;font-weight:300;min-width:12px;height:40px;\nvertical-align:top;margin-left:8px}\n.ms-CommandButton-dropdownIcon .ms-Icon,\n.ms-CommandButton-splitIcon .ms-Icon{line-height:normal;padding-top:16px}\n.ms-CommandButton-dropdownIcon:focus:before,\n.ms-CommandButton-splitIcon:focus:before{top:3px;left:3px;right:3px;bottom:3px;border:1px solid #333;position:absolute;z-index:10;content:\"\";outline:none}\n@media only screen and (max-width:639px){\n\t.ms-CommandButton-dropdownIcon,\n\t.ms-CommandButton-splitIcon{display:none}\n}\n.ms-CommandButton-splitIcon{margin-left:-2px;width:27px;border:0}\n.ms-CommandButton-splitIcon .ms-Icon{margin-left:-1px;position:relative;padding-top:16px}\n.ms-CommandButton-splitIcon .ms-Icon:after{position:absolute;content:\" \";width:1px;height:16px;top:12px;left:-8px;border-left:1px solid #c8c8c8}\n.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-icon{margin-right:0}\n.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-label{display:none}\n.ms-CommandButton.ms-CommandButton--noLabel .ms-CommandButton-button{padding:0 12px}\n.ms-CommandButton.ms-CommandButton--inline .ms-CommandButton-button{background:none}\n.ms-CommandButton.ms-CommandButton--actionButton .ms-CommandButton-button{width:50px;height:40px}\n.ms-CommandButton.ms-CommandButton--actionButton .ms-CommandButton-icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);\nwidth:16px;height:16px;padding-right:0}\n.ms-CommandButton.ms-CommandButton--actionButton .ms-CommandButton-icon > i {display:block}\n.ms-CommandButton.ms-CommandButton--actionButton .ms-CommandButton-label {display:none}\n.ms-CommandButton.ms-CommandButton--pivot.is-active:before,\n.ms-CommandButton.ms-CommandButton--pivot:hover:before{content:\"\";height:2px;position:absolute;left:0;right:0;background-color:#0078d7;bottom:0;z-index:5}\n.ms-CommandButton.ms-CommandButton--pivot .ms-CommandButton-label,\n.ms-CommandButton.ms-CommandButton--textOnly .ms-CommandButton-label{display:inline-block}\n.ms-CommandButton.ms-CommandButton--textOnly .ms-CommandButton-icon{display:none}\n@media only screen and (max-width:479px){\n\t.ms-CommandButton.ms-CommandButton--pivot .ms-CommandButton-label,\n\t.ms-CommandButton.ms-CommandButton--textOnly .ms-CommandButton-label{font-size:16px}\n}\n.ms-fontColor-themePrimary { color: #0078d7 }\n.is-hidden{display: none !important}\n";
    d.head.appendChild(style);
})(window, document);
