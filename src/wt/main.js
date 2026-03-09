import path from "node:path";
import fs from "fs/promises";
import os from "os";
import {Worker} from "worker_threads";

//!!!Please add any helper directories and files required for
//testing this task to the folder with the same name as the task (e.g. workspace in fs directory).

const main = async () => {
  // Write your code here
  // Read data.json containing array of numbers
  // Split into N chunks (N = CPU cores)
  // Create N workers, send one chunk to each
  // Collect sorted chunks
  // Merge using k-way merge algorithm
  // Log final sorted array

    const array = JSON.parse(await fs.readFile(path.resolve(import.meta.dirname, 'data.json')))
    const cpus = os.cpus().length;

    const chunkSize = Math.floor(array.length / cpus);
    const chunks = [];
    for (let i = 0; i < cpus; i++) {
        chunks.push(array.slice(i * chunkSize, (i + 1) * chunkSize));
    }

    const workers = chunks.map(chunk => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(path.resolve(import.meta.dirname, 'worker.js'));

            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with code ${code}`));
                    process.exit(code);
                }
            });

            worker.postMessage(chunk);
        });
    });

    const results = await Promise.all(workers);

    const merged = [...kWayMerge(results)];
    console.log(merged);

    function* kWayMerge(a) {
        const i = Array(a.length).fill(0);
        while (true) {
            let m = -1;
            for (let j = 0; j < a.length; j++) {
                if (i[j] < a[j].length && (m < 0 || a[j][i[j]] < a[m][i[m]])) {
                    m = j;
                }
            }
            if (m < 0) {
                return
            }
            yield a[m][i[m]++]
        }
    }
};

await main();
