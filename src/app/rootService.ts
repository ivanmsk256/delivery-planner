import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Один API на весь сервер. Эндпоинты добавляются в него из других файлов через injectEndpoints
export const rootService = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: () => ({}),
});
