import json

with open(r'C:\Users\ACER\.gemini\antigravity\brain\4dafebc9-60d4-4010-bb15-d8c63243a33d\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('source') == 'USER_EXPLICIT' or data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            if 'Phiếu đăng ký' in content or '17. Nhóm 17' in content or 'thầy' in content:
                print(f"=== STEP {data.get('step_index')} ===")
                print(content)

