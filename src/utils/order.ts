import type { Delivery } from "../types";

// Срочные наверх, остальные — в том порядке, в каком были (это не сортировка)
export const pinUrgentDeliveries = (deliveries: Delivery[]): Delivery[] => {
    const urgent: Delivery[] = [];
    const regular: Delivery[] = [];

    deliveries.forEach((del) => (del.urgency ? urgent.push(del) : regular.push(del)));

    return [...urgent, ...regular];
};

// Вписывает новый порядок видимых карточек в полный список:
// скрытые остаются на своих местах, видимые места заполняются новым порядком по очереди
export const mergeVisibleOrder = (deliveries: Delivery[], newVisible: Delivery[]): Delivery[] => {
    const newVisibleUuidsSet = new Set(newVisible.map(({ uuid }) => uuid)); // только «видна ли», порядок ему не важен
    let nextVisibleIndex = 0;

    return deliveries.map((del) => {
        // идём по ПОЛНОМУ списку
        if (!newVisibleUuidsSet.has(del.uuid)) return del; // скрытая — остаётся на своём месте

        const next = newVisible[nextVisibleIndex]; // видимое место — следующая из очереди
        nextVisibleIndex += 1;

        return next;
    });
};

let saveCallsCount = 0;

// Имитация запроса: через 500 мс успех, каждый 3-й вызов падает
export const saveDeliveryPosition = (uuids: Array<Delivery["uuid"]>): Promise<void> => {
    saveCallsCount += 1;
    const shouldFail = saveCallsCount % 3 === 0;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`Не удалось сохранить позицию доставки`));
            } else {
                console.log(`сервер сохранил порядок: ${uuids.length} встреч`); // настоящий запрос отправил бы uuids
                resolve();
            }
        }, 500);
    });
};
