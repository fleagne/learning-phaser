import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // この画像をブートシーンにロードしたので、ここに表示することができる
    this.add.image(512, 384, "background");

    // シンプルなプログレスバーの輪郭
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    // プログレス・バーそのもの。進捗率に応じて左から大きくなる
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    // LoaderPluginが発する 'progress' イベントを使ってローディング・バーを更新する
    this.load.on("progress", (progress: number) => {
      // プログレスバーを更新する（バーの幅は464pxなので、100％＝464pxとなる）
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // ゲームのアセットをロードする - 自分のアセットに置き換える
    this.load.setPath("assets");

    this.load.image("logo", "logo.png");
  }

  create() {
    // すべてのアセットがロードされたら、ゲームの他の部分が使用できるグローバルオブジェクトをここで作成する価値があることが多い
    // 例えば、ここでグローバル・アニメーションを定義すれば、他のシーンでも使うことができる

    // "MainMenu" に移動する。カメラのフェードなど、シーンのトランジションに置き換えることもできる
    this.scene.start("MainMenu");
  }
}
