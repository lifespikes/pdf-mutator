import AdmZip from "adm-zip";

await (async () => {
  try {
    const zip = new AdmZip();

    await zip.addLocalFolderPromise("dist", {
      zipPath: ".",
    });

    await zip.writeZipPromise("dist/pdf-mutator.zip", {});

    console.log("done");
  } catch (e) {
    console.log(`Something went wrong ${e}`);
  }
})();
