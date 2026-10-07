import Tag from "./Tag";
import styles from "./DeliveryTags.module.css";

type Props = { urgency: boolean };

// Решает, КАКИЕ метки показать у доставки; КАК выглядит метка — решает Tag
export default function DeliveryTags({ urgency }: Props) {
    return <div className={styles.row}>{urgency && <Tag text="Срочная" tone="red" />}</div>;
}
