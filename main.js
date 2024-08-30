const SQUARE_STATUS_IS_OWNED="01"; //自分のコマ
const SQUARE_STATUS_IS_OTHER="02"; //相手のコマ
const SQUARE_STATUS_NOT_SELECTED="09"; //選択されていない

// square：(row,col)
let isOddTurn = true;

const premove = {
  lower: 0,
  upper: 0,
  left: 0,
  right: 0,
  lowerleft: 0,
  lowerright: 0,
  upperleft: 0,
  upperright: 0,
};

const computer = {};

//サイトを開くと実行
$(function(){
  $(".square").click(clickSquareEvent);
  
  initializeEvent();//初期化
});

//マスをクリックすると起こるイベント
function clickSquareEvent(){
  if(!computer.true || computer.act){
    computer.act = false;
  let square = $(this); 

  premove.lower = 0;
  premove.upper = 0;
  premove.left = 0;
  premove.right = 0;
  premove.lowerleft = 0;
  premove.lowerright = 0;
  premove.upperleft = 0;
  premove.upperright = 0;

  //マス目にピースが置かれている可動化の判定
  if(!canSelect(square)){
    if(computer.true){
      computer.act = true;
    }
    alert("そこには置けません");
    return;
  }
  let now_btn = document.getElementById('NowSupport');
  //トースターの表示を消す
  toastr.remove();
  if(now_btn.checked){
    square.addClass("now");
  }
  if(premove.true){
    premove.square.removeClass("now");
  }
  changeOwner(square);//ピースを置く→ピースをめくる→順番の交代
  //ゲーム終了
  if(isGameEnd()) {
    toastEndMessage("ゲームが終了しました。");
    return;
  }
  
  if(isPass()){
    toastr.remove();
    toastr.error(getTurnStringJP()+"には選択できるマスがありません。");
    if(computer.true){
      computer.act = true;
    }
    changeTurn();
    if(isPass()){
      toastr.error(getTurnStringJP()+"には選択できるマスがありません。");
      toastEndMessage("選択できるマスがなくなりました。")
    }else{
      setTimeout(function(){
        toastinfo();
      },1000);
    }

  return;
  }

  if(computer.true){
    if(computer.color == getTurnString()) 
      setTimeout(function(){
        if($(".square.selected").length < 64){
          toastr.remove();
        }
        if(now_btn.checked){
          square.removeClass("now");
        }
        com();
        if(isGameEnd()) {
          toastEndMessage("ゲームが終了しました。");
          return;
        }

        if(isPass()){
          toastr.remove();
          toastr.error(getTurnStringJP()+"には選択できるマスがありません。");
          if(computer.true){
            computer.act = true;
          }
          changeTurn();
          if(isPass()){
            toastr.error(getTurnStringJP()+"には選択できるマスがありません。");
            toastEndMessage("選択できるマスがなくなりました。")
          }else{
            setTimeout(function(){
              toastinfo();
            },1000);
          }
        }
        computer.act = true;
      },1000);
  }

  //ゲーム終了
  if(isGameEnd()) {
    toastEndMessage("ゲームが終了しました。");
    return;
  }

  
  toastinfo();
  }
  
}

function toastinfo(){
  let CountSupport = document.getElementById("CountSupport");
  let countBlack = $("[data-owner=black]").length;
  let countWhite = $("[data-owner=white]").length;
  toastr.remove();
  if(CountSupport.checked){
    toastr.info(getTurnStringJP()+"の番です。"+"<br/>"+ "黒："+countBlack+"<br/>"+"白："+countWhite);
  }else{
    toastr.info(getTurnStringJP()+"の番です。");
  }
}

function isGameEnd(){
  if($(".square.selected").length == 64){
    return true;
  }
  return false;
}

//番手がパスかどうか
function isPass(){
  if($(".square.can-select").length == 0 && $(".square.selected").length < 64){
    return true;
  }
  return false;
}

