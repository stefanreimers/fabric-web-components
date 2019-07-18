class FabricTable extends HTMLElement {

  private _modifier: string | null;
  private _refs: { [index: string]: HTMLElement | null };
  private _selected: any[];
  private _rowId: any;
  private _items: any[] = [];
  private _columns: any[] = [];
  private _itemheight: number = 20;

  private _ticking = false;
  private _lastRepaintY: number | null = null;
  private _visibleItems = 0;

  private _onScroll: any;
  private __onToggleSelection: any;

  constructor() {
    super();
    this._modifier = null;
    this._refs = {};
    this._selected = [];
    this._rowId = null;
  }

  get modifier() { return this._modifier }
  get items() { return this._items; }
  get columns() { return this._columns || []; }
  get itemheight() { return this._itemheight || 20; }
  get rowid() { return this._rowId; }
  get selected() { return this._selected || [] }

  set modifier(value) { throw new RangeError('The modifier property is static.') }
  //@ts-ignore
  set items(value) { value = [].concat(value); this._items = value; this.__onSizePropsChange(); this.__setProperties('items') }
  //@ts-ignore
  set selected(value) { value = [].concat(value); if (value.sort().join(',') === this._selected.sort().join(',')) return; this._selected = value; this.__setProperties('selected') }
  set rowid(value) { this._rowId = value; this.__setProperties('rowid') }
  set columns(value) {

    if (value == null) return;

    // Check value to be numeric
    if (typeof value === 'string') value = JSON.parse(value);

    this._columns = value;

    this.__setProperties('columns');

    this.__onSizePropsChange();

  }

  set itemheight(value: number) {

    if (value == null) return;

    // Check value to be numeric
    let ih = (typeof value === 'string') ? parseInt(value, 10) : value;
    if (isNaN(ih)) {
      throw new TypeError('Value for item height has to be numeric');
    }

    this._itemheight = ih;

    this.__onSizePropsChange();
  }

  connectedCallback() {

    this.__getStaticAttributes();
    this.__setupUI();

    this._items = [];
    if (this._columns == null) this._columns = [];
    this._ticking = false;
    this._lastRepaintY = null;
    this._visibleItems = 0;
    this.style.display = 'inline-block';

    // Calculate number of visible items
    // @TODO: ResizeObserver
    this._visibleItems = Math.ceil(this.clientHeight / this._itemheight) * ((this._columns) ? this._columns.length : 1);

    // Add scroll handler
    this._onScroll = this.__scrollHandler.bind(this);
    if (this._refs.container) this._refs.container.addEventListener('scroll', this._onScroll);

    // Add click handler
    if (this._modifier === 'selectable') {
      this.__onToggleSelection = this.__toggleRowHandler.bind(this);
      if (this._refs.table) this._refs.table.addEventListener('click', this.__onToggleSelection);
    }

    this.__setProperties();
    this.__onSizePropsChange();
    this.__render();

  }

  private __setupUI() {

    // Define static properties
    let modifier = (this._modifier) ? 'ms-Table--' + this._modifier : '';

    let markup = `<div class="container"><div class="displayHeader"></div><div class="scroller" data-id="scroller">
			<table class="ms-Table ${modifier}"><thead><tr></tr></thead><tbody></tbody></table>
		</div></div>`;

    this.innerHTML = markup;

    this._refs = {
      container: this.querySelector('.container'),
      scroller: this.querySelector('.scroller'),
      table: this.querySelector('.ms-Table'),
      head: this.querySelector('.ms-Table > thead'),
      displayHeader: this.querySelector('.displayHeader'),
      body: this.querySelector('.ms-Table > tbody')
    }
  }

  private __setProperties(property?: string) {

    //console.log('setProperties', property, this._refs);

    if (!this._refs.container) return;

    if (property == null || property === 'columns') {

      if (this._refs.table) {

        // Remove previous <col/> tags from table
        let cols = this._refs.table.querySelectorAll('col');
        if (cols) {
          //@ts-ignore
          [].forEach.call(cols, (col: HTMLTableColElement) => { this._refs.table.removeChild(col) });
        }

        let headContent = ['<tr>'],
          displayHeaderContent = [],
          rowCheck = 0;
        if (this._modifier === 'selectable') {
          headContent.push('<th class="ms-Table-rowCheck"></th>');
          displayHeaderContent.push('<span style="float:left;position:absolute;left:0" class="ms-Table-rowCheck"></span>');
          let col = document.createElement('col');
          col.width = '20px';
          this._refs.table.appendChild(col);
          //@ts-ignore
          this._refs.displayHeader.style.paddingLeft = '20px'
        } else {
          //@ts-ignore
          this._refs.displayHeader.style.paddingLeft = '0px';
        }

        this._columns.forEach(column => {
          let col = document.createElement('col');
          col.width = column.width || ''
          //@ts-ignore
          this._refs.table.appendChild(col);
        });

        let a = headContent.concat(this._columns.map(col => { return '<th data-id="' + (col.id || '') + '">&nbsp;</th>' })).join('') + '</tr>';
        let b = displayHeaderContent.concat(this._columns.map(col => { return '<span style="float:left;width: ' + (col.width || '0') + ';" class="text">' + (col.label || '') + '</span>' })).join('');

        //@ts-ignore
        this._refs.head.innerHTML = a;
        //@ts-ignore
        this._refs.displayHeader.innerHTML = b;

      }

    }

    if (property === 'items') { this.__render(); }
    if (property === 'rowid') { this.__render(); }

  }

  private __onSizePropsChange() {

    const height = (this._itemheight || 0) * (this._items || []).length;

    if (!this._refs.container) return;
    const scroller = this._refs.container.querySelector('[data-id="scroller"]');
    //@ts-ignore
    if (scroller) scroller.style.height = parseInt(height, 10) + 'px';

    this._visibleItems = Math.ceil(this.clientHeight / this._itemheight);

  }

  private __toggleRowHandler(e: MouseEvent) {

    let target: HTMLElement;
    if (e.target) {
      target = <HTMLElement>e.target
    } else {
      return;
    }

    if (target && target.classList.contains('ms-Table-rowCheck')) {

      let row = <HTMLElement>target.closest('TR');

      if (!row) return;

      // Sync state to DOM
      row.classList.toggle('is-selected');

      // Sync state to selected property
      let rowId = row.dataset.id;
      if (rowId) {
        if (row.classList.contains('is-selected') && this.selected.indexOf(rowId) === -1) { this._selected.push(rowId) }
        if (!row.classList.contains('is-selected') && this.selected.indexOf(rowId) !== -1) { this._selected.splice(this.selected.indexOf(rowId), 1) }
      }

    }
  }

  private __scrollHandler(e: Event) {

    if (!e.target) return;

    var scrollTop = (<HTMLElement>e.target).scrollTop;
    if (!this._ticking) {

      window.requestAnimationFrame(() => {

        // Determine whether a rerender is necessary based on the scrollTop and last render position
        //@ts-ignore
        if (this._lastRepaintY == null || Math.abs(scrollTop - this._lastRepaintY) > (Math.ceil(this._refs.body.clientHeight * 0.3))) {

          this.__renderChunk(scrollTop);

          this._lastRepaintY = scrollTop;
        }

        e.preventDefault && e.preventDefault();
        this._ticking = false;

      });

      this._ticking = true;
    }
  }

  private __getStaticAttributes() {
    let modifier = this.getAttribute('modifier');
    if (modifier && ['fixed', 'selectable'].indexOf(modifier) !== -1) this._modifier = modifier;
  }

  static get observedAttributes() {
    return ['itemheight', 'columns', 'rowid', 'selected'];
  }

  attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null) {

    //@ts-ignore
    let val = (attr === 'columns') ? JSON.parse(newValue) : newValue;
    if (attr === 'selected') val = val.split(',');
    //@ts-ignore
    if (oldValue === val || val === this[attr]) return;
    //@ts-ignore
    this[attr] = val;
  }

  __render() {

    if (this._refs.container) {
      this.__renderChunk(this._refs.container.scrollTop || 0);
    }
  }

  __template(item: any) {

    let tr = 'tr';
    if (this.rowid && item.hasOwnProperty(this.rowid)) {
      tr += ' data-id="' + item[this.rowid.toString()] + '"';
      if (this._modifier === 'selectable' && this.selected.indexOf(item[this.rowid].toString()) !== -1) tr += ' class="is-selected"';
    }

    var str = ['<' + tr + '>'];

    if (this._modifier === 'selectable') {
      str.push('<td class="ms-Table-rowCheck"></td>');
    }

    if (this._columns) {
      this._columns.forEach(col => { str.push('<td>' + ((col.hasOwnProperty('id') && item.hasOwnProperty(col.id)) ? item[col.id].toString() : '') + '</td>'); });
    }
    str.push('</tr>');
    return str.join('');
  }

  __renderChunk(scrollTop: number) {


    // calculate first visible item from scrollTop
    let firstVisibleRow = Math.max((Math.ceil(scrollTop / this._itemheight) - 1), 0);
    let firstRenderedRow = Math.max(firstVisibleRow - this._visibleItems, 0);
    let firstRenderedItem = Math.max(firstRenderedRow - 1, 0);

    //console.log('__renderChunk', firstVisibleRow, firstRenderedRow, firstRenderedItem, firstRenderedItem + (this._visibleItems * 3),this._items.length);

    if (this.__template && this._refs.container) {

      const chunkData = Object.assign({}, { items: this._items.slice(firstRenderedItem, firstRenderedItem + (this._visibleItems * 3)) });

      // Create temporary DOM structure
      var chunkMarkup = '';
      chunkData.items.forEach((item) => {
        let markup = this.__template(item);
        if (markup) chunkMarkup = chunkMarkup + markup;
      });
      if (this._refs.body) this._refs.body.innerHTML = chunkMarkup;

      //Repositioning of table
      if (this._refs.table) this._refs.table.style.top = (firstRenderedItem * this._itemheight) + 'px';

    }

  }

}
window.customElements.define('fabric-table', FabricTable);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `
fabric-table .container {position:relative; overflow: auto; transform:scale(1);height:100%}
fabric-table .ms-Table { width:100%; position: absolute; top:0;}
fabric-table .ms-Table thead{ visibility: hidden}
fabric-table .displayHeader {position:sticky;left:0;right:0;top: 0;height: 30px;line-height: 30px;padding: 0 10px;font-size: 11px;color: #666;background: white;z-index: 10;border-bottom: 1px solid #eaeaea;font-weight: 400;}
.ms-Table, fabric-table .displayHeader {font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased}
.ms-Table{display:table;width:100%;border-collapse:collapse}
.ms-Table--fixed{table-layout:fixed}
.ms-Table-row,.ms-Table tr{display:table-row;line-height:30px;font-weight:300;font-size:12px;color:#333}
.ms-Table-row.is-selected,.ms-Table tr.is-selected{background-color:#b3d6f2}
.ms-Table-row.is-selected .ms-Table-rowCheck,.ms-Table tr.is-selected .ms-Table-rowCheck{background-color:#0078d7}
.ms-Table-row.is-selected .ms-Table-rowCheck:before,.ms-Table tr.is-selected .ms-Table-rowCheck:before{display:none}
.ms-Table-row.is-selected .ms-Table-rowCheck:after,.ms-Table tr.is-selected .ms-Table-rowCheck:after{content:"☑";color:#fff; font-size:14px}
.ms-Table-cell,.ms-Table td,.ms-Table th{display:table-cell;padding:0 10px;box-sizing:border-box}
.ms-Table-head,.ms-Table thead th{font-weight:300;font-size:11px;color:#666}
.ms-Table-head .ms-Table-cell,.ms-Table-head .ms-Table-rowCheck,.ms-Table-head td,.ms-Table-head th,.ms-Table thead .ms-Table-cell,.ms-Table thead .ms-Table-rowCheck,.ms-Table thead td,.ms-Table thead th{font-weight:400;text-align:left;border-bottom:1px solid #eaeaea}
.ms-Table-rowCheck{display:table-cell;width:20px;position:relative;padding:0}
.ms-Table-rowCheck:after{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-style:normal;font-weight:400;speak:none;content:"☐";color:#a6a6a6;font-size:14px;position:absolute;left:4px;top:1px}
.ms-Table--selectable .ms-Table-row:hover,.ms-Table--selectable tr:hover{background-color:#f4f4f4;cursor:pointer;outline:1px solid transparent}
@media screen and (-ms-high-contrast:active){.ms-Table-row.is-selected .ms-Table-rowCheck{background:none}
.ms-Table-row.is-selected .ms-Table-rowCheck:before{display:block}
}`;
  d.head.appendChild(style);
})(window, document);