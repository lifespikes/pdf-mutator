// eslint-disable-next-line @typescript-eslint/no-var-requires
import express, {Request, Response} from "express";
import scripts from "../modules";
import {CsaRenderPayload} from "../lib/pdf-editor.types";

const app = express();
//configure
app.set("port", 10000);

//middlewares
app.use(express.json())

const testBody: CsaRenderPayload = {
    business_name: "Awesome",
    full_name: "Alberto",
    title: "Owner lol",
    street_address: "hello",
    state: "hello",
    city: "barrancabermeja",
    zip: "27821",
    ssn_encrypted: "encrypted",
    license_encrypted: "license",
    signature_path: "",
    source_path: "assets/fl_csa_rev_1_6_2022.pdf",

    bucket: "prg-common",
    serviceFees: [
        {
            description: "test description",
            percentage_rate: "0.2",
            "worker_comp_code": "test code"
        }
    ]
};

app.post('/:script', async ({params, body}: Request<{ script: keyof typeof scripts}>, res: Response) => {

    const script = scripts[params.script];

    if (!script) {
        return res.status(422).json("Unsupported script");
    }

    try {
        const payload = params.script  === "generateCsa" ? {...testBody, ...body} : body;
        const rep = await script(JSON.stringify(payload));
        return res.send(rep);
    } catch (e) {
        console.log(e);
        return res.status(500).json("Something went wrong");
    }
})


//starting the server
app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});