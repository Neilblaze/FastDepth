//(PC/MOBILE)
const filter = "win16|win32|win64";
const platform = (filter.indexOf(navigator.platform.toLowerCase()) > 0) ? "PC" : "MOBILE";
console.log(`Client platform : ${platform}`);

//GUI
const w = 250, h = 250;
const video = document.getElementById("video");
[video.width, video.height] = [w, h];

//WebRTC
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
// window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

let backlog;
    let vidStream = null;
    // navigator.getUserMedia({video: true}, successCallback, (err) => {
    //     console.log("Error: ", err);
    // });
    let cam = "environment" // "environment" or "user"
    const successCallback = (_vidStream) => {
        vidStream = _vidStream;
        // console.log("successCallback");
        video.srcObject = _vidStream;
        video.play();
    }

    const change_cam = () => {
        if (platform == "PC") {
            console.log("Not supported!");
        } else {
            if (vidStream == null) return;
            // if (cam == "environment") {
            //     cam = "user";
            //     video.srcObject = vidStream;
            //     video.play();
            // } else {
            //     cam = "environment";
            //     video.srcObject = null;
            //     video.pause();
            // }
            vidStream.getTracks().forEach(t => {
                t.stop();
            });
            if (cam == "environment") cam = "user";
            else cam = "environment";
            backlog = { video: { facingMode: { exact: cam }, width: { exact: w }, height: { exact: h } }, audio: false };
            navigator.getUserMedia(backlog, successCallback, (e) => console.log(e));
        }
    }

    if (platform == "PC") {
        backlog = { video: { width: { exact: w }, height: { exact: h } }, audio: false };
    } else {
        backlog = { video: { facingMode: { exact: cam }, width: { exact: w }, height: { exact: h } }, audio: false };
    }
    navigator.getUserMedia(backlog, successCallback, (e) => console.log(e));

    const canvas = document.getElementById("canvas");
    [canvas.width, canvas.height] = [w, h];
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(0, 255, 0)";
    // ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgb(0, 255, 0)";
    // ctx.lineWidth = 1;
    ctx.font = "15px Arial";
    // ctx.textAlign = "center";
    ctx.lineWidth = 3;
    // ctx.strokeText("Test", w / 2, h / 2);


    let model;
    const load = async () => {
        const url = "./model.json";
        // const url = "model.json";
        model = await tf.loadGraphModel(url);
        console.log("Loading Complete!");
    }
    load();

    // const predict = async () => {
    //     const image = await tf.readImage(vidStream);
    //     const result = await model.execute(image);
    //     console.log(result);
    //     const text = result.data.toString();
    //     ctx.fillText(text, w / 2, h / 2);
    // }
    // predict();

    const predict = async () => {
        const image = tf.browser.fromPixels(video).resizeBilinear([224, 224]).transpose([2, 0, 1]).reshape([1, 3, 224, 224]).asType('float32').div(255);
        result = await model.predict(image);
        console.log("Done");
        const outReshape = (tf.transpose(result, [2, 3, 1, 0])).reshape([224, 224, 1]);
        const outResize = tf.mul(tf.div(outReshape, tf.max(outReshape)), 255).asType('int32');
        await tf.browser.toPixels(outResize, canvas);
        setTimeout(predict, 0);
    }
