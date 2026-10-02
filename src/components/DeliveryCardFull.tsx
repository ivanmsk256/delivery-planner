import { useState } from "react";
import type { Delivery } from "../types";

type Props = { delivery: Delivery };

export default function DeliveryCardFull({ delivery }: Props) {
    const fullName = `${delivery.lastName} ${delivery.firstName} ${delivery.middleName}`;

    const [openNotes, setOpenNotes] = useState(false);
    const [notes, setNotes] = useState("");

    return (
        <article>
            <h2>{fullName}</h2>
            <p>
                {delivery.slotFrom}–{delivery.slotTo}
            </p>
            <p>{delivery.address}</p>
            <p>м. {delivery.metro}</p>

            <button type="button">Позвонить</button>
            <button type="button">SMS</button>
            <button type="button">!911</button>
            <button type="button" onClick={() => setOpenNotes(!openNotes)}>
                Заметка
            </button>

            {openNotes && (
                <textarea
                    aria-label="Заметка"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            )}

            <h3>Вызовы</h3>
            {/* TODO: мини-карточка истории вызовов */}
        </article>
    );
}

// SMS, Позвонить - пока что мок
