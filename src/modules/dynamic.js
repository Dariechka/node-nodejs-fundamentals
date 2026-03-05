import path from "node:path";

const dynamic = async () => {
  // Write your code here
  // Accept plugin name as CLI argument
  // Dynamically import plugin from plugins/ directory
  // Call run() function and print result
  // Handle missing plugin case
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('\'Please provide plugin name\'');
        process.exit(1);
    }

    const pluginName = args[0];

    try {
        const plugin = await import(path.resolve(import.meta.dirname, "plugins", `${pluginName}.js`));
        const result = plugin.run();
        console.log(result);
    } catch {
        console.error('Plugin not found');
        process.exit(1);
    }
};

await dynamic();
