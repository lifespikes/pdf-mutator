/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import { getBlankAgreement } from "../lib/pdf-modifiers";
import getStdin from "../lib/get-stdin";
import { CsaRenderPayload } from "../lib/pdf-editor.types";
import fields from "../lib/fields";

export default () =>
  (async () => {
    const payload: CsaRenderPayload = JSON.parse(await getStdin()) as Record<
      keyof CsaRenderPayload,
      string
    >;

    /* Get blank file */
    const doc = await getBlankAgreement(payload.source_path);

    /* Make modifications to base file */
    for (const entry of fields(payload)) {
      await doc.text({
        x: entry[0],
        y: entry[1],
        text: entry[2],
        page: entry[3],
      });
    }

    if (payload.signature_path) {
      /* Get image resolution to scale down signature */

      /* Client Initials and Signatures */
      for (let i = 0; i <= 10; i++) {
        await doc.image({
          x: 115,
          y: 40,
          height: 10,
          path: payload.signature_path,
          page: i,
        });
      }

      await doc.image({
        x: 312,
        y: 132,
        height: 26,
        path: payload.signature_path,
        page: 1,
      });
      await doc.image({
        x: 28,
        y: 141,
        height: 26,
        path: payload.signature_path,
        page: 10,
      });
    }

    /* Save file */
    await doc.save(payload.output_path);

    console.log(JSON.stringify({ status: "OK" }));
  })();
