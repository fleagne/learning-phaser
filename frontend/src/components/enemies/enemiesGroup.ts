import Player from "../player/player";
import SlimeSprite from "./slime";

export default class EnemiesGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene);

    // "104" はスライムを表す
    const enemyTypes = map.filterTiles(
      (tile: Phaser.Tilemaps.Tile) => tile.index === 104
    );

    const enemies: Array<SlimeSprite> = [];
    enemyTypes?.forEach((enemy) => {
      enemies.push(new SlimeSprite(scene, enemy.x, enemy.y));
    });
    map.replaceByIndex(104, 0);
    this.addMultiple(enemies);
  }

  action(player: Player, groundLayer: Phaser.Tilemaps.TilemapLayer) {
    this.children.iterate((enemy: Phaser.GameObjects.GameObject) => {
      if (enemy instanceof SlimeSprite) {
        if (enemy.dead) return true;
        // 攻撃範囲内にプレイヤーがいた場合は、攻撃を行う
        if (enemy.isInAttackRange(player)) {
          enemy.attack(player);
        } else {
          enemy.action(groundLayer);
        }
        return true;
      }
      return true;
    });
  }

  // プレイヤーのマーカーの座標で敵をチェックしてダメージを与える
  checkAndHitEnemies(
    markerX: number,
    markerY: number,
    damage: number
  ): Promise<void> {
    return new Promise((resolve) => {
      const promises: Promise<void>[] = [];

      this.children.iterate((enemy: Phaser.GameObjects.GameObject) => {
        if (enemy instanceof SlimeSprite) {
          if (enemy.dead) return true;

          if (markerX === enemy.x - 32 && markerY === enemy.y - 32) {
            const hitPromise = new Promise<void>((hitResolve) => {
              this.scene.tweens.add({
                targets: enemy, // 対象のスプライト
                x: enemy.x + Phaser.Math.Between(-5, 5), // X軸方向にランダムに揺れる
                y: enemy.y + Phaser.Math.Between(-5, 5), // Y軸方向にランダムに揺れる
                duration: 30, // 揺れるアニメーションの時間
                repeat: 3, // 3回繰り返す
                yoyo: true, // 揺れた後元に戻る
                onComplete: () => {
                  // 揺れ終わった後にスプライトを元の位置に戻す
                  enemy.setPosition(enemy.x, enemy.y);
                  enemy.hit(damage);
                  hitResolve();
                },
              });
            });
            promises.push(hitPromise);

            // 現状では複数体にダメージを与えることはないため
            return false;
          }
          return true;
        }
        return false;
      });

      Promise.all(promises).then(() => {
        resolve();
      });
    });
  }
}
