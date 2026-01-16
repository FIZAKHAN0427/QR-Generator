import express from "express";
import qr from "qr-image";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/generate-qr", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Generate QR code as PNG
    const qr_image = qr.image(url, { type: "png" });
    
    // Convert to base64 for sending to frontend
    const chunks = [];
    qr_image.on("data", (chunk) => chunks.push(chunk));
    qr_image.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString("base64");
      res.json({ success: true, qrCode: `data:image/png;base64,${base64}` });
    });
    qr_image.on("error", (err) => {
      res.status(500).json({ error: "Failed to generate QR code" });
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`QR Code Generator running at http://localhost:${PORT}`);
});
