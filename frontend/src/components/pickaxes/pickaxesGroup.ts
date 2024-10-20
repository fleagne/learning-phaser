import PickaxeSprite from "./pickaxes";

export default class PickaxesGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene);

    // "99" はピッケルを表す
    const pickaxeTypes = map.filterTiles(
      (tile: Phaser.Tilemaps.Tile) => tile.index === 99
    );

    let pickaxes: Array<PickaxeSprite> = [];
    pickaxeTypes?.forEach((pickaxe) => {
      pickaxes.push(new PickaxeSprite(scene, pickaxe.x, pickaxe.y));
    });
    map.replaceByIndex(99, 0);
    this.addMultiple(pickaxes);
  }
}
