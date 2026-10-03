import { configureStore } from "@reduxjs/toolkit";
import { rootService } from "./rootService";

export const store = configureStore({
    reducer: {
        [rootService.reducerPath]: rootService.reducer,
    },

    middleware: (getDefault) => getDefault().concat(rootService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
