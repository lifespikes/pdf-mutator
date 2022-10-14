/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

export type ServiceFee = {
  home_state?: string;
  description: string;
  worker_comp_code: string;
  percentage_rate: string
};

export type Entry = [number, number, string, number];

export interface CsaRenderPayload {
  business_name: string;
  full_name: string;
  title: string;
  street_address: string;
  state: string;
  city: string;
  serviceFees?: ServiceFee[];
  zip: string;
  ssn_encrypted: string;
  license_encrypted: string;

  signature_path: string;
  source_path: string;

  bucket: string;
}

export interface DrawOptions {
  page: number;
  x: number;
  y: number;
}

export interface WriteTextOptions extends DrawOptions {
  text: string;
}

export interface WriteImageOptions extends DrawOptions {
  width?: number;
  height?: number;
  path: string;
  bucket: string;
}
