import { delay, http, HttpResponse } from "msw";

// Типы сервера. Клиент описывает их у себя по тому же контракту — общего кода у них нет
type DocumentStatus = "new" | "processing" | "queued" | "ready" | "deleted" | "error";
type PrepareDocumentsBody = { ids: string[] };
type DocumentError = { id: string; message: string };

// По этому документу «документы уже выданы»: сервер его не готовит
const ALREADY_ISSUED_ID = "doc-103";
const ALREADY_ISSUED_MESSAGE = "Документы уже выданы";

// id документа → когда его отдали на подготовку (Date.now())
const preparedAt = new Map<string, number>();

// Статус не хранится, а считается по прошедшему времени.
// Повторная подготовка просто перезаписывает время — отменять нечего
export const getStatusByTime = (startedAt: number, now: number): DocumentStatus => {
    const seconds = (now - startedAt) / 1000;

    if (seconds < 3) return "new";
    if (seconds < 6) return "processing";
    if (seconds < 9) return "queued";

    return "ready";
};

export const handlers = [
    http.post<never, PrepareDocumentsBody>("/api/documents/prepare", async ({ request }) => {
        const { ids } = await request.json();
        await delay(800);

        const errors: DocumentError[] = [];

        ids.forEach((id) => {
            if (id === ALREADY_ISSUED_ID) {
                errors.push({ id, message: ALREADY_ISSUED_MESSAGE });
            } else {
                preparedAt.set(id, Date.now());
            }
        });

        return HttpResponse.json({ errors });
    }),

    http.get<{ id: string }>("/api/documents/:id/status", async ({ params }) => {
        await delay(300);

        const startedAt = preparedAt.get(params.id);

        if (startedAt === undefined) {
            return HttpResponse.json({ message: "Документ не найден" }, { status: 404 });
        }

        return HttpResponse.json({ id: params.id, status: getStatusByTime(startedAt, Date.now()) });
    }),
];
