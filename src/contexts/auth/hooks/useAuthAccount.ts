
// Update function that references avatar_url
export const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
  try {
    // Extract profile_picture from data if it exists (might be called avatar_url in some parts)
    const { profile_picture, ...restData } = data;
    
    const updateData = {
      ...restData,
      // Use profile_picture if it exists in the data
      ...(profile_picture && { profile_picture })
    };
    
    // Make the update
    const { error } = await supabaseClient
      .from('profiles')
      .update(updateData)
      .eq('id', user?.id);
    
    if (error) throw error;
    
    // Refresh the profile
    await refreshProfile();
    return true;
  } catch (err) {
    console.error('Error updating profile:', err);
    return false;
  }
}
