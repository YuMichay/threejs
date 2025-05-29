import { LoadingManager } from 'three';

export const loadingManager = new LoadingManager();

loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'flex';
};