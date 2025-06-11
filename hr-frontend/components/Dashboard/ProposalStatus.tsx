import React, { useEffect, useState } from 'react';

interface ProposalStatusProps {
    personId: number;
    propertyId: number;
    refreshKey?: number;
  }
  
  const ProposalStatus: React.FC<ProposalStatusProps> = ({ personId, propertyId, refreshKey }) => {
    const [status, setStatus] = useState<string>('Loading...');
  
    useEffect(() => {
      async function fetchStatus() {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proposals/latest?personId=${personId}&propertyId=${propertyId}`
          );
          if (res.ok) {
            const data = await res.json();
            setStatus(data.status || 'Unknown');
          } else {
            setStatus('No proposal');
          }
        } catch {
          setStatus('Error');
        }
      }
  
      fetchStatus();
    }, [personId, propertyId, refreshKey]); // 👈 this is new!
  
    return <p><strong>Proposal Status:</strong> {status}</p>;
  };

export default ProposalStatus;
