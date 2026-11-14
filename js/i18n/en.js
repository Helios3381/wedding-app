// --- English ---
// 新人的名字（凱銘、詠萱、阿銘、阿萱）不翻成拼音，保留中文

export default {
  meta: { title: '凱銘 & 詠萱 | Happy Wedding Park!', appTitle: '阿銘＆阿萱' },
  header: { sound: 'Sound on/off', fun: 'Happy Wedding Park!' },
  sound: { on: 'Sound on 🎵', off: 'Sound off' },
  nav: { home: 'Home', game: 'Game', draw: 'Cards', wish: 'Wishes', fort: 'Fortune', photo: 'Photo' },

  wel: {
    title: 'Welcome! Please check in',
    desc: 'Please enter your real name or what we should call you.<br>We will remember it for the leaderboard, messages and prize vouchers.',
    placeholder: 'e.g. John Chan / Uncle Wong',
    button: 'Check in',
    need: 'Please tell us your name first 😊'
  },
  voucher: { note: 'Keep this screen open — show it or a screenshot to the couple to claim your prize', ok: 'Got it' },
  ask: { yes: 'Send', no: 'Let me think' },
  post: { title: 'Happy Post · Sending', plate: '〒 HAPPY POST<br>幸福慢遞', mark: 'HAPPY POST', done: 'Sent! The couple will mail your photo after the wedding 💌', ok: "Can't wait!" },
  lot: { left: 'Left', got: 'Got' },
  dm: {
    toggle: 'Floating wishes on/off', label: 'Live wishes',
    on: "Live wishes on: everyone's wishes will float across the screen 🌸", off: 'Live wishes off: only new wishes will float by'
  },

  tasks: {
    game: ['Run to happiness!', 'The Great Adventure', 'Come and play our love story!'],
    draw: ['Mystery box!', 'Love Card Draw', 'Can you find the hidden photos?'],
    wish: ['Send your love!', 'Wish Wall', 'Say whatever you like'],
    fort: ['A little note!', 'New Year Fortune', 'Open our letter and draw a fortune!'],
    photo: ['Happy Post!', 'Photo Print Station', 'Pick the one photo you most want to keep from today']
  },
  home: {
    hi: '{name}, welcome!', guest: 'Dear guest',
    allDone: 'All four stamps 百年好合 collected! A bonus card draw has been added — go and draw again',
    progress: 'Play all 4 games to collect stamps ({n}/4); a full set earns 1 bonus card draw',
    stampToast: '"{task}" complete! Stamp "{glyph}" collected ({n}/4)',
    bonusTitle: 'Stamp Master 百年好合',
    bonusMsg: 'All four stamps collected! You get {n} bonus card draw — head back to the Mystery Box'
  },
  lb: {
    title: 'Love Adventure Leaderboard', desc: "Top 3, get your best smile ready — you'll be called on stage at the second entrance! ✨",
    medals: ['1st', '2nd', '3rd'], points: '{score} pts', award: "Groom's Prize",
    loading: 'Loading the leaderboard…', empty: 'No scores yet — be the first challenger! 🏆'
  },
  gifts: {
    title: 'Gifts from the Couple!',
    desc: 'The couple has prepared <b style="color:var(--red)">8</b> gifts — which one will you take home?',
    g1: "Groom's Prize · Top Adventurer<em>3 winners</em>", g1d: 'Top 3 scores in the Love Adventure',
    g2: "Groom's Prize · The Chosen One<em>3 winners</em>", g2d: 'Draw a rare card',
    g3: 'Warm Wishes Prize<em>2 winners</em>', g3d: 'Drawn live from everyone who left a wish — up to 3 chances each',
    eggTag: 'The bride may call your name!', egg: "The Bride's Secret Gift 🎀",
    eggDesc: '<i class="nw">At the second entrance, </i><i class="nw">what blessing will the bride give…?</i>',
    alarmTag: 'Ding-dong! Prize countdown', alarm: 'Prizes are given at the second entrance — play while you can!'
  },

  game: {
    title: 'Run to Happiness! The Great Adventure',
    lead: 'Run with the groom through <b>Hong Kong → Taipei → Kinmen → Nagoya</b> to his bride at the wedding!<br>Every run puts your score on the leaderboard, and your first run earns the stamp "百".',
    controls: '👆 Tap to jump (hold to jump higher, tap again in the air to double jump)<br>👇 Swipe down to slide under signs<br>❤️ Grab bonus items and dodge obstacles — it gets faster and faster!',
    tapToPlay: '👆 Tap here to play full screen',
    slow: '⏳ Loading is taking a while — please wait<br>or check your connection and reload',
    back: '⬅️ Back to website',
    landscape: '💡 Turn your phone sideways for the best experience!',
    toRanking: 'See the leaderboard',
    resultTitle: '🎉 Your score is on the leaderboard!',
    rankTop3: 'You collected <b style="color:var(--red);font-size:1.4rem">{score}</b> points of happiness<br>You are <b>No. {rank}</b> — in line for the Groom\'s Prize! Watch your back 😏',
    rankTop6: 'You collected <b style="color:var(--red);font-size:1.4rem">{score}</b> points of happiness<br>You are <b>No. {rank}</b> — on the board! Reach the top 3 to win the Groom\'s Prize',
    rankOther: 'You collected <b style="color:var(--red);font-size:1.4rem">{score}</b> points of happiness<br>You are No. {rank} — one more run to make the board!'
  },

  draw: {
    title: 'Mystery Box! Love Card Draw',
    lot: '5 draws per guest!', lotDesc: "Rare cards (SSR/SR) win the Groom's Prize on stage; collect all four stamps for 1 more draw",
    button: 'Add some love · Flip a card', out: 'No draws left', charging: 'Gathering happiness…', empty: 'No draws left!',
    album: 'Memory Album', albumHint: '(tap a card to enlarge)',
    thanks: ['Thank you for sharing our everyday moments ❤️', 'Thank you for sharing our joy today 🌸', 'Eat well — love needs energy!'],
    won: 'Congratulations! You drew [{r}] {title}!',
    voucherTitle: "[Groom's Prize] The Chosen One",
    voucherMsg: 'You drew the rare card "{title}"! Show this code on stage at the second entrance'
  },
  cards: {
    ssr1: { t: 'A Meeting Across Time', d: "Childhood sweethearts vs. today's wedding dress" },
    sr1: { t: 'Nagoya Wedding Shoot', d: 'The most dazzling moment' },
    sr2: { t: 'Sweet Kiss', d: "Happiness you can't hide" },
    n1: { t: "阿銘 Devouring McDonald's", d: 'Real life, caught on camera' },
    n2: { t: 'Nagoya Feast', d: 'Love runs on a full stomach' },
    n3: { t: 'Silly Video-Call Screenshots', d: 'No distance can break our chemistry' }
  },

  wish: {
    title: 'Send Your Love! Wish Wall',
    desc: 'Send a wish to collect the stamp "好" right away. Wishes scroll across the banner and float by (hidden while you play or draw cards)',
    lot: 'Send a wish to enter the Warm Wishes Prize draw!', lotDesc: 'Write as many as you like; up to 3 draw entries per guest',
    dmAsk: "Want everyone's wishes to keep floating across the screen?",
    label: 'Your wish', placeholder: 'Tap a phrase above (up to 2) or write your own wish', send: 'Send wish ✨',
    chipHint: 'Pick 1–2 phrases (<b>{n}</b>/2 selected) — you can still edit them',
    max: 'Up to 2 phrases — unselect one first 😊',
    empty: 'Write or pick a wish first 😊',
    sent: 'Your wish is on its way 💌 Draw entries {lot}/{max}',
    sentFull: 'Your wish is on its way 💌 Your entries are full — but more wishes make the couple even happier!',
    seeds: ['Wishing 阿銘 and 阿萱 a lifetime of love! —— Best man 阿豪', 'Happy wedding, happy forever! —— Tiffany, friend from Hong Kong', 'Hand in hand, growing old together! —— 大雄 from Kinmen']
  },
  // 台語、粵語的金句是方言本身的趣味，保留原文
  chips: [
    { name: 'Classic', items: ['Congratulations on your wedding!', 'Wishing you a lifetime of love and happiness!', 'May your love grow stronger every year!', 'Happily ever after!', 'A perfect match made in heaven!', 'Cheers to love, laughter and forever!'] },
    { name: 'Playful', items: ['The bride is absolutely stunning!', 'The groom is way too handsome today!', "The groom's game is so much fun~", '阿銘, you lucky guy — treat 阿萱 well!', "From Hong Kong all the way to Kinmen — that's true love!", 'Great drinks, amazing food~'] },
    { name: 'Taiwanese', sub: '(Hokkien)', items: ['新娘娶入厝，家財年年富！', '今年娶新婦，明年起大厝！', '食甜甜，予恁明年生後生！', '新娘美閣巧，家內大細攏總好！', '翁仔某相疼惜，食甲老老老！', '好事成雙，囝孫滿廳堂！'] },
    { name: 'Cantonese', items: ['新娘好靚呀！', '新郎哥好有福氣！', '祝你哋百年好合、永結同心！', '新郎哥要錫老婆呀！', '快啲生個BB仔！', '飲勝！甜甜蜜蜜一世！'] }
  ],

  fort: {
    title: 'A Little Note! New Year Fortune', desc: 'Open the letter, draw a fortune, and accept the blessing to collect the stamp "合"',
    envLabel: 'Open the thank-you letter', envHint: "Tap the wax seal to open the couple's thank-you letter",
    tube: 'LUCK', draw: 'Tap to draw · A New Year fortune stick', drawHint: 'Just tap — the tube shakes by itself 🎋',
    shaking: 'Rattle rattle… making a wish',
    take: 'Accept the blessing · stamp "合"', done: 'Collect all four stamps for 1 bonus card draw!', toDraw: 'Back to the Mystery Box',
    head: 'New Year Fortune', seal: '2027<br>NEW<br>YEAR',
    no: n => `No. ${n}`,
    split: /(?<=[,;—] )/
  },
  letter: {
    to: 'To you, dear guest', salute: 'Dear family and friends,', illustration: 'Illustration of the couple, from Kinmen to Hong Kong',
    p1: 'Thank you for joining us today at the <mark>Victoria Hotel (維多麗亞酒店)</mark> to witness <mark>the biggest day of our lives</mark>.',
    p2: 'From <mark>Hong Kong to Kinmen</mark>, ours has been a long journey across the distance; and today, with your blessings and company, <mark>the puzzle is finally complete</mark>.',
    p3: 'Thank you to our elders for all your <mark>love and patience</mark>, and to our friends for always giving us the most <mark>laughter</mark>. We hope today\'s banquet and our little surprises leave you with wonderful memories.',
    ask: 'Two little favours to ask today:',
    ask1Tag: 'Favour 1', ask1: 'Grab the couple for photos anytime!',
    ask2Tag: 'Favour 2', ask2: 'Enjoy the food and drinks to the fullest!',
    end: 'Let\'s welcome a wonderful <mark>2027</mark> together!',
    sign: 'Groom 凱銘 & Bride 詠萱', signSuffix: 'with love',
    skip: 'Tap the letter to show it all at once'
  },
  fortunes: {
    fun: ['【Great Luck】2027: money pours in and every stock hits the daily limit up!', '【Supreme Luck】Eat two extra fried tangyuan today, and the whole year will be sweet!', '【Great Luck】Love is in bloom — singles find a match, couples get sweet enough to rot their teeth!', '【Supreme Luck】Full wallet, full tummy — everything you want shows up just in time!', "【Good Luck】Healthy, safe and well rested — this year's worries vanish after a good night's sleep!", '【Great Luck】Your luck with people is off the charts — everyone you meet brings you good fortune!', "【Good Luck】Slow and steady wins — in 2027, step by step, you'll grow luckier and luckier!", '【Supreme Luck】One wedding candy doubles the sweetness; two keep you sweet all year!', '【Great Luck】Your pay rises like a runner game this year — jumping up, double jumps and all!', '【Good Luck】The diet starts tomorrow — today, enjoy the wedding feast to the full!', "【Great Luck】Red lights turn green for you, there's always a seat on the train — little joys every day!", '【Supreme Luck】Your card luck is booming — the next draw could be a hidden photo!', "【Good Luck】Your battery is always full, you reply in seconds — friends say you're the most reliable!", '【Great Luck】You get first pick of the best dishes, and first pick of good luck too!', '【Good Luck】No need to empty your glass — happiness matters most, and every drink this year tastes like joy!', '【Great Luck】Sunny skies whenever you go out, and you always pick the fastest queue!', "【Supreme Luck】This year your laughter is more intoxicating than the couple's wedding wine!", "【Great Luck】Just like the couple's smiles, your wallet won't close all year!", '【Good Luck】Whoever catches the bouquet today is buying everyone wedding drinks next year!'],
    formal: ['【Supreme Luck】Lucky stars shine on you; may all go well and your whole family be safe and happy.', '【Great Luck】Good health and smooth work — may you rise step by step in the new year.', '【Supreme Luck】Good fortune and long life, peace and health year after year.', '【Great Luck】Blessings fill your home and joys keep coming — double happiness in 2027.', '【Very Good Luck】May your wishes come true, with helping hands all along the way.', '【Great Luck】A harmonious home makes everything prosper — blessings at your door and laughter every year.', '【Supreme Luck】Blooming flowers, a full moon and long life — abundance year after year.', '【Great Luck】Fortune is on your side and a bright future lies ahead — each year better than the last.', '【Very Good Luck】Peace is a blessing and contentment brings joy — every day is a good day.', '【Great Luck】Five blessings at your door, peace through all four seasons, and double happiness ahead.', '【Supreme Luck】A new year begins and everything is renewed — joy upon joy.', "【Great Luck】Share in the couple's happiness — may all you love be well and all you hope come true."]
  },

  photo: {
    title: 'Happy Post! Photo Print Station', desc: 'A special service (no stamp). After the wedding, the couple will print your photo and mail it to you as a keepsake.',
    lot: 'One print per guest!', lotDesc: "Choose the photo you most want to keep from today — it can't be changed once sent",
    pick: '📷 Tap to choose a photo', picked: 'Selected — tap again to change', locked: 'You have sent your photo', preview: 'Preview',
    name: 'Recipient name', phone: 'Phone number', zip: 'Postal code', addr: 'Mailing address (incl. city/district)',
    send: "Send (can't be changed later)", uploading: 'Compressing and uploading…', sent: 'Sent 🔒',
    tooBig: 'Please choose an image under 15MB',
    errNoPhoto: 'Please choose a photo first', errName: "Please enter the recipient's name",
    errPhone: 'Please enter a phone number with at least 8 digits (include the area code for landlines)',
    errZip: 'Please enter a 3–7 digit postal code', errAddr: 'The address is too short — please write it in full (incl. city/district)',
    confirm: "Only one photo per guest, and it can't be changed after sending.<br>Send it now?",
    unreadable: "This photo can't be read",
    unreadableHelp: "This photo's format can't be read (it may be HEIC). Please choose a JPG/PNG from your album, or convert it to JPG first",
    errNoReply: 'The server did not respond correctly (check that the Apps Script deployment\'s "Who has access" is Anyone)',
    errServer: 'Server error: ', errTimeout: 'The upload timed out — the connection may be slow, please try again',
    errOffline: "Can't reach the server — check your connection and try again", errProcess: 'Processing the photo failed — please try another photo',
    errForm: "Can't reach Google Forms — check your connection",
    failed: 'Sending failed, please try again', failedPrefix: 'Sending failed: ',
    note: 'After the wedding, the couple will print your photo as a 4x6 print with a Canon SELPHY CP1500 and mail it to the address you entered.',
    demo: 'Demo: CFG.GFORM is not set, so the photo and address are not actually sent.'
  }
};
