package meijo

import (
	"fmt"
	"io"
	"net"
	"os"
)

func handleClient(conn net.Conn) {
	defer conn.Close()
	fmt.Println("Client connected:", conn.RemoteAddr())
	path := "icp_data.pdf"
	file, err := os.Create(path)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}

	defer file.Close()

	for {
		buffer := make([]byte, 1024)
		n, err := conn.Read(buffer)
		if err != nil {
			if err != io.EOF {
				fmt.Println("Error reading from connection:", err)
			}
			break
		}
		if n > 0 {
			_, err := file.Write(buffer[:n])
			if err != nil {
				fmt.Println("Error writing to file:", err)
				return
			}
		}
	}
}

func RunPrintServer() {
	println("Print server running with printer 'printer_name' on port 'printer_port_name'.")
	s, err := net.Listen("tcp", "127.0.0.1:9101")
	if err != nil {
		fmt.Println("Error starting server:", err)
		return
	}
	go func() {
		println("Waiting for a connection...")
		for {
			conn, err := s.Accept()
			if err != nil {
				fmt.Println("Error accepting connection:", err)
				continue
			}
			go handleClient(conn)
		}
	}()
}