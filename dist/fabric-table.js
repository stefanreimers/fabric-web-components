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
var FabricTable = (function (_super) {
    __extends(FabricTable, _super);
    function FabricTable() {
        var _this = _super.call(this) || this;
        _this._items = [];
        _this._columns = [];
        _this._itemheight = 30;
        _this._templateHandler = null;
        _this._ticking = false;
        _this._lastRepaintY = null;
        _this._visibleItems = 0;
        _this._modifier = null;
        _this._refs = {};
        _this._selected = [];
        _this._rowId = null;
        return _this;
    }
    Object.defineProperty(FabricTable.prototype, "modifier", {
        get: function () { return this._modifier; },
        set: function (value) { throw new RangeError('The modifier property is static.'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTable.prototype, "items", {
        get: function () { return this._items; },
        set: function (value) { value = [].concat(value); this._items = value; this.__onSizePropsChange(); this.__setProperties('items'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTable.prototype, "columns", {
        get: function () { return this._columns || []; },
        set: function (value) {
            if (value == null)
                return;
            if (typeof value === 'string')
                value = JSON.parse(value);
            this._columns = value;
            this.__setProperties('columns');
            this.__onSizePropsChange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTable.prototype, "itemheight", {
        get: function () { return this._itemheight || 30; },
        set: function (value) {
            if (value == null)
                return;
            var ih = (typeof value === 'string') ? parseInt(value, 10) : value;
            if (isNaN(ih)) {
                throw new TypeError('Value for item height has to be numeric');
            }
            this._itemheight = ih;
            if (this._refs && this._refs.container)
                this._refs.container.style.setProperty('--item-height', this._itemheight + 'px');
            this.__onSizePropsChange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTable.prototype, "rowid", {
        get: function () { return this._rowId; },
        set: function (value) { this._rowId = value; this.__setProperties('rowid'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricTable.prototype, "selected", {
        get: function () { return this._selected || []; },
        set: function (value) { value = [].concat(value); if (value.sort().join(',') === this._selected.sort().join(','))
            return; this._selected = value; this.__setProperties('selected'); },
        enumerable: false,
        configurable: true
    });
    FabricTable.prototype.connectedCallback = function () {
        this.__getStaticAttributes();
        this.__setupUI();
        this._items = [];
        if (this._columns == null)
            this._columns = [];
        this._ticking = false;
        this._lastRepaintY = null;
        this._visibleItems = 0;
        this.style.display = 'inline-block';
        this._visibleItems = Math.ceil(this.clientHeight / this._itemheight) * ((this._columns) ? this._columns.length : 1);
        this._onScroll = this.__scrollHandler.bind(this);
        if (this._refs.container)
            this._refs.container.addEventListener('scroll', this._onScroll);
        if (this._modifier === 'selectable') {
            this.__onToggleSelection = this.__toggleRowHandler.bind(this);
            if (this._refs.table)
                this._refs.table.addEventListener('click', this.__onToggleSelection);
        }
        this.__setProperties();
        this.__onSizePropsChange();
        this.__render();
    };
    FabricTable.prototype.__setupUI = function () {
        var modifier = (this._modifier) ? 'ms-Table--' + this._modifier : '';
        var container = document.createElement('div');
        container.className = 'container';
        container.style.setProperty('--item-height', this._itemheight + 'px');
        container.innerHTML = "<div class=\"displayHeader\"></div><div class=\"scroller\" data-id=\"scroller\">\n\t\t\t<table class=\"ms-Table " + modifier + "\"><thead><tr></tr></thead><tbody></tbody></table>\n    </div>";
        this.appendChild(container);
        this._refs = {
            container: this.querySelector('.container'),
            scroller: this.querySelector('.scroller'),
            table: this.querySelector('.ms-Table'),
            head: this.querySelector('.ms-Table > thead'),
            displayHeader: this.querySelector('.displayHeader'),
            body: this.querySelector('.ms-Table > tbody')
        };
    };
    FabricTable.prototype.__setProperties = function (property) {
        var _this = this;
        if (!this._refs.container)
            return;
        if (property == null || property === 'columns') {
            if (this._refs.table) {
                var cols = this._refs.table.querySelectorAll('col');
                if (cols) {
                    [].forEach.call(cols, function (col) { _this._refs.table.removeChild(col); });
                }
                var headContent = ['<tr>'], displayHeaderContent = [], columnDimensions_1 = [], rowCheck = 0;
                if (this._modifier === 'selectable') {
                    headContent.push('<th class="ms-Table-rowCheck"></th>');
                    displayHeaderContent.push('<span class="ms-Table-rowCheck"></span>');
                    var col = document.createElement('col');
                    col.width = '20px';
                    this._refs.table.appendChild(col);
                    columnDimensions_1.push('20px');
                }
                else {
                }
                this._columns.forEach(function (column) {
                    var col = document.createElement('col');
                    col.width = column.width || '';
                    _this._refs.table.appendChild(col);
                    columnDimensions_1.push((_this._modifier === 'selectable') ? 'calc(' + (column.width || '1fr') + ' - ' + Math.ceil(20 / _this._columns.length) + 'px)' : (column.width || '1fr'));
                });
                this._refs.displayHeader.style.gridTemplateColumns = columnDimensions_1.join(" ");
                var a = headContent.concat(this._columns.map(function (col) { return '<th data-id="' + (col.id || '') + '">&nbsp;</th>'; })).join('') + '</tr>';
                var b = displayHeaderContent.concat(this._columns.map(function (col) { return '<span class="text">' + (col.label || '') + '</span>'; })).join('');
                this._refs.head.innerHTML = a;
                this._refs.displayHeader.innerHTML = b;
            }
        }
        if (property === 'items') {
            this.__render();
        }
        if (property === 'rowid') {
            this.__render();
        }
    };
    FabricTable.prototype.__onSizePropsChange = function () {
        var height = (this._itemheight || 0) * (this._items || []).length;
        if (!this._refs.container)
            return;
        var scroller = this._refs.container.querySelector('[data-id="scroller"]');
        if (scroller)
            scroller.style.height = parseInt(height, 10) + 'px';
        this._visibleItems = Math.ceil(this.clientHeight / this._itemheight);
    };
    FabricTable.prototype.__toggleRowHandler = function (e) {
        var target;
        if (e.target) {
            target = e.target;
        }
        else {
            return;
        }
        if (target && target.classList.contains('ms-Table-rowCheck')) {
            var row = target.closest('TR');
            if (!row)
                return;
            row.classList.toggle('is-selected');
            var rowId = row.dataset.id;
            if (rowId) {
                if (row.classList.contains('is-selected') && this.selected.indexOf(rowId) === -1) {
                    this._selected.push(rowId);
                }
                if (!row.classList.contains('is-selected') && this.selected.indexOf(rowId) !== -1) {
                    this._selected.splice(this.selected.indexOf(rowId), 1);
                }
            }
        }
    };
    FabricTable.prototype.__scrollHandler = function (e) {
        var _this = this;
        if (!e.target)
            return;
        var scrollTop = e.target.scrollTop;
        if (!this._ticking) {
            window.requestAnimationFrame(function () {
                if (_this._lastRepaintY == null || Math.abs(scrollTop - _this._lastRepaintY) > (Math.ceil(_this._refs.body.clientHeight * 0.3))) {
                    _this.__renderChunk(scrollTop);
                    _this._lastRepaintY = scrollTop;
                }
                e.preventDefault && e.preventDefault();
                _this._ticking = false;
            });
            this._ticking = true;
        }
    };
    FabricTable.prototype.__getStaticAttributes = function () {
        var modifier = this.getAttribute('modifier');
        if (modifier && ['fixed', 'selectable'].indexOf(modifier) !== -1)
            this._modifier = modifier;
    };
    Object.defineProperty(FabricTable, "observedAttributes", {
        get: function () {
            return ['itemheight', 'columns', 'rowid', 'selected'];
        },
        enumerable: false,
        configurable: true
    });
    FabricTable.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        var val = (attr === 'columns') ? JSON.parse(newValue) : newValue;
        if (attr === 'selected')
            val = val.split(',');
        if (oldValue === val || val === this[attr])
            return;
        this[attr] = val;
    };
    FabricTable.prototype.__render = function () {
        if (this._refs.container) {
            this.__renderChunk(this._refs.container.scrollTop || 0);
        }
    };
    FabricTable.prototype.__getDomTemplate = function (item) {
        var tmpl = this.querySelector('template');
        if (!tmpl)
            return;
        var clone = tmpl.content.cloneNode(true);
        clone.querySelectorAll("[data-template-content]").forEach(function (entry) {
            var propertyName = entry.getAttribute("data-template-content");
            if (item.hasOwnProperty(propertyName))
                entry.textContent = item[propertyName];
        });
        clone.querySelectorAll("[data-template-class]").forEach(function (entry) {
            var propertyName = entry.getAttribute("data-template-class");
            if (item.hasOwnProperty(propertyName))
                entry.classList.add(item[propertyName]);
        });
        clone.querySelectorAll("[data-template-attribute]").forEach(function (entry) {
            var keyValues = (entry.getAttribute("data-template-attribute") || '').split(';');
            keyValues.forEach(function (keyValuePair) {
                var keyValue = keyValuePair.split(":");
                if (keyValue.length === 2 && item.hasOwnProperty(keyValue[1]))
                    entry.setAttribute(keyValue[0], item[keyValue[1]]);
            });
        });
        var div = document.createElement('div');
        div.appendChild(clone.cloneNode(true));
        return div.innerHTML;
    };
    FabricTable.prototype.__template = function (item) {
        if (this._templateHandler != null) {
            return this._templateHandler(item);
        }
        if (this.querySelector('template')) {
            return this.__getDomTemplate(item);
        }
        var tr = 'tr';
        if (this.rowid && item.hasOwnProperty(this.rowid)) {
            tr += ' data-id="' + item[this.rowid.toString()] + '"';
            if (this._modifier === 'selectable' && this.selected.indexOf(item[this.rowid].toString()) !== -1)
                tr += ' class="is-selected"';
        }
        var str = ['<' + tr + '>'];
        if (this._modifier === 'selectable') {
            str.push('<td class="ms-Table-rowCheck"></td>');
        }
        if (this._columns) {
            this._columns.forEach(function (col) { str.push('<td>' + ((col.hasOwnProperty('id') && item.hasOwnProperty(col.id)) ? item[col.id].toString() : '') + '</td>'); });
        }
        str.push('</tr>');
        return str.join('');
    };
    FabricTable.prototype.setTemplateHandler = function (value) {
        if (value === null || typeof value === 'function') {
            this._templateHandler = value;
        }
    };
    FabricTable.prototype.__renderChunk = function (scrollTop) {
        var _this = this;
        var firstVisibleRow = Math.max((Math.ceil(scrollTop / this._itemheight) - 1), 0);
        var firstRenderedRow = Math.max(firstVisibleRow - this._visibleItems, 0);
        var firstRenderedItem = Math.max(firstRenderedRow - 1, 0);
        if (this.__template && this._refs.container) {
            var chunkData = Object.assign({}, { items: this._items.slice(firstRenderedItem, firstRenderedItem + (this._visibleItems * 3)) });
            var chunkMarkup = '';
            chunkData.items.forEach(function (item) {
                var markup = _this.__template(item);
                if (markup)
                    chunkMarkup = chunkMarkup + markup;
            });
            if (this._refs.body)
                this._refs.body.innerHTML = chunkMarkup;
            if (this._refs.table)
                this._refs.table.style.top = (firstRenderedItem * this._itemheight) + 'px';
        }
    };
    return FabricTable;
}(HTMLElement));
window.customElements.define('fabric-table', FabricTable);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "\n  fabric-table .container {position:relative; overflow: auto; transform:scale(1);height:100%; --item-height: 30px;\n    scrollbar-width: thin;-webkit-scrollbar-width: thin;-ms-overflow-style: -ms-autohiding-scrollbar;}\n  fabric-table .container::-webkit-scrollbar{width: 5px;height: 8px;background-color: #f0f0f0;}\n  fabric-table .container::-webkit-scrollbar-thumb {background: #cdcdcd;}\n  fabric-table .ms-Table { width:100%; position: absolute; top:0;}\n  fabric-table .ms-Table thead{ visibility: hidden}\n  fabric-table .displayHeader {position:sticky;left:0;right:0;top: 0;height: var(--item-height,30px);line-height: var(--item-height,30px);\n    display: grid;grid-template-rows: 1fr;grid-column-gap: 0px;grid-row-gap: 0px;\n    font-size: 11px;color: #666;background: white;z-index: 10;border-bottom: 1px solid #eaeaea;font-weight: 400;}\n  .ms-Table, fabric-table .displayHeader {font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased}\n  fabric-table .displayHeader span { padding: 0 10px;box-sizing:border-box; display: block;white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n  .ms-Table{display:table;width:100%;border-collapse:collapse}\n  .ms-Table--fixed{table-layout:fixed}\n  .ms-Table-row,.ms-Table tr{display:table-row;line-height:var(--item-height,30px);font-weight:300;font-size:12px;color:#333}\n  .ms-Table-row.is-selected,.ms-Table tr.is-selected{background-color:#b3d6f2}\n  .ms-Table-row.is-selected .ms-Table-rowCheck,.ms-Table tr.is-selected .ms-Table-rowCheck{background-color:#0078d7}\n  .ms-Table-row.is-selected .ms-Table-rowCheck:before,.ms-Table tr.is-selected .ms-Table-rowCheck:before{display:none}\n  .ms-Table-row.is-selected .ms-Table-rowCheck:after,.ms-Table tr.is-selected .ms-Table-rowCheck:after{content:\"\u2611\";color:#fff; font-size:14px}\n  .ms-Table-cell,.ms-Table td,.ms-Table th{display:table-cell;padding:0 10px;box-sizing:border-box}\n  .ms-Table-head,.ms-Table thead th{font-weight:300;font-size:11px;color:#666}\n  .ms-Table-head .ms-Table-cell,.ms-Table-head .ms-Table-rowCheck,.ms-Table-head td,.ms-Table-head th,.ms-Table thead .ms-Table-cell,.ms-Table thead .ms-Table-rowCheck,.ms-Table thead td,.ms-Table thead th{font-weight:400;text-align:left;border-bottom:1px solid #eaeaea}\n  .ms-Table-rowCheck{display:table-cell;width:20px;position:relative;padding:0}\n  .ms-Table-rowCheck:after{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-style:normal;font-weight:400;speak:none;content:\"\u2610\";color:#a6a6a6;font-size:14px;position:absolute;left:4px;top:1px}\n  .ms-Table--selectable .ms-Table-row:hover,.ms-Table--selectable tr:hover{background-color:#f4f4f4;cursor:pointer;outline:1px solid transparent}\n  @media screen and (-ms-high-contrast:active){.ms-Table-row.is-selected .ms-Table-rowCheck{background:none}\n  .ms-Table-row.is-selected .ms-Table-rowCheck:before{display:block}\n  }";
    d.head.appendChild(style);
})(window, document);
