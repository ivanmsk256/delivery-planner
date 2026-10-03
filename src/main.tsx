import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import "./index.css";
import App from "./App.tsx";

// Фейковый сервер — только при разработке
const enableMocking = async () => {
    if (!import.meta.env.DEV) return;

    const { worker } = await import("./mocks/browser.ts");

    await worker.start();
};

enableMocking().then(() => {
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </StrictMode>,
    );
});
