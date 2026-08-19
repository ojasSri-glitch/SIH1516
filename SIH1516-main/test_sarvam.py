import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

key = "sk_21e5c35a11bc754ed6a7f173670e6f761127b2e2bbb41edc"

boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = (
    f"--{boundary}\r\n"
    f"Content-Disposition: form-data; name=\"language_code\"\r\n\r\n"
    f"hi-IN\r\n"
    f"--{boundary}\r\n"
    f"Content-Disposition: form-data; name=\"model\"\r\n\r\n"
    f"saaras:v1\r\n"
    f"--{boundary}--\r\n"
).encode("utf-8")

try:
    req = urllib.request.Request(
        "https://api.sarvam.ai/speech-to-text",
        data=body,
        headers={
            "api-subscription-key": key,
            "Content-Type": f"multipart/form-data; boundary={boundary}"
        }
    )
    res = urllib.request.urlopen(req, context=ctx)
    print("Sarvam SUCCESS:", res.getcode(), res.read().decode())
except urllib.error.HTTPError as e:
    print("Sarvam HTTP Error:", e.code, e.read().decode("utf-8", errors="ignore"))
except Exception as e:
    print("Sarvam Error:", e)