function toastEndMessage(message){
  toastr.remove();
  let countBlack = $("[data-owner=black]").length;
  let countWhite = $("[data-owner=white]").length;

  let judgeString = "黒："+countBlack+"<br/>"+"白："+countWhite+"<br/>";

  if(countBlack == countWhite){
    toastr.success(message+"<br/>"+judgeString+"引き分けです。");
  }else if(countBlack > countWhite){
    toastr.success(message+"<br/>"+judgeString+"黒の勝利です。");
  }else{
    toastr.success(message+"<br/>"+judgeString+"白の勝利です。");
  }
}

//どちらのターンか取得している
function getTurnString(){
  if(isOddTurn){
    return "black";
  }
  return "white";
}

function getTurnStringJP_YOU(){
  if(isOddTurn){
    return "黒";
  }
   return "白";
}

function getTurnStringJP_COM_WHITE(){
  if(isOddTurn){
    return "あなた（黒）";
  }
   return "コンピューター（白）";
}

function getTurnStringJP_COM_BLACK(){
  if(isOddTurn){
    return "コンピューター（黒）";
  }
   return "あなた（白）";
}

function getTurnStringJP(){
  if(computer.true){
    if(computer.color == "white"){
      return getTurnStringJP_COM_WHITE();
    }else{
      return getTurnStringJP_COM_BLACK();
    }
  }else{
    return getTurnStringJP_YOU();
  }
}

//ターンのチェンジ
function changeTurn() {
  // ターンを変更する
  isOddTurn = !isOddTurn;

  cancant();  
}

function cancant(){
  let black_support = document.getElementById("BlackSupport");
  let white_support = document.getElementById("WhiteSupport");
  let support =false;

  if(getTurnString() == "black" && black_support.checked){
      support = true;
  }
  if(getTurnString() == "white" && white_support.checked){
      support = true;
    }
  

  // 選択可否を設定する
  for (let elem of $(".square")) {
      if (canSelect($(elem))) {
          $(elem).removeClass("can-select-color");
          $(elem).addClass("can-select");
          if(support){
            $(elem).addClass("can-select-color");
          }
          $(elem).removeClass("cant-select");
      } else {
          $(elem).removeClass("can-select");
          $(elem).removeClass("can-select-color");
          $(elem).addClass("cant-select");
      }
  }
}
function btn_on(){
  checkbutton1.checked = true;
  checkbutton2.checked = true;
  checkbutton3.checked = true;
  checkbutton6.checked = true;

}
//初期化
function initializeEvent(){

  //btn_on();

  computer.true = false;
  computer.act = true;
  computer.number = 0;
  //トースターの表示を消す
  toastr.remove();
  if(premove.true && premove.square.hasClass("now")){
    premove.square.removeClass("now");
  }
  
  //マスの属性をリセットする
  $(".square")
    .removeClass("selected")
    .text("")
    .attr("data-owner","");

  //奇数番手に戻す
  isOddTurn = true;
  toastr.info(getTurnStringJP()+"の番です。");

  changeOwner(getTargetSquare(3,4));
  changeOwner(getTargetSquare(3,3));
  changeOwner(getTargetSquare(4,3));
  changeOwner(getTargetSquare(4,4));
  premove.number = 0;
  premove.lower = 0;
  premove.upper = 0;
  premove.left = 0;
  premove.right = 0;
  premove.lowerleft = 0;
  premove.lowerright = 0;
  premove.upperleft = 0;
  premove.upperright = 0;
  premove.true = false;
}


function changeOwner(square){
  premove.square = square;
  premove.row = square.data("row");
  premove.col = square.data("col");
  putPiece(square,getTurnString()); //マスにピースを置く
  changeOwnerOpposite(square); //ピースの反転
  changeTurn(); //ターンのチェンジ
  premove.true = true;
  premove.owner = getTurnString();
  premove.number++;
}

