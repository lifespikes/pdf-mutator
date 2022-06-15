/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import nodeHtmlToImage from "../lib/node-html-to-image";
import * as fs from "fs"; // ONLY FOR HTML FILE RETRIEVAL!
import chromium from "@sparticuz/chrome-aws-lambda";
import { uploadNew } from "../lib/s3";

interface GeneratorPayload {
  fingerprint: string;
  content: string;
  timestamp: string;
}

export default (body: string) =>
  (async () => {
    const content: GeneratorPayload = JSON.parse(body) as Record<
      keyof GeneratorPayload,
      string
    >;

    const img = await nodeHtmlToImage({
      transparent: true,
      content,
      selector: "#container",
      html: fs.readFileSync(__dirname + "/../assets/signature.html", "utf8"),
      puppeteerArgs: {
        args: chromium.args,
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 3,
        },
        executablePath: await chromium.executablePath,
        headless: true,
      },
    });

    return await uploadNew(img, ".png");
  })();
