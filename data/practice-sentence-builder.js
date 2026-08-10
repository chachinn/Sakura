(function () {
    "use strict";

    window.SENTENCE_BUILDER_DATA = [
    {
        "id": "sentence-everyday-001",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I'm going to Tokyo tomorrow.",
        "chunks": [
            "明日",
            "東京に",
            "行きます。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "明日東京に行きます。",
        "kana": "あした とうきょうに いきます。",
        "romaji": "ashita toukyou ni ikimasu.",
        "explanation": "Time expressions such as 明日 often come near the beginning, while the verb 行きます closes the sentence."
    },
    {
        "id": "sentence-everyday-002",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I drink coffee every morning.",
        "chunks": [
            "毎朝",
            "コーヒーを",
            "飲みます。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "毎朝コーヒーを飲みます。",
        "kana": "まいあさ こーひーを のみます。",
        "romaji": "maiasa koohii o nomimasu.",
        "explanation": "毎朝 sets the time, を marks coffee as the object, and 飲みます completes the action."
    },
    {
        "id": "sentence-everyday-003",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I study a little Japanese every day.",
        "chunks": [
            "毎日",
            "少しずつ",
            "日本語を",
            "勉強しています。"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "毎日少しずつ日本語を勉強しています。",
        "kana": "まいにち すこしずつ にほんごを べんきょうしています。",
        "romaji": "mainichi sukoshi zutsu nihongo o benkyou shite imasu.",
        "explanation": "少しずつ means little by little, and ～ています naturally describes an ongoing study habit."
    },
    {
        "id": "sentence-everyday-004",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I'll stop by the supermarket after work.",
        "chunks": [
            "仕事のあとで",
            "スーパーに",
            "寄ります。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "仕事のあとでスーパーに寄ります。",
        "kana": "しごとの あとで すーぱーに よります。",
        "romaji": "shigoto no ato de suupaa ni yorimasu.",
        "explanation": "仕事のあとで gives the timing, and に marks the place you will stop by."
    },
    {
        "id": "sentence-everyday-005",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I'm going to see a movie with a friend this weekend.",
        "chunks": [
            "今週末",
            "友だちと",
            "映画を",
            "見に行きます。"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "今週末友だちと映画を見に行きます。",
        "kana": "こんしゅうまつ ともだちと えいがを みに いきます。",
        "romaji": "konshuumatsu tomodachi to eiga o mi ni ikimasu.",
        "explanation": "と marks the person accompanying you, and 見に行きます means “go to see.”"
    },
    {
        "id": "sentence-everyday-006",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Please open the window.",
        "chunks": [
            "窓を",
            "開けて",
            "ください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "窓を開けてください。",
        "kana": "まどを あけて ください。",
        "romaji": "mado o akete kudasai.",
        "explanation": "A polite request uses the verb's て-form followed by ください."
    },
    {
        "id": "sentence-everyday-007",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I left my umbrella at home.",
        "chunks": [
            "傘を",
            "家に",
            "忘れました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "傘を家に忘れました。",
        "kana": "かさを いえに わすれました。",
        "romaji": "kasa o ie ni wasuremashita.",
        "explanation": "The forgotten item is marked by を, and 家に identifies where it was left."
    },
    {
        "id": "sentence-everyday-008",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I wash my hands before eating.",
        "chunks": [
            "食べる前に",
            "手を",
            "洗います。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "食べる前に手を洗います。",
        "kana": "たべる まえに てを あらいます。",
        "romaji": "taberu mae ni te o araimasu.",
        "explanation": "The dictionary form plus 前に means “before doing,” followed by the main action."
    },
    {
        "id": "sentence-everyday-009",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Because it's raining, I'll take an umbrella.",
        "chunks": [
            "雨が降っているので",
            "傘を",
            "持っていきます。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "雨が降っているので傘を持っていきます。",
        "kana": "あめが ふっているので かさを もっていきます。",
        "romaji": "ame ga futte iru node kasa o motte ikimasu.",
        "explanation": "ので gives the reason, followed by the resulting action."
    },
    {
        "id": "sentence-everyday-010",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "The cat is under the table.",
        "chunks": [
            "猫は",
            "テーブルの下に",
            "います。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "猫はテーブルの下にいます。",
        "kana": "ねこは てーぶるの したに います。",
        "romaji": "neko wa teeburu no shita ni imasu.",
        "explanation": "に marks the cat's location, and います is used for living things."
    },
    {
        "id": "sentence-everyday-011",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "My mother is making dinner in the kitchen.",
        "chunks": [
            "母は",
            "キッチンで",
            "晩ご飯を",
            "作っています。"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "母はキッチンで晩ご飯を作っています。",
        "kana": "ははは きっちんで ばんごはんを つくっています。",
        "romaji": "haha wa kicchin de bangohan o tsukutte imasu.",
        "explanation": "で marks where the action happens, while ～ています describes an action in progress."
    },
    {
        "id": "sentence-everyday-012",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "This book is really interesting.",
        "chunks": [
            "この本、",
            "すごく",
            "面白いです。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この本、すごく面白いです。",
        "kana": "この ほん、すごく おもしろいです。",
        "romaji": "kono hon, sugoku omoshiroi desu.",
        "explanation": "In conversation, the topic particle can be omitted; すごく is a very natural spoken intensifier."
    },
    {
        "id": "sentence-travel-001",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "Where is the station?",
        "chunks": [
            "駅は",
            "どこ",
            "ですか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "駅はどこですか？",
        "kana": "えきは どこですか？",
        "romaji": "eki wa doko desu ka?",
        "explanation": "The topic comes first, followed by the question word どこ and ですか."
    },
    {
        "id": "sentence-travel-002",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "One ticket to Kyoto, please.",
        "chunks": [
            "京都まで",
            "一枚",
            "お願いします。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "京都まで一枚お願いします。",
        "kana": "きょうとまで いちまい おねがいします。",
        "romaji": "kyouto made ichimai onegai shimasu.",
        "explanation": "まで marks the destination, and 枚 is the counter used for a paper ticket."
    },
    {
        "id": "sentence-travel-003",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "I have a reservation under Cha. I’d like to check in, please.",
        "chunks": [
            "チャの名前で",
            "予約しています。",
            "チェックインを",
            "お願いします。"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "チャの名前で予約しています。チェックインをお願いします。",
        "kana": "ちゃの なまえで よやくしています。ちぇっくいんを おねがいします。",
        "romaji": "Cha no namae de yoyaku shite imasu. chekkuin o onegai shimasu.",
        "explanation": "～の名前で予約しています is a natural way to identify the reservation name at a hotel."
    },
    {
        "id": "sentence-travel-004",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "Excuse me, could I have some water?",
        "chunks": [
            "すみません、",
            "お水を",
            "いただけますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "すみません、お水をいただけますか？",
        "kana": "すみません、おみずを いただけますか？",
        "romaji": "sumimasen, omizu o itadakemasu ka?",
        "explanation": "すみません gets the staff member's attention, and いただけますか makes a polite request."
    },
    {
        "id": "sentence-travel-005",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "Excuse me, can I pay by card?",
        "chunks": [
            "すみません、",
            "カードで",
            "払えますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "すみません、カードで払えますか？",
        "kana": "すみません、かーどで はらえますか？",
        "romaji": "sumimasen, kaado de haraemasu ka?",
        "explanation": "で marks the payment method, and 払えますか asks whether payment is possible."
    },
    {
        "id": "sentence-travel-006",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "Could you keep my luggage until check-in?",
        "chunks": [
            "チェックインまで",
            "荷物を",
            "預かって",
            "もらえますか？"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "チェックインまで荷物を預かってもらえますか？",
        "kana": "ちぇっくいんまで にもつを あずかって もらえますか？",
        "romaji": "chekkuin made nimotsu o azukatte moraemasu ka?",
        "explanation": "～てもらえますか politely asks someone to do an action for you."
    },
    {
        "id": "sentence-travel-007",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "What time is the next train?",
        "chunks": [
            "次の電車は",
            "何時",
            "ですか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "次の電車は何時ですか？",
        "kana": "つぎの でんしゃは なんじですか？",
        "romaji": "tsugi no densha wa nanji desu ka?",
        "explanation": "何時 asks “what time,” after establishing the next train as the topic."
    },
    {
        "id": "sentence-travel-008",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "Where is the restroom?",
        "chunks": [
            "トイレは",
            "どこですか？"
        ],
        "correctOrder": [
            0,
            1
        ],
        "sentence": "トイレはどこですか？",
        "kana": "といれは どこですか？",
        "romaji": "toire wa doko desu ka?",
        "explanation": "For a restroom or other known place, ～はどこですか is the most direct natural location question."
    },
    {
        "id": "sentence-travel-009",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "Does this dish contain meat?",
        "chunks": [
            "この料理に",
            "肉が",
            "入っていますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この料理に肉が入っていますか？",
        "kana": "この りょうりに にくが はいっていますか？",
        "romaji": "kono ryouri ni niku ga haitte imasu ka?",
        "explanation": "The pattern ～に～が入っていますか asks whether an ingredient is contained in a dish."
    },
    {
        "id": "sentence-travel-010",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "May I take a photo here?",
        "chunks": [
            "ここで",
            "写真を撮っても",
            "いいですか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ここで写真を撮ってもいいですか？",
        "kana": "ここで しゃしんを とっても いいですか？",
        "romaji": "koko de shashin o tottemo ii desu ka?",
        "explanation": "～てもいいですか asks permission to do something."
    },
    {
        "id": "sentence-casual-001",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "I haven't seen that movie yet.",
        "chunks": [
            "その映画、",
            "まだ",
            "見てない。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "その映画、まだ見てない。",
        "kana": "その えいが、まだ みてない。",
        "romaji": "sono eiga, mada mitenai.",
        "explanation": "まだ plus a negative form means “not yet.” 見てない is casual speech."
    },
    {
        "id": "sentence-casual-002",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "Let's meet at seven tomorrow.",
        "chunks": [
            "明日",
            "七時に",
            "会おう。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "明日七時に会おう。",
        "kana": "あした しちじに あおう。",
        "romaji": "ashita shichiji ni aou.",
        "explanation": "に marks the meeting time, and 会おう is the casual volitional form, “let's meet.”"
    },
    {
        "id": "sentence-casual-003",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "Sorry my reply was late.",
        "chunks": [
            "返信",
            "遅くなって",
            "ごめん。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "返信遅くなってごめん。",
        "kana": "へんしん おそくなって ごめん。",
        "romaji": "henshin osoku natte gomen.",
        "explanation": "In casual messages, 遅くなってごめん naturally apologizes for becoming late."
    },
    {
        "id": "sentence-casual-004",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "This is really good!",
        "chunks": [
            "これ",
            "マジで",
            "いい！"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "これマジでいい！",
        "kana": "これ まじで いい！",
        "romaji": "kore maji de ii!",
        "explanation": "マジで intensifies いい in casual speech. Avoid it in formal situations."
    },
    {
        "id": "sentence-casual-005",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "I'm a little tired today.",
        "chunks": [
            "今日",
            "ちょっと",
            "疲れた。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "今日ちょっと疲れた。",
        "kana": "きょう ちょっと つかれた。",
        "romaji": "kyou chotto tsukareta.",
        "explanation": "今日 sets the time, and ちょっと softens the statement before 疲れた."
    },
    {
        "id": "sentence-casual-006",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "I'll send the photo later.",
        "chunks": [
            "あとで",
            "写真",
            "送るね。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "あとで写真送るね。",
        "kana": "あとで しゃしん おくるね。",
        "romaji": "ato de shashin okuru ne.",
        "explanation": "Casual speech often omits を when the meaning is clear; ね gives the message a friendly tone."
    },
    {
        "id": "sentence-casual-007",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "I might not be able to go tomorrow.",
        "chunks": [
            "明日",
            "行けない",
            "かも。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "明日行けないかも。",
        "kana": "あした いけない かも。",
        "romaji": "ashita ikenai kamo.",
        "explanation": "かも is a casual shortening of かもしれない and expresses uncertainty."
    },
    {
        "id": "sentence-casual-008",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "I'm glad you came today!",
        "chunks": [
            "今日は",
            "来てくれて",
            "うれしい！"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "今日は来てくれてうれしい！",
        "kana": "きょうは きてくれて うれしい！",
        "romaji": "kyou wa kite kurete ureshii!",
        "explanation": "今日は sets the occasion, and ～てくれて expresses appreciation for someone's action."
    },
    {
        "id": "sentence-v2-031",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I eat breakfast at seven every day.",
        "chunks": [
            "毎日",
            "七時に",
            "朝ご飯を",
            "食べます。"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "毎日七時に朝ご飯を食べます。",
        "kana": "まいにち しちじに あさごはんを たべます。",
        "romaji": "mainichi shichiji ni asagohan o tabemasu.",
        "explanation": "毎日 sets frequency, 七時に marks time, and を marks the object."
    },
    {
        "id": "sentence-v2-032",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "There is a convenience store next to the station.",
        "chunks": [
            "駅の隣に",
            "コンビニが",
            "あります。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "駅の隣にコンビニがあります。",
        "kana": "えきの となりに こんびにが あります。",
        "romaji": "eki no tonari ni konbini ga arimasu.",
        "explanation": "に marks the location where a nonliving thing exists."
    },
    {
        "id": "sentence-v2-033",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I read a book while riding the train.",
        "chunks": [
            "電車に",
            "乗りながら",
            "本を",
            "読みます。"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "電車に乗りながら本を読みます。",
        "kana": "でんしゃに のりながら ほんを よみます。",
        "romaji": "densha ni norinagara hon o yomimasu.",
        "explanation": "The verb stem plus ながら links two simultaneous actions."
    },
    {
        "id": "sentence-v2-034",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I don't watch television in the morning.",
        "chunks": [
            "朝は",
            "テレビを",
            "見ません。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "朝はテレビを見ません。",
        "kana": "あさは てれびを みません。",
        "romaji": "asa wa terebi o mimasen.",
        "explanation": "は sets the morning as the topic, and 見ません is the polite negative."
    },
    {
        "id": "sentence-v2-035",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I have already finished my homework.",
        "chunks": [
            "宿題は",
            "もう",
            "終わりました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "宿題はもう終わりました。",
        "kana": "しゅくだいは もう おわりました。",
        "romaji": "shukudai wa mou owarimashita.",
        "explanation": "もう before a past verb means the action is already complete."
    },
    {
        "id": "sentence-v2-036",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Please turn off the light.",
        "chunks": [
            "電気を",
            "消して",
            "ください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "電気を消してください。",
        "kana": "でんきを けして ください。",
        "romaji": "denki o keshite kudasai.",
        "explanation": "The て-form plus ください makes a polite request."
    },
    {
        "id": "sentence-v2-037",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I forgot to charge my phone.",
        "chunks": [
            "スマホを",
            "充電するのを",
            "忘れました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "スマホを充電するのを忘れました。",
        "kana": "すまほを じゅうでんするのを わすれました。",
        "romaji": "sumaho o juuden suru no o wasuremashita.",
        "explanation": "の nominalizes the action before 忘れました."
    },
    {
        "id": "sentence-v2-038",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "What did you eat for lunch?",
        "chunks": [
            "昼ご飯に",
            "何を",
            "食べましたか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "昼ご飯に何を食べましたか？",
        "kana": "ひるごはんに なにを たべましたか？",
        "romaji": "hirugohan ni nani o tabemashita ka?",
        "explanation": "何を asks what object was eaten, and か marks the question."
    },
    {
        "id": "sentence-v2-039",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "If it is sunny tomorrow, I'll do laundry.",
        "chunks": [
            "明日晴れたら",
            "洗濯を",
            "します。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "明日晴れたら洗濯をします。",
        "kana": "あした はれたら せんたくを します。",
        "romaji": "ashita haretara sentaku o shimasu.",
        "explanation": "The past-form conditional ～たら states the condition."
    },
    {
        "id": "sentence-v2-040",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "My room isn’t very big.",
        "chunks": [
            "部屋は",
            "あまり",
            "広くないです。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "部屋はあまり広くないです。",
        "kana": "へやは あまり ひろくないです。",
        "romaji": "heya wa amari hirokunai desu.",
        "explanation": "あまり pairs with a negative expression to mean not very; Japanese often omits 私の when context is obvious."
    },
    {
        "id": "sentence-v2-041",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "The keys are inside the bag.",
        "chunks": [
            "鍵は",
            "かばんの中に",
            "あります。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "鍵はかばんの中にあります。",
        "kana": "かぎは かばんの なかに あります。",
        "romaji": "kagi wa kaban no naka ni arimasu.",
        "explanation": "Inside is expressed with の中に before あります."
    },
    {
        "id": "sentence-v2-042",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Let's meet in front of the ticket gate.",
        "chunks": [
            "改札の前で",
            "待ち合わせ",
            "しましょう。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "改札の前で待ち合わせしましょう。",
        "kana": "かいさつの まえで まちあわせ しましょう。",
        "romaji": "kaisatsu no mae de machiawase shimashou.",
        "explanation": "で marks the meeting location, and しましょう suggests doing it together."
    },
    {
        "id": "sentence-v2-043",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "My friend lives in Osaka.",
        "chunks": [
            "友だちは",
            "大阪に",
            "住んでいます。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "友だちは大阪に住んでいます。",
        "kana": "ともだちは おおさかに すんでいます。",
        "romaji": "tomodachi wa Oosaka ni sunde imasu.",
        "explanation": "住む uses に for the place of residence."
    },
    {
        "id": "sentence-v2-044",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I left my phone on the desk.",
        "chunks": [
            "机の上に",
            "スマホを",
            "置きました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "机の上にスマホを置きました。",
        "kana": "つくえの うえに すまほを おきました。",
        "romaji": "tsukue no ue ni sumaho o okimashita.",
        "explanation": "に marks the destination where the phone was placed."
    },
    {
        "id": "sentence-v2-045",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "The meeting starts at nine.",
        "chunks": [
            "会議は",
            "九時に",
            "始まります。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "会議は九時に始まります。",
        "kana": "かいぎは くじに はじまります。",
        "romaji": "kaigi wa kuji ni hajimarimasu.",
        "explanation": "A specific clock time takes に."
    },
    {
        "id": "sentence-v2-046",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I have been studying Japanese for two years.",
        "chunks": [
            "二年間",
            "日本語を",
            "勉強しています。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "二年間日本語を勉強しています。",
        "kana": "にねんかん にほんごを べんきょうしています。",
        "romaji": "ninenkan nihongo o benkyou shite imasu.",
        "explanation": "A duration can appear without a particle before an ongoing action."
    },
    {
        "id": "sentence-v2-047",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I will call you after dinner.",
        "chunks": [
            "晩ご飯の",
            "あとで",
            "電話します。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "晩ご飯のあとで電話します。",
        "kana": "ばんごはんの あとで でんわします。",
        "romaji": "bangohan no ato de denwa shimasu.",
        "explanation": "Noun plus のあとで means after that event."
    },
    {
        "id": "sentence-v2-048",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Please submit this by Friday.",
        "chunks": [
            "金曜日までに",
            "これを",
            "出してください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "金曜日までにこれを出してください。",
        "kana": "きんようびまでに これを だして ください。",
        "romaji": "kinyoubi made ni kore o dashite kudasai.",
        "explanation": "までに marks a deadline by which an action must happen."
    },
    {
        "id": "sentence-v2-049",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Please write your name here.",
        "chunks": [
            "ここに",
            "名前を",
            "書いてください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ここに名前を書いてください。",
        "kana": "ここに なまえを かいて ください。",
        "romaji": "koko ni namae o kaite kudasai.",
        "explanation": "に marks where the writing goes, and を marks what is written."
    },
    {
        "id": "sentence-v2-050",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Could you take a picture for me?",
        "chunks": [
            "写真を",
            "撮って",
            "いただけますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "写真を撮っていただけますか？",
        "kana": "しゃしんを とって いただけますか？",
        "romaji": "shashin o totte itadakemasu ka?",
        "explanation": "～ていただけますか makes a courteous request."
    },
    {
        "id": "sentence-v2-051",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Please wait here for a moment.",
        "chunks": [
            "ここで",
            "少し",
            "待ってください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ここで少し待ってください。",
        "kana": "ここで すこし まって ください。",
        "romaji": "koko de sukoshi matte kudasai.",
        "explanation": "で marks the place of waiting, while 少し softens the request."
    },
    {
        "id": "sentence-v2-052",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Please tell me if the schedule changes.",
        "chunks": [
            "予定が変わったら",
            "教えて",
            "ください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "予定が変わったら教えてください。",
        "kana": "よていが かわったら おしえて ください。",
        "romaji": "yotei ga kawattara oshiete kudasai.",
        "explanation": "～たら states the condition under which the request applies."
    },
    {
        "id": "sentence-v2-053",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I like tea more than coffee.",
        "chunks": [
            "コーヒーより",
            "お茶のほうが",
            "好きです。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "コーヒーよりお茶のほうが好きです。",
        "kana": "こーひーより おちゃの ほうが すきです。",
        "romaji": "koohii yori ocha no hou ga suki desu.",
        "explanation": "AよりBのほうが compares two choices and prefers B."
    },
    {
        "id": "sentence-v2-054",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I would rather stay home today.",
        "chunks": [
            "今日は",
            "家に",
            "いたいです。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "今日は家にいたいです。",
        "kana": "きょうは いえに いたいです。",
        "romaji": "kyou wa ie ni itai desu.",
        "explanation": "The verb stem plus たい expresses the speaker's desire."
    },
    {
        "id": "sentence-v2-055",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Which color do you like?",
        "chunks": [
            "どの",
            "色が",
            "好きですか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "どの色が好きですか？",
        "kana": "どの いろが すきですか？",
        "romaji": "dono iro ga suki desu ka?",
        "explanation": "どの modifies 色 to ask which one."
    },
    {
        "id": "sentence-v2-056",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I didn't buy anything.",
        "chunks": [
            "何も",
            "買い",
            "ませんでした。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "何も買いませんでした。",
        "kana": "なにも かいませんでした。",
        "romaji": "nani mo kaimasen deshita.",
        "explanation": "何も with a negative verb means nothing."
    },
    {
        "id": "sentence-v2-057",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I have never been to Hokkaido.",
        "chunks": [
            "北海道には",
            "一度も",
            "行ったことがありません。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "北海道には一度も行ったことがありません。",
        "kana": "ほっかいどうには いちども いったことが ありません。",
        "romaji": "Hokkaidou ni wa ichido mo itta koto ga arimasen.",
        "explanation": "一度も with ～たことがありません means never having had the experience."
    },
    {
        "id": "sentence-v2-058",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "This room isn’t very quiet.",
        "chunks": [
            "この部屋、",
            "あまり",
            "静かじゃないです。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この部屋、あまり静かじゃないです。",
        "kana": "この へや、あまり しずかじゃないです。",
        "romaji": "kono heya, amari shizuka janai desu.",
        "explanation": "じゃないです is a common spoken polite negative for a な-adjective; あまり softens the evaluation."
    },
    {
        "id": "sentence-v2-059",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Who is that person?",
        "chunks": [
            "あの",
            "人は",
            "誰ですか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "あの人は誰ですか？",
        "kana": "あの ひとは だれですか？",
        "romaji": "ano hito wa dare desu ka?",
        "explanation": "誰 asks who the topic person is."
    },
    {
        "id": "sentence-v2-060",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Why did you start studying Japanese?",
        "chunks": [
            "どうして",
            "日本語の勉強を",
            "始めたんですか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "どうして日本語の勉強を始めたんですか？",
        "kana": "どうして にほんごの べんきょうを はじめたんですか？",
        "romaji": "doushite nihongo no benkyou o hajimeta n desu ka?",
        "explanation": "～んですか asks for background or explanation."
    },
    {
        "id": "sentence-v2-061",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "How many apples did you buy?",
        "chunks": [
            "りんごを",
            "いくつ",
            "買いましたか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "りんごをいくつ買いましたか？",
        "kana": "りんごを いくつ かいましたか？",
        "romaji": "ringo o ikutsu kaimashita ka?",
        "explanation": "いくつ asks the number of general objects."
    },
    {
        "id": "sentence-v2-062",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Do you know where Tanaka is?",
        "chunks": [
            "田中さんが",
            "どこにいるか",
            "知っていますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "田中さんがどこにいるか知っていますか？",
        "kana": "たなかさんが どこに いるか しっていますか？",
        "romaji": "Tanaka-san ga doko ni iru ka shitte imasu ka?",
        "explanation": "An embedded question uses the plain question plus か."
    },
    {
        "id": "sentence-v2-063",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I will contact you again tomorrow.",
        "chunks": [
            "明日改めて",
            "ご連絡",
            "いたします。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "明日改めてご連絡いたします。",
        "kana": "あした あらためて ごれんらく いたします。",
        "romaji": "ashita aratamete gorenraku itashimasu.",
        "explanation": "いたします is the humble form of します in formal communication."
    },
    {
        "id": "sentence-v2-064",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Please take a look at this document.",
        "chunks": [
            "こちらの資料を",
            "ご覧",
            "ください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "こちらの資料をご覧ください。",
        "kana": "こちらの しりょうを ごらん ください。",
        "romaji": "kochira no shiryou o goran kudasai.",
        "explanation": "ご覧ください is the respectful request form of 見る."
    },
    {
        "id": "sentence-v2-065",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Thank you for taking time today.",
        "chunks": [
            "本日は",
            "お時間をいただき",
            "ありがとうございます。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "本日はお時間をいただきありがとうございます。",
        "kana": "ほんじつは おじかんを いただき ありがとうございます。",
        "romaji": "honjitsu wa ojikan o itadaki arigatou gozaimasu.",
        "explanation": "This formal pattern thanks someone for giving their time."
    },
    {
        "id": "sentence-v2-066",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "May I ask one question?",
        "chunks": [
            "一つ",
            "質問しても",
            "よろしいでしょうか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "一つ質問してもよろしいでしょうか？",
        "kana": "ひとつ しつもんしても よろしいでしょうか？",
        "romaji": "hitotsu shitsumon shite mo yoroshii deshou ka?",
        "explanation": "～てもよろしいでしょうか respectfully asks permission."
    },
    {
        "id": "sentence-v2-067",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "Please take me to this address.",
        "chunks": [
            "この",
            "住所まで",
            "お願いします。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この住所までお願いします。",
        "kana": "この じゅうしょまで おねがいします。",
        "romaji": "kono juusho made onegai shimasu.",
        "explanation": "In a taxi, destination plus までお願いします is concise and natural."
    },
    {
        "id": "sentence-v2-068",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "Where can I buy a transit card?",
        "chunks": [
            "交通系ICカードは",
            "どこで",
            "買えますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "交通系ICカードはどこで買えますか？",
        "kana": "こうつうけい あいしーかーどは どこで かえますか？",
        "romaji": "koutsuukei aishii kaado wa doko de kaemasu ka?",
        "explanation": "どこで asks where the action of buying can happen."
    },
    {
        "id": "sentence-v2-069",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "This train is crowded.",
        "chunks": [
            "この",
            "電車は",
            "混んでいます。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この電車は混んでいます。",
        "kana": "この でんしゃは こんでいます。",
        "romaji": "kono densha wa konde imasu.",
        "explanation": "混んでいます describes a place or vehicle being crowded."
    },
    {
        "id": "sentence-v2-070",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "If possible, I’d like a room with a nice view.",
        "chunks": [
            "できれば、",
            "景色のいい部屋を",
            "お願いします。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "できれば、景色のいい部屋をお願いします。",
        "kana": "できれば、けしきの いい へやを おねがいします。",
        "romaji": "dekireba, keshiki no ii heya o onegai shimasu.",
        "explanation": "できれば means if possible and softens the hotel request naturally."
    },
    {
        "id": "sentence-v2-071",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "Is breakfast included?",
        "chunks": [
            "朝食",
            "は含まれて",
            "いますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "朝食は含まれていますか？",
        "kana": "ちょうしょくは ふくまれていますか？",
        "romaji": "choushoku wa fukumarete imasu ka?",
        "explanation": "The passive form 含まれています asks whether it is included."
    },
    {
        "id": "sentence-v2-072",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "I’d like to change my reservation.",
        "chunks": [
            "予約を",
            "変更したい",
            "のですが。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "予約を変更したいのですが。",
        "kana": "よやくを へんこうしたい のですが。",
        "romaji": "yoyaku o henkou shitai no desu ga.",
        "explanation": "～たいのですが naturally introduces a request or problem and invites the staff member to respond."
    },
    {
        "id": "sentence-v2-073",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "Can I use this seat?",
        "chunks": [
            "この席を",
            "使っても",
            "いいですか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この席を使ってもいいですか？",
        "kana": "この せきを つかっても いいですか？",
        "romaji": "kono seki o tsukatte mo ii desu ka?",
        "explanation": "～てもいいですか asks permission."
    },
    {
        "id": "sentence-v2-074",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "Please let me know when we arrive.",
        "chunks": [
            "着いたら",
            "教えて",
            "ください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "着いたら教えてください。",
        "kana": "ついたら おしえて ください。",
        "romaji": "tsuitara oshiete kudasai.",
        "explanation": "The ～たら clause sets arrival as the trigger for the request."
    },
    {
        "id": "sentence-v2-075",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "Let's eat something.",
        "chunks": [
            "何か",
            "食べ",
            "よう。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "何か食べよう。",
        "kana": "なにか たべよう。",
        "romaji": "nanika tabeyou.",
        "explanation": "何か means something, and the volitional 食べよう suggests eating together."
    },
    {
        "id": "sentence-v2-076",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "I ended up sleeping all day.",
        "chunks": [
            "一日中",
            "寝ちゃっ",
            "た。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "一日中寝ちゃった。",
        "kana": "いちにちじゅう ねちゃった。",
        "romaji": "ichinichijuu nechatta.",
        "explanation": "～ちゃった is the casual contraction of ～てしまった."
    },
    {
        "id": "sentence-v2-077",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "Are you free this weekend?",
        "chunks": [
            "今週末",
            "空いて",
            "る？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "今週末空いてる？",
        "kana": "こんしゅうまつ あいてる？",
        "romaji": "konshuumatsu aiteru?",
        "explanation": "Casual speech contracts 空いている to 空いてる."
    },
    {
        "id": "sentence-v2-078",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "Let me think about it a little.",
        "chunks": [
            "ちょっと",
            "考えさせ",
            "て。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ちょっと考えさせて。",
        "kana": "ちょっと かんがえさせて。",
        "romaji": "chotto kangaesasete.",
        "explanation": "The causative request 考えさせて means let me think."
    },
    {
        "id": "sentence-v2-079",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "Don't worry about it.",
        "chunks": [
            "気に",
            "しない",
            "で。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "気にしないで。",
        "kana": "きに しないで。",
        "romaji": "ki ni shinaide.",
        "explanation": "The negative て-form ～ないで asks someone not to do something."
    },
    {
        "id": "sentence-v2-080",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "I'll let you know when I decide.",
        "chunks": [
            "決めたら",
            "連絡する",
            "ね。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "決めたら連絡するね。",
        "kana": "きめたら れんらくするね。",
        "romaji": "kimetara renraku suru ne.",
        "explanation": "～たら links the decision to the later message."
    },
    {
        "id": "sentence-v2-081",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "Let's take a picture together.",
        "chunks": [
            "一緒に",
            "写真を",
            "撮ろう。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "一緒に写真を撮ろう。",
        "kana": "いっしょに しゃしんを とろう。",
        "romaji": "issho ni shashin o torou.",
        "explanation": "The volitional 撮ろう makes a casual shared suggestion."
    },
    {
        "id": "sentence-v2-082",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "Thanks for inviting me.",
        "chunks": [
            "誘って",
            "くれて",
            "ありがとう。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "誘ってくれてありがとう。",
        "kana": "さそってくれて ありがとう。",
        "romaji": "sasotte kurete arigatou.",
        "explanation": "～てくれてありがとう thanks someone for doing something for you."
    },
    {
        "id": "sentence-v2-083",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "I want to see you again soon.",
        "chunks": [
            "また",
            "すぐ",
            "会いたい。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "またすぐ会いたい。",
        "kana": "また すぐ あいたい。",
        "romaji": "mata sugu aitai.",
        "explanation": "The たい form directly expresses wanting to meet again."
    },
    {
        "id": "sentence-v2-084",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "I was worried because you didn't reply.",
        "chunks": [
            "返信がなかった",
            "から",
            "心配したよ。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "返信がなかったから心配したよ。",
        "kana": "へんしんが なかったから しんぱいしたよ。",
        "romaji": "henshin ga nakatta kara shinpai shita yo.",
        "explanation": "から gives the reason for the speaker's worry."
    },
    {
        "id": "sentence-v2-085",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I have attached the requested file.",
        "chunks": [
            "ご依頼の",
            "ファイルを",
            "添付しました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ご依頼のファイルを添付しました。",
        "kana": "ごいらいの ふぁいるを てんぷしました。",
        "romaji": "goirai no fairu o tenpu shimashita.",
        "explanation": "ご依頼 identifies the requested item, and 添付しました reports the attachment."
    },
    {
        "id": "sentence-v2-086",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "The meeting has been moved to three.",
        "chunks": [
            "会議は",
            "三時に",
            "変更になりました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "会議は三時に変更になりました。",
        "kana": "かいぎは さんじに へんこうに なりました。",
        "romaji": "kaigi wa sanji ni henkou ni narimashita.",
        "explanation": "変更になりました politely reports a schedule change."
    },
    {
        "id": "sentence-v2-087",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I will check and get back to you.",
        "chunks": [
            "確認して",
            "から",
            "ご連絡します。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "確認してからご連絡します。",
        "kana": "かくにんしてから ごれんらくします。",
        "romaji": "kakunin shite kara gorenraku shimasu.",
        "explanation": "～てから establishes that checking happens before contacting."
    },
    {
        "id": "sentence-v2-088",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Could we discuss this tomorrow?",
        "chunks": [
            "この件は",
            "明日",
            "相談できますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この件は明日相談できますか？",
        "kana": "この けんは あした そうだん できますか？",
        "romaji": "kono ken wa ashita soudan dekimasu ka?",
        "explanation": "この件 sets the matter as topic, and できますか asks availability."
    },
    {
        "id": "sentence-v2-089",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I understand the explanation now.",
        "chunks": [
            "説明、",
            "よく",
            "わかりました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "説明、よくわかりました。",
        "kana": "せつめい、よく わかりました。",
        "romaji": "setsumei, yoku wakarimashita.",
        "explanation": "よくわかりました is a natural polite way to say an explanation is now clear."
    },
    {
        "id": "sentence-v2-090",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "This product is sold out today.",
        "chunks": [
            "この商品は",
            "本日",
            "売り切れです。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この商品は本日売り切れです。",
        "kana": "この しょうひんは ほんじつ うりきれです。",
        "romaji": "kono shouhin wa honjitsu urikire desu.",
        "explanation": "売り切れ is the standard expression for sold out."
    },
    {
        "id": "sentence-v2-091",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Please line up here.",
        "chunks": [
            "こちら",
            "に並んで",
            "ください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "こちらに並んでください。",
        "kana": "こちらに ならんで ください。",
        "romaji": "kochira ni narande kudasai.",
        "explanation": "に marks the place where people should line up."
    },
    {
        "id": "sentence-v2-092",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Reservations are required on weekends.",
        "chunks": [
            "週末は",
            "予約が",
            "必要です。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "週末は予約が必要です。",
        "kana": "しゅうまつは よやくが ひつようです。",
        "romaji": "shuumatsu wa yoyaku ga hitsuyou desu.",
        "explanation": "必要です takes が for the thing that is required."
    },
    {
        "id": "sentence-v2-093",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Please do not enter here.",
        "chunks": [
            "ここ",
            "には入らないで",
            "ください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ここには入らないでください。",
        "kana": "ここには はいらないで ください。",
        "romaji": "koko ni wa hairanaide kudasai.",
        "explanation": "～ないでください is a polite prohibition."
    },
    {
        "id": "sentence-v2-094",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "The elevator is under inspection.",
        "chunks": [
            "エレベーター",
            "は点検中",
            "です。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "エレベーターは点検中です。",
        "kana": "えれべーたーは てんけんちゅうです。",
        "romaji": "erebeetaa wa tenkenchuu desu.",
        "explanation": "Noun plus 中 indicates an activity currently in progress."
    },
    {
        "id": "sentence-v2-095",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "Cash cannot be used here.",
        "chunks": [
            "ここでは",
            "現金が",
            "使えません。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ここでは現金が使えません。",
        "kana": "ここでは げんきんが つかえません。",
        "romaji": "koko de wa genkin ga tsukaemasen.",
        "explanation": "The potential negative 使えません means cannot be used."
    },
    {
        "id": "sentence-v2-096",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Please remove your shoes before entering.",
        "chunks": [
            "入る前に",
            "靴を",
            "脱いでください。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "入る前に靴を脱いでください。",
        "kana": "はいる まえに くつを ぬいで ください。",
        "romaji": "hairu mae ni kutsu o nuide kudasai.",
        "explanation": "Dictionary form plus 前に means before doing the action."
    },
    {
        "id": "sentence-v2-097",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "I took this photo yesterday.",
        "chunks": [
            "この写真、",
            "昨日",
            "撮った。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "この写真、昨日撮った。",
        "kana": "この しゃしん、きのう とった。",
        "romaji": "kono shashin, kinou totta.",
        "explanation": "In casual speech, は is often omitted, and the plain past 撮った sounds natural with friends or in captions."
    },
    {
        "id": "sentence-v2-098",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "I can't wait for the weekend.",
        "chunks": [
            "週末",
            "が待ち",
            "きれない！"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "週末が待ちきれない！",
        "kana": "しゅうまつが まちきれない！",
        "romaji": "shuumatsu ga machikirenai!",
        "explanation": "待ちきれない means being unable to wait because of excitement."
    },
    {
        "id": "sentence-v2-099",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "This place was really beautiful.",
        "chunks": [
            "ここは",
            "本当に",
            "きれいだった。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ここは本当にきれいだった。",
        "kana": "ここは ほんとうに きれいだった。",
        "romaji": "koko wa hontou ni kirei datta.",
        "explanation": "本当に strengthens the casual past description."
    },
    {
        "id": "sentence-v2-100",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "Tell me your recommendations in the comments!",
        "chunks": [
            "みんなのおすすめ、",
            "コメントで",
            "教えて！"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "みんなのおすすめ、コメントで教えて！",
        "kana": "みんなの おすすめ、こめんとで おしえて！",
        "romaji": "minna no osusume, komento de oshiete!",
        "explanation": "A short て-form request is natural in social posts; コメントで marks comments as the channel."
    },
    {
        "id": "sentence-v3-101",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I was about to go out when it started raining.",
        "chunks": [
            "出かけようとしたら、",
            "雨が",
            "降ってきました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "出かけようとしたら、雨が降ってきました。",
        "kana": "でかけようとしたら、あめが ふってきました。",
        "romaji": "dekakeyou to shitara, ame ga futte kimashita.",
        "explanation": "～ようとしたら means just as I was about to; ～てきました shows the rain starting."
    },
    {
        "id": "sentence-v3-102",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I forgot where I put my keys.",
        "chunks": [
            "鍵を",
            "どこに置いたか",
            "忘れました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "鍵をどこに置いたか忘れました。",
        "kana": "かぎを どこに おいたか わすれました。",
        "romaji": "kagi o doko ni oita ka wasuremashita.",
        "explanation": "An embedded question uses か before 忘れました: where I put the keys."
    },
    {
        "id": "sentence-v3-103",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "Even when I’m busy, I try to eat breakfast.",
        "chunks": [
            "忙しくても、",
            "朝ご飯は",
            "食べるようにしています。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "忙しくても、朝ご飯は食べるようにしています。",
        "kana": "いそがしくても、あさごはんは たべるようにしています。",
        "romaji": "isogashikute mo, asagohan wa taberu you ni shite imasu.",
        "explanation": "～ても means even if/even when, and ～ようにしています describes a habit you make an effort to maintain."
    },
    {
        "id": "sentence-v3-104",
        "category": "Everyday",
        "difficulty": "Beginner",
        "english": "I have to wake up early tomorrow.",
        "chunks": [
            "明日は",
            "早く",
            "起きないといけません。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "明日は早く起きないといけません。",
        "kana": "あしたは はやく おきないと いけません。",
        "romaji": "ashita wa hayaku okinai to ikemasen.",
        "explanation": "～ないといけません is a common spoken way to express something you have to do."
    },
    {
        "id": "sentence-v3-105",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "The more I study, the more interesting Japanese gets.",
        "chunks": [
            "勉強すればするほど、",
            "日本語が",
            "面白くなります。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "勉強すればするほど、日本語が面白くなります。",
        "kana": "べんきょうすれば するほど、にほんごが おもしろくなります。",
        "romaji": "benkyou sureba suru hodo, nihongo ga omoshiroku narimasu.",
        "explanation": "～ば～ほど expresses the more...the more..., while ～くなります shows a change of state."
    },
    {
        "id": "sentence-v3-106",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "It was on sale, so I ended up buying it.",
        "chunks": [
            "セールだったので、",
            "つい",
            "買ってしまいました。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "セールだったので、つい買ってしまいました。",
        "kana": "せーるだったので、つい かってしまいました。",
        "romaji": "seeru datta node, tsui katte shimaimashita.",
        "explanation": "つい means unintentionally, and ～てしまいました expresses an action you ended up doing."
    },
    {
        "id": "sentence-v3-107",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I won’t know unless I ask.",
        "chunks": [
            "聞いてみないと",
            "わかりません。"
        ],
        "correctOrder": [
            0,
            1
        ],
        "sentence": "聞いてみないとわかりません。",
        "kana": "きいてみないと わかりません。",
        "romaji": "kiite minai to wakarimasen.",
        "explanation": "～てみる means try doing, and ～ないと means unless / if not."
    },
    {
        "id": "sentence-v3-108",
        "category": "Everyday",
        "difficulty": "Intermediate",
        "english": "I thought I’d lost my phone, but it was in my bag.",
        "chunks": [
            "スマホをなくしたと",
            "思ったら、",
            "かばんに",
            "入っていました。"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "スマホをなくしたと思ったら、かばんに入っていました。",
        "kana": "すまほを なくしたと おもったら、かばんに はいっていました。",
        "romaji": "sumaho o nakushita to omottara, kaban ni haitte imashita.",
        "explanation": "～と思ったら introduces what you thought, followed by an unexpected discovery."
    },
    {
        "id": "sentence-v3-109",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "Could you tell me which train I should take?",
        "chunks": [
            "どの電車に",
            "乗ればいいか",
            "教えてもらえますか？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "どの電車に乗ればいいか教えてもらえますか？",
        "kana": "どの でんしゃに のれば いいか おしえて もらえますか？",
        "romaji": "dono densha ni noreba ii ka oshiete moraemasu ka?",
        "explanation": "～ばいいか asks what one should do; 教えてもらえますか makes the request polite and natural."
    },
    {
        "id": "sentence-v3-110",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "I’d like to get off at the next stop.",
        "chunks": [
            "次の駅で",
            "降りたいです。"
        ],
        "correctOrder": [
            0,
            1
        ],
        "sentence": "次の駅で降りたいです。",
        "kana": "つぎの えきで おりたいです。",
        "romaji": "tsugi no eki de oritai desu.",
        "explanation": "The verb stem + たい expresses what the speaker wants to do."
    },
    {
        "id": "sentence-v3-111",
        "category": "Travel",
        "difficulty": "Beginner",
        "english": "May I leave my luggage here for a little while?",
        "chunks": [
            "荷物を",
            "しばらく",
            "ここに置いても",
            "いいですか？"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "荷物をしばらくここに置いてもいいですか？",
        "kana": "にもつを しばらく ここに おいても いいですか？",
        "romaji": "nimotsu o shibaraku koko ni oite mo ii desu ka?",
        "explanation": "～てもいいですか asks permission; しばらく means for a while."
    },
    {
        "id": "sentence-v3-112",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "Is there somewhere nearby where I can charge my phone?",
        "chunks": [
            "この近くに",
            "スマホを充電できる",
            "場所は",
            "ありますか？"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "この近くにスマホを充電できる場所はありますか？",
        "kana": "この ちかくに すまほを じゅうでんできる ばしょは ありますか？",
        "romaji": "kono chikaku ni sumaho o juuden dekiru basho wa arimasu ka?",
        "explanation": "A plain-form clause can modify 場所: a place where I can charge my phone."
    },
    {
        "id": "sentence-v3-113",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "I asked for no onions, but there are onions in it.",
        "chunks": [
            "玉ねぎ抜きで",
            "お願いしたんですが、",
            "入っています。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "玉ねぎ抜きでお願いしたんですが、入っています。",
        "kana": "たまねぎぬきで おねがいしたんですが、はいっています。",
        "romaji": "tamanegi nuki de onegai shita n desu ga, haitte imasu.",
        "explanation": "～抜き means without; ～んですが naturally introduces a problem to staff."
    },
    {
        "id": "sentence-v3-114",
        "category": "Travel",
        "difficulty": "Intermediate",
        "english": "If possible, I’d like a quiet room.",
        "chunks": [
            "できれば、",
            "静かな部屋を",
            "お願いしたいです。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "できれば、静かな部屋をお願いしたいです。",
        "kana": "できれば、しずかな へやを おねがいしたいです。",
        "romaji": "dekireba, shizuka na heya o onegai shitai desu.",
        "explanation": "できれば softens the request, while ～たい expresses the preference."
    },
    {
        "id": "sentence-v3-115",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "I completely forgot to reply.",
        "chunks": [
            "返信するの、",
            "完全に",
            "忘れてた。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "返信するの、完全に忘れてた。",
        "kana": "へんしんするの、かんぜんに わすれてた。",
        "romaji": "henshin suru no, kanzen ni wasureteta.",
        "explanation": "忘れてた is the natural casual contraction of 忘れていた."
    },
    {
        "id": "sentence-v3-116",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "If you’re free, want to grab dinner?",
        "chunks": [
            "暇だったら、",
            "ご飯",
            "行かない？"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "暇だったら、ご飯行かない？",
        "kana": "ひまだったら、ごはん いかない？",
        "romaji": "hima dattara, gohan ikanai?",
        "explanation": "A negative question like 行かない？ is a very natural casual invitation."
    },
    {
        "id": "sentence-v3-117",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "I thought you were already here.",
        "chunks": [
            "もう",
            "着いてると",
            "思ってた。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "もう着いてると思ってた。",
        "kana": "もう ついてると おもってた。",
        "romaji": "mou tsuiteru to omotteta.",
        "explanation": "～と思ってた is the casual contraction of ～と思っていた and reports what you had assumed."
    },
    {
        "id": "sentence-v3-118",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "I might be a little late, sorry.",
        "chunks": [
            "ちょっと",
            "遅れるかも、",
            "ごめん。"
        ],
        "correctOrder": [
            0,
            1,
            2
        ],
        "sentence": "ちょっと遅れるかも、ごめん。",
        "kana": "ちょっと おくれるかも、ごめん。",
        "romaji": "chotto okureru kamo, gomen.",
        "explanation": "かも softly expresses uncertainty, and ごめん makes the message casual and apologetic."
    },
    {
        "id": "sentence-v3-119",
        "category": "Casual",
        "difficulty": "Beginner",
        "english": "Message me when you get home.",
        "chunks": [
            "家着いたら",
            "連絡してね。"
        ],
        "correctOrder": [
            0,
            1
        ],
        "sentence": "家着いたら連絡してね。",
        "kana": "いえ ついたら れんらくしてね。",
        "romaji": "ie tsuitara renraku shite ne.",
        "explanation": "～たら means when/once, and してね makes the request friendly."
    },
    {
        "id": "sentence-v3-120",
        "category": "Casual",
        "difficulty": "Intermediate",
        "english": "That looks really good—where did you get it?",
        "chunks": [
            "それ、",
            "めっちゃおいしそう。",
            "どこで",
            "買ったの？"
        ],
        "correctOrder": [
            0,
            1,
            2,
            3
        ],
        "sentence": "それ、めっちゃおいしそう。どこで買ったの？",
        "kana": "それ、めっちゃ おいしそう。どこで かったの？",
        "romaji": "sore, meccha oishisou. doko de katta no?",
        "explanation": "～そう means looks..., and ～の？ is a natural casual question ending."
    }
];
})();