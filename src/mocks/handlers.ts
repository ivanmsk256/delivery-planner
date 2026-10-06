import { delay, http, HttpResponse } from "msw";

// Типы сервера. Клиент описывает их у себя по тому же контракту — общего кода у них нет
type DocumentStatus = "new" | "processing" | "queued" | "ready" | "deleted" | "error";
type PrepareDocumentsBody = { ids: string[] };
type DocumentError = { id: string; message: string };

// По этому документу «документы уже выданы»: сервер его не готовит
const ALREADY_ISSUED_ID = "doc-103";
const ALREADY_ISSUED_MESSAGE = "Документы уже выданы";

// Эти документы при первой подготовке «падают» после этапа processing,
// после повторной подготовки готовятся как обычно
const FAIL_ONCE = new Map<string, DocumentStatus>([
    ["doc-102", "error"],
    ["doc-104", "deleted"],
]);

// id документа → когда его отдали на подготовку (Date.now())
const preparedAt = new Map<string, number>();
// id документа → сколько раз его отдавали на подготовку
const attempts = new Map<string, number>();

// Статус не хранится, а считается по прошедшему времени.
// Повторная подготовка просто перезаписывает время — отменять нечего
export const getStatusByTime = (
    startedAt: number,
    now: number,
    failStatus?: DocumentStatus,
): DocumentStatus => {
    const seconds = (now - startedAt) / 1000;

    if (seconds < 3) return "new";
    if (seconds < 6) return "processing";
    if (failStatus) return failStatus;
    if (seconds < 9) return "queued";

    return "ready";
};

export const handlers = [
    http.post<never, PrepareDocumentsBody>("/api/documents/prepare", async ({ request }) => {
        const { ids } = await request.json();
        // Повторная подготовка — все id уже готовили раньше
        const isRestart = ids.every((id) => attempts.has(id));
        await delay(800);

        // Переключатель для проверки ошибок: в консоли localStorage.setItem("failPrepare", "1") и F5
        if (localStorage.getItem("failPrepare") === "1") {
            return HttpResponse.json({ message: "Сервер недоступен" }, { status: 500 });
        }

        // То же только для повторной подготовки: localStorage.setItem("failRestart", "1") и F5
        if (isRestart && localStorage.getItem("failRestart") === "1") {
            return HttpResponse.json({ message: "Сервер недоступен" }, { status: 500 });
        }

        const errors: DocumentError[] = [];

        ids.forEach((id) => {
            if (id === ALREADY_ISSUED_ID) {
                errors.push({ id, message: ALREADY_ISSUED_MESSAGE });
            } else {
                preparedAt.set(id, Date.now());
                attempts.set(id, (attempts.get(id) ?? 0) + 1);
            }
        });

        return HttpResponse.json({ errors });
    }),

    http.get<{ id: string }>("/api/documents/:id/status", async ({ params }) => {
        await delay(300);

        const status = getCurrentStatus(params.id);

        if (status === undefined) {
            return HttpResponse.json({ message: "Документ не найден" }, { status: 404 });
        }

        return HttpResponse.json({ id: params.id, status });
    }),

    // Файл документа для печати: обычная HTML-страница, которая сама открывает окно печати
    http.get<{ id: string }>("/api/documents/:id/file", async ({ params }) => {
        await delay(500);

        const status = getCurrentStatus(params.id);

        if (status === undefined) {
            return HttpResponse.json({ message: "Документ не найден" }, { status: 404 });
        }

        if (status !== "ready") {
            return HttpResponse.json({ message: "Документ ещё не готов" }, { status: 409 });
        }

        return HttpResponse.html(`<!doctype html>
<html lang="ru">
<head><meta charset="utf-8"><title>Документ ${params.id}</title></head>
<body>
    <h1>Документы по доставке</h1>
    <p>Номер документа: ${params.id}</p>
    <p>Дата печати: ${new Date().toLocaleString("ru-RU")}</p>
    <p>Подпись клиента: ____________________</p>
    <p>Подпись курьера: ____________________</p>
    <script>window.onload = () => window.print();</script>
</body>
</html>`);
    }),
];

// Текущий статус документа или undefined, если его не отдавали на подготовку
function getCurrentStatus(id: string): DocumentStatus | undefined {
    const startedAt = preparedAt.get(id);

    if (startedAt === undefined) {
        return undefined;
    }

    // Падает только первая подготовка
    const failStatus = attempts.get(id) === 1 ? FAIL_ONCE.get(id) : undefined;

    return getStatusByTime(startedAt, Date.now(), failStatus);
}