//マス目にピースを置く
function putPiece(targetSquare,owner) {
  targetSquare.text("●").attr("data-owner", owner).addClass("selected");
}


//マス目のrowとcolを取得している
function getTargetSquare(row,col){
  return $("[data-row="+row+"][data-col="+col+"]");
}

//すでにピースが置かれているかの判定
function canSelect(square){
  if(square.hasClass("selected")){
    return false;
  }

  let row = square.data("row");
  let col = square.data("col");

  if(getPosOppositeLower(row,col) != null){
    return true;
  }
  if(getPosOppositeUpper(row, col) != null){
    return true;
  }
  if(getPosOppositeLeft(row, col) != null){
    return true;
  }
  if(getPosOppositeRight(row, col) != null){
    return true;
  }
  if(getPosOppositeLowerRight(row, col) != null){
    return true;
  }
  if(getPosOppositeLowerLeft(row, col) != null){
    return true;
  }
  if(getPosOppositeUpperRight(row, col) != null){
    return true;
  }
  if(getPosOppositeUpperLeft(row, col) != null){
    return true;
  }
  return false;
}

//所有者を変更する(ピースをめくる)
function changeOwnerOpposite(square){
  let row = square.data("row"); //マス目の列を取得
  let col = square.data("col"); //マス目の行を取得

  changeOwnerOppositeUpper(row,col); //上方向
  changeOwnerOppositeLower(row,col); //下方向
  changeOwnerOppositeLeft(row,col); //左方向
  changeOwnerOppositeRight(row,col); //右方向
  changeOwnerOppositeLowerRight(row,col); //右下方向
  changeOwnerOppositeLowerLeft(row,col); //左下方向
  changeOwnerOppositeUpperRight(row,col); //右上方向
  changeOwnerOppositeUpperLeft(row,col); //左上方向
}

//下方向のピースをめくる処理
function changeOwnerOppositeLower(row,col){
  let changesquare = 0;
  //下方向にある自分の色のピースを取得
  let endPos = getPosOppositeLower(row,col);
  //下方向に自分の色のピースがなかったら終わる
  if(endPos == null){
    return;
  }

  let targetCol = col;

  //ピースをめくる
  for(let targetRow = row+1; targetRow < endPos.row; targetRow++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    changesquare++;
    putPiece(targetSquare,getTurnString());
  }

  premove.lower = changesquare;
}

function getPosOppositeLower(row, col) {
    //選択されたマスが一番下の場合めくるピースは存在しない
    if(row == 7){
      return null;
    }

    let targetRow = row + 1 ;
    let targetCol = col;

    //選択したピースの下が相手のピースでないとめくるピースは存在しない
    if(getSquareStatus(targetRow,targetCol) != SQUARE_STATUS_IS_OTHER){
      return null;
    }

    for(targetRow++; targetRow<=7; targetRow++){
      let status = getSquareStatus(targetRow,targetCol);

      //選択されていないマスに到達したらめくるピースは存在しない
      if(status == SQUARE_STATUS_NOT_SELECTED){
        return null;
      }

      //自分のピースに到達したらそのピースのインデックスを返す
      if(status == SQUARE_STATUS_IS_OWNED){
        return {
          row: targetRow,
          col: targetCol,
        };
      }
    }
    //下方向に相手のピースしかなかった場合めくるピースが存在しない
    return null;
}

//上方向のピースをめくる処理
function changeOwnerOppositeUpper(row,col){
  let changesquare = 0;
  //上方向にある自分の色のピースを取得
  let endPos = getPosOppositeUpper(row,col);
  //上方向に自分の色のピースがなかったら終わる
  if(endPos == null){
    return;
  }

  let targetCol = col;

  //ピースをめくる
  for(let targetRow = row-1; targetRow > endPos.row; targetRow--){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    changesquare++;
    putPiece(targetSquare,getTurnString());
  }

  premove.upper = changesquare;
}

