var used = [[],[],[],[]];
var dran;
var moves;
var wins;
var CHAIN;

var pr = true;

//recursive
function play_wrapper(ps, start, chain){
    //global moves, wins, TIME, CHAIN, PLAYERS
    moves = make_moves(ps);
    wins = [0,0,0,0,0];
    
    u = [new Set(),new Set(),new Set(),new Set()];
    let [p, i] = find_st(ps, ...start);
    CHAIN = [ps[p][i]];
    u[p].add(int(i));
    
    let TIME = new Date();
    if(chain){
        play_r_ch(start, (p+1)%4, u, p);
    }else{
        play_r(start, (p+1)%4, u, p);
    }
    TIME = new Date() - TIME;
    if(pr){
        let sum = wins.reduce((a, b) => a + b, 0);
        console.log('Games played:' + sum);
        console.log('Time: ' + TIME);
        console.log('Results:');
        for(let i of wins){
            console.log(i/sum*100);
        }
    }
    return wins
}

function play_r(b, p, u, last){
    let st = moves[p][b[0]].slice();
    for(let s=st.length-1;s>-1;s--){
        if(u[p].has(st[s][0])){
            st.splice(s,1);
        }
    }
    let left = st.length;
    
    if(b[0]!=b[1]){
        st = Array.prototype.concat(st,moves[p][b[1]]);
    }
    for(let s=st.length-1;s>left-1;s--){
        if(u[p].has(st[s][0])){
            st.splice(s,1);
        }
    }
            
    if(st.length == 0){
        if(p==last){
            wins[4] += 1;
            //if(sum(wins)%1000000 == 0){
            //    console.log(wins)
            //}
            return;
        }
        play_r(b, (p+1)%4, u, last);  //did not place
    }
    for(let x=0;x<st.length;x++){
        let u2 = [];
        for(i of u){
            u2.push(new Set(i));
        }
        //console.log(st[x])
        //console.log(st)
        u2[p].add(int(st[x][0]));
        if(u2[p].size == moves[p][-1]){ //number of starting pieces
            wins[p] += 1;
            //if sum(wins)%1000000 == 0:
            //    console.log(wins)
            return;
        }
        b2 = b.slice();
        if(x < left){
            b2[0] = st[x][1];
        }else{
            b2[1] = st[x][1];
        }
		// console.log('TCL: functionplay_r -> b2', b2);
		// console.log('TCL: functionplay_r -> (p+1)%4', (p+1)%4);
		// console.log('TCL: functionplay_r -> u2', u2);
		// console.log('TCL: functionplay_r -> p', p);
        play_r(b2, (p+1)%4, u2, p);
		// console.log('TCL: functionplay_r -> b2', b2);
		// console.log('TCL: functionplay_r -> (p+1)%4', (p+1)%4);
		// console.log('TCL: functionplay_r -> u2', u2);
		// console.log('TCL: functionplay_r -> p', p);
    }
}

function find_st(ps, a, b){  // could intergrate moves
    for(let p=0;p<4;p++){
        for(i in ps[p]){
            if(a==ps[p][i][0] && b==ps[p][i][1]){
                return [p, i];
            }
            if(a==ps[p][i][1] && b==ps[p][i][0]){
                return [p, i];
            }
        }
    }
}
function make_moves(ps){
    let m = {};
    for(let e in ps){ //players
        let pl = ps[e];
        m[e] = {};
        for(let i=0;i<7;i++){ //nums
            m[e][i] = [];
            m[e][-1] = pl.length; //number of starting pieces
            for(let j=0;j<pl.length;j++){ //st
                if(pl[j][0] == i){
                    m[e][i].push([j, pl[j][1]]);
                }else if(pl[j][1] == i){
                    m[e][i].push([j, pl[j][0]]);
                }
            }
        }
    }
    return m;
}

function pprint(ps){
    for(p of ps){
        console.log(p)
    }
}


