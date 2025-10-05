/**
 * Predefined templates for common use cases
 * These presets allow users to quickly generate common data structures
 * without having to write full JSON templates
 */

const presets = {
  user: {
    id: "uuid",
    firstName: "firstName",
    lastName: "lastName",
    fullName: "fullName",
    email: "email",
    username: "userName",
    age: "age",
    phone: "phone",
    address: "address",
    avatar: "$image.avatar",
    createdAt: "pastDate",
    isActive: "boolean"
  },
  
  product: {
    id: "uuid",
    name: "$commerce.productName",
    description: "$commerce.productDescription",
    price: "$commerce.price",
    category: "$commerce.department",
    sku: "$string.alphanumeric(8)",
    inStock: "boolean",
    rating: "$number.float({\"min\":1,\"max\":5,\"precision\":0.1})",
    tags: {
      "$array": "$commerce.productAdjective",
      "number": 3
    },
    createdAt: "pastDate"
  },
  
  company: {
    id: "uuid",
    name: "company",
    industry: "$company.buzzPhrase",
    website: "url",
    email: "email",
    phone: "phone",
    address: "address",
    employees: "$number.int({\"min\":10,\"max\":10000})",
    founded: "$date.past({\"years\":50})",
    revenue: "$finance.amount({\"min\":100000,\"max\":10000000})"
  },
  
  order: {
    id: "uuid",
    orderNumber: "$string.alphanumeric(10)",
    customerId: "uuid",
    customerName: "fullName",
    customerEmail: "email",
    items: {
      "$array": {
        "of": {
          "productId": "uuid",
          "productName": "$commerce.productName",
          "quantity": "$number.int({\"min\":1,\"max\":5})",
          "price": "$commerce.price"
        }
      },
      "number": "$number.int({\"min\":1,\"max\":8})"
    },
    total: "$commerce.price({\"min\":50,\"max\":2000})",
    status: "$helpers.arrayElement([\"pending\",\"processing\",\"shipped\",\"delivered\",\"cancelled\"])",
    orderDate: "pastDate",
    shippingAddress: "address"
  },
  
  post: {
    id: "uuid",
    title: "$lorem.sentence({\"min\":3,\"max\":8})",
    content: "$lorem.paragraphs({\"min\":2,\"max\":5})",
    excerpt: "$lorem.sentence({\"min\":10,\"max\":20})",
    author: {
      id: "uuid",
      name: "fullName",
      email: "email",
      avatar: "$image.avatar"
    },
    tags: {
      "$array": "$lorem.word",
      "number": "$number.int({\"min\":2,\"max\":6})"
    },
    publishedAt: "pastDate",
    updatedAt: "date",
    isPublished: "boolean",
    viewCount: "$number.int({\"min\":0,\"max\":10000})",
    likeCount: "$number.int({\"min\":0,\"max\":1000})"
  },
  
  event: {
    id: "uuid",
    title: "$lorem.sentence({\"min\":2,\"max\":6})",
    description: "$lorem.paragraph",
    startDate: "futureDate",
    endDate: "futureDate",
    location: {
      venue: "$company.name",
      address: "address",
      city: "city",
      country: "country"
    },
    organizer: {
      name: "fullName",
      email: "email",
      phone: "phone"
    },
    capacity: "$number.int({\"min\":50,\"max\":5000})",
    ticketPrice: "$commerce.price({\"min\":10,\"max\":500})",
    category: "$helpers.arrayElement([\"conference\",\"workshop\",\"seminar\",\"networking\",\"social\"])",
    isOnline: "boolean"
  }
};

module.exports = presets;