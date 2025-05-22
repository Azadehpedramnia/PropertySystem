import React from 'react';
import Link from 'next/link';

export default function InvoicePage() {
  return (
    <div className="container py-4">
      {/* Top row with title and button aligned */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Invoice Page</h1>
        <Link href="/dashboard">
          <button className="btn btn-secondary">Back to Dashboard</button>
        </Link>
      </div>

      <p>This is where your invoice content will go.</p>
    </div>
  );
}
