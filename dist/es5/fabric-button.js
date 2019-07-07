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
var FabricButton = (function (_super) {
    __extends(FabricButton, _super);
    function FabricButton() {
        var _this = _super.call(this) || this;
        _this._modifier = null;
        _this._disabled = false;
        _this._label = '';
        _this._icon = '';
        _this._description = '';
        _this._refs = {};
        return _this;
    }
    Object.defineProperty(FabricButton.prototype, "modifier", {
        get: function () { return this._modifier; },
        set: function (value) { throw new RangeError('The modifier property is static.'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricButton.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (!!value === this._disabled)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricButton.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { if (value === this._label)
            return; this._label = value; this.__setProperties('label'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricButton.prototype, "icon", {
        get: function () { return this._icon; },
        set: function (value) { if (value === this._icon)
            return; this._icon = value; this.__setProperties('icon'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricButton.prototype, "description", {
        get: function () { return this._description; },
        set: function (value) { if (value === this._description)
            return; this._description = value; this.__setProperties('description'); },
        enumerable: true,
        configurable: true
    });
    FabricButton.prototype.connectedCallback = function () {
        this.getStaticAttributes();
        this.__deriveLabelFromText();
        this.__setupUI();
        this.__setProperties();
    };
    FabricButton.prototype.__setupUI = function () {
        var modifier = (this._modifier) ? 'ms-Button--' + this._modifier : '';
        var markup = "<button class=\"ms-Button " + modifier + "\">\n\t\t\t<span class=\"ms-Button-icon\"><i class=\"ms-Icon\"></i></span>\n\t\t\t<span class=\"ms-Button-label\"></span>\n\t\t\t<span class=\"ms-Button-description\"></span>\n\t\t</button>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-Button'),
            icon: this.querySelector('.ms-Button-icon > .ms-Icon'),
            label: this.querySelector('.ms-Button-label'),
            description: this.querySelector('.ms-Button-description')
        };
    };
    FabricButton.prototype.__deriveLabelFromText = function () {
        if ((this._label == null || this._label === '') && this.textContent)
            this.label = this.textContent;
    };
    FabricButton.prototype.__setProperties = function (property) {
        if (!this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            this._refs.container.disabled = !!this._disabled;
        }
        if (property == null || property === 'label') {
            if (this._label == null || this.label === '') {
                this._refs.container.classList.add('ms-Button--noLabel');
            }
            else {
                this._refs.container.classList.remove('ms-Button--noLabel');
            }
            if (this._refs.label)
                this._refs.label.textContent = this._label || '';
        }
        if (property == null || property === 'description') {
            if (this._refs.description)
                this._refs.description.textContent = this._description || '';
        }
        if (property == null || property === 'icon') {
            if (this._icon == null || this._icon === '') {
                this._refs.container.classList.add('ms-Button--noIcon');
            }
            else {
                this._refs.container.classList.remove('ms-Button--noIcon');
            }
            if (this._refs.icon)
                this._refs.icon.className = 'ms-Icon ' + (this._icon == null || this._icon === '') ? '' : 'ms-Icon--' + this._icon;
        }
    };
    FabricButton.prototype.getStaticAttributes = function () {
        var modifier = this.getAttribute('modifier');
        if (modifier && ['primary', 'hero', 'compound', 'small'].indexOf(modifier) !== -1)
            this._modifier = modifier;
    };
    Object.defineProperty(FabricButton, "observedAttributes", {
        get: function () {
            return ['disabled', 'label', 'icon', 'description'];
        },
        enumerable: true,
        configurable: true
    });
    FabricButton.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        var n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    };
    return FabricButton;
}(HTMLElement));
window.customElements.define('fabric-button', FabricButton);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = ".ms-Button{box-sizing:border-box;margin:0;padding:0;box-shadow:none;font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;color:#333;font-size:14px;font-weight:400;background-color:#f4f4f4;border:1px solid #f4f4f4;cursor:pointer;display:inline-block;height:32px;min-width:80px;padding:4px 20px 6px}\n.ms-Button.is-hidden, .ms-Button.ms-Button--noIcon .ms-Button-icon {display:none}\n.ms-Button:hover{background-color:#eaeaea;border-color:#eaeaea}\n.ms-Button:hover .ms-Button-label{color:#000}\n@media screen and (-ms-high-contrast:active){.ms-Button:hover{color:#1aebff;border-color:#1aebff} }\n@media screen and (-ms-high-contrast:black-on-white){.ms-Button:hover{color:#37006e;border-color:#37006e} }\n.ms-Button:focus{background-color:#eaeaea;border-color:#0078d7;outline:1px solid transparent}\n.ms-Button:focus .ms-Button-label{color:#000}\n.ms-Button:active{background-color:#0078d7;border-color:#0078d7}\n.ms-Button:active .ms-Button-label{color:#fff}\n.ms-Button.is-disabled,.ms-Button:disabled{background-color:#f4f4f4;border-color:#f4f4f4;cursor:default}\n.ms-Button.is-disabled .ms-Button-label,.ms-Button:disabled .ms-Button-label{color:#a6a6a6}\n.ms-Button.is-disabled:focus,.ms-Button.is-disabled:hover,.ms-Button:disabled:focus,.ms-Button:disabled:hover{outline:0}\n.ms-Button-label{color:#333;font-weight:600;font-size:14px}\n.ms-Button-description,.ms-Button-icon{display:none}\n.ms-Button.ms-Button--primary{background-color:#0078d7;border-color:#0078d7}\n.ms-Button.ms-Button--primary .ms-Button-label{color:#fff}\n.ms-Button.ms-Button--primary:hover{background-color:#005a9e;border-color:#005a9e}\n.ms-Button.ms-Button--primary:focus{background-color:#005a9e;border-color:#004578}\n.ms-Button.ms-Button--primary:active{background-color:#0078d7;border-color:#0078d7}\n.ms-Button.ms-Button--primary.is-disabled,.ms-Button.ms-Button--primary:disabled{background-color:#f4f4f4;border-color:#f4f4f4}\n.ms-Button.ms-Button--primary.is-disabled .ms-Button-label,.ms-Button.ms-Button--primary:disabled .ms-Button-label{color:#a6a6a6}\n.ms-Button.ms-Button--small{min-width:60px;min-height:24px;height:auto;padding-top:0;padding-bottom:4px}\n.ms-Button.ms-Button--small .ms-Button-label{font-weight:400;font-size:12px}\n.ms-Button.ms-Button--hero{-ms-flex-align:center;align-items:center;background-color:transparent;border:0;padding:0;position:relative}\n.ms-Button.ms-Button--hero .ms-Button-icon{color:#0078d7;display:inline-block;font-size:12px;margin-right:4px;padding-top:5px;text-align:center}\n.ms-Button.ms-Button--hero .ms-Button-icon .ms-Icon{border-radius:18px;border:1px solid #0078d7;font-size:12px;height:18px;line-height:18px;width:18px}\n.ms-Button.ms-Button--hero .ms-Button-label{color:#0078d7;font-size:21px;font-weight:100;position:relative;text-decoration:none;vertical-align:top}\n.ms-Button.ms-Button--hero:focus .ms-Button-icon,.ms-Button.ms-Button--hero:hover .ms-Button-icon{color:#005a9e}\n.ms-Button.ms-Button--hero:focus .ms-Button-icon .ms-Icon,.ms-Button.ms-Button--hero:hover .ms-Button-icon .ms-Icon{border:1px solid #005a9e}\n.ms-Button.ms-Button--hero:focus .ms-Button-label,.ms-Button.ms-Button--hero:hover .ms-Button-label{color:#004578}\n.ms-Button.ms-Button--hero:active .ms-Button-icon{color:#0078d7}\n.ms-Button.ms-Button--hero:active .ms-Button-icon .ms-Icon{border:1px solid #0078d7}\n.ms-Button.ms-Button--hero:active .ms-Button-label{color:#0078d7}\n.ms-Button.ms-Button--hero.is-disabled .ms-Button-icon,.ms-Button.ms-Button--hero:disabled .ms-Button-icon{color:#c8c8c8}\n.ms-Button.ms-Button--hero.is-disabled .ms-Button-icon .ms-Icon,.ms-Button.ms-Button--hero:disabled .ms-Button-icon .ms-Icon{border:1px solid #c8c8c8}\n.ms-Button.ms-Button--hero.is-disabled .ms-Button-label,.ms-Button.ms-Button--hero:disabled .ms-Button-label{color:#a6a6a6}\n.ms-Button.ms-Button--compound{display:block;height:auto;max-width:280px;min-height:72px;padding:20px}\n.ms-Button.ms-Button--compound .ms-Button-label{display:block;font-weight:600;position:relative;text-align:left;margin-top:-5px}\n.ms-Button.ms-Button--compound .ms-Button-description{color:#666;display:block;font-weight:400;font-size:12px;position:relative;text-align:left;top:3px}\n.ms-Button.ms-Button--compound:hover .ms-Button-description{color:#212121}\n.ms-Button.ms-Button--compound:focus{border-color:#0078d7;background-color:#f4f4f4}\n.ms-Button.ms-Button--compound:focus .ms-Button-label{color:#333}\n.ms-Button.ms-Button--compound:focus .ms-Button-description{color:#666}\n.ms-Button.ms-Button--compound:active{background-color:#0078d7}\n.ms-Button.ms-Button--compound:active .ms-Button-description,.ms-Button.ms-Button--compound:active .ms-Button-label{color:#fff}\n.ms-Button.ms-Button--compound.is-disabled .ms-Button-description,.ms-Button.ms-Button--compound.is-disabled .ms-Button-label,.ms-Button.ms-Button--compound:disabled .ms-Button-description,.ms-Button.ms-Button--compound:disabled .ms-Button-label{color:#a6a6a6}\n.ms-Button.ms-Button--compound.is-disabled:active,.ms-Button.ms-Button--compound.is-disabled:focus,.ms-Button.ms-Button--compound:disabled:active,.ms-Button.ms-Button--compound:disabled:focus{border-color:#f4f4f4;background-color:#f4f4f4}\n.ms-Button.ms-Button--compound.is-disabled:active .ms-Button-description,.ms-Button.ms-Button--compound.is-disabled:active .ms-Button-label,.ms-Button.ms-Button--compound.is-disabled:focus .ms-Button-description,.ms-Button.ms-Button--compound.is-disabled:focus .ms-Button-label,.ms-Button.ms-Button--compound:disabled:active .ms-Button-description,.ms-Button.ms-Button--compound:disabled:active .ms-Button-label,.ms-Button.ms-Button--compound:disabled:focus .ms-Button-description,.ms-Button.ms-Button--compound:disabled:focus .ms-Button-label{color:#a6a6a6}";
    d.head.appendChild(style);
})(window, document);
