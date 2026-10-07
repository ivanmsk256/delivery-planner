import type { Delivery } from "../types";
import PrintDocumentsButton from "./PrintDocumentsButton";
import DeliveryButtonCall from "./DeliveryButtonCall";
import DeliveryButtonNote from "./DeliveryButtonNote";
import DeliveryButtonSms from "./DeliveryButtonSms";
import DndIcon from "./DndIcon";
import styles from "./DeliveryCardShort.module.css";
import DeliveryTags from "./DeliveryTags";

type Props = { delivery: Delivery };

export default function DeliveryCardShort({ delivery }: Props) {
    const fullName = `${delivery.lastName} ${delivery.firstName} ${delivery.middleName}`;

    return (
        <div>
            <article
                className={styles.card}
                onClick={() => console.log(`открыта карточка ${delivery.lastName}`)}
            >
                <header className={styles.header}>
                    <DeliveryTags urgency={delivery.urgency} />
                    <DndIcon />
                </header>

                <h2 className={styles.name}>
                    {fullName}
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                        <ellipse cx="5" cy="4.4" rx="5" ry="4.4" fill="currentColor" />
                        <path d="M3.9 8.2 4.3 9.9 6.3 8.3z" fill="currentColor" />
                        <path
                            d="M3 3.4h4.3M3 5.6h2.7"
                            stroke="#fff"
                            strokeWidth="1.1"
                            strokeLinecap="round"
                        />
                    </svg>
                </h2>

                <div>
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                        <circle cx="10" cy="10" r="10" fill="currentColor" />
                        <path d="M10 5v6l2.8 2.8" fill="none" stroke="#fff" strokeWidth="2" />
                    </svg>

                    <span className={styles.cardTime}>
                        {delivery.slotFrom}–{delivery.slotTo}
                    </span>
                </div>

                <div>
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                            d="M17.55 2.73 2.65 9.3 9 11.3l1.67 6.07z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                        />
                    </svg>{" "}
                    {delivery.address}
                    {/* поменять на 'a' адрес — ссылка  */}
                    <span className={styles.cardMetro}>{delivery.metro}</span>
                </div>

                <div>
                    <DeliveryButtonCall />
                    <DeliveryButtonSms />
                    <DeliveryButtonNote />
                    {delivery.documentId && (
                        <PrintDocumentsButton documentId={delivery.documentId} />
                    )}
                    {/* Подумать куда положить кнопку Печати */}
                </div>
            </article>
        </div>
    );
}

// Долги
// 1 - Реализация тегов как в проекте
// 2 - У карточки не всгда есть, это может быть и номер телефона 7(9..)...24-22 - номер не показываем полностью
// 3 - Сделать кнопку 'Позвонить' - пока без механики
// 4 - Сделать кнопку 'SMS' - пока без механики
// 5 - Сделать кнопку 'Заметки' - пока без механики
