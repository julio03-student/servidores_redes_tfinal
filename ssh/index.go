package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"

	"golang.org/x/crypto/ssh"
)

func main() {
	config := &ssh.ServerConfig{
		PublicKeyCallback: func(conn ssh.ConnMetadata, key ssh.PublicKey) (*ssh.Permissions, error) {
			// Puedes implementar lógica personalizada aquí para validar la clave pública recibida
			// Si la clave es válida, devuelve nil para permitir la autenticación
			// Si la clave no es válida, devuelve un error para rechazar la autenticación
			// En este ejemplo, permitimos cualquier clave pública sin validarla
			return nil, nil
		},
	}

	privateKeyBytes, err := ioutil.ReadFile("") // Ruta a tu clave privada
	if err != nil {
		log.Fatalf("Failed to load private key: %v", err)
	}

	privateKey, err := ssh.ParsePrivateKey(privateKeyBytes)
	if err != nil {
		log.Fatalf("Failed to parse private key: %v", err)
	}

	config.AddHostKey(privateKey)

	listener, err := net.Listen("tcp", "0.0.0.0:22")
	if err != nil {
		log.Fatalf("Failed to listen on port 22: %v", err)
	}

	log.Println("SSH server started")

	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Fatalf("Failed to accept incoming connection: %v", err)
		}

		go func() {
			defer conn.Close()

			sshConn, chans, reqs, err := ssh.NewServerConn(conn, config)
			if err != nil {
				log.Printf("Failed to establish SSH connection: %v", err)
				return
			}

			log.Printf("New SSH connection from %s", sshConn.RemoteAddr())

			go ssh.DiscardRequests(reqs)

			for newChannel := range chans {
				if newChannel.ChannelType() != "session" {
					newChannel.Reject(ssh.UnknownChannelType, "unknown channel type")
					continue
				}

				channel, _, err := newChannel.Accept()
				if err != nil {
					log.Printf("Failed to accept channel: %v", err)
					continue
				}

				go handleChannel(channel)
			}
		}()
	}
}

func handleChannel(channel ssh.Channel) {
	defer channel.Close()

	// Aquí puedes realizar acciones personalizadas en el canal SSH, como ejecutar comandos, transferir archivos, etc.
	// Por ejemplo, puedes utilizar la biblioteca "golang.org/x/crypto/ssh" para implementar funcionalidades adicionales.
	// En este ejemplo, simplemente descartamos cualquier dato recibido en el canal.
	for {
		_, err := channel.Read([]byte{0})
		if err != nil {
			return
		}
	}
}