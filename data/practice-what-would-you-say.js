(function () {
    "use strict";

    window.WHAT_WOULD_YOU_SAY_DATA = [
        {
            id: "wwys-travel-001", category: "Travel", difficulty: "Beginner",
            scenario: "You arrive at a hotel and want to check in.", prompt: "What is the natural polite opening?",
            choices: [
                { japanese:"チェックインをお願いします。", kana:"ちぇっくいんを おねがいします。", romaji:"chekkuin o onegai shimasu.", english:"I'd like to check in, please." },
                { japanese:"チェックインが好きです。", kana:"ちぇっくいんが すきです。", romaji:"chekkuin ga suki desu.", english:"I like checking in." },
                { japanese:"チェックアウトをお願いします。", kana:"ちぇっくあうとを おねがいします。", romaji:"chekkuauto o onegai shimasu.", english:"I'd like to check out, please." },
                { japanese:"チェックインは何時ですか？", kana:"ちぇっくいんは なんじですか？", romaji:"chekkuin wa nanji desu ka?", english:"What time is check-in?" }
            ], correctChoice: 0, explanation: "お願いします is a natural, polite way to request a service at a hotel."
        },
        {
            id: "wwys-travel-002", category: "Travel", difficulty: "Beginner",
            scenario: "A restaurant host asks 「何名様ですか？」", prompt: "There are two people in your party. What do you say?",
            choices: [
                { japanese:"二人です。", kana:"ふたりです。", romaji:"futari desu.", english:"Two people." },
                { japanese:"二つです。", kana:"ふたつです。", romaji:"futatsu desu.", english:"Two things." },
                { japanese:"二時です。", kana:"にじです。", romaji:"niji desu.", english:"It's two o'clock." },
                { japanese:"二階です。", kana:"にかいです。", romaji:"nikai desu.", english:"It's the second floor." }
            ], correctChoice: 0, explanation: "人 is the counter for people. 二人 has the special reading ふたり."
        },
        {
            id: "wwys-travel-003", category: "Travel", difficulty: "Beginner",
            scenario: "You are ready to order at a restaurant.", prompt: "How do you politely ask for this item?",
            choices: [
                { japanese:"これをお願いします。", kana:"これを おねがいします。", romaji:"kore o onegai shimasu.", english:"This one, please." },
                { japanese:"これはどこですか？", kana:"これは どこですか？", romaji:"kore wa doko desu ka?", english:"Where is this?" },
                { japanese:"これがありません。", kana:"これが ありません。", romaji:"kore ga arimasen.", english:"There isn't any of this." },
                { japanese:"これを知りません。", kana:"これを しりません。", romaji:"kore o shirimasen.", english:"I don't know this." }
            ], correctChoice: 0, explanation: "これをお願いします is a flexible, polite way to order while pointing at a menu item."
        },
        {
            id: "wwys-travel-004", category: "Travel", difficulty: "Beginner",
            scenario: "You cannot find the station.", prompt: "How do you politely ask where it is?",
            choices: [
                { japanese:"駅はどこですか？", kana:"えきは どこですか？", romaji:"eki wa doko desu ka?", english:"Where is the station?" },
                { japanese:"駅はいつですか？", kana:"えきは いつですか？", romaji:"eki wa itsu desu ka?", english:"When is the station?" },
                { japanese:"駅はいくらですか？", kana:"えきは いくらですか？", romaji:"eki wa ikura desu ka?", english:"How much is the station?" },
                { japanese:"駅はだれですか？", kana:"えきは だれですか？", romaji:"eki wa dare desu ka?", english:"Who is the station?" }
            ], correctChoice: 0, explanation: "どこ asks where a place is. The other question words ask when, how much, or who."
        },
        {
            id: "wwys-travel-005", category: "Travel", difficulty: "Beginner",
            scenario: "You are buying a train ticket to Kyoto.", prompt: "How do you ask for one ticket?",
            choices: [
                { japanese:"京都まで一枚お願いします。", kana:"きょうとまで いちまい おねがいします。", romaji:"Kyouto made ichimai onegai shimasu.", english:"One ticket to Kyoto, please." },
                { japanese:"京都まで一人お願いします。", kana:"きょうとまで ひとり おねがいします。", romaji:"Kyouto made hitori onegai shimasu.", english:"One person to Kyoto, please." },
                { japanese:"京都まで一台お願いします。", kana:"きょうとまで いちだい おねがいします。", romaji:"Kyouto made ichidai onegai shimasu.", english:"One vehicle to Kyoto, please." },
                { japanese:"京都まで一冊お願いします。", kana:"きょうとまで いっさつ おねがいします。", romaji:"Kyouto made issatsu onegai shimasu.", english:"One book to Kyoto, please." }
            ], correctChoice: 0, explanation: "枚 is the usual counter for flat items such as paper tickets."
        },
        {
            id: "wwys-travel-006", category: "Travel", difficulty: "Beginner",
            scenario: "A shop clerk tells you the price, and you decide to buy the item.", prompt: "What is the natural response?",
            choices: [
                { japanese:"これをください。", kana:"これを ください。", romaji:"kore o kudasai.", english:"I'll take this, please." },
                { japanese:"これはいくらですか？", kana:"これは いくらですか？", romaji:"kore wa ikura desu ka?", english:"How much is this?" },
                { japanese:"これを見せてください。", kana:"これを みせて ください。", romaji:"kore o misete kudasai.", english:"Please show me this." },
                { japanese:"これはちょっと…。", kana:"これは ちょっと…。", romaji:"kore wa chotto...", english:"This one is a little…" }
            ], correctChoice: 0, explanation: "これをください naturally tells the clerk that you want to purchase the item."
        },
        {
            id: "wwys-travel-007", category: "Travel", difficulty: "Intermediate",
            scenario: "You want to pay by credit card.", prompt: "How do you politely ask if that is possible?",
            choices: [
                { japanese:"カードで払えますか？", kana:"かーどで はらえますか？", romaji:"kaado de haraemasu ka?", english:"Can I pay by card?" },
                { japanese:"カードを払えますか？", kana:"かーどを はらえますか？", romaji:"kaado o haraemasu ka?", english:"Can I pay the card?" },
                { japanese:"カードがありますか？", kana:"かーどが ありますか？", romaji:"kaado ga arimasu ka?", english:"Do you have a card?" },
                { japanese:"現金で払えますか？", kana:"げんきんで はらえますか？", romaji:"genkin de haraemasu ka?", english:"Can I pay in cash?" }
            ], correctChoice: 0, explanation: "The particle で marks the payment method, and 払えますか asks whether you can pay that way."
        },
        {
            id: "wwys-travel-008", category: "Travel", difficulty: "Beginner",
            scenario: "You did not understand an announcement.", prompt: "How do you politely ask to hear it again?",
            choices: [
                { japanese:"もう一度お願いします。", kana:"もう いちど おねがいします。", romaji:"mou ichido onegai shimasu.", english:"One more time, please." },
                { japanese:"もう一人お願いします。", kana:"もう ひとり おねがいします。", romaji:"mou hitori onegai shimasu.", english:"One more person, please." },
                { japanese:"もう一階お願いします。", kana:"もう いっかい おねがいします。", romaji:"mou ikkai onegai shimasu.", english:"One more floor, please." },
                { japanese:"もう一冊お願いします。", kana:"もう いっさつ おねがいします。", romaji:"mou issatsu onegai shimasu.", english:"One more book, please." }
            ], correctChoice: 0, explanation: "もう一度 means “once more” and is the natural request when you need something repeated."
        },
        {
            id: "wwys-travel-009", category: "Travel", difficulty: "Intermediate",
            scenario: "You are on a train and want to confirm the next stop.", prompt: "What do you ask?",
            choices: [
                { japanese:"次は新宿ですか？", kana:"つぎは しんじゅくですか？", romaji:"tsugi wa Shinjuku desu ka?", english:"Is Shinjuku next?" },
                { japanese:"前は新宿ですか？", kana:"まえは しんじゅくですか？", romaji:"mae wa Shinjuku desu ka?", english:"Was Shinjuku before?" },
                { japanese:"新宿はいくらですか？", kana:"しんじゅくは いくらですか？", romaji:"Shinjuku wa ikura desu ka?", english:"How much is Shinjuku?" },
                { japanese:"新宿で乗りますか？", kana:"しんじゅくで のりますか？", romaji:"Shinjuku de norimasu ka?", english:"Do I board at Shinjuku?" }
            ], correctChoice: 0, explanation: "次 means “next,” so 次は新宿ですか confirms whether Shinjuku is the next stop."
        },
        {
            id: "wwys-travel-010", category: "Travel", difficulty: "Intermediate",
            scenario: "You need to leave your luggage at the hotel until check-in.", prompt: "What is the natural polite request?",
            choices: [
                { japanese:"チェックインまで荷物を預かってもらえますか？", kana:"ちぇっくいんまで にもつを あずかって もらえますか？", romaji:"chekkuin made nimotsu o azukatte moraemasu ka?", english:"Could you keep my luggage until check-in?" },
                { japanese:"チェックインまで荷物を持ってもらえますか？", kana:"ちぇっくいんまで にもつを もって もらえますか？", romaji:"chekkuin made nimotsu o motte moraemasu ka?", english:"Could you carry my luggage until check-in?" },
                { japanese:"チェックインまで荷物を送ってもらえますか？", kana:"ちぇっくいんまで にもつを おくって もらえますか？", romaji:"chekkuin made nimotsu o okutte moraemasu ka?", english:"Could you send my luggage by check-in?" },
                { japanese:"チェックインまで荷物を預かりますか？", kana:"ちぇっくいんまで にもつを あずかりますか？", romaji:"chekkuin made nimotsu o azukarimasu ka?", english:"Will I keep the luggage until check-in?" }
            ], correctChoice: 0, explanation: "預かる means to keep something temporarily. ～てもらえますか makes the request polite and natural."
        },
        {
            id: "wwys-travel-011", category: "Travel", difficulty: "Beginner",
            scenario: "You feel unsafe and urgently need assistance.", prompt: "What should you say clearly?",
            choices: [
                { japanese:"助けてください。", kana:"たすけて ください。", romaji:"tasukete kudasai.", english:"Please help me." },
                { japanese:"待ってください。", kana:"まって ください。", romaji:"matte kudasai.", english:"Please wait." },
                { japanese:"見てください。", kana:"みて ください。", romaji:"mite kudasai.", english:"Please look." },
                { japanese:"食べてください。", kana:"たべて ください。", romaji:"tabete kudasai.", english:"Please eat." }
            ], correctChoice: 0, explanation: "助けてください is a direct, widely understood request for help in an emergency."
        },
        {
            id: "wwys-travel-012", category: "Travel", difficulty: "Beginner",
            scenario: "You want to ask whether a dish contains meat.", prompt: "Which question is appropriate?",
            choices: [
                { japanese:"肉が入っていますか？", kana:"にくが はいっていますか？", romaji:"niku ga haitte imasu ka?", english:"Does it contain meat?" },
                { japanese:"肉を入れますか？", kana:"にくを いれますか？", romaji:"niku o iremasu ka?", english:"Will you put meat in it?" },
                { japanese:"肉を食べますか？", kana:"にくを たべますか？", romaji:"niku o tabemasu ka?", english:"Do you eat meat?" },
                { japanese:"肉はどこですか？", kana:"にくは どこですか？", romaji:"niku wa doko desu ka?", english:"Where is the meat?" }
            ], correctChoice: 0, explanation: "入っていますか asks whether an ingredient is contained in the dish."
        },
        {
            id: "wwys-everyday-001", category: "Everyday", difficulty: "Beginner",
            scenario: "A friend asks if you are free tomorrow, but you already have plans.", prompt: "What is a natural casual reply?",
            choices: [
                { japanese:"ごめん、明日はちょっと…。", kana:"ごめん、あしたは ちょっと…。", romaji:"gomen, ashita wa chotto...", english:"Sorry, tomorrow is a little difficult…" },
                { japanese:"ごめん、明日は大丈夫。", kana:"ごめん、あしたは だいじょうぶ。", romaji:"gomen, ashita wa daijoubu.", english:"Sorry, tomorrow is fine." },
                { japanese:"ごめん、明日は行った。", kana:"ごめん、あしたは いった。", romaji:"gomen, ashita wa itta.", english:"Sorry, I went tomorrow." },
                { japanese:"ごめん、昨日はちょっと…。", kana:"ごめん、きのうは ちょっと…。", romaji:"gomen, kinou wa chotto...", english:"Sorry, yesterday was a little difficult…" }
            ], correctChoice: 0, explanation: "～はちょっと… is a common soft refusal. With a friend, ごめん makes the tone natural and casual."
        },
        {
            id: "wwys-everyday-002", category: "Everyday", difficulty: "Beginner",
            scenario: "A friend suggests getting lunch together, and you agree.", prompt: "What is the natural response?",
            choices: [
                { japanese:"いいね、行こう！", kana:"いいね、いこう！", romaji:"ii ne, ikou!", english:"Sounds good—let's go!" },
                { japanese:"いいえ、行った。", kana:"いいえ、いった。", romaji:"iie, itta.", english:"No, I went." },
                { japanese:"行くです。", kana:"いくです。", romaji:"iku desu.", english:"I go." },
                { japanese:"お昼が来ます。", kana:"おひるが きます。", romaji:"ohiru ga kimasu.", english:"Lunch is coming." }
            ], correctChoice: 0, explanation: "いいね acknowledges the suggestion positively, and 行こう naturally means “let's go.”"
        },
        {
            id: "wwys-everyday-003", category: "Everyday", difficulty: "Beginner",
            scenario: "Someone explains something, and you now understand.", prompt: "What is a natural acknowledgement?",
            choices: [
                { japanese:"なるほど。", kana:"なるほど。", romaji:"naruhodo.", english:"I see." },
                { japanese:"いただきます。", kana:"いただきます。", romaji:"itadakimasu.", english:"Let's eat / I gratefully receive." },
                { japanese:"おかえり。", kana:"おかえり。", romaji:"okaeri.", english:"Welcome back." },
                { japanese:"おやすみ。", kana:"おやすみ。", romaji:"oyasumi.", english:"Good night." }
            ], correctChoice: 0, explanation: "なるほど shows that an explanation makes sense to you. The other phrases belong to different situations."
        },
        {
            id: "wwys-everyday-004", category: "Everyday", difficulty: "Beginner",
            scenario: "A friend thanks you for helping.", prompt: "What is a natural casual reply?",
            choices: [
                { japanese:"どういたしまして。", kana:"どういたしまして。", romaji:"dou itashimashite.", english:"You're welcome." },
                { japanese:"いってらっしゃい。", kana:"いってらっしゃい。", romaji:"itterasshai.", english:"See you / Take care." },
                { japanese:"ごちそうさま。", kana:"ごちそうさま。", romaji:"gochisousama.", english:"Thank you for the meal." },
                { japanese:"はじめまして。", kana:"はじめまして。", romaji:"hajimemashite.", english:"Nice to meet you." }
            ], correctChoice: 0, explanation: "どういたしまして directly responds to thanks. In very casual speech, いえいえ can also be natural, but it is not an option here."
        },
        {
            id: "wwys-everyday-005", category: "Everyday", difficulty: "Beginner",
            scenario: "You enter your home and greet someone who is there.", prompt: "What do you say?",
            choices: [
                { japanese:"ただいま。", kana:"ただいま。", romaji:"tadaima.", english:"I'm home." },
                { japanese:"おかえり。", kana:"おかえり。", romaji:"okaeri.", english:"Welcome home." },
                { japanese:"いってきます。", kana:"いってきます。", romaji:"ittekimasu.", english:"I'm leaving." },
                { japanese:"いらっしゃいませ。", kana:"いらっしゃいませ。", romaji:"irasshaimase.", english:"Welcome to our store." }
            ], correctChoice: 0, explanation: "The person arriving home says ただいま. The person already at home answers おかえり."
        },
        {
            id: "wwys-everyday-006", category: "Everyday", difficulty: "Intermediate",
            scenario: "A coworker asks you to check a document when you have time.", prompt: "How do you acknowledge the request politely?",
            choices: [
                { japanese:"わかりました。確認します。", kana:"わかりました。かくにんします。", romaji:"wakarimashita. kakunin shimasu.", english:"Understood. I'll check it." },
                { japanese:"わかりませんでした。確認した。", kana:"わかりませんでした。かくにんした。", romaji:"wakarimasen deshita. kakunin shita.", english:"I didn't understand. I checked it." },
                { japanese:"わかりました。確認しました。", kana:"わかりました。かくにんしました。", romaji:"wakarimashita. kakunin shimashita.", english:"Understood. I checked it." },
                { japanese:"わかりません。確認してください。", kana:"わかりません。かくにんして ください。", romaji:"wakarimasen. kakunin shite kudasai.", english:"I don't understand. Please check it." }
            ], correctChoice: 0, explanation: "わかりました politely acknowledges the request, and 確認します clearly states what you will do."
        },
        {
            id: "wwys-everyday-007", category: "Everyday", difficulty: "Beginner",
            scenario: "You accidentally bump into someone.", prompt: "What should you say immediately?",
            choices: [
                { japanese:"すみません。", kana:"すみません。", romaji:"sumimasen.", english:"I'm sorry / Excuse me." },
                { japanese:"おめでとう。", kana:"おめでとう。", romaji:"omedetou.", english:"Congratulations." },
                { japanese:"いただきます。", kana:"いただきます。", romaji:"itadakimasu.", english:"Let's eat." },
                { japanese:"久しぶり。", kana:"ひさしぶり。", romaji:"hisashiburi.", english:"Long time no see." }
            ], correctChoice: 0, explanation: "すみません is appropriate for a quick apology to a stranger."
        },
        {
            id: "wwys-everyday-008", category: "Everyday", difficulty: "Intermediate",
            scenario: "A friend asks whether you have seen a new movie. You have not seen it yet.", prompt: "What is a natural casual answer?",
            choices: [
                { japanese:"まだ見てない。", kana:"まだ みてない。", romaji:"mada mitenai.", english:"I haven't seen it yet." },
                { japanese:"もう見てない。", kana:"もう みてない。", romaji:"mou mitenai.", english:"I don't watch it anymore." },
                { japanese:"まだ見た。", kana:"まだ みた。", romaji:"mada mita.", english:"I still saw it." },
                { japanese:"映画を見える。", kana:"えいがを みえる。", romaji:"eiga o mieru.", english:"The movie can be seen." }
            ], correctChoice: 0, explanation: "まだ + negative means “not yet.” 見てない is the casual contraction of 見ていない."
        },
        {
            id: "wwys-everyday-009", category: "Everyday", difficulty: "Beginner",
            scenario: "A friend looks worried, and you want to ask if they are okay.", prompt: "What do you say?",
            choices: [
                { japanese:"大丈夫？", kana:"だいじょうぶ？", romaji:"daijoubu?", english:"Are you okay?" },
                { japanese:"大丈夫です。", kana:"だいじょうぶです。", romaji:"daijoubu desu.", english:"I'm okay." },
                { japanese:"おいしい？", kana:"おいしい？", romaji:"oishii?", english:"Is it tasty?" },
                { japanese:"いくら？", kana:"いくら？", romaji:"ikura?", english:"How much?" }
            ], correctChoice: 0, explanation: "With rising intonation, 大丈夫？ naturally asks a friend whether they are okay."
        },
        {
            id: "wwys-everyday-010", category: "Everyday", difficulty: "Intermediate",
            scenario: "You are leaving a gathering before everyone else.", prompt: "What is a polite, natural phrase?",
            choices: [
                { japanese:"お先に失礼します。", kana:"おさきに しつれいします。", romaji:"osaki ni shitsurei shimasu.", english:"Excuse me for leaving before you." },
                { japanese:"お先にいただきます。", kana:"おさきに いただきます。", romaji:"osaki ni itadakimasu.", english:"I'll eat before you." },
                { japanese:"お先におかえり。", kana:"おさきに おかえり。", romaji:"osaki ni okaeri.", english:"Welcome home before you." },
                { japanese:"お先におめでとう。", kana:"おさきに おめでとう。", romaji:"osaki ni omedetou.", english:"Congratulations before you." }
            ], correctChoice: 0, explanation: "お先に失礼します politely acknowledges that you are leaving before the other people."
        },
        {
            id: "wwys-real-001", category: "Real-world", difficulty: "Beginner",
            scenario: "A friend sends you a surprising photo in a chat.", prompt: "What is a natural casual reaction?",
            choices: [
                { japanese:"え、マジで？", kana:"え、まじで？", romaji:"e, maji de?", english:"Wait, seriously?" },
                { japanese:"え、お先に失礼します。", kana:"え、おさきに しつれいします。", romaji:"e, osaki ni shitsurei shimasu.", english:"Uh, excuse me for leaving first." },
                { japanese:"え、いただきます。", kana:"え、いただきます。", romaji:"e, itadakimasu.", english:"Uh, let's eat." },
                { japanese:"え、いらっしゃいませ。", kana:"え、いらっしゃいませ。", romaji:"e, irasshaimase.", english:"Uh, welcome to our store." }
            ], correctChoice: 0, explanation: "マジで？ is a common casual reaction meaning “Seriously?” It is inappropriate in formal situations."
        },
        {
            id: "wwys-real-002", category: "Real-world", difficulty: "Intermediate",
            scenario: "A friend apologizes for replying late to your message, and it was not a problem.", prompt: "What is a warm casual response?",
            choices: [
                { japanese:"全然大丈夫！", kana:"ぜんぜん だいじょうぶ！", romaji:"zenzen daijoubu!", english:"Totally fine!" },
                { japanese:"絶対だめ！", kana:"ぜったい だめ！", romaji:"zettai dame!", english:"Absolutely not!" },
                { japanese:"返信はいらない。", kana:"へんしんは いらない。", romaji:"henshin wa iranai.", english:"I don't need a reply." },
                { japanese:"遅くないでした。", kana:"おそくないでした。", romaji:"osokunai deshita.", english:"It was not late." }
            ], correctChoice: 0, explanation: "全然大丈夫 is very common casual reassurance. Use a more formal expression with customers or senior colleagues."
        },
        {
            id: "wwys-real-003", category: "Real-world", difficulty: "Intermediate",
            scenario: "A friend posts that they passed an important exam.", prompt: "What is the natural supportive reply?",
            choices: [
                { japanese:"おめでとう！すごい！", kana:"おめでとう！すごい！", romaji:"omedetou! sugoi!", english:"Congratulations! That's amazing!" },
                { japanese:"ごちそうさま！すごい！", kana:"ごちそうさま！すごい！", romaji:"gochisousama! sugoi!", english:"Thanks for the meal! Amazing!" },
                { japanese:"おかえり！すごい！", kana:"おかえり！すごい！", romaji:"okaeri! sugoi!", english:"Welcome home! Amazing!" },
                { japanese:"残念！すごい！", kana:"ざんねん！すごい！", romaji:"zannen! sugoi!", english:"Too bad! Amazing!" }
            ], correctChoice: 0, explanation: "おめでとう directly congratulates the person, and すごい adds an enthusiastic reaction."
        },
        {
            id: "wwys-real-004", category: "Real-world", difficulty: "Intermediate",
            scenario: "A friend shares a plan that sounds fun in a group chat.", prompt: "How do you casually say you want to join?",
            choices: [
                { japanese:"私も行きたい！", kana:"わたしも いきたい！", romaji:"watashi mo ikitai!", english:"I want to go too!" },
                { japanese:"私を行きたい！", kana:"わたしを いきたい！", romaji:"watashi o ikitai!", english:"I want to go me!" },
                { japanese:"私も行きました！", kana:"わたしも いきました！", romaji:"watashi mo ikimashita!", english:"I went too!" },
                { japanese:"私も行かないでした！", kana:"わたしも いかないでした！", romaji:"watashi mo ikanai deshita!", english:"I did not go too!" }
            ], correctChoice: 0, explanation: "も means “too,” and the ～たい form expresses what you want to do."
        },
        {
            id: "wwys-real-005", category: "Real-world", difficulty: "Intermediate",
            scenario: "Someone sends a joke in a casual chat and you find it very funny.", prompt: "Which short online reaction fits?",
            choices: [
                { japanese:"笑った。", kana:"わらった。", romaji:"waratta.", english:"That made me laugh." },
                { japanese:"困った。", kana:"こまった。", romaji:"komatta.", english:"I'm in trouble." },
                { japanese:"払った。", kana:"はらった。", romaji:"haratta.", english:"I paid." },
                { japanese:"習った。", kana:"ならった。", romaji:"naratta.", english:"I learned it." }
            ], correctChoice: 0, explanation: "笑った is a natural casual reaction meaning that something made you laugh. Online, 笑 or w may also appear, but they are not required here."
        },
        {
            id: "wwys-real-006", category: "Real-world", difficulty: "Intermediate",
            scenario: "A close friend says they are exhausted after work.", prompt: "What is a supportive casual reply?",
            choices: [
                { japanese:"おつかれ！ゆっくり休んでね。", kana:"おつかれ！ゆっくり やすんでね。", romaji:"otsukare! yukkuri yasunde ne.", english:"Good work! Get some good rest." },
                { japanese:"大変だね。がんばって！", kana:"たいへんだね。がんばって！", romaji:"taihen da ne. ganbatte!", english:"That's tough. Keep going!" },
                { japanese:"もう仕事は終わった？", kana:"もう しごとは おわった？", romaji:"mou shigoto wa owatta?", english:"Is work finished already?" },
                { japanese:"いらっしゃいませ！走ってね。", kana:"いらっしゃいませ！はしってね。", romaji:"irasshaimase! hashitte ne.", english:"Welcome! Go run." }
            ], correctChoice: 0, explanation: "おつかれ acknowledges their effort, and 休んでね gently encourages a close friend to rest."
        },
        {
            id: "wwys-real-007", category: "Real-world", difficulty: "Advanced",
            scenario: "A friend suggests an expensive plan that you cannot afford right now.", prompt: "What is a natural, tactful casual reply?",
            choices: [
                { japanese:"行きたいけど、今月ちょっと厳しいかも。", kana:"いきたいけど、こんげつ ちょっと きびしいかも。", romaji:"ikitai kedo, kongetsu chotto kibishii kamo.", english:"I'd like to go, but this month might be a little tight." },
                { japanese:"行きたいけど、今月は忙しい。", kana:"いきたいけど、こんげつは いそがしい。", romaji:"ikitai kedo, kongetsu wa isogashii.", english:"I'd like to go, but I'm busy this month." },
                { japanese:"高いけど、たぶん行く。", kana:"たかいけど、たぶん いく。", romaji:"takai kedo, tabun iku.", english:"It's expensive, but I'll probably go." },
                { japanese:"高いので、絶対にあなたが悪い。", kana:"たかいので、ぜったいに あなたが わるい。", romaji:"takai node, zettai ni anata ga warui.", english:"It's expensive, so this is definitely your fault." }
            ], correctChoice: 0, explanation: "ちょっと厳しい softens the refusal and commonly means that money, timing, or circumstances are difficult."
        },
        {
            id: "wwys-real-008", category: "Real-world", difficulty: "Intermediate",
            scenario: "A friend asks for your honest opinion about a movie you thought was just okay.", prompt: "What is a natural, softened response?",
            choices: [
                { japanese:"悪くないけど、私は普通かな。", kana:"わるくないけど、わたしは ふつうかな。", romaji:"warukunai kedo, watashi wa futsuu kana.", english:"It wasn't bad, but for me it was just okay." },
                { japanese:"面白かったけど、もう見ないかな。", kana:"おもしろかったけど、もう みないかな。", romaji:"omoshirokatta kedo, mou minai kana.", english:"It was interesting, but I probably won't watch it again." },
                { japanese:"普通だけど、絶対おすすめ！", kana:"ふつうだけど、ぜったい おすすめ！", romaji:"futsuu da kedo, zettai osusume!", english:"It was average, but I absolutely recommend it!" },
                { japanese:"まだ見てないから、わからない。", kana:"まだ みてないから、わからない。", romaji:"mada mitenai kara, wakaranai.", english:"I haven't seen it yet, so I don't know." }
            ], correctChoice: 0, explanation: "悪くないけど softens criticism, while ～かな makes the personal judgment less blunt."
        }
    ];
})();
