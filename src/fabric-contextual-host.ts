
class FabricContextualHost extends HTMLElement {

  private _arrowPosition: any;
  private _matchTargetWidth: boolean = false;
  private _multiselect: boolean = false;
  private _target: { element: any, height: any, width: any };
  private _direction: string = 'bottom';
  public _refs: { [index: string]: any };

  private readonly _AVAILABLE_DIRECTIONS: string[] = ['left', 'right', 'top', 'bottom'];
  private readonly _MODAL_STATE_POSITIONED: string = "is-positioned";
  private readonly _CONTEXT_STATE_CLASS: string = "is-open";
  private readonly _ARROW_SIZE: number = 28;
  private readonly _ARROW_OFFSET: number = 8;

  private __boundResizeAction: any;
  private __boundClickAction: any;
  private __boundHandleKeyUpDismiss: any;

  private _modalWidth: any;
  private _modalHeight: any;

  constructor() {
    super();
    this._arrowPosition = null;
    this._target = { element: null, height: null, width: null }
    this._refs = {}
  }

  get arrowPosition() { return this._arrowPosition }
  get matchTargetWidth() { return this._matchTargetWidth }
  get target() { return this._target.element }
  get direction() { return this._direction }
  get multiselect() { return this._multiselect }

  set arrowPosition(value) {
    if (this._AVAILABLE_DIRECTIONS.indexOf(value) === -1) throw new RangeError('Arrow position unknown');
    value = 'arrow--' + value.substr(0, 1).toUpperCase + value.substr(1);
    if (value === this._arrowPosition) return; this._arrowPosition = value; this.__setProperties('arrowPosition')
  }

  set target(value) { this._target.element = value; /*this.__openModal()*/ }
  set direction(value) { if (this._AVAILABLE_DIRECTIONS.indexOf(value) === -1) throw new RangeError('Direction unknown'); this._direction = value }
  set matchTargetWidth(value) { this._matchTargetWidth = !!value }
  set multiselect(value) { this._multiselect = !!value }

  /* ---------- Lifecycle Callbacks ---------- */
  connectedCallback() {
    // this.__setupUI();
    // this.__setListeners();

    // Init target via selector in DOM attribute
    if (this._target.element == null) {
      let selector = this.getAttribute('host');
      if (selector) {
        let target = this.closest(selector) || document.querySelector(selector);
        if (target) this.target = target;
      }
    }

    //this.__openModal();
    this.__setResizeDisposal();

  }

