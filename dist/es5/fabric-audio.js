"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FabricAudio = (function (_super) {
    __extends(FabricAudio, _super);
    function FabricAudio() {
        var _this_1 = _super.call(this) || this;
        _this_1._refs = {};
        _this_1._src = '';
        _this_1._disabled = false;
        _this_1.speeds = [1, 1.5, 2, 2.5, 3];
        _this_1.currentSpeedIdx = 0;
        return _this_1;
    }
    Object.defineProperty(FabricAudio.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { if (this._disabled === !!value)
            return; this._disabled = !!value; this.__setProperties('disabled'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FabricAudio.prototype, "src", {
        get: function () { return this._src; },
        set: function (val) { if (val === this._src)
            return; this._src = val; this.__setProperties('src'); },
        enumerable: true,
        configurable: true
    });
    FabricAudio.prototype.connectedCallback = function () {
        this.__setupUI();
        this.__setProperties();
        this.__addListeners();
    };
    FabricAudio.prototype.__setupUI = function () {
        var markup = "<svg style=\"display: none;\">\n    <symbol id=\"icon-play\" viewBox=\"0 0 32 32\">\n      <path fill=\"currentColor\" d=\"M4 4 L28 16 L4 28 z \"></path>\n    </symbol>\n    <symbol id=\"icon-pause\" viewBox=\"0 0 32 32\">\n      <path d=\"M4 4 H12 V28 H4 z M20 4 H28 V28 H20 z \"></path>\n    </symbol>\n    <symbol id=\"icon-rewind\" viewBox=\"0 0 32 32\">\n      <path d=\"M4 4 H8 V14 L28 4 V28 L8 18 V28 H4 z \"></path>\n    </symbol>\n    <symbol id=\"icon-speaker-unmuted\" viewBox=\"0 0 32 32\">\n      <path d=\"M2 12 L8 12 L16 6 L16 26 L8 20 L2 20 z M32 16 A16 16 0 0 1 27.25 27.375 L25.25 25.25 A13 13 0 0 0 29 16 A13 13 0 0 0 25.25 6.75 L27.25 4.625 A16 16 0 0 1 32 16 M25 16 A9 9 0 0 1 22.375 22.375 L20.25 20.25 A6 6 0 0 0 22 16 A6 6 0 0 0 20.25 11.75 L22.375 9.625 A9 9 0 0 1 25 16  \"></path>\n    </symbol>\n    <symbol id=\"icon-speaker-muted\" viewBox=\"0 0 32 32\">\n      <path d=\"M2 12 L8 12 L16 6 L16 26 L8 20 L2 20 z  \"></path>\n    </symbol>\n  </svg>\n  <audio src=\"\"></audio>\n  <div class=\"podcast-player\">\n    <button class=\"button-play\" aria-label=\"Play\">\n      <svg class=\"play\"><use xlink:href=\"#icon-play\"></use></svg>\n      <svg class=\"pause\"><use xlink:href=\"#icon-pause\"></use></svg>\n    </button>\n    <button class=\"button-rewind\" aria-label=\"Rewind\">\n      <svg><use xlink:href=\"#icon-rewind\"></use></svg>\n    </button>\n    <span class=\"currenttime time\">00:00</span>\n    <progress class=\"progress-meter\" value=\"0\"></progress>\n    <span class=\"duration time\">00:00</span>\n    <button class=\"button-speed\">1</button>\n    <button class=\"button-mute\" aria-label=\"Mute\">\n      <svg class=\"unmuted\"><use xlink:href=\"#icon-speaker-unmuted\"></use></svg>\n      <svg class=\"muted\"><use xlink:href=\"#icon-speaker-muted\"></use></svg>\n    </button>\n  </div>";
        this.innerHTML = markup;
        this._refs = {
            container: this,
            audio: this.querySelector('audio'),
            play: this.querySelector('.button-play'),
            rewind: this.querySelector('.button-rewind'),
            mute: this.querySelector('.button-mute'),
            speed: this.querySelector('.button-speed'),
            progress: this.querySelector('.progress-meter'),
            currentTime: this.querySelector('.currenttime'),
            duration: this.querySelector('.duration')
        };
    };
    FabricAudio.prototype.__setProperties = function (property) {
        if (!this._refs || !this._refs.container)
            return;
        if (property == null || property === 'src') {
            if (this._refs.audio)
                this._refs.audio.src = this._src;
        }
    };
    FabricAudio.prototype.__addListeners = function () {
        var _this_1 = this;
        if (this._refs.audio) {
            this._refs.audio.addEventListener('loadedmetadata', function () {
                _this_1._refs.progress.setAttribute('max', Math.floor(_this_1._refs.audio.duration));
                _this_1._refs.duration.textContent = _this_1.__toHHMMSS(_this_1._refs.audio.duration);
            });
            this._refs.audio.addEventListener('timeupdate', function () {
                _this_1._refs.progress.setAttribute('value', _this_1._refs.audio.currentTime);
                _this_1._refs.currentTime.textContent = _this_1.__toHHMMSS(_this_1._refs.audio.currentTime);
            });
        }
        this._refs.play.addEventListener('click', function () {
            if (_this_1._refs.audio.paused) {
                _this_1._refs.audio.play();
            }
            else {
                _this_1._refs.audio.pause();
            }
            _this_1.classList.toggle('is-playing');
        });
        this._refs.mute.addEventListener('click', function () {
            if (_this_1._refs.audio.muted) {
                _this_1._refs.audio.muted = false;
            }
            else {
                _this_1._refs.audio.muted = true;
            }
            _this_1.classList.toggle('is-muted');
        });
        this._refs.rewind.addEventListener('click', function () {
            _this_1._refs.audio.currentTime -= 30;
        }, false);
        this._refs.speed.addEventListener('click', function (e) {
            _this_1.currentSpeedIdx = _this_1.currentSpeedIdx + 1 < _this_1.speeds.length ? _this_1.currentSpeedIdx + 1 : 0;
            _this_1._refs.audio.playbackRate = _this_1.speeds[_this_1.currentSpeedIdx];
            e.target.textContent = "" + _this_1.speeds[_this_1.currentSpeedIdx];
            return true;
        }, false);
        var _this = this;
        this._refs.progress.addEventListener('click', function (e) {
            if (!e.target)
                return;
            try {
                _this._refs.audio.currentTime = Math.floor(_this._refs.audio.duration || 0.0) * (e.offsetX / e.target.offsetWidth);
            }
            catch (error) {
                console.log(error, e, Math.floor(_this._refs.audio.duration || 0.00) * (e.offsetX / e.target.offsetWidth));
            }
        }, false);
    };
    Object.defineProperty(FabricAudio, "observedAttributes", {
        get: function () {
            return ['src'];
        },
        enumerable: true,
        configurable: true
    });
    FabricAudio.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (oldValue != newValue)
            this[attr] = newValue;
    };
    FabricAudio.prototype.__toHHMMSS = function (totalsecs) {
        var sec_num = parseInt(totalsecs, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
        var sHours = (hours < 10) ? "0" + hours : "" + hours;
        var sMinutes = (minutes < 10) ? "0" + minutes : "" + minutes;
        var sSeconds = (seconds < 10) ? "0" + seconds : "" + seconds;
        sHours = sHours !== "0" ? sHours + ':' : '';
        sMinutes = sMinutes + ':';
        return sHours + sMinutes + sSeconds;
    };
    return FabricAudio;
}(HTMLElement));
window.customElements.define('fabric-audio', FabricAudio);
(function (w, d) {
    var style = d.createElement('STYLE');
    style.textContent = "fabric-audio { display: inline-block}\nfabric-audio .podcast-player {\n    display: flex;\n    width:100%;\n    align-items: center;\n    justify-contents: space-between;\n    flex-wrap: nowrap;\n    font-family: sans-serif;\n    font-size: 12px;\n    line-height: 15px;\n\n  }\n\n  fabric-audio .podcast-player > button,\n  fabric-audio .podcast-player > span,\n  fabric-audio .podcast-player > progress {\n    margin-right: 0.5em;\n  }\n\n  fabric-audio .podcast-player button:last-of-type {\n    margin-right: 0;\n  }\n\n  fabric-audio .podcast-player progress {\n    flex:1;\n    cursor: pointer;\n\theight: 5px;\n\tborder: 0;\n  }\n  \n  fabric-audio progress::-moz-progress-bar {\n\tbackground-color: #0078d7  \n  }\n\n  fabric-audio .podcast-player button {\n    -webkit-appearance: none;\n    font-size: 15px;\n    min-width: 26px;\n    padding: 4px;\n    border: 1px solid #ccc;\n    border-radius: 3px;\n    cursor: pointer;\n    background-color: transparent;\n  }\n\n  fabric-audio .podcast-player button svg {\n    width: 0.8em;\n    height: 0.8em;\n  }\n\n  /* Speed */\n  fabric-audio .podcast-player .button-speed {\n    font-size: 12px;\n    min-width: 3em;\n  }\n\n  fabric-audio .podcast-player .button-speed:after {\n    content: 'x';\n  }\n\n  /* Play/Pause */\n  .button-play .pause {\n    display: none;\n  }\n  .is-playing .button-play .pause {\n    display: inline;\n  }\n  .is-playing .button-play .play {\n    display: none;\n  }\n  /* Mute/Unmute */\n  .button-mute .muted {\n    display: none;\n  }\n  .is-muted .button-mute .muted {\n    display: inline;\n  }\n  .is-muted .button-mute .unmuted {\n    display: none;\n  }\n";
    d.head.appendChild(style);
})(window, document);
