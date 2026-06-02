import { supabase } from '../lib/supabase';

export const profilesService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async uploadAvatar(userId, file) {
    // Max 2 MB check
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size must be less than 2 MB');
    }

    const ext = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${ext}`;

    // Remove existing avatar if present
    await supabase.storage
      .from('avatars')
      .remove([`${userId}/avatar.jpg`, `${userId}/avatar.jpeg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Bust cache with a timestamp
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    // Save URL to profiles table
    await profilesService.updateProfile(userId, { avatar_url: publicUrl });

    return publicUrl;
  },

  async isUsernameAvailable(username, currentUserId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', currentUserId)
      .maybeSingle();
    if (error) throw error;
    return !data; // true = available
  },
};
