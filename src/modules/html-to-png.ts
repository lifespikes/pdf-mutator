/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import nodeHtmlToImage from "node-html-to-image";
import getStdin from "../lib/get-stdin";

interface GeneratorPayload {
  output: string;
  fingerprint: string;
  content: string;
  timestamp: string;
}

export default () =>
  (async () => {
    const { output, ...content }: GeneratorPayload = JSON.parse(
      await getStdin()
    ) as Record<keyof GeneratorPayload, string>;

    await nodeHtmlToImage({
      output,
      transparent: true,
      content,
      html: `
      <!doctype html>
      <html>
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Zilla+Slab:wght@300;400;500;600;700&family=Dancing+Script&display=swap" rel="stylesheet">
      
          <style>
              * {
                  box-sizing: border-box;
              }
      
              body {
                  font-family: 'Poppins', sans-serif;
              }
          </style>
      </head>
      <body>
      <div style="background: #00607c; white-space: nowrap; border-radius: 0.5rem; box-shadow: 0 0 4px rgba(0, 0, 0, .8)">
          <div style="width: 100%; background: #fff; border-radius: 0.5rem; border: 2px solid #0aaddb; text-align: center; color: #00607c">
              <div style="font-size: 6rem; font-family: 'Dancing Script', sans-serif; white-space: nowrap;">{{content}}</div>
      
          </div>
          <div style="text-align: center; font-size: 0.7rem; font-weight: 700; color: #9de2bd;">
              <div style="text-align: center; display: flex; width: 100%; align-items: center; margin-bottom: 10px; padding: 5px 0;">
                  <div style="opacity: 0.7; font-family: sans-serif; text-align: center; width: 33.3%;">{{timestamp}}</div>
                  <div style="width: 33.3%; display: flex; align-items: center; gap: 4px;">
                      <svg style="display: block; box-sizing: border-box;" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647z"></path>
                      </svg>
                      <div>CryptoShield - RSA Verified</div>
                  </div>
                  <div style="width: 33.3%; font-weight: 600; font-family: monospace; text-transform: uppercase; justify-content: center; display: flex; align-items: center; gap: 4px;">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM540 701v53c0 4.4-3.6 8-8 8h-40c-4.4 0-8-3.6-8-8v-53a48.01 48.01 0 1 1 56 0zm152-237H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224z"></path></svg>
                      <div style="max-width: 90%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{fingerprint}}</div>
                  </div>
              </div>
          </div>
      </div>
      </body>
      </html>
    `,
    });

    console.log(JSON.stringify({ status: "OK" }));
  })();
