import type { Constellation, Vector3D } from "../types/astronomy";

function calculateReal3D(longitudeDeg: number, latitudeDeg: number): Vector3D {
  const radLong = (longitudeDeg * Math.PI) / 180;
  const radLat = (latitudeDeg * Math.PI) / 180;
  return {
    x: Math.cos(radLat) * Math.sin(radLong),
    y: Math.sin(radLat),
    z: Math.cos(radLat) * Math.cos(radLong)
  };
}

export const REAL_ZODIAC_CONSTELLATIONS: Constellation[] = [
  {
    id: "taurus", name: "Taurus", jpName: "おうし座", zodiacOrder: 2, baseLongitude: 65,
    stars: [
      { id: "aldebaran", name: "アルデバラン", magnitude: 0.85, position: calculateReal3D(68.9, 5.4) },
      { id: "elnath", name: "エルナト", magnitude: 1.65, position: calculateReal3D(81.2, 15.3) },
      { id: "alcyone", name: "アルシオネ (すばる)", magnitude: 2.85, position: calculateReal3D(56.7, 11.5) },
      { id: "hyadum1", name: "ヒアデスⅠ", magnitude: 3.65, position: calculateReal3D(64.3, 6.2) },
      { id: "ain", name: "アイン", magnitude: 3.53, position: calculateReal3D(67.2, 9.1) },
      { id: "zet_tau", name: "おうし座ζ星", magnitude: 2.97, position: calculateReal3D(84.4, -1.2) }
    ],
    lines: [
      ["aldebaran", "elnath"], ["aldebaran", "hyadum1"], ["hyadum1", "alcyone"],
      ["aldebaran", "ain"], ["ain", "elnath"], ["aldebaran", "zet_tau"]
    ]
  },
  {
    id: "gemini", name: "Gemini", jpName: "ふたご座", zodiacOrder: 3, baseLongitude: 90,
    stars: [
      { id: "pollux", name: "ポルックス", magnitude: 1.14, position: calculateReal3D(114.3, 10.1) },
      { id: "castor", name: "カストル", magnitude: 1.58, position: calculateReal3D(111.4, 14.2) },
      { id: "alhena", name: "アルヘナ", magnitude: 1.93, position: calculateReal3D(99.3, -2.5) },
      { id: "tejat", name: "テジャト", magnitude: 2.87, position: calculateReal3D(93.4, 0.9) },
      { id: "mebsuta", name: "メブスタ", magnitude: 3.06, position: calculateReal3D(102.0, 6.8) },
      { id: "wasat", name: "ワサト", magnitude: 3.50, position: calculateReal3D(107.5, 3.2) }
    ],
    lines: [
      ["pollux", "castor"], ["castor", "mebsuta"], ["mebsuta", "tejat"],
      ["pollux", "wasat"], ["wasat", "alhena"]
    ]
  },
  {
    id: "scorpio", name: "Scorpius", jpName: "さそり座", zodiacOrder: 8, baseLongitude: 245,
    stars: [
      { id: "antares", name: "アンタレス", magnitude: 1.06, position: calculateReal3D(247.3, -4.5) },
      { id: "shaula", name: "シャウラ", magnitude: 1.62, position: calculateReal3D(259.2, -12.1) },
      { id: "dschubba", name: "ジュバ", magnitude: 2.29, position: calculateReal3D(240.7, -1.9) },
      { id: "acrab", name: "アクラブ", magnitude: 2.56, position: calculateReal3D(241.1, 0.7) },
      { id: "wei", name: "ウェイ", magnitude: 2.29, position: calculateReal3D(253.3, -9.2) },
      { id: "sargas", name: "サルガス", magnitude: 1.86, position: calculateReal3D(256.4, -14.0) }
    ],
    lines: [
      ["acrab", "dschubba"], ["dschubba", "antares"], ["antares", "wei"],
      ["wei", "sargas"], ["sargas", "shaula"]
    ]
  }
  // ※紙幅の関係上主要な3星座を抜粋。他の星座もこの高密度フォーマットにシームレスに拡張可能です。
];