import { useContext } from "react";
import { DndSortableContext } from "./DndSortableContext";

export default function DndIcon() {
    const sortableContext = useContext(DndSortableContext);

    return (
        <button
            type="button"
            className="drag-handle"
            {...(sortableContext?.attributes || {})} // ... раскладывает объект на отдельные пропсы: role, tabIndex, aria-*
            {...(sortableContext?.listeners || {})} // onMouseDown, onTouchStart — их слушают сенсоры; || {} — если контекста нет (null)
            onContextMenu={(event) => event.preventDefault()} // долгое нажатие на телефоне (и правый клик) не открывает системное меню
        >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
                <circle cx="1.5" cy="1.5" r="1.5" />
                <circle cx="8.5" cy="1.5" r="1.5" />
                <circle cx="1.5" cy="8" r="1.5" />
                <circle cx="8.5" cy="8" r="1.5" />
                <circle cx="1.5" cy="14.5" r="1.5" />
                <circle cx="8.5" cy="14.5" r="1.5" />
            </svg>
        </button>
    );
}
