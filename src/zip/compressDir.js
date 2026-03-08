import path from "node:path";
import fs from "fs";
import fsPromises from "fs/promises";
import {createBrotliCompress} from "zlib";

const compressDir = async () => {
    // Write your code here
    // Read all files from workspace/toCompress/
    // Compress entire directory structure into archive.br
    // Save to workspace/compressed/
    // Use Streams API
    const workspace = path.resolve(import.meta.dirname, "workspace");
    const toCompress = path.resolve(workspace, 'toCompress');
    const isDir = async p => {
        try {
            return (await fsPromises.stat(p)).isDirectory();
        } catch (error) {
            return false;
        }
    };
    if (!(await isDir(toCompress))) {
        throw new Error("FS operation failed");
    }

    const compressed = path.resolve(workspace, 'compressed');
    const archive = path.resolve(compressed, 'archive.br');

    await fsPromises.mkdir(compressed, {recursive: true});


    const scan = async (dir, entries = []) => {
        const files = await fsPromises.readdir(dir, {withFileTypes: true});

        for (const file of files) {
            const filePath = path.resolve(file.parentPath, file.name);

            if (file.isDirectory()) {
                entries.push({
                    path: path.relative(toCompress, filePath),
                    type: 'directory',
                })

                await scan(filePath, entries);
            }
            if (file.isFile()) {
                const stats = await fsPromises.stat(filePath)

                entries.push({
                    path: path.relative(toCompress, filePath),
                    type: 'file',
                    size: stats.size,
                })
            }
        }
        return entries;
    }

    const entries = await scan(toCompress);
    const json = JSON.stringify(entries);


    const out = fs.createWriteStream(archive);
    const compressor = createBrotliCompress();
    compressor.pipe(out);

    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(json.length);
    compressor.write(buffer);
    compressor.write(json);

    for (const entry of entries) {
        if (entry.type === "directory") {
            continue;
        }

        const reader = fs.createReadStream(path.resolve(toCompress, entry.path));
        reader.pipe(compressor, {end: false});
        await new Promise((resolve, reject) => {
            reader.on('end', () => resolve());
            reader.on('error', err => reject(err));
        });
    }

    compressor.end();
    await new Promise((resolve) => out.on('finish', () => resolve()))
};

await compressDir();
