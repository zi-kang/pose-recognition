/**
 *打开摄像头操作
 *生成签名操作
 *向服务端发起请求
 *生成签名所需要的key和secret分别使用test_app_key和test_app_secret，不需要更改
 */

const pose = new Pose();
let isAuto = false, //判断自动识别条件
    timer = null; //全局定时器，自动识别会用到

//打开摄像头
document.querySelector('#openCamera').addEventListener('click', function () {
    const videoSetting = {width: 320, height: 240};
    const video = document.querySelector('#video');
    video.setAttribute('width', videoSetting.width.toString() + 'px');

    const videoDevice = document.querySelector('#videoDevice');

    const openCamera = (video, deviceId, videoSetting) => {
        pose.openCamera(video, deviceId, videoSetting)
            .then((msg) => {
                //打开摄像头成功

            })
            .catch((err) => {
                alert(err);
                alert('打开视频设置失败');
            });
    };

    // 列出视频设备
    pose.listCamera(videoDevice)
        .then(() => {
            openCamera(video, videoDevice[0].value, videoSetting);
            videoDevice.onchange = () => {
                openCamera(video, videoDevice.value, videoSetting);
            };

            document.querySelector('#openCamera').style.display = 'none';
            document.querySelector('#start').style.display = 'inline-block';
            document.querySelector('#autoStart').style.display = 'inline-block';
        })
        .catch((err) => {
            console.info(err);
            alert('没有可使用的视频设备');
        });
}, false);

//获取签名并向服务端发起请求
function getSignAndSearch() {
    //获取签名
    let params = signParams({image: pose.captureVideo()}, 'test_app_key', 'test_app_secret');
    console.log('识别开始');
    console.log(params);
    //向服务端发起请求
    recognition(params, 'video');
}

//手动识别
document.querySelector('#start').addEventListener('click', () => {
    getSignAndSearch();
}, false);

//自动识别(判断是否进行自动识别还是停止自动识别)
document.querySelector('#autoStart').addEventListener('click', () => {
    isAuto = !isAuto;
    if(isAuto){
        timer = setInterval(() => {
            getSignAndSearch();
        }, 1000)
    } else {
        window.clearInterval(timer);
    }
}, false);

//生成签名
function genSign(params, appSecret) {
    let paramsStr = Object.keys(params).sort().map(key => {
        return key + params[key];
    }).join('') + appSecret;
    let shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(paramsStr);
    return shaObj.getHash('HEX');
}

function signParams(params, appKey, appSecret) {
    params['date'] = new Date().toISOString();
    params['appKey'] = appKey;
    params['signature'] = genSign(params, appSecret);
    return params;
}

