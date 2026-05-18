---
name: EP-ERR-010
description: 'Error pattern registry: powershell-replace-wipe — PowerShell -replace operator with multi-part concatenated replacement silently overwrites files with empty content on non-terminating error.'
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-010
pattern_name: powershell-replace-wipe
first_observed: S041
recurrence_count: 1
trigger: Any PowerShell -replace operator where the replacement string uses + concatenation (e.g. 'A' + "`n" + 'B'). PS5.1 throws non-terminating error. $newContent = $null. Files get written as 0 bytes.
sample_incident: "OPEN-043 S041: PowerShell batch script to add <script src='/page-data.js'> to 45 HTML files. -replace failed for all 45 files. All files written as 0 bytes. Entire playground wiped. Recovered from Vercel deployment using curl -k."
mechanical_prevention: Use .NET string .Replace() method: $content.Replace($old, $new). Never -replace with concatenation. Always test on ONE file before batch.
principle_reference: P-META-019
related_error: EP-ERR-001
status: mechanically_prevented
session: S041
scope_level: S3
links:
  - { rel: related, href: EP-ERR-001-done-equals-committed.md }
  - { rel: context, href: ../../../../tools/council/communication-protocol-shared.md }
---

# EP-ERR-010 — PowerShell Replace Wipe

**Training default:** "I wrote a batch replacement script → the files are updated."

**CSPS override:** Batch replacement scripts must: (1) test on ONE file first, (2) verify result explicitly, (3) only proceed to all files after manual confirmation of correct output.

**What happened:**
PowerShell 5.1's `-replace` operator does not support concatenation in the replacement string. `$content -replace 'A', 'B' + 'C'` throws a non-terminating error. `$newContent` is set to `$null`. The conditional `if ($content -ne $newContent)` evaluates `true` (non-empty ≠ null). `WriteAllText($path, $null)` writes 0 bytes. 45 files silently wiped.

**Prevention (use this pattern instead):**
```powershell
# CORRECT: .NET string method
$content = [System.IO.File]::ReadAllText($path)
$newContent = $content.Replace('<script src="/nav.js"></script>',
    '<script src="/page-data.js"></script><script src="/nav.js"></script>')
[System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($newContent))

# WRONG: -replace with concatenation
$content -replace 'A', 'B' + "`n" + 'C'  # ← NEVER DO THIS in PS 5.1
```

**Deeper structural prevention:**
The playground had NO git repository. Without git, file wipes are irreversible (no `git checkout .`). Files were only recoverable because the Vercel deployment was still live. **Structural fix: make the playground a git repository.** See OPEN-051.
