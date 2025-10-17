param(
  [string]$project = "default"
)

Write-Host "Running local build..."
npm run build

Write-Host "Deploying to Firebase Hosting (project: $project)"
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
  Write-Host "firebase CLI not found. Install it with: npm install -g firebase-tools" -ForegroundColor Yellow
  exit 1
}

firebase deploy --only hosting
