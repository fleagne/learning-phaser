import KeySprite from "./key";

export default class KeysGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene);

    // "13" は鍵を表す
    const keyTypes = map.filterTiles(
      (tile: Phaser.Tilemaps.Tile) => tile.index === 13
    );

    const keys: Array<KeySprite> = [];
    keyTypes?.forEach((key) => {
      keys.push(new KeySprite(scene, key.x, key.y));
    });
    map.replaceByIndex(13, 0);
    this.addMultiple(keys);
  }
}
