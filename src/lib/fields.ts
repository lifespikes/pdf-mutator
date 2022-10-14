/*
 * PayrollGoat - HCM Software built on the Zeal Payroll API
 *
 * Copyright (c) LifeSpikes, LLC. 2022.
 *
 * Private license: Not to be distributed, modified, or otherwise shared without prior authorization from LifeSpikes, or by its contractually-bound customer upon delivery or release of IP.
 */

import dayjs from 'dayjs';
import {CsaRenderPayload, ServiceFee, Entry} from './pdf-editor.types';

const generateServicesFeeTable = (services: ServiceFee[]): Entry[] => {

    const entries: Entry[] = [];

    const pageNumber = 1; // page #2

    const verticalOffset = 490;

    const tableLimit = 4;

    for (const [index, service] of services.slice(0, tableLimit).entries()) {
        const y = verticalOffset - (index * 12);
        entries.push([42, y, service.home_state || "FL", pageNumber]); // Home  state
        entries.push([112, y, service.description, pageNumber]); // Description
        entries.push([331, y, service.worker_comp_code, pageNumber]); // worker comp code
        entries.push([455, y, service.percentage_rate, pageNumber]); // percentage rate
    }

    return entries;
}

export default (data: CsaRenderPayload) => {
    const {business_name, full_name, ...payload} = data;
    const {street_address, city, state, zip} = payload;
    const ln2 = `${city}, ${state} ${zip}`;

    const now = dayjs();
    const month = now.format('MMMM');
    const date = now.format('DD');

    // x, y, text, page
    const entries: Entry[] = [
        /* == PAGE 1 == */
        [486, 705, month, 0], // Month name
        [542, 705, date, 0], // Month day
        [144, 683, business_name, 0], // Business name

        /* == PAGE 2 == */
        [336, 117, full_name, 1], // Signator name
        [331, 106, payload.title, 1], // Title
        [346, 94, `${street_address}`, 1], // Address
        [346, 84, ln2, 1], // Address,
        ...generateServicesFeeTable(payload.serviceFees ?? []),  // Service fees table

        /* == PAGE 10 == */
        [94, 709, business_name, 9], // Business name
        [23, 700, month, 9], // Month name
        [70, 700, date, 9], // Month day

        /* == PAGE 11 / Personal Guarantor == */
        [335, 712, business_name, 10],
        [61, 702, month, 10],
        [116, 702, date, 10],
        [28, 108, full_name, 10],
        [27, 74, `${street_address} ${ln2}`, 10],
        [314, 139, now.format('MM/DD/YYYY'), 10],
        [314, 106, payload.ssn_encrypted, 10],
        [314, 73, `${payload.license_encrypted} - ${payload.state}`, 10],
    ];

    return entries;
};
