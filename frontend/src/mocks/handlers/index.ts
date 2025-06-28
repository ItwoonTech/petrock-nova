// // src/mocks/handlers/index.ts
// import { todoHandlers } from './todoHandlers';
// import { petHandlers } from './petInfoHandlers';

// // export const handlers = [...todoHandlers, ...petHandlers, ...dairyHandlers];
// import { http, HttpResponse } from 'msw';

// const cameraHandlers = [
//     http.get('/login/take-photo', () => {
//         return HttpResponse.json({ success: true });
//     }),
    
//     http.post('/api/upload-photo', async ({ request }) => {
//         const data = await request.json();
//         return HttpResponse.json({ 
//             success: true,
//             message: '写真が正常にアップロードされました',
//             imageUrl: 'https://example.com/uploaded-image.jpg'
//         });
//     })
// ];

// const loginHandlers = [
//     http.get('/login/input-username', () => {
//         return HttpResponse.json({ success: true });
//     }),
    
//     http.get('/login/input-child-name', () => {
//         return HttpResponse.json({ success: true });
//     })
// ];

// export const handlers = [...todoHandlers, ...petHandlers, ...cameraHandlers, ...loginHandlers];
