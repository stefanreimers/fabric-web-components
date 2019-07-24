class FabricPersona extends HTMLElement {
	
	constructor(){
		super();
		
		this._modifier = null;

		this._image = null;
		this._size = null;
		this._presence = null;
		
		this._primarytext = null;
		this._secondarytext = null;
		this._tertiarytext = null;
		this._optionaltext = null;
		
		this._action = null;
		
		this._nodes = {}
	}

	get modifier() { return this._modifier; }
	set modifier(value) { 
		let old = this._modifier;
		if( ( ['facePile', 'token', 'darkText', 'selectable', 'readonly'].indexOf(value) !== -1 || value == null) && value != this._modifier) this._modifier = value;
		
		if(this._nodes.container) this._nodes.container.classList.replace( 'ms-Persona--'+old, 'ms-Persona--'+this._modifier);

	}

	get image() { return this._image; }
	set image( value ) { if(value === this._image) return; this._image = value; this.setProperties('image'); }
	
	get size() { return this._size; }
	set size( value ) { if(value === this._size || ['tiny', 'xs', 'sm', 'lg', 'xl'].indexOf(value) === -1 ) return; this._size = value; this.setProperties('size'); }
	
	get presence() { return this._presence; }
	set presence( value ) { if(value === this._presence || ['available', 'away', 'blocked', 'busy', 'dnd', 'offline'].indexOf(value) === -1) return; this._presence = value; this.setProperties('presence'); }
	
	get primarytext() { return this._primarytext; }
	set primarytext( value ) { if(value === this._primarytext) return; this._primarytext = value; this.setProperties('primaryText'); }
	
	get secondarytext() { return this._secondarytext; }
	set secondarytext( value ) { if(value === this._secondarytext) return; this._secondarytext = value; this.setProperties('secondaryText'); }
	
	get tertiarytext() { return this._tertiarytext; }
	set tertiarytext( value ) { if(value === this._tertiarytext) return; this._tertiarytext = value; this.setProperties('tertiaryText'); }
	
	get optionaltext() { return this._optionaltext; }
	set optionaltext( value ) { if(value === this._optionaltext) return; this._optionaltext = value; this.setProperties('metaText'); }

	get action() { return this._action; }
	set action( value ) { if(value === this._action) return; this._action = value; this.setProperties('actionicon'); }
	
	connectedCallback(){
		this.getStaticAttributes();
		this.setupUI();
		this.setProperties();
	}
	
	setupUI(){

		// Define static properties
		
		//@TODO: multiple modifiers allowed
		let modifier = (this._modifier)?'ms-Persona--'+this._modifier:'';

		let markup = `<div class="ms-Persona ${modifier}">
		  <div class="ms-Persona-imageArea">
			  <div class="ms-Persona-initials"></div>
			  <img class="ms-Persona-image" src="">
		  </div>
		  <div class="ms-Persona-presence">
			  <i class="ms-Persona-presenceIcon ms-Icon is-hidden"></i>
		  </div>
		  <div class="ms-Persona-details">
			  <div class="ms-Persona-primaryText"></div>
			  <div class="ms-Persona-secondaryText"></div>
			  <div class="ms-Persona-tertiaryText"></div>
			  <div class="ms-Persona-optionalText"></div>
		  </div>
		  <div class="ms-Persona-actionIcon">
			<i class="ms-Icon ms-Icon--Clear"></i>
		  </div>
		</div>`;
		
		this.innerHTML = markup;
		
		this._nodes = {
			container: this.querySelector('.ms-Persona'),
			image: this.querySelector('.ms-Persona-imageArea'),
			initials: this.querySelector('.ms-Persona-initials'),
			presence: this.querySelector('.ms-Persona-presence'),
			primaryText: this.querySelector('.ms-Persona-primaryText'),
			secondaryText:this.querySelector('.ms-Persona-secondaryText'),
			tertiaryText:this.querySelector('.ms-Persona-tertiaryText'),
			optionalText:this.querySelector('.ms-Persona-optionalText'),
			actionIcon:this.querySelector('.ms-Persona-actionIcon')
		}
	}
	
	setProperties(property){
		
		if(!this._nodes.container) return;
		
		if(property == null || property === 'image') {
			
			if(this._image){
				
				this._nodes.initials.textContent = '';
				this._nodes.image.src = this.image;
				
			} else {
				
				this._nodes.image.src = '';
				
				// Show initials
				let colors = ['blueLight','blue','blueDark','teal','greenLight','green','greenDark','magentaLight','magenta','purpleLight','purple','black','orange','red','redDark']
				let initial = (this._primarytext)?this.primarytext.substr(0,1).toUpperCase():'?';
				this._nodes.initials.textContent = initial;
				this._nodes.initials.dataset.color = colors[(Math.max(65, String(initial).charCodeAt(0)) - 65)%colors.length]
				
			}
			
		}
		
		if(property == null || property === 'size') {
			this._nodes.container.dataset.size = this.size || '';
		}
		if(property == null || property === 'presence') {
			this._nodes.container.dataset.presence = this.presence || '';
		}
		
		
		
		let texts = ['primaryText', 'secondaryText', 'tertiaryText', 'optionalText'];
				
		if(texts.indexOf(property) !== -1) {
			let node = this._nodes[property];
			if(node) {
				node.textContent = this[property.toLowerCase()] || '';
				this.setProperties('image')
			}
		} else if(property == null){
			texts.forEach( text => {
				this._nodes[text].textContent = this[text.toLowerCase()] || '';
				this.setProperties('image')
			});
		}

	}
	
	getStaticAttributes(){
		let modifier = this.getAttribute('modifier');
		if(modifier) this._modifier = modifier;
	}
	
	static get observedAttributes(){
		return ['image', 'size', 'presence', 'primarytext', 'secondarytext', 'tertiarytext', 'optionaltext', 'action'];
	}
	
	attributeChangedCallback( attr, oldValue, newValue ){
		if(oldValue === newValue || newValue === this[attr]) return;
		this[attr] = newValue;
	}
	
}
window.customElements.define( 'fabric-persona', FabricPersona );

