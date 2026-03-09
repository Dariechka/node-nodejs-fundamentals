import path from "node:path";
import fs from "node:fs/promises";

//!!!Please add any helper directories and files required for
//testing this task to the folder with the same name as the task (e.g. workspace in fs directory).

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored
    const target = path.resolve(import.meta.dirname, 'workspace_restored');
    const exists = async (p) => {
        try {
            await fs.access(p);
            return true;
        } catch {
            return false;
        }
    }
    if (await exists(target)) {
        throw new Error("FS operation failed");
    }
    const read = async (json) => {
        try {
            return JSON.parse(await fs.readFile(json, 'utf8'));
        } catch (cause) {
            throw Error('FS operation failed', {cause});
        }
    }
    const json = await read(path.resolve(import.meta.dirname, 'snapshot.json'));
    for (const entry of json.entries) {
        switch (entry.type) {
            case 'directory': {
                await fs.mkdir(path.resolve(target, entry.path), {recursive: true});
                break;
            }
            case 'file': {
                await fs.mkdir(path.resolve(target, path.dirname(entry.path)), {recursive: true});
                await fs.writeFile(path.resolve(target, entry.path), Buffer.from(entry.content, 'base64'));
                break;
            }
        }
    }
};

await restore();
