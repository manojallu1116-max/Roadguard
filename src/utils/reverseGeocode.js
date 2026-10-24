const MIN_REQUEST_INTERVAL_MS = 1100;
let lastRequestAt = 0;

function waitForNextRequest(signal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Address lookup cancelled', 'AbortError'));
  }

  const delay = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
  if (delay === 0) return Promise.resolve();

  return new Promise((resolve, reject) => {
    let timeout;
    const onAbort = () => {
      clearTimeout(timeout);
      reject(new DOMException('Address lookup cancelled', 'AbortError'));
    };

    timeout = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, delay);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export async function reverseGeocode({ lat, lng }, { signal } = {}) {
  const requestController = new AbortController();
  const abortLookup = () => requestController.abort();
  signal?.addEventListener('abort', abortLookup, { once: true });
  const timeout = setTimeout(() => {
    requestController.abort(new DOMException('Address lookup timed out', 'TimeoutError'));
  }, 10000);

  try {
    await waitForNextRequest(requestController.signal);
    if (requestController.signal.aborted) throw requestController.signal.reason;

    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: String(lat),
      lon: String(lng),
      addressdetails: '1'
    });

    lastRequestAt = Date.now();
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: { 'Accept-Language': navigator.language || 'en' },
      signal: requestController.signal
    });

    if (!response.ok) throw new Error(`Address lookup failed (${response.status})`);

    const result = await response.json();
    return typeof result.display_name === 'string' ? result.display_name.trim() : '';
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortLookup);
  }
}
