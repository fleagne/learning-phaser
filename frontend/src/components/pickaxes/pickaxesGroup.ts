import PickaxeSprite from "./pickaxes";

export default class PickaxesGroup extends Phaser.GameObjects.Group {
  public pickaxes: number = 0;
  private pickaxesElement: HTMLElement | null;

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene);

    // ピッケルの残本数を表示するためのエレメント
    this.pickaxesElement = document.getElementById("pickaxes");

    // "99" はピッケルを表す
    const pickaxeTypes = map.filterTiles(
      (tile: Phaser.Tilemaps.Tile) => tile.index === 99
    );

    const pickaxes: Array<PickaxeSprite> = [];
    pickaxeTypes?.forEach((pickaxe) => {
      pickaxes.push(new PickaxeSprite(scene, pickaxe.x, pickaxe.y));
    });
    map.replaceByIndex(99, 0);
    this.addMultiple(pickaxes);
    this.showPickaxes();
  }

  showPickaxes() {
    // 獲得したピッケルの表示をするためのエレメントを取得
    this.pickaxesElement!.innerText = `ピッケル(Xで方向を選択し、Aで使用): [ ${"⛏️ ".repeat(
      this.pickaxes
    )}]`;
  }

  use() {
    this.pickaxes -= 1;
  }
}
