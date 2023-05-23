const { Server } = require('ssh2');
const fs = require('fs');

const server = new Server({
  hostKeys: [fs.readFileSync('C:/Users/57301/.ssh/id_rsa')]
});

server.on('connection', (client, info) => {
  console.log('Client connected!');

  client.on('authentication', (ctx) => {

    console.log(ctx.method +  ' ' + ctx.username + ' ' + ctx.password);

    if (
      ctx.method === 'password' &&
      ctx.username === 'root' &&
      ctx.password === 'root1'
    ) {
      ctx.accept();
    } else {
      ctx.reject();
    }
  });

  client.on('ready', () => {
    console.log('Client authenticated and ready!');
    client.end();
  });

  client.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(22, '0.0.0.0', () => {
  console.log('SSH server started');
});
