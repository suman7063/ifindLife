-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule automatic processing of pending referral rewards
-- This will run every minute to check for rewards that are due
-- Note: pg_cron jobs run in UTC time
SELECT cron.schedule(
    'process-pending-referral-rewards',
    '* * * * *', -- Every minute
    $$
    SELECT public.process_pending_referral_rewards();
    $$
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA cron TO postgres;

-- Note: To view scheduled jobs, run:
-- SELECT * FROM cron.job;
-- 
-- To unschedule this job, run:
-- SELECT cron.unschedule('process-pending-referral-rewards');
--
-- To manually trigger processing, run:
-- SELECT public.process_pending_referral_rewards();
