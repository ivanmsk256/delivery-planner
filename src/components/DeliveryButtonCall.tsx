import styles from "./DeliveryButtonCall.module.css";

export default function DeliveryButtonCall() {
    return (
        <button
            className={styles.buttonCall}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            Позвонить
        </button>
    );
}
