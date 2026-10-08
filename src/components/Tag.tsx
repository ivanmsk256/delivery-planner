import styles from "./Tag.module.css";

type Props = { text: string; tone: "red" | "gray" };

export default function Tag({ text, tone }: Props) {
    return <span className={`${styles.tag} ${styles[tone]}`}>{text}</span>;
}
