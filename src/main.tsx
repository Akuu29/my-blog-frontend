import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope);

        if (registration.active) {
          registration.active.postMessage({
            type: "SET_API_BASE_URL",
            message: API_BASE_URL
          });
        } else {
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({
                type: "SET_API_BASE_URL",
                message: API_BASE_URL
              });
            }
          });
        }
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
