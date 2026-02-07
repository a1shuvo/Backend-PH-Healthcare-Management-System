import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { envVars } from "../../config/env";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = envVars.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
