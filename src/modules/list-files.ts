import { execSync } from "child_process";

export default (body: string) => {
  const { path } = JSON.parse(body);
  const glob = execSync(`ls /var/task/${path ?? ""}`);

  return glob.toString();
};
