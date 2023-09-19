import { createSlice } from "@reduxjs/toolkit";

export const snakeSlice = createSlice({
  name: "snake",
  initialState: {
    value: {
      head: { c: 0, r: 0 },
      direction: "",
      bodyLength: 0,
      body: [{ c: 0, r: 0 }],
      fruit: { c: 0, r: 0 },
    },
  },
  reducers: {
    setHead: (state, action) => {
      const { c, r } = action.payload;
      const old = state.value.head;
      state.value.body.push(old);
      while (state.value.body.length > state.value.bodyLength + 1) {
        state.value.body.shift();
      }
      state.value.head.c = c;
      state.value.head.r = r;
    },
    setDirection: (state, action) => {
      const { direct } = action.payload;
      //   console.log(action.payload);
      state.value.direction = direct;
    },
    increaseBody: (state) => {
      state.value.bodyLength += 1;
    },
    newFruitPos: (state, action) => {
      const { c, r } = action.payload;
      state.value.fruit.c = c;
      state.value.fruit.r = r;
    },
    reset: (state) => {
      state.value.direction = "";
      state.value.bodyLength = 0;
      state.value.body = [{ c: 0, r: 0 }];
    },
  },
});

const snakeReducer = snakeSlice.reducer;
export const snakeAction = { ...snakeSlice.actions };
export default snakeReducer;
