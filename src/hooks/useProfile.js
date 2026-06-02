import { useState, useCallback } from 'react';
import { profilesService } from '../services/profiles';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      return await profilesService.getProfile(userId);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (userId, updates) => {
    setLoading(true);
    setError(null);
    try {
      return await profilesService.updateProfile(userId, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (userId, file) => {
    setUploading(true);
    setError(null);
    try {
      return await profilesService.uploadAvatar(userId, file);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const checkUsername = useCallback(async (username, currentUserId) => {
    try {
      return await profilesService.isUsernameAvailable(username, currentUserId);
    } catch {
      return false;
    }
  }, []);

  return { loading, uploading, error, fetchProfile, saveProfile, uploadAvatar, checkUsername };
};
