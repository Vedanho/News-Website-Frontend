import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  signingUp: false,
  signingIn: false,
  error: null,
  token: localStorage.getItem("token")
};

export const getUsers = createAsyncThunk("get/users", async (thunkAPI) => {
  try {
    const res = await fetch("http://localhost:4500/user");
    const users = await res.json();

    return users;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const regist = createAsyncThunk(
  "regist/users",
  async ({ login, password }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:4500/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login,
          password,
        }),
      });
      const data = await res.json();

      if (data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      return thunkAPI.fulfillWithValue(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const auth = createAsyncThunk(
  "auth/user",
  async ({ login, password }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:4500/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        return thunkAPI.rejectWithValue(data.error)
      }

      localStorage.setItem("token", data.token)

      return data.token
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    })
    .addCase(auth.fulfilled, (state, action) => {
      state.token = action.payload.token
    })
  },
});

export default userSlice.reducer;
