class HapticsManager {
  constructor() {
    this.enabled = true;
    this.supported = 'vibrate' in navigator;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  vibrate(pattern) {
    if (!this.enabled || !this.supported) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibración no soportada:', error);
    }
  }

  light() {
    this.vibrate(10);
  }

  medium() {
    this.vibrate(20);
  }

  heavy() {
    this.vibrate(50);
  }

  success() {
    this.vibrate([10, 50, 10]);
  }

  error() {
    this.vibrate([50, 100, 50]);
  }

  selection() {
    this.vibrate(5);
  }
}

export default new HapticsManager();
