//(PC/MOBILE)
const filter = "win16|win32|win64|mac|macintel";
const platform = (filter.indexOf(navigator.platform.toLowerCase()) > 0) ? "PC" : "MOBILE";
console.log(`Client platform : ${platform}`);

//GUI
const w = 300, h = 300;
// const w = 450, h = 330;
const video = document.getElementById("video");
[video.width, video.height] = [w, h];

//WebRTC
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
let backlog;
let vidStream = null;
let cam = "environment" // "environment" or "user"
const successCallback = (_vidStream) => {
    vidStream = _vidStream;
    video.srcObject = _vidStream;
    video.play();
}

const change_cam = () => {
    if (platform == "PC") {
        console.log("Not supported!");
    } else {
        if (vidStream == null) return;
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
ctx.strokeStyle = "rgb(0, 255, 0)";
ctx.font = "15px Arial";
ctx.lineWidth = 3;

let model;
const load = async () => {
    const url = "./model.json";
    // const url = "model.json";
    model = await tf.loadGraphModel(url);
    console.log("Model loaded");
}
load();

const predict = async () => {
    const image = tf.browser.fromPixels(video).resizeBilinear([224, 224]).transpose([2, 0, 1]).reshape([1, 3, 224, 224]).asType('float32').div(255);
//     const image = tf.browser.fromPixels(video).resizeBilinear([200, 200]).transpose([2, 0, 1]).reshape([1, 3, 200, 200]).asType('float32').div(255);
    result = await model.predict(image);
    console.log("Done");
    const outReshape = (tf.transpose(result, [2, 3, 1, 0])).reshape([224, 224, 1]);
    const outResize = tf.mul(tf.div(outReshape, tf.max(outReshape)), 255).asType('int32');
    await tf.browser.toPixels(outResize, canvas);
    setTimeout(predict, 0);
}
