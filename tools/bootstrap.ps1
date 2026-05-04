# =============================================================================
# CSPS Bootstrap Script
# Per pillar-6/bootstrap-script.md.
# =============================================================================
#
# Turns an empty repo into a running CSPS instance in one command.
# Idempotent: re-runnable; reports SKIP vs APPLY per step.
#
# Usage:
#   .\tools\bootstrap.ps1                       # platform mode (default)
#   .\tools\bootstrap.ps1 -Mode graduate        # graduation pipeline (vendored variant)
#   .\tools\bootstrap.ps1 -DryRun               # print planned operations; mutate nothing
#   .\tools\bootstrap.ps1 -Force                # skip idempotency guards (dangerous)
#
# Skeleton tier (S005): scaffolds the script structure + prereq verification +
# step list. Week-2 fills in actual psql migration runner + ZenStack codegen +
# Prisma generate + audit-runner ZF-0 verification.

[CmdletBinding()]
param(
    [ValidateSet("platform", "graduate")]
    [string]$Mode = "platform",
    [string]$EnvFile = ".env.local",
    [switch]$DryRun,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$script:Steps = @()
$script:StartTime = Get-Date

function Write-Step {
    param([int]$N, [string]$Desc, [string]$Status)
    $color = switch ($Status) {
        "APPLY"  { "Green" }
        "SKIP"   { "DarkGray" }
        "FAIL"   { "Red" }
        "DRY"    { "Cyan" }
        default  { "White" }
    }
    Write-Host ("[{0:00}] {1,-6} {2}" -f $N, $Status, $Desc) -ForegroundColor $color
    $script:Steps += [PSCustomObject]@{
        Step = $N; Status = $Status; Description = $Desc
    }
}

function Test-Prereq {
    param([string]$Name, [scriptblock]$Check)
    try {
        $result = & $Check
        if ($result) { return $true }
        return $false
    } catch {
        return $false
    }
}

# =============================================================================
# 1. Verify prerequisites
# =============================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Yellow
Write-Host " CSPS Bootstrap — Mode: $Mode  DryRun: $DryRun  Force: $Force"   -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Yellow

$prereqs = @(
    @{ Name = "Node >= 20"; Check = { (node --version) -match "v(2[0-9]|[3-9][0-9])" } }
    @{ Name = "pnpm >= 9";  Check = { (pnpm --version) -match "^(9|[1-9][0-9])\." } }
    @{ Name = "git";        Check = { git --version 2>$null } }
    @{ Name = "$EnvFile";   Check = { Test-Path $EnvFile } }
)

$prereqFailed = $false
foreach ($p in $prereqs) {
    if (Test-Prereq -Name $p.Name -Check $p.Check) {
        Write-Step -N $prereqs.IndexOf($p) -Desc "prereq: $($p.Name)" -Status "APPLY"
    } else {
        Write-Step -N $prereqs.IndexOf($p) -Desc "prereq: $($p.Name) MISSING" -Status "FAIL"
        $prereqFailed = $true
    }
}

if ($prereqFailed -and -not $Force) {
    Write-Host ""
    Write-Host "✗ Prerequisites missing. Resolve above OR re-run with -Force." -ForegroundColor Red
    exit 1
}

# =============================================================================
# 2-9. Step list (skeleton — week-2 fills in actual operations)
# =============================================================================

$steps = @(
    @{ N = 2; Desc = "pnpm install";                                    Cmd = { pnpm install } }
    @{ N = 3; Desc = "Apply base ZModel migrations (Supabase psql)";    Cmd = { Write-Host "  TODO week-2: psql `$env:DATABASE_URL -f libs/policies/migrations/001_base.sql" -ForegroundColor DarkGray } }
    @{ N = 4; Desc = "Apply audit-trigger DDL (libs/policies/audit-triggers.sql)"; Cmd = { Write-Host "  TODO week-2: psql `$env:DATABASE_URL -f libs/policies/audit-triggers.sql" -ForegroundColor DarkGray } }
    @{ N = 5; Desc = "pnpm principles:codegen (emits manifest.json + downstream artifacts)"; Cmd = { pnpm principles:codegen } }
    @{ N = 6; Desc = "Initialize packages/catalog/catalog.json";        Cmd = { Write-Host "  TODO week-3: pnpm --filter @csps/catalog scan" -ForegroundColor DarkGray } }
    @{ N = 7; Desc = "pnpm glossary:codegen";                            Cmd = { Write-Host "  TODO week-2: pnpm --filter @csps/glossary codegen" -ForegroundColor DarkGray } }
    @{ N = 8; Desc = "Initialize packages/principles-mcp (verify boots)"; Cmd = { Write-Host "  TODO week-2: pnpm --filter @csps/principles-mcp build" -ForegroundColor DarkGray } }
    @{ N = 9; Desc = "Audit-runner full pass (ZF-0 required to proceed)"; Cmd = { Write-Host "  TODO week-4: pnpm audit:run --strict" -ForegroundColor DarkGray } }
)

foreach ($s in $steps) {
    if ($DryRun) {
        Write-Step -N $s.N -Desc $s.Desc -Status "DRY"
        continue
    }
    try {
        & $s.Cmd
        Write-Step -N $s.N -Desc $s.Desc -Status "APPLY"
    } catch {
        Write-Step -N $s.N -Desc "$($s.Desc) FAILED: $_" -Status "FAIL"
        if (-not $Force) { exit 1 }
    }
}

# =============================================================================
# 10. Emit readiness report
# =============================================================================

$report = "tools/bootstrap-readiness.md"
$elapsed = (Get-Date) - $script:StartTime
$applyCount = ($script:Steps | Where-Object { $_.Status -eq "APPLY" }).Count
$skipCount  = ($script:Steps | Where-Object { $_.Status -eq "SKIP" }).Count
$failCount  = ($script:Steps | Where-Object { $_.Status -eq "FAIL" }).Count

$content = @"
# Bootstrap Readiness Report

- **Run at:** $((Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ"))
- **Mode:** $Mode
- **DryRun:** $DryRun
- **Elapsed:** $($elapsed.TotalSeconds)s
- **Steps:** $($script:Steps.Count) total — $applyCount APPLY, $skipCount SKIP, $failCount FAIL

## Step results

| # | Status | Description |
|---|---|---|
$($script:Steps | ForEach-Object { "| $($_.Step) | $($_.Status) | $($_.Description) |" } | Out-String)

## Next

Per build-order.md week 1 close, run \`pnpm audit:run --strict\` and verify ZF-0 before any slice work begins.
"@

Set-Content -Path $report -Value $content -Encoding utf8

Write-Host ""
Write-Host "================================================================" -ForegroundColor Yellow
Write-Host " ✓ Bootstrap complete. Report: $report"                          -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Yellow
