import React, { useRef, useEffect, useState } from "react";
// リアル版データソースを正確にインポート
import { REAL_ZODIAC_CONSTELLATIONS } from "../data/zodiacData";
import { AdvancedPlanetariumProjector } from "../engine/Projector";
import type { Vector2D } from "../types/astronomy";

export const Planetarium: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions] = useState({ width: 800, height: 600 });
  
  // ユーザーの入力状態を保持するRef（再レンダリングをトリガーせずに毎フレーム高速に値を参照するため）
  const stateRef = useRef({
    pitch: 0,
    yaw: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // ロックオン中の星座名をReactの状態として管理
  const [targetName, setTargetName] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 投影エンジンの初期化
    const projector = new AdvancedPlanetariumProjector(dimensions.width, dimensions.height);

    // アニメーションループのリクエストID管理用
    let animationFrameId: number;

    const loop = () => {
      const state = stateRef.current;
      
      // 1. マウス入力（角度）を毎フレーム投影エンジンに同期
      projector.updateOrientation(state.pitch, state.yaw);

      // 2. 現在の視野の中心にあるターゲット星座を計算してReactのStateへ
      const target = projector.getTargetConstellation(REAL_ZODIAC_CONSTELLATIONS);
      if (target) {
        setTargetName(`${target.jpName} (${target.name})`);
      }

      // 3. 宇宙の深度を表現する多層背景の描画（天の川のベールエフェクト）
      const bgGrad = ctx.createRadialGradient(
        dimensions.width / 2, dimensions.height / 2, 10,
        dimensions.width / 2, dimensions.height / 2, dimensions.width
      );
      bgGrad.addColorStop(0, "#040717"); // 中心：わずかに星間ガスで明るい
      bgGrad.addColorStop(0.6, "#02040a");
      bgGrad.addColorStop(1, "#000105");  // 四隅：漆黒
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // 4. 時間軸による星のまたたき（きらめき）係数を算出
      const twinkle = Math.sin(Date.now() * 0.005) * 0.15 + 0.85;
      
      // 5. 各星座のシミュレーションループ
      REAL_ZODIAC_CONSTELLATIONS.forEach((constellation) => {
        const isTarget = constellation.id === target.id;
        const projectedMap = new Map<string, Vector2D>();
      
        // --- A. 星座線の描画（星の下層に回り込ませるため先に出力） ---
        ctx.strokeStyle = isTarget 
          ? "rgba(14, 165, 233, 0.25)"  // ロックオン時はサイバーブルー
          : "rgba(51, 65, 85, 0.12)";
        ctx.lineWidth = isTarget ? 1.5 : 0.8;
        
        constellation.lines.forEach(([fromId, toId]) => {
          const starFrom = constellation.stars.find(s => s.id === fromId);
          const starTo = constellation.stars.find(s => s.id === toId);
          if (!starFrom || !starTo) return;
          
          const p1 = projector.project(starFrom.position);
          const p2 = projector.project(starTo.position);
          
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      
        // --- B. 恒星の精密な物理描画（光学バーストエフェクト） ---
        constellation.stars.forEach((star) => {
          const coords = projector.project(star.position);
          if (!coords) return;
          projectedMap.set(star.id, coords);
      
          // 視等級ベースの対数半径計算
          const baseRadius = Math.max(0.5, 4.5 - star.magnitude * 0.8);
          // 1等星・2等星クラスの明るい星にまたたき(Twinkle)を干渉させる
          const currentRadius = star.magnitude < 2.5 ? baseRadius * twinkle : baseRadius;
      
          // ハローエフェクト（外輝き）の放射状グラデーションの生成
          const glowGrad = ctx.createRadialGradient(
            coords.x, coords.y, 0,
            coords.x, coords.y, currentRadius * 4
          );
          
          let starColor = "#ffffff";
          let glowColor = "rgba(255, 255, 255, 0)";
          
          // 特定の星のスペクトル固有色を判定して彩色
          if (star.id === "antares" || star.id === "aldebaran") {
            starColor = "#ffedd5"; // 巨星の中心核
            glowColor = isTarget ? "rgba(239, 68, 68, 0.4)" : "rgba(249, 115, 22, 0.2)"; // 鮮烈な赤〜橙のハロー
          } else if (star.id === "castor" || star.id === "elnath") {
            starColor = "#f0fdfa"; // 超高温の青白
            glowColor = isTarget ? "rgba(56, 189, 248, 0.4)" : "rgba(186, 230, 253, 0.15)";
          } else {
            glowColor = isTarget ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.08)";
          }
      
          glowGrad.addColorStop(0, starColor);
          glowGrad.addColorStop(0.2, glowColor);
          glowGrad.addColorStop(1, "rgba(0,0,0,0)");
      
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, currentRadius * 4, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
      
          // 中心核（コアとなる鋭い白い輝点）の描画
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, currentRadius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
      
          // --- C. テキストラベルの描画 ---
          if (isTarget && star.magnitude < 3.5) {
            ctx.fillStyle = "rgba(241, 245, 249, 0.85)";
            ctx.font = "11px 'Inter', sans-serif";
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 4;
            ctx.fillText(star.name, coords.x + currentRadius + 6, coords.y + 4);
            ctx.shadowBlur = 0; // 他の描画にシャドウを残さないためのクリア
          }
        });
      });

      // 次のフレームのループを予約（ここが抜けていたため画面が駆動しませんでした）
      animationFrameId = requestAnimationFrame(loop);
    };

    // ループ開始
    loop();
    
    // アンマウント時にアニメーションループを完全にクリーンアップ（メモリリーク防止）
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  // --- マウスドラッグによるインタラクション・ハンドラー群 ---
  const handleMouseDown = (e: React.MouseEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.startX = e.clientX;
    stateRef.current.startY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stateRef.current.isDragging) return;
    const dx = e.clientX - stateRef.current.startX;
    const dy = e.clientY - stateRef.current.startY;

    // 回転角(Yaw/Pitch)に入力差分を統合
    stateRef.current.yaw += dx * 0.005;
    stateRef.current.pitch += dy * 0.005;

    // 天頂・天底を越えて画面が反転しないよう制御（ピッチ制限）
    stateRef.current.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, stateRef.current.pitch));

    stateRef.current.startX = e.clientX;
    stateRef.current.startY = e.clientY;
  };

  const handleMouseUpOrLeave = () => {
    stateRef.current.isDragging = false;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#0f172a", padding: "20px", borderRadius: "12px" }}>
      <div style={{ color: "#38bdf8", fontSize: "20px", fontWeight: "bold", marginBottom: "10px", fontFamily: "monospace" }}>
        LOCK ON: {targetName}
      </div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ 
          cursor: stateRef.current.isDragging ? "grabbing" : "grab", 
          border: "1px solid #334155", 
          borderRadius: "8px", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          backgroundColor: "#000" 
        }}
      />
      <div style={{ color: "#64748b", marginTop: "10px", fontSize: "12px" }}>
        ※画面内をドラッグすると全方位（360度）に星空を回せます
      </div>
    </div>
  );
};