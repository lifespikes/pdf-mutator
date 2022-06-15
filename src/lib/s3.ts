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

const client = new S3Client({
  region: "us-east-1",
});

const factory = {
  put: (input: PutObjectCommandInput) => new PutObjectCommand(input),
  get: (input: GetObjectCommandInput) => new GetObjectCommand(input),
};

export async function uploadNew(
  bucket: string,
  body?: Uploadable | string,
  suffix = ""
) {
  if (!body) {
    throw new Error("Empty file provided");
  }

  const output = `${Date.now()}-${Math.random()}${suffix}`;
  await upload(
    bucket,
    output,
    typeof body === "string" ? Buffer.from(body) : body
  );

  return { output };
}

export async function upload(Bucket: string, Key: string, body: Uploadable) {
  return await client.send<PutObjectCommandInput, PutObjectCommandOutput>(
    factory.put({
      Bucket,
      Key,
      Body: body,
    })
  );
}

export async function get(Bucket: string, Key: string): Promise<ArrayBuffer> {
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

const streamToString = (stream: Readable): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const chunks: any = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).buffer));
  });
