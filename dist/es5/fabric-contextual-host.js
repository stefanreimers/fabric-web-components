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
var FabricContextualHost = (function (_super) {
    __extends(FabricContextualHost, _super);
    function FabricContextualHost() {
        var _this = _super.call(this) || this;
        _this._matchTargetWidth = false;
        _this._multiselect = false;
        _this._direction = 'bottom';
        _this._AVAILABLE_DIRECTIONS = ['left', 'right', 'top', 'bottom'];
        _this._MODAL_STATE_POSITIONED = "is-positioned";
        _this._CONTEXT_STATE_CLASS = "is-open";
        _this._ARROW_SIZE = 28;
        _this._ARROW_OFFSET = 8;
        _this._arrowPosition = null;
        _this._target = { element: null, height: null, width: null };
        _this._refs = {};
        return _this;
    }
    Object.defineProperty(FabricContextualHost.prototype, "arrowPosition", {
        get: function () { return this._arrowPosition; },
        set: function (value) {
            if (this._AVAILABLE_DIRECTIONS.indexOf(value) === -1)
                throw new RangeError('Arrow position unknown');
            value = 'arrow--' + value.substr(0, 1).toUpperCase + value.substr(1);
            if (value === this._arrowPosition)
                return;
            this._arrowPosition = value;
            this.__setProperties('arrowPosition');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricContextualHost.prototype, "matchTargetWidth", {
        get: function () { return this._matchTargetWidth; },
        set: function (value) { this._matchTargetWidth = !!value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricContextualHost.prototype, "target", {
        get: function () { return this._target.element; },
        set: function (value) { this._target.element = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricContextualHost.prototype, "direction", {
        get: function () { return this._direction; },
        set: function (value) { if (this._AVAILABLE_DIRECTIONS.indexOf(value) === -1)
            throw new RangeError('Direction unknown'); this._direction = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricContextualHost.prototype, "multiselect", {
        get: function () { return this._multiselect; },
        set: function (value) { this._multiselect = !!value; },
        enumerable: true,
        configurable: true
    });
    FabricContextualHost.prototype.connectedCallback = function () {
        if (this._target.element == null) {
            var selector = this.getAttribute('host');
            if (selector) {
                var target = this.closest(selector) || document.querySelector(selector);
                if (target)
                    this.target = target;
            }
        }
        this.__setResizeDisposal();
    };
    Object.defineProperty(FabricContextualHost, "observedAttributes", {
        get: function () {
            return ['arrowPosition', 'direction', 'matchTargetWidth', 'multiselect'];
        },
        enumerable: true,
        configurable: true
    });
    FabricContextualHost.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (['matchTargetWidth', 'multiselect'].indexOf(attr) !== -1) {
            newValue = this.hasAttribute(attr);
        }
        if (oldValue === newValue || newValue === this[attr])
            return;
        this[attr] = newValue;
    };
    FabricContextualHost.prototype.__setupUI = function () {
        var markup = "<div class=\"ms-ContextualHost is-hidden\">\n\t\t  <div class=\"ms-ContextualHost-main\"></div>\n\t\t  <div class=\"ms-ContextualHost-beak\"></div>\n\t\t</div>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-ContextualHost'),
            main: this.querySelector('.ms-ContextualHost-main'),
            arrow: this.querySelector('.ms-ContextualHost-beak')
        };
    };
    FabricContextualHost.prototype.__setProperties = function (property) {
        if (property == null || property === 'arrowPosition') {
        }
    };
    FabricContextualHost.prototype.__openModal = function () {
        this.__saveModalSize();
        this.__findAvailablePosition();
        this._refs.container.classList.add(this._CONTEXT_STATE_CLASS);
        this.__setCloseListeners();
    };
    FabricContextualHost.prototype.__disposeModal = function () {
        window.removeEventListener("resize", this.__boundResizeAction, false);
        document.body.removeEventListener("click", this.__boundClickAction, true);
        document.body.removeEventListener("keyup", this.__boundHandleKeyUpDismiss, true);
        this._refs.container.classList.remove(this._CONTEXT_STATE_CLASS);
    };
    FabricContextualHost.prototype.__saveModalSize = function () {
        if (this._target.element == null) {
            console.warn('__saveModalSize, no target');
            return;
        }
        var _modalStyles = window.getComputedStyle(this._refs.container);
        this._refs.container.setAttribute("style", "opacity: 0; z-index: -1");
        this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);
        this._refs.container.classList.add(this._CONTEXT_STATE_CLASS);
        if (this._matchTargetWidth) {
            var teStyles = window.getComputedStyle(this._target.element);
            this._modalWidth = this._target.element.getBoundingClientRect().width
                + (parseInt(teStyles.marginLeft, 10)
                    + parseInt(teStyles.marginLeft, 10));
        }
        else {
            this._modalWidth = this._refs.container.getBoundingClientRect().width
                + (parseInt(_modalStyles.marginLeft, 10)
                    + parseInt(_modalStyles.marginRight, 10));
            this._refs.container.setAttribute("style", "");
        }
        this._modalHeight = this._refs.container.getBoundingClientRect().height
            + (parseInt(_modalStyles.marginTop, 10)
                + parseInt(_modalStyles.marginBottom, 10));
        this._refs.container.classList.remove(this._MODAL_STATE_POSITIONED);
        this._refs.container.classList.remove(this._CONTEXT_STATE_CLASS);
        this._target.width = this._target.element.getBoundingClientRect().width;
        this._target.height = this._target.element.getBoundingClientRect().height;
    };
    FabricContextualHost.prototype.__findAvailablePosition = function () {
        var _posOk;
        switch (this._direction) {
            case "left":
                _posOk = this.__positionOk(this.__tryPosModalLeft.bind(this), this.__tryPosModalRight.bind(this), this.__tryPosModalBottom.bind(this), this.__tryPosModalTop.bind(this));
                this.__setPosition(_posOk);
                break;
            case "right":
                _posOk = this.__positionOk(this.__tryPosModalRight.bind(this), this.__tryPosModalLeft.bind(this), this.__tryPosModalBottom.bind(this), this.__tryPosModalTop.bind(this));
                this.__setPosition(_posOk);
                break;
            case "top":
                _posOk = this.__positionOk(this.__tryPosModalTop.bind(this), this.__tryPosModalBottom.bind(this));
                this.__setPosition(_posOk);
                break;
            case "bottom":
                _posOk = this.__positionOk(this.__tryPosModalBottom.bind(this), this.__tryPosModalTop.bind(this));
                this.__setPosition(_posOk);
                break;
            default:
                this.__setPosition();
        }
    };
    FabricContextualHost.prototype.__positionOk = function (pos1, pos2, pos3, pos4) {
        var _posOk;
        _posOk = pos1();
        if (!_posOk) {
            _posOk = pos2();
            if (!_posOk && pos3) {
                _posOk = pos3();
                if (!_posOk && pos4) {
                    _posOk = pos4();
                }
            }
        }
        return _posOk;
    };
    FabricContextualHost.prototype.__tryPosModalLeft = function () {
        var teLeft = this._target.element.getBoundingClientRect().left;
        return (teLeft < this._modalWidth) ? false : "left";
    };
    FabricContextualHost.prototype.__tryPosModalRight = function () {
        var teRight = this._target.element.getBoundingClientRect().right;
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        return ((w - teRight) < this._modalWidth) ? false : "right";
    };
    FabricContextualHost.prototype.__tryPosModalBottom = function () {
        var teBottom = window.innerHeight - this._target.element.getBoundingClientRect().bottom;
        return (teBottom < this._modalHeight) ? false : "bottom";
    };
    FabricContextualHost.prototype.__tryPosModalTop = function () {
        var teTop = this._target.element.getBoundingClientRect().top;
        return (teTop < this._modalHeight) ? false : "top";
    };
    FabricContextualHost.prototype.__setPosition = function (curDirection) {
        if (this._target.element == null) {
            console.warn('__setPosition, no target');
            return;
        }
        var teBR = this._target.element.getBoundingClientRect();
        var teLeft = teBR.left;
        var teRight = teBR.right;
        var teTop = teBR.top;
        var teWidth = teBR.width;
        var teHeight = teBR.height;
        var mHLeft;
        var mHTop;
        var mWidth = "";
        var arrowTop;
        var arrowLeft;
        var windowX = window.scrollX ? window.scrollX : 0;
        var windowY = window.scrollY ? window.scrollY : 0;
        var arrowSpace = (this._arrowPosition != null) ? this._ARROW_SIZE : 0;
        if (this._matchTargetWidth) {
            mWidth = "width: " + this._modalWidth + "px;";
        }
        switch (curDirection) {
            case "left":
                mHLeft = teLeft - this._modalWidth - arrowSpace;
                mHTop = this.__calcTop(this._modalHeight, teHeight, teTop);
                mHTop += window.scrollY ? window.scrollY : 0;
                this._refs.container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);
                if (this._arrowPosition != null) {
                    this._refs.container.classList.add("ms-ContextualHost--arrowRight");
                    arrowTop = ((teTop + windowY) - mHTop) + this._ARROW_OFFSET;
                    this._refs.arrow.setAttribute("style", "top: " + arrowTop + "px;");
                }
                break;
            case "right":
                mHTop = this.__calcTop(this._modalHeight, teHeight, teTop);
                mHTop += windowY;
                mHLeft = teRight + arrowSpace;
                this._refs.container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);
                if (this._arrowPosition != null) {
                    arrowTop = ((windowY + teTop) - mHTop) + this._ARROW_OFFSET;
                    this._refs.arrow.setAttribute("style", "top: " + arrowTop + "px;");
                    this._refs.container.classList.add("ms-ContextualHost--arrowLeft");
                }
                break;
            case "top":
                mHLeft = this.__calcLeft(this._modalWidth, teWidth, teLeft);
                mHTop = teTop - this._modalHeight - arrowSpace;
                mHTop += windowY;
                this._refs.container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);
                if (this._arrowPosition != null) {
                    arrowTop = this._modalHeight - (arrowSpace / 2);
                    arrowLeft = Math.max(windowX + teLeft - mHLeft + ((teWidth - arrowSpace) / 2), this._ARROW_OFFSET);
                    this._refs.arrow.setAttribute("style", "top: " + arrowTop + "px; left: " + arrowLeft + "px;");
                    this._refs.container.classList.add("ms-ContextualHost--arrowBottom");
                }
                break;
            case "bottom":
                mHLeft = mHLeft = this.__calcLeft(this._modalWidth, teWidth, teLeft);
                mHTop = teTop + teHeight + arrowSpace;
                mHTop += window.scrollY ? window.scrollY : 0;
                this._refs.container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);
                if (this._arrowPosition != null) {
                    arrowLeft = Math.max(windowX + teLeft - mHLeft + ((teWidth - arrowSpace) / 2), this._ARROW_OFFSET);
                    this._refs.arrow.setAttribute("style", "left: " + arrowLeft + "px;");
                    this._refs.container.classList.add("ms-ContextualHost--arrowTop");
                }
                break;
            default:
                this._refs.container.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);");
        }
    };
    FabricContextualHost.prototype.__calcLeft = function (mWidth, teWidth, teLeft) {
        var mHalfWidth = mWidth / 2;
        var teHalf = teWidth / 2;
        var mHLeft = (teLeft + teHalf) - mHalfWidth;
        mHLeft = (mHLeft < mHalfWidth) ? teLeft : mHLeft;
        return mHLeft;
    };
    FabricContextualHost.prototype.__calcTop = function (mHeight, teHeight, teTop) {
        var mHalfWidth = mHeight / 2;
        var teHalf = teHeight / 2;
        var mHLeft = (teTop + teHalf) - mHalfWidth;
        mHLeft = (mHLeft < mHalfWidth) ? teTop : mHLeft;
        return mHLeft;
    };
    FabricContextualHost.prototype.__setCloseListeners = function () {
        this.__boundResizeAction = this.__boundResizeAction || this.__resizeAction.bind(this);
        this.__boundClickAction = this.__boundClickAction || this.__clickAction.bind(this);
        this.__boundHandleKeyUpDismiss = this.__boundHandleKeyUpDismiss || this.__handleKeyUpDismiss.bind(this);
        this.__setDismissClick();
    };
    FabricContextualHost.prototype.__clickAction = function (e) {
        if (!this._refs.container.contains(e.target) && e.target !== this._refs.container) {
            e.preventDefault();
            e.stopPropagation();
            this.__disposeModal();
        }
        else {
            e.preventDefault();
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('contextual-menu-link-click', { detail: { node: e.target }, bubbles: true, cancelable: true }));
        }
    };
    FabricContextualHost.prototype.__setDismissClick = function () {
        document.body.addEventListener("click", this.__boundClickAction, true);
        document.body.addEventListener("keyup", this.__boundHandleKeyUpDismiss, true);
    };
    FabricContextualHost.prototype.__handleKeyUpDismiss = function (e) {
        if (e.keyCode === 32 || e.keyCode === 27) {
            if (this._dismissAction && typeof this._dismissAction === 'function')
                this._dismissAction(e);
        }
    };
    FabricContextualHost.prototype.__resizeAction = function () {
        this.__disposeModal();
    };
    FabricContextualHost.prototype.__setResizeDisposal = function () {
        window.addEventListener("resize", this.__boundResizeAction, false);
    };
    return FabricContextualHost;
}(HTMLElement));
window.customElements.define('fabric-contextual-host', FabricContextualHost);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = ".ms-ContextualHost{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;z-index:10;margin:16px auto;position:relative;min-width:10px;display:none;background-color:#fff;box-shadow:0 3px 5px 0 rgba(0,0,0,.4)}\n.ms-ContextualHost.is-positioned{position:absolute;margin:0}\n.ms-ContextualHost.is-open{display:inline-block}\n.ms-ContextualHost-beak{box-shadow:0 0 15px -5px #3c3c3c;position:absolute;width:28px;height:28px;background:#fff;border:1px solid #eaeaea;box-sizing:border-box;top:-6px;display:none;transform:rotate(45deg);z-index:0;outline:1px solid transparent}\n.ms-ContextualHost.ms-ContextualHost--arrowLeft .ms-ContextualHost-beak,.ms-ContextualHost.ms-ContextualHost--arrowRight .ms-ContextualHost-beak{top:40px;display:none}\n.ms-ContextualHost.ms-ContextualHost--arrowLeft .ms-ContextualHost-beak{left:-10px}\n.ms-ContextualHost.ms-ContextualHost--arrowRight .ms-ContextualHost-beak{right:-10px}\n.ms-ContextualHost.ms-ContextualHost--arrowTop .ms-ContextualHost-beak{display:block;top:-10px}\n.ms-ContextualHost.ms-ContextualHost--arrowBottom .ms-ContextualHost-beak{display:block;bottom:-10px}\n.ms-ContextualHost-main{position:relative;background-color:#fff;box-sizing:border-box;outline:1px solid transparent;z-index:5;min-height:10px}\n.ms-ContextualHost-close{margin:0;border:0;background:none;cursor:pointer;position:absolute;top:12px;right:12px;padding:8px;width:32px;height:32px;font-size:14px;color:#666;z-index:10}\n.ms-ContextualHost.ms-ContextualHost--close .ms-ContextualHost-title{margin-right:20px}\n.ms-ContextualHost.ms-ContextualHost--primaryArrow .ms-ContextualHost-beak{background-color:#0078d7}\n@media (min-width:480px){.ms-ContextualHost{margin:16px}\n.ms-ContextualHost.is-positioned{margin:0}\n.ms-ContextualHost.ms-ContextualHost--arrowLeft .ms-ContextualHost-beak,.ms-ContextualHost.ms-ContextualHost--arrowRight .ms-ContextualHost-beak{display:block}}";
    d.head.appendChild(style);
})(window, document);
