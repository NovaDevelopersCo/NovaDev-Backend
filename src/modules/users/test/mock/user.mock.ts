export const userMock = {
    id: 2,
    info: {
        email: null,
        public_nickname: null,
        full_name: 'Кузнецов Никита Алиевич',
        github: null,
        payment_info: null,
        tg: null,
        phone: null,
        image: null,
    },
    tg_id: null,
    roleId: 18,
    teamId: null,
    createdAt: '2024-08-25T11:15:21.184Z',
    updatedAt: '2024-08-26T22:50:56.771Z',
    role: {
        id: 18,
        title: 'CTO',
        description:
            'CTO (Главный технический директор) — один из руководителей компании...',
        level_access: 6,
        createdAt: '2024-08-25T15:01:13.827Z',
        updatedAt: '2024-08-25T15:01:13.827Z',
    },
    team: null,
    projects: [
        {
            id: 5,
            title: 'Ecomerse865',
            technologies: ['NestJS'],
            server: 'Пирамида СПБ',
            documentation: 'Https://Piramida?docs',
            deadline: '2006-10-03T00:00:00.000Z',
            clientId: null,
            createdAt: '2024-08-28T14:41:31.745Z',
            updatedAt: '2024-08-28T14:41:31.745Z',
            UserProject: {
                userId: 2,
                projectId: 5,
                createdAt: '2024-09-11T15:14:56.004Z',
                updatedAt: '2024-09-11T15:14:56.004Z',
            },
        },
    ],
}
