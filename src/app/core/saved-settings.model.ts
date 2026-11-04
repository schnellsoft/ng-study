export type ThemePreference = 'light' | 'dark' | 'system';

export interface BoxState {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface SavedSettings {
  theme: ThemePreference;
  box: BoxState;
  updatedAt: string | null;
}

export const DEFAULT_SAVED_SETTINGS: SavedSettings = {
  theme: 'system',
  box: {
    width: 22,
    height: 14,
    left: 8,
    top: 6,
  },
  updatedAt: null,
};
