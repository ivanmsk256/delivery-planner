import { useEffect } from "react";
import {
    DOCUMENTS_ALREADY_ISSUED_MESSAGE,
    PREPARE_BATCH_KEY,
    documentApi,
    getRestartKey,
    useGetDocumentStatusQuery,
    usePrepareDocumentsMutation,
} from "../app/documentsApi";
import { printDocument } from "../utils/printDocument";
import styles from "./PrintDocumentsButton.module.css";

type Props = { documentId: string };

const BUTTON_TEXT = {
    InProgress: "Подготовка документов",
    Error: "Ошибка печати",
    PrintNotRequired: "Печать не требуется",
    Ready: "Напечатать документы",
} as const;

const POLLING_INTERVAL = 3000;

export default function PrintDocumentsButton({ documentId }: Props) {
    // Триггер не берём: кнопка только читает результат общего запроса из ячейки по ключу
    const [, batch] = usePrepareDocumentsMutation({ fixedCacheKey: PREPARE_BATCH_KEY });
    const [restartDocument, restart] = usePrepareDocumentsMutation({
        fixedCacheKey: getRestartKey(documentId),
    });

    const myError = batch.data?.errors.find((e) => e.id === documentId);
    const restartError = restart.data?.errors.find((e) => e.id === documentId);

    // Опрашиваем, только когда общий запрос прошёл и по этому документу нет ошибки
    const canPoll = batch.isSuccess && !myError;

    // Последний статус читаем из кэша без запроса: он нужен раньше, чем вызван хук опроса
    const { data } = documentApi.endpoints.getDocumentStatus.useQueryState(documentId);
    const isReady = data?.status === "ready";
    const isFailed = data?.status === "deleted" || data?.status === "error";

    const { refetch } = useGetDocumentStatusQuery(documentId, {
        skip: !canPoll, // skip: true — пропускаем, не спрашиваем
        pollingInterval: isReady || isFailed ? 0 : POLLING_INTERVAL,
    });

    useEffect(() => {
        if (!isFailed) {
            return;
        }

        restartDocument([documentId])
            .unwrap()
            .then((res) => {
                if (res.errors.some((err) => err.id === documentId)) {
                    return;
                }
                refetch();
            })
            .catch(() => {});
    }, [isFailed, documentId, restartDocument, refetch]);

    const getButtonText = () => {
        // Сначала — как прошёл общий запрос
        if (batch.isError) {
            return BUTTON_TEXT.Error;
        }

        if (batch.isLoading) {
            return BUTTON_TEXT.InProgress;
        }

        // Потом — есть ли в ответе ошибка по этому документу
        if (myError?.message === DOCUMENTS_ALREADY_ISSUED_MESSAGE) {
            return BUTTON_TEXT.PrintNotRequired;
        }

        // Ошибка по документу в общем запросе или при перезапуске
        if (myError || restart.isError || restartError) {
            return BUTTON_TEXT.Error;
        }

        if (isReady) {
            return BUTTON_TEXT.Ready;
        }

        return BUTTON_TEXT.InProgress;
    };

    // Активна только при ready: печатать можно только готовый документ
    return (
        <button
            type="button"
            className={styles.print}
            disabled={!isReady}
            onClick={(event) => {
                event.stopPropagation();
                printDocument(documentId);
            }}
        >
            {getButtonText()}
        </button>
    );
}
