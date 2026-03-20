import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theater: null,
  loading: true,
};

const theaterSlice = createSlice({
  name: "theater",
  initialState,
  reducers: {
    // Set theater object after create/join/fetch
    setTheater: (state, action) => {
      state.theater = action.payload;
      state.loading = false;
    },
    // Clear theater (leave room)
    clearTheater: (state) => {
      state.theater = null;
      state.loading = false;
    },
    // Set loading flag manually
    setLoading: (state) => {
      state.loading = true;
    },
    // Optional: update audience list dynamically
    setAudience: (state, action) => {
      if (state.theater) {
        state.theater.users = action.payload;
      }
    },
    // Optional: update owner dynamically
    setOwner: (state, action) => {
      if (state.theater) {
        state.theater.owner = action.payload;
      }
    },
  },
});

export const { setTheater, clearTheater, setLoading, setAudience, setOwner } = theaterSlice.actions;
export default theaterSlice.reducer;