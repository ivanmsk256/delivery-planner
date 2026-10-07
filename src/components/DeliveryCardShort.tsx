import type { Delivery } from "../types";
import PrintDocumentsButton from "./PrintDocumentsButton";
import DndIcon from "./DndIcon";
import styles from "./DeliveryCardShort.module.css";

type Props = { delivery: Delivery };

export default function DeliveryCardShort({ delivery }: Props) {
    const fullName = `${delivery.lastName} ${delivery.firstName} ${delivery.middleName}`;

    return (
        <div>
            <article
                className={styles.card}
                onClick={() => console.log(`открыта карточка ${delivery.lastName}`)}
            >
                <h2>{fullName}</h2>
                <p>
                    {delivery.slotFrom}–{delivery.slotTo}
                </p>
                {delivery.urgency && <strong>Срочная</strong>}
                <p>{delivery.status === "completed" ? "Завершена" : "Активна"}</p>
                <p>
                    {delivery.address}, м. {delivery.metro}
                </p>

                {delivery.documentId && <PrintDocumentsButton documentId={delivery.documentId} />}
            </article>

            <DndIcon />
        </div>
    );
}
