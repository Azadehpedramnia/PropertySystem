import React, { useState } from 'react';
import { useMediaUpload } from '../../hooks/useMediaUpload';

export function MediaUploader({ propertyId }: { propertyId: number }) {
  const { getUploadUrl, completeUpload } = useMediaUpload();
  const [file, setFile] = useState<File|null>(null);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const onUpload = async () => {
    if (!file) return;
    setUploading(true);

    const mediaType = file.type.startsWith('video') ? 'video' : '3d-model';
    const { uploadUrl, key } = await getUploadUrl({
      propertyId,
      mediaType,
      filename: file.name,
      mimeType: file.type
    });

    // upload to S3 (or equivalent)
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    });

    // record in your DB
    await completeUpload({ propertyId, key, mediaType, metadata: {} });

    setUploading(false);
    setFile(null);
  };

  return (
    <div className="flex items-center space-x-2">
      <input type="file" onChange={onFileChange} />
      <button
        onClick={onUpload}
        disabled={!file || uploading}
        className="px-2 py-1 bg-blue-600 text-black rounded"
      >
        {uploading ? 'Uploading…' : 'Upload Media'}
      </button>
    </div>
  );
}
