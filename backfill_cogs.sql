-- ============================================================================
-- COGS BACKFILL SCRIPT
-- ============================================================================
-- This script creates missing COGS journal entries for sold orders that
-- were missing them due to the bug where purchasePrice was read instead of
-- purchaseCost (which was always null/0).
--
-- The script:
-- 1. Identifies orders with a sale journal entry but no COGS entry
-- 2. Creates the missing COGS journal entries with the correct amounts
-- 3. Uses the same account codes and structure as the fixed orders.service.ts
-- ============================================================================

-- First, let's see what we're working with (dry run)
SELECT 
    o.id as order_id,
    o."orderNumber",
    o."createdAt" as order_date,
    b."chassisNumber",
    b."purchaseCost",
    b."purchasePrice",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM "JournalEntry" je 
            WHERE je."sourceRef" = o."orderNumber" 
            AND je."entryNo" LIKE 'JV-COGS-%'
        ) THEN 'HAS COGS'
        ELSE 'MISSING COGS'
    END as cogs_status
FROM "Order" o
JOIN "BikeUnit" b ON o."bikeId" = b.id
WHERE o.status IN ('CONFIRMED', 'DELIVERED', 'READY_FOR_DELIVERY')
  AND EXISTS (
    SELECT 1 FROM "JournalEntry" je 
    WHERE je."sourceRef" = o."orderNumber" 
    AND je."entryNo" LIKE 'JV-SALE-%'
  )
ORDER BY o."createdAt" DESC;

-- ============================================================================
-- BACKFILL QUERY - Creates the missing COGS journal entries
-- ============================================================================

-- Get the account IDs for COGS (5001) and Inventory (1003)
-- These should exist in your chart of accounts
WITH account_ids AS (
  SELECT 
    (SELECT id FROM "Account" WHERE code = '5001' LIMIT 1) as cogs_account_id,
    (SELECT id FROM "Account" WHERE code = '1003' LIMIT 1) as inventory_account_id
),
-- Find orders missing COGS entries
missing_cogs_orders AS (
  SELECT 
    o.id as order_id,
    o."orderNumber",
    o."createdAt",
    b."purchaseCost",
    ai.cogs_account_id,
    ai.inventory_account_id
  FROM "Order" o
  JOIN "BikeUnit" b ON o."bikeId" = b.id
  CROSS JOIN account_ids ai
  WHERE o.status IN ('CONFIRMED', 'DELIVERED', 'READY_FOR_DELIVERY')
    AND b."purchaseCost" IS NOT NULL 
    AND b."purchaseCost" > 0
    AND EXISTS (
      SELECT 1 FROM "JournalEntry" je 
      WHERE je."sourceRef" = o."orderNumber" 
      AND je."entryNo" LIKE 'JV-SALE-%'
    )
    AND NOT EXISTS (
      SELECT 1 FROM "JournalEntry" je 
      WHERE je."sourceRef" = o."orderNumber" 
      AND je."entryNo" LIKE 'JV-COGS-%'
    )
    AND ai.cogs_account_id IS NOT NULL
    AND ai.inventory_account_id IS NOT NULL
)
-- Insert the missing COGS journal entries
INSERT INTO "JournalEntry" (
  id,
  "entryNo",
  date,
  description,
  "sourceRef",
  notes,
  status,
  "isManual",
  "createdAt"
)
SELECT 
  gen_random_uuid() as id,
  'JV-COGS-' || mco."orderNumber" as "entryNo",
  mco."createdAt" as date,
  'Cost of Goods Sold for ' || mco."orderNumber" as description,
  mco."orderNumber" as "sourceRef",
  'Backfilled COGS entry - missing due to purchasePrice/purchaseCost bug' as notes,
  'POSTED' as status,
  true as "isManual",
  NOW() as "createdAt"
FROM missing_cogs_orders mco
RETURNING id, "entryNo", "sourceRef";

-- ============================================================================
-- INSERT JOURNAL ENTRY LINES FOR THE CREATED ENTRIES
-- ============================================================================

