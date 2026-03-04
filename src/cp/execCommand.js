import { spawn } from 'node:child_process';

const execCommand = async () => {
  // Write your code here
  // Take command from CLI argument
  // Spawn child process
  // Pipe child stdout/stderr to parent stdout/stderr
  // Pass environment variables
  // Exit with same code as child
    if (process.argv.length !== 3) {
        console.error('Expected one quoted command with arguments, e.g. `node src/cp/execCommand.js \"echo \'Hello World\'\"`');
        process.exit(1);
    }
    const command = process.argv[2];

    const child = spawn(command, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env:  process.env,
        shell: true,
    })

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('close', (code) => {
        process.exit(code);
    });
};

await execCommand();
