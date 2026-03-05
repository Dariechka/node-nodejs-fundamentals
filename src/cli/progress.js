import { parseArgs } from 'node:util';

const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%
    const { values } = parseArgs({
        options: {
            duration: {
                type: 'string',
                default: '5000',
            },
            interval: {
                type: 'string',
                default: '100',
            },
            length: {
                type: 'string',
                default: '30',
            },
            color: {
                type: 'string',
            },
        },
        allowPositionals: true,
    });

    const draw = (percent) => {
        let filledLength = Math.floor(values.length * percent / 100);
        let emptyLength = values.length - filledLength

        const createColorSequence = (color) => {
            if (!color) {
                return '';
            }
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `\x1b[38;2;${r};${g};${b}m`;
        }
        const progressBar = createColorSequence(values.color) + '█'.repeat(filledLength) + '\x1b[0m' + ' '.repeat(emptyLength);
        process.stdout.write(`\r[${progressBar}] ${percent}%`);
    };

    draw(0);
    const start = Date.now();
    const intervalId = setInterval(() => {
        const elapsed = Date.now() - start;

        const percent = Math.min(Math.floor(elapsed / values.duration * 100), 100);
        draw(percent);

        if (elapsed >= values.duration) {
            process.stdout.write('\nDone!');
            console.log('');
            clearInterval(intervalId);
        }
    }, +values.interval)
};

progress();
