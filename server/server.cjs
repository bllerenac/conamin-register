const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const FILE_PATH = path.join(__dirname, 'registros.json');

// Initialize file if it doesn't exist
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/registros' && req.method === 'GET') {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al leer el archivo' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (req.url === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newUser = JSON.parse(body);

        // Server-side unique validation (DNI and Email)
        fs.readFile(FILE_PATH, 'utf8', (err, data) => {
          const list = err ? [] : JSON.parse(data || '[]');
          
          const isDniDuplicate = list.some(u => u.dni.toUpperCase() === newUser.dni.toUpperCase());
          const isEmailDuplicate = list.some(u => u.correo.toLowerCase() === newUser.correo.toLowerCase());
          
          if (isDniDuplicate) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'El DNI ya se encuentra registrado.' }));
            return;
          }
          if (isEmailDuplicate) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'El correo electrónico ya se encuentra registrado.' }));
            return;
          }

          list.push(newUser);
          fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2), err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Error al escribir el archivo' }));
              return;
            }
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, user: newUser }));
          });
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON inválido' }));
      }
    });
  } else if (req.url.startsWith('/api/delete/') && req.method === 'DELETE') {
    const idToDelete = req.url.split('/api/delete/')[1];
    if (!idToDelete) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'ID no proporcionado' }));
      return;
    }
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al leer el archivo' }));
        return;
      }
      let list = [];
      try {
        list = JSON.parse(data || '[]');
      } catch (e) {
        list = [];
      }
      const filteredList = list.filter(u => u.id !== idToDelete);
      fs.writeFile(FILE_PATH, JSON.stringify(filteredList, null, 2), err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Error al escribir el archivo' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor API corriendo en el puerto ${PORT}`);
});
