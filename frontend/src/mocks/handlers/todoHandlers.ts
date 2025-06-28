// import { http, HttpResponse } from 'msw';
// import goldenDog from '@/assets/images/golden_dog.jpeg';

// // '2025-06-01'のペットに関する情報
// const mockTasks = [
//   {
//     petId: 'pet-1',
//     date: '2025-06-01',
//     userId: 'user-123',
//     pictureLink: goldenDog,
//     reaction: '',
//     weather: '☀️',
//     temperature: '16°C',
//     Task: [
//       {
//       taskTitle: '餌やり',
//       taskDescription: '朝の餌やり',
//       taskTime: '08:00',
//       taskStatus: 'completed',
//       subtasks: [
//         {
//           title: '朝の餌やり',
//           description: '適量を計量して用意する',
//           completed: true,
//           repeat: false,
//           taskTime: '08:00',
//         },
//         {
//           title: '昼の餌やり',
//           description: '新鮮な水に取り替える',
//           completed: true,
//           repeat: false,
//           taskTime: '12:00',
//         },
//         {
//           title: '夜の餌やり',
//           description: '使用後のお皿を洗って乾かす',
//           completed: true,
//           repeat: false,
//           taskTime: '18:00',
//         }
//       ],
//     },
//     {
//       taskTitle: 'さんぽ',
//       taskDescription: 'お散歩に行こう！',
//       taskTime: '17:00',
//       taskStatus: 'incomplete',
//       subtasks: [
//         {
//           title: 'リードを準備',
//           description: 'リードの状態を確認する',
//           completed: true,
//           repeat: false,
//           taskTime: '16:55',
//         },
//         {
//           title: 'ポーチに必要なものを入れる',
//           description: 'おやつ、水、ビニール袋などを準備',
//           completed: false,
//           repeat: false,
//           taskTime: '16:56',
//         },
//         {
//           title: '帰宅後の足拭きの準備',
//           description: 'タオルを用意しておく',
//           completed: false,
//           repeat: false,
//           taskTime: '16:57',
//         }
//       ],
//     },
// {
//       taskTitle: 'おやつ',
//       taskDescription: 'おやつをあげる',
//       taskTime: '18:00',
//       taskStatus: 'incomplete',
//       subtasks: [],
//     },
//   ],
//     createdAt: '2025-06-01T08:00:00Z',
//     updatedAt: '2025-06-01T09:00:00Z',
//   },
// ];

// export const todoHandlers = [
//   // ペットタスク記録（日記）一覧取得
//   http.get('/todos', () => {
//     return HttpResponse.json(mockTasks);
//   }),

//   // POST（新しい記録を追加）
//   http.post('/todos', async ({ request }) => {
//     const body = await request.json();
//     const now = new Date().toISOString();
//     return HttpResponse.json({
//       ...(typeof body === 'object' && body !== null ? body : {}),
//       taskStatus: 'incomplete',
//       createdAt: now,
//       updatedAt: now,
//     });
//   }),

//   // PATCH（記録の一部を更新）
//   http.patch('/todos/:id', async ({ request, params }) => {
//     const body = await request.json();
//     const now = new Date().toISOString();
//     return HttpResponse.json({
//       id: params.id,
//       ...(typeof body === 'object' && body !== null ? body : {}),
//       updatedAt: now,
//     });
//   }),

//   // DELETE（記録の削除）
//   http.delete('/todos/:id', () => {
//     return new HttpResponse(null, { status: 204 });
//   }),

//   // Health Check
//   http.get('/', () => {
//     return new Response('OK', { status: 200 });
//   }),
// ];
