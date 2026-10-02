import { useContext } from "react"
import { DndSortableContext } from "./DndSortableContext"

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
            ⠿
        </button>
    )
}
