/**
 * Data generation utilities
 * Handles item generation with seeding support
 */

const { faker } = require("@faker-js/faker");
const { resolveValue } = require('./template-resolver');

/**
 * Generator function that yields resolved template items
 * 
 * This function generates the specified number of items from a template,
 * with optional seeding for deterministic output.
 * 
 * @param {*} template - The template to resolve for each item
 * @param {number} count - Number of items to generate
 * @param {number} [seed] - Optional seed for deterministic output
 * @param {boolean} [seedPerItem=false] - Whether to apply seed+index per item
 * @yields {*} Resolved template items
 * 
 * @example
 * const template = {name: "firstName", email: "email"};
 * for (const item of generateItems(template, 3)) {
 *   console.log(item); // {name: "John", email: "john@example.com"}
 * }
 */
function* generateItems(template, count, seed, seedPerItem) {
  for (let i = 0; i < count; i++) {
    // Apply per-item seeding if requested
    if (seed !== undefined && seedPerItem) {
      faker.seed(seed + i);
    }
    yield resolveValue(template);
  }
}

module.exports = { generateItems };