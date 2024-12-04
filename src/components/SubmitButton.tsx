"use client";

import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className={`border bg-blue-900 color text-white p-4 rounded-md text-sm font-semibold uppercase hover:bg-sky-700 ${
        pending ? "bg-slate-200 hover:bg-slate-200" : ""
      }`}
      disabled={pending}
    >
      {pending ? `Processing...` : "Submit"}
    </button>
  );
};

export default SubmitButton;
