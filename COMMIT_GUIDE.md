# Git Commit 가이드 (Conventional Commits)

Cursor 내부 터미널에서는 `git commit` 시 `--trailer` 옵션으로 인해 오류가 발생할 수 있습니다.
**외부 PowerShell 또는 CMD**에서 아래 명령을 실행하세요.

---

## 옵션 1: 기능별 분리 커밋 (권장)

```powershell
cd "D:\Cursor\Forest Shuffle Dartmoor Solo Play Assistant"
powershell -ExecutionPolicy Bypass -File commit-by-feature.ps1
```

---

## 옵션 2: 수동 단일 커밋

```powershell
cd "D:\Cursor\Forest Shuffle Dartmoor Solo Play Assistant"
git add -A
git commit -m "feat: Add game verification with QR scan and certificate" -m "
- chore(deps): Add pako, jsqr, qrcode for QR verification
- feat(verification): Add verification service with compress/decompress
- feat(verification): Add VerifyScreen with camera and image QR scan
- feat(verification): Integrate verification into certificate generation
- feat(app): Add VerifyScreen to navigation
- i18n: Add verification screen translations (ko, en)
- style: Add verification screen UI styles
"
```

---

## 옵션 3: 수동으로 커밋 메시지 확인 후 커밋

```powershell
cd "D:\Cursor\Forest Shuffle Dartmoor Solo Play Assistant"
git add -A
git commit
# 에디터에서 아래 메시지 붙여넣기 후 저장
```

**커밋 메시지 예시:**
```
feat: Add game verification with QR scan and certificate

- chore(deps): Add pako, jsqr, qrcode for QR verification
- feat(verification): Add verification service with compress/decompress
- feat(verification): Add VerifyScreen with camera and image QR scan
- feat(verification): Integrate verification into certificate generation
- feat(app): Add VerifyScreen to navigation
- i18n: Add verification screen translations (ko, en)
- style: Add verification screen UI styles
```

---

## Conventional Commit 형식 참고

| 접두사 | 용도 |
|--------|------|
| `feat:` | 새 기능 |
| `fix:` | 버그 수정 |
| `chore:` | 빌드, 설정, 의존성 등 |
| `refactor:` | 리팩터링 |
| `style:` | 코드 스타일/포맷 |
| `i18n:` | 번역/다국어 |
| `docs:` | 문서 |
