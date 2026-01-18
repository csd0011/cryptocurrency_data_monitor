export type FetchResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status?: number; error: string; body?: unknown };

export async function fetchWithRetry<T = unknown>(
  url: string,
  opts: RequestInit = {},
  attempts = 3,
  timeoutMs = 8000
): Promise<FetchResult<T>> {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(id);
      const ct = res.headers.get?.('content-type') ?? '';
      const body = ct.includes('application/json') ? await res.clone().json().catch(() => undefined) : await res.clone().text().catch(() => undefined);

      if (!res.ok) {
        return { ok: false, status: res.status, error: `HTTP ${res.status}`, body };
      }

      const data = ct.includes('application/json') ? await res.json() : (body as unknown);
      return { ok: true, status: res.status, data: data as T };
    } catch (err: any) {
      clearTimeout(id);
      const isLast = i === attempts - 1;
      const message = err?.name === 'AbortError' ? 'timeout' : (err?.message ?? String(err));
      if (isLast) return { ok: false, error: message };
      await sleep(5000 * Math.pow(2, i));
    }
  }

  return { ok: false, error: 'unreachable' };
}
