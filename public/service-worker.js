const EXCLUDED_ENDPOINTS = [
  "/token/",
  "/users/signin",
  "/users/signup",
];

let apiBaseUrl = "";
let accessToken = null;

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const { type, message } = event.data;

  switch (type) {
    case "SET_API_BASE_URL":
      apiBaseUrl = message;
      break;
    case "SET_ACCESS_TOKEN":
      accessToken = message;
      break;
    case "RESET_ACCESS_TOKEN":
      accessToken = null;
      break;
    default:
      break;
  }

});

const shouldAttachAuthHeader = (url) => {
  return (
    apiBaseUrl != "" &&
    url.startsWith(apiBaseUrl) &&
    !EXCLUDED_ENDPOINTS.some((endpoint) => url.includes(endpoint))
  );
};

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (shouldAttachAuthHeader(request.url)) {
    event.respondWith(
      (async () => {
        if (accessToken) {
          const modifiedRequest = new Request(request, {
            headers: new Headers({
              ...Object.fromEntries(request.headers.entries()),
              Authorization: `Bearer ${accessToken}`
            })
          });

          return fetch(modifiedRequest);
        } else {
          return fetch(request);
        }
      })()
    );
  }
});
