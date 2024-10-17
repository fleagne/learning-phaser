import { Scene } from "phaser";
import { Constants } from "../components/constants";
import EnemiesGroup from "../components/enemies/enemiesGroup";
import Map from "../components/map";
import Player from "../components/player/player";

export class Game extends Scene {
  map: Map;
  groundLayer: Phaser.Tilemaps.TilemapLayer | null;
  player: Player;
  enemiesGroup: EnemiesGroup;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  key: Phaser.GameObjects.Text;
  leftKey: number;
  accelerationText: Phaser.GameObjects.Text;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;

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
    this.map = new Map(this, "map01");
    this.groundLayer = this.map.createLayer("stage");
    if (!this.groundLayer) {
      throw new Error("Phaser.Tilemaps.TilemapLayer を作成できませんでした。");
    }

    this.groundLayer.setDisplaySize(
      Constants.TILE_SIZE * 1 * 24,
      Constants.TILE_SIZE * 1 * 12
    );

    this.groundLayer.setCollisionByExclusion(Constants.EXCLUDE_COLLIDE_INDEXES);

    // キーボードによる入力を受け付けられるようにする
    this.cursors = this.input.keyboard?.createCursorKeys();

    // プレイヤーの作成
    this.player = new Player(this, 0, 1);

    // 敵の作成
    this.enemiesGroup = new EnemiesGroup(
      this,
      this.map.getTilemap(),
      this.groundLayer
    );

    // 衝突判定
    this.physics.add.collider(this.groundLayer, this.player);
    this.physics.add.collider(this.groundLayer, this.enemiesGroup);

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

    // iPhoneから加速度情報を表示する
    const socket = new WebSocket("wss://192.168.0.3:8081");
    socket.onopen = () => {
      console.log("WebSocket connection established");
      // 必要なデータを送信する処理など
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.accelerationText = this.add.text(
      (this.game.config.width as number) - 224,
      64,
      "Acceleration:",
      { font: "16px Courier" }
    );
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.updateAccelerationText(data);
    };
  }

  update() {
    // プレイヤー側の移動判定
    if (!this.cursors) return;

    // 左移動時の処理
    if (
      this.input.keyboard?.checkDown(this.cursors.left, 300) ||
      this.accelerationX <= -5
    ) {
      this.accelerationX = 0;
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
        this.map
          .getTilemap()
          .replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 右移動時の処理
    } else if (
      this.input.keyboard?.checkDown(this.cursors.right, 300) ||
      this.accelerationX >= 5
    ) {
      this.accelerationX = 0;
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
        this.map
          .getTilemap()
          .replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 上移動時の処理
    } else if (
      this.input.keyboard?.checkDown(this.cursors.up, 300) ||
      this.accelerationZ <= -5
    ) {
      this.accelerationZ = 0;
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
        this.map
          .getTilemap()
          .replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 下移動時の処理
    } else if (
      this.input.keyboard?.checkDown(this.cursors.down, 300) ||
      this.accelerationZ >= 5
    ) {
      this.accelerationZ = 0;
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
        this.map
          .getTilemap()
          .replaceByIndex(tile.index, 0, tile.x, tile.y, 1, 1);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }
    } else {
      // this.player.anims.stop();
    }

    // 鍵をすべて集めたら、扉を消す
    if (this.leftKey === 0) {
      this.map.getTilemap().replaceByIndex(78, 0);
    }
  }

  updateAccelerationText(acceleration: { x: number; y: number; z: number }) {
    // 受信した加速度情報を表示
    this.accelerationText.setText(
      `Acceleration:\nX: ${acceleration.x.toFixed(
        2
      )}\nY: ${acceleration.y.toFixed(2)}\nZ: ${acceleration.z.toFixed(2)}`
    );
    this.accelerationX = Math.floor(acceleration.x);
    this.accelerationY = Math.floor(acceleration.y);
    this.accelerationZ = Math.floor(acceleration.z);
  }
}
