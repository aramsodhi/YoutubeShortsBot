"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let RECORDING  = false;
const recording_button = document.getElementById("recording-button");

let blob, media_recorder = null;
let chunks = [];

async function start_recording() {
    let stream = await navigator.mediaDevices.getDisplayMedia(
        {video: {mediaSource: "screen"}, audio: true}
    );

    media_recorder = new deviceRecorder(stream, {mimeType: "vide/mp4"});

    media_recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    }

    media_recorder.onstop = () => chunks = [];

    media_recorder.start(250);
}

function stop_recording() {
    let filename = "youtube_short";

    media_recorder.stop();
    blob = new Blob(chunks, {type: "video/mp4"});
    chunks = [];
    let data_download_url = URL.createObjectURL(blob);

    let a = document.createElement(a);
    a.href = data_download_url;
    a.download = `${filename})}.mp4`;
    a.click();

    URL.revokeObjectURL(data_download_url);
}

recording_button.addEventListener("click", () => {
    RECORDING = !RECORDING;

    recording_button.innerHTML = RECORDING ? "Stop Recording" : "Start Recording";
    RECORDING ? start_recording() : stop_recording();
});

const FPS = 60;

let size = canvas.width;


class Ball {
    constructor(x, y, radius, x_vel, y_vel) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = get_random_color();

        this.x_vel = x_vel;
        this.y_vel = y_vel;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.x - this.radius < 0 || this.x + this.radius > size - 1) {
            this.x_vel *= -1;
            
            if (Math.random() < 0.35 - 0.001 * (balls.length - 1)) {
                add_new_ball();
            }
        }

        if (this.y - this.radius < 0 || this.y + this.radius > size - 1) {
            this.y_vel *= -1;
            
            if (Math.random() < 0.35 - 0.001 * (balls.length - 1)) {
                add_new_ball();
            }
        }


        this.x += this.x_vel;
        this.y += this.y_vel;
    }

}


const balls = [new Ball(size / 2, size / 2, 10, Math.random() * 5, Math.random() * 5)];

let _interval = setInterval(function() {
    ctx.clearRect(0, 0, size, size);

    balls.forEach((ball, index) => {
        ball.update();
        ball.render(ctx);

        if (balls.length !== 1) {
            if (ball.x - ball.radius < -2.5 && ball.x_vel < 0) balls.splice(index, 1);
            if (ball.x + ball.radius > size + 2.5 && ball.x_vel > 0) balls.splice(index, 1);
    
            if (ball.y - ball.radius < -2.5 && ball.y_vel < 0) balls.splice(index, 1);
            if (ball.y + ball.radius > size + 2.5 && ball.y_vel > 0) balls.splice(index, 1);
        }
    });
}, 1000 / FPS);


function add_new_ball() {
    canvas.width -= 0.1;
    canvas.height -=0.1;
    size = canvas.width;

    if (balls.length < 10000) {
        balls.push(new Ball(size / 2, size / 2, 10, Math.random() * 5, Math.random() * 5));
    }
}

function get_random_color() {
    const colors = ["tomato", "dodgerblue", "green", "magenta", "pink", "orange", "yellow", "lime", "slateblue"];

     return colors[Math.floor(Math.random() * colors.length)];   
}
