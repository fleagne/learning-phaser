export default class SpeechBubble {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string;
  bubble: Phaser.GameObjects.Graphics;
  bubbleText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.text = text;
    this.bubble = this.createBubble();
    this.bubbleText = this.createBubbleText();
    this.hideBubble();
  }

  createBubble(): Phaser.GameObjects.Graphics {
    const bubble = this.scene.add.graphics({ x: this.x, y: this.y });
    const width = this.text.length * 16 + 20
    bubble.fillStyle(0xffffff, 1);
    bubble.fillRoundedRect(0, 0, width, 40, 16);
    return bubble;
  }

  createBubbleText(): Phaser.GameObjects.Text {
    const text = this.scene.add.text(this.x + 15, this.y + 10, this.text, {
      fontSize: "16px",
      color: "#000000",
      // 文字が途切れてしまうため
      padding: { top: 5 },
    });
    return text;
  }

  updatePosition(newX: number, newY: number): void {
    this.bubble.x = newX;
    this.bubble.y = newY;
    this.bubbleText.x = newX + 20;
    this.bubbleText.y = newY + 10;
  }

  showBubble(): void {
    this.bubble.setVisible(true);
    this.bubbleText.setVisible(true);
    this.scene.time.delayedCall(1000, this.hideBubble, [], this);
  }

  hideBubble(): void {
    this.bubble.setVisible(false);
    this.bubbleText.setVisible(false);
  }
}
