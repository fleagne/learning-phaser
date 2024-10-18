import SlimeSprite from "./slime";

export default class EnemiesGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, groundLayer: Phaser.Tilemaps.TilemapLayer) {
    super(scene);

    // "104" はスライムを表す
    const enemyTypes = map.filterTiles(
      (tile: Phaser.Tilemaps.Tile) => tile.index === 104
    );

    let enemies: Array<SlimeSprite> = [];
    enemyTypes?.forEach((enemy) => {
      enemies.push(new SlimeSprite(scene, enemy.x, enemy.y, groundLayer));
    });
    map.replaceByIndex(104, 0);
    this.addMultiple(enemies);
  }
}
