import styles from "./DeliveryButtonSms.module.css";

export default function DeliveryButtonSms() {
    return (
        <button
            className={styles.sms}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            SMS
        </button>
    );
}
