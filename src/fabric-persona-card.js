class FabricPersonaCard extends HTMLElement {
	
	constructor(){
		super();

		// this._modifier = null;
		
		this._refs = {};
        this._actions = [

            {   id: 'chat', 
                icon: 'Chat', 
                expandable: false, 
                lines: [
                    {
                        label: 'Chat',
                        href: '#',
                        value: 'Start Call'
                    }
                ]
            },

            {   id: 'phone', 
                icon: 'Phone', 
                expandable: true, 
                lines: [
                    {
                        label: 'Details'
                    },
                    {
                        label: 'Personal',
                        value: '555.206.2443'
                    },
                    {
                        label: 'Work',
                        value: '555.929.8240'
                    }
                ]
            }

        ];
		
		this._boundOnActionClick = this.__onActionClick.bind(this);
		this._boundOnExpanderClick = this.__onExpanderClick.bind(this);
		this._boundOnTab = this.__onTab.bind(this);
	
	}
	
	get image() { return (!this._refs.persona)?null:this._refs.persona.image; }
	set image( value ) { if(this._refs.persona) this._refs.persona.setAttribute('image', value) }
	
	get size() { return (!this._refs.persona)?null:this._refs.persona.size; }
	set size( value ) { if(this._refs.persona) this._refs.persona.setAttribute('size', value) }
	
	get presence() { return (!this._refs.persona)?null:this._refs.persona.presence; }
	set presence( value ) { if(this._refs.persona) this._refs.persona.setAttribute('presence', value)}
	
	get primarytext() { return (!this._refs.persona)?null:this._refs.persona.primarytext; }
	set primarytext( value ) { if(this._refs.persona) { this._refs.persona.setAttribute('primarytext', value); this._refs.persona.primarytext = value   } }
	
	get secondarytext() { return (!this._refs.persona)?null:this._refs.persona.secondarytext; }
	set secondarytext( value ) { if(this._refs.persona) this._refs.persona.setAttribute('secondarytext', value) }
	
	get tertiarytext() { return (!this._refs.persona)?null:this._refs.persona.tertiarytext; }
	set tertiarytext( value ) { if(this._refs.persona) this._refs.persona.setAttribute('tertiarytext', value) }
	
	get optionaltext() { return (!this._refs.persona)?null:this._refs.persona.optionaltext; }
	set optionaltext( value ) { if(this._refs.persona) this._refs.persona.setAttribute('optionaltext', value) }

	get actions() { return this._actions; }
	set actions( value ) { if(Array.isArray(value)) { this._actions = value } else { this._actions.push(value) } }
	
	connectedCallback(){
		
		this.__setupUI();
		this.__setInheritedAttributes();
		
		this.__setProperties();
		this.__addListeners();

	}
	
	disconnectedCallback(){
		this.__removeListeners();
	}
		
	__setupUI(){
	
		let modifier = (this._modifier)?'ms-PersonaCard--'+this._modifier:'';
	
		let markup = `<div class="ms-PersonaCard ${modifier}">
		  <div class="ms-PersonaCard-persona">
			<fabric-persona></fabric-persona>
		  </div>
		  <ul class="ms-PersonaCard-actions"></ul>
		  <div class="ms-PersonaCard-actionDetailBox">
		  </div>
		</div>`;

		this.innerHTML = markup;

		// Update references
		this._refs = {
			container: this.querySelector('.ms-PersonaCard'),
			persona: this.querySelector('fabric-persona'),
			actions: this.querySelector(".ms-PersonaCard-actions"),
            actionbox: this.querySelector(".ms-PersonaCard-actionDetailBox"),
			expander: this.querySelector(".ms-PersonaCard-detailExpander")
		}
		
		const activeElement = this._refs.container.querySelector(".ms-PersonaCard-action.is-active");
		if(activeElement) {
            const activeId = activeElement.getAttribute("data-action-id");
		    this.__setDetail(activeId);
        }
		
	}
	
	__setInheritedAttributes(){
		
		// In case the FabricPersona properties are set via attributes, they have to be synced
		let inheritedAttributes = (FabricPersona)?FabricPersona.observedAttributes:[];
		if(this._refs.persona && inheritedAttributes.length > 0){
		
			inheritedAttributes.forEach( attr => {
				if(this.hasAttribute(attr)) this[attr] = this.getAttribute(attr);
			});
		
		}
		
	}
	
	__setProperties(property){
	
		if(!this._refs || !this._refs.container) return;

        if(property == null || property === 'actions') {
            this.__setActions();
        }
		
	}
	
	__addListeners(){
		this._refs.actions.addEventListener("click", this._boundOnActionClick, false);
		this._refs.actionbox.addEventListener("click", this._boundOnExpanderClick, false);
		this._refs.container.addEventListener("keydown", this._boundOnTab, false);
	}
	
	
	__removeListeners(){
		this._actions.removeEventListener("click", this._boundOnActionClick);
		this._expander.removeEventListener("click", this._boundOnExpanderClick);
		this._container.removeEventListener("keydown", this._boundOnTab);
	}
	
	__onTab(event) {
		if (event.keyCode === 9 && event.target.classList.contains("ms-PersonaCard-action")) {
			this._onActionClick(event);
		}
	}
	
	__onExpanderClick(event) {

        if(event.target && event.target.classList.contains('ms-PersonaCard-detailExpander')){

            event.target.parentElement.classList.toggle("is-collapsed");
            event.target.classList.toggle("bottom");

        }

		// const parentHeight= parent.clientHeight;
		//this._animateDetail(parentHeight);
	}
	
	__onActionClick(event) {
		const actionId = event.target.getAttribute("data-action-id");
		if (actionId && event.target.className.indexOf("is-active") === -1) {
			this.__setAction(event.target);
			this.__setDetail(actionId);
		}
	}
	
	__setAction(target) {
		const activeElement = this._refs.container.querySelector(".ms-PersonaCard-action.is-active");
		if(activeElement) activeElement.classList.remove("is-active");
		target.classList.add("is-active");
	}
	
	__setDetail(activeId) {
		const selector = ".ms-PersonaCard-details[data-detail-id='" + activeId + "']";
		const lastDetail = this._refs.container.querySelector(".ms-PersonaCard-details.is-active");
		const activeDetail = this._refs.container.querySelector(selector);

		if (lastDetail) {
			lastDetail.classList.remove("is-active");
		}

		activeDetail.classList.add("is-active");
	}
	
    __setActions(){

        // Get active Tab
        let activeTab = this._refs.actions.querySelector('.ms-PersonaCard-action.is-active');
        let activeId = (activeTab)?activeTab.dataset.detailId:null;

        // Update UI
        if(this._refs.actions){

            this._refs.actions.innerHTML = '';

            let container = document.createElement('UL');

            if(this._actions && this._actions.length > 0){

                this._actions.forEach( (action, index) => {

                    if(!action.id || !action.icon) return;

                    let item = document.createElement('LI');
                    item.dataset.actionId = action.id;
                    item.classList.add('ms-PersonaCard-action');
                    item.tabIndex = 1 + index;

                    let icon = document.createElement('I');
                    icon.className = "ms-Icon ms-Icon--" + action.icon;
                    item.appendChild(icon);

                    container.appendChild(item)

                });
            }

            this._refs.actions.innerHTML = container.innerHTML;

        }

        if(this._refs.actionbox){

            this._refs.actionbox.innerHTML = '';
            let container = document.createElement('DIV');

            if(this._actions && this._actions.length > 0){

                this._actions.forEach( (action, index) => {

                    if(!action.id || !action.icon) return;

                    let item = document.createElement('DIV');
                    item.dataset.detailId = action.id;
                    item.className = "ms-PersonaCard-details";

                    if(action.expandable){
                        item.innerHTML = '<div class="ms-PersonaCard-detailExpander chevron"></div>';
                    }

                    if(action.lines){
                        action.lines.forEach( line => {

                            console.log('line', line)

                            let lineItem = document.createElement('DIV');
                            lineItem.className = "ms-PersonaCard-detailLine";
                            
                            let label = document.createElement('span');
                            label.className = "ms-PersonaCard-detailLabel";
                            label.textContent = (line.value)?line.label + ':': line.label;
                            lineItem.appendChild(label);

                            if(line.value){
                                if(line.href) {
                                    let link = document.createElement('a');
                                    link.href = line.href;
                                    link.textContent = line.value;
                                    lineItem.appendChild(link);
                                } else {
                                    let val = document.createElement('span');
                                    val.textContent = line.value;
                                    lineItem.appendChild(val)
                                }
                            }

                            item.appendChild(lineItem)
                        });
                    }

                    container.appendChild(item);

                });
            }

            this._refs.actionbox.innerHTML = container.innerHTML;

        }

        // Activate tab
        // console.log('activate tab', activeId);
        if(activeId){
            let tab = this._refs.container.querySelector('.ms-PersonaCard-action[data-action-id="' + activeId + '"]');
            if(tab)tab.classList.add('is-active');
            this.__setDetail(activeId);
        } else {
            // Use the first tab
            let first = this._refs.container.querySelector('.ms-PersonaCard-action');
            if(first) {
                this.__setAction(first);
                this.__setDetail(first.dataset.actionId);
            }
        }

    }


	static get observedAttributes(){
		let observed = [];
		
		// Observed attributes from fabric-persona
		observed = observed.concat((FabricPersona)?FabricPersona.observedAttributes:[])
		
		return observed;
	}
	
	attributeChangedCallback( attr, oldValue, newValue ){
		if(oldValue === newValue || newValue === this[attr]) return;
		this[attr] = newValue;
	}
	
}
window.customElements.define( 'fabric-persona-card', FabricPersonaCard );

