"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = __importStar(require("../src/lib/s3"));
const html_to_png_1 = __importDefault(require("../src/modules/html-to-png"));
jest.mock("../src/lib/get-stdin");
jest.setTimeout(30000);
test("htmlToPng generates an image", async () => {
    const testPayload = {
        fingerprint: "abc",
        content: "John Johnson",
        timestamp: "10000",
    };
    const result = await (0, html_to_png_1.default)(JSON.stringify(testPayload));
    console.log(result);
});
test("s3 can get a file", async () => {
    const file = await s3.get("arn:aws:s3:::prg-lambda-assets/PTO REQUEST FORM - OCMI.pdf");
    expect(file).toBeInstanceOf(ArrayBuffer);
});
//# sourceMappingURL=html-to-png.spec.js.map