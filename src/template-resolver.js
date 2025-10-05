/**
 * Template resolution engine
 * Handles recursive template processing and value generation
 */

const { resolveFakerExpression } = require('./faker-resolver');
const shorthandMap = require('./shorthand-map');

/**
 * Checks if a value is a plain JavaScript object (not array, null, or other types)
 * 
 * @param {*} v - Value to check
 * @returns {boolean} True if the value is a plain object
 * 
 * @example
 * isPlainObject({}) // true
 * isPlainObject([]) // false
 * isPlainObject(null) // false
 */
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v) && v.constructor === Object;
}

/**
 * Recursively resolves a template value, handling various data types and special syntax
 * 
 * This is the core function that processes templates and generates fake data.
 * It handles:
 * - String shorthands and faker expressions
 * - Array generation macros
 * - Nested objects
 * - Key-only shorthand syntax
 * 
 * @param {*} value - The template value to resolve
 * @returns {*} The resolved value with fake data
 * 
 * @example
 * // String shorthand
 * resolveValue("email") // "john@example.com"
 * 
 * // Faker expression
 * resolveValue("$person.firstName") // "John"
 * 
 * // Array macro
 * resolveValue({"$array": "email", "number": 3}) // ["a@b.com", "c@d.com", "e@f.com"]
 * 
 * // Object with key shorthand
 * resolveValue({email: true, name: "firstName"}) // {email: "john@example.com", name: "John"}
 */
function resolveValue(value) {
  // Handle string values
  if (typeof value === "string") {
    // Check for shorthand without $ prefix
    if (!value.startsWith("$") && shorthandMap[value]) {
      return shorthandMap[value]();
    }

    // Handle faker expressions starting with $
    if (value.startsWith("$")) {
      try {
        return resolveFakerExpression(value);
      } catch {
        // Fallback: try to resolve as shorthand by removing $ prefix
        const shorthand = value.slice(1);
        if (shorthandMap[shorthand]) {
          return shorthandMap[shorthand]();
        }
        return null;
      }
    }

    // Return string as-is if no special processing needed
    return value;
  }

  // Handle arrays - recursively resolve each element
  if (Array.isArray(value)) {
    return value.map(resolveValue);
  }

  // Handle objects
  if (isPlainObject(value)) {
    // Special array macro: {"$array": "email", "number": 3}
    if ("$array" in value) {
      const spec = value.$array;
      const number = value.number ?? (isPlainObject(spec) ? spec.number : undefined);
      const ofExpr = isPlainObject(spec) ? spec.of : spec;
      const count = Number(number ?? 1);

      const out = [];
      for (let i = 0; i < count; i++) {
        out.push(resolveValue(ofExpr));
      }
      return out;
    }

    // Process regular object properties
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      // Key-only shorthand: {email: true} or {email: null}
      if ((v === null || v === true) && shorthandMap[k]) {
        out[k] = shorthandMap[k]();
      } else {
        out[k] = resolveValue(v);
      }
    }
    return out;
  }

  // Return primitive values as-is
  return value;
}

module.exports = { isPlainObject, resolveValue };