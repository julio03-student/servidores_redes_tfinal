import paramiko

# Clase que maneja las solicitudes de autenticación
class SSHAuthHandler(paramiko.ServerInterface):
    def check_auth_password(self, username, password):
        # Validar las credenciales del usuario
        if username == 'root' and password == 'root':
            return paramiko.AUTH_SUCCESSFUL
        return paramiko.AUTH_FAILED

# Crear un servidor SSH
host_key = paramiko.RSAKey(filename='id_rsa.txt')  # Ruta de la clave privada
server = paramiko.Transport(('', 22))
server.add_server_key(host_key)

# Manejar las solicitudes de autenticación
auth_handler = SSHAuthHandler()
server.set_subsystem_handler('sftp', paramiko.SFTPServer, paramiko.SFTPServerInterface)
server.start_server(server=server)

# Ciclo principal del servidor
while True:
    client, addr = server.accept()
    print(f'Conexión establecida desde {addr[0]}:{addr[1]}')

    # Autenticar al cliente
    server.auth_publickey(username='', key=host_key)
    if not server.is_authenticated():
        server.close()
        continue

    # Abrir un canal de sesión
    channel = server.accept(20)
    if channel is None:
        server.close()
        continue

    # Procesar los comandos del cliente
    while channel.active:
        try:
            command = channel.recv(1024).decode('utf-8')
            print(f'Comando recibido: {command}')

            # Procesar el comando recibido

            channel.send('Respuesta del servidor')
        except paramiko.SSHException:
            break

    # Cerrar el canal y la conexión
    channel.close()
    server.close()
