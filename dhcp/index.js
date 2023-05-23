const dhcp = require('node-dhcp-server');

const server = dhcp.createServer({
  // Configuración del servidor DHCP
  range: [
    // Rango de direcciones IP disponibles para asignar
    '192.168.0.100',
    '192.168.0.200'
  ],
  static: [
    // Asignaciones estáticas de IP basadas en direcciones MAC
    { mac: '00:11:22:33:44:55', ip: '192.168.0.50' }
  ]
});

server.on('message', function (message) {
  // Manipulación de los mensajes DHCP recibidos
  console.log('Mensaje recibido:', message);

  // Asignación dinámica de IP a través de la dirección MAC
  const macAddress = message.chaddr.toString('hex').match(/../g).join(':');
  const ipAddress = server.getIP(macAddress);

  console.log('Asignación de IP:', ipAddress);

  if (ipAddress) {
    // Envío de la respuesta al dispositivo
    server.send(server.createOfferMessage(message, ipAddress));
  } else {
    // Envío de respuesta de rechazo al dispositivo
    server.send(server.createNakMessage(message));
  }
});

server.on('listening', function () {
  const address = server.address();
  console.log('Servidor DHCP escuchando en', address.address + ':' + address.port);
});

server.listen(67);
