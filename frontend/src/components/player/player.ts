import { Scene } from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, 64 * x + 32, 64 * y + 32, "tile");

    // このコードは、スプライトをゲームのシーン（表示リスト）に追加します
    // これがないと、スプライトはメモリ上には存在しますが、画面に表示されません
    // つまり、これはスプライトを「見える」ようにするために必要です
    scene.add.existing(this);

    // このコードは、スプライトに物理演算システムを適用します
    // これにより、スプライトに物理ボディ（this.body）が追加されます
    // これがないと、以下のような物理関連の機能が使えません：
    // ・重力の影響を受ける
    // ・衝突判定
    // ・速度の設定
    // ・加速度の設定
    // ・跳ね返り
    // など
    scene.physics.add.existing(this);

    // 衝突サイズの調整
    // プレイヤーのサイズ変更
    this.setDisplaySize(64, 64);

    // プレイヤーの最初の向きは右
    this.setFrame(52);

    // プレイヤーの衝突時のバウンス設定
    this.body.setBounce(0);

    // プレイヤーがゲームワールドの外に出ないように衝突させる
    this.body.setCollideWorldBounds(true);

    // 下向きのアニメーション
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("tile", { start: 52, end: 54 }),
      frameRate: 2,
      repeat: -1,
    });

    // 上向きのアニメーション
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("tile", { start: 55, end: 57 }),
      frameRate: 2,
      repeat: -1,
    });

    // 左向きのアニメーション
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("tile", { start: 81, end: 83 }),
      frameRate: 2,
      repeat: -1,
    });

    // 右向きのアニメーション
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("tile", { start: 78, end: 80 }),
      frameRate: 2,
      repeat: -1,
    });
  }
}
