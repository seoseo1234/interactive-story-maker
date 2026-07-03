import sys
import zipfile
import xml.etree.ElementTree as ET
import os

def read_hwpx(file_path):
    try:
        with zipfile.ZipFile(file_path, 'r') as zf:
            text = []
            for item in zf.namelist():
                if item.startswith('Contents/section') and item.endswith('.xml'):
                    xml_content = zf.read(item)
                    root = ET.fromstring(xml_content)
                    for t in root.iter():
                        if t.tag.endswith('t') and t.text:
                            text.append(t.text)
            return "\n".join(text)
    except Exception as e:
        return f"Error reading hwpx: {e}"

def read_hwp(file_path):
    try:
        import olefile
        f = olefile.OleFileIO(file_path)
        dirs = f.listdir()
        
        if ['PrvText'] in dirs:
            stream = f.openstream('PrvText')
            data = stream.read()
            return data.decode('utf-16le', errors='ignore')
        else:
            return "PrvText not found."
    except ImportError:
        return "olefile not installed"
    except Exception as e:
        return f"Error reading hwp: {e}"

if __name__ == "__main__":
    hwp_path = r"c:\Users\user\Documents\seostudio\2026.7.2 인터렉티브 스토리 제작소\이용약관 예시.hwp"
    hwpx_path = r"c:\Users\user\Documents\seostudio\2026.7.2 인터렉티브 스토리 제작소\개인정보처리방침.hwpx"
    
    print("--- HWP ---")
    print(read_hwp(hwp_path)[:2000])
    
    print("\n--- HWPX ---")
    print(read_hwpx(hwpx_path)[:2000])
