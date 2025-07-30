-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Unblock the admin account by resetting failed attempts and lock
UPDATE admin_accounts 
SET failed_login_attempts = 0,
    locked_until = NULL,
    updated_at = NOW()
WHERE username = 'admin';

-- Verify the admin account status
SELECT username, email, role, is_active, failed_login_attempts, locked_until 
FROM admin_accounts 
WHERE username = 'admin';