// Set styles
(function (w,d) { 

let style = d.createElement('STYLE');
style.textContent = `fabric-persona-card .is-hidden {display:none}
.ms-PersonaCard{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;animation-name:fadeIn,slideUpIn10;-webkit-animation-duration:.167s;-moz-animation-duration:.167s;-ms-animation-duration:.167s;-o-animation-duration:.167s;animation-timing-function:cubic-bezier(.1,.25,.75,.9);animation-fill-mode:both;color:#333;font-size:14px;font-weight:400;bottom:0;left:0;position:fixed;right:0;outline:1px solid transparent}
.ms-PersonaCard-persona{background-color:#f4f4f4;padding-top:12px;padding-bottom:12px;padding-left:20px}
.ms-PersonaCard-actions{box-sizing:border-box;position:relative;list-style:none;margin:0;padding:0 10px;background-color:#fff;height:48px}
.ms-PersonaCard-actions:before{content:"";position:absolute;top:47px;left:0;width:100%;border-top:1px solid #c8c8c8}
.ms-PersonaCard-action,.ms-PersonaCard-overflow{display:inline-block;cursor:pointer;font-size:16px;height:48px;line-height:48px;padding:0 10px;color:#666;outline:transparent;position:relative;box-sizing:border-box}
.ms-PersonaCard-action:hover,.ms-PersonaCard-overflow:hover{color:#212121}
.ms-PersonaCard-action:active,.ms-PersonaCard-overflow:active{color:#0078d7}
.ms-PersonaCard-action:before,.ms-PersonaCard-overflow:before{content:"";position:absolute;width:100%;height:100%;background-color:transparent;top:0;left:0;z-index:100}
.ms-PersonaCard-action.is-active,.ms-PersonaCard-overflow.is-active{color:#0078d7}
.ms-PersonaCard-action.is-active:after,.ms-PersonaCard-overflow.is-active:after{box-sizing:border-box;transform:rotate(45deg);content:"";width:10px;height:10px;border:1px solid #c8c8c8;background-color:#fff;position:absolute;border-right:0;border-bottom:0;bottom:-4px;left:13px}
.ms-PersonaCard-overflow{font-size:14px;color:#333;float:right;margin-top:-1px}
.ms-PersonaCard-overflow:hover{color:#0078d7}
.ms-PersonaCard-orgChart{position:absolute;right:12px;top:-95px}
.ms-PersonaCard-actionDetailBox{min-height:48px;overflow-y:auto;overflow-x:hidden;background-color:#fff}
.ms-PersonaCard-details{display:none;width:100%;margin:0;max-height:300px;min-height:48px;color:#666;padding:9px 20px;box-sizing:border-box}
.ms-PersonaCard-details.is-active{display:block}
.ms-PersonaCard-details.is-collapsed{height:30px;overflow:hidden}
.ms-PersonaCard-details.is-collapsed .ms-PersonaCard-detailExpander:after{c2ontent:"▽";}
.ms-PersonaCard-details[data-detail-id=org]{max-height:300px}
.ms-PersonaCard-detailExpander{color:#333;cursor:pointer;font-size:16px;height:30px;line-height:30px;margin-top:2px;position:absolute;right:10px;text-align:center;width:30px}
.ms-PersonaCard-detailExpander:after{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-style:normal;font-weight:400;speak:none;c2ontent:"△";}
.ms-PersonaCard-detailLine{color:#333;line-height:30px}
.ms-PersonaCard-detailLabel{color:#666; margin-right: 10px}
.ms-PersonaCard-action.ms-PersonaCard-orgChart:after{display:none}
@media (min-width:480px){.ms-PersonaCard{box-shadow:0 0 5px 0 rgba(0,0,0,.4);max-width:360px;position:relative}
.ms-ContextualHost .ms-PersonaCard{box-shadow:none}
}
fabric-persona-card .chevron::before {
	border-style: solid;
	border-width: 0.15em 0.15em 0 0;
	content: '';
	display: inline-block;
	height: 0.45em;
	left: 0.25em;
	position: relative;
	top: 0.25em;
	transform: rotate(-45deg);
	vertical-align: top;
	width: 0.45em;
}
fabric-persona-card .chevron.right:before { left: 0; transform: rotate(45deg); }
fabric-persona-card .chevron.bottom:before { top: 0; transform: rotate(135deg); }
fabric-persona-card .chevron.left:before { left: 0.25em; transform: rotate(-135deg); }

fabric-persona-card fabric-persona .ms-Persona-actionIcon {display:none}

`;

d.head.appendChild(style);
})(window, document);