import scripts from "./modules";

type LambdaEvent = {
  body: string;
  rawPath: string;
  requestContext: {
    http: {
      method: "POST" | "GET" | "PUT" | "DELETE" | "HEAD" | "PATCH";
    };
  };
};

exports.handler = async (event: LambdaEvent) => {
  const script: string = event.rawPath.substring(1);

  if (
    script &&
    (script === "htmlToPng" ||
      script === "mergePdf" ||
      script === "generateCsa" ||
      script === "listFiles") &&
    event.requestContext.http.method === "POST"
  ) {
    return scripts[script](event.body);
  }
};
