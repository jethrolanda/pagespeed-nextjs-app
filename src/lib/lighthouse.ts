import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

export default async function (url: string) {
  return chromeLauncher.launch().then((chrome: any) => {
    const opts = {
      port: chrome.port
    };
    return lighthouse(url, opts).then((results: any) => {
      return chrome.kill().then(() => results.report);
    });
  });
}
