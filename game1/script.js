const video = document.getElementById('input');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

//勝敗数の初期化
var winCount = 0;
var loseCount = 0;
var drawCount = 0;



//関連ファイルの読み込み
const config = {
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
};
const hands = new Hands(config);

//カメラからの映像をhands.jsで使えるようにする
const camera = new Camera(video, {
    onFrame: async () => {
        await hands.send({ image: video });
    },
    width: 600,
    height: 400
});

hands.setOptions({
    maxNumHands: 2,              //検出する手の最大数
    modelComplexity: 1,          //ランドマーク検出精度(0か1)
    minDetectionConfidence: 0.5, //手を検出するための信頼値(0.0~1.0)
    minTrackingConfidence: 0.5   //ランドマーク追跡の信頼度(0.0~1.0)
});

//形状認識した結果の取得
hands.onResults(results => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks) {
        results.multiHandLandmarks.forEach(marks => {
            // 緑色の線で骨組みを可視化
            drawConnectors(ctx, marks, HAND_CONNECTIONS, { color: '#0f0' });

            // 赤色でランドマークを可視化
            //drawLandmarks(ctx, marks, {color: '#f00'});
            //drawLandmarks(ctx, marks.slice(0, 4), {color: '#f00'});
            drawLandmarks(ctx, [marks[4], marks[8], marks[12], marks[16], marks[20]], { color: '#f00' });
        })
    }
});


//認識開始・終了ボタン
document.getElementById('start')
    .addEventListener('click', () => camera.start());
document.getElementById('stop')
    .addEventListener('click', () => camera.stop());

