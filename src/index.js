#!/usr/bin/env node

/**
 * JSON Generator - A CLI tool for generating JSON data using Faker.js
 * 
 * This tool allows users to generate mock JSON data using templates with Faker.js expressions
 * and shorthand syntax. Supports multiple output formats (JSON, NDJSON) and streaming.
 * 
 * @author Nitin Bansal <nitinbansal85@gmail.com>
 * @version 1.0.0
 */

// Suppress faker warnings to keep CLI output clean
const originalWarn = console.warn;
console.warn = (...args) => {
  // Only suppress warnings that come from faker
  const message = args.join(' ');
  if (message.includes('faker') || message.includes('Faker')) {
    return; // Suppress faker warnings
  }
  originalWarn.apply(console, args); // Allow other warnings through
};

// Import core modules
const { resolveFakerExpression } = require('./faker-resolver');
const { isPlainObject, resolveValue } = require('./template-resolver');
const { generateItems } = require('./generator');
const { writeOutput } = require('./output-utils');
const { setupCLI } = require('./cli');
const presets = require('./presets');
const shorthandMap = require('./shorthand-map');

// Export functions for use as a module
module.exports = {
  resolveFakerExpression,
  isPlainObject,
  resolveValue,
  generateItems,
  writeOutput,
  presets,
  shorthandMap
};

// CLI functionality - only run when executed directly (not when imported)
if (require.main === module) {
  setupCLI();
}