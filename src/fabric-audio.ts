// https://raw.githubusercontent.com/adactio/podcast-player/master/podcast-player.html

class FabricAudio extends HTMLElement {

  private _refs: { [index: string]: any };
  private _src: string;
  private _disabled: boolean;

  public currentSpeedIdx: number;
  public readonly speeds: number[];

  constructor() {
    super();
    this._refs = {};
    this._src = '';
    this._disabled = false;

    this.speeds = [1, 1.5, 2, 2.5, 3];
    this.currentSpeedIdx = 0;

  }

  get disabled() { return this._disabled; }
  set disabled(value: boolean) { if (this._disabled === !!value) return; this._disabled = !!value; this.__setProperties('disabled'); }

  get src() { return this._src }
  set src(val) { if (val === this._src) return; this._src = val; this.__setProperties('src') }

  connectedCallback() {

    this.__setupUI();
    this.__setProperties();
    this.__addListeners();

  }

  private __setupUI() {

    let markup = `<svg style="display: none;">
    <symbol id="icon-play" viewBox="0 0 32 32">
      <path fill="currentColor" d="M4 4 L28 16 L4 28 z "></path>
    </symbol>
    <symbol id="icon-pause" viewBox="0 0 32 32">
      <path d="M4 4 H12 V28 H4 z M20 4 H28 V28 H20 z "></path>
    </symbol>
    <symbol id="icon-rewind" viewBox="0 0 32 32">
      <path d="M4 4 H8 V14 L28 4 V28 L8 18 V28 H4 z "></path>
    </symbol>
    <symbol id="icon-speaker-unmuted" viewBox="0 0 32 32">
      <path d="M2 12 L8 12 L16 6 L16 26 L8 20 L2 20 z M32 16 A16 16 0 0 1 27.25 27.375 L25.25 25.25 A13 13 0 0 0 29 16 A13 13 0 0 0 25.25 6.75 L27.25 4.625 A16 16 0 0 1 32 16 M25 16 A9 9 0 0 1 22.375 22.375 L20.25 20.25 A6 6 0 0 0 22 16 A6 6 0 0 0 20.25 11.75 L22.375 9.625 A9 9 0 0 1 25 16  "></path>
    </symbol>
    <symbol id="icon-speaker-muted" viewBox="0 0 32 32">
      <path d="M2 12 L8 12 L16 6 L16 26 L8 20 L2 20 z  "></path>
    </symbol>
  </svg>
  <audio src=""></audio>
  <div class="podcast-player">
    <button class="button-play" aria-label="Play">
      <svg class="play"><use xlink:href="#icon-play"></use></svg>
      <svg class="pause"><use xlink:href="#icon-pause"></use></svg>
    </button>
    <button class="button-rewind" aria-label="Rewind">
      <svg><use xlink:href="#icon-rewind"></use></svg>
    </button>
    <span class="currenttime time">00:00</span>
    <progress class="progress-meter" value="0"></progress>
    <span class="duration time">00:00</span>
    <button class="button-speed">1</button>
    <button class="button-mute" aria-label="Mute">
      <svg class="unmuted"><use xlink:href="#icon-speaker-unmuted"></use></svg>
      <svg class="muted"><use xlink:href="#icon-speaker-muted"></use></svg>
    </button>
  </div>`;

    this.innerHTML = markup;

    // Update references
    this._refs = {
      container: this,
      audio: this.querySelector('audio'),

      // Buttons
      play: this.querySelector('.button-play'),
      rewind: this.querySelector('.button-rewind'),
      mute: this.querySelector('.button-mute'),
      speed: this.querySelector('.button-speed'),

      // Progress Meter
      progress: this.querySelector('.progress-meter'),
      currentTime: this.querySelector('.currenttime'),
      duration: this.querySelector('.duration')
    }


  }

  private __setProperties(property?: string) {

    if (!this._refs || !this._refs.container) return;

    //if(property == null || property === 'disabled') { this._refs.select.disabled = this._disabled; }

    if (property == null || property === 'src') { if (this._refs.audio) this._refs.audio.src = this._src; }

  }