-- Insert the journal entry lines (debit COGS, credit Inventory)
WITH account_ids AS (
  SELECT 
    (SELECT id FROM "Account" WHERE code = '5001' LIMIT 1) as cogs_account_id,
    (SELECT id FROM "Account" WHERE code = '1003' LIMIT 1) as inventory_account_id
),
missing_cogs_orders AS (
  SELECT 
    o.id as order_id,
    o."orderNumber",
    o."createdAt",
    b."purchaseCost",
    ai.cogs_account_id,
    ai.inventory_account_id
  FROM "Order" o
  JOIN "BikeUnit" b ON o."bikeId" = b.id
  CROSS JOIN account_ids ai
  WHERE o.status IN ('CONFIRMED', 'DELIVERED', 'READY_FOR_DELIVERY')
    AND b."purchaseCost" IS NOT NULL 
    AND b."purchaseCost" > 0
    AND EXISTS (
      SELECT 1 FROM "JournalEntry" je 
      WHERE je."sourceRef" = o."orderNumber" 
      AND je."entryNo" LIKE 'JV-SALE-%'
    )
    AND NOT EXISTS (
      SELECT 1 FROM "JournalEntry" je 
      WHERE je."sourceRef" = o."orderNumber" 
      AND je."entryNo" LIKE 'JV-COGS-%'
    )
    AND ai.cogs_account_id IS NOT NULL
    AND ai.inventory_account_id IS NOT NULL
),
new_journal_entries AS (
  SELECT 
    je.id as journal_entry_id,
    mco."purchaseCost",
    mco.cogs_account_id,
    mco.inventory_account_id
  FROM "JournalEntry" je
  JOIN missing_cogs_orders mco ON je."sourceRef" = mco."orderNumber"
  WHERE je."entryNo" LIKE 'JV-COGS-%'
    AND je.notes = 'Backfilled COGS entry - missing due to purchasePrice/purchaseCost bug'
)
-- Insert debit line (COGS account)
INSERT INTO "JournalEntryLine" (id, "journalEntryId", "accountId", debit, credit)
SELECT 
  gen_random_uuid(),
  nje.journal_entry_id,
  nje.cogs_account_id,
  nje."purchaseCost",
  0
FROM new_journal_entries nje
UNION ALL
-- Insert credit line (Inventory account)
SELECT 
  gen_random_uuid(),
  nje.journal_entry_id,
  nje.inventory_account_id,
  0,
  nje."purchaseCost"
FROM new_journal_entries nje;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Check the results
SELECT 
    o."orderNumber",
    o."createdAt" as order_date,
    b."chassisNumber",
    b."purchaseCost",
    je.id as journal_id,
    je."entryNo",
    je.description,
    je."createdAt" as journal_created_at,
    SUM(jel.debit) as total_debit,
    SUM(jel.credit) as total_credit
FROM "Order" o
JOIN "BikeUnit" b ON o."bikeId" = b.id
LEFT JOIN "JournalEntry" je ON je."sourceRef" = o."orderNumber" AND je."entryNo" LIKE 'JV-COGS-%'
LEFT JOIN "JournalEntryLine" jel ON jel."journalEntryId" = je.id
WHERE o.status IN ('CONFIRMED', 'DELIVERED', 'READY_FOR_DELIVERY')
  AND b."purchaseCost" IS NOT NULL 
  AND b."purchaseCost" > 0
  AND EXISTS (
    SELECT 1 FROM "JournalEntry" je2 
    WHERE je2."sourceRef" = o."orderNumber" 
    AND je2."entryNo" LIKE 'JV-SALE-%'
  )
GROUP BY o."orderNumber", o."createdAt", b."chassisNumber", b."purchaseCost", je.id, je."entryNo", je.description, je."createdAt"
ORDER BY o."createdAt" DESC;

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- Count how many orders were backfilled
SELECT 
    COUNT(DISTINCT o."orderNumber") as total_orders_backfilled,
    SUM(b."purchaseCost") as total_cogs_amount_backfilled
FROM "Order" o
JOIN "BikeUnit" b ON o."bikeId" = b.id
JOIN "JournalEntry" je ON je."sourceRef" = o."orderNumber" AND je."entryNo" LIKE 'JV-COGS-%'
WHERE je.notes = 'Backfilled COGS entry - missing due to purchasePrice/purchaseCost bug'
  AND o.status IN ('CONFIRMED', 'DELIVERED', 'READY_FOR_DELIVERY');
