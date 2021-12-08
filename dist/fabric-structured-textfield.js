"use strict";
class FabricStructuredTextfield extends HTMLElement {
    constructor() {
        super();
        this.setCaret = (pos, parent) => {
            console.log('setCaret');
            for (const node of parent.childNodes) {
                if (node.nodeType == Node.TEXT_NODE) {
                    if (node.length >= pos) {
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.setStart(node, pos);
                        range.collapse(true);
                        if (sel != null) {
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                        return -1;
                    }
                    else {
                        pos = pos - node.length;
                    }
                }
                else {
                    pos = this.setCaret(pos, node);
                    if (pos < 0) {
                        return pos;
                    }
                }
            }
            return pos;
        };
        this._modifier = 'multiple';
        this._disabled = false;
        this._required = false;
        this._readonly = false;
        this._label = '';
        this._placeholder = '';
        this._description = '';
        this._type = 'text';
        this._name = '';
        this._value = '';
        this._refs = {};
    }
    get modifier() { return this._modifier; }
    get disabled() { return this._disabled; }
    get required() { return this._required; }
    get readonly() { return this._readonly; }
    get label() { return this._label; }
    get placeholder() { return this._placeholder; }
    get description() { return this._description; }
    get type() { return this._type; }
    get name() { return this._name; }
    get value() { return this._value; }
    set modifier(value) { throw new RangeError('Modifier is a static property'); }
    set type(value) { throw new RangeError('Input type is a static property'); }
    set name(value) { this._name = value; this.__setProperties('name'); }
    set disabled(value) { this._disabled = !!value; this.__setProperties('disabled'); }
    set required(value) { this._required = !!value; this.__setProperties('required'); }
    set readonly(value) { this._readonly = !!value; this.__setProperties('readonly'); }
    set label(value) { this._label = value; this.__setProperties('label'); }
    set placeholder(value) { this._placeholder = value; this.__setProperties('placeholder'); }
    set description(value) { this._description = value; this.__setProperties('description'); }
    set value(newValue) { this._value = (newValue || '').toString(); this.__setProperties('value'); }
    __setProperties(property) {
        if (!this._refs.container)
            return;
        try {
            if (property == null || property === 'name')
                if (this._refs.input)
                    this._refs.input.name = this._name;
            if (property == null || property === 'value') {
                if (this._modifier === 'multiline') {
                    if (this._refs.input)
                        this._refs.input.textContent = this._value;
                }
                else {
                    if (this._refs.input)
                        this._refs.input.value = this._value;
                }
            }
            if (property == null || property === 'label')
                if (this._refs.label)
                    this._refs.label.innerText = this._label;
            if (property == null || property === 'placeholder')
                if (this._refs.input)
                    this._refs.input.placeholder = this._placeholder;
            if (property == null || property === 'description')
                if (this._refs.description)
                    this._refs.description.innerText = this._description;
            if (property == null || property === 'disabled') {
                if (this._refs.input)
                    this._refs.input.disabled = this._disabled;
                if (this._disabled === true) {
                    this._refs.container.classList.add('is-disabled');
                }
                else {
                    this._refs.container.classList.remove('is-disabled');
                }
            }
            if (property == null || property === 'required') {
                if (this._refs.input)
                    this._refs.input.required = this._required;
                if (this._required == true) {
                    this._refs.container.classList.add('is-required');
                }
                else {
                    this._refs.container.classList.remove('is-required');
                }
            }
            if (property == null || property === 'readonly') {
                this._refs.input.readOnly = this.readonly;
                if (this.readonly === true) {
                    this._refs.input.setAttribute('readonly', 'readonly');
                }
                else {
                    this._refs.input.removeAttribute('readonly');
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    __setupUI() {
        this.innerHTML = this.template();
        this._refs = {
            container: this.querySelector('.ms-TextField'),
            input: this.querySelector('.ms-TextField-field'),
            label: this.querySelector('.ms-Label'),
            description: this.querySelector('.ms-TextField-description')
        };
    }
    connectedCallback() {
        this.__getStaticAttributes();
        this.__setupUI();
        this.__setProperties();
        this.__setListeners();
    }
    __getStaticAttributes() {
        let modifier = this.getAttribute('modifier');
        if (modifier && ['multiline', 'underlined'].indexOf(modifier) > -1) {
            this._modifier = modifier;
            if (modifier === 'multiline' && (this._value == null || this._value === '')) {
                this.value = this.textContent || '';
            }
        }
        let type = this.getAttribute('type');
        if (type)
            this._type = type;
    }
    __setListeners() {
        if (this._refs.label)
            this._refs.label.addEventListener("click", (event) => {
                if (this._refs.input)
                    this._refs.input.focus();
            });
        if (this._refs.input) {
            this._refs.input.addEventListener("input", (event) => {
                if (event.target)
                    this._value = event.target.value;
            });
            this._refs.input.addEventListener('keyup', e => {
                if (e.target && e.target.innerHTML === '')
                    e.target.innerHTML = '<div></div>';
                if ((e.keyCode >= 0x30 || e.keyCode == 0x20) && this._refs.input) {
                    const pos = this.caret(this._refs.input);
                    this.highlight(this._refs.input);
                    this.setCaret(pos, this._refs.input);
                }
            });
            this._refs.input.addEventListener('keydown', (e) => {
                const tab = '    ';
                if (e.which === 9 && this._refs.input) {
                    const pos = this.caret(this._refs.input) + tab.length;
                    try {
                        const range = window.getSelection().getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(document.createTextNode(tab));
                    }
                    catch (e) { }
                    this.highlight(this._refs.input);
                    this.setCaret(pos, this._refs.input);
                    e.preventDefault();
                }
            });
        }
    }
    template() {
        return `<div class="ms-TextField ms-TextField--multiline">
      <label class="ms-Label hide-when-empty"></label>
      <div class="ms-TextField-field" contenteditable="true" spellcheck="false"><div>&nbsp;</div></div>
      <span class="ms-TextField-description"></span>
    </div>`;
    }
    highlight(el) {
        console.log('highlight', el);
        for (const node of el.children) {
            console.log(node);
            const s = node.innerText
                .replace(/(\/\/.*)/g, '<em>$1</em>')
                .replace(/\b(new|if|else|do|while|switch|for|in|of|continue|break|return|typeof|function|var|const|let|\.length|\.\w+)(?=[^\w])/g, '<tt data-reserved>$1</tt>')
                .replace(/(".*?"|'.*?'|`.*?`)/g, '<strong><em>$1</em></strong>')
                .replace(/\b(\d+)/g, '<em><strong>$1</strong></em>');
            node.innerHTML = s.split('\n').join('<br/>');
        }
    }
    ;
    caret(el) {
        console.log('caret');
        const range = window.getSelection().getRangeAt(0);
        const prefix = range.cloneRange();
        prefix.selectNodeContents(el);
        prefix.setEnd(range.endContainer, range.endOffset);
        return prefix.toString().length;
    }
    ;
    static get observedAttributes() {
        return [
            'disabled',
            'required',
            'readonly',
            'label',
            'placeholder',
            'description',
            'name',
            'value'
        ];
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (oldVal !== newVal) {
            const nw = (typeof this[attrName] === 'boolean' && newVal === '') ? true : newVal;
            this[attrName] = nw;
        }
    }
}
customElements.define('fabric-structured-textfield', FabricStructuredTextfield);
(function (w, d) {
    'use strict';
    let id = 'structured-textfield';
    const node = document.querySelector('style[data-fabric="' + id + '"]');
    if (node) {
        return;
    }
    var styles = document.createElement("style");
    styles.type = 'text/css';
    styles.innerHTML = _getStyles();
    styles.dataset.fabric = id;
    document.getElementsByTagName('head')[0].appendChild(styles);
    function _getStyles() {
        const tag = 'fabric-structured-textfield';
        return `${tag}:unresolved,
    ${tag}:not(:defined),
    ${tag} > *:not(.ms-TextField) {
      opacity: 0;
      visibility: hidden;
    }

    ${tag} .ms-TextField-field {
      font-family: 'Roboto Mono', monospace;
      font-size: 12px;
      outline: none;
      overflow-y: auto;
      padding-left: 48px;
      counter-reset: line;
    }

    ${tag} .ms-TextField-field div {
      display: block;
      position: relative;
      white-space: pre-wrap;
    }

    ${tag} .ms-TextField-field div::before {
      content: counter(line);
      counter-increment: line;
      position: absolute;
      right: calc(100% + 16px);
      opacity: 0.5;
    }
    
    ${tag} .ms-TextField.ms-TextField--multiline {
      height: 100%
    }

    ${tag} .ms-TextField.ms-TextField--multiline label + textarea {
      height: calc(100% - 20px)
    }

    ${tag} .ms-TextField.ms-TextField--multiline label:empty + textarea {
      height: 100%
    }

${tag} .ms-TextField {
  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  box-shadow: none;
  color: #333333;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 8px;
}

${tag} .ms-TextField .ms-Label:empty,
${tag} .ms-TextField .ms-Label:empty::after,
${tag} .ms-TextField .ms-TextField-description:empty {
  display: none
}

${tag} .ms-TextField .ms-Label {
  font-size: 14px;
  font-weight: 600;
  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

${tag} .ms-TextField.is-disabled .ms-TextField-field {
  background-color: #f4f4f4;
  border-color: #f4f4f4;
  pointer-events: none;
  cursor: default;
}

${tag} .ms-TextField.is-disabled::-webkit-input-placeholder {
  color: #a6a6a6;
}

${tag} .ms-TextField.is-disabled::-moz-placeholder {
  color: #a6a6a6;
}

${tag} .ms-TextField.is-disabled:-moz-placeholder {
  color: #a6a6a6;
}

${tag} .ms-TextField.is-disabled:-ms-input-placeholder {
  color: #a6a6a6;
}

${tag} .ms-TextField-field[readonly]{
  background: #fafafa;
}

${tag}[required] .ms-Label::after {
  content: ' *';
  color: #a80000;
} 
${tag} .ms-TextField.is-required .ms-Label::after {
  content: ' *';
  color: #a80000;
}
.ms-TextField.is-required::-webkit-input-placeholder::after {
  content: ' *';
  color: #a80000;
}
.ms-TextField.is-required::-moz-placeholder::after {
  content: ' *';
  color: #a80000;
}
.ms-TextField.is-required:-moz-placeholder::after {
  content: ' *';
  color: #a80000;
}
.ms-TextField.is-required:-ms-input-placeholder::after {
  content: ' *';
  color: #a80000;
}

.ms-TextField.is-active {
  border-color: var(--${tag}-border-active, #0078d7);
}

.ms-TextField-field {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  box-shadow: none;
  border-width: 1px;
  border-style: solid;
  border-color: var(--${tag}-border, #c8c8c8);
  border-radius: 0;
  font-weight: 300;
  font-size: 14px;
  color: #333333;
  height: 32px;
  padding: 6px 12px;
  width: 100%;
  min-width: 180px;
  outline: 0;
  text-overflow: ellipsis;
  background-color: white;
}

.ms-TextField-field:hover {
  border-color: var(--${tag}-border-hover, #767676);
}

.ms-TextField-field:focus,
.ms-TextField-field:focus-within {
  border-color: var(--${tag}-border-focus, #0078d7);
}

@media screen and (-ms-high-contrast: active) {
  .ms-TextField-field:hover,
  .ms-TextField-field:focus {
    border-color: #1aebff;
  }
}

@media screen and (-ms-high-contrast: black-on-white) {
  .ms-TextField-field:hover,
  .ms-TextField-field:focus {
    border-color: #37006e;
  }
}

.ms-TextField-field[disabled] {
  background-color: #f4f4f4;
  border-color: var(--${tag}-border-disabled, #f4f4f4);
  pointer-events: none;
  cursor: default;
}

.ms-TextField-field::-webkit-input-placeholder {
  color: #666666;
}

.ms-TextField-field::-moz-placeholder {
  color: #666666;
}

.ms-TextField-field:-moz-placeholder {
  color: #666666;
}

.ms-TextField-field:-ms-input-placeholder {
  color: #666666;
}

.ms-TextField-description {
  color: #767676;
  font-size: 11px;
}

.ms-TextField.ms-TextField--placeholder {
  position: relative;
  background-color: #ffffff;
}

.ms-TextField.ms-TextField--placeholder .ms-TextField-field {
  position: relative;
  background-color: transparent;
  z-index: 5;
}

.ms-TextField.ms-TextField--placeholder .ms-Label {
  position: absolute;
  font-weight: 300;
  font-size: 14px;
  color: #666666;
  padding: 6px 12px 7px;
  pointer-events: none;
  z-index: 0;
}

.ms-TextField.ms-TextField--placeholder.is-disabled {
  color: #a6a6a6;
}

.ms-TextField.ms-TextField--placeholder.is-disabled .ms-Label {
  color: #a6a6a6;
}

.ms-TextField.ms-TextField--underlined {
  border-bottom: 1px solid #c8c8c8;
  display: table;
  width: 100%;
  min-width: 180px;
}

.ms-TextField.ms-TextField--underlined:hover {
  border-color: #767676;
}

@media screen and (-ms-high-contrast: active) {
  .ms-TextField.ms-TextField--underlined:hover {
    border-color: #1aebff;
  }
}

@media screen and (-ms-high-contrast: black-on-white) {
  .ms-TextField.ms-TextField--underlined:hover {
    border-color: #37006e;
  }
}

.ms-TextField.ms-TextField--underlined:active,
.ms-TextField.ms-TextField--underlined:focus {
  border-color: #0078d7;
}

.ms-TextField.ms-TextField--underlined .ms-Label {
  font-size: 14px;
  margin-right: 8px;
  display: table-cell;
  vertical-align: top;
  padding-left: 12px;
  padding-top: 9px;
  height: 32px;
  width: 1%;
  white-space: nowrap;
}

.ms-TextField.ms-TextField--underlined .ms-TextField-field {
  border: 0;
  float: left;
  display: table-cell;
  text-align: left;
  padding-top: 8px;
  padding-bottom: 3px;
}

.ms-TextField.ms-TextField--underlined .ms-TextField-field:active,
.ms-TextField.ms-TextField--underlined .ms-TextField-field:focus,
.ms-TextField.ms-TextField--underlined .ms-TextField-field:hover {
  outline: 0;
}

.ms-TextField.ms-TextField--underlined.is-disabled {
  border-bottom-color: #eaeaea;
}

.ms-TextField.ms-TextField--underlined.is-disabled .ms-Label {
  color: #a6a6a6;
}

.ms-TextField.ms-TextField--underlined.is-disabled .ms-TextField-field {
  background-color: transparent;
  color: #a6a6a6;
}

.ms-TextField.ms-TextField--underlined.is-active {
  border-color: #0078d7;
}

@media screen and (-ms-high-contrast: active) {
  .ms-TextField.ms-TextField--underlined.is-active {
    border-color: #1aebff;
  }
}

@media screen and (-ms-high-contrast: black-on-white) {
  .ms-TextField.ms-TextField--underlined.is-active {
    border-color: #37006e;
  }
}

.ms-TextField.ms-TextField--multiline .ms-TextField-field {
  font-family: 'Segoe UI WestEuropean', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #666666;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  min-height: 150px;
  min-width: 260px;
  padding-top: 6px;
  overflow: auto;
}`;
    }
}(window, document));
