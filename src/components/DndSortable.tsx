import type { CSSProperties, ReactNode } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndSortableContext } from "./DndSortableContext";

type Props = { id: UniqueIdentifier; disabled?: boolean; children: ReactNode };

export const DndSortable = ({ id, disabled, children }: Props) => {
    const {
        setNodeRef, // ref на DOM-узел: по нему dnd-kit меряет место и размер карточки
        transform, // на сколько сдвинуть сейчас: { x, y, scaleX, scaleY }
        transition, // CSS-строка — соседи расступаются плавно
        isDragging, // true у карточки, которую тащат
        attributes, // доступность: role="button", tabIndex, aria-roledescription="sortable", aria-describedby → скринридер скажет «сортируемый, нажмите пробел»
        listeners, // указываем место для которого применяем sensors
    } = useSortable({ id, disabled }); // disabled → listeners = undefined, ⠿ не тащит (в DndIcon сработает || {})

    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform), // Translate, а не Transform: без scale карточки не растянет
        transition,
        // Едет копия в оверлее, а оригинал — полупрозрачный «призрак»: держит место нужной высоты в списке.
        // zIndex не нужен: сам оригинал никуда не едет поверх соседей, едет копия.
        opacity: isDragging ? 0.3 : undefined,
        position: "relative", // точка отсчёта для ручки ⠿ (она position: absolute)
    };

    const contextValue = useMemo(() => ({ attributes, listeners }), [attributes, listeners]);

    return (
        <DndSortableContext.Provider value={contextValue}>
            <li ref={setNodeRef} style={style}>
                {children}
            </li>
        </DndSortableContext.Provider>
    );
};
