import type { Delivery } from "./types"

export const meetings: Delivery[] = [
    {
        uuid: 'db0ee2ef-37a2-4cf1-8371-bf9f45ee0e61',
        address: 'г. Москва, ул. Осенняя, д. 12, кв. 45',
        metro: 'Крылатское',
        lastName: 'Иванов (u)',
        firstName: 'Иван',
        middleName: 'Иванович',
        slotFrom: '10:00',
        slotTo: '12:00',
        urgency: true,
        status: 'active'
    },
    {
        uuid: '2a25422c-cd1d-4989-9696-9c0c576dfb34',
        address: 'г. Москва, Рублёвское ш., д. 28, кв. 7',
        metro: 'Молодёжная',
        lastName: 'Смирнова',
        firstName: 'Анна',
        middleName: 'Сергеевна',
        slotFrom: '10:00',
        slotTo: '12:00',
        urgency: false,
        status: 'active'
    },
    {
        uuid: 'c5b0ba53-dd32-4eb7-8a5d-e259d68e9b58',
        address: 'г. Москва, ул. Ярцевская, д. 19, кв. 112',
        metro: 'Молодёжная',
        lastName: 'Кузнецов (з)',
        firstName: 'Дмитрий',
        middleName: 'Олегович',
        slotFrom: '10:00',
        slotTo: '12:00',
        urgency: false,
        status: 'completed'
    },
    {
        uuid: '9338e838-fa55-4d55-962e-a9e5d1f3e73d',
        address: 'г. Москва, Кутузовский пр-т, д. 30, кв. 18',
        metro: 'Кутузовская',
        lastName: 'Попова',
        firstName: 'Елена',
        middleName: 'Викторовна',
        slotFrom: '10:00',
        slotTo: '12:00',
        urgency: false,
        status: 'active'
    },
    {
        uuid: '6f9233b6-9863-418e-b1c6-8912efa0af61',
        address: 'г. Москва, ул. Маршала Тимошенко, д. 4, кв. 61',
        metro: 'Кунцевская',
        lastName: 'Соколов (з)',
        firstName: 'Артём',
        middleName: 'Андреевич',
        slotFrom: '08:00',
        slotTo: '10:00',
        urgency: false,
        status: 'completed'
    },
    {
        uuid: '692b4cc7-14ab-4f1b-a0e7-23b631998524',
        address: 'г. Москва, ул. Минская, д. 1Г, кв. 203',
        metro: 'Минская',
        lastName: 'Морозова (u)',
        firstName: 'Ольга',
        middleName: 'Павловна',
        slotFrom: '12:00',
        slotTo: '14:00',
        urgency: true,
        status: 'active'
    },
    {
        uuid: 'dae73f06-f5e7-4112-ade6-55bc5ca5844d',
        address: 'г. Москва, Мичуринский пр-т, д. 9, кв. 34',
        metro: 'Раменки',
        lastName: 'Волков',
        firstName: 'Никита',
        middleName: 'Игоревич',
        slotFrom: '14:00',
        slotTo: '16:00',
        urgency: false,
        status: 'active'
    },
    {
        uuid: 'a6081ead-6fdb-4546-86df-96dce91b4580',
        address: 'г. Москва, ул. Василисы Кожиной, д. 14, кв. 9',
        metro: 'Багратионовская',
        lastName: 'Лебедева',
        firstName: 'Мария',
        middleName: 'Александровна',
        slotFrom: '16:00',
        slotTo: '18:00',
        urgency: false,
        status: 'active'
    },
]
