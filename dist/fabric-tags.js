"use strict";
class FabricTags extends HTMLElement {
    constructor() {
        super();
        this._refs = {};
        this._disabled = false;
        this._refs = {};
        this._disabled = false;
        this._value = null;
        this._items = [];
        this._uuid = this.__uuid();
    }
    get disabled() { return this._disabled; }
    set disabled(value) { if (this._disabled === !!value)
        return; this._disabled = !!value; this.__setProperties('disabled'); }
    get value() { return this._value; }
    set value(val) { if (val === this._value)
        return; this._value = val; this.__setProperties('value'); }
    get items() { return this._items; }
    set items(value) {
        if (value == null)
            value = [];
        if (!Array.isArray(value))
            value = [].concat(value);
        this._items = value;
        this.__setProperties('items');
    }
    connectedCallback() {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    }
    __setupUI() {
        let markup = `<div class="tags">
				<input list="${this._uuid}" tabindex="0"></input>
			</div><datalist id="${this._uuid}"/>`;
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.tags'),
            input: this.querySelector('input'),
            datalist: this.querySelector('datalist')
        };
    }
    __setProperties(property) {
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
    }
    __addListeners() {
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
    }
    __OnClickListener(e) {
        let target = e.target;
        if (target && target.classList.contains('delete')) {
            let item = target.parentNode.parentNode;
            item.parentNode.removeChild(item);
            return;
        }
        this._refs.input.focus();
    }
    __addTag(value) {
        if (!this._refs.container)
            return;
        let item = document.createElement('div');
        item.classList.add('tagItem');
        item.innerHTML = '<span>' + value + ' <span class="delete">x</span></span>';
        this._refs.container.insertBefore(item, this._refs.input);
    }
    __updateTagList() {
        [].forEach.call(this.querySelectorAll('.tagItem'), (item) => {
            item.parentNode.removeChild(item);
        });
        [].concat(this.value).forEach((item) => {
            this.__addTag(item);
        });
    }
    __updateItemList() {
        if (!this._refs.datalist || !this._items)
            return;
        let fragment = document.createElement('DIV');
        this.items.forEach((item) => {
            let option = document.createElement('OPTION');
            option.innerText = item.toString();
            fragment.appendChild(option);
        });
        this._refs.datalist.innerHTML = fragment.innerHTML;
    }
    static get observedAttributes() {
        return ['value', 'items', 'disabled'];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        let n = (typeof this[attr] === 'boolean') ? this.hasAttribute(attr) : newValue;
        if (oldValue === n || this[attr] === n)
            return;
        if (attr === 'disabled') {
            this.disabled = !!n;
            return;
        }
        this[attr] = (Array.isArray(newValue)) ? newValue : newValue.toString().split(',');
    }
    __uuid() {
        function _() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return _() + _() + '-' + _() + '-' + _() + '-' + _() + '-' + _() + _() + _();
    }
}
window.customElements.define('fabric-tags', FabricTags);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `fabric-tags {
display: inline-block;
}
fabric-tags .tags {
	margin: auto;
	max-width:100%;
	border: 1px solid #EAEAEA;
	min-height: 30px;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
}
fabric-tags .tagItem {
	background-color: #F4F4F4;
	margin: 1px;
	height: 28px;
	line-height: 28px;
}
fabric-tags .tagItem > span {
	min-width: 20px;
	display: inline-block;
	margin: 0 8px;
}
fabric-tags .tagItem .delete {
	cursor: pointer;
}
fabric-tags input {
	min-height: 28px;
	flex-grow: 1;
	min-width: 1px;
	max-width:100%; 
	width: 1px;
	padding: 0 6px;
	margin: 1px;
	border: none;
}`;
    d.head.appendChild(style);
})(window, document);
