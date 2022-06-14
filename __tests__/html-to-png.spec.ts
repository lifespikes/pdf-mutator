import * as s3 from "../src/lib/s3";
import htmlToPng from "../src/modules/html-to-png";
import { request } from "https";

jest.mock("../src/lib/get-stdin");
jest.setTimeout(30000);

test("htmlToPng generates an image", async () => {
  const testPayload = {
    fingerprint: "abc",
    content: "John Johnson",
    timestamp: "10000",
  };

  const result = await htmlToPng(JSON.stringify(testPayload));
  console.log(result);
});

test("s3 can get a file", async () => {
  const file = await s3.get(
    "arn:aws:s3:::prg-lambda-assets/PTO REQUEST FORM - OCMI.pdf"
  );

  expect(file).toBeInstanceOf(ArrayBuffer);
});

test("request to lambda function stores file", async () => {
  await new Promise<void>((resolve) => {
    const req = request(
      {
        method: "POST",
        hostname:
          "aydfqnreb27fnpxv4qfaaychtu0wtvel.lambda-url.us-east-1.on.aws",
        port: 443,
        path: "/generateCsa",
      },
      (res) => {
        console.log(res);
        resolve();
      }
    );

    req.write(
      JSON.stringify({
        fingerprint: "abc",
        content: "John Johnson",
        timestamp: "10000",
      })
    );

    req.end();
  });
});
