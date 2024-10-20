import { Scene } from "phaser";
import { Constants } from "../constants";
import Controls from "../controls/controls";
import EnemiesGroup from "../enemies/enemiesGroup";
import SlimeSprite from "../enemies/slime";
import PickaxesGroup from "../pickaxes/pickaxesGroup";
import SpeechBubble from "../speechBubble/speechBubble";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  marker: Phaser.GameObjects.Graphics;
  public hp: number = 20;
  public mp: number = 10;
  public maxHp: number = 20;
  public maxMp: number = 10;
  private canMove: boolean = true;
  private hpElement: HTMLElement | null;
  private mpElement: HTMLElement | null;

  constructor(scene: Scene, x: number, y: number) {
    super(
      scene,
      Constants.TILE_SIZE * x + 32,
      Constants.TILE_SIZE * y + 32,
      "tile"
    );

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
    this.setDisplaySize(Constants.TILE_SIZE, Constants.TILE_SIZE);

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

    // 枠線を表示。この補正値がなぜこうなるのかはまだよくわかっていない
    this.marker.strokeRect(
      Constants.TILE_SIZE * x * 0,
      Constants.TILE_SIZE * y * 1,
      Constants.TILE_SIZE,
      Constants.TILE_SIZE
    );

    // HPとMPを表示するためのエレメントを取得
    this.hpElement = document.getElementById("hp");
    this.mpElement = document.getElementById("mp");

    this.showHp();
    this.showMp();
  }

  update(
    scene: Scene,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    controls: Controls,
    map: Phaser.Tilemaps.Tilemap,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
    pickaxesGroup: PickaxesGroup,
    enemiesGroup: EnemiesGroup
  ) {
    // 基本的にマーカーは非表示
    this.marker.setAlpha(0);

    // アイテムの使用
    if (controls.xIsDown) {
      if (pickaxesGroup.pickaxes === 0) {
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
        this.use("pickaxe", map, groundLayer, pickaxesGroup);
        this.canMove = true;
        controls.cancel();

        // プレイヤーのアイテムの使用を終えたのちに、敵の行動を行う
        enemiesGroup.action(this, groundLayer);
      }
      this.canMove = false;
      this.marker.setAlpha(1);

      if (this.anims.currentAnim?.key == "left") {
        // プレイヤーの前方にマーカーを表示させる（左）
        this.marker.x = this.x - Constants.TILE_SIZE * 2 + 32;
        this.marker.y = this.y - Constants.TILE_SIZE * 1 - 32;
      }

      if (this.anims.currentAnim?.key == "right") {
        // プレイヤーの前方にマーカーを表示させる（右）
        this.marker.x = this.x + Constants.TILE_SIZE * 0 + 32;
        this.marker.y = this.y - Constants.TILE_SIZE * 1 - 32;
      }

      if (this.anims.currentAnim?.key == "up") {
        // プレイヤーの前方にマーカーを表示させる（上）
        this.marker.x = this.x - Constants.TILE_SIZE * 1 + 32;
        this.marker.y = this.y - Constants.TILE_SIZE * 2 - 32;
      }

      if (this.anims.currentAnim?.key == "down") {
        // プレイヤーの前方にマーカーを表示させる（下）
        this.marker.x = this.x - Constants.TILE_SIZE * 1 + 32;
        this.marker.y = this.y + Constants.TILE_SIZE * 0 - 32;
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

    // 攻撃
    if (controls.yIsDown) {
      if (controls.bIsDown) {
        this.canMove = true;
        controls.cancel();
      }
      if (controls.aIsDown) {
        this.attack(groundLayer);
        this.canMove = true;
        controls.cancel();

        const originalX = this.x;
        const originalY = this.y;
        let moveX = this.x;
        let moveY = this.y;
        if (this.anims.currentAnim?.key == "left") moveX -= 32;
        if (this.anims.currentAnim?.key == "right") moveX += 32;
        if (this.anims.currentAnim?.key == "up") moveY -= 32;
        if (this.anims.currentAnim?.key == "down") moveY += 32;

        this.scene.tweens.add({
          targets: this,
          x: moveX,
          y: moveY,
          duration: 100, // 100ミリ秒で前進
          onComplete: async () => {
            // 攻撃先に敵がいた場合は、敵にダメージを与える
            await enemiesGroup.checkAndHitEnemies(
              this.marker.x,
              this.marker.y + Constants.TILE_SIZE,
              1
            );

            // 攻撃後、元の位置に戻る
            this.scene.tweens.add({
              targets: this,
              x: originalX,
              y: originalY,
              duration: 100, // 100ミリ秒で元の位置に戻る
              onComplete: () => {
                // プレイヤーの攻撃を終えたのちに、敵の行動を行う
                enemiesGroup.action(this, groundLayer);
              },
            });
          },
        });
      }
      this.canMove = false;
      this.marker.setAlpha(1);

      if (this.anims.currentAnim?.key == "left") {
        // プレイヤーの前方にマーカーを表示させる（左）
        this.marker.x = this.x - Constants.TILE_SIZE * 2 + 32;
        this.marker.y = this.y - Constants.TILE_SIZE * 1 - 32;
      }

      if (this.anims.currentAnim?.key == "right") {
        // プレイヤーの前方にマーカーを表示させる（右）
        this.marker.x = this.x + Constants.TILE_SIZE * 0 + 32;
        this.marker.y = this.y - Constants.TILE_SIZE * 1 - 32;
      }

      if (this.anims.currentAnim?.key == "up") {
        // プレイヤーの前方にマーカーを表示させる（上）
        this.marker.x = this.x - Constants.TILE_SIZE * 1 + 32;
        this.marker.y = this.y - Constants.TILE_SIZE * 2 - 32;
      }

      if (this.anims.currentAnim?.key == "down") {
        // プレイヤーの前方にマーカーを表示させる（下）
        this.marker.x = this.x - Constants.TILE_SIZE * 1 + 32;
        this.marker.y = this.y + Constants.TILE_SIZE * 0 - 32;
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

    // 移動
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
        // 左方向に敵がいないかを確認し、敵がいる場合は進行させない
        let isBlock = false;
        enemiesGroup.children.iterate(
          (enemy: Phaser.GameObjects.GameObject) => {
            if (enemy instanceof SlimeSprite) {
              if (
                enemy.x === this.x - Constants.TILE_SIZE &&
                enemy.y === this.y
              ) {
                isBlock = true;
                // 1体でもいた場合は、ループを終了
                return false;
              }
            }
            return true;
          }
        );
        if (
          !isBlock &&
          Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)
        ) {
          this.x -= Constants.TILE_SIZE;
          this.canMove = false;
          // プレイヤーの移動を終えたのちに、敵の行動を行う
          enemiesGroup.action(this, groundLayer);
        } else {
          isBlock = false;
        }
        if (tile?.index === 12) {
          scene.cameras.main.pan(0, 0, 500, "Power2");
          this.x -= Constants.TILE_SIZE;
        }
        if (tile?.index === 89) {
          this.hit(1);
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
        // 右方向に敵がいないかを確認し、敵がいる場合は進行させない
        let isBlock = false;
        enemiesGroup.children.iterate(
          (enemy: Phaser.GameObjects.GameObject) => {
            if (enemy instanceof SlimeSprite) {
              if (
                enemy.x === this.x + Constants.TILE_SIZE &&
                enemy.y === this.y
              ) {
                isBlock = true;
                // 1体でもいた場合は、ループを終了
                return false;
              }
            }
            return true;
          }
        );
        if (
          !isBlock &&
          Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)
        ) {
          this.x += Constants.TILE_SIZE;
          this.canMove = false;
          // プレイヤーの移動を終えたのちに、敵の行動を行う
          enemiesGroup.action(this, groundLayer);
        } else {
          isBlock = false;
        }
        if (tile?.index === 12) {
          scene.cameras.main.pan(768 * 2, 0, 500, "Power2");
          this.x += Constants.TILE_SIZE;
        }
        if (tile?.index === 89) {
          this.hit(1);
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
        // 上方向に敵がいないかを確認し、敵がいる場合は進行させない
        let isBlock = false;
        enemiesGroup.children.iterate(
          (enemy: Phaser.GameObjects.GameObject) => {
            if (enemy instanceof SlimeSprite) {
              if (
                enemy.x === this.x &&
                enemy.y === this.y - Constants.TILE_SIZE
              ) {
                isBlock = true;
                // 1体でもいた場合は、ループを終了
                return false;
              }
            }
            return true;
          }
        );
        if (
          !isBlock &&
          Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)
        ) {
          this.y -= Constants.TILE_SIZE;
          this.canMove = false;
          // プレイヤーの移動を終えたのちに、敵の行動を行う
          enemiesGroup.action(this, groundLayer);
        } else {
          isBlock = false;
        }
        if (tile?.index === 89) {
          this.hit(1);
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
        // 下方向に敵がいないかを確認し、敵がいる場合は進行させない
        let isBlock = false;
        enemiesGroup.children.iterate(
          (enemy: Phaser.GameObjects.GameObject) => {
            if (enemy instanceof SlimeSprite) {
              if (
                enemy.x === this.x &&
                enemy.y === this.y + Constants.TILE_SIZE
              ) {
                isBlock = true;
                // 1体でもいた場合は、ループを終了
                return false;
              }
            }
            return true;
          }
        );
        if (
          !isBlock &&
          Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)
        ) {
          this.y += Constants.TILE_SIZE;
          this.canMove = false;
          // プレイヤーの移動を終えたのちに、敵の行動を行う
          enemiesGroup.action(this, groundLayer);
        } else {
          isBlock = false;
        }
        if (tile?.index === 89) {
          this.hit(1);
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
    pickaxesGroup: PickaxesGroup
  ) {
    if (name === "pickaxe") {
      const tile = groundLayer.getTileAtWorldXY(
        this.marker.x,
        this.marker.y + Constants.TILE_SIZE, // 補正する
        true
      );
      if (tile?.index === 33) {
        map.replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
        pickaxesGroup.use();
        pickaxesGroup.showPickaxes();
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

  attack(groundLayer: Phaser.Tilemaps.TilemapLayer) {
    const tile = groundLayer.getTileAtWorldXY(
      this.marker.x,
      this.marker.y + Constants.TILE_SIZE, // 補正する
      true
    );
    if (tile?.index === 98) {
      this.hit(1);
      new SpeechBubble(
        this.scene,
        this.x,
        this.y,
        "壁を殴るのは痛いよ..."
      ).showBubble();
      this.showHp();
    }
  }

  showHp() {
    this.hpElement!.innerText = `HP: ${this.hp} / ${this.maxHp}`;
  }

  showMp() {
    this.mpElement!.innerText = `MP: ${this.mp} / ${this.maxMp}`;
  }

  shakeEffect() {
    this.scene.tweens.add({
      targets: this, // 対象のスプライト
      x: this.x + Phaser.Math.Between(-5, 5), // X軸方向にランダムに揺れる
      y: this.y + Phaser.Math.Between(-5, 5), // Y軸方向にランダムに揺れる
      duration: 30, // 揺れるアニメーションの時間
      repeat: 3, // 3回繰り返す
      yoyo: true, // 揺れた後元に戻る
      onComplete: () => {
        // 揺れ終わった後にスプライトを元の位置に戻す
        this.setPosition(this.x, this.y);
      },
    });
  }

  hit(point: number) {
    this.shakeEffect();
    this.hp -= point;
    this.showHp();
  }
}
