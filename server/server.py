import asyncio
import websockets
import ssl
import json
import logging

# ログ設定
logging.basicConfig(level=logging.DEBUG)

CERTFILE = "./localhost.pem"

clients = set()


async def handle_client(websocket, path):
    logging.info(f"Connection attempt from {websocket.remote_address}")

    try:
        # WebSocket handshakeが成功したことを確認
        await websocket.ping()
        logging.info("Ping successful")

        clients.add(websocket)
        logging.info(f"Client added. Total clients: {len(clients)}")

        try:
            async for message in websocket:
                logging.info(f"Received message: {message}")
                for client in clients:
                    if client != websocket and client.open:
                        try:
                            await client.send(message)
                            logging.info("Message forwarded")
                        except Exception as e:
                            logging.error(f"Error sending message: {e}")
        except websockets.exceptions.ConnectionClosed as e:
            logging.info(f"Connection closed: {e}")
        except Exception as e:
            logging.error(f"Error in message loop: {e}")
    except Exception as e:
        logging.error(f"Error in connection: {e}")
    finally:
        clients.remove(websocket)
        logging.info(f"Client removed. Total clients: {len(clients)}")


ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(CERTFILE)

# より寛容なSSL設定（開発時のみ）
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE


async def main():
    logging.info("Starting WebSocket server on 0.0.0.0:8081")
    async with websockets.serve(
        handle_client,
        "0.0.0.0",
        8081,
        ssl=ssl_context,
        ping_interval=None,  # ping/pongを無効化
        compression=None,  # 圧縮を無効化
    ):
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Server stopped by user")
    except Exception as e:
        logging.error(f"Server error: {e}")
