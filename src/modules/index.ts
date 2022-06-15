import tracer from "dd-trace";
tracer.init();

import generateCsa from "./generate-csa";
import htmlToPng from "./html-to-png";
import mergePdf from "./merge-pdf";
import listFiles from "./list-files";

export default { generateCsa, htmlToPng, mergePdf, listFiles };
