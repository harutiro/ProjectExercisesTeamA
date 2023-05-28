
let spacePush = false; //最初のspacekey判定用

let url = new URL(window.location.href);// URLを取得
let params = url.searchParams;// URLSearchParamsオブジェクトを取得

//get関数で取得
const select = params.get('select');
let Q;//問題文
let Q_Num; //問題数
if(select == 1){ //三文字
    Q = ["key","bit","let","bug","fix","log","row","tab","tag","zip","jpg","css","img","png","mp3","add","run","use","app","cmd","dir","doc","err","int","max","min","num","obj","tmp","val","mac","rgb","ssh","sql","url"];
    Q_Num = 10;
} else if(select == 2){
    Q = ["key","bit","let","bug","fix","log","row","tab","tag","zip","jpg","css","img","png","mp3","add","run","use","app","cmd","dir","doc","err","int","max","min","num","obj","tmp","val","mac","rgb","ssh","sql","url"];
    Q_Num = 20;
} else if(select == 3){ //四文字
    Q = ["byte","code","data","exit","fail","file","font","icon","item","link","node","none","null","path","push","root","scan","sort","type","warn","bump","fire","hack","hash","load","typo","todo","body","head","call","form","list","menu","name","play","char","ctrl","diff","init","prev","repo","temp","html","http","json","java","bool"];
    Q_Num = 10;
} else if(select == 4){
    Q = ["byte","code","data","exit","fail","file","font","icon","item","link","node","none","null","path","push","root","scan","sort","type","warn","bump","fire","hack","hash","load","typo","todo","body","head","call","form","list","menu","name","play","char","ctrl","diff","init","prev","repo","temp","html","http","json","java","bool"];
    Q_Num = 20;
} else if(select == 5){ //五文字、六文字
    Q = ["action","below","break","build","child","button","class","close","false","finish","number","return","parent","style","useful","window","async","config","param","params","https","double","false","float","global","import","module","native","return","sizeof","static","string","struct","switch","typeof","array","apply","cancel","click","cookie","cursor","debug","delete","dialog","domain","folder","format","global","issue","label","layout","length","level","local","login","memory","module","option","output","popup","range","remove","reset","script","server","system","clone"];
    Q_Num = 10;
} else if(select == 6){
    Q = ["action","below","break","build","child","button","class","close","false","finish","number","return","parent","style","useful","window","async","config","param","params","https","double","false","float","global","import","module","native","return","sizeof","static","string","struct","switch","typeof","array","apply","cancel","click","cookie","cursor","debug","delete","dialog","domain","folder","format","global","issue","label","layout","length","level","local","login","memory","module","option","output","popup","range","remove","reset","script","server","system","clone"];
    Q_Num = 20;
} else if(select == 7){ //七文字以上
    Q = ["address","complete","information","language","password","product","software","website","JavaScript","boolean","checked","continue","debugger","function","include","operator","private","protected","algorithm","application","argument","character","checkbox","clipboard","collection","command","configuration","connection","console","continue","dashboard","database","default","developer","directory","documentation","download","element","function","hardware","install","integer","interface","library","network","parameter","physical","public","release","shortcut","version","binary","debugger","framework","hierarchy","initial","installation"];
    Q_Num = 10;
} else if(select == 8){
    Q = ["address","complete","information","language","password","product","software","website","JavaScript","boolean","checked","continue","debugger","function","include","operator","private","protected","algorithm","application","argument","character","checkbox","clipboard","collection","command","configuration","connection","console","continue","dashboard","database","default","developer","directory","documentation","download","element","function","hardware","install","integer","interface","library","network","parameter","physical","public","release","shortcut","version","binary","debugger","framework","hierarchy","initial","installation"];
    Q_Num = 20;
}


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
    } else { //まだスペースキーが押されていない場合
        if(e.key == " ") {
            spacePush = true;
            push_Keydown(e);
            startTime = Date.now(); //タイマースタート
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

            if(Q_wt == Q_Num){ //問題数
                elapsedTime = Date.now() - startTime; //タイマーストップ
                const time = calcTime(elapsedTime); //time
                const wpm = calcWpm(elapsedTime,Q_it); //wpm
                const accuracy = calcAccuracy(Q_it,Q_mt); //正確性
                const score = calcScore(wpm,accuracy); //score
                const level = calcLevel(score); //level
                const point = calcPoint(score); //point
                let para = "?score=" + score + "&level=" + level + "&point=" + point + "&time=" + time + "&Q_it=" + Q_it + "&Q_mt=" + Q_mt + "&wpm=" + wpm + "&accuracy=" + accuracy; //パラメータ作成
                location.href = "./typing-result.html" + para; //画面遷移
            } else {
                const word = Q[Q_No].substring(Q_i, Q_l)
                document.getElementById("start").innerHTML = word; //新たな問題を書き出す
                //読み上げ音声設定
                const uttr = new SpeechSynthesisUtterance()
                uttr.text = word;
                uttr.rate = 0.9;
                uttr.volume = 5;
                uttr.lang = "en-GB"//イギリス英語
                //読み上げスタート
                window.speechSynthesis.speak(uttr)
            }

        } else {
            new Audio('sounds/good.mp3').play(); //タイピング音の音声再生
        }
    } else { //押したキーが間違えていたら
        Q_mt++;
        new Audio('sounds/bad.mp3').play(); //不正解の音声再生
        //let body_element = document.getElementsByTagName('body');
        //body_element.style.backgroundColor = '#red';  //背景色を赤にする
        //body_element.style.backgroundColor = "#FF0000";
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
    const wpm = i/(s/60.0);
    return wpm.toPrecision(5);
}

