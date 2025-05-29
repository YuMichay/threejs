import { AudioListener, Audio, AudioLoader } from 'three';
import { hearts } from '../objects/animated/hearts/hearts';

export const listener = new AudioListener();
export const backgroundMusic = new Audio(listener);
export const footstepsEffect = new Audio(listener);
export const singEffect = new Audio(listener);
export const collectingInProgressEffect = new Audio(listener);
export const collectedCoinEffect = new Audio(listener);
export const winEffect = new Audio(listener);
export const loseEffect = new Audio(listener);

const backgroundPlaylist = ['sounds/background1.mp3', 'sounds/background2.mp3'];
let currentTrack = 0;
let bufferLoaded: AudioBuffer | null = null;
let singBuffer: AudioBuffer | null = null;

export let isMusicOn = false;
let isPlaying = false;

const audioLoader = new AudioLoader();

// BACKGROUND MUSIC LOGIC

export const startMusic = () => {
  isMusicOn = true;

  if (bufferLoaded && !isPlaying) {
    backgroundMusic.setBuffer(bufferLoaded);
    backgroundMusic.setLoop(false);
    backgroundMusic.setVolume(0.5);
    backgroundMusic.play();
    isPlaying = true;
  } else if (!bufferLoaded) {
    loadAndPlay();
  }
};

export const stopMusic = () => {
  isMusicOn = false;
  isPlaying = false;
  
  backgroundMusic.stop();
};

export const pauseMusic = () => {
  backgroundMusic.context.suspend();
};

export const resumeMusic = () => {
  backgroundMusic.context.resume();
};

const loadAndPlay = () => {
  audioLoader.load(backgroundPlaylist[currentTrack], (buffer) => {
    bufferLoaded = buffer;
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(false);
    backgroundMusic.setVolume(0.5);
    backgroundMusic.play();
    isPlaying = true;

    const source = backgroundMusic.source;
    if (source) source.addEventListener('ended', handleEnded);
  });
};

const handleEnded = () => {
  currentTrack = (currentTrack + 1) % backgroundPlaylist.length;
  bufferLoaded = null;
  isPlaying = false;

  if (isMusicOn) loadAndPlay();
};

// SOUND EFFECTS LOADING
audioLoader.load('sounds/step.mp3', (buffer) => {
  footstepsEffect.setBuffer(buffer);
  footstepsEffect.setVolume(0.1);
  footstepsEffect.setPlaybackRate(2);
  footstepsEffect.setLoop(true);
});
audioLoader.load('sounds/sing.mp3', (buffer) => {
  singBuffer = buffer;
  singEffect.setBuffer(buffer);
  singEffect.setVolume(0.5);
  singEffect.setLoop(false);

  singEffect.onEnded = () => {
    if (backgroundMusic.isPlaying) backgroundMusic.setVolume(0.5);
    hearts.setActive(false);
  };
});
audioLoader.load('sounds/collecting.mp3', (buffer) => {
  collectingInProgressEffect.setBuffer(buffer);
  collectingInProgressEffect.setVolume(0.3);
  collectingInProgressEffect.setLoop(true);
});
audioLoader.load('sounds/coin-recieved.mp3', (buffer) => {
  collectedCoinEffect.setBuffer(buffer);
  collectedCoinEffect.setVolume(0.2);
  collectedCoinEffect.setLoop(false);
});
audioLoader.load('sounds/gwenchana-win.mp3', (buffer) => {
  winEffect.setBuffer(buffer);
  winEffect.setVolume(3);
  winEffect.setLoop(false);
});
audioLoader.load('sounds/gwenchana-lose.mp3', (buffer) => {
  loseEffect.setBuffer(buffer);
  loseEffect.setVolume(4);
  loseEffect.setLoop(false);
});

export const playSingEffect = () => {
  backgroundMusic.setVolume(0);

  if (singBuffer) {
    singEffect.stop();
    singEffect.setBuffer(singBuffer);
    singEffect.play();

    singEffect.onEnded = () => {
      if (isPlaying) backgroundMusic.setVolume(0.5);
      hearts.setActive(false);
    };
  }
}

export const stopAllEffects = () => {
  if (footstepsEffect.isPlaying) footstepsEffect.stop();
  if (singEffect.isPlaying) singEffect.stop();
  if (collectingInProgressEffect.isPlaying) collectingInProgressEffect.stop();
  if (collectedCoinEffect.isPlaying) collectedCoinEffect.stop();
}