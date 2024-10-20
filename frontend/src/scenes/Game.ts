import { Scene } from "phaser";
import { Constants } from "../components/constants";
import Controls from "../components/controls/controls";
import EnemiesGroup from "../components/enemies/enemiesGroup";
import Goal from "../components/goal/goal";
import KeySprite from "../components/keys/key";
import KeysGroup from "../components/keys/keysGroup";
import Map from "../components/map";
import PickaxeSprite from "../components/pickaxes/pickaxes";
import PickaxesGroup from "../components/pickaxes/pickaxesGroup";
import Player from "../components/player/player";
// import { uuidGame, uuidWebSocket } from "../main";

export class Game extends Scene {
  map: Map;
  groundLayer: Phaser.Tilemaps.TilemapLayer | null;
  player: Player;
  goal: Goal;
  enemiesGroup: EnemiesGroup;
  keysGroup: KeysGroup;
  getKeys: number = 0;
  leftKeys: number;
  leftKeysDivElement: HTMLElement | null;
  pickaxesGroup: PickaxesGroup;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  controls?: Controls;
  // acceleration?: { x: number; y: number; z: number };

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

    // 非衝突のオブジェクトを設定する
    this.groundLayer.setCollisionByExclusion(Constants.EXCLUDE_COLLIDE_INDEXES);

    // キーボードによる入力を受け付けられるようにする
    this.cursors = this.input.keyboard?.createCursorKeys();

    // コントローラーによる入力を受け付けられるようにする
    this.controls = new Controls(this);

    // プレイヤーの作成
    this.player = new Player(this, 0, 1);

    // ゴールの作成
    this.goal = new Goal(this, this.map.getTilemap());

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

    // 残りの鍵の表示をするためのエレメントを取得
    this.leftKeysDivElement = document.getElementById("left-keys");
    this.leftKeysDivElement!.innerText = `取得した鍵: [ ${"⚪ ".repeat(
      this.leftKeys
    )}]`;

    // ピッケルの作成
    this.pickaxesGroup = new PickaxesGroup(this, this.map.getTilemap());

    // 衝突判定
    this.physics.add.collider(this.groundLayer, this.player);
    this.physics.add.collider(this.groundLayer, this.enemiesGroup);

    // プレイヤーと敵の衝突判定
    this.physics.add.overlap(this.player, this.enemiesGroup, () => {
      this.player.damage(1);
      this.player.showHP();
    });

    // プレイヤーと鍵の衝突判定
    this.physics.add.overlap(this.player, this.keysGroup, (_, key) => {
      if (key instanceof KeySprite && !key.collecting) {
        key.collect();
        this.leftKeys -= 1;
        this.getKeys += 1;
        this.leftKeysDivElement!.innerText = `取得した鍵: [ ${"🔑 ".repeat(
          this.getKeys
        )}${"⚪ ".repeat(this.leftKeys)}]`;
        // 鍵をすべて集めたら、扉を消す
        if (this.leftKeys === 0) {
          this.map.getTilemap().replaceByIndex(78, 0);
        }
      }
    });

    // プレイヤーとピッケルの衝突判定
    this.physics.add.overlap(this.player, this.pickaxesGroup, (_, pickaxe) => {
      if (pickaxe instanceof PickaxeSprite && !pickaxe.collecting) {
        pickaxe.collect(this.pickaxesGroup);
      }
    });

    // プレイヤーとゴールの衝突判定
    this.physics.add.overlap(this.player, this.goal, () => {
      this.scene.start("GameClear");
    });

    // スマートフォンでアクセスしている場合は、WebSocketサーバにアクセスし、加速度情報を取得する
    // if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    //   const ws = new WebSocket(`wss://cloud.achex.ca/${uuidWebSocket}`);
    //   ws.onopen = () => {
    //     ws.send(JSON.stringify({ auth: uuidGame, password: "1234" }));
    //   };

    //   ws.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     this.updateAcceleration(data.message.acceleration);
    //   };
    // }
  }

  update() {
    if (!this.cursors || !this.controls || !this.groundLayer) return;

    // プレイヤーの移動判定
    this.player.update(
      this,
      this.cursors,
      this.controls,
      this.map.getTilemap(),
      this.groundLayer,
      this.pickaxesGroup
    );

    // コントローラーの初期化処理
    this.controls.update();

    // プレイヤーの体力が0になったら、ゲームオーバー
    if (this.player.hp === 0) {
      this.scene.start("GameOver");
    }
  }

  // updateAcceleration(acceleration: { x: number; y: number; z: number }) {
  //   // 受信した加速度情報を表示
  //   this.acceleration = {
  //     x: Math.floor(acceleration.x),
  //     y: Math.floor(acceleration.y),
  //     z: Math.floor(acceleration.z),
  //   };

  //   const accelerationElem = document.getElementById("acceleration");
  //   if (accelerationElem) {
  //     accelerationElem.innerText = `Acceleration:\nX: ${this.acceleration.x}\nY: ${this.acceleration.y}\nZ: ${this.acceleration.z}`;
  //   }
  // }
}
