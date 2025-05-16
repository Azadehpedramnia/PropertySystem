import React from 'react';

type MediaItemType = {
  id: number;
  filename: string;
  file_key: string;
  media_type: string;
};

export function MediaItem({
  item,
  onDelete,
}: {
  item: MediaItemType;
  onDelete: () => void;
}) {
  //const s3Url = `https://property-media-uploads.s3.eu-north-1.amazonaws.com/${item.file_key}`; 
  const cloudfrontUrl = `https://d1ng67xvpe0g4i.cloudfront.net/${item.file_key}`;

  return (
    <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
      <div>
        <p className="text-sm font-semibold">{item.filename}</p>
        <a
          href={cloudfrontUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 text-xs underline"
        >
          View / Download
        </a>
      </div>
      <button
        onClick={onDelete}
        className="text-xs px-2 py-1 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );
}
