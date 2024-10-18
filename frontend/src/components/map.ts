import { Scene } from "phaser";

export default class Map {
  private tilemap: Phaser.Tilemaps.Tilemap;

  constructor(scene: Scene, key: string) {
    this.tilemap = scene.make.tilemap({ key });

    // 表示範囲外のオブジェクトも描写されるようにする処理
    scene.physics.world.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );
    scene.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );
  }

  public getTilemap(): Phaser.Tilemaps.Tilemap {
    return this.tilemap;
  }

  public get widthInPixels(): number {
    return this.tilemap.widthInPixels;
  }

  public get heightInPixels(): number {
    return this.tilemap.heightInPixels;
  }

  public addTilesetImage(tilesetName: string, key: string) {
    return this.tilemap.addTilesetImage(tilesetName, key);
  }

  public createLayer(
    layerID: string,
    tileset?: Phaser.Tilemaps.Tileset,
    x?: number,
    y?: number
  ) {
    // タイル画像をマップデータに反映する Tilesetオブジェクトの作成
    const groundTiles = this.tilemap.addTilesetImage("tile", "tile");
    if (!groundTiles) {
      throw new Error(
        "タイル画像をマップデータに反映させることができませんでした"
      );
    }
    return this.tilemap.createLayer(
      layerID,
      tileset ? tileset : groundTiles,
      x,
      y
    );
  }
}
