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
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
    ],
    defaultViewport: {
      width: 960,
      height: 540,
      deviceScaleFactor: 2,
    },
    executablePath: await chromium.executablePath,
    headless: true,
    ...puppeteerArgs,
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

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
