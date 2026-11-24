/**
 * Environment configuration helper
 * Checks if live API is enabled via VITE_USE_LIVE_API.
 * Defaults to false as requested.
 */
export const isLiveApiEnabled = (): boolean => {
  return (import.meta as any).env?.VITE_USE_LIVE_API === 'true';
};
