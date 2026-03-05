import * as readline from 'node:readline/promises';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Enter command: '
});

const commands = {
    'uptime': () => console.log(`Uptime: ${process.uptime()} seconds`),
    'cwd': () => console.log(`Current working directory: ${process.cwd()}`),
    'date': () => console.log(`Current date and time: ${new Date().toLocaleString()}`),
    'exit': () => {
        console.log('\nBye!');
        rl.close();
    }
}

process.on('exit', () => {
    commands.exit();
});

process.on('SIGINT', () => {
    commands.exit();
});

const interactive = async () => {
    // Write your code here
    // Use readline module for interactive CLI
    // Support commands: uptime, cwd, date, exit
    // Handle Ctrl+C and unknown commands

    rl.prompt();
    for await (const line of rl) {
        const command = line.trim();

        if (commands[command]) {
            commands[command]()
        } else {
            console.log(`Unknown command: ${command}`);
            rl.prompt();
        }

        if (command === 'exit') {
            break;
        }

        rl.prompt();
    }
};

await interactive();
