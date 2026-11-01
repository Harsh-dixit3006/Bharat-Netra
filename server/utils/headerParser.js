// utils/headerParser.js
import { simpleParser } from "mailparser";
import dns from "dns/promises";

// Parse raw header using mailparser
export async function parseHeader(rawHeader) {
  try {
    const parsed = await simpleParser(rawHeader);
    return {
      headers: Object.fromEntries(parsed.headers),
      received: parsed.headerLines
        .filter((h) => h.key === "received")
        .map((h) => h.line),
    };
  } catch (err) {
    console.error("Header parse error:", err);
    return { headers: {}, received: [] };
  }
}

// Extract IPs from Received headers
export function getSendingIPs(receivedLines) {
  const ips = [];
  const regex = /\b\d{1,3}(\.\d{1,3}){3}\b/; // IPv4
  receivedLines.forEach((line) => {
    const match = line.match(regex);
    if (match) ips.push(match[0]);
  });
  return ips;
}

// SPF check (DNS TXT records)
export async function checkSPF(domain) {
  try {
    const records = await dns.resolveTxt(domain);
    const spfRecord = records.flat().find((r) => r.startsWith("v=spf1"));
    return { found: !!spfRecord, record: spfRecord || null };
  } catch {
    return { found: false, record: null };
  }
}

// DMARC check (DNS TXT at _dmarc.domain)
export async function checkDMARC(domain) {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarcRecord = records.flat().find((r) => r.startsWith("v=DMARC1"));
    return { found: !!dmarcRecord, record: dmarcRecord || null };
  } catch {
    return { found: false, record: null };
  }
}
