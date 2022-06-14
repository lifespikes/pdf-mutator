import { Options } from "./types";
import { makeScreenshot } from "./screenshot";
import { Screenshot } from "./models/Screenshot";
import chromium from "@sparticuz/chrome-aws-lambda";

export default async function nodeHtmlToImage(options: Options) {
  const {
    html,
    encoding,
    transparent,
    content,
    output,
    selector,
    type,
    quality,
    puppeteerArgs = {},
  } = options;

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ...puppeteerArgs,
  });

  try {
    const page = await browser.newPage();

    const buffer = (
      await makeScreenshot(page, {
        ...options,
        screenshot: new Screenshot({
          html,
          encoding,
          transparent,
          output,
          content,
          selector,
          type,
          quality,
        }),
      })
    ).buffer;
    await browser.close();

    return buffer;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