  private __addListeners() {

    if (this._refs.audio) {

      // Get total duration when available
      this._refs.audio.addEventListener('loadedmetadata', () => {
        this._refs.progress.setAttribute('max', Math.floor(this._refs.audio.duration));
        this._refs.duration.textContent = this.__toHHMMSS(this._refs.audio.duration);
      });

      // When time updates, update progress meter and currentTime
      this._refs.audio.addEventListener('timeupdate', () => {
        this._refs.progress.setAttribute('value', this._refs.audio.currentTime);
        this._refs.currentTime.textContent = this.__toHHMMSS(this._refs.audio.currentTime);
      });

    }

    // Playback toggle
    this._refs.play.addEventListener('click', () => {
      if (this._refs.audio.paused) {
        this._refs.audio.play();
      } else {
        this._refs.audio.pause();
      }
      this.classList.toggle('is-playing');
    });

    // Mute toggle
    this._refs.mute.addEventListener('click', () => {
      if (this._refs.audio.muted) {
        this._refs.audio.muted = false;
      } else {
        this._refs.audio.muted = true;
      }
      this.classList.toggle('is-muted');
    });

    // Rewind player 30s
    this._refs.rewind.addEventListener('click', () => {
      this._refs.audio.currentTime -= 30;
    }, false);

    // Increment playbackRate by .5x
    this._refs.speed.addEventListener('click', (e: MouseEvent) => {
      this.currentSpeedIdx = this.currentSpeedIdx + 1 < this.speeds.length ? this.currentSpeedIdx + 1 : 0;
      this._refs.audio.playbackRate = this.speeds[this.currentSpeedIdx];
      (<HTMLElement>e.target).textContent = "" + this.speeds[this.currentSpeedIdx];
      return true;
    }, false);

    // Seek to audio position
    const _this = this;
    this._refs.progress.addEventListener('click', function (e: MouseEvent) {
      if (!e.target) return;
      try {
        //@ts-ignore
        _this._refs.audio.currentTime = Math.floor(_this._refs.audio.duration || 0.0) * (e.offsetX / e.target.offsetWidth);
      } catch (error) {
        //@ts-ignore
        console.log(error, e, Math.floor(_this._refs.audio.duration || 0.00) * (e.offsetX / e.target.offsetWidth))
      }
    }, false);

  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    //@ts-ignore
    if (oldValue != newValue) this[attr] = newValue
  }

  private __toHHMMSS(totalsecs: string) {
    var sec_num = parseInt(totalsecs, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    let sHours = (hours < 10) ? "0" + hours : "" + hours;
    let sMinutes = (minutes < 10) ? "0" + minutes : "" + minutes;
    let sSeconds = (seconds < 10) ? "0" + seconds : "" + seconds;

    sHours = sHours !== "0" ? sHours + ':' : '';
    sMinutes = sMinutes + ':';

    return sHours + sMinutes + sSeconds;
  }

}
window.customElements.define('fabric-audio', FabricAudio);

// Set styles
(function (w, d) {

  let style = d.createElement('STYLE');
  style.textContent = `fabric-audio { display: inline-block}
fabric-audio .podcast-player {
    display: flex;
    width:100%;
    align-items: center;
    justify-contents: space-between;
    flex-wrap: nowrap;
    font-family: sans-serif;
    font-size: 12px;
    line-height: 15px;

  }

  fabric-audio .podcast-player > button,
  fabric-audio .podcast-player > span,
  fabric-audio .podcast-player > progress {
    margin-right: 0.5em;
  }

  fabric-audio .podcast-player button:last-of-type {
    margin-right: 0;
  }

  fabric-audio .podcast-player progress {
    flex:1;
    cursor: pointer;
	height: 5px;
	border: 0;
  }
  
  fabric-audio progress::-moz-progress-bar {
	background-color: #0078d7  
  }

  fabric-audio .podcast-player button {
    -webkit-appearance: none;
    font-size: 15px;
    min-width: 26px;
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    background-color: transparent;
  }

  fabric-audio .podcast-player button svg {
    width: 0.8em;
    height: 0.8em;
  }

  /* Speed */
  fabric-audio .podcast-player .button-speed {
    font-size: 12px;
    min-width: 3em;
  }

  fabric-audio .podcast-player .button-speed:after {
    content: 'x';
  }

  /* Play/Pause */
  .button-play .pause {
    display: none;
  }
  .is-playing .button-play .pause {
    display: inline;
  }
  .is-playing .button-play .play {
    display: none;
  }
  /* Mute/Unmute */
  .button-mute .muted {
    display: none;
  }
  .is-muted .button-mute .muted {
    display: inline;
  }
  .is-muted .button-mute .unmuted {
    display: none;
  }
`;

  d.head.appendChild(style);
})(window, document);
