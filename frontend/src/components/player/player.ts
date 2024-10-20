import { Scene } from "phaser";
import { Constants } from "../constants";
import Controls from "../controls/controls";
import SpeechBubble from "../speechBubble/speechBubble";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  marker: Phaser.GameObjects.Graphics;
  private canMove: boolean = true;

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

    // 攻撃やつるはしなどの処理を行うためのマーカーを表示
    this.marker = scene.add.graphics();
    this.marker.lineStyle(4, 0x000000, 1);
    this.marker.strokeRect(64 * x, 64 * y, 64, 64);
  }

  update(
    scene: Scene,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    controls: Controls,
    map: Phaser.Tilemaps.Tilemap,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    getPickaxes: number,
    getPickaxesDivElement: HTMLElement | null
  ) {
    // 基本的にマーカーは非表示
    this.marker.setAlpha(0);

    if (controls.xIsDown) {
      if (getPickaxes === 0) {
        new SpeechBubble(
          scene,
          this.x,
          this.y,
          "ピッケルがないよ！"
        ).showBubble();
        this.canMove = true;
        controls.cancel();
      }
      if (controls.bIsDown) {
        this.canMove = true;
        controls.cancel();
      }
      if (controls.aIsDown) {
        this.use(
          "pickaxe",
          map,
          groundLayer,
          getPickaxes,
          getPickaxesDivElement
        );
        this.canMove = true;
        controls.cancel();
      }
      this.canMove = false;
      this.marker.setAlpha(1);

      if (this.anims.currentAnim?.key == "left") {
        // プレイヤーの前方にマーカーを表示させる（左）
        this.marker.x = this.x - 64 * 2 + 32;
        this.marker.y = this.y - 64 * 1 - 32;
      }

      if (this.anims.currentAnim?.key == "right") {
        // プレイヤーの前方にマーカーを表示させる（右）
        this.marker.x = this.x + 64 * 0 + 32;
        this.marker.y = this.y - 64 * 1 - 32;
      }

      if (this.anims.currentAnim?.key == "up") {
        // プレイヤーの前方にマーカーを表示させる（上）
        this.marker.x = this.x - 64 * 1 + 32;
        this.marker.y = this.y - 64 * 2 - 32;
      }

      if (this.anims.currentAnim?.key == "down") {
        // プレイヤーの前方にマーカーを表示させる（下）
        this.marker.x = this.x - 64 * 1 + 32;
        this.marker.y = this.y + 64 * 0 - 32;
      }

      if (cursors.left.isDown || controls.leftIsDown) {
        this.anims.play("left", true);
      }

      if (cursors.right.isDown || controls.rightIsDown) {
        this.anims.play("right", true);
      }

      if (cursors.up.isDown || controls.upIsDown) {
        this.anims.play("up", true);
      }

      if (cursors.down.isDown || controls.downIsDown) {
        this.anims.play("down", true);
      }
    }

    if (this.canMove) {
      // 左移動時の処理
      if (cursors.left.isDown || controls.leftIsDown) {
        // プレイヤーの向きを左にする
        this.anims.play("left", true);
        const tile = groundLayer.getTileAtWorldXY(
          this.x - Constants.TILE_SIZE,
          this.y,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.x -= Constants.TILE_SIZE;
          this.canMove = false;
        }
        if (tile?.index === 12) {
          scene.cameras.main.pan(0, 0, 500, "Power2");
          this.x -= Constants.TILE_SIZE;
        }

        // 右移動時の処理
      } else if (cursors.right.isDown || controls.rightIsDown) {
        // プレイヤーの向きを右にする
        this.anims.play("right", true);
        const tile = groundLayer.getTileAtWorldXY(
          this.x + Constants.TILE_SIZE,
          this.y,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.x += Constants.TILE_SIZE;
          this.canMove = false;
        }
        if (tile?.index === 12) {
          scene.cameras.main.pan(768 * 2, 0, 500, "Power2");
          this.x += Constants.TILE_SIZE;
        }

        // 上移動時の処理
      } else if (cursors.up.isDown || controls.upIsDown) {
        // プレイヤーの向きを上にする
        this.anims.play("up", true);
        const tile = groundLayer.getTileAtWorldXY(
          this.x,
          this.y - Constants.TILE_SIZE,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.y -= Constants.TILE_SIZE;
          this.canMove = false;
        }

        // 下移動時の処理
      } else if (cursors.down.isDown || controls.downIsDown) {
        // プレイヤーの向きを下にする
        this.anims.play("down", true);
        const tile = groundLayer.getTileAtWorldXY(
          this.x,
          this.y + Constants.TILE_SIZE,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.y += Constants.TILE_SIZE;
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

  use(
    name: string,
    map: Phaser.Tilemaps.Tilemap,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    getPickaxes: number,
    getPickaxesDivElement: HTMLElement | null
  ) {
    if (name === "pickaxe") {
      const tile = groundLayer.getTileAtWorldXY(
        this.marker.x,
        this.marker.y + 64, // 補正する
        true
      );
      console.log(tile);
      if (tile?.index === 33) {
        map.replaceByIndex(33, 0);
        getPickaxes -= 1;
        getPickaxesDivElement!.innerText = `ピッケル(Xで方向を選択し、Aで使用): [ ${"⛏️ ".repeat(
          getPickaxes
        )}]`;
      } else {
        new SpeechBubble(
          this.scene,
          this.x,
          this.y,
          "このブロックには使えないみたい"
        ).showBubble();
      }
    }
  }
}
