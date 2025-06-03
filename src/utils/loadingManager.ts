import { LoadingManager } from 'three';

export const loadingManager = new LoadingManager();

loadingManager.onStart = function ( _url, _itemsLoaded ) {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'flex';
};