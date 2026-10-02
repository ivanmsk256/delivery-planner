import type { Delivery } from "../types";
import DndIcon from "./DndIcon";

type Props = { delivery: Delivery };

export default function DeliveryCardShort({ delivery }: Props) {
    const fullName = `${delivery.lastName} ${delivery.firstName} ${delivery.middleName}`;

    return (
        <div>
            <article onClick={() => console.log(`открыта карточка ${delivery.lastName}`)}>
                <h2>{fullName}</h2>
                <p>
                    {delivery.slotFrom}–{delivery.slotTo}
                </p>
                {delivery.urgency && <strong>Срочная</strong>}
                <p>{delivery.status === "completed" ? "Завершена" : "Активна"}</p>
                <p>
                    {delivery.address}, м. {delivery.metro}
                </p>
            </article>

            <DndIcon />
        </div>
    );
}
