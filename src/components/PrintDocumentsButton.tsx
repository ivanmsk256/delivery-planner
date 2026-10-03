import {
    DOCUMENTS_ALREADY_ISSUED_MESSAGE,
    PREPARE_BATCH_KEY,
    documentApi,
    useGetDocumentStatusQuery,
    usePrepareDocumentsMutation,
} from "../app/documentsApi";

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
    const myError = batch.data?.errors.find((e) => e.id === documentId);

    // Опрашиваем, только когда общий запрос прошёл и по этому документу нет ошибки
    const canPoll = batch.isSuccess && !myError;

    // Последний статус читаем из кэша без запроса: он нужен раньше, чем вызван хук опроса
    const { data } = documentApi.endpoints.getDocumentStatus.useQueryState(documentId);
    const isReady = data?.status === "ready";

    useGetDocumentStatusQuery(documentId, {
        skip: !canPoll,
        pollingInterval: isReady ? 0 : POLLING_INTERVAL,
    });

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

        if (myError) {
            return BUTTON_TEXT.Error;
        }

        if (isReady) {
            return BUTTON_TEXT.Ready;
        }

        return BUTTON_TEXT.InProgress;
    };

    // Активна только при ready: печатать можно только готовый документ
    return (
        <button type="button" disabled={!isReady}>
            {getButtonText()}
        </button>
    );
}
