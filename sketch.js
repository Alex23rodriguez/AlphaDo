let turn = 0;
let phase = 0;
let startB = [];

let fichas = [];
let misFichas = [];
let buttons = [];
let fichaCount = [7,7,7,7]

let empty = [[],[],[],[]];

let ambiButton = [];

let board = undefined;

names = {0:"you", 1:"right", 2:"your teammate", 3:"left"}

function setup() {
    createCanvas(window.windowWidth, window.windowHeight);
    let x = width/7;
    let y = height/4*0.8;
    let z = 0;
    for(let i=0;i<7;i++){
        buttons.push([]);
        for(let j=i;j<7;j++){
            let l = [i,j];
            fichas.push(l);
            buttons[l] = createButton(i+"  "+j).position(x*(z%7), y*int(z/7)).size(x,y);
            buttons[l].mousePressed(function(){
                if(canClick(l)){
                    this.hide();
                    if(phase==2){
                        fichaCount[turn]-=1;
                    }
                    decide(l);
                }
            });
            z++;
        }
    }

    ambiButton.push(createButton("Left value").position(width*.4, height*.9).size(60,20));
    ambiButton.push(createButton("Right value").position(width*.6, height*.9).size(60,20));
    for(b of ambiButton){
        b.hide();
    }

    info();
    //drawBoard();
}

function startingP(t){
    return function(){
        for(b of startB){
            b.hide();
        }
        turn = t-1;
        phase=2;
        createButton("PASS").position(width*0.8, height*0.9).size(80,20).mousePressed(pass);
        decide();
    }
}

function pass(){
    let emp = new Set(empty[turn]);
    emp.add(board[0]);
    emp.add(board[1]);
    empty[turn] = [...emp];
    decide()
}

function canClick(l){
    if(phase<2 || board==undefined){
        return abs(phase)==1 ? false : true;
    }
    return board.includes(l[0]) || board.includes(l[1]);
}

function info(){
    background(0);
    fill(255);
    let s;
    if(phase==0){
        s = "Pick "+(7-turn)+" stones";
    }else if(phase==1){
        s = "Who started?"
    }else if(phase==2){
        s = "What did "+names[turn]+" place?" 
    }else if(phase==-1){
        s = "Which number was connected?"
    }
    text(s,30, height*0.9)
    if(board){
        text(board, 30, height*0.95);
        text(fichaCount, 30, height*0.85);
    }
}

function decide(l){
    if(phase==0){
        turn++;
        misFichas.push(l);
        if(turn==7){
            phase = 1;
            turn = 0;
            startB.push(createButton("Me").position(width/2, height*0.95).size(60,20).mousePressed(startingP(0)));
            startB.push(createButton("Right").position(width*0.6, height*0.9).size(60,20).mousePressed(startingP(1)));
            startB.push(createButton("Team").position(width/2, height*0.85).size(60,20).mousePressed(startingP(2)));
            startB.push(createButton("Left").position(width*0.4, height*0.9).size(60,20).mousePressed(startingP(3)));
        }
    }else if(phase==2){
        if(l){
            fichas.splice(fichas.indexOf(l),1);
            if(!board){
                board = l;
            }else{
                updateBoard(l);
            }
        }
        turn++;
        turn%=4;
        if(turn==0){
            for(let l_ of fichas){
                if(misFichas.includes(l_)){
                    buttons[l_].show();
                }
                else{
                    buttons[l_].hide();
                }
            }
        }else if(turn==1){
            for(l_ of fichas){
                if(misFichas.includes(l_)){
                    buttons[l_].hide()
                }
                else{
                    buttons[l_].show();
                }
            }
        }
    }else if(phase==-1){
        
        ambiButton[0].show();
        ambiButton[0].elt.innerHTML = l[0];
        ambiButton[0].mousePressed(function(){
            board[board.indexOf(l[0])] = l[1];
            ambiButton[0].hide();
            ambiButton[1].hide();
            phase=2;
        });
        ambiButton[1].show();
        ambiButton[1].elt.innerHTML = l[1];
        ambiButton[1].mousePressed(function(){
            board[board.indexOf(l[1])] = l[0];
            ambiButton[0].hide();
            ambiButton[1].hide();
            phase=2;
        }); 

    }
}

function updateBoard(l){
    if(board[0]==board[1]){
        if(board[0]==l[0]){
            board[0] = l[1];
        }else{
            board[0] = l[0];
        }
        return;
    }
    if(board[0]==l[0]){
        if(board[1]==l[1]){
            phase = -1;
            console.log("oh no!");
            decide(l);
        }else{
            board[0] = l[1];
        }
    }else if(board[0]==l[1]){
        if(board[1]==l[0]){
            phase = -1;
            console.log("oh no!");
            decide(l);
        }else{
            board[0] = l[0];
        }
    }else if(board[1]==l[0]){
        board[1] = l[1];
    }else{
        board[1] = l[0];
    }
}

function mousePressed(){
    background(0);
    info();
}

const setDifference = (a, b) => new Set([...a].filter(x => !b.has(x)));

function validHand(hand, empty){
    for(i in hand){
        let nums = new Set();
        for(s of hand[i]){
            nums.add(s[0]);
            nums.add(s[1]);
        }
        for(n of empty[i]){
            if(nums.has(n)){
                return false;
            }
        }
    }
    return true;
}

function draw() {

}


/*
function hands_old(nums, count) {
    var numset = new Set(nums);
    var choose = [];
    var conf = [];
    for (let i = 0; i < count[0]; i++) {
        conf.push(i);
    }
    var i = count[0] - 1;
    while (true) {
        while (conf[i] < nums.length) {
            var n = [];
            for (let j of conf) {
                n.push(nums[j]);
            }
            if (count.length > 1) {
                var n2 = new Set(n);
                var t = [...setDifference(numset, n2)];

                for (j of hands_old(t, count.slice(1))) {
                    choose.push([n, ...j]);
                }
            } else {
                choose.push([n]);
            }
            conf[i] += 1;
        }
        i -= 1
        while (i >= 0 && conf[i] + 1 == conf[i + 1]) {
            i -= 1;
        }
        if (i == -1) {
            break;
        }
        conf[i] = conf[i] + 1;
        while (i < count[0] - 1) {
            conf[i + 1] = conf[i] + 1;
            i += 1;
        }
    }
    return choose;
}

function numInHand(hand, num){
    for(s of hand){
        if(num==s[0] || num==s[1]){
            return true;
        }
    }
    return false;
}

function reduceHands(hands, empty){
    let trimmed = [];
    for(hand of hands){
        if(validHand(hand, empty)){
            trimmed.push(hand);
        }
    }
    return(trimmed);
}
*/

/*
function drawBoard(){
    background(0)
    let x = width/7*0.9;
    let y = height/4*0.8;
    let z = 0;
    fill(0);
    for(let i=0;i<7;i++){
        for(let j=i;j<7;j++){

            if(fichas[""+i+j]){
                rect(x*(z%7), y*int(z/COUNT), x, y);
            }
            text(i,x*(z%7+.25),y*(int(z/COUNT)+.5));
            text(j,x*(z%7+.75),y*(int(z/COUNT)+.5));
            z++;
        }
    }
    text(info(), 10, height-40)
}
*/