import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

const videos = [];
let nextId = 1;

app.get("/api/videos", (req, res) => {
    res.json(videos);
});

app.get("/api/videos/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const video = videos.find((v) => v.id === id);

    if (!video) {
        return res.status(404).json({ error: "비디오를 찾을 수 없습니다" });
    }

    res.json(video);
});

app.post("/api/videos", (req, res) => {
    const { title, filename } = req.body;

    if (!title || !filename) {
        return res.status(400).json({ error: "제목과 파일 이름은 필수입니다" });
    }

    const newVideo = {
        id: nextId++,
        title,
        filename,
        status: "pending",
        createdAt: new Date().toISOString(),
    }

    videos.push(newVideo);
    res.status(201).json(newVideo);
});

app.delete("/api/videos/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = videos.findIndex((v) => v.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "비디오를 찾을 수 없습니다" });
    }

    videos.splice(index, 1);
    res.status(204).send();
});


app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행중입니다`);
});