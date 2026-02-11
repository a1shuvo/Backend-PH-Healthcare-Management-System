import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import ms, { StringValue } from "ms";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  session: {
    // Takes seconds instead of miliseconds
    expiresIn:
      ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue) / 60,
    // Takes seconds instead of miliseconds
    updateAge:
      ms(envVars.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as StringValue) / 60,
    cookieCache: {
      enabled: true,
      // Takes seconds instead of miliseconds
      maxAge:
        ms(envVars.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as StringValue) / 60,
    },
  },

  /* trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000"],
  advanced: {
    disableCSRFCheck: true,
  }, */
});
