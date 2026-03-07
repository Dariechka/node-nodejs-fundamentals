import {parseArgs} from "node:util";
import fs from 'fs';
import path from "node:path";
import {createInterface} from "node:readline";

const split = async () => {
    // Write your code here
    // Read source.txt using Readable Stream
    // Split into chunk_1.txt, chunk_2.txt, etc.
    // Each chunk max N lines (--lines CLI argument, default: 10)
    const {values} = parseArgs({
        options: {
            lines: {
                type: 'string',
                default: '10',
            },
        },
        allowPositionals: true,
    });
    const input = fs.createReadStream(path.resolve(import.meta.dirname, 'source.txt'));
    const rl = createInterface({input});

    const createWriter = (fileNumber) => {
        return fs.createWriteStream(path.resolve(import.meta.dirname, `chunk_${fileNumber}.txt`));
    }
    const write = (fileNumber, lines) => {
        const writer = createWriter(fileNumber++);
        writer.write(lines.join('\n'));
        lines.splice(0, lines.length);
    }

    let fileNumber = 1;
    const lines = [];
    for await (const line of rl) {
        lines.push(line);
        if (lines.length === +values.lines) {
            write(fileNumber++, lines);
        }
    }
    if (lines.length) {
        write(fileNumber, lines);
    }
};

await split();
