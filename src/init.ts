import { uuid } from "./main";

export function init() {
  let ws: WebSocket;
  let acceleration: { x: number; y: number; z: number } | null = null;

  const deviceMotionRequest = () => {
    // @ts-ignore
    if (DeviceMotionEvent.requestPermission) {
      // @ts-ignore
      DeviceMotionEvent.requestPermission().then((permissionState: string) => {
        if (permissionState === "granted") {
          document.getElementById("button")?.remove();

          window.addEventListener(
            "devicemotion",
            (event: DeviceMotionEvent) => {
              if (!event.accelerationIncludingGravity) {
                return;
              }
              acceleration = {
                x: event.accelerationIncludingGravity.x ?? 0,
                y: event.accelerationIncludingGravity.y ?? 0,
                z: event.accelerationIncludingGravity.z ?? 0,
              };
            }
          );
        }
      });
    }
  };

  // スマートフォンの場合のみ、WebSocketにつなぎ、ボタンを表示する
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    ws = new WebSocket(`wss://cloud.achex.ca/${uuid}`);

    // WebSocketの接続が確立したとき、認証を行う
    ws.onopen = () => {
      ws.send(JSON.stringify({ auth: "smartphone", password: "1234" }));
    };

    const div = document.getElementById("smartphone-button");

    const button = document.createElement("button");
    button.setAttribute("id", "button");
    button.addEventListener("click", deviceMotionRequest);
    button.classList.add("button");
    button.innerText = "スマホで操作する";

    div?.appendChild(button);
  }

  setInterval(() => {
    if (acceleration) {
      ws.send(
        JSON.stringify({ id: "id", to: "game", message: { acceleration } })
      );
    }
  }, 400);
}