  static get observedAttributes() {
    return ['arrowPosition', 'direction', 'matchTargetWidth', 'multiselect'];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {

    // Gather boolean properties
    if (['matchTargetWidth', 'multiselect'].indexOf(attr) !== -1) {
      //@ts-ignore
      newValue = this.hasAttribute(attr);
    }

    //@ts-ignore
    if (oldValue === newValue || newValue === this[attr]) return;
    //@ts-ignore
    this[attr] = newValue;
  }
  /* ---------- /Lifecycle Callbacks ---------- */

  public __setupUI() {

    let markup = `<div class="ms-ContextualHost is-hidden">
		  <div class="ms-ContextualHost-main"></div>
		  <div class="ms-ContextualHost-beak"></div>
		</div>`;

    this.innerHTML = markup;

    this._refs = {
      container: this.querySelector('.ms-ContextualHost'),
      main: this.querySelector('.ms-ContextualHost-main'),
      arrow: this.querySelector('.ms-ContextualHost-beak')
    }

  }

  private __setProperties(property?: string) {

    if (property == null || property === 'arrowPosition') {
      // Check className of container, remove all arrow--* occurences and optionally set new one
    }

  }

  __openModal() {

    // console.log('__openModal');

    this.__saveModalSize();
    this.__findAvailablePosition();
    this._refs.container.classList.add(this._CONTEXT_STATE_CLASS);

    this.__setCloseListeners();
  }

  __disposeModal() {

    // console.log('__disposeModal');
    //if (ContextualHost.hosts.length > 0) {
    window.removeEventListener("resize", this.__boundResizeAction, false);
    document.body.removeEventListener("click", this.__boundClickAction, true);
    document.body.removeEventListener("keyup", this.__boundHandleKeyUpDismiss, true);
    //this._refs.container.parentNode.removeChild(this._refs.container);

    this._refs.container.classList.remove(this._CONTEXT_STATE_CLASS);
  }

  /* ---------- Positioning Methods ---------- */

  __saveModalSize() {

    if (this._target.element == null) { console.warn('__saveModalSize, no target'); return }

    let _modalStyles = window.getComputedStyle(this._refs.container);
    this._refs.container.setAttribute("style", "opacity: 0; z-index: -1");
    this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);
    this._refs.container.classList.add(this._CONTEXT_STATE_CLASS);

    if (this._matchTargetWidth) {
      let teStyles = window.getComputedStyle(this._target.element);
      this._modalWidth = this._target.element.getBoundingClientRect().width
        //@ts-ignore
        + (parseInt(teStyles.marginLeft, 10)
          //@ts-ignore
          + parseInt(teStyles.marginLeft, 10));
      // Set the ContextualHost width

    } else {
      this._modalWidth = this._refs.container.getBoundingClientRect().width
        //@ts-ignore
        + (parseInt(_modalStyles.marginLeft, 10)
          //@ts-ignore
          + parseInt(_modalStyles.marginRight, 10));
      this._refs.container.setAttribute("style", "");
    }
    this._modalHeight = this._refs.container.getBoundingClientRect().height
      //@ts-ignore
      + (parseInt(_modalStyles.marginTop, 10)
        //@ts-ignore
        + parseInt(_modalStyles.marginBottom, 10));

    this._refs.container.classList.remove(this._MODAL_STATE_POSITIONED);
    this._refs.container.classList.remove(this._CONTEXT_STATE_CLASS);
    this._target.width = this._target.element.getBoundingClientRect().width;
    this._target.height = this._target.element.getBoundingClientRect().height;

  }

  __findAvailablePosition() {
    let _posOk;

    switch (this._direction) {
      case "left":
        // Try the right side
        _posOk = this.__positionOk(
          this.__tryPosModalLeft.bind(this),
          this.__tryPosModalRight.bind(this),
          this.__tryPosModalBottom.bind(this),
          this.__tryPosModalTop.bind(this)
        );
        this.__setPosition(_posOk);
        break;
      case "right":
        _posOk = this.__positionOk(
          this.__tryPosModalRight.bind(this),
          this.__tryPosModalLeft.bind(this),
          this.__tryPosModalBottom.bind(this),
          this.__tryPosModalTop.bind(this)
        );
        this.__setPosition(_posOk);
        break;
      case "top":
        _posOk = this.__positionOk(
          this.__tryPosModalTop.bind(this),
          this.__tryPosModalBottom.bind(this)
        );
        this.__setPosition(_posOk);
        break;
      case "bottom":
        _posOk = this.__positionOk(
          this.__tryPosModalBottom.bind(this),
          this.__tryPosModalTop.bind(this)
        );
        this.__setPosition(_posOk);
        break;
      default:
        this.__setPosition();
    }
  }

  private __positionOk(pos1: any, pos2?: any, pos3?: any, pos4?: any) {
    let _posOk;
    _posOk = pos1();

    if (!_posOk) {
      _posOk = pos2();
      if (!_posOk && pos3) {
        _posOk = pos3();
        if (!_posOk && pos4) {
          _posOk = pos4();
        }
      }
    }
    return _posOk;
  }

  private __tryPosModalLeft() {
    let teLeft = this._target.element.getBoundingClientRect().left;
    return (teLeft < this._modalWidth) ? false : "left";
  }

  private __tryPosModalRight() {

    let teRight = this._target.element.getBoundingClientRect().right;
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    return ((w - teRight) < this._modalWidth) ? false : "right";
  }

  private __tryPosModalBottom() {

    let teBottom = window.innerHeight - this._target.element.getBoundingClientRect().bottom;

    return (teBottom < this._modalHeight) ? false : "bottom";
  }

  private __tryPosModalTop() {

    let teTop = this._target.element.getBoundingClientRect().top;

    return (teTop < this._modalHeight) ? false : "top";
  }

