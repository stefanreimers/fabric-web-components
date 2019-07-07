"use strict";
class FabricProgress extends HTMLElement {
    constructor() {
        super();
        this._refs = {};
        this._name = '';
        this._description = '';
        this._total = 100;
        this._progress = 0;
        this._disabled = false;
    }
    get disabled() { return this._disabled; }
    set disabled(value) { if (this._disabled === !!value)
        return; this._disabled = !!value; this.__setProperties('disabled'); }
    get name() { return this._name; }
    set name(val) { if (this._name === val)
        return; this._name = val; this.__setProperties('name'); }
    get description() { return this._description; }
    set description(val) { if (this._description === val)
        return; this._description = val; this.__setProperties('description'); }
    get total() { return this._total; }
    set total(value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._total === value)
        return; this._total = value; this.__setProperties('total'); }
    get progress() { return this._progress; }
    set progress(value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._progress === value)
        return; this._progress = value; this.__setProperties('progress'); }
    connectedCallback() {
        this.__setupUI();
        this.__setProperties();
    }
    __setupUI() {
        let markup = `<div class="ms-ProgressIndicator">
		  <div class="ms-ProgressIndicator-itemName"></div>
		  <div class="ms-ProgressIndicator-itemProgress">
			<div class="ms-ProgressIndicator-progressTrack"></div>
			<div class="ms-ProgressIndicator-progressBar"></div>
		  </div>
		  <div class="ms-ProgressIndicator-itemDescription"></div>
		</div>`;
        this.innerHTML = markup;
        this._refs = {
            container: this.querySelector('.ms-ProgressIndicator'),
            name: this.querySelector('.ms-ProgressIndicator-itemName'),
            description: this.querySelector('.ms-ProgressIndicator-itemDescription'),
            bar: this.querySelector('.ms-ProgressIndicator-progressBar'),
            progress: this.querySelector('.ms-ProgressIndicator-itemProgress')
        };
    }
    __setProperties(property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'name') {
            if (this._refs.name)
                this._refs.name.textContent = this._name;
        }
        if (property == null || property === 'description') {
            if (this._refs.description)
                this._refs.description.textContent = this._description;
        }
        if (property == null || ['progress', 'total'].indexOf(property) !== -1) {
            this.__updateProgress();
        }
    }
    static get observedAttributes() {
        return ['name', 'description', 'total', 'progress'];
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue != newValue)
            this[attr] = newValue;
    }
    __updateProgress() {
        const percentage = (this._progress == null || this._progress === 0) ? 0 : Math.round(this._progress / this._total * 100);
        if (this._refs.bar)
            this._refs.bar.style.width = percentage + "%";
    }
}
window.customElements.define('fabric-progress', FabricProgress);
(function (w, d) {
    let style = d.createElement('STYLE');
    style.textContent = `fabric-progress {display:inline-block} .ms-ProgressIndicator{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;font-weight:400}
.ms-ProgressIndicator-itemName{color:#333;font-size:14px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;padding-top:4px;line-height:20px}
.ms-ProgressIndicator-itemDescription{color:#767676;font-size:11px;line-height:18px}
.ms-ProgressIndicator-itemProgress{position:relative;width:180px;height:2px;padding:8px 0}
.ms-ProgressIndicator-progressTrack{position:absolute;width:100%;height:2px;background-color:#eaeaea;outline:1px solid transparent}
.ms-ProgressIndicator-progressBar{background-color:#0078d7;height:2px;position:absolute;transition:width .3s ease;width:0}
@media screen and (-ms-high-contrast:active){.ms-ProgressIndicator-progressBar{background-color:#fff}
}
@media screen and (-ms-high-contrast:black-on-white){.ms-ProgressIndicator-progressBar{background-color:#000}
}`;
    d.head.appendChild(style);
})(window, document);