function getPosOppositeUpper(row, col) {
    //選択されたマスが一番上の場合めくるピースは存在しない
    if(row == 0){
      return null;
    }

    let targetRow = row - 1 ;
    let targetCol = col;

    //選択したピースの上が相手のピースでないとめくるピースは存在しない
    if(getSquareStatus(targetRow,targetCol) != SQUARE_STATUS_IS_OTHER){
      return null;
    }

    for(targetRow--; targetRow>=0; targetRow--){
      let status = getSquareStatus(targetRow,targetCol);

      //選択されていないマスに到達したらめくるピースは存在しない
      if(status == SQUARE_STATUS_NOT_SELECTED){
        return null;
      }

      //自分のピースに到達したらそのピースのインデックスを返す
      if(status == SQUARE_STATUS_IS_OWNED){
        return {
          row: targetRow,
          col: targetCol,
        };
      }
    }
    //上方向に相手のピースしかなかった場合めくるピースが存在しない
    return null;
}

//左方向のピースをめくる処理
function changeOwnerOppositeLeft(row,col){
  let changesquare = 0;
  //左方向にある自分の色のピースを取得
  let endPos = getPosOppositeLeft(row,col);
  //左方向に自分の色のピースがなかったら終わる
  if(endPos == null){
    return;
  }

  let targetRow = row;

  //ピースをめくる
  for(let targetCol = col-1; targetCol > endPos.col; targetCol--){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    changesquare++;
    putPiece(targetSquare,getTurnString());
  }

  premove.left = changesquare;
}

function getPosOppositeLeft(row, col) {
    //選択されたマスが一番左の場合めくるピースは存在しない
    if(col == 0){
      return null;
    }

    let targetRow = row;
    let targetCol = col - 1;

    //選択したピースの左が相手のピースでないとめくるピースは存在しない
    if(getSquareStatus(targetRow,targetCol) != SQUARE_STATUS_IS_OTHER){
      return null;
    }

    for(targetCol--; targetCol>=0; targetCol--){
      let status = getSquareStatus(targetRow,targetCol);

      //選択されていないマスに到達したらめくるピースは存在しない
      if(status == SQUARE_STATUS_NOT_SELECTED){
        return null;
      }

      //自分のピースに到達したらそのピースのインデックスを返す
      if(status == SQUARE_STATUS_IS_OWNED){
        return {
          row: targetRow,
          col: targetCol,
        };
      }
    }
    //左方向に相手のピースしかなかった場合めくるピースが存在しない
    return null;
}

//右方向のピースをめくる処理
function changeOwnerOppositeRight(row,col){
  let changesquare = 0;
  //右方向にある自分の色のピースを取得
  let endPos = getPosOppositeRight(row,col);
  //右方向に自分の色のピースがなかったら終わる
  if(endPos == null){
    return;
  }

  let targetRow = row;

  //ピースをめくる
  for(let targetCol = col+1; targetCol < endPos.col; targetCol++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    changesquare++;
    putPiece(targetSquare,getTurnString());
  }

  premove.right = changesquare;
}

function getPosOppositeRight(row, col) {
    //選択されたマスが一番右の場合めくるピースは存在しない
    if(col == 7){
      return null;
    }

    let targetRow = row;
    let targetCol = col + 1;

    //選択したピースの右が相手のピースでないとめくるピースは存在しない
    if(getSquareStatus(targetRow,targetCol) != SQUARE_STATUS_IS_OTHER){
      return null;
    }

    for(targetCol++; targetCol<=7; targetCol++){
      let status = getSquareStatus(targetRow,targetCol);

      //選択されていないマスに到達したらめくるピースは存在しない
      if(status == SQUARE_STATUS_NOT_SELECTED){
        return null;
      }

      //自分のピースに到達したらそのピースのインデックスを返す
      if(status == SQUARE_STATUS_IS_OWNED){
        return {
          row: targetRow,
          col: targetCol,
        };
      }
    }
    //右方向に相手のピースしかなかった場合めくるピースが存在しない
    return null;
}