  private __setPosition(curDirection?: string) {

    if (this._target.element == null) { console.warn('__setPosition, no target'); return }

    let teBR = this._target.element.getBoundingClientRect();
    let teLeft = teBR.left;
    let teRight = teBR.right;
    let teTop = teBR.top;
    let teWidth = teBR.width;
    let teHeight = teBR.height;
    let mHLeft;
    let mHTop;
    let mWidth = "";
    let arrowTop;
    let arrowLeft;
    let windowX = window.scrollX ? window.scrollX : 0;
    let windowY = window.scrollY ? window.scrollY : 0;
    let arrowSpace = (this._arrowPosition != null) ? this._ARROW_SIZE : 0;

    if (this._matchTargetWidth) {
      mWidth = "width: " + this._modalWidth + "px;";
    }

    switch (curDirection) {
      case "left":
        mHLeft = teLeft - this._modalWidth - arrowSpace;
        mHTop = this.__calcTop(this._modalHeight, teHeight, teTop);
        mHTop += window.scrollY ? window.scrollY : 0;
        this._refs.container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
        this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);

        if (this._arrowPosition != null) {
          this._refs.container.classList.add("ms-ContextualHost--arrowRight");
          arrowTop = ((teTop + windowY) - mHTop) + this._ARROW_OFFSET;
          this._refs.arrow.setAttribute("style", "top: " + arrowTop + "px;");
        }
        break;
      case "right":
        mHTop = this.__calcTop(this._modalHeight, teHeight, teTop);
        mHTop += windowY;
        mHLeft = teRight + arrowSpace;
        this._refs.container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
        this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);

        if (this._arrowPosition != null) {
          arrowTop = ((windowY + teTop) - mHTop) + this._ARROW_OFFSET;
          this._refs.arrow.setAttribute("style", "top: " + arrowTop + "px;");
          this._refs.container.classList.add("ms-ContextualHost--arrowLeft");
        }
        break;
      case "top":
        mHLeft = this.__calcLeft(this._modalWidth, teWidth, teLeft);
        mHTop = teTop - this._modalHeight - arrowSpace;
        mHTop += windowY;
        this._refs.container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
        this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);

        if (this._arrowPosition != null) {
          arrowTop = this._modalHeight - (arrowSpace / 2);
          arrowLeft = Math.max(windowX + teLeft - mHLeft + ((teWidth - arrowSpace) / 2), this._ARROW_OFFSET);
          this._refs.arrow.setAttribute("style", "top: " + arrowTop + "px; left: " + arrowLeft + "px;");
          this._refs.container.classList.add("ms-ContextualHost--arrowBottom");
        }
        break;
      case "bottom":
        mHLeft = mHLeft = this.__calcLeft(this._modalWidth, teWidth, teLeft);
        mHTop = teTop + teHeight + arrowSpace;
        mHTop += window.scrollY ? window.scrollY : 0;
        this._refs.container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
        this._refs.container.classList.add(this._MODAL_STATE_POSITIONED);

        if (this._arrowPosition != null) {
          arrowLeft = Math.max(windowX + teLeft - mHLeft + ((teWidth - arrowSpace) / 2), this._ARROW_OFFSET);
          this._refs.arrow.setAttribute("style", "left: " + arrowLeft + "px;");
          this._refs.container.classList.add("ms-ContextualHost--arrowTop");
        }
        break;
      default:
        this._refs.container.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);");
    }
  }

  private __calcLeft(mWidth: number, teWidth: number, teLeft: number) {
    let mHalfWidth = mWidth / 2;
    let teHalf = teWidth / 2;
    let mHLeft = (teLeft + teHalf) - mHalfWidth;
    mHLeft = (mHLeft < mHalfWidth) ? teLeft : mHLeft;
    return mHLeft;
  }

  private __calcTop(mHeight: number, teHeight: number, teTop: number) {
    let mHalfWidth = mHeight / 2;
    let teHalf = teHeight / 2;
    let mHLeft = (teTop + teHalf) - mHalfWidth;
    mHLeft = (mHLeft < mHalfWidth) ? teTop : mHLeft;
    return mHLeft;
  }

  /* ---------- /Positioning Methods ---------- */

  /* ---------- Listener Methods ---------- */
  __setCloseListeners() {

    this.__boundResizeAction = this.__boundResizeAction || this.__resizeAction.bind(this);
    this.__boundClickAction = this.__boundClickAction || this.__clickAction.bind(this);
    this.__boundHandleKeyUpDismiss = this.__boundHandleKeyUpDismiss || this.__handleKeyUpDismiss.bind(this);

    this.__setDismissClick()
  }

  __clickAction(e: MouseEvent) {

    // console.log('__clickAction')

    // If the element clicked is not INSIDE of contextualHost then close contextualHost
    if (!this._refs.container.contains(e.target) && e.target !== this._refs.container) {

      e.preventDefault();
      e.stopPropagation();

      this.__disposeModal();

      //} else if(e.target.tagName === 'A') {
    } else {

      // A link has been clicked => stop original event and dispatch custom event
      e.preventDefault();
      e.stopPropagation();

      this.dispatchEvent(new CustomEvent('contextual-menu-link-click', { detail: { node: e.target }, bubbles: true, cancelable: true }));
    }

  }

  private __setDismissClick() {

    // console.log('__setDismissClick', this, this.__clickAction, this.__boundClickAction);

    document.body.addEventListener("click", this.__boundClickAction, true);
    document.body.addEventListener("keyup", this.__boundHandleKeyUpDismiss, true);
  }

  __handleKeyUpDismiss(e: KeyboardEvent) {
    if (e.keyCode === 32 || e.keyCode === 27) {
      //@ts-ignore
      if (this._dismissAction && typeof this._dismissAction === 'function') this._dismissAction(e);
    }
  }

  __resizeAction() {
    this.__disposeModal();
  }

  __setResizeDisposal() {
    window.addEventListener("resize", this.__boundResizeAction, false);
  }

  /* ---------- /Listener Methods ---------- */

}
window.customElements.define('fabric-contextual-host', FabricContextualHost);


// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `.ms-ContextualHost{font-family:Segoe UI WestEuropean,Segoe UI,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;z-index:10;margin:16px auto;position:relative;min-width:10px;display:none;background-color:#fff;box-shadow:0 3px 5px 0 rgba(0,0,0,.4)}
.ms-ContextualHost.is-positioned{position:absolute;margin:0}
.ms-ContextualHost.is-open{display:inline-block}
.ms-ContextualHost-beak{box-shadow:0 0 15px -5px #3c3c3c;position:absolute;width:28px;height:28px;background:#fff;border:1px solid #eaeaea;box-sizing:border-box;top:-6px;display:none;transform:rotate(45deg);z-index:0;outline:1px solid transparent}
.ms-ContextualHost.ms-ContextualHost--arrowLeft .ms-ContextualHost-beak,.ms-ContextualHost.ms-ContextualHost--arrowRight .ms-ContextualHost-beak{top:40px;display:none}
.ms-ContextualHost.ms-ContextualHost--arrowLeft .ms-ContextualHost-beak{left:-10px}
.ms-ContextualHost.ms-ContextualHost--arrowRight .ms-ContextualHost-beak{right:-10px}
.ms-ContextualHost.ms-ContextualHost--arrowTop .ms-ContextualHost-beak{display:block;top:-10px}
.ms-ContextualHost.ms-ContextualHost--arrowBottom .ms-ContextualHost-beak{display:block;bottom:-10px}
.ms-ContextualHost-main{position:relative;background-color:#fff;box-sizing:border-box;outline:1px solid transparent;z-index:5;min-height:10px}
.ms-ContextualHost-close{margin:0;border:0;background:none;cursor:pointer;position:absolute;top:12px;right:12px;padding:8px;width:32px;height:32px;font-size:14px;color:#666;z-index:10}
.ms-ContextualHost.ms-ContextualHost--close .ms-ContextualHost-title{margin-right:20px}
.ms-ContextualHost.ms-ContextualHost--primaryArrow .ms-ContextualHost-beak{background-color:#0078d7}
@media (min-width:480px){.ms-ContextualHost{margin:16px}
.ms-ContextualHost.is-positioned{margin:0}
.ms-ContextualHost.ms-ContextualHost--arrowLeft .ms-ContextualHost-beak,.ms-ContextualHost.ms-ContextualHost--arrowRight .ms-ContextualHost-beak{display:block}}`;
  d.head.appendChild(style);
})(window, document);