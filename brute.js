var used = [[], [], [], []];
var dran;
var moves;
var wins;
var totalWins;
var CHAIN;

var probability = 0;

var pr = false;

//recursive
function play_wrapper(ps, start, board, chain) {
  moves = make_moves(ps);
  wins = [0, 0, 0, 0, 0];

  u = [new Set(), new Set(), new Set(), new Set()];
  let [p, i] = find_st(ps, ...start);

  CHAIN = [ps[p][i]];
  u[p].add(int(i));

  if (board) {
    //NOTE: if a board is passed, will always asume you want to place start[0]
    if (board[0] == start[0]) {
      board[0] = start[1];
    } else if (board[1] == start[0]) {
      board[1] = start[1];
    } else {
      console.log("You can't call wrapper with this piece!");
      return;
    }
  }

  let TIME = new Date();
  if (chain) {
    play_r_ch(board || start, (p + 1) % 4, u, p);
  } else {
    play_r(board || start, (p + 1) % 4, u, p);
  }
  TIME = new Date() - TIME;
  if (pr || random() < probability) {
    let sum = wins.reduce((a, b) => a + b, 0);
    console.log('TCL: functionplay_wrapper -> probability', probability);
    probability /= 10;

    console.log('Games played:' + sum);
    console.log('Time: ' + TIME);
    console.log('Results:');
    for (let i of wins) {
      console.log((i / sum) * 100);
    }
  }
  return wins;
}

function play_r(b, p, u, last) {
  let st = moves[p][b[0]].slice();
  for (let s = st.length - 1; s > -1; s--) {
    if (u[p].has(st[s][0])) {
      st.splice(s, 1);
    }
  }
  let left = st.length;

  if (b[0] != b[1]) {
    st = Array.prototype.concat(st, moves[p][b[1]]);
  }
  for (let s = st.length - 1; s > left - 1; s--) {
    if (u[p].has(st[s][0])) {
      st.splice(s, 1);
    }
  }

  if (st.length == 0) {
    if (p == last) {
      wins[4] += 1;
      //if(sum(wins)%1000000 == 0){
      //    console.log(wins)
      //}
      return;
    }
    play_r(b, (p + 1) % 4, u, last); //did not place
  }
  for (let x = 0; x < st.length; x++) {
    let u2 = [];
    for (i of u) {
      u2.push(new Set(i));
    }
    u2[p].add(int(st[x][0]));
    if (u2[p].size == moves[p][-1]) {
      //number of starting pieces
      wins[p] += 1;
      //if sum(wins)%1000000 == 0:
      //    console.log(wins)
      return;
    }
    b2 = b.slice();
    if (x < left) {
      b2[0] = st[x][1];
    } else {
      b2[1] = st[x][1];
    }
    play_r(b2, (p + 1) % 4, u2, p);
  }
}

function find_st(ps, a, b) {
  // could intergrate moves
  for (let p = 0; p < 4; p++) {
    for (i in ps[p]) {
      if (a == ps[p][i][0] && b == ps[p][i][1]) {
        return [p, int(i)];
      }
      if (a == ps[p][i][1] && b == ps[p][i][0]) {
        return [p, int(i)];
      }
    }
  }
}

function make_moves(ps) {
  let m = {};
  for (let e in ps) {
    //players
    let pl = ps[e];
    m[e] = {};
    for (let i = 0; i < 7; i++) {
      //nums
      m[e][i] = [];
      m[e][-1] = pl.length; //number of starting pieces
      for (let j = 0; j < pl.length; j++) {
        //st
        if (pl[j][0] == i) {
          m[e][i].push([j, pl[j][1]]);
        } else if (pl[j][1] == i) {
          m[e][i].push([j, pl[j][0]]);
        }
      }
    }
  }
  return m;
}

function pprint(ps) {
  for (p of ps) {
    console.log(p);
  }
}

function play_r_ch(b, p, u, last) {
  //global wins, ps_, CHAIN

  st = moves[p][b[0]].slice();

  for (let s = st.length - 1; s > -1; s--) {
    if (u[p].has(st[s][0])) {
      st.splice(s, 1);
    }
  }

  left = st.length;

  if (b[0] != b[1]) {
    st = Array.prototype.concat(st, moves[p][b[1]]);
  }
  for (let s = st.length - 1; s > left - 1; s--) {
    if (u[p].has(st[s][0])) {
      st.splice(s, 1);
    }
  }

  if (st.length == 0) {
    if (p == last) {
      console.log([CHAIN, 'Stuck']);
      wins[4] += 1;
      //if(sum(wins)%1000000 == 0){
      //    console.log(wins)
      //}
      return;
    }
    CHAIN.push(undefined);
    play_r_ch(b, (p + 1) % 4, u, last); //did not place
    CHAIN.pop();
  }

  for (let x = 0; x < st.length; x++) {
    let u2 = [];
    for (i of u) {
      u2.push(new Set(i));
    }
    u2[p].add(int(st[x][0]));
    if (u2[p].size == moves[p][-1]) {
      //number of starting pieces
      if (x < left) {
        CHAIN.push([ps_[p][st[x][0]], 'l']);
      } else {
        CHAIN.push([ps_[p][st[x][0]], 'r']);
      }
      wins[p] += 1;
      console.log(CHAIN, p);
      CHAIN.pop();
      return;
    }
    b2 = b.slice();
    if (x < left) {
      b2[0] = st[x][1];
      CHAIN.push((ps_[p][st[x][0]], 'l'));
    } else {
      b2[1] = st[x][1];
      CHAIN.push((ps_[p][st[x][0]], 'r'));
    }
    play_r_ch(b2, (p + 1) % 4, u2, p);
    CHAIN.pop();
  }
}

