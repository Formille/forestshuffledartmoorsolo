@echo off
REM Forest Shuffle - Conventional Commit (CMD용)
REM Cursor 외부에서 실행: commit-by-feature.cmd

cd /d "%~dp0"
echo === Forest Shuffle - Conventional Commit ===

echo.
echo [1/8] chore(deps): Add pako, jsqr, qrcode for QR verification
git add package.json package-lock.json
git commit -m "chore(deps): Add pako, jsqr, qrcode for QR verification"
if errorlevel 1 echo   (스킵 또는 이미 커밋됨)

echo.
echo [2/8] feat(types): Add VerificationData, VerificationRecord types
git add src/types/index.ts
git commit -m "feat(types): Add VerificationData, VerificationRecord and extend GameHistory"
if errorlevel 1 echo   (스킵 또는 이미 커밋됨)

echo.
echo [3/8] feat(verification): Add verification service
git add src/services/verification.ts
git commit -m "feat(verification): Add verification service with compress/decompress and QR encode"
if errorlevel 1 echo   (스킵 또는 이미 커밋됨)

echo.
echo [4/8] feat(verification): Add VerifyScreen with QR scan
git add src/components/VerifyScreen.tsx
git commit -m "feat(verification): Add VerifyScreen with camera and image QR scan"
if errorlevel 1 echo   (스킵 또는 이미 커밋됨)

echo.
echo [5/8] feat(verification): Integrate verification into certificate and app
git add src/services/certificate.ts src/services/history.ts src/services/scoring.ts
git add src/App.tsx src/store/gameStore.ts
git add src/components/HistoryScreen.tsx src/components/PlayScreen.tsx
git add src/components/ScoreInputForm.tsx src/components/ScoringScreen.tsx src/components/SetupScreen.tsx
git add src/components/AutomaActionDisplay.tsx
git add src/data/automaDeck.ts src/services/gameLogic.ts
git add src/hooks/useGameState.ts src/hooks/useLocalStorage.ts
git commit -m "feat(verification): Integrate verification into certificate, history, scoring and app routing"
if errorlevel 1 echo   (스킵 또는 이미 커밋됨)

echo.
echo [6/8] i18n: Add verification screen translations
git add src/locales/en.json src/locales/ko.json
git commit -m "i18n: Add verification screen translations (ko, en)"
if errorlevel 1 echo   (스킵 또는 이미 커밋됨)

echo.
echo [7/8] style: Add verification screen styles
git add src/index.css
git commit -m "style: Add verification screen UI styles"
if errorlevel 1 echo   (스킵 또는 이미 커밋됨)

echo.
echo [8/8] docs: Add commit guide and scripts
git add COMMIT_GUIDE.md commit-by-feature.ps1 commit-by-feature.cmd
git commit -m "docs: Add conventional commit guide and scripts"
if errorlevel 1 echo   (스킵 또는 이미 커밋됨)

echo.
echo === 남은 변경사항 ===
git status
echo.
echo 완료!
pause
