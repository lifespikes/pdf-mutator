import chromium from "@sparticuz/chrome-aws-lambda";
import { readFileSync } from "fs";

export default async function nodeHtmlToImage(content: Record<string, string>) {
  const selector = "#container";
  const html = readFileSync(__dirname + "/../../assets/signature.html", "utf8");
  const matches = [...html.matchAll(/{{([A-z]*)}}/g)];
  const processed = matches.reduce<string>((acc, [str, key]) => {
    return acc.replace(str, content[key]);
  }, html);

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setContent(processed, { waitUntil: "networkidle2" });
  const element = await page.$(selector);

  if (!element) {
    throw Error("No element matches selector: " + selector);
  }

  const buffer = await element.screenshot({
    type: "jpeg",
  });

  await browser.close();

  return buffer;
}
