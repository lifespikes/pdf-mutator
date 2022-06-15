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
      "--autoplay-policy=user-gesture-required",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-dev-shm-usage",
      "--disable-domain-reliability",
      "--disable-extensions",
      "--disable-features=AudioServiceOutOfProcess",
      "--disable-hang-monitor",
      "--disable-ipc-flooding-protection",
      "--disable-notifications",
      "--disable-offer-store-unmasked-wallet-cards",
      "--disable-popup-blocking",
      "--disable-print-preview",
      "--disable-prompt-on-repost",
      "--disable-renderer-backgrounding",
      "--disable-setuid-sandbox",
      "--disable-speech-api",
      "--disable-sync",
      "--hide-scrollbars",
      "--ignore-gpu-blacklist",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-first-run",
      "--no-pings",
      "--no-sandbox",
      "--no-zygote",
      "--password-store=basic",
      "--use-gl=swiftshader",
      "--use-mock-keychain",
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
