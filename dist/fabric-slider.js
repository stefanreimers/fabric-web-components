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
var FabricSlider = (function (_super) {
    __extends(FabricSlider, _super);
    function FabricSlider() {
        var _this = _super.call(this) || this;
        _this._refs = {};
        _this._min = 0;
        _this._max = 100;
        _this._value = 0;
        _this._step = 1;
        _this._label = '';
        _this._showValue = true;
        _this._disabled = false;
        _this._vertical = false;
        return _this;
    }
    Object.defineProperty(FabricSlider.prototype, "min", {
        get: function () { return this._min; },
        set: function (value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._min === value)
            return; this._min = value; this.__setProperties('min'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSlider.prototype, "max", {
        get: function () { return this._max; },
        set: function (value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._max === value)
            return; this._max = value; this.__setProperties('max'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSlider.prototype, "value", {
        get: function () { return this._value; },
        set: function (value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._value === value)
            return; this._value = value; this.__setProperties('value'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSlider.prototype, "step", {
        get: function () { return this._step; },
        set: function (value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._step === value)
            return; this._step = value; this.__setProperties('step'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSlider.prototype, "label", {
        get: function () { return this._label; },
        set: function (value) { if (this._label === value)
            return; this._label = value; this.__setProperties('label'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSlider.prototype, "showvalue", {
        get: function () { return this._showValue; },
        set: function (value) { if (this._showValue === !!value)
            return; this._showValue = !!value; this.__setProperties('showvalue'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSlider.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (this._disabled === !!value)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricSlider.prototype, "vertical", {
        get: function () { return this._vertical; },
        set: function (value) { if (this._vertical === !!value)
            return; this._vertical = !!value; this.__setProperties('vertical'); },
        enumerable: false,
        configurable: true
    });
    FabricSlider.prototype.connectedCallback = function () {
        this._value = this._value || this._min;
        this.__setupUI();
        this.__setProperties();
        this._boundOnMouseMoveOrTouchMove = this.__onMouseMoveOrTouchMove.bind(this);
        this._boundMouseUpOrTouchEnd = this.__onMouseUpOrTouchEnd.bind(this);
        this.__addListeners();
    };
    FabricSlider.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-Slider\">\n\t\t\t<label class=\"ms-Label ms-Slider-label\"></label>\n\t\t\t<div class=\"ms-Slider-container\">\n\t\t\t\t<button class=\"ms-Slider-slideBox ms-Slider-showTransitions\" type=\"button\" role=\"slider\">\n\t\t\t\t\t<div class=\"ms-Slider-line\">\n\t\t\t\t\t\t<span class=\"ms-Slider-thumb\"></span>\n\t\t\t\t\t\t<span class=\"ms-Slider-active\"></span>\n\t\t\t\t\t\t<span class=\"ms-Slider-inactive\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t</button>\n\t\t\t\t<label class=\"ms-Label ms-Slider-value\"></Label>\n\t\t\t</div>\n\t\t</div>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-Slider'),
            label: this.querySelector('.ms-Slider-label'),
            showvalue: this.querySelector('.ms-Slider-value'),
            line: this.querySelector('.ms-Slider-line'),
            button: this.querySelector('.ms-Slider-slideBox'),
            thumb: this.querySelector('.ms-Slider-thumb'),
            active: this.querySelector('.ms-Slider-active'),
            inactive: this.querySelector('.ms-Slider-inactive')
        };
    };
    FabricSlider.prototype.__setProperties = function (property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'disabled') {
            var classList = this._refs.container.classList;
            if (this.disabled === true) {
                classList.remove('ms-Slider-enabled');
                classList.add('ms-Slider-disabled');
            }
            else {
                classList.remove('ms-Slider-disabled');
                classList.add('ms-Slider-enabled');
            }
            this.__addListeners();
        }
        if (property == null || property === 'showvalue') {
            this._refs.button.classList[(this.showvalue === true) ? 'add' : 'remove']('ms-Slider-showValue');
            this._refs.showvalue.textContent = (this.showvalue === true) ? this._value : '';
        }
        if (property == null || property === 'vertical') {
            var classList = this._refs.container.classList;
            if (this.vertical === true) {
                classList.remove('ms-Slider-row');
                classList.add('ms-Slider-column');
            }
            else {
                classList.remove('ms-Slider-row');
                classList.add('ms-Slider-column');
            }
        }
        if (property == null || property === 'label') {
            this._refs.label.textContent = this._label;
        }
        if (property == null || ['min', 'max', 'step', 'value'].indexOf(property) !== -1) {
            this.__renderValue();
        }
    };
    FabricSlider.prototype.__renderValue = function () {
        var thumbOffsetPercent = Math.round((this._value - this._min) / ((this._max - this._min) / 100));
        var direction = this._vertical ? 'bottom' : 'left';
        this._refs.thumb.style[direction] = thumbOffsetPercent + '%';
        this._refs.active.style.width = thumbOffsetPercent.toString() + '%';
        this._refs.inactive.style.width = (100 - thumbOffsetPercent).toString() + '%';
        if (this.showvalue && this._refs.showvalue)
            this._refs.showvalue.textContent = this._value;
    };
    FabricSlider.prototype.__addListeners = function () {
        if (this._disabled === true && this._boundonMouseDownOrTouchStart != null) {
            this.removeEventListener('mousedown', this._boundonMouseDownOrTouchStart);
            this.removeEventListener('touchstart', this._boundonMouseDownOrTouchStart);
            this._boundonMouseDownOrTouchStart = null;
        }
        else if (this._disabled === false && this._boundonMouseDownOrTouchStart == null) {
            this._boundonMouseDownOrTouchStart = this.__onMouseDownOrTouchStart.bind(this);
            this.addEventListener('mousedown', this._boundonMouseDownOrTouchStart);
            this.addEventListener('touchstart', this._boundonMouseDownOrTouchStart);
        }
    };
    FabricSlider.prototype.__onMouseDownOrTouchStart = function (event) {
        if (event.type === 'mousedown') {
            window.addEventListener('mousemove', this._boundOnMouseMoveOrTouchMove);
            window.addEventListener('mouseup', this._boundMouseUpOrTouchEnd);
        }
        else if (event.type === 'touchstart') {
            window.addEventListener('touchmove', this._boundOnMouseMoveOrTouchMove);
            window.addEventListener('touchend', this._boundMouseUpOrTouchEnd);
        }
        this.__onMouseMoveOrTouchMove(event, true);
    };
    FabricSlider.prototype.__onMouseMoveOrTouchMove = function (event, suppressEventCancelation) {
        if (!this._refs.line) {
            return;
        }
        var steps = (this._max - this._min) / this._step;
        var sliderPositionRect = this._refs.line.getBoundingClientRect();
        var sliderLength = !this._vertical ? sliderPositionRect.width : sliderPositionRect.height;
        var stepLength = sliderLength / steps;
        var currentSteps;
        var distance;
        if (!this._vertical) {
            var left = this.__getPosition(event, this._vertical);
            distance = sliderPositionRect.right - left;
            currentSteps = distance / stepLength;
        }
        else {
            var bottom = this.__getPosition(event, this._vertical);
            distance = sliderPositionRect.bottom - bottom;
            currentSteps = distance / stepLength;
        }
        var currentValue;
        var renderedValue;
        if (currentSteps > Math.floor(steps)) {
            renderedValue = currentValue = this._max;
        }
        else if (currentSteps < 0) {
            renderedValue = currentValue = this._min;
        }
        else {
            renderedValue = this._min + this._step * currentSteps;
            currentValue = this._min + this._step * Math.round(currentSteps);
        }
        this.__updateValue(currentValue, renderedValue);
        if (!suppressEventCancelation) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    FabricSlider.prototype.__getPosition = function (event, vertical) {
        var currentPosition;
        switch (event.type) {
            case 'mousedown':
            case 'mousemove':
                currentPosition = !vertical ? event.clientX : event.clientY;
                break;
            case 'touchstart':
            case 'touchmove':
                currentPosition = !vertical ? event.touches[0].clientX : event.touches[0].clientY;
                break;
        }
        return currentPosition;
    };
    FabricSlider.prototype.__updateValue = function (value, renderedValue) {
        var interval = 1.0 / this._step;
        var roundedValue = Math.round(renderedValue * interval) / interval;
        var newVal = this._max - roundedValue + this._min;
        if (newVal !== this._value) {
            this.value = newVal;
        }
    };
    FabricSlider.prototype.__onMouseUpOrTouchEnd = function (event) {
        switch (event.type) {
            case 'mouseup':
                window.removeEventListener('mousemove', this._boundOnMouseMoveOrTouchMove);
                window.removeEventListener('mouseup', this._boundMouseUpOrTouchEnd);
                break;
            case 'touchend':
                window.addEventListener('touchmove', this._boundOnMouseMoveOrTouchMove);
                window.addEventListener('touchend', this._boundMouseUpOrTouchEnd);
                break;
        }
    };
    Object.defineProperty(FabricSlider, "observedAttributes", {
        get: function () {
            return ['min', 'max', 'value', 'step', 'label', 'showvalue', 'disabled', 'vertical'];
        },
        enumerable: false,
        configurable: true
    });
    FabricSlider.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        this[attr] = (typeof this[attr] === 'boolean') ? this.hasAttribute(attr) : newValue;
    };
    return FabricSlider;
}(HTMLElement));
window.customElements.define('fabric-slider', FabricSlider);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-slider { \n  display: inline-block;\n  font-family: \"Segoe UI Web (West European)\",Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;\n  font-size: 14px\n}\n\n.ms-Slider-label{color: rgb(51, 51, 51);\nbox-sizing: border-box;\nbox-shadow: none;\nmargin: 0px;\ndisplay: block;\npadding: 0px;\noverflow-wrap: break-word;\n}\n\n.ms-Slider-container\n{\n  display: flex;\nflex-wrap: nowrap;\nalign-items: center;\n}\n\n.ms-Slider-slideBox\n{\noutline: transparent none medium;\nposition: relative;\nbackground: transparent none repeat scroll 0% 0%;\nborder: medium none;\nflex-grow: 1;\nline-height: 28px;\nheight: 28px;\nwidth: auto;\npadding: 0px 8px;\n}\n\n.ms-Slider-line {\n  display: flex;\nposition: relative;\nwidth: 100%;\n}\n\n.ms-Slider-thumb {\n\n  border-width: 2px;\n  border-style: solid;\n  border-color: rgb(102, 102, 102);\n  border-radius: 10px;\n  box-sizing: border-box;\n  background: rgb(255, 255, 255) none repeat scroll 0% 0%;\n  display: block;\n  width: 16px;\n  height: 16px;\n  position: absolute;\n  top: -6px;\n  transform: translateX(-50%);\n  transition: left 0.367s cubic-bezier(0.1, 0.9, 0.2, 1) 0s;\n\n}\n\n.ms-Slider-container:hover .ms-Slider-thumb {\n  border: 2px solid rgb(0, 120, 212);\n}\n\n.ms-Slider-active {\n  border-radius: 4px;\n  box-sizing: border-box;\n  height: 4px;\n  width: 100%;\n  background: rgb(102, 102, 102) none repeat scroll 0% 0%;\n  transition: width 0.367s cubic-bezier(0.1, 0.9, 0.2, 1) 0s;\n}\n\n.ms-Slider-container:hover .ms-Slider-active {\n  background-color: rgb(0, 120, 212);\n}\n\n.ms-Slider-inactive {\n  border-radius: 4px;\n  box-sizing: border-box;\n  height: 4px;\n  width: 100%;\n  background: rgb(200, 200, 200) none repeat scroll 0% 0%;\n  transition: width 0.367s cubic-bezier(0.1, 0.9, 0.2, 1) 0s;\n}\n\n.ms-Slider-container:hover .ms-Slider-inactive {\n  background-color: rgb(199, 224, 244);\n}\n\n.ms-Slider-value {\n  color: rgb(51, 51, 51);\n  box-sizing: border-box;\n  box-shadow: none;\n  margin: 0px 8px;\n  display: block;\n  padding: 5px 0px;\n  overflow-wrap: break-word;\n  flex-shrink: 1;\n  width: 40px;\n  line-height: 1;\n  white-space: nowrap;\n}\n";
    d.head.appendChild(style);
})(window, document);
