// 共有スコア配列インデックス対応表
// * total: 0
// * quiz: 1
// * janken: 2
// * timeattack: 3
// * typing: 4

// webStorageアクセスキー
// * 共有スコア配列：pts
// * 各自のスコア保存：各自で管理お願いします

// 関数一覧

// initScores() 
// * 引数なし、返り値なし
// * 共有スコア配列の初期化
// * 各要素合計点の計算
// * displayScoresをコールし、サイドバーの得点表示を更新

// displayScores(SArr)
// * 引数：共有スコア配列、返り値なし
// * HTML要素取得、サイドバーの得点表示を更新

// setLS(key, data)
// * 第一引数：webStorageアクセスキー、第2引数：共有スコア配列、返り値なし
// * localStorage領域に第一引数の値を格納

// getLS(key)
// * 引数：webStorageアクセスキー、返り値：共有スコア配列
// * localStorage領域から共有スコア配列を取得
// * 共有中の得点全てを取得するため、データ取り扱いに注意のこと
// * e.g.) let ptArr = getLS('pts');

const quiz = document.getElementById('quiz');
const janken = document.getElementById('jnkn');
const timeattack = document.getElementById('attack');
const typing = document.getElementById('typing');
const total = document.getElementById('total');
const scoreNames = ['総合得点: ', 'クイズ: ', 'じゃんけん: ', '早押し: ', 'タイピング: ']

// サイドバーの得点表示を更新
function displayScores(SArr) {
    total.innerHTML = scoreNames[0]+ SArr[0] + 'pt';
    quiz.innerHTML = scoreNames[1]+SArr[1] + 'pt';
    janken.innerHTML = scoreNames[2]+SArr[2] + 'pt';
    timeattack.innerHTML = scoreNames[3]+SArr[3] + 'pt';
    typing.innerHTML = scoreNames[4]+SArr[4] + 'pt';
}

// save array to local storage
function setLS(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// load array from local storage
function getLS(key) {
    const storedArray = localStorage.getItem(key);
    if (storedArray) {
      return JSON.parse(storedArray);
    } else {
      return [];
    }
}

// localStorageからデータを取得して表示する
function initScores() {
    let scores = getLS('pts');

    // first initialize
    if (scores.length === 0) {
        scores = [0, 0, 0, 0, 0];
    }
    scores[0] = scores[1] + scores[2] + scores[3] + scores[4];
    setLS('pts', scores);
    displayScores(scores);
}

//ポイント生成(初期化)
// const SArr = getLS('pts');
// SArr[4] = 0;
// setLS('pts',SArr);
initScores();
