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
  const cloudfrontUrl = `https://d1ng67xvpe0g4i.cloudfront.net/${item.file_key}`;

  return (
    <div className="d-flex align-items-center justify-content-between bg-light border rounded px-3 py-2 mb-2">
      <div className="text-truncate me-3" style={{ maxWidth: '40%' }}>
        <strong className="text-dark">{item.filename}</strong>
      </div>

      <div className="d-flex gap-2">
        <a
          href={cloudfrontUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm"
          style={{ backgroundColor: '#6c757d', color: 'white' }} // gray
        >
          View / Download
        </a>

        <button
          onClick={onDelete}
          className="btn btn-sm"
          style={{ backgroundColor: '#343a40', color: 'white' }} // dark gray
        >
          Delete
        </button>
      </div>
    </div>
  );
}
