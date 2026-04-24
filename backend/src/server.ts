import express from "express";
import cors from "cors";
import { supabase } from "./supabase";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("Backend hidup 🚀");
});

app.post("/upload", async (req, res) => {
  try {
    const { name, theme, image } = req.body;

    // ✅ VALIDASI WAJIB
    if (!name || !theme || !image) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ✅ VALIDASI NAME
    if (typeof name !== "string" || name.length > 50) {
      return res.status(400).json({ error: "Invalid name" });
    }

    // ✅ VALIDASI THEME (biar gak diinject)
    if (!["snoopy", "furina"].includes(theme)) {
      return res.status(400).json({ error: "Invalid theme" });
    }

    // convert base64 → buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `${theme}-${Date.now()}.png`;

    // 🚀 upload ke Supabase
    const { error } = await supabase.storage
      .from("photobooth")
      .upload(fileName, buffer, {
        contentType: "image/png",
      });

    if (error) throw error;

    // ambil public URL
    const { data } = supabase.storage
      .from("photobooth")
      .getPublicUrl(fileName);

    console.log("🔥 Uploaded ke Supabase:", data.publicUrl);

    // 💾 SIMPAN KE DATABASE
    const { error: dbError } = await supabase
      .from("photobooth_results")
      .insert([
        {
          name,
          theme,
          image_url: data.publicUrl,
        },
      ]);

    if (dbError) {
      console.error("❌ DB insert error:", dbError);
    }

    res.json({
      message: "Image uploaded to Supabase ✅",
      fileName,
      url: data.publicUrl,
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});