function play_r_ch(b, p, u, last){
    //global wins, ps_, CHAIN
    
    st = moves[p][b[0]].slice();

    for(let s=st.length-1;s>-1;s--){
        if(u[p].has(st[s][0])){
            st.splice(s,1);
        }
    }
            
    left = st.length;
    
    if(b[0]!=b[1]){
        st = Array.prototype.concat(st,moves[p][b[1]]);
    }
    for(let s=st.length-1;s>left-1;s--){
        if(u[p].has(st[s][0])){
            st.splice(s,1);
        }
    }

    if(st.length == 0){
        if(p==last){
            console.log([CHAIN, 'Stuck']);
            wins[4] += 1;
            //if(sum(wins)%1000000 == 0){
            //    console.log(wins)
            //}
            return;
        }
        CHAIN.push(undefined);
        play_r_ch(b, (p+1)%4, u, last);  //did not place
        CHAIN.pop();
    }
            
    for(let x=0;x<st.length;x++){
        let u2 = [];
        for(i of u){
            u2.push(new Set(i));
        }
        u2[p].add(int(st[x][0]));
        if(u2[p].size == moves[p][-1]){ //number of starting pieces
            if(x<left){
                CHAIN.push([ps_[p][st[x][0]], 'l']);
            }else{
                CHAIN.push([ps_[p][st[x][0]], 'r']);
            }
            wins[p] += 1;
            console.log(CHAIN, p);
            CHAIN.pop();
            return;
        }
        b2 = b.slice();
        if(x < left){
            b2[0] = st[x][1];
            CHAIN.push((ps_[p][st[x][0]], 'l'));
        }else{
            b2[1] = st[x][1];
            CHAIN.push((ps_[p][st[x][0]], 'r'))
        }
        play_r_ch(b2, (p+1)%4, u2, p);
        CHAIN.pop();
    }
}

function hands(stones, count, empty) {
    var stoneset = new Set(stones);
    var choose = [];
    var conf = [];
    for (let i = 0; i < count[0]; i++) {
        conf.push(i);
    }
    var i = count[0] - 1;
    while (true) {
        while (conf[i] < stones.length) {
            var n = [];
            for (let j of conf) {
                n.push(stones[j]);
            }

            if(!validHand([n], [empty[0]])){
                conf[i]+=1;
                continue;
            }

            if (count.length > 1) {
                var n2 = new Set(n);
                var t = [...setDifference(stoneset, n2)];

                for (j of hands(t, count.slice(1), empty.slice(1))) {
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

//brute
/*

function turn2(p, b){
    let st = moves[p][b[0]].slice();
    for(let s=st.length-1;s>-1;s--){
        if(used[p].includes(st[s][0])){
            st.splice(s, 1);
        }
    }
    let left = st.length;
    
    if(board[0]!=board[1]){
        st = st.concat(moves[p][b[1]]);
    }
    for(let s=st.length-1;s>left-1;s--){
        if(used[p].includes(st[s][0])){
            st.splice(s,1);
        }
    }

    if(st.length == 0){ //did not place
        return [b, false];
    }
    
    let x = int(random(st.length));
    
    used[p].push(st[x][0]) //use up index
    if(x < left){
        b[0] = st[x][1];
    }else{
        b[1] = st[x][1];
    }
    return [b, true];        //did place
}

function choose(st){
    //## random
    x = st[int(random(st.length))];
    //## order
    // x = st[0]
    return x
}

function play(ps, b, start, pr=false){
    //global moves
    //global dran, used
    used = [[],[],[],[]];
    let [dran, i] = find(ps, ...start);
    used[dran].push(i);

    last = dran
    while(true){
        dran = (dran+1)%4;
        [b, placed] = turn2(dran, b, pr);
        if(placed && used[dran].length==moves[dran][-1]){ // finished
            if(pr){
                console.log(used);
            }
            return dran;
        }
        if(placed){
            last = dran;
        }else if(last==dran){ // stuck
            if(pr){
                console.log(used);
            }
            return -1;
        }
    }
}

function play_n(ps_, games=10000, pr=false){
    //global moves
    moves = make_moves(ps_);
    wins = [0,0,0,0,0];
    for(i=0;i<games;i++){
        let ps = [];
        for(p of ps_){
            ps.push(p.slice());
        }
        wins[play(ps, pr)] += 1  // play the game
    }
    for(i of wins){
        console.log(round(i/games*100,2));
    }
}
*/