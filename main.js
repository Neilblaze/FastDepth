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