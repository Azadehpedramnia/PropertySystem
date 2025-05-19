import React, { useState } from 'react'
import BuildingModelViewer from '../Dashboard/BuildingModelViewer'

type MediaItemType = {
  id: number
  filename: string
  file_key: string
  media_type: string     // e.g. "model/gltf-binary" or "video/mp4"
}

export function MediaItem({
  item,
  onDelete,
}: {
  item: MediaItemType
  onDelete: () => void
}) {
  const [viewerActive, setViewerActive] = useState(false)
  const url = `https://d1ng67xvpe0g4i.cloudfront.net/${item.file_key}`

  // simple helpers
  const isVideo = item.media_type.startsWith('video')
  const isModel =
    item.media_type === 'model/gltf-binary' ||
    item.filename.toLowerCase().endsWith('.glb') ||
    item.filename.toLowerCase().endsWith('.gltf')

  // control the extra address things for media
  const displayName = item.filename.replace(
    /^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}-/,
    ''
  );

  return (
    <div className="mb-4">
      {/* filename + controls */}
      <div className="d-flex align-items-center justify-content-between bg-light border rounded px-3 py-2">
        <div className="text-truncate me-3" style={{ maxWidth: '60%' }}>
          <strong className="text-dark">{displayName}</strong>
        </div>
        <div className="d-flex gap-2">
          {(isVideo || isModel) && (
            <button
              onClick={() => setViewerActive((v) => !v)}
              className="btn btn-sm btn-secondary"
            >
              {viewerActive ? 'Hide' : 'View'}
            </button>
          )}
          <button onClick={onDelete} className="btn btn-sm btn-dark">
            Delete
          </button>
        </div>
      </div>

      {/* viewer panel */}
      {viewerActive && isVideo && (
        <div className="mt-2 w-100" style={{ height: 400 }}>
          <video
            src={url}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

      {viewerActive && isModel && (
        <div className="mt-2 w-100" style={{ height: 400 ,  
              position: 'relative',
              overflow: 'hidden',}}>
          <BuildingModelViewer
            modelPath={url} 
          />
        </div>
        
      )}

      {!isVideo && !isModel && (
        <div className="mt-2 text-muted">Unsupported media type: {item.media_type}</div>
      )}
    </div>
  )
}
