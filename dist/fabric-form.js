"use strict";
class FabricForm extends HTMLElement {
    constructor() {
        super();
        this._name = '';
        this._method = 'get';
        this._novalidate = false;
        this._action = '';
        this._enctype = 'application/x-www-form-urlencoded';
    }
    get name() { return this._name; }
    get elements() {
        const _elements = document.querySelectorAll('*[form="' + (this.name || this.id || '') + '"]');
        const result = [];
        if (_elements && _elements.length > 0) {
            [].forEach.call(_elements, (element) => { result.push(element); });
        }
        return result;
    }
    get length() { return this.elements.length; }
    get method() { return this._method; }
    get novalidate() { return this._novalidate; }
    get enctype() { return this._enctype; }
    get encoding() { return this._enctype; }
    get action() { return this._action; }
    set elements(value) { throw new Error('Elements property cannot be set directly'); }
    set length(value) { throw new Error('Length property cannot be set directly'); }
    set name(value) { if (value === this._name)
        return; this._name = value; }
    set method(value) { let v = (['get', 'post', 'dialog'].indexOf(value.toLowerCase()) === -1) ? 'get' : value.toLowerCase(); if (v === this._method)
        return; this._method = v; }
    set novalidate(value) { if (this._novalidate === !!value)
        return; this._novalidate = !!value; }
    set enctype(value) {
        this._enctype = ([
            'application/x-www-form-urlencoded',
            'multipart/form-data',
            'text/plain'
        ].indexOf(value.toLowerCase()) === -1) ? 'application/x-www-form-urlencoded' : value.toLowerCase();
    }
    set encoding(value) { this.enctype = value; }
    set action(value) { if (value === this._action)
        return; this._action = value; }
    connectedCallback() {
        this.style.display = 'inline-block';
    }
    static get observedAttributes() {
        return ['name', 'method', 'novalidate', 'enctype', 'encoding', 'action'];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        let n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    }
    values() {
        var values = {};
        this.elements.forEach(el => {
            let identifier = el.name || el.id;
            if (identifier == null || identifier === '')
                return;
            if (el.tagName === 'FABRIC-CHECKBOX') {
                if (el.checked === false)
                    return;
                if (values.hasOwnProperty(identifier)) {
                    if (Array.isArray(values[identifier])) {
                        values[identifier].push(el.value);
                    }
                    else {
                        let val = [values[identifier]];
                        val.push(el.value);
                        values[identifier] = val;
                    }
                }
                else {
                    values[identifier] = el.value;
                }
            }
            else {
                values[identifier] = el.value;
            }
        });
        return values;
    }
    submit() {
        if (this._novalidate === true || this.checkValidity()) {
            const values = this.values();
            if (this._action === null || this._action.trim() === '') {
                return values;
            }
            else {
                switch (this.method) {
                    case 'get':
                    case 'post':
                        const params = (this.method === 'get') ? new URLSearchParams() : new FormData();
                        Object.keys(values).forEach(p => {
                            params.append(p, values[p] || '');
                        });
                        let callOptions = { method: this.method };
                        if (this.method === 'post') {
                            Object.assign(callOptions, { body: params, headers: new Headers({ 'Content-Type': this.enctype }) });
                        }
                        console.info('callOptions', callOptions);
                        fetch((this.method === 'post') ? this.action : this.action + ((this.action.indexOf('?') > -1) ? '&' : '?') + params.toString(), callOptions)
                            .then((result) => {
                            console.info(result);
                        })
                            .catch(error => {
                            console.error(error);
                        });
                        break;
                    case 'dialog':
                        break;
                }
            }
        }
        else {
            console.log('form checkValidity failed');
        }
        return null;
    }
    reset() {
        this.elements.forEach(el => el.value = null);
    }
    checkValidity() {
        var _els = this.elements, _state = true;
        if (_els.length === 0)
            return true;
        for (var e in _els) {
            if (_els[e].checkValidity == null) {
                console.warn('Form element', e, 'does not implement checkValidity');
            }
            else if (_els[e].checkValidity() === false) {
                _state = false;
            }
        }
        return _state;
    }
}
window.customElements.define('fabric-form', FabricForm);
