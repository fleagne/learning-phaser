import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameClear } from "./scenes/GameClear";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { Game, Types } from "phaser";

// ゲームコンフィグについての詳細はこちら：
// https://newdocs.phaser.io/docs/3.86.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  width: 768,                                             // ゲームの幅（ゲームピクセル単位）
  height: 768,                                            // ゲームの高さ（ゲームピクセル単位）
  zoom: 1,                                                // ゲームキャンバスに適用される単純なスケールサイズ。0.5にすると半分のサイズになる
  type: Phaser.AUTO,                                      // 使用するレンダラー
  parent: "game-container",                               // ゲームキャンバスを描画するためのDOM要素のID
  backgroundColor: "#028af8",                             // ゲームキャンバスの背景色。デフォルトは黒
  scale: {
    mode: Phaser.Scale.NONE,                              // スケールモード, FITにすると画面サイズに合わせて拡大される
    autoCenter: Phaser.Scale.CENTER_BOTH,                 // キャンバスを自動的に中央にする
  },
  physics: {
    default: 'arcade',                                    // デフォルトの物理システム。シーンごとに起動される。Phaser は、"arcade", "impact", "matter" を提供する
    arcade: {
      gravity: { x: 0, y: 0 },                            // 重力設定
      debug: false                                        // デバッグモード
    }
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver, GameClear], // ゲームに追加するシーン。複数指定した場合は最初のシーンが開始される
};

export default new Game(config);