function calcScore(wpm,accuracy) { //スコア計算用関数
    const score = wpm*((accuracy/100)**3);
    return score.toPrecision(3);
}

function calcLevel(score) { //level計算用関数
    let level = "";
    if(score <= 21){
        level = "E-";
    } else if(score <= 38){
        level = "E";
    } else if(score <= 55){
        level = "E+";
    } else if(score <= 72){
        level = "D-";
    } else if(score <= 89){
        level = "D";
    } else if(score <= 106){
        level = "D+";
    } else if(score <= 123){
        level = "C-";
    } else if(score <= 140){
        level = "C";
    } else if(score <= 157){
        level = "C+";
    } else if(score <= 174){
        level = "B-";
    } else if(score <= 191){
        level = "B";
    } else if(score <= 208){
        level = "B+";
    } else if(score <= 225){
        level = "A-";
    } else if(score <= 242){
        level = "A";
    } else if(score <= 259){
        level = "A+";
    } else if(score <= 276){
        level = "S";
    } else if(score <= 299){
        level = "Good!";
    } else if(score <= 324){
        level = "Fast";
    } else if(score <= 349){
        level = "Thunder";
    } else if(score <= 374){
        level = "Ninja";
    } else if(score <= 399){
        level = "Comet";
    } else if(score <= 449){
        level = "Professor";
    } else if(score <= 499){
        level = "LaserBeam";
    } else if(score <= 549){
        level = "EddieVH";
    } else if(score <= 599){
        level = "Meijin";
    } else if(score <= 649){
        level = "Rocket";
    } else if(score <= 699){
        level = "Tatujinn";
    } else if(score <= 749){
        level = "Jedi";
    } else if(score <= 799){
        level = "Godhand";
    } else {
        level = "Joker";
    }
    return level;
}

function calcPoint(score) { //point計算用関数
    let point = 0;
    if(score <= 21){
        point = 2;
    } else if(score <= 38){
        point = 2;
    } else if(score <= 55){
        point = 2;
    } else if(score <= 72){
        point = 4;
    } else if(score <= 89){
        point = 4;
    } else if(score <= 106){
        point = 4;
    } else if(score <= 123){
        point = 6;
    } else if(score <= 140){
        point = 6;
    } else if(score <= 157){
        point = 6;
    } else if(score <= 174){
        point = 8;
    } else if(score <= 191){
        point = 8;
    } else if(score <= 208){
        point = 8;
    } else if(score <= 225){
        point = 10;
    } else if(score <= 242){
        point = 10;
    } else if(score <= 259){
        point = 10;
    } else if(score <= 276){
        point = 10;
    } else if(score <= 299){
        point = 11;
    } else if(score <= 324){
        point = 12;
    } else if(score <= 349){
        point = 13;
    } else if(score <= 374){
        point = 14;
    } else if(score <= 399){
        point = 15;
    } else if(score <= 449){
        point = 16;
    } else if(score <= 499){
        point = 17;
    } else if(score <= 549){
        point = 18;
    } else if(score <= 599){
        point = 19;
    } else if(score <= 649){
        point = 20;
    } else if(score <= 699){
        point = 21;
    } else if(score <= 749){
        point = 22;
    } else if(score <= 799){
        point = 23;
    } else {
        point = 24;
    }
    return point;
}