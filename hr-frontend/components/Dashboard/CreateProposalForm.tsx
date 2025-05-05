import React from 'react';

interface CreateProposalFormProps {
  personId: number;
  propertyId: number;
  personName:string;
  RecipiantName: string;
  RecipiantAddress:string;
  propertyAddress:string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateProposalForm: React.FC<CreateProposalFormProps> = ({
  personId,
  propertyId,
  personName,
  RecipiantName,
  RecipiantAddress,
  propertyAddress,
  onSuccess,
  onCancel,
}) => {
  const [body, setBody] = React.useState(
      `Dear ${RecipiantName} with adress: ${RecipiantAddress},\nWe are writing regarding the property at ${propertyAddress}.`
  );

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5000/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personId,
        propertyId,
        proposalData: {
          date: new Date().toISOString().split('T')[0],
          body,
        },
      }),
    });

    if (res.ok) {
      alert('Proposal created successfully!');
      onSuccess();
    } else {
      alert('Failed to create proposal');
    }
  };

  return (
    <div className="mt-2 p-3 border border-blue-300 rounded bg-white">
      <h4 className="font-semibold mb-2">Create Proposal for {personName}</h4>
      <textarea
        className="w-full border p-2"
        rows={6}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="mt-2 flex gap-2">
        <button className="bg-green-300 px-4 py-2 rounded" onClick={handleSubmit}>
          Submit
        </button>
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateProposalForm;
