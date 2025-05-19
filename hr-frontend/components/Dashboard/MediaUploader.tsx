{/*import React, { useState } from 'react';
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
*/}
import React, { useState, useRef } from 'react';
import { useMediaUpload } from '../../hooks/useMediaUpload';

export function MediaUploader({
  propertyId,
  onUploadComplete,
}: {
  propertyId: number;
  onUploadComplete?: () => void; // 🔹 optional callback
}) {
  const { getUploadUrl, completeUpload } = useMediaUpload();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // 🔹 reset file input

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setSuccess(false);
    setError(null);
  };

  const onUpload = async () => {
    if (!file) return;
    setUploading(true);
    setSuccess(false);
    setError(null);

    try {
      const mediaType = file.type.startsWith('video') ? 'video' : '3d-model';
      const { uploadUrl, key } = await getUploadUrl({
        propertyId,
        mediaType,
        filename: file.name,
        mimeType: file.type,
      });

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      await completeUpload({
        propertyId,
        key,
        mediaType,
        metadata: {},
      });

      setSuccess(true);
      setFile(null);
      fileInputRef.current?.value && (fileInputRef.current.value = ''); // 🔹 reset input

      // 🔹 Refresh media list in parent
      onUploadComplete?.();

      // 🔹 Hide success after 2 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="d-flex gap-2">
        <input type="file" onChange={onFileChange} ref={fileInputRef} />
        <button
          onClick={onUpload}
          disabled={!file || uploading}
          className="px-2 py-1 bg-primary text-white rounded"
        >
          {uploading ? 'Uploading…' : 'Upload Media'}
        </button>
      </div>

      {success && (
        <div className="alert alert-success py-1 px-2 mb-0">
          ✅ File uploaded successfully!
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-1 px-2 mb-0">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
