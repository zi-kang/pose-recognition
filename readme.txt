简单示例


此sample仅仅只是打开摄像头完成姿态请求的过程，未详尽考虑Android、iOS等平台的兼容，样式并不美观。

主要步骤分为：

1. 列出设备上所有的摄像头

2. 打开摄像头

3. 截取摄像头图像，并生成签名，请求到服务端（可手动一次次请求，也可自动每秒钟一次请求）

4. 处理识别结果（动态生成canvas标签，并将识别结果返回来的6个点连接起来展示）


展示：
   1、可以直接访问 https://webar-hzk.easyar.cn/webar/pose.html 进行展示
   2、本地如果不配置https域名的话可以使用http:127.0.0.1:8080/  进行访问index.html文件，若配置了则index.html和pose.html都可以直接访问


配置跨域请求（nginx）:

  location /pose {
            rewrite  ^/search/(.*)$ /$1 break;
            proxy_pass   https://pose.wap.easyar.com/pose;
          }


注：反向代理'/pose'主要是因为recognition.js请求的api时'/pose'，可根据实际需要自行更改


说明：
    一、打开摄像头的方式采用的是官网webar文档里面提到的方式；
    二、签名认证，服务端请求以及处理识别请求结果请参考'asset/js'文件加下面的app.js, pose.js, recognition.js，里面每一步都会有解释，此处不再重复叙述

关于返回结果的说明：

    1、需要判断一下返回结果中的statusCode是否等于0，等于0的时候是正常的，此sample并未判断，可在recognition.js中自行参考，有详细解释
    2、如果打开的是前置摄像头，安卓和苹果的镜像正好相反需要自行判断一下返回来的结果中的左右，后置摄像头都一致

