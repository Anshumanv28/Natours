/* eslint-disable */
import '@babel/polyfill';
import { login } from './login.js';
import { displayMap } from './maplibre.js';

// DOM ELEMENTS
const mapElement = document.getElementById('map');
const loginForm = document.querySelector('.form');

// DELEGATION
if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
