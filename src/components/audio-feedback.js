/**
 * Emits audioFrequencyChange events based on a networked audio source
 * @namespace avatar
 * @component networked-audio-analyser
 */
AFRAME.registerComponent("networked-audio-analyser", {
  async init() {
    this.volume = 0;
    this.prevVolume = 0;
    this.smoothing = 0.3;
    this.el.addEventListener("sound-source-set", event => {
      const ctx = THREE.AudioContext.getContext();
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 32;
      this.levels = new Float32Array(this.analyser.frequencyBinCount);
      event.detail.soundSource.connect(this.analyser);
    });
  },

  tick: function() {
    if (!this.analyser) return;

    this.analyser.getFloatTimeDomainData(this.levels);

    let sum = 0;
    for (let i = 0; i < this.levels.length; i++) {
      const amplitude = this.levels[i];
      sum += amplitude * amplitude;
    }
    this.volume = this.smoothing * Math.sqrt(sum / this.levels.length) + (1 - this.smoothing) * this.prevVolume;
    this.prevVolume = this.volume;
  }
});

/**
 * Sets an entity's scale base on audioFrequencyChange events.
 * @namespace avatar
 * @component scale-audio-feedback
 */
AFRAME.registerComponent("scale-audio-feedback", {
  schema: {
    minScale: { default: 1 },
    maxScale: { default: 2 }
  },

  tick() {
    // TODO: come up with a cleaner way to handle this.
    // bone's are "hidden" by scaling them with bone-visibility, without this we would overwrite that.
    if (!this.el.object3D.visible) return;

    const { minScale, maxScale } = this.data;

    const audioAnalyser = this.el.components["networked-audio-analyser"];

    if (!audioAnalyser) return;

    const scale = Math.min(maxScale, minScale + (maxScale - minScale) * audioAnalyser.volume * 8);
    this.el.object3D.scale.setScalar(scale);
  }
});
