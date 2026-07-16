
class KeyboardManager {
  constructor() {
    this.listeners = new Map();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  handleKeyDown(event) {
    
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
      return;
    }

    const key = event.key;
    if (this.listeners.has(key)) {
      const callbacks = this.listeners.get(key);
      callbacks.forEach(callback => callback(event));
    }
  }

  on(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
  }

  off(key, callback) {
    if (!this.listeners.has(key)) return;
    const callbacks = this.listeners.get(key);
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }
}

export const keyboardManager = new KeyboardManager();
