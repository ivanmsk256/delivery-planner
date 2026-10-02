import type { Delivery } from "../types";
import { pinUrgentDeliveries } from "./order";

const LATEST_RECEIVED_DELIVERIES_DATE = "latestReceivedDeliveriesDate";
const SORTED_DELIVERIES_IDS_LIST_KEY = "sortedDeliveriesList";

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

// '2026-10-01' по локальному времени
export const toLocalDateKey = (date: Date = new Date()): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0"); // месяцы с 0
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export const getLocalUuids = () => {
    if (getLatestReceivedDeliveriesDate() !== toLocalDateKey()) {
        return [];
    }

    const uuids = localStorage.getItem(SORTED_DELIVERIES_IDS_LIST_KEY);
    return uuids ? uuids?.split(",").filter(Boolean) : []; // ''.split(',') даёт [''], filter превращает это в []
};

export const setLocalUuids = (uuids: Array<Delivery["uuid"]>) => {
    localStorage.setItem(SORTED_DELIVERIES_IDS_LIST_KEY, uuids.join(","));
    localStorage.setItem(LATEST_RECEIVED_DELIVERIES_DATE, toLocalDateKey());
};

export const getLatestReceivedDeliveriesDate = (): string | null => {
    const value = localStorage.getItem(LATEST_RECEIVED_DELIVERIES_DATE);
    return value && DATE_KEY_RE.test(value) ? value : null;
};

export const getStartDeliverys = (deliveries: Delivery[]) => {
    const byUuid = new Map(deliveries.map((d) => [d.uuid, d]));
    const sorted: Delivery[] = [];

    // 1. сначала доставки в сохранённом порядке
    for (const uuid of getLocalUuids()) {
        const delivery = byUuid.get(uuid);
        if (delivery) {
            sorted.push(delivery);
            byUuid.delete(uuid); // чтобы не попала второй раз в «новые»
        }
    }

    // 2. затем новые, которых не было в сохранённом списке, в исходном порядке
    return pinUrgentDeliveries([...sorted, ...byUuid.values()]);
};
