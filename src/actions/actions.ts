"use server";

import { revalidatePath } from "next/cache";
import { Dispatch, SetStateAction } from "react";

export async function lighthouse(
  formData: FormData,
  setData: Dispatch<SetStateAction<{}>>
) {
  const url = formData.get("url") as string;
  let page = 1;
  let isDone = false;

  while (!isDone) {
    console.log(isDone, page);
    let params = `?page=${page}`;
    const result = await getPages(url, params);
    const totalPages = result?.response?.headers.get(
      "x-wp-totalpages"
    ) as string;

    const scores = await pageSpeed(result?.urls);
    setData((prev) => ({
      ...prev,
      scores
    }));
    revalidatePath("/");
    console.log(scores);
    if (page < parseInt(totalPages)) {
      page += 1;
    } else {
      isDone = true;
    }
  }
}

export async function pageSpeed(urls: string[]) {
  try {
    const promises = urls.map(async (url) => {
      const report = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile&category=accessibility&category=best-practices&category=performance&category=seo&key=AIzaSyBEQiaTL4wMnMCQA2WABjuIAOXLaL5LUo0`
      ).then((response) => {
        return response.json();
      });

      return {
        url,
        performance:
          report?.lighthouseResult?.categories?.performance?.score * 100,
        accessibility:
          report?.lighthouseResult?.categories?.accessibility?.score * 100,
        best_practices:
          report?.lighthouseResult?.categories?.["best-practices"]?.score * 100,
        seo: report?.lighthouseResult?.categories?.seo?.score * 100
      };
    });

    return await Promise.all(promises);
  } catch (error) {}
}

export async function getPages(url: string, params: string) {
  try {
    console.log(`${url}wp-json/wp/v2/pages${params}`);
    const response = await fetch(`${url}wp-json/wp/v2/pages${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const urls = data.map((page: any) => page.link);

    return { response, urls };
  } catch (error) {
    console.error(error);
  }
}
