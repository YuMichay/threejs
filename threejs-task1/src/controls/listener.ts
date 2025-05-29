import { AudioListener, Audio, AudioLoader } from 'three';

export const listener = new AudioListener();
export const sound = new Audio(listener);

const backgroundPlaylist = ['sounds/background1.mp3', 'sounds/background2.mp3'];
let currentTrack = 0;
let bufferLoaded: AudioBuffer | null = null;

export let isMusicOn = false;
let isPlaying = false;

const audioLoader = new AudioLoader();

export const startMusic = () => {
  isMusicOn = true;

  if (bufferLoaded && !isPlaying) {
    sound.setBuffer(bufferLoaded);
    sound.setLoop(false);
    sound.setVolume(0.5);
    sound.play();
    isPlaying = true;
  } else if (!bufferLoaded) {
    loadAndPlay();
  }
};

export const stopMusic = () => {
  isMusicOn = false;
  isPlaying = false;
  
  sound.stop();
};

export const pauseMusic = () => {
  sound.context.suspend();
};

export const resumeMusic = () => {
  sound.context.resume();
};

const loadAndPlay = () => {
  audioLoader.load(backgroundPlaylist[currentTrack], (buffer) => {
    bufferLoaded = buffer;
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5);
    sound.play();
    isPlaying = true;

    const source = sound.source;
    if (source) source.addEventListener('ended', handleEnded);
  });
};

const handleEnded = () => {
  currentTrack = (currentTrack + 1) % backgroundPlaylist.length;
  bufferLoaded = null;
  isPlaying = false;

  if (isMusicOn) {
    loadAndPlay();
  }
};