//左下方向のピースをめくる処理
function changeOwnerOppositeLowerLeft(row,col){
  let changesquare = 0;
  //左下方向にある自分の色のピースを取得
  let endPos = getPosOppositeLowerLeft(row,col);
  //左下方向に自分の色のピースがなかったら終わる
  if(endPos == null){
    return;
  }

  let targetCol = col;
  let targetRow = row;

  //ピースをめくる
  for(targetRow = row + 1, targetCol =col - 1; 
      targetRow < endPos.row, targetCol > endPos.col; 
      targetRow++, targetCol--){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    changesquare++;
    putPiece(targetSquare,getTurnString());
  }

  premove.lowerleft = changesquare;
}

function getPosOppositeLowerLeft(row, col) {
    //選択されたマスが一番下か一番左の場合めくるピースは存在しない
    if(row == 7 || col == 0){
      return null;
    }

    let targetRow = row + 1 ;
    let targetCol = col - 1;

    //選択したピース左下が相手のピースでないとめくるピースは存在しない
    if(getSquareStatus(targetRow,targetCol) != SQUARE_STATUS_IS_OTHER){
      return null;
    }

    for(targetRow++, targetCol--; 
        targetRow<=7, targetCol>=0; 
        targetRow++, targetCol--){
      let status = getSquareStatus(targetRow,targetCol);

      //選択されていないマスに到達したらめくるピースは存在しない
      if(status == SQUARE_STATUS_NOT_SELECTED){
        return null;
      }

      //自分のピースに到達したらそのピースのインデックスを返す
      if(status == SQUARE_STATUS_IS_OWNED){
        return {
          row: targetRow,
          col: targetCol,
        };
      }
    }
    //左下方向に相手のピースしかなかった場合めくるピースが存在しない
    return null;
}

//右下方向のピースをめくる処理
function changeOwnerOppositeLowerRight(row,col){
  let changesquare = 0;
  //右下方向にある自分の色のピースを取得
  let endPos = getPosOppositeLowerRight(row,col);
  //右下方向に自分の色のピースがなかったら終わる
  if(endPos == null){
    return;
  }

  let targetCol = col;
  let targetRow = row;

  //ピースをめくる
  for(targetRow = row + 1, targetCol = col + 1; 
      targetRow < endPos.row, targetCol < endPos.col; 
      targetRow++, targetCol++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    changesquare++;
    putPiece(targetSquare,getTurnString());
  }

  premove.lowerright = changesquare;
}

function getPosOppositeLowerRight(row, col) {
    //選択されたマスが一番下か一番右の場合めくるピースは存在しない
    if(row == 7 || col == 7){
      return null;
    }

    let targetRow = row + 1 ;
    let targetCol = col + 1;

    //選択したピース左下が相手のピースでないとめくるピースは存在しない
    if(getSquareStatus(targetRow,targetCol) != SQUARE_STATUS_IS_OTHER){
      return null;
    }

    for(targetRow++, targetCol++; 
        targetRow<=7, targetCol<=7; 
        targetRow++, targetCol++){
      let status = getSquareStatus(targetRow,targetCol);

      //選択されていないマスに到達したらめくるピースは存在しない
      if(status == SQUARE_STATUS_NOT_SELECTED){
        return null;
      }

      //自分のピースに到達したらそのピースのインデックスを返す
      if(status == SQUARE_STATUS_IS_OWNED){
        return {
          row: targetRow,
          col: targetCol,
        };
      }
    }
    //右下方向に相手のピースしかなかった場合めくるピースが存在しない
    return null;
}

