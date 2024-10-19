import { Scene } from "phaser";
import { Constants } from "../components/constants";
import EnemiesGroup from "../components/enemies/enemiesGroup";
import KeySprite from "../components/keys/key";
import KeysGroup from "../components/keys/keysGroup";
import Map from "../components/map";
import Player from "../components/player/player";
import { uuidGame, uuidWebSocket } from "../main";

export class Game extends Scene {
  map: Map;
  groundLayer: Phaser.Tilemaps.TilemapLayer | null;
  player: Player;
  enemiesGroup: EnemiesGroup;
  keysGroup: KeysGroup;
  leftKeys: number;
  leftKeysDivElement: HTMLElement | null;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;

  constructor() {
    super("Game");
  }

  init() {}

  preload() {}

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

    // 鍵の作成
    this.keysGroup = new KeysGroup(this, this.map.getTilemap());

    // 鍵の残りの数を定義
    this.leftKeys = this.keysGroup.getLength();

    // 残りの鍵の表示をする
    this.leftKeysDivElement = document.getElementById("left-keys");

    // 衝突判定
    this.physics.add.collider(this.groundLayer, this.player);
    this.physics.add.collider(this.groundLayer, this.enemiesGroup);

    // プレイヤーと敵の衝突判定
    this.physics.add.overlap(this.player, this.enemiesGroup, () => {
      this.scene.start("GameOver");
    });

    // プレイヤーと鍵の衝突判定
    this.physics.add.overlap(this.player, this.keysGroup, (_, key) => {
      if (key instanceof KeySprite && !key.collecting) {
        key.collect();
        this.leftKeys -= 1;
      }
    });

    // スマートフォンでアクセスしている場合は、WebSocketサーバにアクセスし、加速度情報を取得する
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      const ws = new WebSocket(`wss://cloud.achex.ca/${uuidWebSocket}`);
      ws.onopen = () => {
        ws.send(JSON.stringify({ auth: uuidGame, password: "1234" }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.updateAcceleration(data.message.acceleration);
      };

      const button = document.getElementById("button");
      if (button) {
        const addElemAcceleration = document.createElement("div");
        addElemAcceleration.setAttribute("id", "acceleration");
        addElemAcceleration.innerText = `Acceleration:\nX: ${this.accelerationX}\nY: ${this.accelerationY}\nZ: ${this.accelerationZ}`;
        button.parentNode?.insertBefore(
          addElemAcceleration,
          button.nextElementSibling
        );

        const addElemExplanation = document.createElement("div");
        addElemExplanation.innerText =
          "端末の角度によって、キャラクターを動かせます\nXが-2以下:左  Xが2以上:右\nZが-9以下:上  Zが-2以上:下\n";
        button.parentNode?.insertBefore(
          addElemExplanation,
          button.nextElementSibling
        );
      }
    }
  }

  update() {
    // プレイヤー側の移動判定
    if (!this.cursors) return;

    // 左移動時の処理
    if (
      this.input.keyboard?.checkDown(this.cursors.left, 300) ||
      this.accelerationX <= -2
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
        this.player.x -= Constants.TILE_SIZE;
        this.player.anims.play("left", true);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 右移動時の処理
    } else if (
      this.input.keyboard?.checkDown(this.cursors.right, 300) ||
      this.accelerationX >= 2
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
        this.player.x += Constants.TILE_SIZE;
        this.player.anims.play("right", true);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 上移動時の処理
    } else if (
      this.input.keyboard?.checkDown(this.cursors.up, 300) ||
      this.accelerationZ <= -9
    ) {
      this.accelerationZ = -5;
      const tile = this.groundLayer?.getTileAtWorldXY(
        this.player.x,
        this.player.y - Constants.TILE_SIZE,
        true
      );
      if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
        this.player.y -= Constants.TILE_SIZE;
        this.player.anims.play("up", true);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }

      // 下移動時の処理
    } else if (
      this.input.keyboard?.checkDown(this.cursors.down, 300) ||
      this.accelerationZ >= -2
    ) {
      this.accelerationZ = -5;
      const tile = this.groundLayer?.getTileAtWorldXY(
        this.player.x,
        this.player.y + Constants.TILE_SIZE,
        true
      );
      if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
        this.player.y += Constants.TILE_SIZE;
        this.player.anims.play("down", true);
      }
      if (tile?.index === 14) {
        this.scene.start("GameClear");
      }
    } else {
      // this.player.anims.stop();
    }

    this.leftKeysDivElement!.innerText = `残りの鍵: ${this.leftKeys}`;

    // 鍵をすべて集めたら、扉を消す
    if (this.leftKeys === 0) {
      this.map.getTilemap().replaceByIndex(78, 0);
    }
  }

  updateAcceleration(acceleration: { x: number; y: number; z: number }) {
    // 受信した加速度情報を表示
    this.accelerationX = Math.floor(acceleration.x);
    this.accelerationY = Math.floor(acceleration.y);
    this.accelerationZ = Math.floor(acceleration.z);

    const accelerationElem = document.getElementById("acceleration");
    if (accelerationElem) {
      accelerationElem.innerText = `Acceleration:\nX: ${this.accelerationX}\nY: ${this.accelerationY}\nZ: ${this.accelerationZ}`;
    }
  }
}
