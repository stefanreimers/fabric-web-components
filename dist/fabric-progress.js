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
var FabricProgress = (function (_super) {
    __extends(FabricProgress, _super);
    function FabricProgress() {
        var _this = _super.call(this) || this;
        _this._refs = {};
        _this._name = '';
        _this._description = '';
        _this._total = 100;
        _this._progress = 0;
        _this._disabled = false;
        return _this;
    }
    Object.defineProperty(FabricProgress.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (this._disabled === !!value)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricProgress.prototype, "name", {
        get: function () { return this._name; },
        set: function (val) { if (this._name === val)
            return; this._name = val; this.__setProperties('name'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricProgress.prototype, "description", {
        get: function () { return this._description; },
        set: function (val) { if (this._description === val)
            return; this._description = val; this.__setProperties('description'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricProgress.prototype, "total", {
        get: function () { return this._total; },
        set: function (value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._total === value)
            return; this._total = value; this.__setProperties('total'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricProgress.prototype, "progress", {
        get: function () { return this._progress; },
        set: function (value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._progress === value)
            return; this._progress = value; this.__setProperties('progress'); },
        enumerable: false,
        configurable: true
    });
    FabricProgress.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
    };
    FabricProgress.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-ProgressIndicator\">\n\t\t  <div class=\"ms-ProgressIndicator-itemName\"></div>\n\t\t  <div class=\"ms-ProgressIndicator-itemProgress\">\n\t\t\t<div class=\"ms-ProgressIndicator-progressTrack\"></div>\n\t\t\t<div class=\"ms-ProgressIndicator-progressBar\"></div>\n\t\t  </div>\n\t\t  <div class=\"ms-ProgressIndicator-itemDescription\"></div>\n\t\t</div>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-ProgressIndicator'),
            name: this.querySelector('.ms-ProgressIndicator-itemName'),
            description: this.querySelector('.ms-ProgressIndicator-itemDescription'),
            bar: this.querySelector('.ms-ProgressIndicator-progressBar'),
            progress: this.querySelector('.ms-ProgressIndicator-itemProgress')
        };
    };
    FabricProgress.prototype.__setProperties = function (property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'name') {
            if (this._refs.name)
                this._refs.name.textContent = this._name;
        }
        if (property == null || property === 'description') {
            if (this._refs.description)
                this._refs.description.textContent = this._description;
        }
        if (property == null || ['progress', 'total'].indexOf(property) !== -1) {
            this.__updateProgress();
        }
    };
    Object.defineProperty(FabricProgress, "observedAttributes", {
        get: function () {
            return ['name', 'description', 'total', 'progress'];
        },
        enumerable: false,
        configurable: true
    });
    FabricProgress.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (oldValue != newValue)
            this[attr] = newValue;
    };
    FabricProgress.prototype.__updateProgress = function () {
        var percentage = (this._progress == null || this._progress === 0) ? 0 : Math.round(this._progress / this._total * 100);
        if (this._refs.bar)
            this._refs.bar.style.width = percentage + "%";
    };
    return FabricProgress;
}(HTMLElement));
window.customElements.define('fabric-progress', FabricProgress);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-progress {display:inline-block} .ms-ProgressIndicator{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;font-weight:400}\n.ms-ProgressIndicator-itemName{color:#333;font-size:14px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;padding-top:4px;line-height:20px}\n.ms-ProgressIndicator-itemDescription{color:#767676;font-size:11px;line-height:18px}\n.ms-ProgressIndicator-itemProgress{position:relative;width:180px;height:2px;padding:8px 0}\n.ms-ProgressIndicator-progressTrack{position:absolute;width:100%;height:2px;background-color:#eaeaea;outline:1px solid transparent}\n.ms-ProgressIndicator-progressBar{background-color:#0078d7;height:2px;position:absolute;transition:width .3s ease;width:0}\n@media screen and (-ms-high-contrast:active){.ms-ProgressIndicator-progressBar{background-color:#fff}\n}\n@media screen and (-ms-high-contrast:black-on-white){.ms-ProgressIndicator-progressBar{background-color:#000}\n}";
    d.head.appendChild(style);
})(window, document);
