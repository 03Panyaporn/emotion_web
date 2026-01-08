"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import * as ort from "onnxruntime-web";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("กำลังโหลด OpenCV...");
  const [emotion, setEmotion] = useState("-");
  const [conf, setConf] = useState(0);

  // 1. ฟังก์ชันเริ่มเปิดกล้อง [cite: 249, 250]
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus("สถานะ: กล้องพร้อมใช้งาน");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setStatus("สถานะ: ไม่สามารถเข้าถึงกล้องได้");
    }
  };

  // 2. ฟังก์ชันโหลดโมเดล ONNX [cite: 311, 323]
  const loadModel = async () => {
    try {
      const session = await ort.InferenceSession.create("/models/emotion_yolo11n_cls.onnx");
      console.log("Model loaded successfully");
      return session;
    } catch (e) {
      console.error("Failed to load model:", e);
    }
  };

  // 3. Logic การตรวจจับ (ต้องรันหลังจาก OpenCV โหลดเสร็จ) [cite: 257, 261]
  const processVideo = async (session: any) => {
    // โค้ดส่วนนี้จะใช้ cv.CascadeClassifier เพื่อหาใบหน้า 
    // และส่งภาพเข้า session.run() เพื่อทำนายอารมณ์
    // รายละเอียดการใช้ cv จะดึงจากไฟล์ /opencv/haarcascade_frontalface_default.xml
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {/* โหลด OpenCV.js จาก public/opencv/ [cite: 256, 260] */}
      <Script 
        src="/opencv/opencv.js" 
        onLoad={() => setStatus("สถานะ: พร้อม เริ่มกดปุ่ม Start")} 
      />

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Face Emotion (OpenCV + YOLO11-CLS)</h1>
        <p className="mb-4 text-blue-600 font-medium">{status}</p>

        <div className="relative mb-4 bg-black rounded-lg overflow-hidden aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-xl">Emotion: <span className="font-bold text-red-500">{emotion}</span></p>
          <p className="text-sm text-gray-500">Conf: {conf.toFixed(1)}%</p>
        </div>

        <button
          onClick={startCamera}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
        >
          Start Camera
        </button>
        <p className="mt-2 text-xs text-gray-400">หมายเหตุ: ต้องกดปุ่ม Start เพื่อขอสิทธิ์เปิดกล้อง [cite: 250]</p>
      </div>
    </div>
  );
}