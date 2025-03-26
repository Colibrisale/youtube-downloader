const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// 👇 Вот эта строка говорит серверу отдавать HTML из папки public
app.use(express.static(path.join(__dirname, "public")));

// 🔻 Это и есть логика загрузки YouTube
app.get("/download", async (req, res) => {
  const videoURL = req.query.url;
  const format = req.query.format || "mp4";

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).send("Invalid YouTube URL.");
  }

  const info = await ytdl.getInfo(videoURL);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, "").substring(0, 50);

  res.header("Content-Disposition", `attachment; filename="${title}.${format}"`);

  if (format === "mp3") {
    ytdl(videoURL, { filter: "audioonly" }).pipe(res);
  } else {
    ytdl(videoURL, { quality: "highestvideo" }).pipe(res);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
