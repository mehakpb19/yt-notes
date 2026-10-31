// Generate a cryptographically random session ID or key
function createSessionKey(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  // Convert bytes to a hex string
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

// Store the session key in browser session storage
export default function initSession(): string {
  const existingKey = sessionStorage.getItem("app_session_key");

  if (existingKey) {
    return existingKey;
  }

  const newKey = createSessionKey(32);
  sessionStorage.setItem("app_session_key", newKey);
  return newKey;
}

