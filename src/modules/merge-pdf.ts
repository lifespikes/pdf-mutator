/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import { pdfFromS3URL } from "../lib/pdf-modifiers";
import { PDFDocument } from "pdf-lib";
import { uploadNew } from "../lib/s3";

interface MergePdfPayload {
  files: string[];
}

export default (body: string) =>
  (async () => {
    const { files }: MergePdfPayload = JSON.parse(body);

    const documents = await Promise.all(
      files.reverse().map(async (uri) => await pdfFromS3URL(uri))
    );

    const newPdf = await PDFDocument.create();

    for (const doc of documents) {
      const pages = await newPdf.copyPages(doc, doc.getPageIndices());

      for (const page of pages) {
        newPdf.addPage(page);
      }
    }

    return await uploadNew(await newPdf.save(), ".png");
  })();
