import { Provider } from '@/components/ui/provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.ts';

// Configure Amplify in index file or root file
Amplify.configure({ ...awsExports });

// MSWのモックを無効にしました
// async function enableMocking() {
//   if (import.meta.env.MODE !== 'development') return;
//   const { worker } = await import('./mocks/browser');
//   return worker.start();
// }

// enableMocking().then(() => {
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
// });