//左上方向のピースをめくる処理
function changeOwnerOppositeUpperLeft(row,col){
  let changesquare = 0;
  //左上方向にある自分の色のピースを取得
  let endPos = getPosOppositeUpperLeft(row,col);
  //左上方向に自分の色のピースがなかったら終わる
  if(endPos == null){
    return;
  }

  let targetCol = col;
  let targetRow = row;

  //ピースをめくる
  for(targetRow = row - 1, targetCol =col - 1; 
      targetRow > endPos.row, targetCol > endPos.col; 
      targetRow--, targetCol--){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    changesquare++;
    putPiece(targetSquare,getTurnString());
  }

  premove.upperleft = changesquare;
}

function getPosOppositeUpperLeft(row, col) {
    //選択されたマスが一番上か一番左の場合めくるピースは存在しない
    if(row == 0 || col == 0){
      return null;
    }

    let targetRow = row - 1 ;
    let targetCol = col - 1;

    //選択したピース左下が相手のピースでないとめくるピースは存在しない
    if(getSquareStatus(targetRow,targetCol) != SQUARE_STATUS_IS_OTHER){
      return null;
    }

    for(targetRow--, targetCol--; 
        targetRow>=0, targetCol>=0; 
        targetRow--, targetCol--){
      let status = getSquareStatus(targetRow,targetCol);

      //選択されていないマスに到達したらめくるピースは存在しない
      if(status == SQUARE_STATUS_NOT_SELECTED){
        return null;
      }

      //自分のピースに到達したらそのピースのインデックスを返す
      if(status == SQUARE_STATUS_IS_OWNED){
        return {
          row: targetRow,
          col: targetCol,
        };
      }
    }
    //左上方向に相手のピースしかなかった場合めくるピースが存在しない
    return null;
}

//右上方向のピースをめくる処理
function changeOwnerOppositeUpperRight(row,col){
  let changesquare = 0;
  //右上方向にある自分の色のピースを取得
  let endPos = getPosOppositeUpperRight(row,col);
  //右上方向に自分の色のピースがなかったら終わる
  if(endPos == null){
    return;
  }

  let targetCol = col;
  let targetRow = row;

  //ピースをめくる
  for(targetRow = row - 1, targetCol =col + 1; 
      targetRow > endPos.row, targetCol < endPos.col; 
      targetRow--, targetCol++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    changesquare++;
    putPiece(targetSquare,getTurnString());
  }

  premove.upperright = changesquare;
}

function getPosOppositeUpperRight(row, col) {
    //選択されたマスが一番上か一番右の場合めくるピースは存在しない
    if(row == 0 || col == 7){
      return null;
    }

    let targetRow = row - 1 ;
    let targetCol = col + 1;

    //選択したピース右下が相手のピースでないとめくるピースは存在しない
    if(getSquareStatus(targetRow,targetCol) != SQUARE_STATUS_IS_OTHER){
      return null;
    }

    for(targetRow--, targetCol++; 
        targetRow>=0, targetCol<=7; 
        targetRow--, targetCol++){
      let status = getSquareStatus(targetRow,targetCol);

      //選択されていないマスに到達したらめくるピースは存在しない
      if(status == SQUARE_STATUS_NOT_SELECTED){
        return null;
      }

      //自分のピースに到達したらそのピースのインデックスを返す
      if(status == SQUARE_STATUS_IS_OWNED){
        return {
          row: targetRow,
          col: targetCol,
        };
      }
    }
    //右上方向に相手のピースしかなかった場合めくるピースが存在しない
    return null;
}

//引数のマスの状態を返す
function getSquareStatus(row, col) {
  // マスを取得する
  let targetSquare = getTargetSquare(row, col);

  // selectedクラスを持っていなければ未選択
  if (!targetSquare.hasClass("selected")) {
    return SQUARE_STATUS_NOT_SELECTED;
  }

  // 自分が所有している
  if (getTurnString() == targetSquare.attr("data-owner")) {
    return SQUARE_STATUS_IS_OWNED;
  }

  // 相手が所有している
  return SQUARE_STATUS_IS_OTHER;
}

