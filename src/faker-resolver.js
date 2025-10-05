/**
 * Faker.js expression resolver
 * Handles parsing and resolving faker expressions with parameters
 */

const { faker } = require("@faker-js/faker");

/**
 * Resolves a Faker.js expression string into actual data
 * 
 * Supports various formats:
 * - Simple path: "$person.firstName" 
 * - With parameters: "$number.int({\"min\":1,\"max\":10})"
 * - Multiple parameters: "$lorem.words(5)"
 * 
 * @param {string} expr - The faker expression to resolve (e.g., "$person.firstName")
 * @returns {*} The generated fake data
 * @throws {Error} If the faker path is invalid or not callable
 * 
 * @example
 * resolveFakerExpression("$person.firstName") // "John"
 * resolveFakerExpression("$number.int({\"min\":1,\"max\":10})") // 7
 * resolveFakerExpression("$lorem.words(3)") // "lorem ipsum dolor"
 */
function resolveFakerExpression(expr) {
  // Remove leading $ if present
  const raw = expr.startsWith("$") ? expr.slice(1) : expr;

  // Parse function calls with arguments: path(args)
  const callMatch = raw.match(/^([a-zA-Z0-9_.]+)\s*\((.*)\)\s*$/);
  let path = raw;
  let argList = [];

  if (callMatch) {
    path = callMatch[1];
    const argStr = callMatch[2].trim();

    if (argStr.length) {
      try {
        // Try to parse as JSON (handles objects and arrays)
        const toParse = argStr.includes(",") ? `[${argStr}]` : argStr;
        const parsed = JSON.parse(toParse);
        argList = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // Fallback: split by comma and parse individual values
        argList = argStr.split(",").map((s) => {
          const t = s.trim();
          // Parse numbers
          if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
          // Parse quoted strings
          if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
            return t.slice(1, -1);
          }
          return t;
        });
      }
    }
  }

  // Navigate through the faker object using dot notation
  const parts = path.split(".");
  let target = faker;
  for (const p of parts) {
    if (target == null) throw new Error(`Invalid faker path: ${path}`);
    target = target[p];
  }

  // Execute the faker function with arguments
  if (typeof target === "function") {
    const res = target(...argList);
    // Convert BigInt to string to avoid JSON serialization issues
    return typeof res === "bigint" ? res.toString() : res;
  }

  // If path resolves to a namespace object (non-callable), throw error
  throw new Error(`Invalid faker path (not a callable): ${path}`);
}

module.exports = { resolveFakerExpression };