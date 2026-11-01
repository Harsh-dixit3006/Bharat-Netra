import dns from "dns";
import { promisify } from "util";

// Promisify DNS functions
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);

// Common subdomains list
const commonSubdomains = [
  "www",
  "mail",
  "ftp",
  "webmail",
  "smtp",
  "pop",
  "ns1",
  "ns2",
  "admin",
  "forum",
  "blog",
  "api",
  "search",
  "dev",
  "app",
  "test",
  "stage",
  "secure",
  "demo",
  "cdn",
  "static",
  "img",
  "js",
  "css",
  "assets",
  "media",
  "video",
  "news",
  "shop",
  "store",
  "payment",
  "portal",
  "account",
  "login",
  "signin",
  "signup",
  "auth",
  "support",
  "help",
  "docs",
  "status",
  "monitor",
  "download",
  "upload",
  "server",
  "client",
  "cloud",
  "aws",
  "azure",
  "google",
  "microsoft",
];

// Function to check if a subdomain exists
async function checkSubdomain(domain, subdomain) {
  const hostname = `${subdomain}.${domain}`;

  try {
    // Try IPv4 first
    const addresses = await resolve4(hostname);
    return { subdomain: hostname, ip: addresses[0], type: "IPv4" };
  } catch {
    try {
      // If IPv4 fails, try IPv6
      const addresses = await resolve6(hostname);
      return { subdomain: hostname, ip: addresses[0], type: "IPv6" };
    } catch {
      return null; // Doesn't exist
    }
  }
}

// Main function to scan subdomains
export async function scanSubdomains(domain) {
  const results = [];
  const promises = [];

  for (const sub of commonSubdomains) {
    promises.push(
      checkSubdomain(domain, sub).then((result) => {
        if (result) results.push(result);
      })
    );
  }

  await Promise.all(promises);
  return results;
}
