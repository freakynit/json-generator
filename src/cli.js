/**
 * Command Line Interface for JSON Generator
 * Handles argument parsing and CLI execution
 */

const { program } = require("commander");
const { faker } = require("@faker-js/faker");
const fs = require("fs");
const { generateItems } = require('./generator');
const { writeOutput } = require('./output-utils');
const presets = require('./presets');

/**
 * Sets up and executes the CLI program
 */
function setupCLI() {
  program
    .name("json-generator")
    .description("Generate JSON data using Faker.js with template support")
    .argument("<template>", "JSON template string, preset name (user, product, company, order, post, event), or supports $faker.paths and shorthands")
    .option("-n, --number <count>", "Number of objects to generate", "1")
    .option("-t, --template-file <path>", "Path to JSON template file")
    .option("-s, --stream", "NDJSON streaming to stdout (one JSON per line)", false)
    .option("-f, --format <fmt>", "Output format: json|ndjson", "json")
    .option("--seed <num>", "Seed for deterministic output", (v) => Number(v))
    .option("--seed-per-item", "Apply seed + index per row for deterministic rows", false)
    .option("-o, --output <path>", "Output file path")
    .option("--list-presets", "List available presets", false)
    .action(async (templateStr, options) => {
      // Handle preset listing
      if (options.listPresets) {
        console.log("Available presets:");
        Object.keys(presets).forEach(preset => {
          console.log(`  ${preset}`);
        });
        console.log("\nUsage: json-generator <preset-name> [options]");
        console.log("Example: json-generator user -n 10 -o users.json");
        return;
      }

      // Validate and parse count option
      const count = Number.parseInt(options.number, 10);
      if (!Number.isFinite(count) || count < 0) {
        console.error("Invalid --number value");
        process.exit(1);
      }

      // Parse format and streaming options
      const fmt = String(options.format || "json").toLowerCase();
      const stream = Boolean(options.stream) || fmt === "ndjson";

      // Parse seeding options
      const seed = typeof options.seed === "number" && Number.isFinite(options.seed) ? options.seed : undefined;
      const seedPerItem = Boolean(options.seedPerItem);

      // Apply global seed if not using per-item seeding
      if (seed !== undefined && !seedPerItem) {
        faker.seed(seed);
      }

      // Parse and validate JSON template
      let template;
      if (options.templateFile) {
        try {
          const templateContent = fs.readFileSync(options.templateFile, 'utf8');
          template = JSON.parse(templateContent);
        } catch (e) {
          console.error(`Error reading template file: ${e.message}`);
          process.exit(1);
        }
      } else {
        // Check if templateStr is a preset name
        if (presets[templateStr]) {
          template = presets[templateStr];
        } else {
          try {
            template = JSON.parse(templateStr);
          } catch (e) {
            console.error(`Invalid JSON template! If you meant to use a preset, available presets are: ${Object.keys(presets).join(', ')}`);
            console.error("Use --list-presets to see all available presets");
            process.exit(1);
          }
        }
      }

      // Handle streaming NDJSON output
      if (stream || fmt === "ndjson") {
        for (const item of generateItems(template, count, seed, seedPerItem)) {
          const line = JSON.stringify(item) + "\n";
          writeOutput(line, options.output, true);
        }
        return;
      }

      // Handle standard JSON array output (default)
      const out = [];
      for (const item of generateItems(template, count, seed, seedPerItem)) {
        out.push(item);
      }
      const jsonOutput = JSON.stringify(out, null, 2);
      writeOutput(jsonOutput, options.output);
      
      // If writing to file, show confirmation message
      if (options.output) {
        console.error(`Generated ${count} item${count !== 1 ? 's' : ''} and saved to ${options.output}`);
      }
    });

  // Parse command line arguments and execute
  program.parse(process.argv);
}

module.exports = { setupCLI };