/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import nodeHtmlToImage from "../lib/node-html-to-image";
import { uploadNew } from "../lib/s3";

export interface GeneratorPayload {
  fingerprint: string;
  content: string;
  timestamp: string;
  bucket: string;
}

export default (body: string) =>
  (async () => {
    const { fingerprint, content, timestamp, bucket } = JSON.parse(body);

    const img = await nodeHtmlToImage({ fingerprint, content, timestamp });

    return await uploadNew(bucket, img, ".png");
  })();
