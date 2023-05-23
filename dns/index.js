const dnsd = require('dnsd');

const server = dnsd.createServer();

const domains = {
  'dominioprueba.com': '172.20.10.10'
};

server.on('request', (request, response) => {
  const { question } = request;

  if (question.type === 'A' && domains[question.name]) {
    response.answer.push({ name: question.name, type: 'A', data: domains[question.name] });
  }

  response.end();
});

server.on('listening', () => {
  console.log('Servidor DNS escuchando en el puerto 53');
});

server.listen(53, '0.0.0.0');