const setDifference = (a, b) => new Set([...a].filter(x => !b.has(x)));

function validHand(hand, empty) {
  for (i in hand) {
    let nums = new Set();
    for (s of hand[i]) {
      nums.add(s[0]);
      nums.add(s[1]);
    }
    for (n of empty[i]) {
      if (nums.has(n)) {
        return false;
      }
    }
  }
  return true;
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

      if (!validHand([n], [empty[0]])) {
        conf[i] += 1;
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
    i -= 1;
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

function generateHands_() {
  // sorts empty desc to optimize choose function, then applies inverse sort!
  let otras = fichas.filter(x => !misFichas.includes(x));

  let em = empty.slice(1); // dont consider player
  let e = em.map(x => x.length);
  //sort both elemets desc, according to the ammount of empty hands
  let count = fichaCount.slice(1);
  count.sort((i, j) => e[count.indexOf(i)] < e[count.indexOf(j)]);
  let em2 = em.slice().sort((i, j) => e[em.indexOf(i)] < e[em.indexOf(j)]);

  let hs = hands(otras, count, em2);
  let sort_inverse = (i, j) => e[h.indexOf(i)] < e[h.indexOf(j)];

  let ans = [];
  for (h of hs) {
    let h2 = h.sort(sort_inverse);
    h2.unshift(misRest);
    ans.push(h2);
  }
  return ans;
}

function generateHands() {
  let otras = fichas.filter(x => !misFichas.includes(x));

  let em = empty.slice(1); // dont consider player
  let hs = hands(otras, fichaCount.slice(1), em);

  let ans = [];
  for (h of hs) {
    h.unshift(misRest);
    ans.push(h);
  }
  return hs;
}

function my_moves(hand, b) {
  if (!hand) {
    hand = misRest;
    b = board.slice();
  }
  let m = [];
  if (b[0] == b[1]) {
    b.pop();
  }
  for (let i of b) {
    //nums
    for (let j = 0; j < hand.length; j++) {
      //st
      if (hand[j][0] == i) {
        m.push([hand[j][0], hand[j][1]]);
      } else if (hand[j][1] == i) {
        m.push([hand[j][1], hand[j][0]]);
      }
    }
  }
  return m;
}

function evalFichas(posHands) {
  let l = posHands.length;
  let iter = min(l, 1000);
  let TIME = new Date();
  let mov = my_moves(misRest, board.slice());
  for (m of mov) {
    console.log('TCL: pieza', m);
    TIME = new Date() - TIME;
    totalWins = [0, 0, 0, 0, 0];
    for (i = 0; i < iter; i++) {
      wins = play_wrapper(posHands[int(random(l))], m.slice(), board.slice());
      totalWins = totalWins.map((n, i) => n + wins[i]);
    }
    let sum = totalWins.reduce((a, b) => a + b, 0);
    console.log('Time: ', TIME);
    let ww = [];
    for (let i of totalWins) {
      ww.push((i / sum) * 100);
    }
    console.log(ww);
  }
}

function evalFichas(posHands, it) {
  it = it || Infinity;
  let l = posHands.length;
  let iter = min(l, it);
  let max = l == iter;
  let TIME = new Date();
  let mov = my_moves(misRest, board.slice());
  for (m of mov) {
    console.log('TCL: pieza', m);
    TIME = new Date() - TIME;
    totalWins = [0, 0, 0, 0, 0];
    for (i = 0; i < iter; i++) {
      if (max) {
        wins = play_wrapper(posHands[i], m.slice(), board.slice());
      } else {
        wins = play_wrapper(posHands[int(random(l))], m.slice(), board.slice());
      }
      totalWins = totalWins.map((n, i) => n + wins[i]);
    }
    let sum = totalWins.reduce((a, b) => a + b, 0);
    console.log('Time: ', TIME);
    let ww = [];
    for (let i of totalWins) {
      ww.push((i / sum) * 100);
    }
    console.log(ww);
  }
}
