import { rootService } from "./rootService";

export const PREPARE_BATCH_KEY = "prepareDocumentsBatch";

type DocumentStatus = "new" | "processing" | "queued" | "ready" | "deleted" | "error";
type DocumentStatusResponse = {
    id: string;
    status: DocumentStatus;
};

// Проблема с одним документом из пакета. Сам запрос при этом успешный (200)
type DocumentError = {
    id: string;
    message: string;
};
type PrepareDocumentsResponse = {
    errors: DocumentError[];
};

export const documentApi = rootService.injectEndpoints({
    endpoints: (builder) => ({
        getDocumentStatus: builder.query<DocumentStatusResponse, string>({
            query: (id: string) => `/documents/${id}/status`,
        }),
        prepareDocuments: builder.mutation<PrepareDocumentsResponse, string[]>({
            query: (ids: string[]) => ({
                url: `/documents/prepare`,
                method: "POST",
                body: { ids },
            }),
        }),
    }),
});

export const { useGetDocumentStatusQuery, usePrepareDocumentsMutation } = documentApi;
