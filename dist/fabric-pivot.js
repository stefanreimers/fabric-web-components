"use strict";
class FabricPivot extends HTMLElement {
    constructor() {
        super();
        this._refs = {};
        this._tabs = false;
        this._large = false;
    }
    get tabs() { return this._tabs; }
    get large() { return this._large; }
    set tabs(value) { if (!!value === this._tabs)
        return; this._tabs = value; this.__setProperties('tabs'); }
    set large(value) { if (!!value === this._large)
        return; this._large = value; this.__setProperties('large'); }
    get links() { return (this._refs && this._refs.links) ? this._refs.links.links : null; }
    set links(value) { throw Error('Links / tabs cannot be set directly'); }
    connectedCallback() {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
        let first = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content') : null;
        if (this._refs.links && first)
            this._refs.links.selected = first.dataset.name;
    }
    disconnectedCallback() {
    }
    __setupUI() {
        let markup = `<div class="ms-Pivot">
		  <fabric-tabs class="ms-Pivot-links"></fabric-tabs>
		  <div class="ms-Pivot-content-container"/>
		</div>`;
        if (this.children && this.children.length > 0) {
            const div = document.createElement('DIV');
            div.innerHTML = markup;
            const contentContainer = div.querySelector('.ms-Pivot-content-container');
            if (contentContainer) {
                while (this.children.length > 0) {
                    if (this.children[0].dataset.name == undefined || this.children[0].dataset.text == undefined)
                        this.removeChild(this.children[0]);
                    this.children[0].classList.add('ms-Pivot-content');
                    contentContainer.appendChild(this.children[0]);
                }
            }
            this.appendChild(div.children[0]);
        }
        else {
            this.innerHTML = markup;
        }
        this._refs = {
            container: this.querySelector('.ms-Pivot'),
            links: this.querySelector('.ms-Pivot-links'),
            content: this.querySelector('.ms-Pivot-content-container')
        };
        this.__updateTabs();
    }
    __setProperties(property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'tabs') {
            this._refs.links.tabs = this._tabs;
        }
        if (property == null || property === 'large') {
            this._refs.links.large = this._large;
        }
    }
    __addListeners() {
        if (this._refs.links)
            this._refs.links.addEventListener('onTabSelected', (event) => {
                if (event.detail && event.detail.selected)
                    this.show(event.detail.selected);
            });
    }
    show(name) {
        let visible = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content.visible') : null;
        if (visible)
            visible.classList.remove('visible');
        let toShow = (this._refs.content) ? this._refs.content.querySelector('.ms-Pivot-content[data-name="' + name + '"]') : null;
        if (toShow)
            toShow.classList.add('visible');
    }
    __updateTabs() {
        let tabs = (this._refs.content) ? this._refs.content.querySelectorAll('.ms-Pivot-content') : null;
        if (tabs && this._refs.links) {
            let links = [];
            [].forEach.call(tabs, (tab) => {
                links.push({ text: tab.dataset.text, name: tab.dataset.name, disabled: false });
            });
            this._refs.links.links = links;
        }
    }
    static get observedAttributes() {
        return ['tabs', 'large'];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue === newValue || newValue === this[attr])
            return;
        this[attr] = this.hasAttribute(attr);
    }
}
window.customElements.define('fabric-pivot', FabricPivot);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `fabric-pivot {display: inline-block}
.ms-Pivot{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;font-size:14px;font-weight:400}
.ms-Pivot-content{display:none;margin-top:20px}
.ms-Pivot-content.visible{display:block}
`;
    d.head.appendChild(style);
})(window, document);
