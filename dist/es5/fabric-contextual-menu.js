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
var FabricContextualMenu = (function (_super) {
    __extends(FabricContextualMenu, _super);
    function FabricContextualMenu() {
        var _this = _super.call(this) || this;
        _this._hostEvent = 'click';
        _this._refs = {};
        _this._modifier = null;
        _this._host = null;
        return _this;
    }
    Object.defineProperty(FabricContextualMenu.prototype, "modifier", {
        get: function () { return this._modifier; },
        set: function (value) { throw new RangeError('The modifier property is static.'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricContextualMenu.prototype, "host", {
        get: function () { return this._host; },
        set: function (value) { throw new RangeError('The host property is static.'); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FabricContextualMenu.prototype, "hostEvent", {
        get: function () { return this._hostEvent; },
        set: function (value) { throw new RangeError('The hostEvent property is static.'); },
        enumerable: true,
        configurable: true
    });
    ;
    FabricContextualMenu.prototype.connectedCallback = function () {
        this.__getStaticAttributes();
        this.__setupUI();
        this.__boundHostEventHandler = this.__hostEventHandler.bind(this);
        this.__setListeners();
    };
    FabricContextualMenu.prototype.disconnectedCallback = function () {
        if (!this._host)
            return;
        var hostNode = document.querySelector(this._host);
        if (hostNode == null)
            return;
        hostNode.removeEventListener(this._hostEvent, this.__boundHostEventHandler);
    };
    FabricContextualMenu.prototype.__setupUI = function () {
        var modifier = (this._modifier) ? 'ms-ContextualMenu--' + this._modifier : '';
        var markup = "<ul class=\"ms-ContextualMenu " + modifier + "\"></ul>";
        var fragment = document.createElement('DIV');
        fragment.innerHTML = markup;
        while (this.childNodes.length > 0) {
            var fragmentUl = fragment.querySelector('ul');
            if (fragmentUl)
                fragmentUl.appendChild(this.childNodes[0]);
        }
        _super.prototype.__setupUI.call(this);
        if (this._refs.main)
            this._refs.main.innerHTML = fragment.innerHTML;
        this._refs.menu = this.querySelector('.ms-ContextualMenu');
        [].forEach.call(this.querySelectorAll('.ms-ContextualMenu > li'), function (entry) {
            entry.classList.add('ms-ContextualMenu-item');
            if (!entry.classList.contains('header') && !entry.classList.contains('divider'))
                entry.innerHTML = '<a class="ms-ContextualMenu-link" tabindex="1">' + entry.textContent + '</a>';
            if (entry.classList.contains('header')) {
                entry.classList.add('ms-ContextualMenu-item--header');
                entry.classList.remove('header');
            }
            if (entry.classList.contains('divider')) {
                entry.classList.add('ms-ContextualMenu-item--divider');
                entry.classList.remove('divider');
            }
        });
    };
    FabricContextualMenu.prototype.setMenuContent = function (content) {
        if (this._refs.menu)
            this._refs.menu.innerHTML = content;
    };
    FabricContextualMenu.prototype.getMenuNode = function () {
        return this.querySelector('.ms-ContextualMenu');
    };
    FabricContextualMenu.prototype.__getStaticAttributes = function () {
        var modifier = this.getAttribute('modifier');
        if (modifier && ['multiselect'].indexOf(modifier) !== -1)
            this._modifier = modifier;
        var host = this.getAttribute('host');
        if (host)
            this._host = host;
        var hostEvent = this.getAttribute('hostevent');
        if (hostEvent)
            this._hostEvent = hostEvent;
    };
    FabricContextualMenu.prototype.__setListeners = function () {
        if (!this._host) {
            console.log('No host defined');
            return;
        }
        var hostNode = (typeof this._host === 'string') ? this.closest(this._host) || document.querySelector(this._host) : this._host;
        if (hostNode == null)
            throw TypeError('No node available for host');
        _super.prototype.target = hostNode;
        hostNode.addEventListener(this._hostEvent, this.__boundHostEventHandler, true);
    };
    FabricContextualMenu.prototype.setHost = function (host, event) {
        var h = host || this._host;
        if (!h)
            throw RangeError('No host given');
        if (typeof h === 'string')
            h = document.querySelector(h);
        var e = event || this._hostEvent;
        if (!e)
            throw RangeError('No event specified');
        console.log('setHost', { h: h, e: e });
        if (this._hostEvent && _super.prototype.target) {
            _super.prototype.target.removeEventListener(this._hostEvent, this.__boundHostEventHandler);
        }
        this._host = h;
        this._hostEvent = e;
    };
    FabricContextualMenu.prototype.__hostEventHandler = function (event) {
        console.log('__hostEventHandler', event);
        _super.prototype.__openModal.call(this);
    };
    FabricContextualMenu.prototype.close = function () {
        this.__disposeModal();
    };
    return FabricContextualMenu;
}(FabricContextualHost));
window.customElements.define('fabric-contextual-menu', FabricContextualMenu);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = ".ms-ContextualMenu{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;color:#333;font-size:14px;font-weight:400;display:block;min-width:180px;max-width:220px;list-style-type:none;position:relative;background-color:#fff}\n.ms-ContextualMenu.is-hidden{display:none}\n.ms-ContextualMenu-item{position:relative}\n.ms-ContextualMenu-link{box-sizing:border-box;text-decoration:none;color:#333;border:1px solid transparent;cursor:pointer;display:block;height:36px;overflow:hidden;line-height:34px;padding:0 16px 0 25px;position:relative;text-overflow:ellipsis;white-space:nowrap}\n.ms-ContextualMenu-link:active,.ms-ContextualMenu-link:focus,.ms-ContextualMenu-link:hover{background-color:#f4f4f4;color:#212121}\n.ms-ContextualMenu-link:active .ms-ContextualMenu-subMenuIcon,.ms-ContextualMenu-link:focus .ms-ContextualMenu-subMenuIcon,.ms-ContextualMenu-link:hover .ms-ContextualMenu-subMenuIcon{color:#212121}\n.ms-ContextualMenu-link:focus{outline:transparent;border:1px solid #666}\n.ms-ContextualMenu-link.is-selected{background-color:#dadada;color:#000;font-weight:600}\n.ms-ContextualMenu-link.is-selected~.ms-ContextualMenu-subMenuIcon{color:#000}\n.ms-ContextualMenu-link.is-selected:hover{background-color:#d0d0d0}\n.ms-ContextualMenu-link.is-disabled{color:#a6a6a6;background-color:#fff;pointer-events:none}\n.ms-ContextualMenu-link.is-disabled:active,.ms-ContextualMenu-link.is-disabled:focus{border-color:#fff}\n.ms-ContextualMenu-link.is-disabled .ms-Icon{color:#a6a6a6;pointer-events:none;cursor:default}\n.ms-ContextualMenu-item.ms-ContextualMenu-item--divider{cursor:default;display:block;height:1px;background-color:#eaeaea;position:relative}\n.ms-ContextualMenu-item.ms-ContextualMenu-item--header{color:#0078d7;font-size:12px;text-transform:uppercase;height:36px;line-height:36px;padding:0 18px}\n.ms-ContextualMenu-item.ms-ContextualMenu-item--hasMenu .ms-ContextualMenu{position:absolute;top:-1px;left:178px}\n.ms-ContextualMenu-caretRight,.ms-ContextualMenu-subMenuIcon{color:#333;font-size:8px;font-weight:600;width:24px;height:36px;line-height:36px;position:absolute;text-align:center;top:0;right:0;z-index:1;pointer-events:none}\n.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-item.ms-ContextualMenu-item--header{padding:0 16px 0 26px}\n.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected{background-color:#fff;font-weight:600;color:#333}\n.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:after{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-family:FabricMDL2Icons;font-style:normal;font-weight:400;speak:none;color:#333;content:\"E73E\";font-size:10px;font-weight:800;height:36px;line-height:36px;position:absolute;left:7px}\n.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:focus,.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:hover{color:#212121;background-color:#f4f4f4}\n.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:focus:after,.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:hover:after{color:#212121}\n.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:active{color:#000;background-color:#d0d0d0}\n.ms-ContextualMenu.ms-ContextualMenu--multiselect .ms-ContextualMenu-link.is-selected:active:after{color:#000}\n.ms-ContextualMenu.ms-ContextualMenu--hasChecks .ms-ContextualMenu-link,.ms-ContextualMenu.ms-ContextualMenu--hasIcons .ms-ContextualMenu-link{padding-left:40px}\n.ms-ContextualMenu.ms-ContextualMenu--hasChecks .ms-Icon,.ms-ContextualMenu.ms-ContextualMenu--hasIcons .ms-Icon{position:absolute;top:50%;transform:translateY(-50%);width:40px;text-align:center}\n.ms-ContextualMenu.ms-ContextualMenu--hasIcons{width:220px}";
    d.head.appendChild(style);
})(window, document);
