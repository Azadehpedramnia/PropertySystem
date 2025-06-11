export function useMediaUpload() {

    const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
    const postJson = (url: string, body: any) =>
      fetch(`${API_BASE}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(r => r.json());
  
    const getUploadUrl = (body: {
      propertyId: number;
      mediaType: string;
      filename: string;
      mimeType: string;
    }) => postJson('/api/media/upload-url', body);
  
    const completeUpload = (body: {
      propertyId: number;
      key: string;
      mediaType: string;
      metadata: object;
    }) => postJson('/api/media/complete', body);
  
    return { getUploadUrl, completeUpload };
  }
  