// Set styles
(function (w,d) { 

let style = d.createElement('STYLE');
style.textContent = `fabric-persona .ms-Persona .ms-Persona-details > div:empty,
fabric-persona .ms-Persona .ms-Persona-initials:empty,
fabric-persona .ms-Persona-image[src=""],
fabric-persona .is-hidden {display:none}
.ms-Persona{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;box-sizing:border-box;margin:0;padding:0;box-shadow:none;color:#333;font-size:14px;font-weight:400;line-height:1;position:relative;width:100%;height:48px;display:table;table-layout:fixed;border-collapse:separate}
.ms-Persona .ms-ContextualHost{display:none}
.ms-Persona-imageArea{position:absolute;overflow:hidden;text-align:center;max-width:48px;height:48px;border-radius:50%;z-index:0;width:100%;top:0;left:0}
@media screen and (-ms-high-contrast:active){.ms-Persona-imageArea{border:1px solid #fff}}
@media screen and (-ms-high-contrast:black-on-white){.ms-Persona-imageArea{border:1px solid #000}}
.ms-Persona-placeholder{color:#fff;position:absolute;right:0;left:0;font-size:47px;top:9px;z-index:5}
.ms-Persona-initials{color:#fff;font-size:17px;font-weight:100;line-height:48px}
.ms-Persona-image{position:absolute;top:0;left:0;height:48px;z-index:10;width:100%}
.ms-Persona-presence{background-color:#7fba00;position:absolute;height:12px;width:12px;border-radius:50%;top:auto;left:34px;bottom:-1px;border:2px solid #fff;text-align:center}
@media screen and (-ms-high-contrast:active){.ms-Persona-presence{border-color:#000;box-shadow:inset 0 0 0 1px #1aebff;color:#000;background-color:#fff}}
@media screen and (-ms-high-contrast:black-on-white){.ms-Persona-presence{border-color:#fff;box-shadow:inset 0 0 0 1px #37006e;color:#fff;background-color:#000}}
.ms-Persona-presenceIcon{color:#fff;font-size:8px;line-height:12px;vertical-align:top}
.ms-Persona-details{padding:0 12px;vertical-align:middle;overflow:hidden;text-align:left;padding-left:60px;display:table-cell;width:100%}
.ms-Persona-optionalText,.ms-Persona-primaryText,.ms-Persona-secondaryText,.ms-Persona-tertiaryText{display:block;white-space:nowrap;width:100%;overflow:hidden;text-overflow:ellipsis}
.ms-Persona-primaryText{color:#333;font-weight:400;font-size:17px;margin-top:-3px;line-height:1.4}
.ms-Persona-optionalText,.ms-Persona-secondaryText,.ms-Persona-tertiaryText{color:#666;font-weight:400;font-size:12px;white-space:nowrap;line-height:1.3}
.ms-Persona-secondaryText{padding-top:3px}
.ms-Persona-optionalText,.ms-Persona-tertiaryText{padding-top:5px;display:none}
.ms-Persona[data-size=tiny]{height:30px;display:inline-block}
.ms-Persona[data-size=tiny] .ms-Persona-imageArea{overflow:visible;display:none}
.ms-Persona[data-size=tiny] .ms-Persona-presence{right:auto;top:10px;left:0;border:0}
@media screen and (-ms-high-contrast:active){.ms-Persona[data-size=tiny] .ms-Persona-presence{top:9px;border:1px solid #fff}}
@media screen and (-ms-high-contrast:black-on-white){.ms-Persona[data-size=tiny] .ms-Persona-presence{border:1px solid #000}}
.ms-Persona[data-size=tiny] .ms-Persona-details{padding-left:20px}
.ms-Persona[data-size=tiny] .ms-Persona-primaryText{font-size:14px;padding-top:9px}
.ms-Persona[data-size=tiny] .ms-Persona-secondaryText{display:none}
.ms-Persona[data-size=tiny].ms-Persona--readonly{padding:0;background-color:transparent}
.ms-Persona[data-size=tiny].ms-Persona--readonly .ms-Persona-primaryText:after{content:";"}
.ms-Persona.ms-Persona--facePile,.ms-Persona.ms-Persona--token,.ms-Persona[data-size=xs]{height:32px}
.ms-Persona.ms-Persona--facePile .ms-Persona-image,.ms-Persona.ms-Persona--facePile .ms-Persona-imageArea,.ms-Persona.ms-Persona--token .ms-Persona-image,.ms-Persona.ms-Persona--token .ms-Persona-imageArea,.ms-Persona[data-size=xs] .ms-Persona-image,.ms-Persona[data-size=xs] .ms-Persona-imageArea{max-width:32px;height:32px}
.ms-Persona.ms-Persona--facePile .ms-Persona-placeholder,.ms-Persona.ms-Persona--token .ms-Persona-placeholder,.ms-Persona[data-size=xs] .ms-Persona-placeholder{font-size:28px;top:6px}
.ms-Persona.ms-Persona--facePile .ms-Persona-initials,.ms-Persona.ms-Persona--token .ms-Persona-initials,.ms-Persona[data-size=xs] .ms-Persona-initials{font-size:12px;line-height:32px}
.ms-Persona.ms-Persona--facePile .ms-Persona-presence,.ms-Persona.ms-Persona--token .ms-Persona-presence,.ms-Persona[data-size=xs] .ms-Persona-presence{left:19px}
.ms-Persona.ms-Persona--facePile .ms-Persona-details,.ms-Persona.ms-Persona--token .ms-Persona-details,.ms-Persona[data-size=xs] .ms-Persona-details{padding-left:40px}
.ms-Persona.ms-Persona--facePile .ms-Persona-primaryText,.ms-Persona.ms-Persona--token .ms-Persona-primaryText,.ms-Persona[data-size=xs] .ms-Persona-primaryText{font-size:14px;padding-top:3px}
.ms-Persona.ms-Persona--facePile .ms-Persona-secondaryText,.ms-Persona.ms-Persona--token .ms-Persona-secondaryText,.ms-Persona[data-size=xs] .ms-Persona-secondaryText{display:none}
.ms-Persona[data-size=sm]{height:40px}
.ms-Persona[data-size=sm] .ms-Persona-image,.ms-Persona[data-size=sm] .ms-Persona-imageArea{max-width:40px;height:40px}
.ms-Persona[data-size=sm] .ms-Persona-placeholder{font-size:38px;top:5px}
.ms-Persona[data-size=sm] .ms-Persona-initials{font-size:14px;line-height:40px}
.ms-Persona[data-size=sm] .ms-Persona-presence{left:27px}
.ms-Persona[data-size=sm] .ms-Persona-details{padding-left:48px}
.ms-Persona[data-size=sm] .ms-Persona-primaryText{font-size:14px}
.ms-Persona[data-size=sm] .ms-Persona-primaryText,.ms-Persona[data-size=sm] .ms-Persona-secondaryText{padding-top:1px}
.ms-Persona[data-size=lg]{height:72px}
.ms-Persona[data-size=lg] .ms-Persona-image,.ms-Persona[data-size=lg] .ms-Persona-imageArea{max-width:72px;height:72px}
.ms-Persona[data-size=lg] .ms-Persona-placeholder{font-size:67px;top:10px}
.ms-Persona[data-size=lg] .ms-Persona-initials{font-size:28px;line-height:72px}
.ms-Persona[data-size=lg] .ms-Persona-presence{left:49px;height:20px;width:20px;border-width:3px}
.ms-Persona[data-size=lg] .ms-Persona-presenceIcon{line-height:20px;font-size:14px}
.ms-Persona[data-size=lg] .ms-Persona-details{padding-left:84px}
.ms-Persona[data-size=lg] .ms-Persona-secondaryText{padding-top:3px}
.ms-Persona[data-size=lg] .ms-Persona-tertiaryText{padding-top:5px;display:block}
.ms-Persona[data-size=xl]{height:100px}
.ms-Persona[data-size=xl] .ms-Persona-image,.ms-Persona[data-size=xl] .ms-Persona-imageArea{max-width:100px;height:100px}
.ms-Persona[data-size=xl] .ms-Persona-placeholder{font-size:95px;top:12px}
.ms-Persona[data-size=xl] .ms-Persona-initials{font-size:42px;line-height:100px}
.ms-Persona[data-size=xl] .ms-Persona-presence{height:28px;width:28px;left:71px;border-width:4px}
.ms-Persona[data-size=xl] .ms-Persona-presenceIcon{line-height:28px;font-size:21px;position:relative;top:1px}
.ms-Persona[data-size=xl] .ms-Persona-details{padding-left:120px}
.ms-Persona[data-size=xl] .ms-Persona-primaryText{font-size:21px;font-weight:300;margin-top:0}
.ms-Persona[data-size=xl] .ms-Persona-secondaryText{padding-top:2px}
.ms-Persona[data-size=xl] .ms-Persona-optionalText,.ms-Persona[data-size=xl] .ms-Persona-tertiaryText{padding-top:5px;display:block}
.ms-Persona.ms-Persona--darkText .ms-Persona-primaryText{color:#212121}
.ms-Persona.ms-Persona--darkText .ms-Persona-optionalText,.ms-Persona.ms-Persona--darkText .ms-Persona-secondaryText,.ms-Persona.ms-Persona--darkText .ms-Persona-tertiaryText{color:#333}
.ms-Persona.ms-Persona--selectable{cursor:pointer;padding:0 10px}
.ms-Persona.ms-Persona--selectable:not([data-size=xl]):focus,.ms-Persona.ms-Persona--selectable:not([data-size=xl]):hover{background-color:#deecf9;outline:1px solid transparent}
.ms-Persona[data-presence=available] .ms-Persona-presence{background-color:#7fba00}
.ms-Persona[data-presence=away] .ms-Persona-presence{background-color:#fcd116}
.ms-Persona[data-presence=away] .ms-Persona-presenceIcon{position:relative;left:1px}
.ms-Persona[data-presence=blocked] .ms-Persona-presence{background-color:#fff}
.ms-Persona[data-presence=blocked] .ms-Persona-presence:before{content:"";width:100%;height:100%;position:absolute;top:0;left:0;box-shadow:inset 0 0 0 2px #d93b3b;border-radius:50%}
.ms-Persona[data-presence=blocked] .ms-Persona-presence:after{content:"";width:100%;height:2px;background-color:#d93b3b;transform:rotate(-45deg);position:absolute;top:5px;left:0}
.ms-Persona[data-presence=blocked][data-size=lg] .ms-Persona-presence:after{top:9px}
.ms-Persona[data-presence=blocked][data-size=xl] .ms-Persona-presence:after{top:13px}
.ms-Persona[data-presence=busy] .ms-Persona-presence{background-color:#d93b3b}
@media screen and (-ms-high-contrast:active){.ms-Persona[data-presence=busy] .ms-Persona-presence{background-color:#1aebff}}
@media screen and (-ms-high-contrast:black-on-white){.ms-Persona[data-presence=busy] .ms-Persona-presence{background-color:#37006e}}
.ms-Persona[data-presence=dnd] .ms-Persona-presence{background-color:#e81123}
.ms-Persona[data-presence=offline] .ms-Persona-presence{background-color:#93abbd}
@media screen and (-ms-high-contrast:active){.ms-Persona[data-presence=offline] .ms-Persona-presence{background-color:#000;box-shadow:inset 0 0 0 1px #fff}}
@media screen and (-ms-high-contrast:black-on-white){.ms-Persona[data-presence=offline] .ms-Persona-presence{background-color:#fff;box-shadow:inset 0 0 0 1px #000}}
.ms-Persona.ms-Persona--facePile{display:inline-block;width:auto}
.ms-Persona.ms-Persona--facePile:hover{cursor:pointer}
.ms-Persona.ms-Persona--facePile .ms-Persona-imageArea{position:relative;width:100%;min-width:32px}
.ms-Persona.ms-Persona--facePile .ms-Persona-initials{position:relative}
.ms-Persona.ms-Persona--facePile .ms-Persona-details,.ms-Persona.ms-Persona--facePile .ms-Persona-presence{display:none}
.ms-Persona.ms-Persona--token{display:-ms-inline-flexbox;display:inline-flex;width:auto;background-color:#f4f4f4;border-radius:20px;margin:4px}
.ms-Persona.ms-Persona--token:hover{cursor:pointer}
.ms-Persona.ms-Persona--token .ms-Persona-actionIcon{border-radius:20px;display:inline-block;width:32px;height:32px;padding:0;line-height:30px;transition:background-color .167s cubic-bezier(.1,.9,.2,1);text-align:center}
.ms-Persona.ms-Persona--token .ms-Persona-actionIcon:hover{background-color:#eaeaea}
.ms-Persona.ms-Persona--token .ms-Persona-imageArea{width:100%;min-width:32px}
.ms-Persona.ms-Persona--token .ms-Persona-details{height:30px;display:inline-block;width:auto;padding-right:8px}
.ms-Persona.ms-Persona--token .ms-Persona-primaryText{padding-top:0;line-height:34px}
.ms-Persona.ms-Persona--token .ms-Persona-initials{position:relative}
.ms-Persona-initials[data-color=blueLight]{background-color:#00bcf2}
.ms-Persona-initials[data-color=blue]{background-color:#0078d7}
.ms-Persona-initials[data-color=blueDark]{background-color:#002050}
.ms-Persona-initials[data-color=teal]{background-color:#008272}
.ms-Persona-initials[data-color=greenLight]{background-color:#bad80a}
.ms-Persona-initials[data-color=green]{background-color:#107c10}
.ms-Persona-initials[data-color=greenDark]{background-color:#004b1c}
.ms-Persona-initials[data-color=magentaLight]{background-color:#e3008c}
.ms-Persona-initials[data-color=magenta]{background-color:#b4009e}
.ms-Persona-initials[data-color=purpleLight]{background-color:#b4a0ff}
.ms-Persona-initials[data-color=purple]{background-color:#5c2d91}
.ms-Persona-initials[data-color=black]{background-color:#000}
.ms-Persona-initials[data-color=orange]{background-color:#d83b01}
.ms-Persona-initials[data-color=red]{background-color:#e81123}
.ms-Persona-initials[data-color=redDark]{background-color:#a80000}
.ms-Persona--token .ms-Icon--Clear {margin-top: 10px; background-image: url("data:image/svg+xml,%3C?xml version='1.0' encoding='UTF-8' standalone='no'?%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48.000001' height='48' width='48'%3E%3Cdefs/%3E%3Cg transform='translate(0,-1004.3622)'%3E%3Cg fill='rgb(51,51,51)' transform='translate(114.04091,527.99014)'%3E%3Crect style='stroke:none' width='4.0501809' height='63.832069' x='288.12283' y='385.56897' transform='matrix(0.70710678,0.70710678,-0.70710678,0.70710678,0,0)' /%3E%3Crect style='stroke:none' width='4.0501809' height='63.832069' x='415.45993' y='258.2319' transform='matrix(-0.70710678,0.70710678,0.70710678,0.70710678,0,0)' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");}
fabric-persona .ms-Icon {background-size: 12px 12px;height: 12px;width: 12px;display: inline-block}`
d.head.appendChild(style);


})(window, document);