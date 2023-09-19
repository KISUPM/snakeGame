import { configureStore } from "@reduxjs/toolkit";
import snakeReducer from "../Feature/Snake/SnakeSlice";

const store = configureStore({
  reducer: {
    snake: snakeReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
