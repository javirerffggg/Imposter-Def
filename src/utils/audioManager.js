class AudioManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.context = null;
    this.gainNode = null;
  }

  init() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  async loadSound(name, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.sounds[name] = await this.context.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.warn(`No se pudo cargar el sonido ${name}:`, error);
    }
  }

  play(name, volume = 1.0) {
    if (!this.enabled || !this.sounds[name]) return;

    this.init();
    
    const source = this.context.createBufferSource();
    source.buffer = this.sounds[name];
    
    const gainNode = this.context.createGain();
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(this.gainNode);
    
    source.start(0);
  }

  // Sonidos sintéticos para no depender de archivos externos
  generateTone(frequency, duration, type = 'sine') {
    if (!this.enabled) return;
    
    this.init();
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }

  playClick() {
    this.generateTone(800, 0.05, 'sine');
  }

  playSuccess() {
    this.generateTone(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.generateTone(659.25, 0.2, 'sine'), 100); // E5
  }

  playError() {
    this.generateTone(200, 0.2, 'sawtooth');
  }

  playCardFlip() {
    this.generateTone(440, 0.1, 'triangle');
  }

  playReveal() {
    this.generateTone(329.63, 0.15, 'sine'); // E4
    setTimeout(() => this.generateTone(523.25, 0.2, 'sine'), 150); // C5
  }
}

export default new AudioManager();
