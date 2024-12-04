"use client";
import { getPages, pageSpeed } from "@/actions/actions";
import SubmitButton from "@/components/SubmitButton";
import { useState } from "react";

type TD = {
  url: string;
  performance: number;
  accessibility: number;
  best_practices: number;
  seo: number;
};
type TData = TD[] | undefined;

export default function Home() {
  const [data, setData] = useState<TData>([]);

  const onFormSubmit = async (formData: FormData) => {
    // await lighthouse(formData, setData);
    const url = formData.get("url") as string;
    let page = 1;
    let isDone = false;

    try {
      while (!isDone) {
        console.log(isDone, page);
        const query = `?page=${page}`;
        const result = await getPages(url, query);
        const totalPages = result?.totalPages as string;

        const scores = await pageSpeed(result?.urls);
        setData((prev) => [...(prev as []), ...(scores as [])]);

        console.log(typeof scores, scores);
        if (page < parseInt(totalPages)) {
          page += 1;
        } else {
          isDone = true;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-200 text-xl p-10">
      <h1 className="text-4xl pb-10 font-extrabold">Pagespeed App</h1>
      <div className="shadow-md rounded-md flex flex-col p-10 bg-white gap-4 w-9/12">
        <form action={onFormSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter WP Website URL"
            className="border rounded-md p-2"
            name="url"
          />
          <SubmitButton />
        </form>

        {data !== undefined && data.length > 0 && (
          <table>
            <tbody>
              <tr>
                <th>URL</th>
                <th>Performance</th>
                <th>Accessability</th>
                <th>Best Practices</th>
                <th>SEO</th>
              </tr>
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{`${i + 1}.) ${d?.url}`}</td>
                  <td>{d?.performance}</td>
                  <td>{d?.accessibility}</td>
                  <td>{d?.best_practices}</td>
                  <td>{d?.seo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
