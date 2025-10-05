# JSON Generator

A powerful CLI tool for generating realistic JSON data using [Faker.js](https://fakerjs.dev/) with template support, shorthand syntax, and multiple output formats. Perfect for testing, development, and data seeding.

## 🚀 Features

- **Template-based generation** - Use JSON templates with Faker.js expressions
- **Shorthand syntax** - Quick aliases for common data types (`email`, `name`, `uuid`, etc.)
- **Built-in presets** - Ready-to-use templates for users, products, companies, and more
- **Multiple output formats** - JSON arrays, NDJSON streaming, and more
- **Deterministic output** - Seeding support for reproducible data
- **Modular architecture** - Clean, maintainable codebase
- **CLI and programmatic API** - Use as a command-line tool or Node.js module

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g @freakynit/json-generator
```

### Local Installation
```bash
npm install @freakynit/json-generator
```

### From Source
```bash
git clone https://github.com/freakynit/json-generator.git
cd json-generator
npm install
npm link  # Optional: for global CLI access
```

## 🎯 Quick Start

### Basic Usage
```bash
# Generate a single user object
json-generator '{"name": "fullName", "email": "email", "age": "age"}'

# Generate 5 users
json-generator '{"name": "fullName", "email": "email"}' -n 5

# Use a built-in preset
json-generator user -n 3

# Save to file
json-generator user -n 100 -o users.json
```

### Using Presets
```bash
# List all available presets
json-generator --list-presets

# Generate sample data using presets
json-generator user -n 10        # User profiles
json-generator product -n 5      # E-commerce products  
json-generator company -n 3      # Company information
json-generator order -n 2        # Order data with items
json-generator post -n 5         # Blog posts
json-generator event -n 3        # Event information
```

## 📖 Usage Guide

### Template Syntax

#### 1. Shorthand Syntax
Use simple strings for common data types:
```bash
json-generator '{"id": "uuid", "name": "fullName", "email": "email", "city": "city"}'
```

#### 2. Faker.js Expressions
Use `$` prefix for direct Faker.js method calls:
```bash
json-generator '{"username": "$internet.userName", "avatar": "$image.avatar"}'
```

#### 3. Faker.js with Parameters
Pass parameters using JSON syntax:
```bash
json-generator '{"age": "$number.int({\"min\":18,\"max\":65})", "score": "$number.float({\"min\":0,\"max\":100,\"precision\":0.01})"}'
```

#### 4. Array Generation
Use the special `$array` syntax:
```bash
json-generator '{"tags": {"$array": "$lorem.word", "number": 5}}'
json-generator '{"items": {"$array": {"of": {"name": "fullName", "price": "$commerce.price"}}, "number": 3}}'
```

#### 5. Key-only Shorthand
Use `true` or `null` as values with shorthand keys:
```bash
json-generator '{"email": true, "name": null, "phone": true}'
```

### Available Shorthands

| Shorthand | Description | Faker.js Equivalent |
|-----------|-------------|-------------------|
| `uuid`, `id` | UUID v4 | `faker.string.uuid()` |
| `name`, `firstName` | First name | `faker.person.firstName()` |
| `lastName` | Last name | `faker.person.lastName()` |
| `fullName` | Full name | `faker.person.fullName()` |
| `email` | Email address | `faker.internet.email()` |
| `userName` | Username | `faker.internet.userName()` |
| `phone` | Phone number | `faker.phone.number()` |
| `city` | City name | `faker.location.city()` |
| `country` | Country name | `faker.location.country()` |
| `company` | Company name | `faker.company.name()` |
| `address` | Full address object | Complex object with street, city, etc. |
| `date` | Random date | `faker.date.anytime()` |
| `pastDate` | Past date | `faker.date.past()` |
| `futureDate` | Future date | `faker.date.future()` |
| `boolean` | Boolean value | `faker.datatype.boolean()` |
| `number`, `int` | Integer | `faker.number.int()` |
| `float` | Float number | `faker.number.float()` |

### Command Line Options

```bash
json-generator <template> [options]

Arguments:
  template                    JSON template, preset name, or template file path

Options:
  -n, --number <count>        Number of objects to generate (default: 1)
  -t, --template-file <path>  Path to JSON template file
  -s, --stream               NDJSON streaming output (one JSON per line)
  -f, --format <fmt>         Output format: json|ndjson (default: json)
  --seed <num>               Seed for deterministic output
  --seed-per-item            Apply seed + index per item for deterministic rows
  -o, --output <path>        Output file path
  --list-presets             List available presets
  -h, --help                 Display help information
```

## 💡 Examples

### Basic Examples

#### Single Object
```bash
json-generator '{"name": "fullName", "email": "email", "registered": "pastDate"}'
```

#### Multiple Objects
```bash
json-generator '{"id": "uuid", "title": "$lorem.sentence"}' -n 5
```

#### Complex Nested Structure
```bash
json-generator '{
  "user": {
    "id": "uuid",
    "profile": {
      "name": "fullName",
      "email": "email",
      "address": "address"
    },
    "preferences": {
      "theme": "$helpers.arrayElement([\"light\",\"dark\"])",
      "notifications": "boolean"
    }
  },
  "metadata": {
    "created": "pastDate",
    "tags": {"$array": "$lorem.word", "number": 3}
  }
}' -n 2
```

### Output Formats

#### Standard JSON Array
```bash
json-generator user -n 3 -o users.json
```

#### NDJSON Streaming
```bash
json-generator user -n 1000 -f ndjson -o users.ndjson
```

#### Streaming to stdout
```bash
json-generator product -n 5 -s | jq '.name'
```

### Deterministic Output

#### Global Seed
```bash
json-generator user -n 5 --seed 12345
```

#### Per-item Seed
```bash
json-generator user -n 5 --seed 12345 --seed-per-item
```

### Template Files

Create a template file `user-template.json`:
```json
{
  "id": "uuid",
  "profile": {
    "firstName": "firstName",
    "lastName": "lastName",
    "email": "email",
    "avatar": "$image.avatar"
  },
  "account": {
    "username": "userName",
    "createdAt": "pastDate",
    "isActive": "boolean",
    "loginCount": "$number.int({\"min\":0,\"max\":1000})"
  },
  "preferences": {
    "theme": "$helpers.arrayElement([\"light\",\"dark\",\"auto\"])",
    "language": "$helpers.arrayElement([\"en\",\"es\",\"fr\",\"de\"])",
    "notifications": {
      "email": "boolean",
      "push": "boolean",
      "sms": "boolean"
    }
  }
}
```

Use the template:
```bash
json-generator -t user-template.json -n 10 -o users.json
```

## 🔧 Programmatic API

You can also use JSON Generator as a Node.js module:

```javascript
const { 
  resolveValue, 
  generateItems, 
  presets 
} = require('json-generator');

