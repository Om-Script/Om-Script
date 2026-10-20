#!/usr/bin/env python3
"""
download_ubc_sounds.py
Downloads all 90 UBC Sanskrit MP3 sound files locally into Om-synth/sounds/
so that the application plays instantaneously with zero network lag.
"""

import os
import urllib.request
import urllib.parse
import sys

# Ensure UTF-8 output
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

DEST_DIR = r"c:\Users\TAG-SB\Desktop\Sanskrit_Zero\Om-synth\sounds"
os.makedirs(DEST_DIR, exist_ok=True)


# List of all 90 MP3 filenames extracted from the UBC server
MP3_FILES = [
  # Core Vowels & Modifiers
  "as-a.mp3", "as-ā.mp3", "as-i.mp3", "as-ī.mp3", "as-u.mp3", "as-ū.mp3",
  "as-ṛ.mp3", "as-ṝ.mp3", "as-ḷ.mp3", "as-e.mp3", "as-ai.mp3", "as-o.mp3",
  "as-au.mp3", "as-ṃ.mp3", "as-ḥ.mp3",
  # Core Consonants
  "as-ka.mp3", "as-kha.mp3", "as-ga.mp3", "as-gha.mp3", "as-ṅa.mp3", "as-ha.mp3",
  "as-ca.mp3", "as-cha.mp3", "as-ja.mp3", "as-jha.mp3", "as-ña.mp3", "as-ya.mp3", "as-śa.mp3",
  "as-ṭa.mp3", "as-ṭha.mp3", "as-ḍa.mp3", "as-ḍha.mp3", "as-ṇa.mp3", "as-ra.mp3", "as-ṣa.mp3",
  "as-ta.mp3", "as-tha.mp3", "as-da.mp3", "as-dha.mp3", "as-na.mp3", "as-la.mp3", "as-sa.mp3",
  "as-pa.mp3", "as-pha.mp3", "as-ba.mp3", "as-bha.mp3", "as-ma.mp3", "as-va.mp3",
  # Vocabulary Examples
  "as-aśvaḥ.mp3", "as-āmraḥ.mp3", "as-ikṣuḥ.mp3", "as-īśaḥ.mp3", "as-udaram.mp3",
  "as-ūruḥ.mp3", "as-ṛṣiḥ.mp3", "as-ekaḥ.mp3", "as-airāvataḥ.mp3", "as-oṣṭhaḥ.mp3",
  "as-auṣadhiḥ.mp3", "as-kamalam.mp3", "as-kharaḥ.mp3", "as-gajaḥ.mp3", "as-ghaṭaḥ.mp3",
  "as-hastaḥ.mp3", "as-candraḥ.mp3", "as-chātraḥ.mp3", "as-jala.mp3", "as-jhasaḥ.mp3",
  "as-cañcū.mp3", "as-yajñaḥ.mp3", "as-śaśaḥ.mp3", "as-ṭaṅkaḥ.mp3", "as-ḍamaruḥ.mp3",
  "as-ḍhakkā.mp3", "as-bāṇaḥ.mp3", "as-rathaḥ.mp3", "as-ṣaṇmukhaḥ.mp3", "as-taruḥ.mp3",
  "as-dantaḥ.mp3", "as-dhenuḥ.mp3", "as-nayana.mp3", "as-latā.mp3", "as-sarpaḥ.mp3",
  "as-padmam.mp3", "as-phalam.mp3", "as-bakaḥ.mp3", "as-bhallūkaḥ.mp3", "as-makaraḥ.mp3",
  "as-vṛkṣaḥ.mp3", "as-biḍālaḥ.mp3", "as-drākṣā.mp3"
]

print(f"Downloading {len(MP3_FILES)} audio files to {DEST_DIR}...")
success = 0
for filename in MP3_FILES:
    dest_path = os.path.join(DEST_DIR, filename)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        success += 1
        continue
    
    url = f"https://ubcsanskrit.ca/sounds/{urllib.parse.quote(filename)}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(req, timeout=10).read()
        with open(dest_path, "wb") as f:
            f.write(data)
        success += 1
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print(f"Completed: {success}/{len(MP3_FILES)} files ready locally.")
