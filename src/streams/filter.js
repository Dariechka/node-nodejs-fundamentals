import {pipeline, Transform} from "stream";
import {parseArgs} from "node:util";

//!!!Please add any helper directories and files required for
//testing this task to the folder with the same name as the task (e.g. workspace in fs directory).

const filter = () => {
    // Write your code here
    // Read from process.stdin
    // Filter lines by --pattern CLI argument
    // Use Transform Stream
    // Write to process.stdout
    const {values} = parseArgs({
        options: {
            pattern: {
                type: 'string',
            },
        },
        allowPositionals: true,
    });
    const transformer = new Transform({
        transform(chunk, encoding, callback) {
            const result = chunk.toString().split('\n').filter(line => line.includes(values.pattern)).join('\n');
            if (result) {
                callback(null, result + '\n');
            } else {
                callback();
            }
        }
    })

    pipeline(
        process.stdin,
        transformer,
        process.stdout,
        Function.prototype,
    );

};

filter();
