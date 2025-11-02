-- Enable real-time replication for notifications table
-- This allows Supabase real-time subscriptions to work

-- Add notifications table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Also ensure incoming_call_requests is in the publication (if not already)
ALTER PUBLICATION supabase_realtime ADD TABLE incoming_call_requests;

-- Verify the tables are in the publication
-- You can check this in Supabase dashboard under Database > Replication

