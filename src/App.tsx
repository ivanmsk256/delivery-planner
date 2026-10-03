import DeliveryList from "./components/DeliveryList";
import "./App.css";
import usePrepareDocuments from "./hooks/usePrepareDocuments";

export default function App() {
    usePrepareDocuments();
    return (
        <main>
            <h1>Доставки на сегодня</h1>
            <DeliveryList />
        </main>
    );
}
