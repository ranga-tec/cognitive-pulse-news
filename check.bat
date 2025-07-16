@echo off
echo 🔍 Checking directory structure...
echo.

cd /d "D:\VScode Projects\congnetivenews\cognitive-pulse-news"

echo ✅ ROOT FILES:
if exist .env.local (echo ✅ .env.local) else (echo ❌ .env.local MISSING)
if exist package.json (echo ✅ package.json) else (echo ❌ package.json MISSING)
if exist src\App.tsx (echo ✅ src\App.tsx) else (echo ❌ src\App.tsx MISSING)
if exist src\main.tsx (echo ✅ src\main.tsx) else (echo ❌ src\main.tsx MISSING)
if exist src\index.css (echo ✅ src\index.css) else (echo ❌ src\index.css MISSING)

echo.
echo ✅ EXISTING PAGES:
if exist src\pages\Index.tsx (echo ✅ src\pages\Index.tsx) else (echo ❌ src\pages\Index.tsx MISSING)
if exist src\pages\News.tsx (echo ✅ src\pages\News.tsx) else (echo ❌ src\pages\News.tsx MISSING)
if exist src\pages\Threads.tsx (echo ✅ src\pages\Threads.tsx) else (echo ❌ src\pages\Threads.tsx MISSING)

echo.
echo ✅ NEW FILES NEEDED:
if exist src\lib\supabase.ts (echo ✅ src\lib\supabase.ts) else (echo ❌ src\lib\supabase.ts MISSING)
if exist src\contexts\AuthContext.tsx (echo ✅ src\contexts\AuthContext.tsx) else (echo ❌ src\contexts\AuthContext.tsx MISSING)
if exist src\components\ProtectedRoute.tsx (echo ✅ src\components\ProtectedRoute.tsx) else (echo ❌ src\components\ProtectedRoute.tsx MISSING)

echo.
echo ✅ ADMIN FILES:
if exist src\pages\admin\Login.tsx (echo ✅ src\pages\admin\Login.tsx) else (echo ❌ src\pages\admin\Login.tsx MISSING)
if exist src\components\admin\AdminLayout.tsx (echo ✅ src\components\admin\AdminLayout.tsx) else (echo ❌ src\components\admin\AdminLayout.tsx MISSING)

echo.
echo 📋 DIRECTORY TREE:
tree /F src

echo.
pause