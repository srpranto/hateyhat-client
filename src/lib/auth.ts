import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

const secret = getRequiredEnv("BETTER_AUTH_SECRET");
const baseURL = getRequiredEnv("BETTER_AUTH_URL").replace(/\/$/, "");
const mongoUri = getRequiredEnv("MONGODB_URI");
const dbName = process.env.MONGODB_DB_NAME?.trim() || "hateyhat";

const client = new MongoClient(mongoUri);
const db = client.db(dbName);

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";

export const auth = betterAuth({
  secret,
  baseURL,
  trustedOrigins: [
    baseURL,
    ...(process.env.NEXT_PUBLIC_APP_URL
      ? [process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")]
      : []),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",
  ],
  advanced: {
    useSecureCookies: baseURL.startsWith("https://"),
  },
  rateLimit: {
    enabled: false,
  },
  onAPIError: {
    errorURL: `${baseURL}/login`,
  },
  database: mongodbAdapter(db),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      enabled: Boolean(googleClientId && googleClientSecret),
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
      },
    }),
    nextCookies(),
  ],
});
