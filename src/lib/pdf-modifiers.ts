/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import { open, writeFile } from "node:fs/promises";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { get } from "./s3";
import { WriteImageOptions, WriteTextOptions } from "./pdf-editor.types";
import imageSize from "buffer-image-size";

export const pdfFromS3ARN = async (arn: string) => {
  return await PDFDocument.load(await get(arn));
};

export const getBlankAgreement = async (arn: string) => {
  const doc = await pdfFromS3ARN(arn);

  return {
    text: async (options: WriteTextOptions) => await writeText(doc, options),
    image: async (options: WriteImageOptions) => await writeImage(doc, options),
    buffer: async () => await doc.save(),
    save: async (target: string) => await writeFile(target, await doc.save()),
  };
};

export const writeImage = async (
  document: PDFDocument,
  { x, y, path, width, height, ...options }: WriteImageOptions
) => {
  const bytes = await (await open(path, "r")).readFile();
  const image = await document.embedPng(bytes);
  const page = document.getPages()[options.page];

  /* We do this to lock aspect ratio */

  const imageWidth = async () => {
    if (height && !width) {
      const bitmap = imageSize(bytes);
      return (
        bitmap.width - bitmap.width * ((bitmap.height - height) / bitmap.height)
      );
    }

    return width;
  };

  page.drawImage(image, {
    x,
    y,
    width: await imageWidth(),
    height,
  });
};

export const writeText = async (
  document: PDFDocument,
  { x, y, text, ...options }: WriteTextOptions
) => {
  const helvetica = await document.embedFont(StandardFonts.TimesRoman);
  const page = document.getPages()[options.page];

  page.drawText(text, {
    x,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0, 0, 0),
  });
};
