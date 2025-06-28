import { toaster } from '@/components/ui/toaster';
import { CAMERA_DISPLAY_SIZE, CAMERA_RESOLUTION, CANVAS_SIZE } from '@/constants/photosize';
import { useRef, useState } from 'react';

export const useCamera = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * カメラ起動関数
   * カメラ起動できているかに関して，コンソールにログを出力
   */
  const startCamera = async (mode: string) => {
    // 既存のカメラストリームを停止
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: CAMERA_RESOLUTION.WIDTH },
          height: { ideal: CAMERA_RESOLUTION.HEIGHT },
        },
      });

      // 先にカメラをアクティブに設定
      setIsCameraActive(true);

      // 少し待ってからvideoRefを確認
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;

          // ビデオの読み込みが完了するのを待つ
          videoRef.current.onloadedmetadata = () => {
            // ...
          };
        } else {
          // カメラを停止
          stopCamera();
        }
      }, 100);
    } catch (err) {
      toaster.create({
        title: 'エラー',
        description: 'カメラへのアクセスに失敗しました',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  /**
   * 写真をキャプチャーする共通処理
   * @returns {Promise<string | null>} キャプチャーした画像のBase64データ
   */
  const capturePhoto = async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) {
      toaster.create({
        title: 'エラー',
        description: 'カメラの準備ができていません',
        type: 'error',
        duration: 3000,
      });
      return null;
    }

    try {
      // 1. 写真のキャプチャー
      setIsCapturing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('キャンバスの初期化に失敗しました');
      }

      // キャンバスのサイズを設定
      canvas.width = CANVAS_SIZE.WIDTH;
      canvas.height = CANVAS_SIZE.HEIGHT;

      // 映像の中心から正方形を切り出すための計算
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = video.videoWidth;
      let sourceHeight = video.videoHeight;

      // 映像の表示サイズ（400x400）に対する実際の映像サイズの比率を計算
      const displayRatio = Math.min(
        video.videoWidth / CAMERA_DISPLAY_SIZE.WIDTH,
        video.videoHeight / CAMERA_DISPLAY_SIZE.HEIGHT
      );

      // 実際のトリミングサイズを計算
      const trimSize = CAMERA_DISPLAY_SIZE.WIDTH * displayRatio;

      if (videoAspectRatio > 1) {
        // 横長の場合
        sourceWidth = trimSize;
        sourceHeight = trimSize;
        sourceX = (video.videoWidth - sourceWidth) / 2;
      } else {
        // 縦長の場合
        sourceWidth = trimSize;
        sourceHeight = trimSize;
        sourceY = (video.videoHeight - sourceHeight) / 2;
      }

      // 映像をキャンバスに描画（中心から正方形にトリミング）
      context.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight, // ソース画像の切り出し
        0,
        0,
        CANVAS_SIZE.WIDTH,
        CANVAS_SIZE.HEIGHT // キャンバスへの描画
      );

      // 画像データをBase64形式に変換
      const capturedImage = canvas.toDataURL('image/jpeg');
      return capturedImage;
    } catch (error) {
      console.error('写真のキャプチャーに失敗しました:', error);
      toaster.create({
        title: 'エラー',
        description: '写真の撮影に失敗しました',
        type: 'error',
        duration: 3000,
      });
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    isCameraActive,
    isCapturing,
    isUploading,
    setIsUploading,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
  };
};
