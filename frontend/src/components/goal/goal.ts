import { Scene } from "phaser";
import GoalClass from "./goalClass";

class GoalSprite extends GoalClass {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "tile");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}

export default class Goal extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene);

    // "14" はゴールを表す
    const goalTypes = map.filterTiles(
      (tile: Phaser.Tilemaps.Tile) => tile.index === 14
    );

    let goals: Array<GoalSprite> = [];
    goalTypes?.forEach((goal) => {
      goals.push(new GoalSprite(scene, goal.x, goal.y));
    });
    this.addMultiple(goals);
  }
}
