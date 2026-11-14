// --- 音效（WebAudio，無外部檔案）---
import { KEY } from '../config.js';
import { rd, wr, rnd } from './util.js';

let AC;
export let mute = rd(KEY.mute, false);
export const setMute = m => { mute = m; wr(KEY.mute, m); };

const ac = () => { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; };

// 白噪音（拆信、紙張、竹籤碰撞、郵戳）
export function noise(d = .15, f = 3000, q = 1, vol = .25, delay = 0) {
  if (mute) return;
  try {
    const A = ac(), n = Math.floor(A.sampleRate * d), b = A.createBuffer(1, n, A.sampleRate), a = b.getChannelData(0);
    for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const s = A.createBufferSource(), fl = A.createBiquadFilter(), g = A.createGain();
    s.buffer = b; fl.type = 'bandpass'; fl.frequency.value = f; fl.Q.value = q; g.gain.value = vol;
    s.connect(fl); fl.connect(g); g.connect(A.destination); s.start(A.currentTime + delay);
  } catch { }
}

export function beep(f = 600, d = .1, t = 'sine') {
  if (mute) return;
  try {
    ac();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(.12, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + d);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d);
  } catch { }
}

export const clack = () => { noise(.05, rnd(1800, 3200), 9, .9); beep(rnd(900, 1400), .025, 'square'); };
export const fanfare = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .25, 'triangle'), i * 110));
