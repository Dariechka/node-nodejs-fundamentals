import fs from "node:fs/promises";
import path from "node:path";

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata
    const workspace = path.resolve(import.meta.dirname, "workspace");
    const isDir = async p => {
        try {
            return (await fs.stat(p)).isDirectory();
        } catch (error) {
            return false;
        }
    };
    if (!(await isDir(workspace))) {
        throw new Error("FS operation failed");
    }
    const entries = [];

    const scan = async (dir) => {
        const files = await fs.readdir(dir, { withFileTypes: true });

        for (const file of files) {
            const filePath = path.resolve(dir, file.name);

            if (file.isDirectory()) {
                entries.push({
                    path: path.relative(workspace, filePath),
                    type: 'directory',
                })

                await scan(filePath)
            }
            if (file.isFile()) {
                const stats = await fs.stat(filePath)
                const content = await fs.readFile(filePath)

                entries.push ({
                    path: path.relative(workspace, filePath),
                    type: 'file',
                    size: stats.size,
                    content: content.toString('base64')
                })
            }
        }
    }

    await scan(workspace);

    const result = {
        rootPath: workspace,
        entries,
    }

    const json = path.resolve(import.meta.dirname, 'snapshot.json');
    await fs.writeFile(json, JSON.stringify(result, null, 2));
};

await snapshot();
