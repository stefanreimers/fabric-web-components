//@credits https://github.com/OfficeDev/office-ui-fabric-react/blob/master/packages/office-ui-fabric-react/src/components/Slider/Slider.base.tsx

class FabricSlider extends HTMLElement {

  private _refs: { [index: string]: any };
  private _min: number;
  private _max: number;
  private _value: number;
  private _step: number;

  private _label: string;

  private _showValue: boolean;
  private _disabled: boolean;
  private _vertical: boolean;

  private _boundOnMouseMoveOrTouchMove: any;
  private _boundMouseUpOrTouchEnd: any;
  private _boundonMouseDownOrTouchStart: any;

  constructor() {
    super();
    this._refs = {};

    this._min = 0;
    this._max = 100;
    this._value = 0;
    this._step = 1;

    this._label = '';

    this._showValue = true;
    this._disabled = false;
    this._vertical = false;

  }

  get min() { return this._min }
  set min(value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._min === value) return; this._min = value; this.__setProperties('min'); }

  get max() { return this._max }
  set max(value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._max === value) return; this._max = value; this.__setProperties('max'); }

  get value() { return this._value }
  set value(value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._value === value) return; this._value = value; this.__setProperties('value'); }

  get step() { return this._step }
  set step(value) { value = (typeof value === 'number') ? value : parseFloat(value); if (isNaN(value) || this._step === value) return; this._step = value; this.__setProperties('step'); }

  get label() { return this._label; }
  set label(value) { if (this._label === value) return; this._label = value; this.__setProperties('label'); }

  get showvalue() { return this._showValue; }
  set showvalue(value) { if (this._showValue === !!value) return; this._showValue = !!value; this.__setProperties('showvalue'); }

  get disabled() { return this._disabled; }
  set disabled(value) { if (this._disabled === !!value) return; this._disabled = !!value; this.__setProperties('disabled'); }

  get vertical() { return this._vertical; }
  set vertical(value) { if (this._vertical === !!value) return; this._vertical = !!value; this.__setProperties('vertical'); }

  connectedCallback() {

    this._value = this._value || this._min;

    this.__setupUI();
    this.__setProperties();

    this._boundOnMouseMoveOrTouchMove = this.__onMouseMoveOrTouchMove.bind(this);
    this._boundMouseUpOrTouchEnd = this.__onMouseUpOrTouchEnd.bind(this);

    this.__addListeners();

  }

  private __setupUI() {

    let markup = `<div class="ms-Slider">
			<label class="ms-Label ms-Slider-label"></label>
			<div class="ms-Slider-container">
				<button class="ms-Slider-slideBox ms-Slider-showTransitions" type="button" role="slider">
					<div class="ms-Slider-line">
						<span class="ms-Slider-thumb"></span>
						<span class="ms-Slider-active"></span>
						<span class="ms-Slider-inactive"></span>
					</div>
				</button>
				<label class="ms-Label ms-Slider-value"></Label>
			</div>
		</div>`;

    this.innerHTML = markup;

    // Update references
    this._refs = {
      container: this.querySelector('.ms-Slider'),
      label: this.querySelector('.ms-Slider-label'),
      //slidercontainer: this.querySelector('.ms-Slider-container'),
      showvalue: this.querySelector('.ms-Slider-value'),
      line: this.querySelector('.ms-Slider-line'),
      button: this.querySelector('.ms-Slider-slideBox'),
      thumb: this.querySelector('.ms-Slider-thumb'),
      active: this.querySelector('.ms-Slider-active'),
      inactive: this.querySelector('.ms-Slider-inactive')
    }

  }

  private __setProperties(property?: string) {

    if (!this._refs || !this._refs.container) return;

    // Boolean properties
    if (property == null || property === 'disabled') {
      let classList = this._refs.container.classList;

      if (this.disabled === true) {
        classList.remove('ms-Slider-enabled');
        classList.add('ms-Slider-disabled');
      } else {
        classList.remove('ms-Slider-disabled');
        classList.add('ms-Slider-enabled');
      }

      this.__addListeners();
    }

    if (property == null || property === 'showvalue') {
      this._refs.button.classList[(this.showvalue === true) ? 'add' : 'remove']('ms-Slider-showValue');
      this._refs.showvalue.textContent = (this.showvalue === true) ? this._value : '';
    }

    if (property == null || property === 'vertical') {
      let classList = this._refs.container.classList;

      if (this.vertical === true) {
        classList.remove('ms-Slider-row');
        classList.add('ms-Slider-column');
      } else {
        classList.remove('ms-Slider-row');
        classList.add('ms-Slider-column');
      }
    }

    // Alphanumeric properties
    if (property == null || property === 'label') { this._refs.label.textContent = this._label; }

    // Numeric properties
    if (property == null || ['min', 'max', 'step', 'value'].indexOf(property) !== -1) {
      this.__renderValue();
    }

  }

  private __renderValue() {
    const thumbOffsetPercent = Math.round((this._value - this._min) / ((this._max - this._min) / 100)); /// (this._max - this._min)) * 100;
    const direction = this._vertical ? 'bottom' : 'left';

    // console.info('__renderValue', this._max, this._min, this._value, thumbOffsetPercent, direction);

    this._refs.thumb.style[direction] = thumbOffsetPercent + '%';
    this._refs.active.style.width = thumbOffsetPercent.toString() + '%'
    this._refs.inactive.style.width = (100 - thumbOffsetPercent).toString() + '%'

    if (this.showvalue && this._refs.showvalue) this._refs.showvalue.textContent = this._value;

  }

  private __addListeners() {

    if (this._disabled === true && this._boundonMouseDownOrTouchStart != null) {

      this.removeEventListener('mousedown', this._boundonMouseDownOrTouchStart);
      this.removeEventListener('touchstart', this._boundonMouseDownOrTouchStart);

      this._boundonMouseDownOrTouchStart = null;
    } else if (this._disabled === false && this._boundonMouseDownOrTouchStart == null) {

      this._boundonMouseDownOrTouchStart = this.__onMouseDownOrTouchStart.bind(this);

      this.addEventListener('mousedown', this._boundonMouseDownOrTouchStart);
      this.addEventListener('touchstart', this._boundonMouseDownOrTouchStart);

    }

  }

  /**
   * Handler to execute when moving the handler starts
   *
   * @param null event  MouseEvent | TouchEvent
   * @memberof FabricSlider
   */
  __onMouseDownOrTouchStart(event: MouseEvent | TouchEvent) {

    if (event.type === 'mousedown') {

      window.addEventListener('mousemove', this._boundOnMouseMoveOrTouchMove);
      window.addEventListener('mouseup', this._boundMouseUpOrTouchEnd);

    } else if (event.type === 'touchstart') {
      window.addEventListener('touchmove', this._boundOnMouseMoveOrTouchMove);
      window.addEventListener('touchend', this._boundMouseUpOrTouchEnd);
    }
    this.__onMouseMoveOrTouchMove(event, true);
  }

  __onMouseMoveOrTouchMove(event: MouseEvent | TouchEvent, suppressEventCancelation: boolean) {

    if (!this._refs.line) {
      return;
    }

    const steps = (this._max - this._min) / this._step;
    const sliderPositionRect = this._refs.line.getBoundingClientRect();
    const sliderLength = !this._vertical ? sliderPositionRect.width : sliderPositionRect.height;
    const stepLength = sliderLength / steps;

    let currentSteps;
    let distance;

    if (!this._vertical) {
      const left = this.__getPosition(event, this._vertical);
      distance = sliderPositionRect.right - left;
      currentSteps = distance / stepLength;
    } else {
      const bottom = this.__getPosition(event, this._vertical);
      distance = sliderPositionRect.bottom - bottom;
      currentSteps = distance / stepLength;
    }

    let currentValue;
    let renderedValue;


    // The value shouldn't be bigger than max or be smaller than min.
    if (currentSteps > Math.floor(steps)) {
      renderedValue = currentValue = this._max;
    } else if (currentSteps < 0) {
      renderedValue = currentValue = this._min;
    } else {
      renderedValue = this._min + this._step * currentSteps;
      currentValue = this._min + this._step * Math.round(currentSteps);
    }

    this.__updateValue(currentValue, renderedValue);

    if (!suppressEventCancelation) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private __getPosition(event: MouseEvent | TouchEvent, vertical: boolean) {
    var currentPosition;
    switch (event.type) {
      case 'mousedown':
      case 'mousemove':
        //@ts-ignore
        currentPosition = !vertical ? event.clientX : event.clientY;
        break;
      case 'touchstart':
      case 'touchmove':
        //@ts-ignore
        currentPosition = !vertical ? event.touches[0].clientX : event.touches[0].clientY;
        break;
    }
    return currentPosition;
  }

  private __updateValue(value: number, renderedValue: number) {

    const interval = 1.0 / this._step;

    // Make sure value has correct number of decimal places based on steps without JS's floating point issues
    const roundedValue = Math.round(renderedValue * interval) / interval;
    const newVal = this._max - roundedValue + this._min

    if (newVal !== this._value) {
      this.value = newVal;
    }

  }

  __onMouseUpOrTouchEnd(event: MouseEvent | TouchEvent) {

    // Remove event listeners
    switch (event.type) {
      case 'mouseup':
        window.removeEventListener('mousemove', this._boundOnMouseMoveOrTouchMove);
        window.removeEventListener('mouseup', this._boundMouseUpOrTouchEnd);
        break;
      case 'touchend':
        window.addEventListener('touchmove', this._boundOnMouseMoveOrTouchMove);
        window.addEventListener('touchend', this._boundMouseUpOrTouchEnd);
        break;
    }

  }

  static get observedAttributes() {
    return ['min', 'max', 'value', 'step', 'label', 'showvalue', 'disabled', 'vertical'];
  }

  attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null) {
    //@ts-ignore
    this[attr] = (typeof this[attr] === 'boolean') ? this.hasAttribute(attr) : newValue;
  }

}
window.customElements.define('fabric-slider', FabricSlider);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `fabric-slider { 
  display: inline-block;
  font-family: "Segoe UI Web (West European)",Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;
  font-size: 14px
}

.ms-Slider-label{color: rgb(51, 51, 51);
box-sizing: border-box;
box-shadow: none;
margin: 0px;
display: block;
padding: 0px;
overflow-wrap: break-word;
}

.ms-Slider-container
{
  display: flex;
flex-wrap: nowrap;
align-items: center;
}

.ms-Slider-slideBox
{
outline: transparent none medium;
position: relative;
background: transparent none repeat scroll 0% 0%;
border: medium none;
flex-grow: 1;
line-height: 28px;
height: 28px;
width: auto;
padding: 0px 8px;
}

.ms-Slider-line {
  display: flex;
position: relative;
width: 100%;
}

.ms-Slider-thumb {

  border-width: 2px;
  border-style: solid;
  border-color: rgb(102, 102, 102);
  border-radius: 10px;
  box-sizing: border-box;
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  top: -6px;
  transform: translateX(-50%);
  transition: left 0.367s cubic-bezier(0.1, 0.9, 0.2, 1) 0s;

}

.ms-Slider-container:hover .ms-Slider-thumb {
  border: 2px solid rgb(0, 120, 212);
}

.ms-Slider-active {
  border-radius: 4px;
  box-sizing: border-box;
  height: 4px;
  width: 100%;
  background: rgb(102, 102, 102) none repeat scroll 0% 0%;
  transition: width 0.367s cubic-bezier(0.1, 0.9, 0.2, 1) 0s;
}

.ms-Slider-container:hover .ms-Slider-active {
  background-color: rgb(0, 120, 212);
}

.ms-Slider-inactive {
  border-radius: 4px;
  box-sizing: border-box;
  height: 4px;
  width: 100%;
  background: rgb(200, 200, 200) none repeat scroll 0% 0%;
  transition: width 0.367s cubic-bezier(0.1, 0.9, 0.2, 1) 0s;
}

.ms-Slider-container:hover .ms-Slider-inactive {
  background-color: rgb(199, 224, 244);
}

.ms-Slider-value {
  color: rgb(51, 51, 51);
  box-sizing: border-box;
  box-shadow: none;
  margin: 0px 8px;
  display: block;
  padding: 5px 0px;
  overflow-wrap: break-word;
  flex-shrink: 1;
  width: 40px;
  line-height: 1;
  white-space: nowrap;
}
`;

  d.head.appendChild(style);
})(window, document); 