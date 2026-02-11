# Forest Shuffle - Conventional Commit 스크립트
# Cursor 내부 터미널의 --trailer 이슈를 피하려면 외부 PowerShell/CMD에서 실행하세요.
# 사용법: powershell -ExecutionPolicy Bypass -File commit-by-feature.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "=== Forest Shuffle - Conventional Commit ===" -ForegroundColor Cyan

# 1. chore: 의존성 추가
Write-Host "`n[1/8] chore(deps): Add pako, jsqr, qrcode for QR verification" -ForegroundColor Yellow
git add package.json package-lock.json
git commit -m "chore(deps): Add pako, jsqr, qrcode for QR verification" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (스킵 또는 이미 커밋됨)" -ForegroundColor Gray }

# 2. feat: 타입 정의
Write-Host "`n[2/8] feat(types): Add VerificationData, VerificationRecord types" -ForegroundColor Yellow
git add src/types/index.ts
git commit -m "feat(types): Add VerificationData, VerificationRecord and extend GameHistory" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (스킵 또는 이미 커밋됨)" -ForegroundColor Gray }

# 3. feat: 인증 서비스
Write-Host "`n[3/8] feat(verification): Add verification service" -ForegroundColor Yellow
git add src/services/verification.ts
git commit -m "feat(verification): Add verification service with compress/decompress and QR encode" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (스킵 또는 이미 커밋됨)" -ForegroundColor Gray }

# 4. feat: 인증 화면
Write-Host "`n[4/8] feat(verification): Add VerifyScreen with QR scan" -ForegroundColor Yellow
git add src/components/VerifyScreen.tsx
git commit -m "feat(verification): Add VerifyScreen with camera and image QR scan" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (스킵 또는 이미 커밋됨)" -ForegroundColor Gray }

# 5. feat: 인증 및 앱 통합
Write-Host "`n[5/8] feat(verification): Integrate verification into certificate and app" -ForegroundColor Yellow
git add src/services/certificate.ts src/services/history.ts src/services/scoring.ts
git add src/App.tsx src/store/gameStore.ts
git add src/components/HistoryScreen.tsx src/components/PlayScreen.tsx
git add src/components/ScoreInputForm.tsx src/components/ScoringScreen.tsx src/components/SetupScreen.tsx
git add src/components/AutomaActionDisplay.tsx
git add src/data/automaDeck.ts src/services/gameLogic.ts
git add src/hooks/useGameState.ts src/hooks/useLocalStorage.ts
git commit -m "feat(verification): Integrate verification into certificate, history, scoring and app routing" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (스킵 또는 이미 커밋됨)" -ForegroundColor Gray }

# 6. i18n: 번역
Write-Host "`n[6/8] i18n: Add verification screen translations" -ForegroundColor Yellow
git add src/locales/en.json src/locales/ko.json
git commit -m "i18n: Add verification screen translations (ko, en)" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (스킵 또는 이미 커밋됨)" -ForegroundColor Gray }

# 7. style: 스타일
Write-Host "`n[7/8] style: Add verification screen styles" -ForegroundColor Yellow
git add src/index.css
git commit -m "style: Add verification screen UI styles" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (스킵 또는 이미 커밋됨)" -ForegroundColor Gray }

# 8. docs: 커밋 가이드
Write-Host "`n[8/8] docs: Add commit guide and scripts" -ForegroundColor Yellow
git add COMMIT_GUIDE.md commit-by-feature.ps1 commit-by-feature.cmd
git commit -m "docs: Add conventional commit guide and scripts" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  (스킵 또는 이미 커밋됨)" -ForegroundColor Gray }

# 남은 변경사항 확인
Write-Host "`n=== 남은 변경사항 ===" -ForegroundColor Cyan
git status

Write-Host "`n완료!" -ForegroundColor Green
