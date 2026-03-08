import path from "node:path";
import fsPromises from "fs/promises";
import fs from "fs";
import {createBrotliDecompress} from "zlib";

const decompressDir = async () => {
    // Write your code here
    // Read archive.br from workspace/compressed/
    // Decompress and extract to workspace/decompressed/
    // Use Streams API
    const workspace = path.resolve(import.meta.dirname, 'workspace');
    const decompressed = path.resolve(workspace, 'decompressed');
    const compressed = path.resolve(workspace, 'compressed');
    const archive = path.resolve(compressed, 'archive.br');
    try {
        if (!(await fsPromises.stat(archive)).isFile()) {
            throw new Error();
        }
    } catch {
        throw new Error('FS operation failed');
    }

    async function readBytes(stream, n) {
        const buffers = [];
        let length = 0;

        return new Promise((resolve, reject) => {
            const onData = (chunk) => {
                buffers.push(chunk);
                length += chunk.length;

                if (length >= n) {
                    stream.pause();

                    const result = Buffer.concat(buffers, length).slice(0, n);
                    const leftover = Buffer.concat(buffers, length).slice(n);

                    stream.unshift(leftover);
                    cleanup();
                    resolve(result);
                }
            }

            const onEnd = () => {
                const result = Buffer.concat(buffers, length);
                cleanup();
                resolve(result);
            }

            const onError = (err) => {
                cleanup();
                reject(err);
            }

            const cleanup = () => {
                stream.removeListener('data', onData);
                stream.removeListener('end', onEnd);
                stream.removeListener('error', onError);
            }

            stream.on('data', onData);
            stream.on('end', onEnd);
            stream.on('error', onError);

            stream.resume();
        });
    }

    const fd = fs.openSync(archive, 'r');
    const header = Buffer.alloc(8);
    fs.readSync(fd, header, 0, 8, 0);
    const jsonLength = Number(header.readBigInt64LE(0));
    fs.closeSync(fd);

    const reader = fs.createReadStream(archive, {start: 8}).pipe(createBrotliDecompress());

    const jsonBytes = await readBytes(reader, jsonLength);
    const entries = JSON.parse(jsonBytes);

    for (const entry of entries) {
        const absolute = path.resolve(decompressed, entry.path);
        switch (entry.type) {
            case 'directory': {
                await fsPromises.mkdir(absolute, {recursive: true});
                break;
            }
            case 'file': {
                await fsPromises.mkdir(path.dirname(absolute), {recursive: true});
                const data = await readBytes(reader, entry.size); // todo split to small chunks
                fs.createWriteStream(absolute).write(data);
                break;
            }
        }
    }
};

await decompressDir();
