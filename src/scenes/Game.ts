import { Scene } from "phaser";

export class Game extends Scene {
  map: Phaser.Tilemaps.Tilemap;
  mapOriginX: number;
  mapOriginY: number;
  groundLayer: Phaser.Tilemaps.TilemapLayer | null;
  excludeCollideIndexes: number[];
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  dx: number;
  dy: number;
  enemy1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemy1IsMovingRight: boolean;
  enemy2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  enemy2IsMovingRight: boolean;
  key: Phaser.GameObjects.Text;
  leftKey: number;

  constructor() {
    super("Game");
  }

  init() {
    // プレイヤーの移動量を定義
    this.dx = 64;
    this.dy = 64;

    // 敵の移動向きを定義
    this.enemy1IsMovingRight = true;
    this.enemy2IsMovingRight = true;

    // 初期の鍵の数を定義
    this.leftKey = 6;
  }

  preload() {
    this.load.setPath("assets");

    // タイル画像
    this.load.spritesheet("tile", "images/sokoban_tilesheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // 敵の画像
    this.load.spritesheet("enemy", "images/slime.png", {
      frameWidth: 112,
      frameHeight: 68,
    });

    // 鍵の画像
    this.load.spritesheet("key", "images/key.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // マップのJSONファイルの読み込み
    this.load.tilemapTiledJSON("map01", "data/map01.json");
  }

  create() {
    this.createMap();
    this.createPlayer();
    this.createEnemy1(7, 1);
    this.createEnemy2(4, 7);

    // 敵1の移動制御
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        const tile = this.groundLayer?.getTileAtWorldXY(
          this.enemy1IsMovingRight
            ? this.enemy1.x + this.dx
            : this.enemy1.x - this.dx,
          this.enemy1.y,
          true
        );
        if (this.excludeCollideIndexes.includes(tile?.index as number)) {
          this.enemy1IsMovingRight
            ? (this.enemy1.x += this.dx)
            : (this.enemy1.x -= this.dx);
        } else {
          this.enemy1IsMovingRight = !this.enemy1IsMovingRight;
          this.enemy1IsMovingRight
            ? (this.enemy1.x += this.dx)
            : (this.enemy1.x -= this.dx);
        }
      },
      callbackScope: this,
      loop: true,
    });

