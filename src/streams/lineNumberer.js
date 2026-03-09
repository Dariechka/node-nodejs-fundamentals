import {pipeline, Transform} from "stream";

//!!!Please add any helper directories and files required for
//testing this task to the folder with the same name as the task (e.g. workspace in fs directory).

const lineNumberer = () => {
    // Write your code here
    // Read from process.stdin
    // Use Transform Stream to prepend line numbers
    // Write to process.stdout
    let lineNumber = 1
    const transformer = new Transform({
        transform(chunk, encoding, callback) {
            const lines = chunk.toString().split('\n');
            const result = lines.map(line => `${lineNumber++} | ${line}`).join('\n');
            if (result) {
                callback(null, result);
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

lineNumberer();
