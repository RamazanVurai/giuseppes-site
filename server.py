from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import Request, urlopen
import os


class SiteHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if urlparse(self.path).path != "/__download":
            return super().do_GET()

        image_url = parse_qs(urlparse(self.path).query).get("url", [""])[0]
        parsed = urlparse(image_url)
        allowed_path = parsed.path.startswith((
            "/wp-content/uploads/2024/11/",
            "/wp-content/uploads/2024/12/",
        ))
        if parsed.scheme != "https" or parsed.netloc != "giuseppeshairstudio.com.br" or not allowed_path:
            self.send_error(400, "Invalid image URL")
            return

        filename = os.path.basename(parsed.path)
        if not filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            self.send_error(400, "Unsupported image type")
            return

        # Start the browser download immediately. Waiting for the remote image
        # server before sending headers leaves Firefox showing "Waiting for
        # localhost" with no visible download in progress.
        extension = os.path.splitext(filename)[1].lower()
        content_types = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
        }
        self.send_response(200)
        self.send_header("Content-Type", content_types[extension])
        self.send_header("Content-Disposition", f"attachment; filename*=UTF-8''{quote(filename)}")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Connection", "close")
        self.end_headers()
        self.close_connection = True

        try:
            request = Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
            response = urlopen(request, timeout=20)
        except (HTTPError, URLError, TimeoutError) as error:
            self.log_error("Could not fetch image %s: %s", image_url, error)
            return

        with response:
            content_type = response.headers.get_content_type()
            if not content_type.startswith("image/"):
                self.log_error("The image URL returned a non-image response: %s", image_url)
                return
            content_length = response.headers.get("Content-Length")
            if content_length and int(content_length) > 30 * 1024 * 1024:
                self.log_error("Image exceeded 30 MB: %s", image_url)
                return

            total = 0
            while chunk := response.read(64 * 1024):
                total += len(chunk)
                if total > 30 * 1024 * 1024:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    break


if __name__ == "__main__":
    print("Giuseppes site running at http://localhost:8000")
    ThreadingHTTPServer(("0.0.0.0", 8000), SiteHandler).serve_forever()