// Resolve a single template
const template = { name: "fullName", email: "email" };
const result = resolveValue(template);
console.log(result); // { name: "John Doe", email: "john@example.com" }

// Generate multiple items
const items = Array.from(generateItems(template, 5));
console.log(items); // Array of 5 user objects

// Use presets
const users = Array.from(generateItems(presets.user, 3));
console.log(users); // Array of 3 complete user profiles
```

### API Reference

#### `resolveValue(template)`
Resolves a single template value.
- `template`: Template object or value to resolve
- Returns: Resolved value with fake data

#### `generateItems(template, count, seed?, seedPerItem?)`
Generator function that yields resolved template items.
- `template`: Template to resolve for each item
- `count`: Number of items to generate
- `seed`: Optional seed for deterministic output
- `seedPerItem`: Whether to apply seed+index per item
- Yields: Resolved template items

#### `presets`
Object containing built-in presets: `user`, `product`, `company`, `order`, `post`, `event`

## 🏗️ Architecture

The project follows a modular architecture:
```
src/
├── index.js              # Main entry point and module exports
├── cli.js                # Command-line interface logic
├── shorthand-map.js      # Shorthand mappings for common data types
├── faker-resolver.js     # Faker.js expression parser and resolver
├── template-resolver.js  # Core template processing engine
├── generator.js          # Data generation utilities with seeding
├── presets.js           # Built-in template presets
├── output-utils.js      # File and console output utilities
└── examples.js          # Usage examples and demonstrations
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

```bash
git clone https://github.com/freakynit/json-generator.git
cd json-generator
npm install

# Run examples
node src/examples.js

# Test CLI locally
node src/index.js user -n 3
```

### Adding New Presets

To add a new preset, edit `src/presets.js`:

```javascript
const presets = {
  // ... existing presets
  
  myNewPreset: {
    id: "uuid",
    customField: "$faker.expression",
    // ... more fields
  }
};
```

### Adding New Shorthands

To add new shorthand mappings, edit `src/shorthand-map.js`:

```javascript
const shorthandMap = {
  // ... existing shorthands
  
  myShorthand: () => faker.someMethod(),
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Faker.js](https://fakerjs.dev/) - For providing the excellent fake data generation library
- [Commander.js](https://github.com/tj/commander.js/) - For the CLI framework
- All contributors who help improve this project

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/freakynit/json-generator/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/freakynit/json-generator/issues)
- 📧 **Email**: nitinbansal85@gmail.com
- 🌐 **GitHub**: [@freakynit](https://github.com/freakynit)

---

**Happy Data Generation!** 🎉
