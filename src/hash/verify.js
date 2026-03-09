import path from "node:path";
import fs from "node:fs/promises";
import { createReadStream } from "fs";
import crypto from "crypto";

//!!!Please add any helper directories and files required for
//testing this task to the folder with the same name as the task (e.g. workspace in fs directory).

const verify = async () => {
  // Write your code here
  // Read checksums.json
  // Calculate SHA256 hash using Streams API
  // Print result: filename — OK/FAIL
    const read = async (json) => {
        try {
            return JSON.parse(await fs.readFile(json, 'utf8'));
        } catch {
            throw Error('FS operation failed');
        }
    }
    const json = await read(path.resolve(import.meta.dirname, 'checksums.json'));

    const hash = async (file) => {
        const algorithm = crypto.createHash("sha256");
        const stream = createReadStream(file);
        for await (const chunk of stream) {
            algorithm.update(chunk);
        }
        return algorithm.digest("hex");
    }
    for (const [file, expectedHash] of Object.entries(json)) {
        const actualHash = await hash(path.resolve(import.meta.dirname, file))
        if (actualHash === expectedHash) {
            console.log(`${file} — OK`);
        } else {
            console.log(`${file} — FAIL`);
        }
    }
};

await verify();
