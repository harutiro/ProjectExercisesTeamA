const beep = new Audio('./assets/beep1.mp3'); // set audio file
let timerId;    // set timer id
let records = [];   // set result array
const timerDisplay = document.getElementById('timer');
const recordsDisplay = document.getElementById('ranking');
const class_main = document.getElementsByClassName('main');
const h1 = document.getElementsByTagName('h1');
const ptTable = [10, 5, 3];
let elapsedTime;
let clk  = '⏰';
let konamiFlg = 0;

const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');

window.onload = function () {
    startButton.disabled = false;   // enable start button
    stopButton.disabled = true;     // disable stop button

    // localStorageから配列を取得して表示する
    records = getLS('attackRanking');
    initScores();

    for (let i = 0; i < 10; i++) {
        if (records[i] == undefined) {
            break;
        } else {
            const recordHTML = `<tr>
                                <td>${i + 1}位</td>
                                <td>${records[i]}秒</td>
                                </tr>`;
            recordsDisplay.innerHTML += recordHTML;
        }
    }
}

// click start button
function startRandomSoundAndTimer() {
    startButton.disabled = true;    // disable start button
    timerDisplay.textContent = clk + '0.00秒'; // initialize timer display
    const randomTime = Math.floor(Math.random() * 9500) + 500; // jenerate random time 0.5-10s
    setTimeout(() => {  // 指定時間後に実行する
        stopButton.disabled = false;    // enable stop button
        beep.play(); // play beep
        const startTime = Date.now();   // start timer
        timerId = setInterval(() => {   // update timer display every 10ms
            class_main[0].style.backgroundColor = '#ff9999';
            elapsedTime = Date.now() - startTime; // 経過時間を計算
            timerDisplay.textContent = clk + (elapsedTime / 1000).toFixed(2) + '秒';
        }, 10); // タイマーを開始する
    }, randomTime);
}

// click stop button
function stopSoundAndTimer() {
    beep.pause(); // stop beep
    class_main[0].style.backgroundColor = '#D6E1FF';
    stopButton.disabled = true; // disable stop button
    startButton.disabled = false; // enable start button
    clearInterval(timerId); // stop repeat
    const record = elapsedTime / 1000;
    records.push(record); // record result

    // 記録を時間の昇順に並び替える
    records.sort((a, b) => a - b);
    // 配列をlocalStorageに保存する
    setLS('attackRanking', records);

    // HTML上に記録を表示する
    recordsDisplay.innerHTML = '';
    for (let i = 0; i < Math.min(records.length, 10); i++) {
        const durationInSeconds = records[i].toFixed(2);
        const recordHTML = `<tr>
                            <td>${i + 1}位</td>
                            <td>${durationInSeconds}秒</td>
                            </tr>`;
        recordsDisplay.innerHTML += recordHTML;
    }

    for (let i = 0; i < 3; i++) {
        if (records[i] == record) {
            let ptArr = getLS('pts');
            ptArr[3] = ptTable[i];
            setLS('pts', ptArr);
            break;
        }
    }
    initScores();
}

cheet('n e k o', function () {
    clk = '🐱';
    timerDisplay.textContent = clk + '0.00秒';
});
cheet('c l o c k', function () {
    clk = '⏰';
    timerDisplay.textContent = clk + '0.00秒';
});

cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
    if (konamiFlg == 0) {
        konamiFlg = 1;
        h1[0].textContent = '早押しタイムアタック😀';
        ptTable[0] *= 2;
        ptTable[1] *= 2;
        ptTable[2] *= 2;
    } else {
        konamiFlg = 0;
        h1[0].textContent = '早押しタイムアタック';
        ptTable[0] /= 2;
        ptTable[1] /= 2;
        ptTable[2] /= 2;
    }
});

startButton.addEventListener('click', startRandomSoundAndTimer);
stopButton.addEventListener('click', stopSoundAndTimer);