    // 敵2の移動制御
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        const tile = this.groundLayer?.getTileAtWorldXY(
          this.enemy2IsMovingRight
            ? this.enemy2.x + this.dx
            : this.enemy2.x - this.dx,
          this.enemy2.y,
          true
        );
        if (this.excludeCollideIndexes.includes(tile?.index as number)) {
          this.enemy2IsMovingRight
            ? (this.enemy2.x += this.dx)
            : (this.enemy2.x -= this.dx);
        } else {
          this.enemy2IsMovingRight = !this.enemy2IsMovingRight;
          this.enemy2IsMovingRight
            ? (this.enemy2.x += this.dx)
            : (this.enemy2.x -= this.dx);
        }
      },
      callbackScope: this,
      loop: true,
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
        this.player.x - this.dx,
        this.player.y,
        true
      );
      if (this.excludeCollideIndexes.includes(tile?.index as number)) {
        this.player.x -= this.dx;
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
        this.player.x + this.dx,
        this.player.y,
        true
      );
      if (this.excludeCollideIndexes.includes(tile?.index as number)) {
        this.player.x += this.dx;
        this.player.anims.play("right", true);
      }
      if (tile?.index === 13) {
        this.key.setText(`残りの鍵: ${--this.leftKey}`);
        console.log(tile);
        this.map.replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 上移動時の処理
    } else if (this.input.keyboard?.checkDown(this.cursors.up, 300)) {
      const tile = this.groundLayer?.getTileAtWorldXY(
        this.player.x,
        this.player.y - this.dy,
        true
      );
      if (this.excludeCollideIndexes.includes(tile?.index as number)) {
        this.player.y -= this.dy;
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
        this.player.y + this.dy,
        true
      );
      if (this.excludeCollideIndexes.includes(tile?.index as number)) {
        this.player.y += this.dy;
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

    if (this.player.x === this.enemy1.x && this.player.y === this.enemy1.y) {
      this.scene.start("GameOver");
    }
    if (this.player.x === this.enemy2.x && this.player.y === this.enemy2.y) {
      this.scene.start("GameOver");
    }
  }

  createMap() {
    // マップ表示
    // JSON形式のマップデータの読み込み Tilemapオブジェクトの作成
    this.map = this.make.tilemap({ key: "map01" });

    // タイル画像をマップデータに反映する Tilesetオブジェクトの作成
    const groundTiles = this.map.addTilesetImage("tile", "tile");
    if (!groundTiles) {
      throw new Error(
        "タイル画像をマップデータに反映させることができませんでした"
      );
    }

    // 地面レイヤー作成 DynamicTilemapLayerオブジェクト作成
    const layerWidth = 64 * 1 * 12;
    const layerHeight = 64 * 1 * 12;

    // ゲーム画面の幅・高さを取得
    const gameWidth = this.game.config.width as number;
    const gameHeight = this.game.config.height as number;

    // 画面中央のX座標
    this.mapOriginX = (gameWidth - layerWidth) / 2;
    // 画面中央のY座標
    this.mapOriginY = (gameHeight - layerHeight) / 2;

    this.groundLayer = this.map.createLayer(
      "stage",
      groundTiles,
      this.mapOriginX,
      this.mapOriginY
    );
    this.groundLayer?.setDisplaySize(layerWidth, layerHeight);

    // 衝突判定から除外したいタイルのインデックスを配列で指定する
    // "-1" は空のタイルなので衝突しない。それ以外は衝突する
    // "13" は鍵のタイルなので衝突しない
    // "14" はゴールのタイルなので衝突しない
    this.excludeCollideIndexes = [-1, 0, 13, 14];
    this.groundLayer?.setCollisionByExclusion(this.excludeCollideIndexes);
  }

  createPlayer() {
    // プレイヤー作成
    this.player = this.physics.add.sprite(
      this.mapOriginX + 32,
      this.mapOriginY + 64 + 32,
      "tile"
    );

    // 衝突サイズの調整
    // プレイヤーのサイズ変更
    this.player.setDisplaySize(64, 64);

    // プレイヤーの最初の向きは右
    this.player.setFrame(52);

    // プレイヤーの衝突時のバウンス設定
    this.player.setBounce(0);

    // プレイヤーがゲームワールドの外に出ないように衝突させる
    this.player.setCollideWorldBounds(true);

    // プレイヤーが地面レイヤーと衝突する設定
    this.physics.add.collider(this.player, this.groundLayer!);

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

    this.cursors = this.input.keyboard?.createCursorKeys();
  }

  createEnemy1(x: number, y: number) {
    // 敵キャラ作成
    this.enemy1 = this.physics.add.sprite(
      this.mapOriginX + 64 * x + 32,
      this.mapOriginY + 64 * y + 32,
      "enemy"
    );

    // 衝突サイズの調整
    // 敵キャラのサイズ変更
    this.enemy1.setDisplaySize(64, 64);

    // 敵キャラのフレームを指定
    this.enemy1.setFrame(0);

    // 敵キャラの衝突時のバウンス設定
    this.enemy1.setBounce(0);

    // 敵キャラがゲームワールドの外に出ないように衝突させる
    this.enemy1.setCollideWorldBounds(true);

    // 敵キャラが地面レイヤーと衝突する設定
    this.physics.add.collider(this.enemy1, this.groundLayer!);

    this.anims.create({
      key: "crawl",
      frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 4 }),
      frameRate: 2,
      yoyo: true,
      repeat: -1,
    });
    this.enemy1.anims.play("crawl");
  }

  createEnemy2(x: number, y: number) {
    // 敵キャラ作成
    this.enemy2 = this.physics.add.sprite(
      this.mapOriginX + 64 * x + 32,
      this.mapOriginY + 64 * y + 32,
      "enemy"
    );

    // 衝突サイズの調整
    // 敵キャラのサイズ変更
    this.enemy2.setDisplaySize(64, 64);

    // 敵キャラのフレームを指定
    this.enemy2.setFrame(0);

    // 敵キャラの衝突時のバウンス設定
    this.enemy2.setBounce(0);

    // 敵キャラがゲームワールドの外に出ないように衝突させる
    this.enemy2.setCollideWorldBounds(true);

    // 敵キャラが地面レイヤーと衝突する設定
    this.physics.add.collider(this.enemy2, this.groundLayer!);

    this.anims.create({
      key: "crawl",
      frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 4 }),
      frameRate: 2,
      yoyo: true,
      repeat: -1,
    });
    this.enemy2.anims.play("crawl");
  }
}
