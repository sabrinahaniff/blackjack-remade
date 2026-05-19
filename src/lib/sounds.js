const ctx = new (window.AudioContext || window.webkitAudioContext)();

function resume() {
  if (ctx.state === 'suspended') ctx.resume();
}

function playTone({ frequency = 440, type = 'sine', duration = 0.1, gain = 0.3, delay = 0 }) {
  resume();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  g.gain.setValueAtTime(0, ctx.currentTime + delay);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

function playNoise({ duration = 0.05, gain = 0.15, delay = 0 }) {
  resume();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  source.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(gain, ctx.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  source.start(ctx.currentTime + delay);
  source.stop(ctx.currentTime + delay + duration + 0.05);
}

export const sounds = {
  deal() {
    playNoise({ duration: 0.06, gain: 0.2 });
    playTone({ frequency: 900, type: 'triangle', duration: 0.05, gain: 0.1, delay: 0.02 });
  },
  chip() {
    playTone({ frequency: 1200, type: 'sine', duration: 0.08, gain: 0.15 });
    playTone({ frequency: 900, type: 'sine', duration: 0.06, gain: 0.1, delay: 0.04 });
  },
  win() {
    [0, 0.12, 0.24].forEach((delay, i) => {
      playTone({ frequency: [523, 659, 784][i], type: 'sine', duration: 0.25, gain: 0.2, delay });
    });
  },
  blackjack() {
    [0, 0.1, 0.2, 0.32].forEach((delay, i) => {
      playTone({ frequency: [523, 659, 784, 1047][i], type: 'sine', duration: 0.3, gain: 0.25, delay });
    });
  },
  lose() {
    playTone({ frequency: 300, type: 'sawtooth', duration: 0.3, gain: 0.15 });
    playTone({ frequency: 220, type: 'sawtooth', duration: 0.4, gain: 0.1, delay: 0.15 });
  },
  push() {
    playTone({ frequency: 440, type: 'sine', duration: 0.2, gain: 0.12 });
  },
  flip() {
    playNoise({ duration: 0.08, gain: 0.12 });
    playTone({ frequency: 600, type: 'triangle', duration: 0.06, gain: 0.08, delay: 0.03 });
  },
};