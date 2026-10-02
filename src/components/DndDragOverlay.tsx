import { DragOverlay } from "@dnd-kit/core";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = { children: ReactNode };

// Портал переносит только DOM (в body). В дереве React оверлей остаётся там, где его написали, —
// поэтому рисовать <DndDragOverlay> нужно ВНУТРИ <DndContext>: иначе DragOverlay не видит,
// что сейчас тащат, и копия не появится.
export default function DndDragOverlay({ children }: Props) {
    return createPortal(
        <DragOverlay
            adjustScale={false} // копия не подгоняет размер под карточку, над которой висит
            dropAnimation={null} // после отпускания копия не «улетает» обратно, а сразу пропадает
        >
            {children}
        </DragOverlay>,
        document.body,
    );

    // <DragOverlay
    //     adjustScale={false} // копия не подгоняет размер под карточку, над которой висит
    //     dropAnimation={null} // после отпускания копия не «улетает» обратно, а сразу пропадает
    // >
    //     {children}
    // </DragOverlay>
}
