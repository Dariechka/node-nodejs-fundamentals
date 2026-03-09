import path from "node:path";
import fs from "node:fs/promises";
import {parseArgs} from "node:util";

//!!!Please add any helper directories and files required for
//testing this task to the folder with the same name as the task (e.g. workspace in fs directory).

const merge = async () => {
    // Write your code here
    // Default: read all .txt files from workspace/parts in alphabetical order
    // Optional: support --files filename1,filename2,... to merge specific files in provided order
    // Concatenate content and write to workspace/merged.txt
    const findParts = async () => {
        const {values} = parseArgs({
            options: {
                files: {
                    type: 'string',
                },
            },
            allowPositionals: true,
        });
        const files = (values.files ?? '').split(',').filter(Boolean);

        if (files.length) {
            return await Promise.all(
                files
                    .map(file => path.resolve(import.meta.dirname, 'workspace', 'parts', file))
                    .sort()
                    .map(async (part) => await fs.readFile(part))
            );
        } else {
            const base = path.resolve(import.meta.dirname, 'workspace', 'parts');
            const parts = (await fs.readdir(base))
                .filter(part => part.endsWith('.txt'))
                .map(part => path.resolve(base, part));
            if (!parts.length) {
                throw new Error('No txt files found');
            }
            return await Promise.all(
                parts
                    .sort()
                    .map(async (part) => await fs.readFile(part))
            );
        }
    }

    try {
        const target = path.resolve(import.meta.dirname, 'workspace', 'merged.txt');
        const parts = await findParts();
        await fs.writeFile(target, parts.join(''));
    } catch (cause) {
        throw Error('FS operation failed', {cause});
    }
};

await merge();
