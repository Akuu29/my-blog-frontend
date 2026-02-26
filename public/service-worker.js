const EXCLUDED_ENDPOINTS = [
  "/token",
  "/users/signin",
  "/users/signup",
];

let apiBaseUrl = "";
let accessToken = null;
let refreshTokenPromise = null;

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const { type, message } = event.data;

  switch (type) {
    case "SET_API_BASE_URL":
      apiBaseUrl = message;
      break;
    case "RESET_ACCESS_TOKEN":
      accessToken = null;
      refreshTokenPromise = null;
      break;
    default:
      break;
  }
});

const shouldAttachAuthHeader = (url) => {
  try {
    const urlObj = new URL(url);
    const normalizedUrl = urlObj.pathname.replace(/\/$/, "");

    return (
      apiBaseUrl !== "" &&
      url.startsWith(apiBaseUrl) &&
      !EXCLUDED_ENDPOINTS.some((endpoint) => normalizedUrl.startsWith(endpoint))
    );
  } catch {
    return false;
  }
};

const getOrRefreshToken = () => {
  if (accessToken) {
    return Promise.resolve(accessToken);
  }

  if (!refreshTokenPromise) {
    refreshTokenPromise = fetch(`${apiBaseUrl}/token/refresh`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token refresh failed");
        }
        return response.json();
      })
      .then((data) => {
        accessToken = data.accessToken;
        refreshTokenPromise = null;
        return accessToken;
      })
      .catch((err) => {
        refreshTokenPromise = null;
        throw err;
      });
  }

  return refreshTokenPromise;
};

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (shouldAttachAuthHeader(request.url)) {
    event.respondWith(
      getOrRefreshToken()
        .then((token) => {
          const modifiedRequest = new Request(request, {
            headers: new Headers({
              ...Object.fromEntries(request.headers.entries()),
              Authorization: `Bearer ${token}`
            })
          });
          return fetch(modifiedRequest);
        })
        .catch(() => fetch(request))
    );
  }
});
