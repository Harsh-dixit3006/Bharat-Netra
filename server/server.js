import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./configs/mongodb.config.js";
import domainInfoRouter from "./routes/domain.info.route.js";
import subdomainRouter from "./routes/subdomain.route.js";
import ipHistoryRouter from "./routes/iphistory.route.js";
import emailValidatorRouter from "./routes/email.validator.route.js";
import checkMalwareRouter from "./routes/checkMalware.route.js";
import portScannerRouter from "./routes/portScanner.route.js";
import macAddressLookupRouter from "./routes/macAddress.lookup.route.js";
import carrierRouter from "./routes/carrier.route.js";
import passwordBreakerRouter from "./routes/password.breaker.js";
import reverseIpRouter from "./routes/reverseip.lookup.route.js";
import userRouter from "./routes/user.routes.js";
import emailHeaderRouter from "./routes/analyzeHeader.route.js";
import authRouter from "./routes/auth.routes.js";
import {
  authenticate,
  verifyRequestOrigin,
} from "./middlewares/authenticate.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "https://official-bharat-netra.vercel.app",
    process.env.CLIENT_URL,
  ].filter(Boolean),
);
app.use(
  cors({
    credentials: true,
    origin: [...allowedOrigins],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use("/api", verifyRequestOrigin(allowedOrigins));
app.use("/api/auth", authRouter);
app.use("/api", authenticate);
app.use("/api/user", userRouter);
app.use("/api/domain/", domainInfoRouter);
app.use("/api/subdomain/", subdomainRouter);
app.use("/api/ip/", ipHistoryRouter);
app.use("/api/email/", emailValidatorRouter);
app.use("/api/malware/", checkMalwareRouter);
app.use("/api/ports/", portScannerRouter);
app.use("/api/macAddress/", macAddressLookupRouter);
app.use("/api/carrier/", carrierRouter);
app.use("/api/password/", passwordBreakerRouter);
app.use("/api/reverseip/", reverseIpRouter);
app.use("/api/email/", emailHeaderRouter);

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch {
  console.error("Server startup aborted because MongoDB connection failed.");
  process.exitCode = 1;
}
