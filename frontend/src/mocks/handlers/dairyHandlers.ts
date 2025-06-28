// import { http, HttpResponse } from 'msw';
// import goldenDog from '@/assets/images/golden_dog.jpeg';
// import marutizu from '@/assets/images/marutizu.png';
// import sirohamu from '@/assets/images/sirohamu.png';

// const mockDiaryEntries = [
//   {
//     petId: '42c829b1-b69a-4d27-b755-322f4661215d',
//     date: '2024-03-20',
//     userId: 'user-123',
//     pictureLink: goldenDog,
//     reaction: '今日は元気いっぱい！',
//     weather: '晴れ',
//     temperature: 20.5,
//     task: [
//       {
//         task_title: '朝の散歩',
//         task_description: '2km走る',
//         task_time: '08:00:00',
//         completed: true,
//         repeat: true,
//         sub_task: [
//           {
//             title: 'リードの装着',
//             description: '首輪とリードを付ける',
//             completed: true,
//             sub_task_time: '07:55:00',
//           },
//           {
//             title: '散歩コースの確認',
//             description: '新しいコースをチェック',
//             completed: false,
//             sub_task_time: '07:58:00',
//           },
//         ],
//       },
//       {
//         task_title: 'おやつ',
//         task_description: 'お気に入りのおやつをあげる',
//         task_time: '10:00:00',
//         completed: false,
//         repeat: false,
//         sub_task: [],
//       },
//     ],
//     createdAt: '2024-03-20T09:00:00Z',
//     updatedAt: '2024-03-20T10:00:00Z',
//   },
//   {
//     petId: '42c829b1-b69a-4d27-b755-322f4661215d',
//     date: '2024-03-21',
//     userId: 'user-123',
//     pictureLink: marutizu,
//     reaction: '今日はまったり過ごしたよ。',
//     weather: '曇り',
//     temperature: 18.0,
//     task: [
//       {
//         task_title: 'ブラッシング',
//         task_description: '毛並みを整える',
//         task_time: '15:00:00',
//         completed: false,
//         repeat: false,
//         sub_task: [],
//       },
//     ],
//     createdAt: '2024-03-21T09:00:00Z',
//     updatedAt: '2024-03-21T10:00:00Z',
//   },
//   {
//     petId: '42c829b1-b69a-4d27-b755-322f4661215d',
//     date: '2024-03-22',
//     userId: 'user-123',
//     pictureLink: sirohamu,
//     reaction: '新しいおもちゃで遊んだよ！',
//     weather: '雨',
//     temperature: 15.0,
//     task: [
//       {
//         task_title: 'シャンプー',
//         task_description: '体を清潔にする',
//         task_time: '14:00:00',
//         completed: false,
//         repeat: true,
//         sub_task: [],
//       },
//     ],
//     createdAt: '2024-03-22T09:00:00Z',
//     updatedAt: '2024-03-22T10:00:00Z',
//   },
// ];

// export const dairyHandlers = [
//   http.get('/pets/:petId/daily-records/:date', ({ params }) => {
//     const { petId, date } = params;
//     const entry = mockDiaryEntries.find(
//       (e) => e.petId === petId && e.date === date
//     );

//     if (entry) {
//       return HttpResponse.json(entry);
//     } else {
//       return new HttpResponse(null, { status: 404 });
//     }
//   }),

//   // Health Check
//   http.get('/', () => {
//     return new Response('OK', { status: 200 });
//   }),
// ];
