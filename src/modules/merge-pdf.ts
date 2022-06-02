/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import getStdin from "../lib/get-stdin";
import { pdfFromPath } from "../lib/pdf-modifiers";
import { PDFDocument } from "pdf-lib";
import * as fs from "node:fs/promises";

interface MergePdfPayload {
  output: string;
  files: string[];
}

export default () =>
  (async () => {
    const { output, files }: MergePdfPayload = JSON.parse(await getStdin());

    const documents = await Promise.all(
      files.map(async (path) => await pdfFromPath(path))
    );

    const newPdf = await PDFDocument.create();

    for (const doc of documents) {
      const pages = await newPdf.copyPages(doc, doc.getPageIndices());

      for (const page of pages) {
        newPdf.addPage(page);
      }
    }

    await fs.writeFile(output, await newPdf.save());

    console.log(JSON.stringify({ status: "OK" }));
  })();
