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
var FabricListItem = (function (_super) {
    __extends(FabricListItem, _super);
    function FabricListItem() {
        var _this = _super.call(this) || this;
        _this._selectable = false;
        _this._modifier = null;
        _this._selected = false;
        _this._state = null;
        _this._image = null;
        _this._primarytext = null;
        _this._secondarytext = null;
        _this._tertiarytext = null;
        _this._metatext = null;
        _this._listicon = null;
        _this._actions = ['Mail', 'Delete', 'Flag', 'Pinned'];
        _this._refs = {};
        return _this;
    }
    Object.defineProperty(FabricListItem.prototype, "selectable", {
        get: function () { return this._selectable; },
        set: function (value) { throw new RangeError('The selectable property is static'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "modifier", {
        get: function () { return this._modifier; },
        set: function (value) { throw new RangeError('The modifier property is static.'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "state", {
        get: function () { return this._state || ''; },
        set: function (value) { if (value === this._state || (['unread', 'unseen'].indexOf(value) === -1) && value != null)
            return; this._state = value; this.__setProperties('state'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "selected", {
        get: function () { return this._selected; },
        set: function (value) { if (value === this._selected)
            return; this._toggleHandler(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "image", {
        get: function () { return this._image; },
        set: function (value) { if (value === this._image)
            return; this._image = value; this.__setProperties('image'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "primarytext", {
        get: function () { return this._primarytext; },
        set: function (value) { if (value === this._primarytext)
            return; this._primarytext = value; this.__setProperties('primaryText'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "secondarytext", {
        get: function () { return this._secondarytext; },
        set: function (value) { if (value === this._secondarytext)
            return; this._secondarytext = value; this.__setProperties('secondaryText'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "tertiarytext", {
        get: function () { return this._tertiarytext; },
        set: function (value) { if (value === this._tertiarytext)
            return; this._tertiarytext = value; this.__setProperties('tertiaryText'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "metatext", {
        get: function () { return this._metatext; },
        set: function (value) { if (value === this._metatext)
            return; this._metatext = value; this.__setProperties('metaText'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "listicon", {
        get: function () { return this._listicon; },
        set: function (value) { if (value === this._listicon)
            return; this._listicon = value; this.__setProperties('listicon'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricListItem.prototype, "actions", {
        get: function () { return this._actions; },
        set: function (value) { if (value == null || Array.isArray(value)) {
            this._actions = value;
            this.__setProperties('actions');
        } },
        enumerable: false,
        configurable: true
    });
    FabricListItem.prototype.connectedCallback = function () {
        this.__getStaticAttributes();
        this.__setupUI();
        this.__setProperties();
        this.__setListeners();
    };
    FabricListItem.prototype.__setupUI = function () {
        var modifier = (this._modifier) ? 'ms-ListItem--' + this._modifier : '';
        var selectable = (this._selectable === true) ? 'is-selectable' : '';
        var markup = "<li class=\"ms-ListItem " + modifier + " " + selectable + "\" tabindex=\"0\">\n\t\t  <div class=\"ms-ListItem-image\"></div>\n\t\t  <span class=\"ms-ListItem-primaryText\"></span>\n\t\t  <span class=\"ms-ListItem-secondaryText\"></span>\n\t\t  <span class=\"ms-ListItem-tertiaryText\"></span>\n\t\t  <span class=\"ms-ListItem-metaText\"></span>\n\t\t  <div class=\"ms-ListItem-itemIcon\"></div>\n\t\t  <div class=\"ms-ListItem-selectionTarget\"></div>\n\t\t  <div class=\"ms-ListItem-actions\"></div>\n\t\t</li>";
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-ListItem'),
            image: this.querySelector('.ms-ListItem-image'),
            primaryText: this.querySelector('.ms-ListItem-primaryText'),
            secondaryText: this.querySelector('.ms-ListItem-secondaryText'),
            tertiaryText: this.querySelector('.ms-ListItem-tertiaryText'),
            metaText: this.querySelector('.ms-ListItem-metaText'),
            itemIcon: this.querySelector('.ms-ListItem-itemIcon'),
            actions: this.querySelector('.ms-ListItem-actions'),
            selectionTarget: this.querySelector('.ms-ListItem-selectionTarget')
        };
    };
    FabricListItem.prototype.__setProperties = function (property) {
        var _this = this;
        if (!this._refs.container)
            return;
        var texts = ['primaryText', 'secondaryText', 'tertiaryText', 'metaText'];
        if (property == null || property === 'state') {
            if (!this._refs.container)
                return;
            if (this.state === '') {
                this._refs.container.classList.remove('is-unseen');
                this._refs.container.classList.remove('is-unread');
            }
            else {
                this._refs.container.classList[(this.state !== 'unread') ? 'add' : 'remove']('is-unseen');
                this._refs.container.classList[(this.state !== 'unseen') ? 'add' : 'remove']('is-unread');
            }
        }
        if (property == null || property === 'selected') {
            if (this._selected === true) {
                this._refs.container.classList.add('is-selected');
            }
            else {
                this._refs.container.classList.remove('is-selected');
            }
        }
        if (property == null || property === 'image') { }
        if (property && texts.indexOf(property) !== -1) {
            var node = this._refs[property];
            if (node)
                node.textContent = this[property.toLowerCase()] || '';
        }
        else if (property == null) {
            texts.forEach(function (text) {
                _this._refs[text].textContent = _this[text.toLowerCase()] || '';
            });
        }
        if (property == null || property === 'listicon') {
            this._refs.itemIcon.className = 'ms-ListItem-itemIcon ' + ((!this._listicon) ? 'display-none' : 'ms-ListItem-itemIcon--' + this._listicon);
        }
        if (property == null || property === 'actions') {
            if (this._actions != null && Array.isArray(this._actions)) {
                if (this._refs.actions)
                    this._refs.actions.innerHTML = this._actions.map(function (action) { return '<div class="ms-ListItem-action" data-action="' + action.toString() + '"><i class="ms-Icon ms-Icon--' + action.toString() + '"></i></div>'; }).join('');
            }
        }
    };
    FabricListItem.prototype.__setListeners = function () {
        if (this._refs.selectionTarget)
            this._refs.selectionTarget.addEventListener("click", this._toggleHandler.bind(this), false);
        if (this._refs.actions)
            this._refs.actions.addEventListener('click', this._actionClickHandler.bind(this), false);
    };
    FabricListItem.prototype._toggleHandler = function () {
        this._selected = !this._selected;
        if (this._refs.container)
            this._refs.container.classList.toggle("is-selected");
    };
    FabricListItem.prototype._actionClickHandler = function (e) {
        if (e.target && e.target.classList.contains('ms-ListItem-action')) {
            var action = (e.target && e.target.dataset) ? e.target.dataset.action : null;
            if (action == null)
                return;
            this.dispatchEvent(new CustomEvent('listitemActionClick', {
                bubbles: true,
                cancelable: true,
                detail: {
                    action: action
                }
            }));
        }
    };
    FabricListItem.prototype.__getStaticAttributes = function () {
        var modifier = this.getAttribute('modifier');
        if (modifier && ['image', 'document'].indexOf(modifier) !== -1)
            this._modifier = modifier;
        var isSelectable = this.hasAttribute('selectable');
        if (isSelectable)
            this._selectable = true;
    };
    Object.defineProperty(FabricListItem, "observedAttributes", {
        get: function () {
            return ['state', 'selected', 'image', 'primarytext', 'secondarytext', 'tertiarytext', 'metatext', 'listicon'];
        },
        enumerable: false,
        configurable: true
    });
    FabricListItem.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (oldValue === newValue || newValue === this[attr])
            return;
        this[attr] = newValue;
    };
    return FabricListItem;
}(HTMLElement));
window.customElements.define('fabric-list-item', FabricListItem);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-list-item .ms-ListItem > span:empty,\nfabric-list-item .ms-ListItem > .ms-ListItem-image:empty,\nfabric-list-item .display-none {display:none}\n.ms-ListItem{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;box-shadow:none;color:#333;font-size:14px;font-weight:400}\n.ms-ListItem{padding:0;*zoom:1;padding:9px 28px 3px;position:relative;display:block}\n.ms-ListItem:after{clear:both}\n.ms-ListItem-primaryText,.ms-ListItem-secondaryText,.ms-ListItem-tertiaryText{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}\n.ms-ListItem-primaryText{color:#212121;font-weight:300;font-size:21px;padding-right:80px;position:relative;top:-4px}\n.ms-ListItem-secondaryText{color:#333;font-weight:400;font-size:14px;line-height:25px;position:relative;top:-7px;padding-right:30px}\n.ms-ListItem-tertiaryText{color:#767676;font-weight:300;font-size:14px;position:relative;top:-9px;margin-bottom:-4px;padding-right:30px}\n.ms-ListItem-metaText{color:#333;font-weight:300;font-size:11px;position:absolute;right:30px;top:39px}\n.ms-ListItem-image{float:left;height:70px;margin-left:-8px;margin-right:10px;width:70px;background-color:#333}\n.ms-ListItem-selectionTarget{display:none; height:14px;left:6px;position:absolute;top:13px;width:14px;border:1px solid #333}\n.ms-ListItem-actions{max-width:80px;position:absolute;right:30px;text-align:right;top:10px}\n.ms-ListItem-action{color:#a6a6a6;display:inline-block;font-size:15px;position:relative;text-align:center;top:3px;cursor:pointer;height:16px;width:16px}\n.ms-ListItem-action .ms-Icon{vertical-align:top}\n.ms-ListItem-action:hover{color:#666;outline:1px solid transparent}\n.ms-ListItem.is-unread{border-left:3px solid #0078d7;padding-left:27px}\n.ms-ListItem.is-unread .ms-ListItem-metaText,.ms-ListItem.is-unread .ms-ListItem-secondaryText{color:#0078d7;font-weight:600}\n.ms-ListItem.is-unseen:after{border-right:10px solid transparent;border-top:10px solid #0078d7;left:0;position:absolute;top:0;display:table;content:\"\";line-height:0}\n.ms-ListItem.is-selectable .ms-ListItem-image{margin-left:0}\n.ms-ListItem.is-selectable:hover{background-color:#eaeaea;cursor:pointer;outline:1px solid transparent}\n.ms-ListItem.is-selectable:hover:before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-style:normal;font-weight:400;speak:none;position:absolute;top:14px;left:7px;height:15px;width:15px;border:1px solid #767676}\n.ms-ListItem.is-selectable:hover .ms-ListItem-selectionTarget, .ms-ListItem.is-selected .ms-ListItem-selectionTarget {display: initial}\n.ms-ListItem.is-selected:before{border:1px solid transparent}\n.ms-ListItem.is-selected:before,.ms-ListItem.is-selected:hover:before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-style:normal;font-weight:400;speak:none;font-size:17px;color:#767676;position:absolute;top:23px;left:7px;border:0}\n.ms-ListItem.is-selected:hover{background-color:#b3d6f2;outline:1px solid transparent}\n.ms-ListItem.ms-ListItem--document{padding:0}\n.ms-ListItem.ms-ListItem--document .ms-ListItem-itemIcon{width:70px;height:70px;float:left;text-align:center}\n.ms-ListItem.ms-ListItem--document .ms-ListItem-itemIcon .ms-Icon{font-size:38px;line-height:70px;color:#666}\n.ms-ListItem.ms-ListItem--document .ms-ListItem-primaryText{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;padding-top:15px;padding-right:0;position:static}\n.ms-ListItem.ms-ListItem--document .ms-ListItem-secondaryText{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#666;font-weight:400;font-size:11px;padding-top:6px}\n.ms-ListItem.is-selected .ms-ListItem-selectionTarget {transition-property:background,border,border-color;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.23,1);border-color: #0078d7;background-color:#0078d7}\n.ms-ListItem.is-selected .ms-ListItem-selectionTarget:after {content:\"\u2713\";position:absolute;left:3px;font-weight:900;font-size:10px;color:white}";
    d.head.appendChild(style);
})(window, document);
