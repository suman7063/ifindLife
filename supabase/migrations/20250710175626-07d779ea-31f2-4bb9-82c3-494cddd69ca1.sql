-- Update admin account with bcrypt hashed password
-- Password: AdminPass2024!
UPDATE admin_accounts 
SET 
    password_hash = crypt('AdminPass2024!', gen_salt('bf')),
    failed_login_attempts = 0,
    locked_until = NULL,
    is_active = true,
    updated_at = NOW()
WHERE username = 'admin';