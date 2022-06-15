import * as s3 from "../src/lib/s3";
import htmlToPng from "../src/modules/html-to-png";
import generateCsa from "../src/modules/generate-csa";
import mergePdf from "../src/modules/merge-pdf";

jest.mock("../src/lib/get-stdin");
jest.setTimeout(30000);

test("s3 can get a file", async () => {
  const file = await s3.get("prg-common", "__test_assets__/pdf-1.pdf");
  expect(file).toBeInstanceOf(ArrayBuffer);
});

test("function generates blank csa", async () => {
  const signature = await htmlToPng(
    JSON.stringify({
      fingerprint: "abc123",
      content: "Test",
      timestamp: "10000",
      bucket: "prg-common",
    })
  );

  const payload = {
    business_name: "Bobs Business",
    full_name: "Bob Smith",
    title: "Owner",
    street_address: "800 Bob Lane",
    city: "Bob City",
    state: "State of Bob",
    zip: "80880",
    ssn_encrypted: "123456789",
    license_encrypted: "123456789",
    signature_path: signature.output,
    source_path: "__test_assets__/csa.pdf",
    bucket: "prg-common",
  };

  const output = await generateCsa(JSON.stringify(payload));
  expect(output).toHaveProperty("output");
});

test("pdfs are merged", async () => {
  const payload = {
    files: ["__test_assets__/pdf-1.pdf", "__test_assets__/pdf-2.pdf"],
    bucket: "prg-common",
  };

  const output = await mergePdf(JSON.stringify(payload));
  expect(output).toHaveProperty("output");
});
