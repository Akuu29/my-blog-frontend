import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = `/service-worker.js?apiBaseUrl=${encodeURIComponent(API_BASE_URL)}`;
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
