// src/App.tsx
import MainScene from '@/pages/MainScene';
import Calendar from '@/pages/calender/Calendar';
import Chat from '@/pages/chat/Chat';
import Home from '@/pages/home/Home';
import LoginScene from '@/pages/login/LoginScene';
import LoginSelect from '@/pages/login/components/LoginSelect';
import LoginTakeDailyPhoto from '@/pages/login/components/login/TakeDailyPhoto';
import SignupInputChildName from '@/pages/login/components/signup/InputChildName';
import SignupInputPass from '@/pages/login/components/signup/InputPass';
import SignupInputPetInfo from '@/pages/login/components/signup/InputPetInfo';
import SignupInputUserName from '@/pages/login/components/signup/InputUserName';
import SignupPhotoResult from '@/pages/login/components/signup/PhotoResult';
import SubmittingData from '@/pages/login/components/signup/SubmittingData';
import SignupTakePhoto from '@/pages/login/components/signup/TakePhoto';
import Settings from '@/pages/settings/Settings';
import Recommend from '@/pages/recommend/Recommend';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/login/components/login/LoginForm';
import SignupEmailAndPass from './pages/login/components/signup/SignupEmailandPass';
import SignupVerifyCode from './pages/login/components/signup/SignupVerifyCode';
import { Toaster } from '@/components/ui/toaster';

function AppRoutes() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const hasTakenPhoto = useAuthStore(state => state.hasTakenDailyPhotoToday);
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const checkDailyPhotoStatus = useAuthStore(state => state.checkDailyPhotoStatus);

  // ログイン状態とユーザーIDを取得（初期化）
  useEffect(() => {
    initializeAuth();
    checkDailyPhotoStatus();
  }, []);

  return (
    <Routes>
      {/* 最初に / にアクセスされたとき isLoggedIn・hasTakenPhotoの状態によってリダイレクト */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            hasTakenPhoto ? (
              <Navigate to="/app" replace />
            ) : (
              <Navigate to="/app/take-daily-photo" replace />
            )
          ) : (
            <Navigate to="/loginselect" replace />
          )
        }
      />
      {isLoggedIn ? (
        <Route path="/app" element={<MainScene />}>
          <Route index element={<Home />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="chat" element={<Chat />} />
          <Route path="recommend" element={<Recommend />} />
          <Route path="take-daily-photo" element={<LoginTakeDailyPhoto />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      ) : (
        <>
          <Route path="/loginselect" element={<LoginScene />}>
            <Route index element={<LoginSelect />} />
            <Route path="login" element={<LoginForm />} />
          </Route>
          <Route path="/signup" element={<LoginScene />}>
            {/* 新規登録画面 */}
            <Route index element={<SignupEmailAndPass />} />
            <Route path="verify" element={<SignupVerifyCode />} />
            <Route path="input-user-name" element={<SignupInputUserName />} />
            <Route path="input-pass" element={<SignupInputPass />} />
            <Route path="input-child-name" element={<SignupInputChildName />} />
            <Route path="take-photo" element={<SignupTakePhoto />} />
            <Route path="photo-result" element={<SignupPhotoResult />} />
            <Route path="input-pet-info" element={<SignupInputPetInfo />} />
            <Route path="submitting" element={<SubmittingData />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
