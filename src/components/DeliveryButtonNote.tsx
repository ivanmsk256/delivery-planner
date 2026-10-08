import styles from "./DeliveryButtonNote.module.css";

export default function DeliveryButtonNote() {
    return (
        <button
            className={styles.note}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            Заметки
        </button>
    );
}
