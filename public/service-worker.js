const EXCLUDED_ENDPOINTS = [
  "/token",
  "/users/signin",
  "/users/signup",
];

const apiBaseUrl = new URL(self.location.href).searchParams.get("apiBaseUrl") || "";
let accessToken = null;
let refreshTokenPromise = null;

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const { type } = event.data;

  switch (type) {
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

const refreshAccessToken = async () => {
  const response = await fetch(`${apiBaseUrl}/token/refresh`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Token refresh failed");
  const { accessToken: token } = await response.json();

  return token;
};

const getOrRefreshToken = () => {
  if (accessToken) return Promise.resolve(accessToken);

  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshAccessToken()
      .then((token) => {
        accessToken = token;
        return token;
      })
      .finally(() => {
        refreshTokenPromise = null;
      });
  }

  return refreshTokenPromise;
};

const makeAuthRequest = (req, token) => new Request(req, {
  headers: new Headers({
    ...Object.fromEntries(req.headers.entries()),
    Authorization: `Bearer ${token}`
  })
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (!shouldAttachAuthHeader(request.url)) return;

  event.respondWith(
    (async () => {
      try {
        const token = await getOrRefreshToken();
        const response = await fetch(makeAuthRequest(request.clone(), token));

        if (response.status === 401) {
          accessToken = null;
          refreshTokenPromise = null;
          try {
            const newToken = await getOrRefreshToken();
            return fetch(makeAuthRequest(request, newToken));
          } catch {
            return response;
          }
        }

        return response;
      } catch {
        return fetch(request);
      }
    })()
  );
});
