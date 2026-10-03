import {
    DOCUMENTS_ALREADY_ISSUED_MESSAGE,
    PREPARE_BATCH_KEY,
    usePrepareDocumentsMutation,
} from "../app/documentsApi";

type Props = { documentId: string };

const BUTTON_TEXT = {
    InProgress: "Подготовка документов",
    Error: "Ошибка печати",
    PrintNotRequired: "Печать не требуется",
} as const;

export default function PrintDocumentsButton({ documentId }: Props) {
    // Триггер не берём: кнопка только читает результат общего запроса из ячейки по ключу
    const [, batch] = usePrepareDocumentsMutation({ fixedCacheKey: PREPARE_BATCH_KEY });

    const getButtonText = () => {
        // Сначала — как прошёл общий запрос
        if (batch.isError) {
            return BUTTON_TEXT.Error;
        }

        if (batch.isLoading) {
            return BUTTON_TEXT.InProgress;
        }

        // Потом — есть ли в ответе ошибка по этому документу
        const myError = batch.data?.errors.find((e) => e.id === documentId);

        if (myError?.message === DOCUMENTS_ALREADY_ISSUED_MESSAGE) {
            return BUTTON_TEXT.PrintNotRequired;
        }

        if (myError) {
            return BUTTON_TEXT.Error;
        }

        return BUTTON_TEXT.InProgress;
    };

    // Пока неактивна: печатать можно только готовый документ
    return (
        <button type="button" disabled>
            {getButtonText()}
        </button>
    );
}
