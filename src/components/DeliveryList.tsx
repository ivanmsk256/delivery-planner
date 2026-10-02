import { useState } from "react";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { meetings } from "../meetings";
import type { Delivery } from "../types";
import DeliveryCardShort from "./DeliveryCardShort";
import { DndSortable } from "./DndSortable";
import DndDragOverlay from "./DndDragOverlay";
import { mergeVisibleOrder, pinUrgentDeliveries, saveDeliveryPosition } from "../utils/order";
import { getStartDeliverys, setLocalUuids } from "../utils/storage";

export default function DeliveryList() {
    // Функцией, а не значением: закрепление срочных посчитается один раз, при первой отрисовке
    const [deliveries, setDeliveries] = useState<Delivery[]>(() => getStartDeliverys(meetings)); // ПОЛНЫЙ список
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null); // UniqueIdentifier = string | number
    const [hideCompleted, setHideCompleted] = useState(false);
    // Пока «сервер» не ответил — перетаскивать нельзя: иначе откат упавшего запроса сотрёт следующее перетаскивание
    const [isSaving, setIsSaving] = useState(false);

    const visibleDeliveries = hideCompleted
        ? deliveries.filter((del) => del.status === "active")
        : deliveries;

    const deliveriesUuids = visibleDeliveries.map(({ uuid }) => uuid); // items = ровно те, что нарисованы
    const draggingDelivery: Delivery | undefined = deliveries.find(({ uuid }) => uuid === activeId);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 8 },
        }),
    );

    const onDragStart = ({ active }: DragStartEvent): void => {
        setActiveId(active.id);
    };

    const onDragCancel = (): void => {
        // Esc во время перетаскивания
        setActiveId(null);
    };

    const onDragEnd = async ({ active, over }: DragEndEvent): Promise<void> => {
        setActiveId(null); // первой строкой — копия пропадает при ЛЮБОМ выходе ниже

        if (!over) return; // отпустили мимо списка

        // Индексы — по ВИДИМОМУ списку: тащили и отпускали именно в нём
        const oldIndex = visibleDeliveries.findIndex((del) => del.uuid === active.id);
        const newIndex = visibleDeliveries.findIndex((del) => del.uuid === over.id);

        if (oldIndex === -1 || newIndex === -1) return; // не нашли карточку
        if (oldIndex === newIndex) return; // отпустили на то же место

        const oldDeliveries = deliveries;
        const movedVisible = arrayMove(visibleDeliveries, oldIndex, newIndex); // новый порядок того, что на экране
        const pinnedVisible = pinUrgentDeliveries(movedVisible); // срочные наверх — ДО слияния, иначе сдвинутся скрытые
        const res = mergeVisibleOrder(deliveries, pinnedVisible);
        setDeliveries(res); // вписали в полный: скрытые на своих местах
        const uuids = res.map((del) => del.uuid);

        setIsSaving(true);
        try {
            await saveDeliveryPosition(uuids);
            setLocalUuids(uuids); // на устройство — только то, что принял сервер
        } catch (e) {
            setDeliveries(oldDeliveries); // откат экрана: сервер порядок не принял
            alert(`При отправке запроса произошла ошибка: ${e}`);
        } finally {
            setIsSaving(false); // и при успехе, и при ошибке
        }
    };

    return (
        <>
            <p>Порядок: {deliveries.map(({ lastName }) => lastName).join(", ")}</p>

            <label>
                <input
                    type="checkbox"
                    checked={hideCompleted}
                    onChange={(e) => setHideCompleted(e.target.checked)}
                />
                Скрыть завершённые
            </label>

            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
            >
                <SortableContext items={deliveriesUuids} strategy={verticalListSortingStrategy}>
                    <ul>
                        {visibleDeliveries.map((delivery) => (
                            <DndSortable key={delivery.uuid} id={delivery.uuid} disabled={isSaving}>
                                <DeliveryCardShort delivery={delivery} />
                            </DndSortable>
                        ))}
                    </ul>
                </SortableContext>

                {/* Оверлей — ВНУТРИ DndContext, иначе он не знает, что тащат */}

                <DndDragOverlay>
                    {draggingDelivery && <DeliveryCardShort delivery={draggingDelivery} />}
                </DndDragOverlay>

                {/* {draggingDelivery && <DeliveryCardShort delivery={draggingDelivery} />} */}
            </DndContext>
        </>
    );
}

// DeliveryList            ← СОСТОЯНИЕ: ПОЛНЫЙ список встреч + activeId + галочка; видимый список — вычисляется
// └─ DndContext           ← onDragStart / onDragEnd / onDragCancel
//    ├─ SortableContext   ← items = uuid ВИДИМЫХ, strategy = вертикальный список
//    │  └─ ul
//    │     └─ DndSortable × N   ← useSortable: ref, style (opacity 0.3 у тащимой), контекст для ⠿
//    │        └─ DeliveryCardShort
//    └─ DndDragOverlay    ← DOM в body (портал), в дереве React — внутри DndContext
//       └─ DeliveryCardShort (копия той, что тащат)
