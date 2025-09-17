type JwtPayload = {
  [key: string]: unknown;
};

function decodeBase64Url(base64Url: string): string | null {
  try {
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return atob(padded);
  } catch (_e) {
    return null;
  }
}

function parseJwt(tokenString: string): JwtPayload | null {
  const parts = tokenString.split(".");
  if (parts.length !== 3) return null;

  const payloadJson = decodeBase64Url(parts[1]);
  if (!payloadJson) return null;

  try {
    return JSON.parse(payloadJson) as JwtPayload;
  } catch (_e) {
    return null;
  }
}

export function extractUserIdFromAccessToken(tokenString: string): string | null {
  const payload = parseJwt(tokenString);
  if (!payload) return null;

  const candidates = [
    payload["userId"],
    payload["uid"],
    payload["sub"],
    payload["id"],
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate;
    }
    if (typeof candidate === "number") {
      return String(candidate);
    }
  }

  return null;
}
