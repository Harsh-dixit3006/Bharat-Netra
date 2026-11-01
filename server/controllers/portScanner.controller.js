import net from "net";
import { updateWeekData } from "../utils/ApiAndToolsData.js";

// Function to scan a single port
const scanPort = (host, port, timeout = 2000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = "closed";

    socket.setTimeout(timeout);
    socket.on("connect", () => {
      status = "open";
      socket.destroy();
    });
    socket.on("timeout", () => socket.destroy());
    socket.on("error", () => socket.destroy());
    socket.on("close", () => resolve({ port, status }));

    socket.connect(port, host);
  });
};

// Controller function
export const scanPorts = async (req, res) => {
  const { host, ports } = req.body;

  if (!host || !ports || !Array.isArray(ports)) {
    return res.status(400).json({ error: "host and array of ports required" });
  }

  try {
    const results = await Promise.all(
      ports.map((port) => scanPort(host, port)),
    );

    await updateWeekData(req.userId, "Port Scanner");

    res.json({ host, results });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error scanning ports", details: err.message });
  }
};
