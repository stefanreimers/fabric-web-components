class FabricPeoplePicker extends HTMLElement {
	
	constructor(){
		super();	
		
		this._modifier = null;
		this._people = [];
		
		this._refs = {};
	
	}

	get modifier() { return this._modifier; }
	set modifier(value) { throw new RangeError('The modifier property is static.') }
	
	get people() { return this._people }
	set people(values) {  console.log('set people', values);if(Array.isArray(values) || values == null) this._people = values || []; this.__setProperties('people') }
		
	connectedCallback(){
		
		this.__getStaticAttributes();
		this.__setupUI();
		this.__setProperties();
		this.__addListeners();

	}
		
	__setupUI(){
	
		let modifier = (this._modifier)?'ms-Persona--'+this._modifier:'';
	
		let markup = `<div class="ms-PeoplePicker ${modifier}">
		  <div class="ms-PeoplePicker-searchBox">
			<fabric-textfield class="ms-PeoplePicker-textField" modifier="underlined" placeholder="Search or enter an option"></fabric-textfield>
		  </div>
		  <fabric-contextual-menu host=".ms-PeoplePicker-searchBox" class="ms-PeoplePicker-results" matchTargetWidth>
		  </fabric-contextual-menu>
		  </div>
		  `;

		this.innerHTML = markup;

		// Update references
		this._refs = {
			container: this.querySelector('.ms-PeoplePicker'),
			search: this.querySelector('.ms-PeoplePicker-searchBox'),
			textfield: this.querySelector('.ms-PeoplePicker-textField'),
			menu: this.querySelector('.ms-PeoplePicker-results')
		}

		
	}
	
	__setProperties(property){
	
		if(!this._refs || !this._refs.container) return;
		
		console.log('__setProperties', property, this[property])
		
		if(property == null || property === 'people') { 
			
			let list = this._refs.menu.querySelector('.ms-ContextualMenu');
		
		
			list.innerHTML = '';

			if(!this._people || this._people.length == 0){
				let item = document.createElement('span');
				item.classList.add('no-people')
				item.textContent = 'No people';
				list.appendChild(item)
			}
			this._people.forEach( (entity) => {
				
				let persona = document.createElement('fabric-persona');
				persona.setAttribute('size', 'xs');
				persona.setAttribute('primarytext', entity.name);
				
			
				list.appendChild(persona)
			});
		}
		
	}
	
	__addListeners(){
		if(this._refs.textfield) {
			this._refs.textfield.addEventListener('focus', (e) => { this._refs.container.classList.add('is-active'); });
			this._refs.textfield.addEventListener('blur', (e) => { this._refs.container.classList.remove('is-active'); });
		 }
		
		// console.log('bind event', this._refs.menu)
		if(this._refs.menu){
			this._refs.menu.addEventListener("contextual-menu-link-click", this.__selectResult.bind(this), true);
		}
		
		if(this._refs.search) {
			this._refs.search.addEventListener('click', this.__removeResult.bind(this), true );
		}
		
		//this._refs.menu.setHost( this._refs.search );

	}
	
	__selectResult(e) {
				
		console.log('__selectResult', e);
		e.stopPropagation();

		// find persona
		let persona = this.__closest(e.detail.node, 'fabric-persona', e.target)

		if(!persona) {
			console.log('No persona');
			return;
		}

		// let clonedResult = currentResult.cloneNode(true);

		// if facePile - add to members list / else tokenize
		if (this._modifier === "facePile") {
		// this._addResultToMembers(clonedResult);
		} else {
			this.__tokenizeResult(persona);
		}

		// Close the open contextual host
		this._refs.menu.close();
    }
	
	__tokenizeResult(tokenResult) {

		console.log('__tokenizeResult', tokenResult)
	
      // Add token classes to persona
      tokenResult.classList.add("ms-PeoplePicker-persona");

      // Use persona xs variant for token
	  tokenResult.modifier = 'token';
	  tokenResult.size = 'xs'
	  
      // Prepend the token before the search field
      this._refs.search.insertBefore(tokenResult, this._refs.textfield);
    }
	
	__removeResult(e){
		
		console.log('__removeResult', e);
		e.stopPropagation();
		
		let persona = this.__closest(e.target, 'fabric-persona', this._refs.search);
		if(!persona) return;
		
		persona.classList.remove("ms-PeoplePicker-persona");
		
		persona.modifier = null;
		let menu = this._refs.menu.getMenuNode();
		//menu.insertBefore(persona, menu.firstChild)
		menu.insertAdjacentElement('afterbegin', persona);
		
	}
	
	__closest(element, selector, stopElement){
		
		if(element == null) return null;
		
		let el = element;
		do {
			if (el.matches(selector)) return el;
			if (stopElement != null && el === stopElement) return null;
			el = el.parentElement || el.parentNode;
			
		} while (el !== null && el.nodeType === 1);
		return null;
	}
	
	__getStaticAttributes(){
		let modifier = this.getAttribute('modifier');
		if(modifier && ['facePile'].indexOf(modifier) !== -1) this._modifier = modifier;
	}

	static get observedAttributes(){
		return ['people'];
	}
	
	attributeChangedCallback( attr, oldValue, newValue ){
		if(oldValue === newValue || newValue === this[attr]) return;
		this[attr] = newValue;
	}
	
}
window.customElements.define( 'fabric-people-picker', FabricPeoplePicker );

