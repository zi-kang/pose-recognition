/**
 *向服务端发起请求
 *videoEleId 作为生成canvas大小的参照
 */

function recognition(params, videoEleId) {
    var video = document.getElementById(videoEleId);

    //保证页面中只能有一个canvas标签
    var oldCanvas = document.getElementsByTagName('canvas');
    if(oldCanvas.length > 0) {
        oldCanvas[0].remove();
    }
    //动态生成canvas标签，并根据传入进来的video标签设置大小，保证根据识别返回结果绘制出来的连线准确
    var canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1000";
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;
    document.body.appendChild(canvas);
    var ajax = new XMLHttpRequest();

    // 使用post请求,并将请求参数放入body体重
    ajax.open('post','/pose');
    ajax.setRequestHeader("Accept", "*/*");
    ajax.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    ajax.send(JSON.stringify(params));
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 && ajax.status==200) {//成功
            console.log(ajax.responseText);
            //返回结果是一个JSON对象，例如：{"statusCode": 0, "result": {"target": {"points": [[12, 220], [-6, 207], [41, 143], [182, 148], [250, 207], [208, 183]]}}}
            successSearch(JSON.parse(ajax.responseText).result.target)
        } else if (ajax.readyState==4 && ajax.status !=200) {//失败
            alert(ajax.responseText)
        }
    }

    //根据返回来的6个点绘制连线,6个点的含义分别是：手，肘，肩，肩，肘，手
    function successSearch(params) {
        console.log(params);
        var points = params.points;
        var node1 = points[0],
            node2 = points[1],
            node3 = points[2],
            node4 = points[3],
            node5 = points[4],
            node6 = points[5];
        var context = canvas.getContext("2d");
        //设置对象起始点和终点
        context.beginPath();
        context.moveTo(node1[0],node1[1]);//手
        context.lineTo(node2[0],node2[1]);
        context.lineTo(node3[0],node3[1]);//肩
        context.lineWidth = 2;
        context.strokeStyle = "#F5270B";
        //绘制
        context.stroke();

        context.beginPath();
        context.moveTo(node3[0],node3[1]);
        context.lineTo(node4[0],node4[1]);
        context.strokeStyle = "#00ff00";
        //绘制
        context.stroke();

        context.beginPath();
        context.moveTo(node4[0],node4[1]);//肩
        context.lineTo(node5[0],node5[1]);
        context.lineTo(node6[0],node6[1]);//手
        //strokeStyle的颜色有新的值，则覆盖上面设置的值
        //lineWidth没有新的值，则按上面设置的值显示
        context.strokeStyle = "#0D25F6";
        //绘制
        context.stroke();
    }
}