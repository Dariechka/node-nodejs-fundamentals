const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%
    const interval = 100;
    const totalSteps = 50;
    const stepLength = 1
    const length = stepLength * totalSteps;
    let currentStep = 0;

    const intervalProgress = setInterval(() => {
        let percent = Math.floor(currentStep / totalSteps * 100)
        let filledLength = stepLength * currentStep
        let emptyLength = length - filledLength

        const progressBar = '█'.repeat(filledLength) + ' '.repeat(emptyLength);
        process.stdout.write(`\r[${progressBar}] ${percent}%`);

        currentStep++
        if (currentStep >= totalSteps) {
            clearInterval(intervalProgress);
            process.stdout.write('/n');
        }
    }, interval)
};

progress();
