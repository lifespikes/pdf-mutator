/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as S3 from "./s3";
import { WriteImageOptions, WriteTextOptions } from "./pdf-editor.types";
import imageSize from "buffer-image-size";

export const pdfFromS3URL = async (uri: string) => {
  return await PDFDocument.load(await S3.get(uri));
};

export const getBlankAgreement = async (uri: string) => {
  const doc = await pdfFromS3URL(uri);

  return {
    text: async (options: WriteTextOptions) => await writeText(doc, options),
    image: async (options: WriteImageOptions) => await writeImage(doc, options),
    buffer: async () => await doc.save(),
  };
};

export const writeImage = async (
  document: PDFDocument,
  { x, y, path, width, height, ...options }: WriteImageOptions
) => {
  // path must be a S3 URL
  const bytes = Buffer.from(await S3.get(path));
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
