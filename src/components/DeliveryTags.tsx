import Tag from "./Tag";
import styles from "./DeliveryTags.module.css";

type Props = { urgency: boolean };

export default function DeliveryTags({ urgency }: Props) {
    return <div className={styles.row}>{urgency && <Tag text="Срочная" tone="red" />}</div>;
}
