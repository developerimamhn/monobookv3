"use client";

import { useEffect, useState } from "react";

type CopyEmailProps = { email: string; label: string; done: string };

/** For visitors without a mail app set up: copy the address instead. */
export function CopyEmail({ email, label, done }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = () => {
    navigator.clipboard?.writeText(email).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  };

  return (
    <>
      <button type="button" className="copy-email" onClick={copy}>
        {copied ? done : label}
      </button>
      <span className="visually-hidden" role="status">
        {copied ? done : ""}
      </span>
    </>
  );
}
