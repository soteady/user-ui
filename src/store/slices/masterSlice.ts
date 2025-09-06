import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MasterState {
  loading: boolean;
  theme: 'light' | 'dark';
  language: string;
  sidebarCollapsed: boolean;
  globalConfig: {
    systemName: string;
    version: string;
    [key: string]: any;
  };
}

const initialState: MasterState = {
  loading: false,
  theme: 'light',
  language: 'vi',
  sidebarCollapsed: false,
  globalConfig: {
    systemName: 'STEADY',
    version: '1.0.0',
  },
};

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    updateGlobalConfig: (state, action: PayloadAction<Partial<MasterState['globalConfig']>>) => {
      state.globalConfig = { ...state.globalConfig, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarCollapsed,
  updateGlobalConfig,
} = masterSlice.actions;

export default masterSlice.reducer;