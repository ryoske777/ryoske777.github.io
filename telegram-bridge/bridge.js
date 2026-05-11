/**
 * telegram-firebase-bridge
 *
 * 집에서 실행하는 브리지 스크립트.
 * Firebase AI 채팅방 ↔ 텔레그램 봇(오픈클로)을 중계합니다.
 *
 * 실행: node bridge.js
 */

const admin = require('firebase-admin');
const https = require('https');

// ── 설정 로드 ──────────────────────────────────────────────
const config = require('./config.json');

const {
  telegramBotToken,   // BotFather에서 받은 봇 토큰
  telegramChatId,     // 오픈클로 봇과 대화하는 Telegram chat_id (숫자)
  firebaseServiceAccount, // Firebase 서비스 계정 JSON 파일 경로
  firebaseDatabaseURL,    // "https://messenger-222df-default-rtdb.asia-southeast1.firebasedatabase.app"
  adminUid,           // ADMIN_UID (Firebase 계정 UID)
} = config;

const AI_ROOM_ID = 'ai_room_' + adminUid.slice(0, 12);
const BOT_SENDER_ID = 'telegram_bot';
const BOT_NICK = '🤖 오픈클로';

// ── Firebase 초기화 ─────────────────────────────────────────
const serviceAccount = require(firebaseServiceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseDatabaseURL,
});
const db = admin.database();

// ── Telegram API 헬퍼 ───────────────────────────────────────
function tgApi(method, params) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(params);
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${telegramBotToken}/${method}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Firebase에 봇 메시지 쓰기 ──────────────────────────────
async function postBotMessage(text) {
  const roomRef = db.ref('rooms/' + AI_ROOM_ID);
  const seqTx = await roomRef.child('lastSeq').transaction(v => (Number(v || 0) + 1));
  const seq = Number(seqTx.snapshot.val() || 0);
  const mid = 'bot_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  await db.ref('messages/' + AI_ROOM_ID).push({
    messageId: mid,
    senderId: BOT_SENDER_ID,
    senderNick: BOT_NICK,
    text: String(text).slice(0, 4000),
    ts: admin.database.ServerValue.TIMESTAMP,
    seq,
  });
  await roomRef.update({
    updatedAt: admin.database.ServerValue.TIMESTAMP,
    lastMsgTs: admin.database.ServerValue.TIMESTAMP,
  });
  console.log('[Bot→Firebase]', text.slice(0, 80));
}

// ── Firebase 메시지 감시 ────────────────────────────────────
let lastSeenSeq = 0;

async function initLastSeq() {
  const snap = await db.ref('rooms/' + AI_ROOM_ID + '/lastSeq').once('value');
  lastSeenSeq = Number(snap.val() || 0);
  console.log('[Bridge] 시작. AI 방 ID:', AI_ROOM_ID, '/ 현재 lastSeq:', lastSeenSeq);
}

function watchFirebase() {
  db.ref('messages/' + AI_ROOM_ID)
    .orderByChild('seq')
    .startAfter(lastSeenSeq, 'seq')
    .on('child_added', async (snap) => {
      const msg = snap.val();
      if (!msg) return;
      // 봇이 쓴 메시지는 텔레그램으로 보내지 않음
      if (msg.senderId === BOT_SENDER_ID) return;
      // 관리자(admin) 메시지만 중계
      if (msg.senderId !== adminUid) return;

      const seq = Number(msg.seq || 0);
      if (seq <= lastSeenSeq) return;
      lastSeenSeq = seq;

      const text = String(msg.text || '').trim();
      if (!text) return;

      console.log('[Firebase→Telegram]', text.slice(0, 80));
      try {
        await tgApi('sendMessage', {
          chat_id: telegramChatId,
          text: text,
        });
      } catch(e) {
        console.error('[Telegram 전송 실패]', e.message);
      }
    });
}

// ── Telegram 폴링 ───────────────────────────────────────────
let tgOffset = 0;

async function pollTelegram() {
  try {
    const result = await tgApi('getUpdates', {
      offset: tgOffset,
      timeout: 25,
      allowed_updates: ['message'],
    });

    if (!result.ok || !result.result) return;

    for (const update of result.result) {
      tgOffset = update.update_id + 1;
      const msg = update.message;
      if (!msg || !msg.text) continue;
      // 오픈클로 봇이 보낸 메시지만 Firebase로 전달 (chat_id 필터)
      if (String(msg.chat.id) !== String(telegramChatId)) continue;
      // 자기 자신(사람)이 보낸 메시지는 무시하고 봇 응답만 처리
      if (!msg.from.is_bot) continue;

      console.log('[Telegram→Firebase]', msg.text.slice(0, 80));
      await postBotMessage(msg.text);
    }
  } catch(e) {
    console.error('[Telegram 폴링 오류]', e.message);
  }
  setTimeout(pollTelegram, 1000);
}

// ── 시작 ────────────────────────────────────────────────────
(async () => {
  await initLastSeq();
  watchFirebase();
  pollTelegram();
  console.log('[Bridge] 실행 중. Ctrl+C로 종료.');
})();
