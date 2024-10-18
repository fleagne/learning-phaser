# Learning Phaser
Learning to develop games using Phaser3


## 🎮 Let's play the Game!
https://d1mbl2iqjrkpy1.cloudfront.net


## 🤖 Technical Element
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white&style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white&style=flat")
![pnpm](https://img.shields.io/badge/pnpm-yellow?style=for-the-badge&logo=pnpm&logoColor=white&style=flat)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-web-services&logoColor=white&style=flat)
![Phaser](https://cdn.phaser.io/images/logo/phaser-pixel-medium-flat.png)


## ⚙️ Install
```bash
cd frontend
pnpm install
pnpm run dev
```

The producer is using WSL2 and developing on Ubuntu-22.04.


### 🛠️ Build a Local Development Environment
Because of security reasons, it is not possible to get acceleration information of the terminal if it is http, so it is necessary to run it on an https server.

Therefore, we use `@vitejs/plugin-basic-ssl` to set up a simple https server.

To access the local development environment from a smartphone, port forwarding is required, so this section describes the procedure.


#### Find the IPv4 address of the PC using the command prompt
```bash
ipconfig
```

Maybe you can find something like this.

> 192.168.0.3

#### Check WSL's internal IP
```bash
ip addr
```

What you need to reference is `inet` in `eth0`. In my case it looks like this

> 172.18.38.254

#### Open PowerShell with administrative privileges and do port forwarding
```shell
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=172.18.38.254
```

The status of port forwarding can be checked with the following command

```shell
netsh interface portproxy show all
```

To remove port forwarding, run the following command

```shell
netsh interface portproxy delete v4tov4 listenport=8080 listenaddress=0.0.0.0
```

If you cannot access the port 8080 by Firewall, set the port for inbound communication (inward).

Now, if the smartphone is on the same network as the PC, it will be able to connect using the PC's IP address:port.

#### Access a local server on your PC from your smartphone to play games
```bash
https://192.168.0.3:8080/
```


## ⚡️ Deploy
### Application
Push to main branch, GitHub Actions will deploy automatically.

This is because, although we updated the static files in the S3 bucket, the CloudFront distribution we access our website from has cached the static files and served the cached pages.

The thing to do is to invalidate the cache on the CloudFront distribution every time you update the static files in the S3 bucket.

### Infrastructure
#### First time
```bash
cd infra
cdk bootstrap
cdk synth
cdk deploy
```

#### Second time and later
```bash
cd infra
cdk synth
cdk deploy
```

#### Delete infrastructure
```bash
cd infra
cdk destroy
```


## 🧬 Libraries
| tool | version |
| --- | --- |
| nvm | 0.39.7 |
| node | v20.17.0 |
| npm | 10.8.2 |
| pnpm | 9.9.0 |
| aws | 2.18.9 |
| cdk | 2.162.1 |


## 🎯 Functions
- Play HTML5 Game
- Move player with your Smartphone


## 💡 Thoughts
- Learning game programming
- Learning Phaser 3
- Learning AWS


## ⚠️ Restriction
Nothing to do


## 👍 Contribution
Welcome anytime


## 📄 Lisence
MIT
