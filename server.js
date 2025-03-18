import url from "node:url";
import fs from "node:fs";
import http from "node:http";

let idCount = 1; 

const server = http.createServer((req, res) => {
  const { method } = req;
  const parsedUrl = url.parse(req.url, true);

  if (method === "POST" && parsedUrl.pathname === "/addFile") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const newData = {
          id: idCount++,
          ...data,
        };

        const content = JSON.stringify(newData) + "\n";

        fs.appendFileSync("someInfo.json", content);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newData));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid JSON");
      }
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(9090, () => {
  console.log("Server running on port 9090");
});
