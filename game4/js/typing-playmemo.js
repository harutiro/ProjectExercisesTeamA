let spacePush = false; //最初のspacekey判定用

let Q = ["apple","banana","melon","mango","strawberry","blueberry","orange"];//問題文
let Q_No = Math.floor( Math.random() * Q.length);//問題をランダムで出題する

let Q_i = 0;//回答初期値・現在単語どこまで合っているか判定している文字番号
let Q_l = Q[Q_No].length;//計算用の文字の長さ  

//スコア用変数
let Q_it = 0; //正解だった文字数 i total
let Q_wt = 0; //正解した単語数 word total
let Q_mt = 0; //間違えた回数 miss total

//タイマー用
let startTime = 0; //開始時間
let elapsedTime = 0; //経過時間

window.addEventListener("keydown", function (e) { //キー入力をしたら、関数を実行
    if(spacePush) { //スペースキーが押されていたら
        push_Keydown(e);
    } else {
        console.log(Q_wt);
        if(e.key == " ") { //スペースキーが押されていない場合
            spacePush = true;
            push_Keydown(e);
        }
    }
}
);

function push_Keydown(event){ //メインの関数
    let keyCode = event.key;
    if (Q_l == Q_l-Q_i){ //問題出題(問題文が出ていないかつQ_i　= 0ならば)
        document.getElementById("start").innerHTML = Q[Q_No].substring(Q_i, Q_l); //startの何かキーを押してくださいに上書きして、問題を書き出す
    }
    if (keyCode == " "){ //最初のスタートキー
        startTime = Date.now(); //タイマースタート

    } else if (Q[Q_No].charAt(Q_i) == keyCode) { //押したキーが合っていたら
        Q_i++; //判定する文章に１足す
        document.getElementById("start").innerHTML = Q[Q_No].substring(Q_i, Q_l); //問題を書き出す

        if (Q_l-Q_i === 0){ //全部正解したら

            new Audio('sounds/ok.mp3').play(); //正解の音声再生

            //記録
            Q_it += Q_i; //正解文字数
            Q_wt++; //正解単語数

            Q_No = Math.floor( Math.random() * Q.length);//問題をランダムで出題する
            Q_i = 0;//回答初期値・現在どこまで合っているか判定している文字番号
            Q_l = Q[Q_No].length;//計算用の文字の長さ

            if(Q_wt == 5){ //問題数
                elapsedTime = Date.now() - startTime; //タイマーストップ
                const time = calcTime(elapsedTime); //time
                const wpm = calcWpm(elapsedTime,Q_it); //wpm
                const accuracy = calcAccuracy(Q_it,Q_mt); //正確性
                const score = calcScore(wpm,accuracy); //score
                const level = calcLevel(score); //level
                let para = "?score=" + score + "&level=" + level + "&time=" + time + "&Q_it=" + Q_it + "&Q_mt=" + Q_mt + "&wpm=" + wpm + "&accuracy=" + accuracy; //パラメータ作成
                location.href = "./typing-result.html" + para; //画面遷移
            } else {
                document.getElementById("start").innerHTML = Q[Q_No].substring(Q_i, Q_l); //新たな問題を書き出す
            }

        } else {
            new Audio('sounds/good.mp3').play(); //タイピング音の音声再生
        }
    } else { //押したキーが間違えていたら
        new Audio('sounds/bad.mp3').play(); //不正解の音声再生
        Q_mt++;
    }
}

function calcTime(eTime) { //時間計算用関数
    //1分は60000マイクロ秒。60000で割ることにより、分が計算される。
    let m = Math.floor(eTime / 60000);
    //1分は60000マイクロ秒。60000ミリ秒で割り、その余りを1000で割れば秒が計算される。
    let s = Math.floor((eTime % 60000) / 1000);
    //1秒は1000マイクロ秒。 1000ミリ秒で割った数の余りがマイクロ秒
    let ms = eTime % 1000;
    m = ("" + m).slice(-2);//文字列の末尾2桁を表示
    s = ("" + s).slice(-2);//文字列の末尾2桁を表示
    ms = ("" + ms).slice(-3);//文字列の末尾3桁を表示

    //n分n秒n生成
    let time = "";
    if(m != "0") time =  time + m + "分";
    time = time + s + "秒" + ms;
    return time;
}

function calcAccuracy(right,wrong){ //正確性計算関数
   const accuracy = (right - wrong)/right * 100;
   return accuracy.toPrecision(4);
}

function calcWpm(eTime,i) { //WPM計算用関数
    let s = Math.floor((eTime % 60000) / 1000);
    const wpm = i/s * 60;
    return wpm.toPrecision(5);
}

function calcScore(wpm,accuracy) { //スコア計算用関数
    const score = wpm*((accuracy/100)**3);
    return score.toPrecision(3);
}

function calcLevel(score) { //level計算用関数
    let level = score;
    return level;
}