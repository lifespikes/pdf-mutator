import { Page } from "puppeteer-core";
import { compile } from "handlebars";
import { MakeScreenshotParams } from "./types";

export async function makeScreenshot(
  page: Page,
  { screenshot }: MakeScreenshotParams
) {
  if (screenshot?.content) {
    const template = compile(screenshot.html);
    screenshot.setHTML(template(screenshot.content));
  }

  await page.setContent(screenshot.html);
  await page.waitForSelector(screenshot.selector);

  const element = await page.$(screenshot.selector);

  if (!element) {
    throw Error("No element matches selector: " + screenshot.selector);
  }

  const buffer = await element.screenshot({
    path: screenshot.output,
    type: screenshot.type,
    omitBackground: screenshot.transparent,
    encoding: screenshot.encoding,
    quality: screenshot.quality,
  });

  if (buffer) {
    screenshot.setBuffer(buffer);
  } else {
    throw new Error("Screenshot failed");
  }

  return screenshot;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFunction(f: any) {
  return f && typeof f === "function";
}
