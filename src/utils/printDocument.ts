export const printDocument = async (documentId: string) => {
    const tab = window.open("", "_blank"); // открыли пустую вкладку для печати документа

    if (tab === null) {
        // проверка на null — если браузер заблокировал
        return alert("Разрешите всплывающие окна");
    }

    try {
        const response = await fetch(`/api/documents/${documentId}/file`);

        if (!response.ok) {
            throw new Error("Не получилось");
        }

        const file = await response.blob(); // тело ответа как файл

        tab.location.href = URL.createObjectURL(file); // временная ссылка на файл из памяти → во вкладку пока нету бэкенда
    } catch {
        tab.close();
        alert("Не удалось открыть документ");
    }
};
