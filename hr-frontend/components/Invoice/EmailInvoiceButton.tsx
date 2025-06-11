// components/Invoice/EmailInvoiceButton.tsx

import { useState } from "react";

export default function EmailInvoiceButton({ organisation }: { organisation: string }) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmail = async () => {
    setSending(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/email-invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organisation }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setMessage("✅ Sent to organisation");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={handleEmail} disabled={sending}>
        {sending ? "Sending..." : "Email All Invoices"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
