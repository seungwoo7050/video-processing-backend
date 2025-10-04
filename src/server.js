import http from "http";

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", message: "Server is running" }));
        return ;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행중입니다`);
});