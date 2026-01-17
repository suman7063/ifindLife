-- Optimize pg_cron schedule for referral rewards processing
-- Change from every minute to once per day (highly cost-effective)
-- This reduces database queries from 1,440/day to 1/day (99.93% reduction!)

-- First, unschedule the old job if it exists
SELECT cron.unschedule('process-pending-referral-rewards')
WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'process-pending-referral-rewards'
);

-- Schedule optimized job: runs once per day at 2 AM UTC
-- Cron format: minute hour day month weekday
-- '0 2 * * *' = every day at 2:00 AM UTC
-- This time is chosen because:
-- - Low traffic period
-- - Gives enough time for any late-night calls to complete
-- - Processes all rewards that became due in the last 24 hours
SELECT cron.schedule(
    'process-pending-referral-rewards',
    '0 2 * * *', -- Every day at 2:00 AM UTC (once per day)
    $$
    SELECT public.process_pending_referral_rewards();
    $$
);

-- Note: With 48-hour delay, running once per day is perfectly sufficient
-- Rewards will be processed within 24 hours of becoming due
-- This is the most cost-effective approach (99.93% cost reduction)
