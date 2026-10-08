import type { ReactNode } from "react";
import styles from "./ActionButton.module.css";

type Props = {
    variant: "dark" | "outline" | "light";
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
};

// Только вид кнопки; что она делает — решает компонент, который её рисует
export default function ActionButton({ variant, children, onClick, disabled }: Props) {
    return (
        <button
            type="button"
            className={`${styles.button} ${styles[variant]}`}
            disabled={disabled}
            onClick={(event) => {
                event.stopPropagation(); // клик по кнопке не открывает карточку
                onClick?.(); // ?.() — вызвать, только если onClick передали
            }}
        >
            {children}
        </button>
    );
}
