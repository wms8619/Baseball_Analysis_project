# server.py
import http.server
import socketserver
import os

PORT = 8000

# Change directory to the script's location (optional, but ensures correct path)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving files from directory: {os.getcwd()}")
    print(f"Go to your browser and open: http://localhost:{PORT}")
    try:
        # Start the server (runs indefinitely)
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()