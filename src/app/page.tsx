"use client";
import { lighthouse } from "@/actions/actions";
import { useState } from "react";

export default function Home(props: any) {
  const [data, setData] = useState({});
  const onFormSubmit = async (formData: FormData) => {
    await lighthouse(formData, setData);
  };
  console.log(data);
  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-slate-200 text-xl">
      <h1 className="text-4xl pb-10 font-extrabold">Pagespeed App</h1>
      <div className="shadow-md rounded-md flex flex-col p-10 bg-white gap-4 w-1/3 max-xl:w-2/3 ">
        <form action={onFormSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter WP Website URL"
            className="border rounded-md p-2"
            name="url"
          />
          <button className="border bg-blue-900 color text-white p-4 rounded-md text-sm font-semibold uppercase hover:bg-sky-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
