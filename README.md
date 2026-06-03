# 🌌 Real-Time Zodiac Planetarium

TypeScript と React (Canvas API) で構築された、リアルタイムな黄道十二星座の天体観測シミュレーターです。
<img width="1214" height="1025" alt="スクリーンショット 2026-06-03 133525" src="https://github.com/user-attachments/assets/7e250e34-eeba-4c89-8e11-51305a1e4d2a" />

## 🚀 特徴
- **3D空間から2D画面への数理投影**: 赤経・赤緯（黄経・黄緯）の球面幾何データを、行列回転とパースペクティブ計算によって正確に2DのCanvasピクセルへ変換。
- **物理的な星の瞬き（Twinkle Effect）**: 恒星の視等級（Magnitude）と時間軸の波動関数を同期させ、大気によるきらめきをシミュレート。
- **スペクトル色（固有色）の再現**: アンタレスの赤色超巨星、カストルの高温青白星など、星の物理的特性に応じたハロー（光輪）グラデーションを描画。
- **ターゲット・ロックオン機構**: カメラの方位角（Yaw）から最も近い星座を動的に判定し、強調表示。

## 🛠️ 技術スタック
- React 19 / TypeScript
- Vite (Build Tool)
- HTML5 Canvas API

## 📦 セットアップ
```bash
npm install
npm run dev
