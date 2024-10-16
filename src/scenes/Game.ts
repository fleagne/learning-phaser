import { Scene } from "phaser";
import { Constants } from "../components/constants";
import EnemiesGroup from "../components/enemies/enemiesGroup";
import Player from "../components/player/player";

export class Game extends Scene {
  map: Phaser.Tilemaps.Tilemap;
  groundLayer: Phaser.Tilemaps.TilemapLayer | null;
  player: Player;
  enemiesGroup: EnemiesGroup;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  key: Phaser.GameObjects.Text;
  leftKey: number;

  constructor() {
    super("Game");
  }

  init() {
    // 初期の鍵の数を定義
    this.leftKey = 6;
  }

  preload() {
    // Nothing
  }

  create() {
    this.createMap();

    this.cursors = this.input.keyboard?.createCursorKeys();

    this.player = new Player(this, 0, 1);
    this.enemiesGroup = new EnemiesGroup(this, this.map, this.groundLayer!);

    // 衝突判定
    this.physics.add.collider(this.groundLayer!, this.player);
    this.physics.add.collider(this.groundLayer!, this.enemiesGroup);

    // プレイヤーと敵の衝突判定
    this.physics.add.overlap(this.player, this.enemiesGroup, () => {
      this.scene.start("GameOver");
    });

    this.key = this.add.text(
      (this.game.config.width as number) - 112,
      16,
      `残りの鍵: ${this.leftKey}`,
      { font: "16px Courier" }
    );
  }

  update() {
    // プレイヤー側の移動判定
    if (!this.cursors) return;

    // 左移動時の処理
    if (this.input.keyboard?.checkDown(this.cursors.left, 300)) {
      const tile = this.groundLayer?.getTileAtWorldXY(
        this.player.x - Constants.TILE_SIZE,
        this.player.y,
        true
      );
      if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
        this.player.x -= Constants.TILE_SIZE;
        this.player.anims.play("left", true);
      }
      if (tile?.index === 12) {
        this.cameras.main.pan(0, 0, 500, "Power2");
        this.key.setPosition((this.game.config.width as number) - 112, 16);
        this.player.x -= Constants.TILE_SIZE;
        this.player.anims.play("left", true);
      }
      if (tile?.index === 13) {
        this.key.setText(`残りの鍵: ${--this.leftKey}`);
        this.map.replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 右移動時の処理
    } else if (this.input.keyboard?.checkDown(this.cursors.right, 300)) {
      const tile = this.groundLayer?.getTileAtWorldXY(
        this.player.x + Constants.TILE_SIZE,
        this.player.y,
        true
      );
      if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
        this.player.x += Constants.TILE_SIZE;
        this.player.anims.play("right", true);
      }
      if (tile?.index === 12) {
        this.cameras.main.pan(this.map.widthInPixels, 0, 500, "Power2");
        this.key.setPosition(this.map.widthInPixels - 112, 16);
        this.player.x += Constants.TILE_SIZE;
        this.player.anims.play("right", true);
      }
      if (tile?.index === 13) {
        this.key.setText(`残りの鍵: ${--this.leftKey}`);
        this.map.replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 上移動時の処理
    } else if (this.input.keyboard?.checkDown(this.cursors.up, 300)) {
      const tile = this.groundLayer?.getTileAtWorldXY(
        this.player.x,
        this.player.y - Constants.TILE_SIZE,
        true
      );
      if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
        this.player.y -= Constants.TILE_SIZE;
        this.player.anims.play("up", true);
      }
      if (tile?.index === 13) {
        this.key.setText(`残りの鍵: ${--this.leftKey}`);
        this.map.replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 下移動時の処理
    } else if (this.input.keyboard?.checkDown(this.cursors.down, 300)) {
      const tile = this.groundLayer?.getTileAtWorldXY(
        this.player.x,
        this.player.y + Constants.TILE_SIZE,
        true
      );
      if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
        this.player.y += Constants.TILE_SIZE;
        this.player.anims.play("down", true);
      }
      if (tile?.index === 13) {
        this.key.setText(`残りの鍵: ${--this.leftKey}`);
        this.map.replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }
    } else {
      // this.player.anims.stop();
    }

    // 鍵をすべて集めたら、扉を消す
    if (this.leftKey === 0) {
      this.map.replaceByIndex(78, 0);
    }
  }

  createMap() {
    // マップ表示
    // JSON形式のマップデータの読み込み Tilemapオブジェクトの作成
    this.map = this.make.tilemap({ key: "map01" });

    // 表示範囲外のオブジェクトも描写されるようにする処理
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // タイル画像をマップデータに反映する Tilesetオブジェクトの作成
    const groundTiles = this.map.addTilesetImage("tile", "tile");
    if (!groundTiles) {
      throw new Error(
        "タイル画像をマップデータに反映させることができませんでした"
      );
    }

    // 地面レイヤー作成 DynamicTilemapLayerオブジェクト作成
    const layerWidth = Constants.TILE_SIZE * 1 * 24;
    const layerHeight = Constants.TILE_SIZE * 1 * 12;

    this.groundLayer = this.map.createLayer("stage", groundTiles, 0, 0);
    this.groundLayer?.setDisplaySize(layerWidth, layerHeight);
    this.groundLayer?.setCollisionByExclusion(
      Constants.EXCLUDE_COLLIDE_INDEXES
    );
  }
}
