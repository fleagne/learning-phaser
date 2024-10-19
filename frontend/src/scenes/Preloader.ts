import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // この画像をブートシーンにロードしたので、ここに表示することができる
    this.add.image(384, 384, "background");

    // シンプルなプログレスバーの輪郭
    this.add.rectangle(384, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    // プログレス・バーそのもの。進捗率に応じて左から大きくなる
    const bar = this.add.rectangle(384 - 230, 384, 4, 28, 0xffffff);

    // LoaderPluginが発する 'progress' イベントを使ってローディング・バーを更新する
    this.load.on("progress", (progress: number) => {
      // プログレスバーを更新する（バーの幅は464pxなので、100％＝464pxとなる）
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // ゲームのアセットをロードする - 自分のアセットに置き換える
    this.load.setPath("assets");

    // ロゴ画像
    this.load.image("logo", "logo.png");

    // タイル画像
    this.load.spritesheet("tile", "images/sokoban_tilesheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // 敵の画像
    this.load.spritesheet("slime", "images/slime.png", {
      frameWidth: 112,
      frameHeight: 68,
    });

    // 鍵の画像
    this.load.spritesheet("key", "images/key.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // マップのJSONファイルの読み込み
    this.load.tilemapTiledJSON("map01", "maps/map01.json");
  }

  create() {
    // すべてのアセットがロードされたら、ゲームの他の部分が使用できるグローバルオブジェクトをここで作成する価値があることが多い
    // 例えば、ここでグローバル・アニメーションを定義すれば、他のシーンでも使うことができる

    // "MainMenu" に移動する。カメラのフェードなど、シーンのトランジションに置き換えることもできる
    this.scene.start("MainMenu");
  }
}
