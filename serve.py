#!/usr/bin/env python3
"""
serve.py: Local web server for ॐ-SYNTH
Serves Om-synth with proper MIME types, CORS headers, and auto-opens the browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Ensure UTF-8 stdout for Windows consoles
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8080

DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

def start_server():
    os.chdir(DIRECTORY)
    port = 8080
    max_tries = 10
    httpd = None

    for attempt in range(max_tries):
        try:
            httpd = ThreadingServer(("", port), Handler)
            break
        except OSError:
            port += 1

    if not httpd:
        print(f"Error: Could not bind to any port between 8080 and {port - 1}")
        sys.exit(1)

    url = f"http://localhost:{port}/index.html"
    print(f"\n=======================================================")
    print(f"  ॐ-SYNTH Server Running at: {url}")
    print(f"  Directory: {DIRECTORY}")
    print(f"  Press Ctrl+C to stop.")
    print(f"=======================================================\n")
    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")

if __name__ == "__main__":
    start_server()

