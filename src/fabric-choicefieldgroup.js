class FabricChoiceFieldGroup extends HTMLElement {
	
	constructor(){
		super();
	
		this._name = '';	// Name of corresponding choice fields
		this._label = '';
		this._nodes = {};
		this._form ='';

	}
	
	get disabled() { return this._disabled || false }
	get required() { return this._required || false }
	get label() { return this._label }
	get name() { return this._name }
	get form() { return this._form }
	get value() { 
		var radios = this.querySelectorAll('fabric-radiobutton[name="'+this.name+'"]');
		var selected = null;
		if(radios && radios.length > 0){
			[].forEach.call(radios, (radio) => {
				if(radio.checked === true) selected = radio.label;
			});
		}
		return selected;
	}
	
	
	set disabled(value) { if(!!value === this._disabled) return; this._disabled = !!value; this.__setProperties('disabled') }
	set required(value) { if(!!value === this._required) return; this._required = !!value; this.__setProperties('required') }
	set label(value) { if(value === this._label) return; this._label = value;  this.__setProperties('label') }
	set form(value) { if(value === this._form) return; this._form = value;  this.__setProperties('form') }
	set name(value) { if(value === this._name) return; this._name = value; }
	set value(val) { this.__setProperties('value') }
	 
	connectedCallback(){
		
		this.__setupUI();
		this.__setProperties();
		this.__addListeners();
	}
	
	__setupUI(){

		let markup = `<div class="ms-ChoiceFieldGroup" role="radiogroup">
			  <div class="ms-ChoiceFieldGroup-title">
				<label class="ms-Label"></label>
			  </div>
			<ul class="ms-ChoiceFieldGroup-list">
			</ul>
			</div>`;

		var fragment = document.createElement('DIV');
		fragment.innerHTML = markup;
		
		// Move current nodes
		var radios = this.querySelectorAll('fabric-radiobutton[name="'+this.name+'"]');
		if(radios && radios.length > 0){
			var list = fragment.querySelector('.ms-ChoiceFieldGroup-list');
			[].forEach.call(radios, (radio) => {
				list.appendChild(radio);
			});
		}
		
		this.innerHTML = fragment.innerHTML;
		fragment = null;		
		
		this._nodes = {
			container: this.querySelector('.ms-ChoiceFieldGroup'),
			label: this.querySelector('.ms-ChoiceFieldGroup-title > .ms-Label'),
			list: this.querySelector('.ms-ChoiceFieldGroup-list')
		}
	}
	
	__addListeners(){
		this._nodes.list.addEventListener("fabricRadioSelect", this._onChangeHandler.bind(this), false);		
	}

	_onChangeHandler(event) {
        let name = event.detail.name;
        let selectedChoice = event.detail.item;
        if ( this.name === name) {
			
			var _choiceFieldComponents = this._nodes.list.querySelectorAll('fabric-radiobutton[name="'+this.name+'"]');
			if(!_choiceFieldComponents || _choiceFieldComponents.length === 0) return;
			
			[].forEach.call(_choiceFieldComponents, (item) => {
				if(item === selectedChoice){
					item.checked = true;
				} else {
					item.checked = false;
				}
			});

        }
	}
	
	__setProperties(property){
		
		if(!this._nodes.container) return;
				
		if(property == null || property === 'disabled') { 
		
			var radios = this.querySelectorAll('fabric-radiobutton[name="'+this.name+'"]');
			if(radios && radios.length > 0){
				[].forEach.call(radios, (radio) => {
					radio.disabled = this.disabled;
				});
			}
		}
		
		if(property == null || property === 'required'){
			this._nodes.label.classList[(!!this._required)?'add':'remove']('is-required');
		}
		
		if(property == null || property === 'label') { this._nodes.label.textContent = this._label || ''; }

		if(property == null || property === 'form') { 
			if(this._form != null && this._form !== ''){
				this.setAttribute('form', this._form);
			} else {
				this.removeAttribute('form');
			}
		}
		
	}
	
	static get observedAttributes(){
		return ['disabled', 'requried', 'label', 'name', 'form'];
	}
	
	attributeChangedCallback( attr, oldValue, newValue ){
		
		// Gather boolean properties
		if(['disabled', 'required'].indexOf(attr) !== -1){
			newValue = this.hasAttribute(attr);
		}
		
		if(oldValue === newValue || newValue === this[attr]) return;
		this[attr] = newValue;
	}
	
	checkValidity(){
		return (!(this.required && this.value === null));
	}
	
}
window.customElements.define( 'fabric-choicefieldgroup', FabricChoiceFieldGroup );

// Set styles
(function (w,d) { 

let style = d.createElement('STYLE');
style.textContent = `.ms-ChoiceFieldGroup{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;margin-bottom:4px}
.ms-ChoiceFieldGroup .ms-ChoiceFieldGroup-list{padding:0;margin:0;list-style:none}`;
d.head.appendChild(style);
})(window, document);