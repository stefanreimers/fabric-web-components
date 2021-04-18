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
var FabricForm = (function (_super) {
    __extends(FabricForm, _super);
    function FabricForm() {
        var _this = _super.call(this) || this;
        _this._name = '';
        _this._method = 'get';
        _this._novalidate = false;
        _this._action = '';
        _this._enctype = 'application/x-www-form-urlencoded';
        return _this;
    }
    Object.defineProperty(FabricForm.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { if (value === this._name)
            return; this._name = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricForm.prototype, "elements", {
        get: function () {
            var _elements = document.querySelectorAll('*[form="' + (this.name || this.id || '') + '"]');
            var result = [];
            if (_elements && _elements.length > 0) {
                [].forEach.call(_elements, function (element) { result.push(element); });
            }
            return result;
        },
        set: function (value) { throw new Error('Elements property cannot be set directly'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricForm.prototype, "length", {
        get: function () { return this.elements.length; },
        set: function (value) { throw new Error('Length property cannot be set directly'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricForm.prototype, "method", {
        get: function () { return this._method; },
        set: function (value) { var v = (['get', 'post', 'dialog'].indexOf(value.toLowerCase()) === -1) ? 'get' : value.toLowerCase(); if (v === this._method)
            return; this._method = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricForm.prototype, "novalidate", {
        get: function () { return this._novalidate; },
        set: function (value) { if (this._novalidate === !!value)
            return; this._novalidate = !!value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricForm.prototype, "enctype", {
        get: function () { return this._enctype; },
        set: function (value) {
            this._enctype = ([
                'application/x-www-form-urlencoded',
                'multipart/form-data',
                'text/plain'
            ].indexOf(value.toLowerCase()) === -1) ? 'application/x-www-form-urlencoded' : value.toLowerCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricForm.prototype, "encoding", {
        get: function () { return this._enctype; },
        set: function (value) { this.enctype = value; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FabricForm.prototype, "action", {
        get: function () { return this._action; },
        set: function (value) { if (value === this._action)
            return; this._action = value; },
        enumerable: false,
        configurable: true
    });
    FabricForm.prototype.connectedCallback = function () {
        this.style.display = 'inline-block';
    };
    Object.defineProperty(FabricForm, "observedAttributes", {
        get: function () {
            return ['name', 'method', 'novalidate', 'enctype', 'encoding', 'action'];
        },
        enumerable: false,
        configurable: true
    });
    FabricForm.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        var n = newValue;
        if (typeof this[attr] === 'boolean') {
            n = this.hasAttribute(attr);
        }
        if (oldValue === n || n === this[attr])
            return;
        this[attr] = n;
    };
    FabricForm.prototype.values = function () {
        var values = {};
        this.elements.forEach(function (el) {
            var identifier = el.name || el.id;
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
                        var val = [values[identifier]];
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
    };
    FabricForm.prototype.submit = function () {
        if (this._novalidate === true || this.checkValidity()) {
            var values_1 = this.values();
            if (this._action === null || this._action.trim() === '') {
                return values_1;
            }
            else {
                switch (this.method) {
                    case 'get':
                    case 'post':
                        var params_1 = (this.method === 'get') ? new URLSearchParams() : new FormData();
                        Object.keys(values_1).forEach(function (p) {
                            params_1.append(p, values_1[p] || '');
                        });
                        var callOptions = { method: this.method };
                        if (this.method === 'post') {
                            Object.assign(callOptions, { body: params_1, headers: new Headers({ 'Content-Type': this.enctype }) });
                        }
                        console.info('callOptions', callOptions);
                        fetch((this.method === 'post') ? this.action : this.action + ((this.action.indexOf('?') > -1) ? '&' : '?') + params_1.toString(), callOptions)
                            .then(function (result) {
                            console.info(result);
                        })
                            .catch(function (error) {
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
    };
    FabricForm.prototype.reset = function () {
        this.elements.forEach(function (el) { return el.value = null; });
    };
    FabricForm.prototype.checkValidity = function () {
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
    };
    return FabricForm;
}(HTMLElement));
window.customElements.define('fabric-form', FabricForm);
