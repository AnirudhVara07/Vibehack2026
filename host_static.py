#!/usr/bin/env python3
import os
import sys
import http.server
import socketserver
import webbrowser
import subprocess
import time

# ANSI Escape Codes for beautiful terminal styling
BLUE = "\033[94m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

PORT = 8000
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_DIR = os.path.join(WORKSPACE_DIR, "dist", "client")

def print_status(message, color=BLUE):
    print(f"{color}{BOLD}[*] {message}{RESET}")

def print_success(message):
    print(f"{GREEN}{BOLD}[+] {message}{RESET}")

def print_warning(message):
    print(f"{YELLOW}{BOLD}[!] {message}{RESET}")

def print_error(message):
    print(f"{RED}{BOLD}[-] {message}{RESET}")

def run_command(command, description):
    print_status(f"{description}...", BLUE)
    try:
        # Run with output piped to console
        result = subprocess.run(command, shell=True, cwd=WORKSPACE_DIR, check=True)
        if result.returncode == 0:
            print_success(f"Successfully finished: {description}")
            return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to execute: {description}")
        print_error(f"Error: {e}")
        return False
    except Exception as e:
        print_error(f"An unexpected error occurred: {e}")
        return False

def check_and_build():
    node_modules_path = os.path.join(WORKSPACE_DIR, "node_modules")
    index_html_path = os.path.join(CLIENT_DIR, "index.html")
    
    # 1. Check if dependencies are installed
    if not os.path.exists(node_modules_path):
        print_warning("node_modules directory not found.")
        success = run_command("npm install --legacy-peer-deps", "Installing package dependencies")
        if not success:
            sys.exit(1)
            
    # 2. Check if built files or index.html exists
    # Force rebuild if --rebuild or -r flag is passed
    force_rebuild = "--rebuild" in sys.argv or "-r" in sys.argv
    
    if not os.path.exists(index_html_path) or force_rebuild:
        if force_rebuild:
            print_status("Forcing build...", YELLOW)
        else:
            print_warning("Static index.html not found. Building the application first...")
        
        success = run_command("npm run build", "Building and prerendering the application")
        if not success:
            sys.exit(1)

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    A custom HTTP handler that supports SPA (Single Page Application) routing fallback.
    If a file or directory isn't found on disk, we serve the main index.html file
    so that client-side routers (like TanStack Router) can resolve the path.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=CLIENT_DIR, **kwargs)

    def do_GET(self):
        # Parse query parameters/hash away to get the exact file path
        url_path = self.path.split('?')[0].split('#')[0]
        clean_path = url_path.lstrip('/')
        disk_path = os.path.join(CLIENT_DIR, clean_path)

        # SPA Fallback logic:
        # If the requested path is not a file or directory on the disk, fallback to index.html
        if not os.path.exists(disk_path):
            self.path = "/index.html"
        elif os.path.isdir(disk_path):
            # If it is a directory but has no index.html, fallback to root index.html
            if not os.path.exists(os.path.join(disk_path, "index.html")):
                self.path = "/index.html"
                
        return super().do_GET()

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), SPARequestHandler) as httpd:
            url = f"http://localhost:{PORT}"
            print("\n" + "=" * 55)
            print(f" {GREEN}{BOLD}MindCircle Local Server is up and running!{RESET}")
            print(f" Local URL:  {BLUE}{BOLD}{url}{RESET}")
            print(f" Serving:    {CLIENT_DIR}")
            print("=" * 55 + "\n")
            print_status("Opening web browser...", BLUE)
            
            # Tiny delay to ensure server is listening before browser opens
            time.sleep(0.5)
            webbrowser.open(url)
            
            print_success("Press Ctrl+C to stop the server.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n")
        print_warning("Server stopped by user request. Goodbye!")
    except Exception as e:
        print_error(f"Could not start the server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Ensure client dir exists / built
    check_and_build()
    # Start the server
    start_server()
