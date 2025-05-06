import React from 'react';

interface CreateProposalFormProps {
  personId: number;
  propertyId: number;
  personName: string;
  RecipiantName: string;
  RecipiantAddressFloor:string;
  RecipiantFirstLineAddress:string;
  RecipiantSecondLineAddress:string;
  RecipiantCity:string;
  RecipiantCounty:string;
  RecipiantPostcode:string;
  propertyAddress: string;

  onSuccess: () => void;
  onCancel: () => void;
}

const CreateProposalForm: React.FC<CreateProposalFormProps> = ({
  personId,
  propertyId,
  personName,
  RecipiantName,
  RecipiantAddressFloor,
  RecipiantFirstLineAddress,
  RecipiantSecondLineAddress,
  RecipiantCity,
  RecipiantCounty,
  RecipiantPostcode,
  propertyAddress,
  onSuccess,
  onCancel,
}) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const defaultBody = `
${currentDate}
${RecipiantName}
${RecipiantAddressFloor}
${RecipiantFirstLineAddress}
${RecipiantSecondLineAddress}
${RecipiantCity}
${RecipiantCounty}
${RecipiantPostcode}


Dear ${RecipiantName},

Re: Offer of Rates Mitigation for ${propertyAddress} subject to contract.

At Humanitarian Operations Charity Reg. No. 1183873 in England and Wales and Reg No. SC053273 in Scotland, we specialise in identifying and implementing legitimate strategic measures that align with our charitable objectives and local regulations to leverage available incentives to bring about substantial savings for your clients.

I would like to extend an offer to reduce your client’s current business rates burden up to 60% of business rates, whilst they continue to market their vacant property with your firm to secure a rent-paying client.  

Whilst you continue to market your client’s property, we would occupy the property on a flexible contract that provides your client with a 14-day break clause in the event that a rent-paying tenant is found. We would assume all normal obligations and provide all standard indemnities during the contract term.

Key Highlights of Our Offer:
1. Free Customised Rates Mitigation Plan: In using the property for charitable benefit, we provide your client with a personalised rates mitigation plan tailored to the specific characteristics of this property, ensuring compliance with our charitable objectives and all local regulations.
2. Uninterrupted Marketing: Please continue marketing the property for a more profitable tenant whilst we are in occupation. We are happy to receive minimal notice (1 or 2 hours) of viewings but we must be mindful of our safeguarding obligations.
3. Business Rates Saving: 60% of the business rates payable in saving per calendar month, during the term of the agreement. Humanitarian Operations is paid by your Client, 40% of the business rates normally payable, on the last working day of every month. Your Client will no longer be responsible for paying the local authority during the term of the agreement.
4. Immediate Start Date: As soon as legal agreements are concluded in a matter of days.
5. Flexible Term Lengths: The length of the agreement can be as short or as long as your Client wishes. We are happy to extend it until the end of your Client’s lease and understand that dilapidation work may need to be undertaken in the final months of our agreement.
6. Flexible Landlord Break Clauses: Your client will be able to obtain vacant possession by serving us with 14 days notice by email. We will always vacate as soon as possible upon receipt of any such notice. The only reason that we can terminate the contract is if legislation is introduced that adversely affects the cost borne by us for operating from the property and as a charity we would be expected to require such protection.
7. Choice of Agreement: Your client may choose whether the contract is a license or a lease.
8. Type of Use: We will utilise the premises for either our charity’s Executive Leadership, Administrative and Operations, Finance and Accounting, Fundraising and Development, Programs and Services, Advocacy and Public Policy, Legal and Compliance, Research and Evaluation, Education and Training, Community Engagement, AR User & Product Testing. Likewise, we will utilise the premises for the development and production of our charitable TV show "Little Heroes, Big Mission”
9. Ability to Scale: We can start with a small or large square footage area and scale up or down according to your Client’s needs.
10. Damage Liability: We will be financially liable for any damage caused during our occupancy. We have an in-house team of contractors that we utilise to mitigate this risk.
11. Utilities: We will transfer utilities into our name and pay for unit per charge for our utilities costs during the term of the agreement. We only expect our clients to pay for the standing charges with regards to electricity.

Next Steps:
Our team is enthusiastic about identifying a suitable location for our organisation's development hub. We look forward to collaborating with you to enhance the financial performance of your property and minimise your client's expenditures through effective rates mitigation strategies.

Please feel free to contact me directly at property@humanitarianorganisations.com or 07541 785787 to schedule a meeting or discuss any aspects of this proposal.

What we have not been able to summarise in this document is the CSR and marketing benefit of helping a charity creatively run by 12 children achieve their charitable missions on a televised show. The children would also like to discuss working closely with The Body Shop on a product development offering that fits very neatly into their portfolio using Child developed AI driven digital character that lives in a world of Augmented Reality. For this reason alone it would be well worth scheduling a meeting.

Thank you for your consideration of our offer.

Kind regards,  
Darren Adler  
Senior Trustee  
Humanitarian Operations  

Mark Palmer  
Senior Trustee  
Humanitarian Operations
`.trim();

  const [body, setBody] = React.useState(defaultBody);
  //${RecipiantName.split(' ')[0]}
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

    <div  className="container-fluid vh-100 d-flex flex-column p-4">
        <img
          src="/images/Hope.png"
          alt="Hope Logo"
          style={{ maxWidth: '150px', height: 'auto' ,marginBottom : 30}}
        />



      {/*<h4 className="font-semibold mb-2">Create Proposal for {personName}</h4>*/}
      <textarea
        className="form-control flex-grow-1 mb-3"
        style={{ minHeight: '0', height: '100%', resize: 'none' }}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-success px-4" onClick={handleSubmit}>
          Submit
        </button>
        <button className="btn btn-secondary px-4" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateProposalForm;
