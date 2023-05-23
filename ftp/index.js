const FtpSrv = require('ftp-srv');
const fs = require('fs');

const ftpServer = new FtpSrv({
  url: 'ftp://localhost:21',
  pasv_range: '3000-4000',
  greeting: '¡Bienvenido al servidor FTP!',
  anonymous: true,
  file_format: 'ls'
});

ftpServer.on('login', (data, resolve) => {
  console.log(`Usuario conectado: ${data.username}`);
  resolve({ root: __dirname });
});

ftpServer.on('client-error', (connection, context, error) => {
  console.log(`Error de cliente: ${error}`);
});

ftpServer.listen()
  .then(() => {
    console.log('Servidor FTP iniciado...');
  })
  .catch((error) => {
    console.error(`Error al iniciar el servidor FTP: ${error}`);
  });