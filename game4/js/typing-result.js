new Audio('sounds/dodon.mp3').play(); //どどん音源

let url = new URL(window.location.href);// URLを取得
let params = url.searchParams;// URLSearchParamsオブジェクトを取得

//get関数で取得
const score = params.get('score');
const level = params.get('level'); 
const point = params.get('point'); 
const time = params.get('time');
const Q_it = params.get('Q_it');
const Q_mt = params.get('Q_mt');
const wpm = params.get('wpm');
const accuracy = params.get('accuracy');

//出力
document.getElementById("score").innerHTML = score;
document.getElementById("level").innerHTML = level;
document.getElementById("point").innerHTML = point + 'pt';
document.getElementById("time").innerHTML = time;
document.getElementById("Q_it").innerHTML = Q_it;
document.getElementById("Q_mt").innerHTML = Q_mt;
document.getElementById("wpm").innerHTML = wpm;
document.getElementById("accuracy").innerHTML = accuracy + "%";

//スクリーンショット
const script = document.createElement('script');

script.onload = () => {
  document.getElementById('btn-screenshot').addEventListener('click', () => {
    html2canvas(document.body).then((canvas) => {
      downloadImage(canvas.toDataURL());
    });
  });

  function downloadImage(dataUrl) {
    const name = 'screenshot.png';
    const a = document.createElement('a');

    a.href = dataUrl;
    a.download = name;
    a.click();
  }
};

script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
document.body.appendChild(script);
