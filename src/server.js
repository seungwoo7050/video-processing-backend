import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: "서버가 실행 중입니다" });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행중입니다`);
});