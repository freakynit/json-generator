/**
 * Shorthand mapping for common data types
 * Provides convenient aliases for frequently used faker methods
 * 
 * Usage: Instead of "$person.firstName", you can just use "firstName"
 */

const { faker } = require("@faker-js/faker");

const shorthandMap = {
  // Identity fields
  uuid: () => faker.string.uuid(),
  id: () => faker.string.uuid(),

  // Name fields
  name: () => faker.person.firstName(),
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),
  fullName: () => faker.person.fullName(),

  // Age
  age: () => faker.number.int({ min: 18, max: 80 }),

  // Internet/Communication
  email: () => faker.internet.email(),
  userName: () => faker.internet.userName(),
  url: () => faker.internet.url(),
  domain: () => faker.internet.domainName(),
  ip: () => faker.internet.ipv4(),
  ipv4: () => faker.internet.ipv4(),
  ipv6: () => faker.internet.ipv6(),
  password: () => faker.internet.password(),

  // Phone numbers
  phone: () => faker.phone.number(),
  phoneNumber: () => faker.phone.number(),

  // Location data
  city: () => faker.location.city(),
  state: () => faker.location.state(),
  country: () => faker.location.country(),
  latitude: () => faker.location.latitude(),
  longitude: () => faker.location.longitude(),

  // Company/Job information
  company: () => faker.company.name(),
  jobTitle: () => faker.person.jobTitle(),
  jobType: () => faker.person.jobType(),
  jobArea: () => faker.person.jobArea(),

  // Composite address object
  address: () => ({
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
  }),

  // Financial data
  iban: () => faker.finance.iban(),
  bic: () => faker.finance.bic(),

  // Date/Time
  date: () => faker.date.anytime(),
  pastDate: () => faker.date.past(),
  futureDate: () => faker.date.future(),

  // Text content
  lorem: () => faker.lorem.sentence(),
  sentence: () => faker.lorem.sentence(),
  paragraph: () => faker.lorem.paragraph(),
  words: () => faker.lorem.words(),

  // Numbers and booleans
  number: () => faker.number.int(), // default int
  int: () => faker.number.int(),
  float: () => faker.number.float(),
  boolean: () => faker.datatype.boolean(),
};

module.exports = shorthandMap;