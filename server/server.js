const express = require('express');
const request = require('request');
const admin = require('firebase-admin');
const app = express();

// 初始化 Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

app.get('/callback', (req, res) => {
  const code = req.query.code;
  const appid = 'wx49015d02a87112cb';
  const secret = 'YOUR_APP_SECRET';  // 将此替换为你的微信AppSecret

  // 使用code获取access_token和openid
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
  request.get(url, (err, response, body) => {
    if (err) return res.status(500).send(err);

    const data = JSON.parse(body);
    const openid = data.openid;

    // 使用openid创建Firebase自定义令牌
    admin.auth().createCustomToken(openid)
      .then((customToken) => {
        res.redirect(`https://psyfookyuen.com?token=${customToken}`);
      })
      .catch((error) => {
        res.status(500).send("创建自定义令牌时出错：" + error);
      });
  });
});

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务器正在端口 ${port} 运行`);
});
