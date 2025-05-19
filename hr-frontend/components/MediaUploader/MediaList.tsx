import React, { useEffect, useState } from 'react';
import { MediaItem } from './MediaItem';

type MediaItemType = {
  id: number;
  filename: string;
  file_key: string;
  media_type: string;
};


export function MediaList({
   propertyId,
   reloadTrigger, 
  }: {
    propertyId: number;
    reloadTrigger?: number;
  }) {
  const [media, setMedia] = useState<MediaItemType[]>([]);
  

  const loadMedia = async () => {
    const res = await fetch(`http://localhost:5000/api/media/property/${propertyId}`);
    const data = await res.json();
    setMedia(data);
  };

  useEffect(() => {
    loadMedia();
  }, [propertyId, reloadTrigger]);

  const handleDelete = async (mediaId: number) => {
    await fetch(`http://localhost:5000/api/media/${mediaId}`, { method: 'DELETE' });
    loadMedia();
  };

  return (
    <div className="mt-2 space-y-2">
      {media.length === 0 ? (
        <p className="text-sm text-gray-500">No media uploaded yet.</p>
      ) : (
        media.map(item => (
          
          <MediaItem
            key={item.id}
            item={item}
            onDelete={() => handleDelete(item.id)}
          />
        ))
      )}
    </div>
  );
}
