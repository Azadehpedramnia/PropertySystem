import { useEffect, useState } from "react";

type Invoice = {
  id: number;
  landlord_name: string;
  pdf_filename: string;
  created_at: string;
  organisation_email: string;
};

export default function InvoiceEmailSelector() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("http://localhost:5000/api/invoices")
      .then(res => res.json())
      .then(setInvoices);
  }, []);

  const toggleSelection = (filename: string) => {
    const next = new Set(selected);
    next.has(filename) ? next.delete(filename) : next.add(filename);
    setSelected(next);
  };

  const sendSelectedInvoices = async () => {
    const pdfs = Array.from(selected);
    const response = await fetch("http://localhost:5000/api/email-invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfs })
    });
    if (response.ok) alert("Sent!");
    else alert("Email failed");
  };

  return (
    <div>
      <h2>Choose Invoices to Email</h2>
      <ul>
        {invoices.map(inv => (
          <li key={inv.id}>
            <label>
              <input
                type="checkbox"
                checked={selected.has(inv.pdf_filename)}
                onChange={() => toggleSelection(inv.pdf_filename)}
              />
              {inv.pdf_filename} ({inv.landlord_name}) - {inv.created_at}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={sendSelectedInvoices}>Send Selected Invoices</button>
    </div>
  );
}
