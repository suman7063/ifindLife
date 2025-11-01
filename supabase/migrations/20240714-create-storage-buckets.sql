
-- Create storage bucket for user profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-profiles', 'user-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Set up policy for user-profiles bucket
CREATE POLICY "Everyone can see profile pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-profiles');

CREATE POLICY "Authenticated users can upload profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-profiles');

CREATE POLICY "Users can update their own profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-profiles' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-profiles' AND (storage.foldername(name))[1] = auth.uid()::text);