function wait(){
  premove.true = false;
  premove.square.text("").removeAttr("data-owner").removeClass("selected").removeClass("now");
  let row = premove.row;
  let col = premove.col;

  waitLower(row,col);
  waitUpper(row,col);
  waitRight(row,col);
  waitLeft(row,col);
  waitLowerRight(row,col);
  waitLowerLeft(row,col);
  waitUpperRight(row,col);
  waitUpperLeft(row,col);

  changeTurn();
  toastinfo();
}

function waitLower(row,col){
  if(premove.lower == 0){
    return;
  }

  let targetCol = col;
  let targetRow = row + 1;

  for(let i=0; i<premove.lower; i++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    targetSquare.removeAttr("data-owner");
    targetSquare.attr("data-owner", premove.owner);
    targetRow++;
  }
}

function waitUpper(row,col){
  if(premove.upper == 0){
    return;
  }

  let targetCol = col;
  let targetRow = row - 1;

  for(let i=0; i<premove.upper; i++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    targetSquare.removeAttr("data-owner");
    targetSquare.attr("data-owner", premove.owner);
    targetRow--;
  }
}

function waitRight(row,col){
  if(premove.right == 0){
    return;
  }

  let targetCol = col + 1;
  let targetRow = row;

  for(let i=0; i<premove.right; i++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    targetSquare.removeAttr("data-owner");
    targetSquare.attr("data-owner", premove.owner);
    targetCol++;
  }
}

function waitLeft(row,col){
  if(premove.left == 0){
    return;
  }

  let targetCol = col - 1;
  let targetRow = row;

  for(let i=0; i<premove.left; i++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    targetSquare.removeAttr("data-owner");
    targetSquare.attr("data-owner", premove.owner);
    targetCol--;
  }
}

function waitLowerRight(row,col){
  if(premove.lowerright == 0){
    return;
  }

  let targetCol = col + 1;
  let targetRow = row + 1;

  for(let i=0; i<premove.lowerright; i++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    targetSquare.removeAttr("data-owner");
    targetSquare.attr("data-owner", premove.owner);
    targetRow++;
    targetCol++;
  }
}

function waitLowerLeft(row,col){
  if(premove.lowerleft == 0){
    return;
  }

  let targetCol = col - 1;
  let targetRow = row + 1;

  for(let i=0; i<premove.lowerleft; i++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    targetSquare.removeAttr("data-owner");
    targetSquare.attr("data-owner", premove.owner);
    targetRow++;
    targetCol--;
  }
}

function waitUpperRight(row,col){
  if(premove.upperright == 0){
    return;
  }

  let targetCol = col + 1;
  let targetRow = row - 1;

  for(let i=0; i<premove.upperright; i++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    targetSquare.removeAttr("data-owner");
    targetSquare.attr("data-owner", premove.owner);
    targetRow--;
    targetCol++;
  }
}

function waitUpperLeft(row,col){
  if(premove.upperleft == 0){
    return;
  }

  let targetCol = col - 1;
  let targetRow = row - 1;

  for(let i=0; i<premove.upperleft; i++){
    let targetSquare = getTargetSquare(targetRow,targetCol);
    targetSquare.removeAttr("data-owner");
    targetSquare.attr("data-owner", premove.owner);
    targetRow--;
    targetCol--;
  }
}

function vs(){
  let vsbtn = document.getElementById('vs');
  let you = document.getElementById('you');
  let com = document.getElementById('com');
  let color = document.getElementById('color');
  let power = document.getElementById('power');

  initializeEvent();
  toastr.remove();
  if(vsbtn.checked){
    computer.true = true;
    computer.color = comcolor();
    you.classList.add("vsout");
    com.classList.remove("vsout");
    color.classList.remove("vsout");
    power.classList.remove("vsout");
  }else{
    com.classList.add("vsout");
    you.classList.remove("vsout");
    color.classList.add("vsout");
    power.classList.add("vsout");
  }
  toastinfo()
}

