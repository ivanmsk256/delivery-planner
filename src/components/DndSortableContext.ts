import { createContext } from "react";
import type { useSortable } from "@dnd-kit/sortable";

// Из всего, что возвращает useSortable, ручке нужны только attributes и listeners
export type DndSortableContextValue = Pick<
    ReturnType<typeof useSortable>,
    "attributes" | "listeners"
>;

// null — ручку отрисовали вне DndSortable, тащить нечего
export const DndSortableContext = createContext<DndSortableContextValue | null>(null);
