#!/usr/bin/env python3
"""
desktop_app.py: Standalone Native Desktop App Launcher for ॐ-SYNTH
===================================================================
Launches ॐ-SYNTH as a dedicated native desktop application window
(no browser tabs, no address bar, standalone taskbar icon).

Supports:
1. pywebview (Native Windows WebView2 embed)
2. Native Edge App Mode (--app standalone window) fallback
"""

import sys
import os
import subprocess
import threading
import time
import http.server
import socketserver

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        pass  # Quiet server logs in desktop mode

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    port = PORT
    for _ in range(10):
        try:
            httpd = socketserver.TCPServer(("", port), QuietHandler)
            httpd.serve_forever()
            break
        except OSError:
            port += 1

def main():
    # 1. Start local server thread if not already running
    import urllib.request
    server_ready = False
    try:
        urllib.request.urlopen(f"http://localhost:{PORT}/index.html", timeout=1)
        server_ready = True
    except Exception:
        pass

    if not server_ready:
        t = threading.Thread(target=run_server, daemon=True)
        t.start()
        time.sleep(0.5)

    url = f"http://localhost:{PORT}/index.html"

    # 2. Try pywebview for full native window embedding
    try:
        import webview
        print("Launching with Native WebView2 Desktop Window...")
        webview.create_window(
            title="ॐ-SYNTH // The Sanskrit Acoustic Synthesizer",
            url=url,
            width=1320,
            height=880,
            min_size=(900, 600),
            background_color="#07090e"
        )
        webview.start()
        return
    except ImportError:
        pass

    # 3. Fallback: Launch Microsoft Edge in Standalone Native App Mode
    print("Launching in Standalone Windows App Mode (--app)...")
    try:
        subprocess.Popen(["msedge", f"--app={url}"])
    except FileNotFoundError:
        import webbrowser
        webbrowser.open(url)

if __name__ == "__main__":
    main()
