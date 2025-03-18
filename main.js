import { createServer } from "http";
import url from "url";
import fs from "node:fs"

// Initial product list
const products = [
  {
    id: 0,
    name: "Apple MacBook",
    price: 10000,
    year: 2025,
  },
  {
    id: 1,
    name: "acer",
    price: 750,
    year: 2022,
  },
];

const server = createServer((req, res) => {
  const { method } = req;
  const parsedUrl = url.parse(req.url, true);

  // GET: Return all products
  if (method === "GET" && parsedUrl.pathname === "/products") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products));
    return;
  }

  // POST: Add a new product
  else if (method === "POST" && parsedUrl.pathname === "/products") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const newProduct = {
          id: products.length,
          ...data,
        };
        
        products.push(newProduct);
        fs.writeFileSync("products.txt", newProduct)

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newProduct));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid JSON");
      }
    });

    return;
  }

  // PUT: Update product by id (e.g. /products?id=1)
  else if (method === "PUT" && parsedUrl.pathname === "/products") {
    const id = parseInt(parsedUrl.query.id);

    if (isNaN(id) || id < 0 || id >= products.length) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid product ID");
      return;
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const updateData = JSON.parse(body);
        products[id] = { ...products[id], ...updateData };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(products[id]));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid JSON");
      }
    });

    return;
  }

  // Fallback for unknown routes
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found!");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
