/**
 * Output utilities for file and console writing
 */

const fs = require("fs");
const path = require("path");

/**
 * Writes output to a file or stdout based on options
 * 
 * @param {string} content - The content to write
 * @param {string} [outputPath] - Optional file path to write to
 * @param {boolean} [append=false] - Whether to append to file (for streaming)
 */
function writeOutput(content, outputPath, append = false) {
  if (outputPath) {
    try {
      // Ensure output directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      if (append) {
        fs.appendFileSync(outputPath, content);
      } else {
        fs.writeFileSync(outputPath, content);
      }
    } catch (e) {
      console.error(`Error writing to file ${outputPath}: ${e.message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(content);
  }
}

module.exports = { writeOutput };