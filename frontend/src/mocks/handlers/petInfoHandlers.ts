// import { http, HttpResponse } from 'msw';

// const mockPets = [
//   {
//     petId: 'pet-1',
//     userId: 'user-123',
//     name: 'ポチ',
//     category: 'ゴールデンレトリーバー',
//     birthDate: '2022-01-15',
//     gender: 'male',
//     notes: '元気いっぱい',
//     imageUrl: '/images/dog1.png',
//     createdAt: '2023-01-01T10:00:00Z',
//     updatedAt: '2024-12-31T15:30:00Z',
//   },
//   {
//     petId: 'pet-2',
//     userId: 'user-124',
//     name: 'ミケ',
//     category: '猫',
//     birthDate: '2023-03-10',
//     gender: 'female',
//     notes: 'おっとりタイプ',
//     imageUrl: '/images/cat1.png',
//     createdAt: '2023-04-01T09:00:00Z',
//     updatedAt: '2024-11-20T11:45:00Z',
//   },
// ];

// export const petHandlers = [
//   // ペット一覧取得
//   http.get('/pets', () => {
//     return HttpResponse.json(mockPets);
//   }),

//   // PATCH（記録の一部を更新）
//   http.patch('/petinfo/:id', async ({ request, params }) => {
//     const body = await request.json();
//     const now = new Date().toISOString();
//     return HttpResponse.json({
//       id: params.id,
//       ...(typeof body === 'object' && body !== null ? body : {}),
//       updatedAt: now,
//     });
//   }),

//   // ペット情報更新
//   http.put('/petinfo/:id', async ({ request, params }) => {
//     const body = await request.json();
//     const index = mockPets.findIndex((p) => p.petId === params.id);
//     if (index === -1) {
//       return HttpResponse.json({ message: 'Pet not found' }, { status: 404 });
//     }
//     const updatedPet = {
//       ...mockPets[index],
//       ...(body as object),
//       updatedAt: new Date().toISOString(),
//     };
//     mockPets[index] = updatedPet;
//     return HttpResponse.json(updatedPet);
//   }),

//   // DELETE（記録の削除）
//   http.delete('/petinfo/:id', () => {
//     return new HttpResponse(null, { status: 204 });
//   }),

//   // Health Check
//   http.get('/', () => {
//     return new Response('OK', { status: 200 });
//   }),
// ];
