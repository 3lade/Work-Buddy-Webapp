import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  userId: localStorage.getItem('userId') || null,
  userName: localStorage.getItem('userName') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action) => {
      const { token, role, id, userName } = action.payload;

      state.token = token;
      state.role = role;
      state.userId = id;
      state.userName = userName;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', userName);
    },

    clearUser: (state) => {
      state.token = null;
      state.role = null;
      state.userId = null;
      state.userName = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    },

    updateUserInfo: (state, action) => {
      const { userName } = action.payload;

      if (userName !== undefined) {
        state.userName = userName;
        localStorage.setItem('userName', userName);
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setUser,
  clearUser,
  updateUserInfo,
} = userSlice.actions;

export default userSlice.reducer;