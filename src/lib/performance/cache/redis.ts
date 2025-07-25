import { Redis } from "@upstash/redis";

export const client = new Redis({
  url: process.env.UPSTASH_CACHING_URL,
  token: process.env.UPSTASH_CACHING_TOKEN,
});