function vscolor(){
  let vsbtn = document.getElementById('vscolor');
  let you_black = document.getElementById('you_color_black');
  let you_white = document.getElementById('you_color_white');
  let com_black = document.getElementById('com_color_black');
  let com_white = document.getElementById('com_color_white');

  initializeEvent();
  toastr.remove();
  computer.true = true;

  if(vsbtn.checked){
    you_black.classList.add("vsout");
    com_white.classList.add("vsout");
    you_white.classList.remove("vsout");
    com_black.classList.remove("vsout");
    setTimeout(function(){
      com();
    },1000);
  }else{
    you_black.classList.remove("vsout");
    com_white.classList.remove("vsout");
    you_white.classList.add("vsout");
    com_black.classList.add("vsout");
  }

  computer.color = comcolor();
  toastinfo();
}

function vspower(){
  let vsbtn = document.getElementById('vspower');
  let low = document.getElementById('com_power_low');
  let high = document.getElementById('com_power_high');

  if(vsbtn.checked){
    alert("ただいま、調整中");
    vsbtn.checked = false;
    return;
    low.classList.add("vsout");
    high.classList.remove("vsout");
    computer.power = "high";
  }else{
    low.classList.remove("vsout");
    high.classList.add("vsout");
    computer.power = "low";
  }

  setTimeout(function(){
    com();
  },1000);

  computer.color = comcolor();
  toastinfo();
}

function comcolor(){
  let vsbtn = document.getElementById('vscolor');

  if(vsbtn.checked){
    return "black";
  }else{
    return "white";
  }
}

function nowsupport(){
  let now_btn = document.getElementById('NowSupport');
  if(premove.true){
    if(now_btn.checked){
      premove.square.addClass("now");
    }
    else{
      premove.square.removeClass("now");
    }
  }
}

function com(){
  let now_btn = document.getElementById('NowSupport');
  let i = 0;
  const com_can = [];
  for(let row = 0; row < 8; row++){
    for(let col = 0;col < 8; col++){
      let square = getTargetSquare(row,col);
      if(square.hasClass("can-select")){
        com_can[i] = square;
        i++;
      }
    }
  }
  let put = Math.floor( Math.random() * i );
  changeOwner(com_can[put]);
  if(now_btn.checked){
    com_can[put].addClass("now");
  }
  toastinfo();
}

document.querySelector('#btn-initialize').addEventListener('click',(e)=>{
  premove.square.removeClass("now");
  let vsbtn = document.getElementById('vs');
  let vsbtn2 = document.getElementById('vscolor');
  vsbtn.checked = false;
  vsbtn2.checked = false;
  vs();
  initializeEvent();
});

document.querySelector('#wait').addEventListener('click',(e)=>{
  if(computer.true){
    alert("コンピューター対戦では「待った」は無効です");
    return;
  }
  if(premove.true){
    wait();
  }else{
    alert('もう戻れません');
    return;
  }
});

let checkbutton1 = document.getElementById('BlackSupport');
let checkbutton2 = document.getElementById('WhiteSupport');
let checkbutton3 = document.getElementById('CountSupport');
let checkbutton4 = document.getElementById('vs');
let checkbutton5 = document.getElementById('vscolor');
let checkbutton6 = document.getElementById('NowSupport');
let checkbutton7 = document.getElementById('vspower');

checkbutton1.addEventListener('change',cancant);
checkbutton2.addEventListener('change',cancant);
checkbutton3.addEventListener('change',toastinfo);
checkbutton4.addEventListener('change',vs);
checkbutton5.addEventListener('change',vscolor);
checkbutton6.addEventListener('change',nowsupport);
checkbutton7.addEventListener('change',vspower);
