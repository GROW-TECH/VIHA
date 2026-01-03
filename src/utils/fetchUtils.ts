export async function safeFetch(url: string, options: any = {}) {
  const finalOptions: any = {
    ...options,
    headers: options.headers || {}
  };

  if (!(options.body instanceof FormData)) {
    finalOptions.headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, finalOptions);
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
