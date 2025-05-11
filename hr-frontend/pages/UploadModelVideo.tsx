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


        <div className="container mt-5">
            <h1>Grouped Properties</h1>
                <PropertyGroupList />
        </div>

    </div>

    
  );
}
