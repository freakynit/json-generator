const { execSync } = require('child_process');

// Helper function to run the json-generator command
function runGenerator(template, options = {}) {
  const args = [`'${JSON.stringify(template).replace(/'/g, "\\'")}'`];
  if (options.number) args.push(`-n ${options.number}`);
  if (options.stream) args.push(`-S`);
  if (options.format) args.push(`-F ${options.format}`);
  if (options.seed) args.push(`--seed ${options.seed}`);
  if (options.seedPerItem) args.push(`--seed-per-item`);

  const command = `node ./src/index.js ${args.join(' ')}`;
  console.log(`\nRunning command: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log('Output:\n', output);
  } catch (error) {
    console.error('Error:\n', error.stderr);
  }
}

function exampleBasicJson() {
  console.log('--- Example: Basic JSON Object Generation ---');
  const template = {
    id: "uuid",
    name: "fullName",
    email: "$internet.email"
  };
  runGenerator(template);
}

function exampleMultipleItems() {
  console.log('--- Example: Generating Multiple Items ---');
  const template = {
    id: "uuid",
    productName: "$commerce.productName",
    price: "$commerce.price"
  };
  runGenerator(template, { number: 3 });
}

function exampleFakerExpressions() {
  console.log('--- Example: Using Direct Faker.js Expressions ---');
  const template = {
    userId: "$string.uuid",
    username: "$internet.userName",
    avatar: "$image.avatar",
    productCount: "$number.int({\"min\":1,\"max\":100})"
  };
  runGenerator(template);
}

function exampleShorthand() {
  console.log('--- Example: Using Shorthand for Common Fields ---');
  const template = {
    firstName: true, // shorthand for faker.person.firstName()
    lastName: true,  // shorthand for faker.person.lastName()
    age: true,       // shorthand for faker.number.int({ min: 18, max: 80 })
    city: true       // shorthand for faker.location.city()
  };
  runGenerator(template);
}

function exampleNestedObjectsAndArrays() {
  console.log('--- Example: Nested Objects and Arrays ---');
  const template = {
    orderId: "uuid",
    customer: {
      name: "fullName",
      email: "email"
    },
    items: {
      $array: {
        of: {
          productId: "uuid",
          productName: "$commerce.productName",
          quantity: "$number.int({\"min\":1,\"max\":5})"
        },
        number: 2
      }
    },
    totalAmount: "$finance.amount"
  };
  runGenerator(template);
}

function exampleCsvOutput() {
  console.log('--- Example: Generating CSV Output ---');
  const template = {
    id: "uuid",
    name: "fullName",
    email: "email",
    company: "company"
  };
  runGenerator(template, { number: 3, format: 'csv' });
}

function exampleNdjsonStreaming() {
  console.log('--- Example: NDJSON Streaming Output ---');
  const template = {
    logId: "uuid",
    timestamp: "$date.past",
    message: "$lorem.sentence"
  };
  runGenerator(template, { number: 2, stream: true });
}

function exampleSeeding() {
  console.log('--- Example: Using Seeding for Deterministic Output ---');
  const template = {
    value1: "$string.uuid",
    value2: "$number.int"
  };
  console.log('--- Run 1 with seed 123 ---');
  runGenerator(template, { number: 2, seed: 123 });
  console.log('--- Run 2 with seed 123 (should be same as Run 1) ---');
  runGenerator(template, { number: 2, seed: 123 });
  console.log('--- Run 3 with seed 456 (should be different) ---');
  runGenerator(template, { number: 2, seed: 456 });
}

function exampleSeedPerItem() {
  console.log('--- Example: Using Seed Per Item for Deterministic Rows ---');
  const template = {
    id: "$number.int",
    name: "$person.firstName"
  };
  console.log('--- Run with seed 100 and seed-per-item ---');
  runGenerator(template, { number: 3, seed: 100, seedPerItem: true });
}

function runAllExamples() {
  exampleBasicJson();
  exampleMultipleItems();
  exampleFakerExpressions();
  exampleShorthand();
  exampleNestedObjectsAndArrays();
  exampleCsvOutput();
  exampleNdjsonStreaming();
  exampleSeeding();
  exampleSeedPerItem();
}

runAllExamples();