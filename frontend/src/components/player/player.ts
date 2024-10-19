import { Scene } from "phaser";
import { Constants } from "../constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private canMove: boolean = true;
  private startX: number = 0;
  private startY: number = 0;
  private endX: number = 0;
  private endY: number = 0;
  private swipeThreshold: number = 150; // スワイプと判定する最小距離
  private swipeDir: string = "";

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

  update(
    scene: Scene,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    acceleration?: {
      x: number;
      y: number;
      z: number;
    }
  ) {
    // pointerdown でタッチやクリックの開始地点を取得
    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.startX = pointer.x;
      this.startY = pointer.y;
    });

    // pointerup でタッチやクリックの終了地点を取得
    scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.endX = pointer.x;
      this.endY = pointer.y;

      this.swipeDir = this.checkSwipe() ?? "";
    });

    if (this.canMove) {
      // 左移動時の処理
      if (
        cursors.left.isDown ||
        this.swipeDir === "left" ||
        (acceleration && acceleration.x <= -2)
      ) {
        this.resetSwipe();
        const tile = groundLayer.getTileAtWorldXY(
          this.x - Constants.TILE_SIZE,
          this.y,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.x -= Constants.TILE_SIZE;
          this.anims.play("left", true);
          this.canMove = false;
        }
        if (tile?.index === 12) {
          scene.cameras.main.pan(0, 0, 500, "Power2");
          this.x -= Constants.TILE_SIZE;
          this.anims.play("left", true);
        }

        // 右移動時の処理
      } else if (
        cursors.right.isDown ||
        this.swipeDir === "right" ||
        (acceleration && acceleration.x >= 2)
      ) {
        this.resetSwipe();
        const tile = groundLayer.getTileAtWorldXY(
          this.x + Constants.TILE_SIZE,
          this.y,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.x += Constants.TILE_SIZE;
          this.anims.play("right", true);
          this.canMove = false;
        }
        if (tile?.index === 12) {
          scene.cameras.main.pan(768 * 2, 0, 500, "Power2");
          this.x += Constants.TILE_SIZE;
          this.anims.play("right", true);
        }

        // 上移動時の処理
      } else if (
        cursors.up.isDown ||
        this.swipeDir === "up" ||
        (acceleration && acceleration.z <= -9)
      ) {
        this.resetSwipe();
        const tile = groundLayer.getTileAtWorldXY(
          this.x,
          this.y - Constants.TILE_SIZE,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.y -= Constants.TILE_SIZE;
          this.anims.play("up", true);
          this.canMove = false;
        }

        // 下移動時の処理
      } else if (
        cursors.down.isDown ||
        this.swipeDir === "down" ||
        (acceleration && acceleration.z >= -2)
      ) {
        this.resetSwipe();
        const tile = groundLayer.getTileAtWorldXY(
          this.x,
          this.y + Constants.TILE_SIZE,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.y += Constants.TILE_SIZE;
          this.anims.play("down", true);
          this.canMove = false;
        }
      } else {
        // Nothing to do
      }
    }

    if (
      cursors.left.isUp &&
      cursors.right.isUp &&
      cursors.up.isUp &&
      cursors.down.isUp
    ) {
      this.canMove = true;
    }
  }

  // スワイプをチェックして、方向を判定
  private checkSwipe() {
    const deltaX = this.endX - this.startX;
    const deltaY = this.endY - this.startY;

    // 閾値を超える場合のみスワイプと判断
    if (
      Math.abs(deltaX) > this.swipeThreshold ||
      Math.abs(deltaY) > this.swipeThreshold
    ) {
      // X方向のスワイプかY方向のスワイプかを判断
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          return "right";
        } else {
          return "left";
        }
      } else {
        if (deltaY > 0) {
          return "down";
        } else {
          return "up";
        }
      }
    }
  }

  private resetSwipe() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.swipeDir = "";
  }
}
