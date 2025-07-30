export function extractBody(message: any): string {
  function findBody(part: any): string | null {
    if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
      if (part.body?.data) {
        const base64 = part.body.data.replace(/-/g, "+").replace(/_/g, "/");
        return Buffer.from(base64, "base64").toString("utf-8");
      }
    }

    if (part.parts && Array.isArray(part.parts)) {
      for (const p of part.parts) {
        const result = findBody(p);
        if (result) return result;
      }
    }

    return null;
  }

  // Try flat body first
  if (message.payload?.body?.data) {
    const base64 = message.payload.body.data
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    return Buffer.from(base64, "base64").toString("utf-8");
  }

  // Try multipart
  const result = findBody(message.payload);
  return result ?? "";
}
