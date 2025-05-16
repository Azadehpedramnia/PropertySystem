import React from 'react';
import Link from 'next/link';
import PropertyGroupList from './PropertyGroupList';


export default function UploadModelVideo() {
  return (
    <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Welcome to the Model & Video Upload Page</h1>  
                <Link href="/" className="btn btn-Black-White">
                     ← Back to Welcome Page
        </Link>      
      </div>
      <p>Here you will be able to upload 3D models and building videos.</p>


       {/* Grouped Properties Section */}
    <div
  className="mt-5 p-4 rounded shadow-sm border"
  style={{ backgroundColor: '#fefefe' }}
>
  <h2 className="mb-4">Grouped Properties</h2>
  <PropertyGroupList />
</div>

    </div>

    
  );
}
