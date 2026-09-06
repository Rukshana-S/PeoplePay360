const { PrismaClient } = require("@prisma/client");

// Create a single instance of PrismaClient
// This prevents exhausting the database connection limit
const prisma = new PrismaClient();

module.exports = prisma;