document.getElementById("download").onclick = () => {
    //let link = document.createElement("a");         //HTML要素であるaタグを生成
    //link.href = canvas.toDataURL("image/png");      //キャンパスに描画されている現在の内容をPNG形式のデータURIで取得
    //link.download = "image.png";
    //link.click();

    var png = canvas.toDataURL();
    document.getElementById("newImg").src = png;

    let imgElement = document.getElementById("newImg");
    imgElement.onload = function () {
        let mat = cv.imread(imgElement);

        let hsv = new cv.Mat();
        cv.cvtColor(mat, hsv, cv.COLOR_BGR2HSV, 0);

        // 緑色の範囲を定義する
        let lower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [30, 200, 60, 0]);
        let upper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [90, 255, 255, 0]);

        let mask_green = new cv.Mat();
        cv.inRange(hsv, lower, upper, mask_green);

        // 赤色の範囲を定義する
        lower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [91, 255, 60, 0]);
        upper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [179, 255, 255, 0]);
        let mask_red = new cv.Mat();
        cv.inRange(hsv, lower, upper, mask_red);

        let res_green = new cv.Mat();
        cv.bitwise_and(hsv, hsv, res_green, mask_green);
        let res_red = new cv.Mat();
        cv.bitwise_and(hsv, hsv, res_red, mask_red);
        let res_sum = new cv.Mat();
        cv.add(res_green, res_red, res_sum);

        let res_sum_gray = new cv.Mat();
        cv.cvtColor(res_sum, res_sum_gray, cv.COLOR_BGR2GRAY, 0);
        let res_red_gray = new cv.Mat();
        cv.cvtColor(res_red, res_red_gray, cv.COLOR_BGR2GRAY, 0);

        // Cannyフィルタ
        let canny = new cv.Mat();
        cv.Canny(res_sum_gray, canny, 50, 100, 3, false);

        let canny_red = new cv.Mat();
        cv.Canny(res_red_gray, canny_red, 50, 100, 3, false);

        let res_sum_gray_copy = res_sum_gray.clone();

        // 輪郭抽出
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(canny, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        var max_size = 0;
        var max_id = -1;

        for (let i = 0; i < contours.size(); ++i) {
            let cnt = contours.get(i);
            let area = cv.contourArea(cnt, false);
            if (area > max_size) {
                max_size = area;
                max_id = i;
            }
        }

        let mu = cv.moments(contours.get(max_id), false);
        let mc = new cv.Point(mu.m10 / mu.m00, mu.m01 / mu.m00);

        cv.circle(res_sum_gray_copy, mc, 4, [255, 0, 0, 255], -1, cv.LINE_AA, 0);
        console.log(mc.x, mc.y);

        cv.circle(canny_red, mc, 150, [0, 0, 0, 255], -1, cv.LINE_AA, 0);


        let circle2 = canny_red.clone();
        let contours2 = new cv.MatVector();
        let hierarchy2 = new cv.Mat();

        cv.findContours(circle2, contours2, hierarchy2, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        let num = contours2.size();
        console.log(num);

        cv.drawContours(canny_red, contours2, -1, [255, 0, 0, 255], 1, cv.LINE_AA);


        if (num <= 0) {
            console.log("グー");
        } else if (num > 0 && num < 4) {
            console.log("チョキ");
        } else if (num >= 4) {
            console.log("パー");
        }

        cv.imshow('dstImg', canny_red);

        let cpuImg = document.getElementById("cpuImg");
        // 0から2までのランダムな整数を生成する
        let randomNumber = Math.floor(Math.random() * 3);
        if (randomNumber == 0) {
            console.log("CPU:グー");
            var newcpuImgSrc = "./Img/janken_gu.png";
        } else if (randomNumber == 1) {
            console.log("CPU:チョキ");
            var newcpuImgSrc = "./Img/janken_choki.png";
        } else if (randomNumber == 2) {
            console.log("CPU:パー");
            var newcpuImgSrc = "./Img/janken_pa.png";
        }
        cpuImg.src = newcpuImgSrc;

        // じゃんけんの勝敗判定
        //let element = document.getElementById("text");
        let vsImg = document.getElementById("vsImg");
        if (num <= 0) {
            if (randomNumber == 0) {
                console.log("あいこ");
                //element.textContent = "あいこ";
                drawCount++;
                var newvsImgSrc = "./Img/draw.png";
            } else if (randomNumber == 1) {
                console.log("あなたの勝ち");
                //element.textContent = "あなたの勝ち";
                winCount++;
                var newvsImgSrc = "./Img/win.png";
            } else if (randomNumber == 2) {
                console.log("あなたの負け");
                //element.textContent = "あなたの負け";
                loseCount++;
                var newvsImgSrc = "./Img/lose.png";
            }
        } else if (num > 0 && num < 4) {
            if (randomNumber == 0) {
                console.log("あなたの負け");
                //element.textContent = "あなたの負け";
                loseCount++;
                var newvsImgSrc = "./Img/lose.png";
            } else if (randomNumber == 1) {
                console.log("あいこ");
                //element.textContent = "あいこ";
                drawCount++;
                var newvsImgSrc = "./Img/draw.png";
            } else if (randomNumber == 2) {
                console.log("あなたの勝ち");
                //element.textContent = "あなたの勝ち";
                winCount++;
                var newvsImgSrc = "./Img/win.png";
            }
        } else if (num >= 4) {
            if (randomNumber == 0) {
                console.log("あなたの勝ち");
                //element.textContent = "あなたの勝ち";
                winCount++;
                var newvsImgSrc = "./Img/win.png";
            } else if (randomNumber == 1) {
                console.log("あなたの負け");
                //element.textContent = "あなたの負け";
                loseCount++;
                var newvsImgSrc = "./Img/lose.png";
            } else if (randomNumber == 2) {
                console.log("あいこ");
                //element.textContent = "あいこ";
                drawCount++;
                var newvsImgSrc = "./Img/draw.png";
            }
        }
        vsImg.src = newvsImgSrc;

        let element2 = document.getElementById("text2");
        element2.textContent = winCount + "勝" + loseCount + "敗" + drawCount + "分";






        mat.delete();
        hsv.delete();
        mask_green.delete();
        mask_red.delete();
        res_green.delete();
        res_red.delete();
        res_sum.delete();
        res_sum_gray.delete();
        res_red_gray.delete();
        canny.delete();
        canny_red.delete();
        res_sum_gray_copy.delete();
        circle2.delete();
        contours.delete();
        hierarchy.delete();
        contours2.delete();
        hierarchy2.delete();
    }
}

