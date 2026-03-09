import fs from 'node:fs/promises';
import path from 'node:path';

//!!!Please add any helper directories and files required for
//testing this task to the folder with the same name as the task (e.g. workspace in fs directory).

const findByExt = async () => {
    // Write your code here
    // Recursively find all files with specific extension
    // Parse --ext CLI argument (default: .txt)
    const findRecursively = async (dir, ext = 'txt') => {
        try {
            const files = await fs.readdir(dir, { withFileTypes: true });
            const result = []

            for (const file of files) {
                const filePath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    const directoryFiles = await findRecursively(filePath, ext);
                    result.push(...directoryFiles);
                } else if (file.isFile() && path.extname(file.name) === `.${ext}`) {
                    result.push(filePath);
                }
            }
            return result;
        } catch (error) {
            console.error('Error reading directory:', error);
            return []
        }
    }

    const args = process.argv.slice(2);
    const ext = args[1];

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

    const files = await findRecursively(workspace, ext);
    files
        .map(p => path.relative(workspace, p))
        .sort()
        .forEach(file => console.log(file));
};

await findByExt();
