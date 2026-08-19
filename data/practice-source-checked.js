/* Sakura Source-Checked Practice Pack v1
   Sakura-authored drills grounded in official Japan Foundation Irodori lesson objectives.
   The exercises below are not copied lesson text. Each item carries its official source page + lesson reference.
*/
(function () {
  "use strict";

  const STARTER = "https://www.irodori.jpf.go.jp/en/starter/pdf.html";
  const E1 = "https://www.irodori.jpf.go.jp/en/elementary01/pdf.html";

  window.SAKURA_SOURCE_CHECKED_PRACTICE = Object.freeze({
    version: 1,
    methodology: Object.freeze({
      name: "Japan Foundation Irodori / Can-do grounded",
      note: "Sakura-authored exercises based on official real-life communication objectives. They are not copied from the textbook.",
      sources: Object.freeze([
        Object.freeze({ name: "Irodori Starter (A1)", url: STARTER }),
        Object.freeze({ name: "Irodori Elementary 1 (A2)", url: E1 }),
        Object.freeze({ name: "Marugoto Can-do approach", url: "https://marugoto.jpf.go.jp/en/about/marugoto/" })
      ])
    }),
    items: Object.freeze([
      // STARTER A1 — Lesson 2: I'm sorry, I don't really understand.
      Object.freeze({
        id: "src-a1-l02-repeat", level: "Starter A1", category: "Communication", lesson: "Starter Lesson 2", sourceTitle: "I'm sorry, I don't really understand.", sourceUrl: STARTER,
        scenario: "Someone explains something in Japanese, but you did not catch it.", prompt: "What is a simple polite way to ask them to say it again?",
        choices: Object.freeze([
          Object.freeze({ japanese: "すみません、もう一度お願いします。", kana: "すみません、もう いちど おねがいします。", romaji: "sumimasen, mou ichido onegai shimasu.", english: "Excuse me, one more time, please." }),
          Object.freeze({ japanese: "すみません、もう一人お願いします。", kana: "すみません、もう ひとり おねがいします。", romaji: "sumimasen, mou hitori onegai shimasu.", english: "Excuse me, one more person, please." }),
          Object.freeze({ japanese: "すみません、もう終わりました。", kana: "すみません、もう おわりました。", romaji: "sumimasen, mou owarimashita.", english: "Excuse me, it already finished." }),
          Object.freeze({ japanese: "すみません、もう大丈夫です。", kana: "すみません、もう だいじょうぶです。", romaji: "sumimasen, mou daijoubu desu.", english: "Excuse me, I'm fine now." })
        ]), correctChoice: 0,
        explanation: "もう一度 means “one more time.” Adding すみません makes the request polite and natural when you need repetition."
      }),
      Object.freeze({
        id: "src-a1-l02-understand", level: "Starter A1", category: "Communication", lesson: "Starter Lesson 2", sourceTitle: "I'm sorry, I don't really understand.", sourceUrl: STARTER,
        scenario: "A coworker asks whether you understood a long explanation, but you did not understand it well.", prompt: "Which response clearly and politely communicates that?",
        choices: Object.freeze([
          Object.freeze({ japanese: "すみません、よくわかりません。", kana: "すみません、よく わかりません。", romaji: "sumimasen, yoku wakarimasen.", english: "I'm sorry, I don't really understand." }),
          Object.freeze({ japanese: "はい、よくわかります。", kana: "はい、よく わかります。", romaji: "hai, yoku wakarimasu.", english: "Yes, I understand well." }),
          Object.freeze({ japanese: "いいえ、わかりました。", kana: "いいえ、わかりました。", romaji: "iie, wakarimashita.", english: "No, I understood." }),
          Object.freeze({ japanese: "すみません、よく食べません。", kana: "すみません、よく たべません。", romaji: "sumimasen, yoku tabemasen.", english: "I'm sorry, I don't eat often." })
        ]), correctChoice: 0,
        explanation: "よくわかりません is a common beginner-friendly way to say that you do not understand well."
      }),

      // STARTER A1 — Lesson 3: Nice to meet you.
      Object.freeze({
        id: "src-a1-l03-intro", level: "Starter A1", category: "Introductions", lesson: "Starter Lesson 3", sourceTitle: "Nice to meet you.", sourceUrl: STARTER,
        scenario: "You meet a new Japanese classmate for the first time. Your name is Mia.", prompt: "Which opening is appropriate?",
        choices: Object.freeze([
          Object.freeze({ japanese: "はじめまして。ミアです。よろしくお願いします。", kana: "はじめまして。みあです。よろしく おねがいします。", romaji: "hajimemashite. Mia desu. yoroshiku onegai shimasu.", english: "Nice to meet you. I'm Mia. It's a pleasure to meet you." }),
          Object.freeze({ japanese: "おかえりなさい。ミアです。", kana: "おかえりなさい。みあです。", romaji: "okaerinasai. Mia desu.", english: "Welcome home. I'm Mia." }),
          Object.freeze({ japanese: "いただきます。ミアです。", kana: "いただきます。みあです。", romaji: "itadakimasu. Mia desu.", english: "Let's eat. I'm Mia." }),
          Object.freeze({ japanese: "おやすみなさい。ミアです。", kana: "おやすみなさい。みあです。", romaji: "oyasuminasai. Mia desu.", english: "Good night. I'm Mia." })
        ]), correctChoice: 0,
        explanation: "はじめまして is used when meeting someone for the first time; よろしくお願いします naturally closes a basic self-introduction."
      }),
      Object.freeze({
        id: "src-a1-l03-country", level: "Starter A1", category: "Introductions", lesson: "Starter Lesson 3", sourceTitle: "Nice to meet you.", sourceUrl: STARTER,
        scenario: "During a simple self-introduction, you want to say you are from the Philippines.", prompt: "Which sentence says that?",
        choices: Object.freeze([
          Object.freeze({ japanese: "フィリピンから来ました。", kana: "ふぃりぴんから きました。", romaji: "Firipin kara kimashita.", english: "I came from the Philippines / I'm from the Philippines." }),
          Object.freeze({ japanese: "フィリピンまで行きました。", kana: "ふぃりぴんまで いきました。", romaji: "Firipin made ikimashita.", english: "I went as far as the Philippines." }),
          Object.freeze({ japanese: "フィリピンを食べました。", kana: "ふぃりぴんを たべました。", romaji: "Firipin o tabemashita.", english: "I ate the Philippines." }),
          Object.freeze({ japanese: "フィリピンで寝ました。", kana: "ふぃりぴんで ねました。", romaji: "Firipin de nemashita.", english: "I slept in the Philippines." })
        ]), correctChoice: 0,
        explanation: "～から来ました is a standard self-introduction pattern for saying where you come from."
      }),

      // STARTER A1 — Lesson 6: I'd like a cheeseburger, please.
      Object.freeze({
        id: "src-a1-l06-order", level: "Starter A1", category: "Food", lesson: "Starter Lesson 6", sourceTitle: "I'd like a cheeseburger, please.", sourceUrl: STARTER,
        scenario: "You are at a counter and want one cheeseburger.", prompt: "What is a simple polite order?",
        choices: Object.freeze([
          Object.freeze({ japanese: "チーズバーガーを一つお願いします。", kana: "ちーずばーがーを ひとつ おねがいします。", romaji: "chiizubaagaa o hitotsu onegai shimasu.", english: "One cheeseburger, please." }),
          Object.freeze({ japanese: "チーズバーガーが一人お願いします。", kana: "ちーずばーがーが ひとり おねがいします。", romaji: "chiizubaagaa ga hitori onegai shimasu.", english: "One person cheeseburger, please." }),
          Object.freeze({ japanese: "チーズバーガーはどこですか。", kana: "ちーずばーがーは どこですか。", romaji: "chiizubaagaa wa doko desu ka.", english: "Where is the cheeseburger?" }),
          Object.freeze({ japanese: "チーズバーガーを見ました。", kana: "ちーずばーがーを みました。", romaji: "chiizubaagaa o mimashita.", english: "I saw a cheeseburger." })
        ]), correctChoice: 0,
        explanation: "～を一つお願いします is a straightforward polite pattern for ordering one item."
      }),
      Object.freeze({
        id: "src-a1-l06-point", level: "Starter A1", category: "Food", lesson: "Starter Lesson 6", sourceTitle: "I'd like a cheeseburger, please.", sourceUrl: STARTER,
        scenario: "You cannot read the menu item name, so you point to the picture you want.", prompt: "Which phrase works naturally?",
        choices: Object.freeze([
          Object.freeze({ japanese: "これをお願いします。", kana: "これを おねがいします。", romaji: "kore o onegai shimasu.", english: "This one, please." }),
          Object.freeze({ japanese: "これは誰ですか。", kana: "これは だれですか。", romaji: "kore wa dare desu ka.", english: "Who is this?" }),
          Object.freeze({ japanese: "これに住んでいます。", kana: "これに すんでいます。", romaji: "kore ni sunde imasu.", english: "I live in this." }),
          Object.freeze({ japanese: "これから来ました。", kana: "これから きました。", romaji: "kore kara kimashita.", english: "I came from this." })
        ]), correctChoice: 0,
        explanation: "When pointing at an item, これをお願いします is a very useful polite request."
      }),

      // STARTER A1 — Lesson 10: Please lend me the stapler.
      Object.freeze({
        id: "src-a1-l10-borrow", level: "Starter A1", category: "Workplace", lesson: "Starter Lesson 10", sourceTitle: "Please lend me the stapler.", sourceUrl: STARTER,
        scenario: "At work, you need to borrow your coworker's stapler.", prompt: "Which request is natural and polite?",
        choices: Object.freeze([
          Object.freeze({ japanese: "すみません、ホッチキスを貸してもらえますか。", kana: "すみません、ほっちきすを かして もらえますか。", romaji: "sumimasen, hotchikisu o kashite moraemasu ka.", english: "Excuse me, could you lend me the stapler?" }),
          Object.freeze({ japanese: "すみません、ホッチキスを借りてください。", kana: "すみません、ほっちきすを かりて ください。", romaji: "sumimasen, hotchikisu o karite kudasai.", english: "Excuse me, please borrow the stapler." }),
          Object.freeze({ japanese: "すみません、ホッチキスを食べますか。", kana: "すみません、ほっちきすを たべますか。", romaji: "sumimasen, hotchikisu o tabemasu ka.", english: "Excuse me, do you eat the stapler?" }),
          Object.freeze({ japanese: "すみません、ホッチキスは駅ですか。", kana: "すみません、ほっちきすは えきですか。", romaji: "sumimasen, hotchikisu wa eki desu ka.", english: "Excuse me, is the stapler a station?" })
        ]), correctChoice: 0,
        explanation: "貸してもらえますか asks whether the other person can lend/do something for you."
      }),
      Object.freeze({
        id: "src-a1-l10-use", level: "Starter A1", category: "Workplace", lesson: "Starter Lesson 10", sourceTitle: "Please lend me the stapler.", sourceUrl: STARTER,
        scenario: "You want permission to use a pen on the desk.", prompt: "What can you ask?",
        choices: Object.freeze([
          Object.freeze({ japanese: "このペン、使ってもいいですか。", kana: "この ぺん、つかっても いいですか。", romaji: "kono pen, tsukatte mo ii desu ka.", english: "May I use this pen?" }),
          Object.freeze({ japanese: "このペン、使わないでください。", kana: "この ぺん、つかわないで ください。", romaji: "kono pen, tsukawanaide kudasai.", english: "Please don't use this pen." }),
          Object.freeze({ japanese: "このペン、使いましたか。", kana: "この ぺん、つかいましたか。", romaji: "kono pen, tsukaimashita ka.", english: "Did you use this pen?" }),
          Object.freeze({ japanese: "このペン、いくらですか。", kana: "この ぺん、いくらですか。", romaji: "kono pen, ikura desu ka.", english: "How much is this pen?" })
        ]), correctChoice: 0,
        explanation: "～てもいいですか is a standard way to ask permission to do something."
      }),

      // STARTER A1 — Lesson 12: Do you want to go for a drink together?
      Object.freeze({
        id: "src-a1-l12-invite", level: "Starter A1", category: "Social", lesson: "Starter Lesson 12", sourceTitle: "Do you want to go for a drink together?", sourceUrl: STARTER,
        scenario: "You want to invite a coworker to go for a drink after work.", prompt: "Which invitation sounds natural?",
        choices: Object.freeze([
          Object.freeze({ japanese: "仕事のあと、一緒に飲みに行きませんか。", kana: "しごとの あと、いっしょに のみに いきませんか。", romaji: "shigoto no ato, issho ni nomi ni ikimasen ka.", english: "Would you like to go for a drink together after work?" }),
          Object.freeze({ japanese: "仕事のあと、一緒に飲みに行きましたか。", kana: "しごとの あと、いっしょに のみに いきましたか。", romaji: "shigoto no ato, issho ni nomi ni ikimashita ka.", english: "Did you go for a drink together after work?" }),
          Object.freeze({ japanese: "仕事のあと、一緒に飲みませんでした。", kana: "しごとの あと、いっしょに のみませんでした。", romaji: "shigoto no ato, issho ni nomimasen deshita.", english: "We didn't drink together after work." }),
          Object.freeze({ japanese: "仕事のあと、一緒に駅ですか。", kana: "しごとの あと、いっしょに えきですか。", romaji: "shigoto no ato, issho ni eki desu ka.", english: "After work, are we a station together?" })
        ]), correctChoice: 0,
        explanation: "～ませんか is commonly used to invite someone to do something together."
      }),
      Object.freeze({
        id: "src-a1-l12-decline", level: "Starter A1", category: "Social", lesson: "Starter Lesson 12", sourceTitle: "Do you want to go for a drink together?", sourceUrl: STARTER,
        scenario: "Someone invites you out tonight, but you cannot go. You want to decline gently.", prompt: "Which response is natural?",
        choices: Object.freeze([
          Object.freeze({ japanese: "すみません、今日はちょっと…。", kana: "すみません、きょうは ちょっと…。", romaji: "sumimasen, kyou wa chotto...", english: "Sorry, today is a little difficult…" }),
          Object.freeze({ japanese: "はい、絶対に行きませんか。", kana: "はい、ぜったいに いきませんか。", romaji: "hai, zettai ni ikimasen ka.", english: "Yes, shall we absolutely not go?" }),
          Object.freeze({ japanese: "いいえ、今日は駅です。", kana: "いいえ、きょうは えきです。", romaji: "iie, kyou wa eki desu.", english: "No, today is a station." }),
          Object.freeze({ japanese: "すみません、今日は食べます。", kana: "すみません、きょうは たべます。", romaji: "sumimasen, kyou wa tabemasu.", english: "Sorry, I will eat today." })
        ]), correctChoice: 0,
        explanation: "今日はちょっと… is a common soft refusal; the unfinished wording avoids sounding too blunt."
      }),

      // STARTER A1 — Lesson 13: Does this bus go to the airport?
      Object.freeze({
        id: "src-a1-l13-bus", level: "Starter A1", category: "Transportation", lesson: "Starter Lesson 13", sourceTitle: "Does this bus go to the airport?", sourceUrl: STARTER,
        scenario: "You are unsure whether the bus in front of you goes to the airport.", prompt: "What should you ask?",
        choices: Object.freeze([
          Object.freeze({ japanese: "このバスは空港に行きますか。", kana: "この ばすは くうこうに いきますか。", romaji: "kono basu wa kuukou ni ikimasu ka.", english: "Does this bus go to the airport?" }),
          Object.freeze({ japanese: "このバスは空港を食べますか。", kana: "この ばすは くうこうを たべますか。", romaji: "kono basu wa kuukou o tabemasu ka.", english: "Does this bus eat the airport?" }),
          Object.freeze({ japanese: "このバスは空港が好きですか。", kana: "この ばすは くうこうが すきですか。", romaji: "kono basu wa kuukou ga suki desu ka.", english: "Does this bus like the airport?" }),
          Object.freeze({ japanese: "このバスは空港から来ません。", kana: "この ばすは くうこうから きません。", romaji: "kono basu wa kuukou kara kimasen.", english: "This bus doesn't come from the airport." })
        ]), correctChoice: 0,
        explanation: "Destination with 行きます is commonly marked by に (or へ)."
      }),
      Object.freeze({
        id: "src-a1-l13-getoff", level: "Starter A1", category: "Transportation", lesson: "Starter Lesson 13", sourceTitle: "Does this bus go to the airport?", sourceUrl: STARTER,
        scenario: "You are on a bus and want to know where to get off for the station.", prompt: "Which question works?",
        choices: Object.freeze([
          Object.freeze({ japanese: "駅はどこで降りますか。", kana: "えきは どこで おりますか。", romaji: "eki wa doko de orimasu ka.", english: "Where do I get off for the station?" }),
          Object.freeze({ japanese: "駅はどこで乗りますか。", kana: "えきは どこで のりますか。", romaji: "eki wa doko de norimasu ka.", english: "Where do I get on for the station?" }),
          Object.freeze({ japanese: "駅は何時を降りますか。", kana: "えきは なんじを おりますか。", romaji: "eki wa nanji o orimasu ka.", english: "What time do I get off the station?" }),
          Object.freeze({ japanese: "駅は誰で降りますか。", kana: "えきは だれで おりますか。", romaji: "eki wa dare de orimasu ka.", english: "With whom do I get off the station?" })
        ]), correctChoice: 0,
        explanation: "降ります means to get off a vehicle; どこで asks at which place/stop the action happens."
      }),

      // STARTER A1 — Lesson 15: I need some batteries.
      Object.freeze({
        id: "src-a1-l15-battery", level: "Starter A1", category: "Shopping", lesson: "Starter Lesson 15", sourceTitle: "I need some batteries.", sourceUrl: STARTER,
        scenario: "At a store, you are looking for batteries and want to ask if they have any.", prompt: "Which question is useful?",
        choices: Object.freeze([
          Object.freeze({ japanese: "すみません、電池はありますか。", kana: "すみません、でんちは ありますか。", romaji: "sumimasen, denchi wa arimasu ka.", english: "Excuse me, do you have batteries?" }),
          Object.freeze({ japanese: "すみません、電池は誰ですか。", kana: "すみません、でんちは だれですか。", romaji: "sumimasen, denchi wa dare desu ka.", english: "Excuse me, who are the batteries?" }),
          Object.freeze({ japanese: "すみません、電池を飲みますか。", kana: "すみません、でんちを のみますか。", romaji: "sumimasen, denchi o nomimasu ka.", english: "Excuse me, do you drink batteries?" }),
          Object.freeze({ japanese: "すみません、電池に住んでいますか。", kana: "すみません、でんちに すんでいますか。", romaji: "sumimasen, denchi ni sunde imasu ka.", english: "Excuse me, do you live in batteries?" })
        ]), correctChoice: 0,
        explanation: "～はありますか is a basic and useful pattern for asking whether a shop has an item."
      }),
      Object.freeze({
        id: "src-a1-l15-where", level: "Starter A1", category: "Shopping", lesson: "Starter Lesson 15", sourceTitle: "I need some batteries.", sourceUrl: STARTER,
        scenario: "A clerk says the batteries are in stock, but you cannot find them.", prompt: "What can you ask next?",
        choices: Object.freeze([
          Object.freeze({ japanese: "電池はどこですか。", kana: "でんちは どこですか。", romaji: "denchi wa doko desu ka.", english: "Where are the batteries?" }),
          Object.freeze({ japanese: "電池はいつですか。", kana: "でんちは いつですか。", romaji: "denchi wa itsu desu ka.", english: "When are the batteries?" }),
          Object.freeze({ japanese: "電池はいくつですか。", kana: "でんちは いくつですか。", romaji: "denchi wa ikutsu desu ka.", english: "How many batteries is it?" }),
          Object.freeze({ japanese: "電池はだれですか。", kana: "でんちは だれですか。", romaji: "denchi wa dare desu ka.", english: "Who are the batteries?" })
        ]), correctChoice: 0,
        explanation: "どこ asks where something or someplace is."
      }),

      // STARTER A1 — Lesson 16: How much is this?
      Object.freeze({
        id: "src-a1-l16-price", level: "Starter A1", category: "Shopping", lesson: "Starter Lesson 16", sourceTitle: "How much is this?", sourceUrl: STARTER,
        scenario: "An item has no visible price tag.", prompt: "How do you ask the price?",
        choices: Object.freeze([
          Object.freeze({ japanese: "これはいくらですか。", kana: "これは いくらですか。", romaji: "kore wa ikura desu ka.", english: "How much is this?" }),
          Object.freeze({ japanese: "これはどこですか。", kana: "これは どこですか。", romaji: "kore wa doko desu ka.", english: "Where is this?" }),
          Object.freeze({ japanese: "これはいつですか。", kana: "これは いつですか。", romaji: "kore wa itsu desu ka.", english: "When is this?" }),
          Object.freeze({ japanese: "これはだれですか。", kana: "これは だれですか。", romaji: "kore wa dare desu ka.", english: "Who is this?" })
        ]), correctChoice: 0,
        explanation: "いくら is the standard question word for asking a price."
      }),
      Object.freeze({
        id: "src-a1-l16-total", level: "Starter A1", category: "Shopping", lesson: "Starter Lesson 16", sourceTitle: "How much is this?", sourceUrl: STARTER,
        scenario: "You are buying several things and want to confirm the total price.", prompt: "Which question is natural?",
        choices: Object.freeze([
          Object.freeze({ japanese: "全部でいくらですか。", kana: "ぜんぶで いくらですか。", romaji: "zenbu de ikura desu ka.", english: "How much is it altogether?" }),
          Object.freeze({ japanese: "全部でどこですか。", kana: "ぜんぶで どこですか。", romaji: "zenbu de doko desu ka.", english: "Where is it altogether?" }),
          Object.freeze({ japanese: "全部を何時ですか。", kana: "ぜんぶを なんじですか。", romaji: "zenbu o nanji desu ka.", english: "What time is all of it?" }),
          Object.freeze({ japanese: "全部が誰ですか。", kana: "ぜんぶが だれですか。", romaji: "zenbu ga dare desu ka.", english: "Who is everything?" })
        ]), correctChoice: 0,
        explanation: "全部で means “in total / altogether,” so 全部でいくらですか asks for the total price."
      }),

      // ELEMENTARY 1 A2 — Lesson 6: Please tell me how to get to the post office.
      Object.freeze({
        id: "src-a2-l06-directions", level: "Elementary 1 A2", category: "Directions", lesson: "Elementary 1 Lesson 6", sourceTitle: "Please tell me how to get to the post office.", sourceUrl: E1,
        scenario: "You are lost and want someone to tell you how to get to the post office.", prompt: "Which request is natural and polite?",
        choices: Object.freeze([
          Object.freeze({ japanese: "すみません、郵便局までの行き方を教えてください。", kana: "すみません、ゆうびんきょくまでの いきかたを おしえて ください。", romaji: "sumimasen, yuubinkyoku made no ikikata o oshiete kudasai.", english: "Excuse me, please tell me how to get to the post office." }),
          Object.freeze({ japanese: "すみません、郵便局まで食べてください。", kana: "すみません、ゆうびんきょくまで たべて ください。", romaji: "sumimasen, yuubinkyoku made tabete kudasai.", english: "Excuse me, please eat up to the post office." }),
          Object.freeze({ japanese: "すみません、郵便局から寝てください。", kana: "すみません、ゆうびんきょくから ねて ください。", romaji: "sumimasen, yuubinkyoku kara nete kudasai.", english: "Excuse me, please sleep from the post office." }),
          Object.freeze({ japanese: "すみません、郵便局は何歳ですか。", kana: "すみません、ゆうびんきょくは なんさいですか。", romaji: "sumimasen, yuubinkyoku wa nansai desu ka.", english: "Excuse me, how old is the post office?" })
        ]), correctChoice: 0,
        explanation: "～までの行き方 means “the way/how to get to ～,” and 教えてください politely asks someone to tell you."
      }),
      Object.freeze({
        id: "src-a2-l06-straight", level: "Elementary 1 A2", category: "Directions", lesson: "Elementary 1 Lesson 6", sourceTitle: "Please tell me how to get to the post office.", sourceUrl: E1,
        scenario: "Someone asks how to reach a convenience store. It is straight ahead, then on the right.", prompt: "Which instruction communicates that?",
        choices: Object.freeze([
          Object.freeze({ japanese: "まっすぐ行って、右に曲がってください。", kana: "まっすぐ いって、みぎに まがって ください。", romaji: "massugu itte, migi ni magatte kudasai.", english: "Go straight, then turn right." }),
          Object.freeze({ japanese: "まっすぐ食べて、右に寝てください。", kana: "まっすぐ たべて、みぎに ねて ください。", romaji: "massugu tabete, migi ni nete kudasai.", english: "Eat straight and sleep to the right." }),
          Object.freeze({ japanese: "右を飲んで、まっすぐ来ません。", kana: "みぎを のんで、まっすぐ きません。", romaji: "migi o nonde, massugu kimasen.", english: "Drink the right and don't come straight." }),
          Object.freeze({ japanese: "まっすぐは何時ですか。", kana: "まっすぐは なんじですか。", romaji: "massugu wa nanji desu ka.", english: "What time is straight?" })
        ]), correctChoice: 0,
        explanation: "The て-form links sequential actions: 行って → 曲がってください."
      }),

      // ELEMENTARY 1 A2 — Lesson 7: I will be a bit late because I got lost.
      Object.freeze({
        id: "src-a2-l07-late", level: "Elementary 1 A2", category: "Plans", lesson: "Elementary 1 Lesson 7", sourceTitle: "I will be a bit late because I got lost.", sourceUrl: E1,
        scenario: "You are meeting a friend, but you got lost and will arrive late.", prompt: "Which message explains the situation naturally?",
        choices: Object.freeze([
          Object.freeze({ japanese: "道に迷って、少し遅れます。すみません。", kana: "みちに まよって、すこし おくれます。すみません。", romaji: "michi ni mayotte, sukoshi okuremasu. sumimasen.", english: "I got lost, so I'll be a little late. Sorry." }),
          Object.freeze({ japanese: "道を食べて、少し早いです。", kana: "みちを たべて、すこし はやいです。", romaji: "michi o tabete, sukoshi hayai desu.", english: "I ate the road, so I'm a little early." }),
          Object.freeze({ japanese: "道に住んで、少し飲みます。", kana: "みちに すんで、すこし のみます。", romaji: "michi ni sunde, sukoshi nomimasu.", english: "I live on the road, so I'll drink a little." }),
          Object.freeze({ japanese: "道はどこで、少し駅です。", kana: "みちは どこで、すこし えきです。", romaji: "michi wa doko de, sukoshi eki desu.", english: "Where is the road, and it's a little station." })
        ]), correctChoice: 0,
        explanation: "道に迷う means “to get lost,” and 遅れます tells the other person you will be late."
      }),
      Object.freeze({
        id: "src-a2-l07-delaytime", level: "Elementary 1 A2", category: "Plans", lesson: "Elementary 1 Lesson 7", sourceTitle: "I will be a bit late because I got lost.", sourceUrl: E1,
        scenario: "You expect to be about ten minutes late and want to message the person waiting.", prompt: "Which message is clear?",
        choices: Object.freeze([
          Object.freeze({ japanese: "10分ぐらい遅れます。先に入っていてください。", kana: "じゅっぷんぐらい おくれます。さきに はいっていて ください。", romaji: "juppun gurai okuremasu. saki ni haitte ite kudasai.", english: "I'll be about ten minutes late. Please go in ahead of me." }),
          Object.freeze({ japanese: "10分ぐらい食べます。先に寝てください。", kana: "じゅっぷんぐらい たべます。さきに ねて ください。", romaji: "juppun gurai tabemasu. saki ni nete kudasai.", english: "I'll eat for about ten minutes. Please sleep first." }),
          Object.freeze({ japanese: "10分ぐらい駅です。先に飲みます。", kana: "じゅっぷんぐらい えきです。さきに のみます。", romaji: "juppun gurai eki desu. saki ni nomimasu.", english: "It's about ten minutes station. I'll drink first." }),
          Object.freeze({ japanese: "10分ぐらい誰ですか。先に来ません。", kana: "じゅっぷんぐらい だれですか。さきに きません。", romaji: "juppun gurai dare desu ka. saki ni kimasen.", english: "Who is about ten minutes? I won't come first." })
        ]), correctChoice: 0,
        explanation: "～分ぐらい遅れます gives an approximate delay. 先に～ていてください can tell the other person to go ahead without you."
      }),

      // ELEMENTARY 1 A2 — Lesson 9: Will you tell me how to read this?
      Object.freeze({
        id: "src-a2-l09-reading", level: "Elementary 1 A2", category: "Study", lesson: "Elementary 1 Lesson 9", sourceTitle: "Will you tell me how to read this?", sourceUrl: E1,
        scenario: "You see a kanji you cannot read.", prompt: "What can you ask?",
        choices: Object.freeze([
          Object.freeze({ japanese: "すみません、これは何と読みますか。", kana: "すみません、これは なんと よみますか。", romaji: "sumimasen, kore wa nan to yomimasu ka.", english: "Excuse me, how do you read this?" }),
          Object.freeze({ japanese: "すみません、これは何を食べますか。", kana: "すみません、これは なにを たべますか。", romaji: "sumimasen, kore wa nani o tabemasu ka.", english: "Excuse me, what does this eat?" }),
          Object.freeze({ japanese: "すみません、これはどこに住みますか。", kana: "すみません、これは どこに すみますか。", romaji: "sumimasen, kore wa doko ni sumimasu ka.", english: "Excuse me, where does this live?" }),
          Object.freeze({ japanese: "すみません、これは誰と飲みますか。", kana: "すみません、これは だれと のみますか。", romaji: "sumimasen, kore wa dare to nomimasu ka.", english: "Excuse me, who does this drink with?" })
        ]), correctChoice: 0,
        explanation: "何と読みますか asks “How is this read?” and is useful when you encounter unfamiliar kanji or words."
      }),
      Object.freeze({
        id: "src-a2-l09-meaning", level: "Elementary 1 A2", category: "Study", lesson: "Elementary 1 Lesson 9", sourceTitle: "Will you tell me how to read this?", sourceUrl: E1,
        scenario: "You can read a word, but you do not know what it means.", prompt: "Which question asks for the meaning?",
        choices: Object.freeze([
          Object.freeze({ japanese: "これはどういう意味ですか。", kana: "これは どういう いみですか。", romaji: "kore wa dou iu imi desu ka.", english: "What does this mean?" }),
          Object.freeze({ japanese: "これはどういう駅ですか。", kana: "これは どういう えきですか。", romaji: "kore wa dou iu eki desu ka.", english: "What kind of station is this?" }),
          Object.freeze({ japanese: "これは何時に食べますか。", kana: "これは なんじに たべますか。", romaji: "kore wa nanji ni tabemasu ka.", english: "What time do you eat this?" }),
          Object.freeze({ japanese: "これは誰から来ますか。", kana: "これは だれから きますか。", romaji: "kore wa dare kara kimasu ka.", english: "Who does this come from?" })
        ]), correctChoice: 0,
        explanation: "どういう意味ですか is a common way to ask what a word or expression means."
      }),

      // ELEMENTARY 1 A2 — Lesson 13: It will probably end in about ten minutes.
      Object.freeze({
        id: "src-a2-l13-finish", level: "Elementary 1 A2", category: "Workplace", lesson: "Elementary 1 Lesson 13", sourceTitle: "It will probably end in about ten minutes.", sourceUrl: E1,
        scenario: "A coworker asks when the task will be finished. You estimate about ten more minutes.", prompt: "Which answer fits?",
        choices: Object.freeze([
          Object.freeze({ japanese: "あと10分ぐらいで終わると思います。", kana: "あと じゅっぷんぐらいで おわると おもいます。", romaji: "ato juppun gurai de owaru to omoimasu.", english: "I think it'll be finished in about ten more minutes." }),
          Object.freeze({ japanese: "あと10分ぐらいで食べると思います。", kana: "あと じゅっぷんぐらいで たべると おもいます。", romaji: "ato juppun gurai de taberu to omoimasu.", english: "I think I'll eat in about ten more minutes." }),
          Object.freeze({ japanese: "あと10分ぐらいが駅だと思います。", kana: "あと じゅっぷんぐらいが えきだと おもいます。", romaji: "ato juppun gurai ga eki da to omoimasu.", english: "I think about ten more minutes is a station." }),
          Object.freeze({ japanese: "あと10分ぐらいを読みます。", kana: "あと じゅっぷんぐらいを よみます。", romaji: "ato juppun gurai o yomimasu.", english: "I'll read about ten more minutes." })
        ]), correctChoice: 0,
        explanation: "あと10分ぐらいで gives the estimated remaining time; ～と思います softens the estimate."
      }),
      Object.freeze({
        id: "src-a2-l13-status", level: "Elementary 1 A2", category: "Workplace", lesson: "Elementary 1 Lesson 13", sourceTitle: "It will probably end in about ten minutes.", sourceUrl: E1,
        scenario: "Your supervisor asks whether a report is finished. It is not finished yet.", prompt: "Which concise answer is appropriate?",
        choices: Object.freeze([
          Object.freeze({ japanese: "まだ終わっていません。", kana: "まだ おわっていません。", romaji: "mada owatte imasen.", english: "It isn't finished yet." }),
          Object.freeze({ japanese: "もう終わっていません。", kana: "もう おわっていません。", romaji: "mou owatte imasen.", english: "It already isn't finished." }),
          Object.freeze({ japanese: "まだ食べていませんか。", kana: "まだ たべていませんか。", romaji: "mada tabete imasen ka.", english: "Haven't you eaten yet?" }),
          Object.freeze({ japanese: "まだ駅ではありません。", kana: "まだ えきでは ありません。", romaji: "mada eki dewa arimasen.", english: "It isn't a station yet." })
        ]), correctChoice: 0,
        explanation: "まだ～ていません expresses “not yet” for an action or task that has not been completed."
      }),

      // ELEMENTARY 1 A2 — Lesson 14: May I take a day off?
      Object.freeze({
        id: "src-a2-l14-dayoff", level: "Elementary 1 A2", category: "Workplace", lesson: "Elementary 1 Lesson 14", sourceTitle: "May I take a day off?", sourceUrl: E1,
        scenario: "You need to ask your supervisor if you may take tomorrow off.", prompt: "Which request is appropriate?",
        choices: Object.freeze([
          Object.freeze({ japanese: "すみません、明日休んでもいいですか。", kana: "すみません、あした やすんでも いいですか。", romaji: "sumimasen, ashita yasunde mo ii desu ka.", english: "Excuse me, may I take tomorrow off?" }),
          Object.freeze({ japanese: "すみません、明日休んでください。", kana: "すみません、あした やすんで ください。", romaji: "sumimasen, ashita yasunde kudasai.", english: "Excuse me, please take tomorrow off." }),
          Object.freeze({ japanese: "すみません、明日休みましたか。", kana: "すみません、あした やすみましたか。", romaji: "sumimasen, ashita yasumimashita ka.", english: "Excuse me, did you take tomorrow off?" }),
          Object.freeze({ japanese: "すみません、明日は休みが好きです。", kana: "すみません、あしたは やすみが すきです。", romaji: "sumimasen, ashita wa yasumi ga suki desu.", english: "Excuse me, I like tomorrow's day off." })
        ]), correctChoice: 0,
        explanation: "～てもいいですか asks permission. In a real workplace, the exact level of politeness may vary by organization and relationship."
      }),
      Object.freeze({
        id: "src-a2-l14-reason", level: "Elementary 1 A2", category: "Workplace", lesson: "Elementary 1 Lesson 14", sourceTitle: "May I take a day off?", sourceUrl: E1,
        scenario: "You need to leave work early because you have a hospital appointment.", prompt: "Which explanation is clear and polite?",
        choices: Object.freeze([
          Object.freeze({ japanese: "病院の予約があるので、今日は少し早く帰ってもいいですか。", kana: "びょういんの よやくが あるので、きょうは すこし はやく かえっても いいですか。", romaji: "byouin no yoyaku ga aru node, kyou wa sukoshi hayaku kaette mo ii desu ka.", english: "I have a hospital appointment, so may I leave a little early today?" }),
          Object.freeze({ japanese: "病院を食べるので、今日は早く寝てください。", kana: "びょういんを たべるので、きょうは はやく ねて ください。", romaji: "byouin o taberu node, kyou wa hayaku nete kudasai.", english: "Because I eat the hospital, please sleep early today." }),
          Object.freeze({ japanese: "病院は駅なので、今日は飲みませんか。", kana: "びょういんは えきなので、きょうは のみませんか。", romaji: "byouin wa eki na node, kyou wa nomimasen ka.", english: "Because the hospital is a station, shall we not drink today?" }),
          Object.freeze({ japanese: "病院から来たので、今日は何歳ですか。", kana: "びょういんから きたので、きょうは なんさいですか。", romaji: "byouin kara kita node, kyou wa nansai desu ka.", english: "Because I came from the hospital, how old is today?" })
        ]), correctChoice: 0,
        explanation: "～ので gives a reason in a relatively neutral/polite way, followed by the permission request ～てもいいですか."
      }),

      // ELEMENTARY 1 A2 — Lesson 15: I have a fever, and my throat is sore.
      Object.freeze({
        id: "src-a2-l15-symptoms", level: "Elementary 1 A2", category: "Health", lesson: "Elementary 1 Lesson 15", sourceTitle: "I have a fever, and my throat is sore.", sourceUrl: E1,
        scenario: "At a clinic, you need to explain that you have a fever and a sore throat.", prompt: "Which sentence communicates that?",
        choices: Object.freeze([
          Object.freeze({ japanese: "熱があって、のどが痛いです。", kana: "ねつが あって、のどが いたいです。", romaji: "netsu ga atte, nodo ga itai desu.", english: "I have a fever, and my throat hurts." }),
          Object.freeze({ japanese: "熱を食べて、のどが好きです。", kana: "ねつを たべて、のどが すきです。", romaji: "netsu o tabete, nodo ga suki desu.", english: "I ate a fever, and I like my throat." }),
          Object.freeze({ japanese: "熱は駅で、のどを読みます。", kana: "ねつは えきで、のどを よみます。", romaji: "netsu wa eki de, nodo o yomimasu.", english: "The fever is a station, and I read my throat." }),
          Object.freeze({ japanese: "熱が行って、のどは何時ですか。", kana: "ねつが いって、のどは なんじですか。", romaji: "netsu ga itte, nodo wa nanji desu ka.", english: "The fever goes, and what time is the throat?" })
        ]), correctChoice: 0,
        explanation: "熱がある means “to have a fever,” and ～が痛い describes where it hurts."
      }),
      Object.freeze({
        id: "src-a2-l15-duration", level: "Elementary 1 A2", category: "Health", lesson: "Elementary 1 Lesson 15", sourceTitle: "I have a fever, and my throat is sore.", sourceUrl: E1,
        scenario: "A doctor asks how long you have had the symptoms. They started yesterday.", prompt: "Which answer is useful?",
        choices: Object.freeze([
          Object.freeze({ japanese: "昨日からです。", kana: "きのうからです。", romaji: "kinou kara desu.", english: "Since yesterday." }),
          Object.freeze({ japanese: "昨日まで行きます。", kana: "きのうまで いきます。", romaji: "kinou made ikimasu.", english: "I'll go until yesterday." }),
          Object.freeze({ japanese: "昨日を食べました。", kana: "きのうを たべました。", romaji: "kinou o tabemashita.", english: "I ate yesterday." }),
          Object.freeze({ japanese: "昨日はどこですか。", kana: "きのうは どこですか。", romaji: "kinou wa doko desu ka.", english: "Where is yesterday?" })
        ]), correctChoice: 0,
        explanation: "Time + から can mark the starting point: 昨日からです = “since yesterday.”"
      }),

      // ELEMENTARY 1 A2 — Lesson 18: How about giving something as a gift?
      Object.freeze({
        id: "src-a2-l18-giftidea", level: "Elementary 1 A2", category: "Social", lesson: "Elementary 1 Lesson 18", sourceTitle: "How about giving something as a gift?", sourceUrl: E1,
        scenario: "You and a friend are choosing a birthday present. You want to suggest flowers.", prompt: "Which suggestion is natural?",
        choices: Object.freeze([
          Object.freeze({ japanese: "花をプレゼントするのはどうですか。", kana: "はなを ぷれぜんとするのは どうですか。", romaji: "hana o purezento suru no wa dou desu ka.", english: "How about giving flowers as a present?" }),
          Object.freeze({ japanese: "花をプレゼントしたのはどこですか。", kana: "はなを ぷれぜんとしたのは どこですか。", romaji: "hana o purezento shita no wa doko desu ka.", english: "Where was it that gave flowers as a present?" }),
          Object.freeze({ japanese: "花がプレゼントを食べますか。", kana: "はなが ぷれぜんとを たべますか。", romaji: "hana ga purezento o tabemasu ka.", english: "Do flowers eat presents?" }),
          Object.freeze({ japanese: "花は何時に駅ですか。", kana: "はなは なんじに えきですか。", romaji: "hana wa nanji ni eki desu ka.", english: "What time are flowers a station?" })
        ]), correctChoice: 0,
        explanation: "～のはどうですか is a useful pattern for making a suggestion: “How about doing ～?”"
      }),
      Object.freeze({
        id: "src-a2-l18-reaction", level: "Elementary 1 A2", category: "Social", lesson: "Elementary 1 Lesson 18", sourceTitle: "How about giving something as a gift?", sourceUrl: E1,
        scenario: "Your friend suggests giving a practical gift, and you think it is a good idea.", prompt: "Which response agrees naturally?",
        choices: Object.freeze([
          Object.freeze({ japanese: "いいですね。それにしましょう。", kana: "いいですね。それに しましょう。", romaji: "ii desu ne. sore ni shimashou.", english: "That sounds good. Let's go with that." }),
          Object.freeze({ japanese: "いいですね。それを食べません。", kana: "いいですね。それを たべません。", romaji: "ii desu ne. sore o tabemasen.", english: "That sounds good. I won't eat that." }),
          Object.freeze({ japanese: "いいですね。それは駅でした。", kana: "いいですね。それは えきでした。", romaji: "ii desu ne. sore wa eki deshita.", english: "That sounds good. That was a station." }),
          Object.freeze({ japanese: "いいですね。それから何歳ですか。", kana: "いいですね。それから なんさいですか。", romaji: "ii desu ne. sore kara nansai desu ka.", english: "That sounds good. Then how old are you?" })
        ]), correctChoice: 0,
        explanation: "それにしましょう means “let's choose/go with that” and works well when agreeing on an option."
      })
    ])
  });
}());
