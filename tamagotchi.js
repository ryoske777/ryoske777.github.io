(function(){
'use strict';
/* ═══════════════════════════════════════════
   TAMAGOTCHI - 반다이 P1 스타일 웹 버전
   ═══════════════════════════════════════════ */

// ── 스프라이트 (X=검정, .=투명, 12x12 기준) ──
var RAW={
egg:[
'....XXXX....',
'..XX....XX..',
'.X........X.',
'.X..X..X..X.',
'X..........X',
'X..........X',
'X..........X',
'.X..X..X..X.',
'.X........X.',
'..XX....XX..',
'....XXXX....',
'............'
],
babytchi:[
'............',
'....XXXX....',
'..XX....XX..',
'.X.XX.XX..X.',
'.X........X.',
'.X..XXXX..X.',
'..XX....XX..',
'....XXXX....',
'....X..X....',
'...X....X...',
'............',
'............'
],
marutchi:[
'............',
'...XXXXXX...',
'..X......X..',
'.X.XX..XX.X.',
'.X........X.',
'.X...XX...X.',
'.X........X.',
'..X......X..',
'...XXXXXX...',
'...X....X...',
'..X......X..',
'............'
],
tonmarutchi:[
'..X....X....',
'...X..X.....',
'...XXXXXX...',
'..X......X..',
'.X.XX..XX.X.',
'.X........X.',
'.X..X..X..X.',
'..X......X..',
'...XXXXXX...',
'...X....X...',
'............',
'............'
],
tamatchi:[
'....XXXX....',
'...X....X...',
'..XXXXXXXX..',
'.X.XX..XX.X.',
'.X........X.',
'.X...XX...X.',
'.X........X.',
'..XXXXXXXX..',
'....X..X....',
'...X....X...',
'..XX....XX..',
'............'
],
kuchitamatchi:[
'............',
'...XXXXXX...',
'..X......X..',
'.X.XX..XX.X.',
'.X........X.',
'.X........XXX',
'.X........X.',
'..X......X..',
'...XXXXXX...',
'....X..X....',
'...X....X...',
'............'
],
mametchi:[
'.XX......XX.',
'X..X....X..X',
'X..XXXXXX..X',
'..X......X..',
'.X.XX..XX.X.',
'.X........X.',
'.X..XXXX..X.',
'..X......X..',
'...XXXXXX...',
'...X....X...',
'..XX....XX..',
'............'
],
ginjirotchi:[
'..XXXXXXXX..',
'.X........X.',
'X..XX..XX..X',
'X..........X',
'X...XXXX...X',
'X..........X',
'.X........X.',
'..XXXXXXXX..',
'....X..X....',
'...XX..XX...',
'............',
'............'
],
kuchipatchi:[
'...XXXXXX...',
'..X......X..',
'.X.XX..XX.X.',
'.X........X.',
'.X........X.',
'XXXX....XXXX',
'.X........X.',
'..X......X..',
'...XXXXXX...',
'...X....X...',
'..XX....XX..',
'............'
],
nyorotchi:[
'............',
'....XXXX....',
'...X....X...',
'..X.XX.XX...',
'..X......X..',
'...XXXXXX...',
'..X.........',
'.X..........',
'X...........',
'.XXXXXXXXXXX',
'............',
'............'
],
tarakotchi:[
'..XXXXXXXX..',
'.X........X.',
'X.XX....XX.X',
'X..........X',
'X.XXXXXXXX.X',
'.X........X.',
'..XXXXXXXX..',
'...X....X...',
'..XX....XX..',
'.X..XXXX..X.',
'.X........X.',
'..XXXXXXXX..'
],
obaketchi:[
'....XXXX....',
'..XX....XX..',
'.X.XX..XX.X.',
'.X........X.',
'X...XXXX...X',
'X..........X',
'.X........X.',
'..X..XX..X..',
'.X..X..X..X.',
'X..X....X..X',
'.XX......XX.',
'............'
],
poop:[
'............',
'......XX....',
'.....X..X...',
'....X..X....',
'...X..X.....',
'..XXXXXX....',
'.X......X...',
'X.X.XX.X.X..',
'X........X..',
'.XXXXXXXX...',
'............',
'............'
],
heart:[
'.XX...XX....',
'XXXX.XXXX...',
'XXXXXXXXX...',
'XXXXXXXXX...',
'.XXXXXXX....',
'..XXXXX.....',
'...XXX......',
'....X.......',
'............',
'............',
'............',
'............'
],
skull:[
'...XXXXXX...',
'..X......X..',
'.X.XX..XX.X.',
'.X.XX..XX.X.',
'.X........X.',
'..X......X..',
'...XXXXXX...',
'..XXXXXXXX..',
'..X.X..X.X..',
'..XXXXXXXX..',
'............',
'............'
],
zzz:[
'............',
'..XXXXX.....',
'......X.....',
'.....X......',
'....X.......',
'...XXXXX....',
'............',
'....XXX.....',
'.....X......',
'....XXX.....',
'............',
'............'
]
};

// ── 스프라이트 파싱 ──
var sprites={};
function parseSprites(){
  Object.keys(RAW).forEach(function(key){
    var lines=RAW[key];
    var h=lines.length;
    var w=0;
    var rows=[];
    for(var y=0;y<h;y++){
      var line=lines[y];
      if(line.length>w)w=line.length;
      var row=[];
      for(var x=0;x<line.length;x++) row.push(line[x]==='X');
      rows.push(row);
    }
    sprites[key]={w:w,h:h,rows:rows};
  });
}

// ── 진화 트리 (P1 기반) ──
var TREE={
  egg:{stage:'egg',next:'babytchi',time:5},
  babytchi:{stage:'baby',next:['marutchi','tonmarutchi'],time:60},
  marutchi:{stage:'child',next:['tamatchi','kuchitamatchi'],time:180},
  tonmarutchi:{stage:'child',next:['tamatchi','kuchitamatchi'],time:180},
  tamatchi:{stage:'teen',next:['mametchi','ginjirotchi','kuchipatchi'],time:360},
  kuchitamatchi:{stage:'teen',next:['kuchipatchi','nyorotchi','tarakotchi'],time:360},
  mametchi:{stage:'adult',next:null},
  ginjirotchi:{stage:'adult',next:null},
  kuchipatchi:{stage:'adult',next:null},
  nyorotchi:{stage:'adult',next:null},
  tarakotchi:{stage:'adult',next:null},
  obaketchi:{stage:'dead',next:null}
};

// ── 상수 ──
var TICK_MS=60000;
var HUNGER_DEC_MIN=60;
var HAPPY_DEC_MIN=90;
var POOP_MIN=180;
var SICK_CHANCE=0.03;
var MAX_HEARTS=4;
var MAX_DISCIPLINE=100;
var MAX_POOP=4;
var LS_TAMA='tama_state_v1';
var LS_TAMA_ON='tama_enabled_v1';

// ── 메뉴 ──
var MENU_ITEMS=['meal','snack','game','medicine','clean','light','stats','discipline'];
var MENU_LABELS=['밥','간식','게임','약','청소','불','능력','훈육'];
var MENU_ICONS=['🍚','🍬','⚽','💊','🚿','💡','📊','📢'];

// ── 게임 상태 ──
var T=null;
var enabled=false;
var mainCtx=null,walkerCtx=null;
var tickTimer=null,walkerTimer=null,saveTimer=null,animTimer=null;
var walkerX=0,walkerDir=1,walkerFrame=0;
var menuIdx=0,menuMode='idle',gameRound=0,gameScore=0,gameAnswer=0;
var animFrame=0; // 애니메이션 프레임 카운터
var idleX=0,idleDir=1; // idle 좌우 이동

// ── 새 다마고치 생성 ──
function createTama(name){
  return {
    name:name||'타마',
    species:'egg',
    stage:'egg',
    born:Date.now(),
    lastTick:Date.now(),
    hunger:MAX_HEARTS,
    happy:MAX_HEARTS,
    discipline:0,
    weight:5,
    age:0,
    poop:0,
    sick:false,
    sleeping:false,
    lightOff:false,
    dead:false,
    evoTimer:0,
    hungerTimer:0,
    happyTimer:0,
    poopTimer:0,
    careMisses:0,
    careTotal:0,
    totalFed:0,
    totalPlayed:0,
    totalCleaned:0,
    totalMeds:0
  };
}

// ── 로컬 저장/불러오기 ──
function saveTamaLocal(){
  if(!T)return;
  try{localStorage.setItem(LS_TAMA,JSON.stringify(T));}catch(e){}
}
function loadTamaLocal(){
  try{
    var s=localStorage.getItem(LS_TAMA);
    if(s){T=JSON.parse(s);return true;}
  }catch(e){}
  return false;
}

// ── Firebase 저장/불러오기 ──
function saveTamaFB(){
  if(!T||typeof myUid==='undefined'||!myUid)return;
  try{
    db.ref('tamagotchi/'+myUid).set({
      name:T.name,species:T.species,stage:T.stage,
      hunger:T.hunger,happy:T.happy,age:T.age,weight:T.weight,
      dead:T.dead,lastSave:firebase.database.ServerValue.TIMESTAMP,
      data:JSON.stringify(T)
    });
  }catch(e){}
}
function loadTamaFB(cb){
  if(typeof myUid==='undefined'||!myUid){cb(false);return;}
  db.ref('tamagotchi/'+myUid+'/data').once('value',function(snap){
    var v=snap.val();
    if(v){
      try{T=JSON.parse(v);cb(true);}catch(e){cb(false);}
    }else{cb(false);}
  },function(){cb(false);});
}

/* ═══ Part 2: 게임 엔진 ═══ */

// ── 케어 점수 (0~100) ──
function careScore(){
  if(!T||T.careTotal===0)return 50;
  return Math.round(((T.careTotal-T.careMisses)/T.careTotal)*100);
}

// ── 진화 결정 ──
function pickEvolution(){
  var info=TREE[T.species];
  if(!info||!info.next)return null;
  var nexts=Array.isArray(info.next)?info.next:[info.next];
  if(nexts.length===1)return nexts[0];
  var score=careScore();
  if(nexts.length===2){
    return score>=50?nexts[0]:nexts[1];
  }
  // 3지선다
  if(score>=75)return nexts[0];
  if(score>=40)return nexts[1];
  return nexts[2];
}

// ── 진화 실행 ──
function doEvolve(){
  var next=pickEvolution();
  if(!next)return;
  T.species=next;
  T.stage=TREE[next].stage;
  T.evoTimer=0;
  if(T.stage==='baby'){T.hunger=MAX_HEARTS;T.happy=MAX_HEARTS;}
  saveTamaLocal();saveTamaFB();
  renderAll();
}

// ── tick (1분마다 호출) ──
function tick(){
  if(!T||T.dead)return;

  // 수면 체크 (밤 10시~오전 8시)
  var h=new Date().getHours();
  var shouldSleep=(h>=22||h<8);
  if(shouldSleep&&!T.sleeping){
    T.sleeping=true;
    if(!T.lightOff)T.careMisses++;
    T.careTotal++;
  }
  if(!shouldSleep&&T.sleeping){
    T.sleeping=false;T.lightOff=false;
  }

  if(T.sleeping){T.lastTick=Date.now();renderAll();return;}

  // 진화 타이머
  var info=TREE[T.species];
  if(info&&info.time){
    T.evoTimer++;
    if(T.evoTimer>=info.time)doEvolve();
  }

  // 배고픔 감소
  T.hungerTimer++;
  if(T.hungerTimer>=HUNGER_DEC_MIN){
    T.hungerTimer=0;
    if(T.hunger>0)T.hunger--;
    T.careTotal++;
    if(T.hunger===0)T.careMisses++;
  }

  // 행복 감소
  T.happyTimer++;
  if(T.happyTimer>=HAPPY_DEC_MIN){
    T.happyTimer=0;
    if(T.happy>0)T.happy--;
    T.careTotal++;
    if(T.happy===0)T.careMisses++;
  }

  // 배변
  T.poopTimer++;
  if(T.poopTimer>=POOP_MIN){
    T.poopTimer=0;
    if(T.poop<MAX_POOP)T.poop++;
    T.careTotal++;
  }

  // 병
  if(!T.sick&&T.hunger<=1&&T.happy<=1&&Math.random()<SICK_CHANCE){
    T.sick=true;T.careTotal++;
  }

  // 나이 (24시간=1살)
  var ageHours=(Date.now()-T.born)/3600000;
  T.age=Math.floor(ageHours/24);

  // 사망 체크
  if(T.hunger===0&&T.happy===0&&T.sick&&T.poop>=MAX_POOP){
    T.dead=true;T.species='obaketchi';T.stage='dead';
  }

  T.lastTick=Date.now();
  renderAll();
}

// ── 오프라인 동안 밀린 틱 처리 ──
function catchUpTicks(){
  if(!T||T.dead)return;
  var elapsed=Date.now()-T.lastTick;
  var missed=Math.floor(elapsed/TICK_MS);
  if(missed>1440)missed=1440; // 최대 1일치
  for(var i=0;i<missed;i++)tick();
}

// ── 케어 액션들 ──
function doFeed(type){
  if(!T||T.dead||T.sleeping)return;
  if(type==='meal'){
    if(T.hunger>=MAX_HEARTS)return;
    T.hunger=Math.min(MAX_HEARTS,T.hunger+1);
    T.weight++;
  }else{
    if(T.happy>=MAX_HEARTS)return;
    T.happy=Math.min(MAX_HEARTS,T.happy+1);
    T.weight++;
  }
  T.totalFed++;
  saveTamaLocal();renderAll();
}

function doMedicine(){
  if(!T||T.dead||!T.sick)return;
  T.sick=false;
  T.totalMeds++;
  saveTamaLocal();renderAll();
}

function doClean(){
  if(!T||T.dead||T.poop===0)return;
  T.poop=0;
  T.totalCleaned++;
  saveTamaLocal();renderAll();
}

function doLight(){
  if(!T||T.dead)return;
  T.lightOff=!T.lightOff;
  saveTamaLocal();renderAll();
}

function doDiscipline(){
  if(!T||T.dead||T.sleeping)return;
  T.discipline=Math.min(MAX_DISCIPLINE,T.discipline+25);
  saveTamaLocal();renderAll();
}

// ── 미니게임 (좌우 맞추기) ──
function startGame(){
  if(!T||T.dead||T.sleeping)return;
  gameRound=0;gameScore=0;
  menuMode='game';
  nextGameRound();
}
function nextGameRound(){
  if(gameRound>=5){
    // 결과
    if(gameScore>=3&&T.happy<MAX_HEARTS)T.happy++;
    if(gameScore>=4&&T.happy<MAX_HEARTS)T.happy++;
    T.totalPlayed++;
    menuMode='gameResult';
    saveTamaLocal();renderAll();
    return;
  }
  gameAnswer=Math.random()<0.5?0:1; // 0=left, 1=right
  menuMode='game';
  renderAll();
}
function guessGame(dir){
  if(menuMode!=='game')return;
  if(dir===gameAnswer)gameScore++;
  gameRound++;
  nextGameRound();
}

/* ═══ Part 3: 렌더러 + 워커 ═══ */

// ── 스프라이트 그리기 ──
function drawSprite(ctx,sp,ox,oy,scale,color){
  if(!sp)return;
  color=color||'#222';
  ctx.fillStyle=color;
  for(var y=0;y<sp.h;y++){
    for(var x=0;x<sp.rows[y].length;x++){
      if(sp.rows[y][x]){
        ctx.fillRect(Math.floor(ox+x*scale),Math.floor(oy+y*scale),Math.ceil(scale),Math.ceil(scale));
      }
    }
  }
}

// ── 반다이 스타일 메뉴 아이콘 (픽셀 아트 8x8) ──
var MENU_PIXEL_ICONS=[
  // 0: 밥 (밥그릇)
  [0x00,0x18,0x24,0x7E,0xFF,0xFF,0x7E,0x00],
  // 1: 간식 (사탕)
  [0x08,0x1C,0x3E,0x3E,0x3E,0x1C,0x08,0x08],
  // 2: 게임 (컨트롤러)
  [0x00,0x7E,0xFF,0xDB,0xFF,0x7E,0x24,0x00],
  // 3: 약 (십자가)
  [0x18,0x18,0x7E,0x7E,0x7E,0x18,0x18,0x00],
  // 4: 청소 (물방울)
  [0x10,0x10,0x38,0x38,0x7C,0x7C,0x38,0x00],
  // 5: 불 (전구)
  [0x18,0x3C,0x7E,0x7E,0x3C,0x18,0x18,0x00],
  // 6: 능력 (하트)
  [0x00,0x66,0xFF,0xFF,0x7E,0x3C,0x18,0x00],
  // 7: 훈육 (느낌표)
  [0x18,0x18,0x18,0x18,0x18,0x00,0x18,0x00]
];

function drawPixelIcon(ctx,iconData,ox,oy,scale){
  ctx.fillStyle='#222';
  for(var y=0;y<8;y++){
    var row=iconData[y];
    for(var x=0;x<8;x++){
      if(row&(0x80>>x)){
        ctx.fillRect(Math.floor(ox+x*scale),Math.floor(oy+y*scale),Math.ceil(scale),Math.ceil(scale));
      }
    }
  }
}

// ── 애니메이션 업데이트 (200ms마다) ──
function animTick(){
  animFrame++;
  // idle 좌우 이동 (매 5프레임마다 1px 이동, ±8px 범위)
  if(animFrame%5===0){
    idleX+=idleDir;
    if(idleX>8){idleDir=-1;}
    if(idleX<-8){idleDir=1;}
  }
  renderMain();
}

// ── 메인 캔버스 렌더 (128x128) ──
function renderMain(){
  if(!mainCtx||!T)return;
  var c=mainCtx.canvas;
  var W=c.width,H=c.height;

  // LCD 배경
  mainCtx.fillStyle='#c5d4a8';
  mainCtx.fillRect(0,0,W,H);

  // ── 사망 화면 ──
  if(T.dead){
    var sk=sprites.skull;
    if(sk)drawSprite(mainCtx,sk,Math.floor((W-sk.w*4)/2),20,4,'#444');
    mainCtx.fillStyle='#444';
    mainCtx.font='bold 12px monospace';
    mainCtx.textAlign='center';
    mainCtx.fillText('R.I.P.',W/2,90);
    mainCtx.font='10px monospace';
    mainCtx.fillText(T.name,W/2,105);
    mainCtx.fillText('아무 버튼을 누르세요',W/2,120);
    return;
  }

  // ── 수면 + 불 끔 ──
  if(T.sleeping&&T.lightOff){
    var zz=sprites.zzz;
    if(zz)drawSprite(mainCtx,zz,Math.floor((W-zz.w*4)/2),30,4,'#6a7a5a');
    mainCtx.fillStyle='#6a7a5a';
    mainCtx.font='10px monospace';
    mainCtx.textAlign='center';
    mainCtx.fillText('zzZ...',W/2,100);
    return;
  }

  // ── 상단 메뉴 아이콘 바 (반다이 스타일) ──
  var iconScale=1.2;
  var iconW=Math.ceil(8*iconScale);
  var totalW=MENU_PIXEL_ICONS.length*iconW+(MENU_PIXEL_ICONS.length-1)*2;
  var startX=Math.floor((W-totalW)/2);
  for(var i=0;i<MENU_PIXEL_ICONS.length;i++){
    var ix=startX+i*(iconW+2);
    if(menuMode==='menu'&&i===menuIdx){
      // 선택 표시: 삼각형 아래 화살표
      mainCtx.fillStyle='#222';
      mainCtx.beginPath();
      mainCtx.moveTo(ix+iconW/2-3,iconW+3);
      mainCtx.lineTo(ix+iconW/2+3,iconW+3);
      mainCtx.lineTo(ix+iconW/2,iconW+7);
      mainCtx.fill();
    }
    drawPixelIcon(mainCtx,MENU_PIXEL_ICONS[i],ix,2,iconScale);
  }

  // 구분선
  mainCtx.fillStyle='#8a9a6a';
  mainCtx.fillRect(4,iconW+8,W-8,1);

  // ── 게임 화면 ──
  if(menuMode==='game'){
    mainCtx.fillStyle='#444';
    mainCtx.font='bold 11px monospace';
    mainCtx.textAlign='center';
    mainCtx.fillText('ROUND '+(gameRound+1)+'/5',W/2,35);
    var sp=sprites[T.species]||sprites.babytchi;
    if(sp)drawSprite(mainCtx,sp,Math.floor((W-sp.w*4)/2),42,4);
    mainCtx.fillText('◀  ?  ▶',W/2,100);
    mainCtx.font='9px monospace';
    mainCtx.fillText('SCORE: '+gameScore,W/2,115);
    return;
  }
  if(menuMode==='gameResult'){
    mainCtx.fillStyle='#444';
    mainCtx.font='bold 14px monospace';
    mainCtx.textAlign='center';
    mainCtx.fillText(gameScore>=3?'WIN!':'LOSE...',W/2,50);
    mainCtx.font='bold 12px monospace';
    mainCtx.fillText(gameScore+' / 5',W/2,70);
    mainCtx.font='9px monospace';
    mainCtx.fillText('아무 버튼을 누르세요',W/2,100);
    return;
  }

  // ── 스탯 화면 ──
  if(menuMode==='stats'){
    mainCtx.fillStyle='#222';
    mainCtx.font='bold 10px monospace';
    mainCtx.textAlign='left';
    var sy=30;
    var gap=14;
    mainCtx.fillText('NAME: '+T.name,8,sy);
    mainCtx.fillText('AGE:  '+T.age,8,sy+gap);
    mainCtx.fillText('WT:   '+T.weight+'g',8,sy+gap*2);
    mainCtx.fillText('HUNGRY:'+hearts(T.hunger),8,sy+gap*3);
    mainCtx.fillText('HAPPY: '+hearts(T.happy),8,sy+gap*4);
    mainCtx.fillText('TRAIN: '+T.discipline+'%',8,sy+gap*5);
    return;
  }

  // ── 캐릭터 영역 (중앙, idle 애니메이션) ──
  var sp=sprites[T.species]||sprites.egg;
  var scale=4;
  var charW=sp.w*scale;
  var charH=sp.h*scale;
  // 숨쉬기: 살짝 위아래 (사인파)
  var breathe=Math.sin(animFrame*0.15)*2;
  // 좌우 이동 (idle)
  var moveX=(menuMode==='idle'||menuMode==='menu')?idleX:0;
  var cx=Math.floor((W-charW)/2)+moveX;
  var cy=Math.floor((H-charH)/2)-5+Math.floor(breathe);

  // 수면 중이면 zzz
  if(T.sleeping){
    var zz=sprites.zzz;
    if(zz)drawSprite(mainCtx,zz,cx+charW+2,cy-8,2,'#6a7a5a');
  }
  // 병 표시
  if(T.sick){
    var sk=sprites.skull;
    if(sk)drawSprite(mainCtx,sk,cx-16,cy,1.5,'#a33');
  }
  drawSprite(mainCtx,sp,cx,cy,scale);

  // ── 똥 표시 (우하단) ──
  if(T.poop>0){
    var pp=sprites.poop;
    for(var pi=0;pi<T.poop&&pi<3;pi++){
      if(pp)drawSprite(mainCtx,pp,W-30+pi*3,H-30-pi*3,1.5,'#654');
    }
  }

  // ── 하단: 배고픔/행복 하트 ──
  mainCtx.fillStyle='#8a9a6a';
  mainCtx.fillRect(4,H-20,W-8,1);
  var ht=sprites.heart;
  if(ht){
    // 배고픔 (좌)
    for(var hi=0;hi<MAX_HEARTS;hi++){
      drawSprite(mainCtx,ht,6+hi*12,H-16,1,hi<T.hunger?'#c44':'#ccc');
    }
    // 행복 (우)
    for(var hi2=0;hi2<MAX_HEARTS;hi2++){
      drawSprite(mainCtx,ht,W-54+hi2*12,H-16,1,hi2<T.happy?'#48c':'#ccc');
    }
  }
}

function hearts(n){
  var s='';
  for(var i=0;i<MAX_HEARTS;i++)s+=i<n?'♥':'♡';
  return s;
}

// ── HTML 스탯 업데이트 ──
function updateStatsHTML(){
  if(!T)return;
  var nameEl=document.getElementById('tamaNameLabel');
  var ageEl=document.getElementById('tamaAgeLabel');
  var statsEl=document.getElementById('tamaStatsEl');
  if(nameEl)nameEl.textContent=T.name+(T.dead?' (R.I.P.)':'');
  if(ageEl)ageEl.textContent=T.age+'살';
  if(statsEl){
    statsEl.innerHTML=
      '<span>🍚'+hearts(T.hunger)+'</span>'+
      '<span>😊'+hearts(T.happy)+'</span>'+
      '<span>📏'+T.weight+'g</span>'+
      '<span>📢'+T.discipline+'%</span>'+
      (T.sick?'<span>🤒병</span>':'')+
      (T.poop>0?'<span>💩×'+T.poop+'</span>':'')+
      (T.sleeping?'<span>😴수면</span>':'');
  }
}

// ── 전체 렌더 ──
function renderAll(){
  renderMain();
  updateStatsHTML();
  updateBtnRow2();
}

// ── 보조 버튼 행 (사망 시만 표시) ──
function updateBtnRow2(){
  var el=document.getElementById('tamaBtnRow2');
  if(!el||!T)return;
  // 살아있을 때는 보조 버튼 불필요
  el.innerHTML='';
}

function resetTama(){
  var name=prompt('새 다마고치 이름을 지어주세요:','타마');
  if(!name)name='타마';
  T=createTama(name.trim().substring(0,10));
  menuMode='idle';menuIdx=0;
  saveTamaLocal();saveTamaFB();renderAll();
}

// ── 워커 (채팅 화면 위 걸어다니기) ──
function renderWalker(){
  if(!walkerCtx||!T||T.dead||!enabled)return;
  var c=walkerCtx.canvas;
  walkerCtx.clearRect(0,0,c.width,c.height);
  var sp=sprites[T.species]||sprites.egg;
  var scale=2;
  var ox=Math.floor((c.width-sp.w*scale)/2);
  var oy=Math.floor((c.height-sp.h*scale)/2);
  // 프레임에 따라 살짝 상하 움직임
  var bounce=walkerFrame%2===0?0:-1;
  drawSprite(walkerCtx,sp,ox,oy+bounce,scale);
}

function updateWalker(){
  if(!T||T.dead||!enabled)return;
  var el=document.getElementById('tamaWalker');
  if(!el)return;
  var maxX=window.innerWidth-40;
  walkerX+=walkerDir*2;
  if(walkerX>maxX){walkerDir=-1;walkerX=maxX;}
  if(walkerX<0){walkerDir=1;walkerX=0;}
  walkerFrame++;
  // composer 위에 배치
  var bottomOffset=80;
  el.style.left=walkerX+'px';
  el.style.bottom=bottomOffset+'px';
  renderWalker();
}

function startWalker(){
  var el=document.getElementById('tamaWalker');
  if(!el)return;
  walkerCtx=el.querySelector('canvas').getContext('2d');
  el.style.display='block';
  if(walkerTimer)clearInterval(walkerTimer);
  walkerTimer=setInterval(updateWalker,200);
  renderWalker();
}

function stopWalker(){
  var el=document.getElementById('tamaWalker');
  if(el)el.style.display='none';
  if(walkerTimer){clearInterval(walkerTimer);walkerTimer=null;}
}

/* ═══ Part 4: UI 바인딩 + 메뉴 시스템 ═══ */

// ── 3버튼 메뉴 핸들러 ──
function onBtnA(){
  if(!T)return;
  if(T.dead){resetTama();return;}
  if(menuMode==='idle'){menuMode='menu';menuIdx=0;renderAll();return;}
  if(menuMode==='menu'){menuIdx=(menuIdx+MENU_ITEMS.length-1)%MENU_ITEMS.length;renderAll();return;}
  if(menuMode==='game'){guessGame(0);return;}
  if(menuMode==='gameResult'||menuMode==='stats'){menuMode='idle';renderAll();return;}
}

function onBtnB(){
  if(!T)return;
  if(T.dead){resetTama();return;}
  if(menuMode==='idle'){menuMode='menu';menuIdx=0;renderAll();return;}
  if(menuMode==='game')return;
  if(menuMode==='gameResult'||menuMode==='stats'){menuMode='idle';renderAll();return;}
  if(menuMode==='menu'){
    var action=MENU_ITEMS[menuIdx];
    menuMode='idle'; // 메뉴 닫기 먼저
    switch(action){
      case 'meal':doFeed('meal');break;
      case 'snack':doFeed('snack');break;
      case 'game':startGame();return; // game은 자체 모드
      case 'medicine':doMedicine();break;
      case 'clean':doClean();break;
      case 'light':doLight();break;
      case 'stats':menuMode='stats';break;
      case 'discipline':doDiscipline();break;
    }
    renderAll();
    return;
  }
}

function onBtnC(){
  if(!T)return;
  if(T.dead){resetTama();return;}
  // C 버튼 = 취소 (idle로 복귀) 또는 메뉴 오른쪽 이동
  if(menuMode==='idle')return;
  if(menuMode==='menu'){menuIdx=(menuIdx+1)%MENU_ITEMS.length;renderAll();return;}
  if(menuMode==='game'){guessGame(1);return;}
  if(menuMode==='gameResult'||menuMode==='stats'){menuMode='idle';renderAll();return;}
}

// ── 다마고치 화면 열기/닫기 ──
function openTamaScreen(){
  var el=document.getElementById('tamaScreen');
  if(!el)return;
  if(!T){
    // 새로 시작 (항상 알에서 시작)
    var name=prompt('다마고치 이름을 지어주세요:','타마');
    if(!name)return;
    T=createTama(name.trim().substring(0,10));
    saveTamaLocal();saveTamaFB();
    // 토글도 자동으로 켜기
    if(!enabled){
      enabled=true;
      try{localStorage.setItem(LS_TAMA_ON,'1');}catch(e){}
      var stateEl=document.getElementById('mTamaState');
      if(stateEl)stateEl.textContent='켜짐';
      startTimers();
      startWalker();
    }
  }
  el.classList.add('open');
  menuMode='idle';menuIdx=0;
  if(!mainCtx){
    var cv=document.getElementById('tamaMainCanvas');
    if(cv)mainCtx=cv.getContext('2d');
  }
  // 애니메이션 타이머가 없으면 시작
  if(!animTimer)animTimer=setInterval(animTick,200);
  renderAll();
}

function closeTamaScreen(){
  var el=document.getElementById('tamaScreen');
  if(el)el.classList.remove('open');
  menuMode='idle';
}

// ── 토글 (설정 메뉴) ──
function toggleTama(){
  enabled=!enabled;
  try{localStorage.setItem(LS_TAMA_ON,enabled?'1':'0');}catch(e){}
  var stateEl=document.getElementById('mTamaState');
  if(stateEl)stateEl.textContent=enabled?'켜짐':'꺼짐';
  if(enabled){
    startTimers();
    startWalker();
  }else{
    stopTimers();
    stopWalker();
  }
}

// ── 타이머 관리 ──
function startTimers(){
  if(tickTimer)clearInterval(tickTimer);
  tickTimer=setInterval(tick,TICK_MS);
  if(saveTimer)clearInterval(saveTimer);
  saveTimer=setInterval(function(){saveTamaLocal();saveTamaFB();},300000);
  // 애니메이션 타이머 (200ms)
  if(animTimer)clearInterval(animTimer);
  animTimer=setInterval(animTick,200);
}

function stopTimers(){
  if(tickTimer){clearInterval(tickTimer);tickTimer=null;}
  if(saveTimer){clearInterval(saveTimer);saveTimer=null;}
  if(animTimer){clearInterval(animTimer);animTimer=null;}
}

/* ═══ Part 5: 교배 시스템 + init ═══ */

// ── 교배 시스템 ──
var mateListener=null;

function watchMateRequests(){
  if(typeof myUid==='undefined'||!myUid||typeof roomId==='undefined'||!roomId)return;
  if(mateListener)return;
  var ref=db.ref('tamaMate/'+roomId);
  mateListener=ref.on('child_added',function(snap){
    var v=snap.val();
    if(!v||v.to!==myUid||v.status!=='pending')return;
    showMateRequest(snap.key,v);
  });
}

function showMateRequest(key,data){
  var el=document.getElementById('tamaMateReq');
  var title=document.getElementById('tamaMateTitle');
  var body=document.getElementById('tamaMateBody');
  var acceptBtn=document.getElementById('tamaMateAccept');
  var declineBtn=document.getElementById('tamaMateDecline');
  if(!el)return;
  if(title)title.textContent='교배 요청';
  if(body)body.textContent=(data.fromName||'???')+'님의 '+(data.fromSpecies||'다마고치')+'가 교배를 원합니다!';
  el.classList.add('show');
  if(acceptBtn)acceptBtn.onclick=function(){
    acceptMate(key,data);el.classList.remove('show');
  };
  if(declineBtn)declineBtn.onclick=function(){
    declineMate(key);el.classList.remove('show');
  };
}

function requestMate(targetUid,targetName){
  if(!T||T.dead||T.stage!=='adult')return;
  if(typeof myUid==='undefined'||!myUid||typeof roomId==='undefined'||!roomId)return;
  db.ref('tamaMate/'+roomId).push({
    from:myUid,
    fromName:T.name,
    fromSpecies:T.species,
    to:targetUid,
    toName:targetName||'',
    status:'pending',
    ts:firebase.database.ServerValue.TIMESTAMP
  });
  if(typeof showToast==='function')showToast('교배 요청을 보냈어요!');
}

function acceptMate(key,data){
  if(!T||T.dead)return;
  db.ref('tamaMate/'+roomId+'/'+key).update({status:'accepted'});
  // 자식 다마고치 생성 (부모 중 하나의 종에서 랜덤)
  var parents=[data.fromSpecies,T.species];
  var childSpecies=parents[Math.floor(Math.random()*parents.length)];
  // 리셋해서 알부터 다시 시작 (교배 성공)
  var babyName=prompt('태어난 알의 이름:','베이비');
  if(!babyName)babyName='베이비';
  T=createTama(babyName.trim().substring(0,10));
  saveTamaLocal();saveTamaFB();renderAll();
  if(typeof showToast==='function')showToast('교배 성공! 새 알이 태어났어요!');
}

function declineMate(key){
  if(typeof roomId==='undefined'||!roomId)return;
  db.ref('tamaMate/'+roomId+'/'+key).update({status:'declined'});
}

// ── 초기화 ──
function init(){
  parseSprites();

  // 설정 메뉴 버튼
  var mToggle=document.getElementById('mTamagotchi');
  if(mToggle)mToggle.addEventListener('click',toggleTama);

  var mView=document.getElementById('mTamaView');
  if(mView)mView.addEventListener('click',function(){openTamaScreen();});

  // 플러스 메뉴 버튼
  var plusBtn=document.getElementById('plusTama');
  if(plusBtn)plusBtn.addEventListener('click',function(){openTamaScreen();});

  // 3버튼
  var btnA=document.getElementById('tamaBtnA');
  var btnB=document.getElementById('tamaBtnB');
  var btnC=document.getElementById('tamaBtnC');
  if(btnA)btnA.addEventListener('click',onBtnA);
  if(btnB)btnB.addEventListener('click',onBtnB);
  if(btnC)btnC.addEventListener('click',onBtnC);

  // 닫기
  var closeBtn=document.getElementById('tamaCloseBtn');
  if(closeBtn)closeBtn.addEventListener('click',closeTamaScreen);

  // 화면 클릭으로 닫기
  var screen=document.getElementById('tamaScreen');
  if(screen)screen.addEventListener('click',function(e){
    if(e.target===screen)closeTamaScreen();
  });

  // 워커 클릭으로 화면 열기
  var walker=document.getElementById('tamaWalker');
  if(walker){
    walker.style.pointerEvents='auto';
    walker.style.cursor='pointer';
    walker.addEventListener('click',function(){openTamaScreen();});
  }

  // 상태 복원
  var wasOn=false;
  try{wasOn=localStorage.getItem(LS_TAMA_ON)==='1';}catch(e){}

  // 로컬 데이터 로드
  if(loadTamaLocal()){
    catchUpTicks();
  }

  // Firebase 로드 시도 (myUid 준비 후)
  var fbCheck=setInterval(function(){
    if(typeof myUid!=='undefined'&&myUid){
      clearInterval(fbCheck);
      loadTamaFB(function(ok){
        if(ok)catchUpTicks();
        if(wasOn){
          enabled=true;
          var stateEl=document.getElementById('mTamaState');
          if(stateEl)stateEl.textContent='켜짐';
          startTimers();
          startWalker();
        }
        watchMateRequests();
      });
      // roomId 변경 감시
      var lastRoom='';
      setInterval(function(){
        if(typeof roomId!=='undefined'&&roomId!==lastRoom){
          lastRoom=roomId;
          if(mateListener){
            try{db.ref('tamaMate/'+lastRoom).off('child_added',mateListener);}catch(e){}
            mateListener=null;
          }
          watchMateRequests();
        }
      },5000);
    }
  },1000);

  // 메뉴 상태 표시
  var stateEl=document.getElementById('mTamaState');
  if(stateEl)stateEl.textContent=wasOn?'켜짐':'꺼짐';
  if(wasOn){
    enabled=true;
    startTimers();
    startWalker();
  }
}

// ── 시작 ──
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}

})();
