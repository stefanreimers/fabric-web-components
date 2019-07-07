class FabricForm extends HTMLElement {
	
	constructor(){
		super();
		this._name = '';
		
		/* @TODO: implement
		this._method = ''
		this._action = ''		
		this._encoding = ''
		*/
	}
	
	get name() { return this._name }
	
	get elements() { 
		var _elements = this.querySelectorAll('*[form="'+(this.name || this.id || '')+'"]'),
			result = [];
		if(_elements && _elements.length > 0){
			[].forEach.call(_elements, element => {result.push(element);});
		}
		return result;
	}
	
	get length() { return this.elements.length }

	set elements(val) { throw new Error('Elements property cannot be set directly') }
	set length(val) { throw new Error('Length property cannot be set directly') }
	set name(value) { if(value === this._name) return; this._name = value; }
	
	connectedCallback(){
		this.style.display = 'inline-block';
	}
		
	static get observedAttributes(){
		return ['name'];
	}
	
	attributeChangedCallback( attr, oldValue, newValue ){
		if(oldValue === newValue || newValue === this[attr]) return;
		this[attr] = newValue;
	}
	
	/* ---------- Methods ---------- */
	
	submit(){
		if(this.checkValidity()){
			
			var values = {}
			
			this.elements.forEach( el => { 
			
				console.log('elements foreach', el.tagName, el.name, el.value, values);
			
				if(el.tagName === 'FABRIC-CHECKBOX'){

					if(el.checked === false) return;
				
					if(values.hasOwnProperty(el.name)){

						if(Array.isArray(values[el.name])){
							values[el.name].push(el.value);
						} else {
							let val = [values[el.name]];
							val.push(el.value)
							values[el.name] = val;
						}
					} else {
						values[el.name] = el.value 
					}
					
				//} else if(el.tagName === 'FABRIC-CHOICEFIELDGROUP'){
					//if( el.value != null) values[el.name] = el.value;					
					
				} else {
					
					values[el.name] = el.value 
				}
			});
			return values;
		} else {
			console.log('form checkValidity failed');
		}
		return null;
	}
	
	reset(){
		this.elements.forEach( el => el.value = null);
	}
	
	checkValidity(){
		var _els = this.elements;
		
		if(_els.length === 0) return true;
		
		for(var e in _els){
			if (_els[e].checkValidity == null || _els[e].checkValidity() === false) {
				return false;
			}
		}
		
		return true;
	}
	
}
window.customElements.define( 'fabric-form', FabricForm );