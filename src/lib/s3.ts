import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

export type Uploadable = Buffer | Uint8Array;

const S3_BUCKET = "prg-common";

const client = new S3Client({
  region: "us-east-1",
});

const factory = {
  put: (input: PutObjectCommandInput) => new PutObjectCommand(input),
  get: (input: GetObjectCommandInput) => new GetObjectCommand(input),
};

export async function upload(name: string, body: Uploadable) {
  return await client.send<PutObjectCommandInput, PutObjectCommandOutput>(
    factory.put({
      Bucket: S3_BUCKET,
      Key: name,
      Body: body,
    })
  );
}

export async function uploadNew(body?: Uploadable | string, suffix = "") {
  if (!body) {
    throw new Error("Empty file provided");
  }

  const file = `${Date.now()}-${Math.random()}${suffix}`;
  await upload(file, typeof body === "string" ? Buffer.from(body) : body);

  return { output: `s3://${S3_BUCKET}/${file}` };
}

const streamToString = (stream: Readable): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const chunks: any = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).buffer));
  });

export async function get(uri: string): Promise<ArrayBuffer> {
  const [[, Bucket, Key]] = [...uri.matchAll(/^s3:\/\/([-A-z0-9]+)\/(.*)$/g)];

  const { Body } = await client.send<
    GetObjectCommandInput,
    GetObjectCommandOutput
  >(
    factory.get({
      Bucket,
      Key,
    })
  );

  if (Body) {
    return await streamToString(Body as Readable);
  }

  throw new Error("Empty response from S3");
}
