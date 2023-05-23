const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 8081;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'http/index.html', req.url);
  const fileStream = fs.createReadStream(filePath);

  fileStream.on('error', () => {
    res.statusCode = 404;
    res.end('File not found');
  });

  fileStream.pipe(res);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});