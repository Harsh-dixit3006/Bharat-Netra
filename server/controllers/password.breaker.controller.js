import fs from "fs";
import zlib from "zlib";
import crypto from "crypto";
import readline from "readline";
import { updateWeekData } from "../utils/ApiAndToolsData.js";

const detectHashType = (hash) => {
  hash = hash.toLowerCase().trim();
  if (/^[a-f0-9]{32}$/.test(hash)) return "md5";
  if (/^[a-f0-9]{40}$/.test(hash)) return "sha1";
  if (/^[a-f0-9]{64}$/.test(hash)) return "sha256";
  if (/^[a-f0-9]{128}$/.test(hash)) return "sha512";

  return "unknown";
};

export const passwordBreaker = async (req, res) => {
  const { targetHash } = req.body;
  const hashType = detectHashType(targetHash);
  const TIME_LIMIT = 8 * 1000;

  await updateWeekData(req.userId, "Password Hash Breaker");

  if (hashType === "unknown") {
    return res.json({
      hash: targetHash,
      hashType: "Unsupported / invalid hashType",
      password: "Not found",
    });
  }
  const fileStream = fs.createReadStream("./rockyou.txt.gz");
  const unzipStream = zlib.createGunzip();

  const rl = readline.createInterface({
    input: fileStream.pipe(unzipStream),
    crlfDelay: Infinity,
  });

  const startTime = Date.now();
  for await (const line of rl) {
    const timeCounter = Date.now() - startTime;
    if (timeCounter > TIME_LIMIT) {
      return res.json({
        hash: targetHash,
        hashType: hashType,
        password: "Not found",
      });
    }
    const word = line.trim();

    const hash = crypto.createHash(hashType).update(word).digest("hex");

    if (hash === targetHash) {
      return res.json({
        hash: targetHash,
        hashType: hashType,
        password: word,
      });
    }
  }
  return res.json({
    hash: targetHash,
    hashType: hashType,
    password: "Not found",
  });
};
