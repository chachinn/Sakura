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

    const fallbackChoices = [
        { japanese:"ちょっとわかりません。", kana:"ちょっと わかりません。", romaji:"chotto wakarimasen.", english:"I don't quite understand." },
        { japanese:"大丈夫です。", kana:"だいじょうぶです。", romaji:"daijoubu desu.", english:"It's okay." },
        { japanese:"また今度お願いします。", kana:"また こんど おねがいします。", romaji:"mata kondo onegai shimasu.", english:"Another time, please." },
        { japanese:"まだ決めていません。", kana:"まだ きめていません。", romaji:"mada kimete imasen.", english:"I haven't decided yet." },
        { japanese:"そうかもしれません。", kana:"そう かもしれません。", romaji:"sou kamo shiremasen.", english:"That may be so." },
        { japanese:"今日は難しいです。", kana:"きょうは むずかしいです。", romaji:"kyou wa muzukashii desu.", english:"Today is difficult for me." },
        { japanese:"もう一度お願いします。", kana:"もう いちど おねがいします。", romaji:"mou ichido onegai shimasu.", english:"One more time, please." },
        { japanese:"あとで確認します。", kana:"あとで かくにんします。", romaji:"ato de kakunin shimasu.", english:"I'll check later." },
        { japanese:"それは知りません。", kana:"それは しりません。", romaji:"sore wa shirimasen.", english:"I don't know about that." },
        { japanese:"ここで待ちます。", kana:"ここで まちます。", romaji:"koko de machimasu.", english:"I'll wait here." },
        { japanese:"今は必要ありません。", kana:"いまは ひつよう ありません。", romaji:"ima wa hitsuyou arimasen.", english:"I don't need it now." },
        { japanese:"先に行ってください。", kana:"さきに いって ください。", romaji:"saki ni itte kudasai.", english:"Please go ahead." }
    ];
    const additions = [
        ["restaurant-031","Restaurant","Beginner","You want a table away from the smoking area.","How do you make the request politely?","禁煙席をお願いします。","きんえんせきを おねがいします。","kin'enseki o onegai shimasu.","A non-smoking seat, please.","禁煙席 is the standard term for a non-smoking seat."],
        ["restaurant-032","Restaurant","Beginner","You need an English menu.","What do you ask the server?","英語のメニューはありますか？","えいごの めにゅーは ありますか？","eigo no menyuu wa arimasu ka?","Do you have an English menu?","ありますか politely asks whether something is available."],
        ["restaurant-033","Restaurant","Intermediate","You have a food allergy and cannot eat peanuts.","What is the clearest warning?","ピーナッツアレルギーがあります。","ぴーなっつ あれるぎーが あります。","piinattsu arerugii ga arimasu.","I have a peanut allergy.","アレルギーがあります clearly communicates a medical food restriction."],
        ["restaurant-034","Restaurant","Beginner","You are finished and want the bill.","What do you say?","お会計をお願いします。","おかいけいを おねがいします。","okaikei o onegai shimasu.","The bill, please.","お会計 is the natural restaurant term for the bill or checkout."],
        ["restaurant-035","Restaurant","Intermediate","You want the sauce served separately.","How do you ask?","ソースは別にしていただけますか？","そーすは べつに して いただけますか？","soosu wa betsu ni shite itadakemasu ka?","Could I have the sauce on the side?","別にしていただけますか is a polite request to keep something separate."],
        ["restaurant-036","Restaurant","Beginner","You want to confirm whether a dish is spicy.","What do you ask?","これは辛いですか？","これは からいですか？","kore wa karai desu ka?","Is this spicy?","辛い directly asks whether food is spicy."],
        ["cafe-037","Cafe","Beginner","You want your coffee without sugar.","How do you order it?","砂糖なしでお願いします。","さとう なしで おねがいします。","satou nashi de onegai shimasu.","Without sugar, please.","なしで means without something when customizing an order."],
        ["cafe-038","Cafe","Intermediate","You want to know if the café has Wi-Fi.","What is natural to ask?","Wi-Fiは使えますか？","わいふぁいは つかえますか？","waifai wa tsukaemasu ka?","Can I use Wi-Fi here?","使えますか asks whether a service is available for use."],
        ["cafe-039","Cafe","Beginner","You want your drink to go.","What do you say?","持ち帰りでお願いします。","もちかえりで おねがいします。","mochikaeri de onegai shimasu.","To go, please.","持ち帰り is a standard way to say takeout or to go."],
        ["cafe-040","Cafe","Beginner","You want a medium-size latte.","How do you order?","ラテのMサイズをお願いします。","らての えむさいずを おねがいします。","rate no emu saizu o onegai shimasu.","A medium latte, please.","Item plus size plus お願いします is a clear café order."],
        ["cafe-041","Cafe","Intermediate","You want to ask whether a seat is free.","What do you say to someone nearby?","ここ、空いていますか？","ここ、あいていますか？","koko, aite imasu ka?","Is this seat free?","空いていますか naturally asks whether a place or seat is available."],
        ["shopping-042","Shopping","Beginner","You want to try on a jacket.","What do you ask the clerk?","試着してもいいですか？","しちゃくしても いいですか？","shichaku shite mo ii desu ka?","May I try this on?","～てもいいですか asks permission, and 試着 means trying on clothes."],
        ["shopping-043","Shopping","Beginner","You need a different size.","How do you ask?","もう少し大きいサイズはありますか？","もう すこし おおきい さいずは ありますか？","mou sukoshi ookii saizu wa arimasu ka?","Do you have a slightly larger size?","もう少し大きい politely specifies a slightly larger option."],
        ["shopping-044","Shopping","Intermediate","You want a tax-free purchase.","What do you ask?","免税にできますか？","めんぜいに できますか？","menzei ni dekimasu ka?","Can this be made tax-free?","免税 is the standard term used for tax-free shopping."],
        ["shopping-045","Shopping","Beginner","You only want to look around.","How do you respond to a clerk offering help?","見ているだけです。","みている だけです。","mite iru dake desu.","I'm just looking.","～だけです communicates that you are only browsing."],
        ["shopping-046","Shopping","Beginner","You want a bag for your purchase.","What do you say?","袋をお願いします。","ふくろを おねがいします。","fukuro o onegai shimasu.","A bag, please.","袋 is a shopping bag; お願いします makes the request polite."],
        ["shopping-047","Shopping","Intermediate","An item is defective and you want to exchange it.","What is a clear polite request?","これを交換していただけますか？","これを こうかんして いただけますか？","kore o koukan shite itadakemasu ka?","Could you exchange this?","交換していただけますか is a polite request for an exchange."],
        ["hotel-048","Hotel","Beginner","You want to leave your luggage before check-in.","What do you ask at reception?","チェックイン前に荷物を預けられますか？","ちぇっくいんまえに にもつを あずけられますか？","chekkuin mae ni nimotsu o azukeraremasu ka?","Can I leave my luggage before check-in?","預けられますか asks whether luggage storage is possible."],
        ["hotel-049","Hotel","Intermediate","The air conditioner in your room does not work.","How do you report it?","エアコンが動きません。","えあこんが うごきません。","eakon ga ugokimasen.","The air conditioner isn't working.","動きません clearly reports that a machine is not operating."],
        ["hotel-050","Hotel","Beginner","You need another towel.","What do you request?","タオルをもう一枚お願いします。","たおるを もう いちまい おねがいします。","taoru o mou ichimai onegai shimasu.","One more towel, please.","もう一枚 uses the flat-item counter for an additional towel."],
        ["hotel-051","Hotel","Intermediate","You want a late checkout.","What do you ask reception?","チェックアウトを延長できますか？","ちぇっくあうとを えんちょう できますか？","chekkuauto o enchou dekimasu ka?","Can I extend the checkout time?","延長できますか asks whether an extension is possible."],
        ["hotel-052","Hotel","Beginner","You cannot open your room door with the key card.","How do you explain the problem?","カードキーが使えません。","かーどきーが つかえません。","kaado kii ga tsukaemasen.","My key card doesn't work.","使えません states that the key card cannot be used."],
        ["train-053","Train","Beginner","You want to know whether this train goes to Shinjuku.","What do you ask?","この電車は新宿に行きますか？","この でんしゃは しんじゅくに いきますか？","kono densha wa Shinjuku ni ikimasu ka?","Does this train go to Shinjuku?","Destination plus に行きますか confirms where a train goes."],
        ["train-054","Train","Intermediate","You need to know where to transfer.","What do you ask station staff?","どこで乗り換えればいいですか？","どこで のりかえれば いいですか？","doko de norikaereba ii desu ka?","Where should I transfer?","～ばいいですか naturally asks what action would be best."],
        ["train-055","Train","Beginner","You missed your stop.","How do you tell a station employee?","乗り過ごしてしまいました。","のりすごして しまいました。","norisugoshite shimaimashita.","I accidentally missed my stop.","～てしまいました conveys an unintended completed action."],
        ["train-056","Train","Intermediate","You want to reserve a seat on the next train.","What do you request?","次の電車の指定席をお願いします。","つぎの でんしゃの していせきを おねがいします。","tsugi no densha no shiteiseki o onegai shimasu.","A reserved seat on the next train, please.","指定席 is a reserved seat, contrasted with 自由席."],
        ["train-057","Train","Beginner","You want to ask when the last train leaves.","What do you say?","終電は何時ですか？","しゅうでんは なんじですか？","shuuden wa nanji desu ka?","What time is the last train?","終電 means the last train of the day."],
        ["train-058","Train","Intermediate","Your IC card will not pass the gate.","How do you explain it?","ICカードが反応しません。","あいしーかーどが はんのうしません。","aishii kaado ga hannou shimasen.","My IC card isn't responding.","反応しません describes a card or device failing to register."],
        ["directions-059","Directions","Beginner","You want directions to the nearest convenience store.","What do you ask?","一番近いコンビニはどこですか？","いちばん ちかい こんびには どこですか？","ichiban chikai konbini wa doko desu ka?","Where is the nearest convenience store?","一番近い means nearest."],
        ["directions-060","Directions","Intermediate","You want to know how long it takes on foot.","What do you ask?","歩いてどのくらいかかりますか？","あるいて どのくらい かかりますか？","aruite dono kurai kakarimasu ka?","About how long does it take on foot?","どのくらいかかりますか asks the approximate duration."],
        ["directions-061","Directions","Beginner","You want someone to point it out on a map.","What do you request?","地図で教えてください。","ちずで おしえて ください。","chizu de oshiete kudasai.","Please show me on the map.","地図で marks the map as the means used to explain."],
        ["directions-062","Directions","Intermediate","You think you may be going the wrong way.","What do you ask?","この道で合っていますか？","この みちで あっていますか？","kono michi de atte imasu ka?","Am I going the right way?","合っていますか checks whether your route or understanding is correct."],
        ["directions-063","Directions","Beginner","You are looking for an elevator.","What do you ask?","エレベーターはどこですか？","えれべーたーは どこですか？","erebeetaa wa doko desu ka?","Where is the elevator?","Place plus はどこですか is a direct, polite location question."],
        ["payment-064","Payment","Beginner","You want to pay separately from your friend.","What do you ask?","別々に払えますか？","べつべつに はらえますか？","betsubetsu ni haraemasu ka?","Can we pay separately?","別々に means separately."],
        ["payment-065","Payment","Beginner","You want a receipt.","What do you request?","レシートをお願いします。","れしーとを おねがいします。","reshiito o onegai shimasu.","A receipt, please.","レシート is the everyday term for a receipt."],
        ["payment-066","Payment","Intermediate","You want to use contactless payment.","What do you ask?","タッチ決済は使えますか？","たっち けっさいは つかえますか？","tacchi kessai wa tsukaemasu ka?","Can I use contactless payment?","タッチ決済 refers to tap/contactless payment."],
        ["payment-067","Payment","Beginner","You think you received the wrong change.","How do you raise the issue politely?","お釣りが違うようです。","おつりが ちがう ようです。","otsuri ga chigau you desu.","It seems the change is incorrect.","～ようです softens the report while clearly identifying the issue."],
        ["emergency-068","Emergency","Beginner","You need someone to call an ambulance.","What do you say urgently?","救急車を呼んでください。","きゅうきゅうしゃを よんで ください。","kyuukyuusha o yonde kudasai.","Please call an ambulance.","救急車を呼んでください is a direct emergency request."],
        ["emergency-069","Emergency","Beginner","You have lost your passport.","How do you report it?","パスポートをなくしました。","ぱすぽーとを なくしました。","pasupooto o nakushimashita.","I lost my passport.","なくしました clearly states that an item has been lost."],
        ["emergency-070","Emergency","Intermediate","You need a doctor who speaks English.","What do you ask?","英語が話せる医者はいますか？","えいごが はなせる いしゃは いますか？","eigo ga hanaseru isha wa imasu ka?","Is there a doctor who speaks English?","The potential form 話せる modifies 医者."],
        ["emergency-071","Emergency","Beginner","You feel sick and need help.","What do you say?","気分が悪いです。","きぶんが わるいです。","kibun ga warui desu.","I feel unwell.","気分が悪い is a standard way to say you feel physically unwell."],
        ["emergency-072","Emergency","Intermediate","Your wallet was stolen.","How do you report it?","財布を盗まれました。","さいふを ぬすまれました。","saifu o nusumaremashita.","My wallet was stolen.","The passive 盗まれました states that you were affected by the theft."],
        ["everyday-073","Everyday","Beginner","Someone holds the door for you.","What is a natural polite response?","ありがとうございます。","ありがとうございます。","arigatou gozaimasu.","Thank you very much.","ありがとうございます is the standard polite expression of thanks."],
        ["everyday-074","Everyday","Beginner","You need to pass directly in front of someone.","What do you say as you pass?","前を失礼します。","まえを しつれいします。","mae o shitsurei shimasu.","Excuse me for passing in front of you.","前を失礼します politely acknowledges passing through someone's view or space."],
        ["everyday-075","Everyday","Intermediate","You want someone to speak more slowly.","What do you ask?","もう少しゆっくり話していただけますか？","もう すこし ゆっくり はなして いただけますか？","mou sukoshi yukkuri hanashite itadakemasu ka?","Could you speak a little more slowly?","～ていただけますか is a courteous request."],
        ["everyday-076","Everyday","Beginner","You did not hear what someone said.","What do you ask?","もう一度言ってください。","もう いちど いって ください。","mou ichido itte kudasai.","Please say that again.","もう一度 plus 言ってください requests repetition."],
        ["everyday-077","Everyday","Intermediate","You need to interrupt a colleague briefly.","How do you get their attention politely?","失礼します、少しよろしいですか？","しつれいします、すこし よろしいですか？","shitsurei shimasu, sukoshi yoroshii desu ka?","Excuse me, do you have a moment?","失礼します acknowledges the interruption, while 少しよろしいですか asks for a moment."],
        ["everyday-078","Everyday","Beginner","You are invited but already have plans.","How do you decline gently?","すみません、その日は予定があります。","すみません、そのひは よていが あります。","sumimasen, sono hi wa yotei ga arimasu.","Sorry, I already have plans that day.","予定があります gives a clear, polite reason without oversharing."],
        ["friendship-079","Friendship","Beginner","A friend asks if you want to hang out tomorrow.","How do you accept enthusiastically?","うん、行こう！","うん、いこう！","un, ikou!","Yeah, let's go!","The casual volitional 行こう naturally accepts a plan with a friend."],
        ["friendship-080","Friendship","Intermediate","A friend seems upset and you want to check in.","What do you ask gently?","どうしたの？","どうしたの？","doushita no?","What's wrong?","どうしたの is a natural caring question among close people."],
        ["friendship-081","Friendship","Beginner","A friend sends good news.","How do you congratulate them?","おめでとう！","おめでとう！","omedetou!","Congratulations!","おめでとう is the natural casual congratulation."],
        ["friendship-082","Friendship","Intermediate","You want to thank a friend for listening.","What do you say?","話を聞いてくれてありがとう。","はなしを きいてくれて ありがとう。","hanashi o kiite kurete arigatou.","Thanks for listening to me.","～てくれてありがとう thanks someone for an action that helped you."],
        ["friendship-083","Friendship","Beginner","You want your friend to message when they arrive.","What do you say?","着いたら連絡してね。","ついたら れんらくしてね。","tsuitara renraku shite ne.","Message me when you arrive, okay?","～たら marks when the arrival happens, and ね softens the request."],
        ["texting-084","Texting","Beginner","You are replying late to a friend's message.","How do you apologize casually?","返信遅くなってごめん。","へんしん おそくなって ごめん。","henshin osoku natte gomen.","Sorry for the late reply.","This is a common concise apology in personal messages."],
        ["texting-085","Texting","Intermediate","You cannot talk now and will reply later.","What is natural in a message?","あとで返信するね。","あとで へんしんするね。","ato de henshin suru ne.","I'll reply later.","The casual plain form plus ね sounds friendly and reassuring."],
        ["texting-086","Texting","Beginner","You want to ask whether your message arrived.","What do you text?","メッセージ届いた？","めっせーじ とどいた？","messeeji todoita?","Did the message arrive?","届いた？ is a natural casual confirmation in chat."],
        ["texting-087","Texting","Intermediate","You want to say you are almost there.","What do you send?","もうすぐ着くよ。","もうすぐ つくよ。","mou sugu tsuku yo.","I'll be there soon.","もうすぐ means soon, and よ supplies useful new information."],
        ["workplace-088","Workplace","Intermediate","You want a colleague to review a document.","What is a polite request?","こちらをご確認いただけますか？","こちらを ごかくにん いただけますか？","kochira o gokakunin itadakemasu ka?","Could you please check this?","ご確認いただけますか is a standard courteous workplace request."],
        ["workplace-089","Workplace","Intermediate","You will be ten minutes late to a meeting.","How do you notify your team?","会議に10分ほど遅れます。","かいぎに じゅっぷんほど おくれます。","kaigi ni juppun hodo okuremasu.","I'll be about ten minutes late to the meeting.","ほど makes the estimated delay sound appropriately precise."],
        ["workplace-090","Workplace","Intermediate","You need clarification about instructions.","What do you ask politely?","もう少し詳しく教えていただけますか？","もう すこし くわしく おしえて いただけますか？","mou sukoshi kuwashiku oshiete itadakemasu ka?","Could you explain in a little more detail?","詳しく and ～ていただけますか form a respectful clarification request."],
        ["workplace-091","Workplace","Beginner","A colleague finishes helping you.","What do you say?","助かりました。ありがとうございます。","たすかりました。ありがとうございます。","tasukarimashita. arigatou gozaimasu.","That helped a lot. Thank you.","助かりました specifically acknowledges useful help."],
        ["workplace-092","Workplace","Intermediate","You want to confirm a deadline.","What do you ask?","締め切りは金曜日でよろしいでしょうか？","しめきりは きんようびで よろしいでしょうか？","shimekiri wa kinyoubi de yoroshii deshou ka?","May I confirm that the deadline is Friday?","よろしいでしょうか is a formal confirmation pattern."],
        ["workplace-093","Workplace","Intermediate","You need to take tomorrow off.","How do you ask your supervisor?","明日、お休みをいただいてもよろしいでしょうか？","あした、おやすみを いただいても よろしいでしょうか？","ashita, oyasumi o itadaite mo yoroshii deshou ka?","May I take tomorrow off?","～てもよろしいでしょうか is a respectful permission request."],
        ["reaction-094","Reaction","Beginner","A friend shows you an impressive photo.","What is a natural reaction?","すごい！","すごい！","sugoi!","Amazing!","すごい is a very common casual reaction to something impressive."],
        ["reaction-095","Reaction","Intermediate","Someone tells you an unexpected fact.","How do you react casually?","マジで？","まじで？","maji de?","Seriously?","マジで？ is common informal surprise but is unsuitable for formal settings."],
        ["reaction-096","Reaction","Beginner","Your friend says they passed an exam.","How do you show relief and happiness?","よかったね！","よかったね！","yokatta ne!","That's great!","よかったね warmly shares the other person's relief or good result."],
        ["sns-097","SNS","Intermediate","You post a photo from a wonderful trip.","What is a natural short caption?","最高の旅だった！","さいこうの たびだった！","saikou no tabi datta!","It was the best trip!","最高 is a natural enthusiastic evaluation in casual posts."],
        ["sns-098","SNS","Beginner","You want to say a café looks cute in a comment.","What do you write?","このカフェかわいい！","この かふぇ かわいい！","kono kafe kawaii!","This café is so cute!","Casual posts often omit particles when the meaning stays clear."],
        ["sns-099","SNS","Intermediate","You recommend a place you visited.","What is a natural caption?","ここ、本当におすすめ！","ここ、ほんとうに おすすめ！","koko, hontou ni osusume!","I really recommend this place!","おすすめ is a natural noun-like recommendation expression."],
        ["everyday-100","Everyday","Intermediate","Someone gives you advice and you understand their point.","How do you acknowledge it naturally?","なるほど、わかりました。","なるほど、わかりました。","naruhodo, wakarimashita.","I see; I understand.","なるほど acknowledges that the explanation now makes sense."]
    ];
    window.WHAT_WOULD_YOU_SAY_DATA.push(...additions.map((entry, index) => {
        const [suffix, category, difficulty, scenario, prompt, japanese, kana, romaji, english, explanation] = entry;
        const correct = { japanese, kana, romaji, english };
        const start = (index * 3) % fallbackChoices.length;
        const related = additions.filter(other => other !== entry && other[1] === category).map(other => ({ japanese:other[5], kana:other[6], romaji:other[7], english:other[8] }));
        const rotatedFallbacks = fallbackChoices.map((_, offset) => fallbackChoices[(start + offset) % fallbackChoices.length]);
        const distractors = [...related, ...rotatedFallbacks].filter((choice, choiceIndex, choices) => choice.japanese !== japanese && choices.findIndex(candidate => candidate.japanese === choice.japanese) === choiceIndex);
        const group = ["Restaurant", "Cafe", "Shopping", "Hotel", "Train", "Directions", "Payment", "Emergency"].includes(category) ? "Travel" : category === "Workplace" ? "Real-world" : "Everyday";
        return { id:`wwys-v2-${suffix}`, category:group, difficulty, scenario, prompt, choices:[correct, ...distractors.slice(0, 3)], correctChoice:0, explanation };
    }));
})();
