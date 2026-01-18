export async function fetchWithRetry(url: string, opts: RequestInit = {}, attempts = 3, timeoutMs = 8000) {
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      clearTimeout(id);
      if (i === attempts - 1) throw err;
      await sleep(500 * Math.pow(2, i)); // exponential backoff
    }
  }
  throw new Error('Unreachable');
}