// Set styles
(function (w,d) { 

let style = d.createElement('STYLE');
style.textContent = `fabric-people-picker, fabric-people-picker fabric-contextual-menu { display: block, position: relative }
.ms-PeoplePicker{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;color:#333;font-size:14px;background-color:#fff;margin-bottom:10px}
.ms-PeoplePicker-searchBox{border-bottom:1px solid #c8c8c8;cursor:text;-ms-flex-flow:row wrap;flex-flow:row wrap;display:-ms-flexbox;display:flex;-ms-flex-align:stretch;align-items:stretch}
.ms-PeoplePicker-searchBox:hover{border-color:#767676}
.ms-PeoplePicker-searchBox.is-active,.ms-PeoplePicker-searchBox:focus{border-color:#0078d7}
@media screen and (-ms-high-contrast:active){.ms-PeoplePicker-searchBox:focus,.ms-PeoplePicker-searchBox:hover{border-color:#1aebff}
}
@media screen and (-ms-high-contrast:black-on-white){.ms-PeoplePicker-searchBox:focus,.ms-PeoplePicker-searchBox:hover{border-color:#37006e}
}
.ms-PeoplePicker-searchBox::-webkit-input-placeholder{color:#666}
.ms-PeoplePicker-searchBox:-moz-placeholder,.ms-PeoplePicker-searchBox::-moz-placeholder{color:#666}
.ms-PeoplePicker-searchBox:-ms-input-placeholder{color:#666}
.ms-PeoplePicker-searchBox .ms-PeoplePicker-textField .ms-TextField--underlined{border:0 !important; margin-bottom: 0 !important }
.ms-PeoplePicker-searchBox .ms-PeoplePicker-textField {margin-bottom:0;display:inline-block;width:100%;-ms-flex:1;flex:1}
.ms-PeoplePicker-searchBox .ms-PeoplePicker-textField .ms-TextField-field{min-height:40px;border:0}
fabric-people-picker fabric-contextual-menu .ms-ContextualMenu {width: 100%; max-width: 100%; padding-bottom: 10px; }
fabric-people-picker fabric-contextual-menu fabric-persona{cursor:pointer; display: block;margin: 10px 0 0 10px;}
.ms-PeoplePicker-persona.has-error .ms-Persona-primaryText{color:#a80000}
.ms-PeoplePicker-personaRemove{background:none;border:0;cursor:pointer;background-color:#f4f4f4;color:#666;display:inline-block;text-align:center;height:32px;width:32px}
.ms-PeoplePicker-personaRemove:hover{background-color:#eaeaea;color:#333;cursor:pointer}
.ms-PeoplePicker-personaRemove:focus{background-color:#eaeaea;color:#333;border:1px solid #0078d7;outline:none}
.ms-PeoplePicker-results{background-color:#fff;margin-bottom:-1px;width:100%;padding-left:0;box-sizing:border-box}
.ms-PeoplePicker.is-active222 .ms-PeoplePicker-results{display:block;opacity:1}
.ms-PeoplePicker-resultGroup{border-top:1px solid #eaeaea}
.ms-PeoplePicker-resultGroup:first-child{border-top:0}
.ms-PeoplePicker-resultGroupTitle{color:#0078d7;font-weight:300;font-size:12px;padding-top:8px;padding-bottom:8px;text-transform:uppercase;padding-left:16px}
.ms-PeoplePicker-resultList{box-sizing:border-box;margin:0;padding:0;box-shadow:none;margin-bottom:-1px;list-style-type:none}
.ms-PeoplePicker-result{position:relative;margin-top:8px;margin-bottom:8px;padding-left:16px;cursor:pointer;outline:0}
.ms-PeoplePicker-result:focus,.ms-PeoplePicker-result:hover{background-color:#eaeaea}
.ms-PeoplePicker-result:focus{box-shadow:inset 0 0 0 1px #0078d7}
.ms-PeoplePicker-result.is-selected{background-color:#b3d6f2}
.ms-PeoplePicker-result.is-selected .ms-PeoplePicker-resultAction:active,.ms-PeoplePicker-result.is-selected .ms-PeoplePicker-resultAction:hover{background-color:#69afe5}
.ms-PeoplePicker-peopleListBtn,.ms-PeoplePicker-resultBtn{cursor:pointer;position:relative;box-sizing:border-box;height:34px;width:100%;background:none;border:0;text-align:left;margin:0 0 10px;padding:0 0 0 9px}
@media (min-width:480px){.ms-PeoplePicker-peopleListBtn,.ms-PeoplePicker-resultBtn{height:48px}
}
.ms-PeoplePicker-peopleListBtn:hover,.ms-PeoplePicker-resultBtn:hover{background-color:#eaeaea;outline:1px solid transparent}
.ms-PeoplePicker-peopleListBtn:focus,.ms-PeoplePicker-resultBtn:focus{outline:1}
.ms-PeoplePicker-peopleListBtn.ms-PeoplePicker-resultBtn--compact,.ms-PeoplePicker-resultBtn.ms-PeoplePicker-resultBtn--compact{height:32px}
.ms-PeoplePicker-peopleListBtn{margin-bottom:0;padding:0}
.ms-PeoplePicker-peopleListBtn:hover{background-color:transparent}
.ms-PeoplePicker-resultAction{background:none;border:0;cursor:pointer;display:block;height:100%;transition:background-color .367s cubic-bezier(.1,.9,.2,1);position:absolute;right:0;top:0;width:40px;text-align:center}
.ms-PeoplePicker-resultAction .ms-Icon{color:#666;font-size:15px}
.ms-PeoplePicker-resultAction:hover{background-color:#c8c8c8;outline:1px solid transparent}
.ms-PeoplePicker-resultAction:active{background-color:#a6a6a6}
.ms-PeoplePicker-resultAdditionalContent{display:none}
.ms-PeoplePicker-result.is-expanded{background-color:#f4f4f4;margin-bottom:11px}
.ms-PeoplePicker-result.is-expanded .ms-PeoplePicker-resultAction .ms-Icon{transform:rotate(180deg)}
.ms-PeoplePicker-result.is-expanded .ms-PeoplePicker-resultAdditionalContent{display:block}
.ms-PeoplePicker-searchMore{background:none;border:0;cursor:pointer;height:40px;position:relative;width:100%}
.ms-PeoplePicker-searchMore:hover{background-color:#f4f4f4}
.ms-PeoplePicker-searchMoreIcon{font-size:21px;height:40px;left:16px;line-height:40px;position:absolute;text-align:center;top:0;width:40px}
.ms-PeoplePicker-searchMoreText{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;height:40px;left:64px;line-height:40px;position:absolute;top:0}
.ms-PeoplePicker-results.ms-PeoplePicker-results--compact .ms-PeoplePicker-resultAction{height:32px;width:32px}
.ms-PeoplePicker-results.ms-PeoplePicker-results--compact .ms-PeoplePicker-resultGroups{max-height:209px}
.ms-PeoplePicker.ms-PeoplePicker--facePile.is-searching .ms-PeoplePicker-results{border-bottom:0;padding:20px 0 0}
.ms-PeoplePicker.ms-PeoplePicker--facePile.is-searching .ms-PeoplePicker-peopleListHeader{display:none}
.ms-PeoplePicker.ms-PeoplePicker--facePile .ms-PersonaCard{display:none;position:absolute;height:200px}
.ms-PeoplePicker.ms-PeoplePicker--facePile .ms-PersonaCard.is-active{display:block}
.ms-PeoplePicker.ms-PeoplePicker--facePile .ms-Persona.ms-Persona--selectable{padding:0}
.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile{position:relative;border:0;box-shadow:none;margin:0;max-width:100%;border-bottom:1px solid #eaeaea}
@media (max-width:479px){.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-Persona-placeholder,.ms-PeoplePicker-selectedPeople .ms-Persona-placeholder{font-size:28px;top:6px}
.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-Persona-initials,.ms-PeoplePicker-selectedPeople .ms-Persona-initials{font-size:12px;line-height:32px}
.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-Persona-presence,.ms-PeoplePicker-selectedPeople .ms-Persona-presence{left:19px}
.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-Persona-details,.ms-PeoplePicker-selectedPeople .ms-Persona-details{padding-left:8px}
.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-Persona-primaryText,.ms-PeoplePicker-selectedPeople .ms-Persona-primaryText{font-size:14px;padding-top:3px}
.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-Persona-secondaryText,.ms-PeoplePicker-selectedPeople .ms-Persona-secondaryText{display:none}
}
@media (min-width:480px){.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-Persona .ms-Persona-secondaryText,.ms-PeoplePicker-selectedPeople .ms-Persona .ms-Persona-secondaryText{display:block}
}
@media (min-width:480px){.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-PeoplePicker-peopleListBtn,.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-PeoplePicker-resultAction,.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-PeoplePicker-resultBtn,.ms-PeoplePicker-selectedPeople .ms-PeoplePicker-peopleListBtn,.ms-PeoplePicker-selectedPeople .ms-PeoplePicker-resultAction,.ms-PeoplePicker-selectedPeople .ms-PeoplePicker-resultBtn{height:40px}
}
.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-PeoplePicker-selected,.ms-PeoplePicker-selectedPeople .ms-PeoplePicker-selected{margin-bottom:20px;display:none}
.ms-PeoplePicker-results.ms-PeoplePicker-results--facePile .ms-PeoplePicker-selected.is-active,.ms-PeoplePicker-selectedPeople .ms-PeoplePicker-selected.is-active{display:block}
.ms-PeoplePicker-peopleListHeader,.ms-PeoplePicker-selectedHeader{color:#0078d7;font-size:12px;font-weight:400;height:50px;line-height:50px}
.ms-PeoplePicker-peopleList,.ms-PeoplePicker-selectedPeople{box-sizing:border-box;margin:0;padding:0;box-shadow:none;list-style:none}
.ms-PeoplePicker-selectedPerson{margin-bottom:8px;position:relative}
.ms-PeoplePicker-peopleListItem{margin-bottom:6px;position:relative}
.ms-PeoplePicker .no-people {display: block; padding: 10px 10px 0px 10px}`;

d.head.appendChild(style);
})(window, document);