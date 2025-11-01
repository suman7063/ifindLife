-- Make expert data publicly readable for better user experience
-- Users can see all expert information until they try to book (which requires auth)

-- Allow public read access to expert accounts (approved experts only via existing function)
-- This table already has proper policies, no changes needed

-- Allow public read access to expert availabilities for booking
DROP POLICY IF EXISTS "Public can view expert availabilities" ON expert_availabilities;
CREATE POLICY "Public can view expert availabilities" 
ON expert_availabilities 
FOR SELECT 
USING (true);

-- Allow public read access to expert time slots for booking  
DROP POLICY IF EXISTS "Users can view time slots for booking" ON expert_time_slots;
CREATE POLICY "Public can view time slots for booking" 
ON expert_time_slots 
FOR SELECT 
USING (true);

-- Allow public read access to expert presence (online status)
DROP POLICY IF EXISTS "Anyone can view expert presence status" ON expert_presence;
CREATE POLICY "Public can view expert presence status" 
ON expert_presence 
FOR SELECT 
USING (true);

-- Allow public read access to expert pricing for booking
DROP POLICY IF EXISTS "Public can view expert pricing" ON expert_pricing_tiers;
CREATE POLICY "Public can view expert pricing tiers" 
ON expert_pricing_tiers 
FOR SELECT 
USING (true);