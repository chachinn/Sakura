(function () {
    "use strict";

    window.ONE_LINE_MANY_PERSONALITIES_DATA = [
        { id:"personality-everyday-001", category:"Everyday", coreMeaning:"I'm tired.", situation:"Talking about how you feel after a long day.", variants:[
            { label:"Polite", japanese:"少し疲れました。", kana:"すこし つかれました。", romaji:"sukoshi tsukaremashita.", english:"I'm a little tired.", nuance:"Safe in polite conversation; 少し makes it less abrupt.", formality:"Polite" },
            { label:"Casual", japanese:"疲れた。", kana:"つかれた。", romaji:"tsukareta.", english:"I'm tired.", nuance:"Natural and direct with friends or family.", formality:"Casual" },
            { label:"Blunt", japanese:"もう無理。", kana:"もう むり。", romaji:"mou muri.", english:"I'm done. I can't anymore.", nuance:"Much stronger than simply being tired; it suggests you have reached your limit.", warning:"Very blunt; avoid as a neutral workplace statement." }
        ]},
        { id:"personality-everyday-002", category:"Everyday", coreMeaning:"I'm hungry.", situation:"Saying that you want something to eat.", variants:[
            { label:"Polite", japanese:"お腹が空きました。", kana:"おなかが すきました。", romaji:"onaka ga sukimashita.", english:"I'm hungry.", nuance:"A complete polite statement suitable in general conversation.", formality:"Polite" },
            { label:"Casual", japanese:"お腹すいた。", kana:"おなか すいた。", romaji:"onaka suita.", english:"I'm hungry.", nuance:"Very common with friends; が is naturally omitted.", formality:"Casual" },
            { label:"Cute", japanese:"おなかぺこぺこ。", kana:"おなか ぺこぺこ。", romaji:"onaka pekopeko.", english:"I'm starving / My tummy is empty.", nuance:"Playful and expressive rather than a neutral statement.", tone:"Playful" }
        ]},
        { id:"personality-everyday-003", category:"Everyday", coreMeaning:"I'm happy.", situation:"Reacting to good personal news.", variants:[
            { label:"Polite", japanese:"うれしいです。", kana:"うれしいです。", romaji:"ureshii desu.", english:"I'm happy.", nuance:"Simple and safe in polite conversation.", formality:"Polite" },
            { label:"Casual", japanese:"うれしい！", kana:"うれしい！", romaji:"ureshii!", english:"I'm so happy!", nuance:"Natural with friends and close people.", formality:"Casual" },
            { label:"Friendly", japanese:"めっちゃうれしい！", kana:"めっちゃ うれしい！", romaji:"meccha ureshii!", english:"I'm super happy!", nuance:"Very casual and enthusiastic; めっちゃ is common informal speech.", warning:"Avoid in formal settings." }
        ]},
        { id:"personality-everyday-004", category:"Everyday", coreMeaning:"I don't know.", situation:"Responding when you are unsure of an answer.", variants:[
            { label:"Polite", japanese:"わかりません。", kana:"わかりません。", romaji:"wakarimasen.", english:"I don't know / I don't understand.", nuance:"A direct but polite answer.", formality:"Polite" },
            { label:"Casual", japanese:"わかんない。", kana:"わかんない。", romaji:"wakannai.", english:"I don't know.", nuance:"A common spoken contraction used with people you are close to.", formality:"Casual" },
            { label:"Soft", japanese:"ちょっとわからないかも。", kana:"ちょっと わからない かも。", romaji:"chotto wakaranai kamo.", english:"I'm not completely sure.", nuance:"ちょっと and かも soften the uncertainty.", tone:"Soft" }
        ]},
        { id:"personality-everyday-005", category:"Everyday", coreMeaning:"Wait.", situation:"Asking someone not to go ahead yet.", variants:[
            { label:"Polite", japanese:"少々お待ちください。", kana:"しょうしょう おまちください。", romaji:"shoushou omachi kudasai.", english:"Please wait a moment.", nuance:"Formal and service-oriented; common in customer-facing situations.", formality:"Very polite" },
            { label:"Friendly", japanese:"ちょっと待ってね。", kana:"ちょっと まってね。", romaji:"chotto matte ne.", english:"Wait a second, okay?", nuance:"Friendly and softened by ちょっと and ね.", formality:"Casual" },
            { label:"Blunt", japanese:"待って。", kana:"まって。", romaji:"matte.", english:"Wait.", nuance:"Direct. Tone of voice determines whether it sounds urgent or demanding.", warning:"Can sound commanding without a friendly tone." }
        ]},
        { id:"personality-everyday-006", category:"Everyday", coreMeaning:"Thank you.", situation:"Showing appreciation for someone's help.", variants:[
            { label:"Polite", japanese:"ありがとうございます。", kana:"ありがとうございます。", romaji:"arigatou gozaimasu.", english:"Thank you very much.", nuance:"The standard polite expression of thanks.", formality:"Polite" },
            { label:"Casual", japanese:"ありがとう。", kana:"ありがとう。", romaji:"arigatou.", english:"Thanks.", nuance:"Warm and natural with friends, family, and close colleagues.", formality:"Casual" },
            { label:"Friendly", japanese:"助かった、ありがとう！", kana:"たすかった、ありがとう！", romaji:"tasukatta, arigatou!", english:"That really helped—thanks!", nuance:"Adds the specific feeling that the person's help saved you trouble.", tone:"Warm" }
        ]},
        { id:"personality-everyday-007", category:"Everyday", coreMeaning:"I'm sorry.", situation:"Apologizing for causing inconvenience.", variants:[
            { label:"Polite", japanese:"申し訳ありません。", kana:"もうしわけ ありません。", romaji:"moushiwake arimasen.", english:"I sincerely apologize.", nuance:"Formal and serious; appropriate for meaningful inconvenience.", formality:"Very polite" },
            { label:"Casual", japanese:"ごめん。", kana:"ごめん。", romaji:"gomen.", english:"Sorry.", nuance:"Direct and natural with someone close to you.", formality:"Casual" },
            { label:"Soft", japanese:"ごめんね。", kana:"ごめんね。", romaji:"gomen ne.", english:"I'm sorry, okay?", nuance:"ね gives the apology a softer, more personal tone.", tone:"Soft" }
        ]},
        { id:"personality-everyday-008", category:"Everyday", coreMeaning:"I'm busy.", situation:"Explaining that you cannot respond immediately.", variants:[
            { label:"Polite", japanese:"今ちょっと忙しいです。", kana:"いま ちょっと いそがしいです。", romaji:"ima chotto isogashii desu.", english:"I'm a little busy right now.", nuance:"Polite and softened by ちょっと.", formality:"Polite" },
            { label:"Casual", japanese:"今忙しい。", kana:"いま いそがしい。", romaji:"ima isogashii.", english:"I'm busy right now.", nuance:"Short and natural with close people, but direct.", formality:"Casual" },
            { label:"Workplace", japanese:"今ちょっと手が離せません。", kana:"いま ちょっと てが はなせません。", romaji:"ima chotto te ga hanasemasen.", english:"I can't step away from what I'm doing right now.", nuance:"A useful workplace phrase when you are occupied with a task.", formality:"Polite" }
        ]},
        { id:"personality-everyday-009", category:"Everyday", coreMeaning:"It's okay.", situation:"Reassuring someone after a small mistake.", variants:[
            { label:"Polite", japanese:"大丈夫です。", kana:"だいじょうぶです。", romaji:"daijoubu desu.", english:"It's okay.", nuance:"A safe polite reassurance.", formality:"Polite" },
            { label:"Casual", japanese:"大丈夫。", kana:"だいじょうぶ。", romaji:"daijoubu.", english:"It's okay.", nuance:"Simple reassurance with friends or family.", formality:"Casual" },
            { label:"Friendly", japanese:"全然大丈夫だよ。", kana:"ぜんぜん だいじょうぶだよ。", romaji:"zenzen daijoubu da yo.", english:"It's totally fine.", nuance:"Warm, emphatic reassurance in casual conversation.", tone:"Reassuring" }
        ]},
        { id:"personality-everyday-010", category:"Everyday", coreMeaning:"Let's go.", situation:"Suggesting that it is time to leave together.", variants:[
            { label:"Polite", japanese:"行きましょう。", kana:"いきましょう。", romaji:"ikimashou.", english:"Let's go.", nuance:"The standard polite invitation.", formality:"Polite" },
            { label:"Casual", japanese:"行こう。", kana:"いこう。", romaji:"ikou.", english:"Let's go.", nuance:"Natural with friends and close companions.", formality:"Casual" },
            { label:"Soft", japanese:"そろそろ行こっか。", kana:"そろそろ いこっか。", romaji:"sorosoro ikokka.", english:"Shall we get going soon?", nuance:"そろそろ and the contracted 行こっか make the suggestion gentle and conversational.", tone:"Soft" }
        ]},
        { id:"personality-everyday-011", category:"Everyday", coreMeaning:"I want to go.", situation:"Expressing interest in joining an outing.", variants:[
            { label:"Polite", japanese:"行きたいです。", kana:"いきたいです。", romaji:"ikitai desu.", english:"I'd like to go.", nuance:"A straightforward polite statement of desire.", formality:"Polite" },
            { label:"Casual", japanese:"行きたい！", kana:"いきたい！", romaji:"ikitai!", english:"I want to go!", nuance:"Direct and enthusiastic with friends.", formality:"Casual" },
            { label:"Soft", japanese:"行けたらいいな。", kana:"いけたら いいな。", romaji:"iketara ii na.", english:"I hope I can go.", nuance:"Expresses the wish gently without making a firm commitment.", tone:"Soft" }
        ]},
        { id:"personality-everyday-012", category:"Everyday", coreMeaning:"I don't want to go.", situation:"Declining an outing or activity.", variants:[
            { label:"Polite", japanese:"行きたくありません。", kana:"いきたく ありません。", romaji:"ikitaku arimasen.", english:"I don't want to go.", nuance:"Grammatically polite but still quite direct about your preference.", formality:"Polite" },
            { label:"Casual", japanese:"行きたくない。", kana:"いきたくない。", romaji:"ikitakunai.", english:"I don't want to go.", nuance:"Direct casual speech for close relationships.", formality:"Casual" },
            { label:"Soft", japanese:"今回はやめておこうかな。", kana:"こんかいは やめておこうかな。", romaji:"konkai wa yamete okou kana.", english:"Maybe I'll sit this one out.", nuance:"A tactful, less confrontational way to decline this time.", tone:"Soft" }
        ]},

        { id:"personality-friendship-001", category:"Friendship", coreMeaning:"That's cute.", situation:"Reacting to a friend's photo or new item.", variants:[
            { label:"Polite", japanese:"かわいいですね。", kana:"かわいいですね。", romaji:"kawaii desu ne.", english:"That's cute, isn't it?", nuance:"Friendly and polite without sounding distant.", formality:"Polite" },
            { label:"Casual", japanese:"かわいい！", kana:"かわいい！", romaji:"kawaii!", english:"So cute!", nuance:"The most natural simple reaction with friends.", formality:"Casual" },
            { label:"SNS", japanese:"かわいすぎる！", kana:"かわいすぎる！", romaji:"kawaisugiru!", english:"It's too cute!", nuance:"An enthusiastic reaction common in messages and social posts.", tone:"Expressive" }
        ]},
        { id:"personality-friendship-002", category:"Friendship", coreMeaning:"Really?", situation:"Reacting to surprising information from a friend.", variants:[
            { label:"Polite", japanese:"本当ですか？", kana:"ほんとうですか？", romaji:"hontou desu ka?", english:"Is that true?", nuance:"A neutral polite expression of surprise.", formality:"Polite" },
            { label:"Casual", japanese:"本当？", kana:"ほんとう？", romaji:"hontou?", english:"Really?", nuance:"Natural and neutral with friends.", formality:"Casual" },
            { label:"Blunt", japanese:"マジで？", kana:"まじで？", romaji:"maji de?", english:"Seriously?", nuance:"Very common casual slang, with stronger surprise than 本当？.", warning:"Informal; avoid with customers or senior people." }
        ]},
        { id:"personality-friendship-003", category:"Friendship", coreMeaning:"I like it.", situation:"Giving your opinion about something a friend shows you.", variants:[
            { label:"Polite", japanese:"気に入っています。", kana:"きにいって います。", romaji:"ki ni itte imasu.", english:"I like it.", nuance:"Polite and clear; 気に入る means something appeals to you.", formality:"Polite" },
            { label:"Casual", japanese:"これ好き。", kana:"これ すき。", romaji:"kore suki.", english:"I like this.", nuance:"Natural casual speech with the particle が omitted.", formality:"Casual" },
            { label:"Soft", japanese:"これ、けっこう好きかも。", kana:"これ、けっこう すきかも。", romaji:"kore, kekkou suki kamo.", english:"I think I quite like this.", nuance:"かも makes the opinion feel tentative and conversational.", tone:"Soft" }
        ]},
        { id:"personality-friendship-004", category:"Friendship", coreMeaning:"I miss you.", situation:"Telling someone you want to see them again.", variants:[
            { label:"Polite", japanese:"またお会いしたいです。", kana:"また おあいしたいです。", romaji:"mata oai shitai desu.", english:"I'd like to see you again.", nuance:"Polite and emotionally restrained.", formality:"Polite" },
            { label:"Casual", japanese:"会いたい。", kana:"あいたい。", romaji:"aitai.", english:"I want to see you / I miss you.", nuance:"Japanese often expresses “I miss you” naturally as wanting to meet.", formality:"Casual" },
            { label:"Soft", japanese:"ちょっと会いたくなった。", kana:"ちょっと あいたくなった。", romaji:"chotto aitaku natta.", english:"I started missing you a little.", nuance:"A softer, more indirect way to reveal the feeling.", tone:"Soft" }
        ]},
        { id:"personality-friendship-005", category:"Friendship", coreMeaning:"That was fun.", situation:"Talking after spending time together.", variants:[
            { label:"Polite", japanese:"とても楽しかったです。", kana:"とても たのしかったです。", romaji:"totemo tanoshikatta desu.", english:"I had a very good time.", nuance:"Warm and polite; suitable even when you are not very close.", formality:"Polite" },
            { label:"Casual", japanese:"楽しかった！", kana:"たのしかった！", romaji:"tanoshikatta!", english:"That was fun!", nuance:"Natural after an outing with friends.", formality:"Casual" },
            { label:"Friendly", japanese:"めっちゃ楽しかった！", kana:"めっちゃ たのしかった！", romaji:"meccha tanoshikatta!", english:"That was so much fun!", nuance:"Highly enthusiastic informal speech.", warning:"めっちゃ is casual; avoid in formal conversation." }
        ]},
        { id:"personality-friendship-006", category:"Friendship", coreMeaning:"I'm nervous.", situation:"Talking before an important event.", variants:[
            { label:"Polite", japanese:"緊張しています。", kana:"きんちょうして います。", romaji:"kinchou shite imasu.", english:"I'm nervous.", nuance:"A neutral, polite description of your state.", formality:"Polite" },
            { label:"Casual", japanese:"緊張してる。", kana:"きんちょうしてる。", romaji:"kinchou shiteru.", english:"I'm nervous.", nuance:"The common spoken contraction of 緊張している.", formality:"Casual" },
            { label:"Cute", japanese:"ちょっとドキドキする。", kana:"ちょっと どきどきする。", romaji:"chotto dokidoki suru.", english:"My heart is racing a little.", nuance:"Expressive and softer; ドキドキ describes a pounding heart from nerves or excitement.", tone:"Playful" }
        ]},
        { id:"personality-friendship-007", category:"Friendship", coreMeaning:"Can you help me?", situation:"Asking someone to help with a task.", variants:[
            { label:"Polite", japanese:"手伝っていただけますか？", kana:"てつだって いただけますか？", romaji:"tetsudatte itadakemasu ka?", english:"Could you help me?", nuance:"A respectful request suitable when asking a favor politely.", formality:"Polite" },
            { label:"Casual", japanese:"手伝ってくれる？", kana:"てつだって くれる？", romaji:"tetsudatte kureru?", english:"Will you help me?", nuance:"Natural with a friend when asking them to do something for you.", formality:"Casual" },
            { label:"Soft", japanese:"ちょっと手伝ってもらえる？", kana:"ちょっと てつだって もらえる？", romaji:"chotto tetsudatte moraeru?", english:"Could you help me for a moment?", nuance:"ちょっと softens the casual request.", tone:"Soft" }
        ]},
        { id:"personality-friendship-008", category:"Friendship", coreMeaning:"See you later.", situation:"Parting when you expect to meet again soon.", variants:[
            { label:"Polite", japanese:"また後でお会いしましょう。", kana:"また あとで おあいしましょう。", romaji:"mata ato de oai shimashou.", english:"Let's meet again later.", nuance:"Polite and complete, though more formal than friends usually need.", formality:"Polite" },
            { label:"Casual", japanese:"またあとで。", kana:"また あとで。", romaji:"mata ato de.", english:"See you later.", nuance:"Short and natural when the context is already clear.", formality:"Casual" },
            { label:"Friendly", japanese:"じゃ、またあとでね。", kana:"じゃ、また あとでね。", romaji:"ja, mata ato de ne.", english:"Okay, see you later!", nuance:"じゃ and ね give the goodbye a warm conversational tone.", tone:"Friendly" }
        ]},

        { id:"personality-workplace-001", category:"Workplace", coreMeaning:"Understood.", situation:"Acknowledging instructions at work.", variants:[
            { label:"Workplace", japanese:"承知しました。", kana:"しょうちしました。", romaji:"shouchi shimashita.", english:"Understood.", nuance:"Professional and respectful; useful with customers or senior colleagues.", formality:"Formal" },
            { label:"Polite", japanese:"わかりました。", kana:"わかりました。", romaji:"wakarimashita.", english:"I understand.", nuance:"Standard polite acknowledgement in many situations.", formality:"Polite" },
            { label:"Friendly", japanese:"了解です。", kana:"りょうかいです。", romaji:"ryoukai desu.", english:"Got it.", nuance:"Common among peers, but may sound too casual toward a customer or senior manager.", warning:"Use cautiously upward in a formal hierarchy." }
        ]},
        { id:"personality-workplace-002", category:"Workplace", coreMeaning:"Please check this.", situation:"Asking someone at work to review something.", variants:[
            { label:"Workplace", japanese:"ご確認をお願いいたします。", kana:"ごかくにんを おねがいいたします。", romaji:"gokakunin o onegai itashimasu.", english:"Please review this.", nuance:"Formal business wording appropriate in email and customer communication.", formality:"Formal" },
            { label:"Polite", japanese:"確認をお願いします。", kana:"かくにんを おねがいします。", romaji:"kakunin o onegai shimasu.", english:"Please check this.", nuance:"Standard polite workplace request.", formality:"Polite" },
            { label:"Soft", japanese:"ちょっと見てもらえますか？", kana:"ちょっと みて もらえますか？", romaji:"chotto mite moraemasu ka?", english:"Could you take a quick look?", nuance:"Conversational and softened; natural with a colleague.", tone:"Soft" }
        ]},
        { id:"personality-workplace-003", category:"Workplace", coreMeaning:"I'm running late.", situation:"Informing work contacts that your arrival will be delayed.", variants:[
            { label:"Workplace", japanese:"到着が少し遅れそうです。", kana:"とうちゃくが すこし おくれそうです。", romaji:"touchaku ga sukoshi okuresou desu.", english:"It looks like my arrival will be slightly delayed.", nuance:"Professional and specific without sounding abrupt.", formality:"Polite" },
            { label:"Polite", japanese:"少し遅れます。", kana:"すこし おくれます。", romaji:"sukoshi okuremasu.", english:"I'll be a little late.", nuance:"Clear and polite, but an apology may be appropriate too.", formality:"Polite" },
            { label:"Soft", japanese:"ちょっと遅れます。すみません。", kana:"ちょっと おくれます。すみません。", romaji:"chotto okuremasu. sumimasen.", english:"I'm going to be a little late. Sorry.", nuance:"Conversational while still polite and accountable.", tone:"Apologetic" }
        ]},
        { id:"personality-workplace-004", category:"Workplace", coreMeaning:"I'll leave before you.", situation:"Leaving the workplace while others remain.", variants:[
            { label:"Workplace", japanese:"お先に失礼します。", kana:"おさきに しつれいします。", romaji:"osaki ni shitsurei shimasu.", english:"Excuse me for leaving before you.", nuance:"The standard workplace phrase when leaving before colleagues.", formality:"Polite" },
            { label:"Polite", japanese:"先に失礼します。", kana:"さきに しつれいします。", romaji:"saki ni shitsurei shimasu.", english:"Excuse me, I'll leave first.", nuance:"Polite, though omitting お makes it slightly less formal.", formality:"Polite" },
            { label:"Friendly", japanese:"今日は先に上がります。", kana:"きょうは さきに あがります。", romaji:"kyou wa saki ni agarimasu.", english:"I'm heading out first today.", nuance:"A conversational workplace statement; 上がる means to finish work and leave.", tone:"Collegial" }
        ]},
        { id:"personality-workplace-005", category:"Workplace", coreMeaning:"Thank you for your effort.", situation:"Acknowledging someone's work or assistance.", variants:[
            { label:"Workplace", japanese:"お疲れさまでした。", kana:"おつかれさまでした。", romaji:"otsukaresama deshita.", english:"Thank you for your hard work.", nuance:"Common after work or the completion of a task.", formality:"Polite" },
            { label:"Polite", japanese:"ありがとうございました。助かりました。", kana:"ありがとうございました。たすかりました。", romaji:"arigatou gozaimashita. tasukarimashita.", english:"Thank you very much. That was a great help.", nuance:"Explicitly thanks the person and explains that their help mattered.", formality:"Polite" },
            { label:"Friendly", japanese:"おつかれさまです！", kana:"おつかれさまです！", romaji:"otsukaresama desu!", english:"Good work / Thanks for your effort!", nuance:"A flexible collegial greeting or acknowledgement during the workday.", tone:"Collegial" }
        ]},

        { id:"personality-expressive-001", category:"Expressive", coreMeaning:"That's impossible.", situation:"Reacting to a proposal that cannot realistically work.", variants:[
            { label:"Soft", japanese:"それは難しいと思います。", kana:"それは むずかしいと おもいます。", romaji:"sore wa muzukashii to omoimasu.", english:"I think that would be difficult.", nuance:"A tactful indirect refusal often used in polite settings.", tone:"Diplomatic" },
            { label:"Casual", japanese:"それは無理。", kana:"それは むり。", romaji:"sore wa muri.", english:"That's impossible.", nuance:"Direct casual judgment; natural with close people.", formality:"Casual" },
            { label:"Dramatic", japanese:"絶対無理！", kana:"ぜったい むり！", romaji:"zettai muri!", english:"Absolutely impossible!", nuance:"Strong and emotional; often exaggerated rather than a measured assessment.", warning:"Dramatic and blunt, not neutral professional language." }
        ]},
        { id:"personality-expressive-002", category:"Expressive", coreMeaning:"I'm surprised.", situation:"Reacting to unexpected news.", variants:[
            { label:"Polite", japanese:"驚きました。", kana:"おどろきました。", romaji:"odorokimashita.", english:"I was surprised.", nuance:"A neutral polite description of your reaction.", formality:"Polite" },
            { label:"Casual", japanese:"びっくりした。", kana:"びっくりした。", romaji:"bikkuri shita.", english:"That surprised me.", nuance:"Very common in everyday spoken Japanese.", formality:"Casual" },
            { label:"Dramatic", japanese:"えっ、うそ！", kana:"えっ、うそ！", romaji:"e, uso!", english:"What—no way!", nuance:"An emotional reaction; うそ here often means disbelief, not a literal accusation of lying.", warning:"Highly casual and expressive." }
        ]},
        { id:"personality-expressive-003", category:"Expressive", coreMeaning:"I'm excited.", situation:"Looking forward to an upcoming plan.", variants:[
            { label:"Polite", japanese:"楽しみにしています。", kana:"たのしみに しています。", romaji:"tanoshimi ni shite imasu.", english:"I'm looking forward to it.", nuance:"The standard polite way to express anticipation.", formality:"Polite" },
            { label:"Casual", japanese:"楽しみ！", kana:"たのしみ！", romaji:"tanoshimi!", english:"I can't wait!", nuance:"Short and natural with friends when the plan is already understood.", formality:"Casual" },
            { label:"SNS", japanese:"めっちゃ楽しみ！", kana:"めっちゃ たのしみ！", romaji:"meccha tanoshimi!", english:"I'm so excited!", nuance:"Very enthusiastic informal wording common in messages and posts.", warning:"Avoid めっちゃ in formal communication." }
        ]},
        { id:"personality-expressive-004", category:"Expressive", coreMeaning:"I'm annoyed.", situation:"Reacting when something has become frustrating.", variants:[
            { label:"Polite", japanese:"それは少し困ります。", kana:"それは すこし こまります。", romaji:"sore wa sukoshi komarimasu.", english:"That would be a little problematic for me.", nuance:"Indirect and restrained; communicates a problem without openly showing anger.", formality:"Polite" },
            { label:"Casual", japanese:"ちょっとイラッとした。", kana:"ちょっと いらっとした。", romaji:"chotto iratto shita.", english:"That annoyed me a little.", nuance:"イラッとする describes a brief flash of irritation.", formality:"Casual" },
            { label:"Blunt", japanese:"もう勘弁して。", kana:"もう かんべんして。", romaji:"mou kanben shite.", english:"Please, give me a break already.", nuance:"Shows that your patience is running out.", warning:"Blunt and emotionally charged; avoid in formal situations." }
        ]},
        { id:"personality-expressive-005", category:"Expressive", coreMeaning:"I'm relieved.", situation:"Reacting after a worry has been resolved.", variants:[
            { label:"Polite", japanese:"安心しました。", kana:"あんしんしました。", romaji:"anshin shimashita.", english:"I'm relieved.", nuance:"A clear, polite statement that your concern is gone.", formality:"Polite" },
            { label:"Casual", japanese:"ほっとした。", kana:"ほっとした。", romaji:"hotto shita.", english:"What a relief.", nuance:"Natural everyday speech describing the feeling of tension releasing.", formality:"Casual" },
            { label:"Friendly", japanese:"よかった〜。", kana:"よかったー。", romaji:"yokattaa.", english:"Thank goodness!", nuance:"Drawn-out delivery adds emotional relief; common in friendly conversation.", tone:"Expressive" }
        ]}
    ];

    const nuanceByLabel = {
        Polite:"A complete polite form for general conversation.", Casual:"Natural with friends, family, or close peers.", Friendly:"Warm wording that emphasizes connection.", Soft:"Indirect or softened phrasing that reduces pressure.", Cute:"Playful wording for close relationships.", Blunt:"Direct and emotionally strong; tone and relationship matter.", Workplace:"Professional wording suitable for work communication.", SNS:"Compact expressive wording common in messages or posts.", Dramatic:"Heightened wording used for strong emotion or playful emphasis.", Gyaru:"Energetic youth-style wording for informal social settings."
    };
    const makeVariants = (meaning, rows) => rows.map(([label, japanese, kana, romaji]) => ({
        label, japanese, kana, romaji, english:meaning, nuance:nuanceByLabel[label],
        ...(["Blunt", "Gyaru"].includes(label) ? { warning:"Avoid this wording in formal situations." } : { formality:["Polite", "Workplace"].includes(label) ? "Polite" : "Casual" })
    }));
    const additions = [
        ["everyday-013","Everyday","I'm cold.","Commenting on the temperature.",[["Polite","少し寒いです。","すこし さむいです。","sukoshi samui desu."],["Casual","寒いね。","さむいね。","samui ne."],["Dramatic","寒すぎる！","さむすぎる！","samu sugiru!"]]],
        ["everyday-014","Everyday","I'm hot.","Reacting to hot weather or a warm room.",[["Polite","暑いですね。","あついですね。","atsui desu ne."],["Casual","暑い。","あつい。","atsui."],["Blunt","暑すぎ。","あつすぎ。","atsu sugi."]]],
        ["everyday-015","Everyday","I'm sleepy.","Saying you need rest.",[["Polite","眠いです。","ねむいです。","nemui desu."],["Casual","眠い。","ねむい。","nemui."],["Cute","ねむねむ。","ねむねむ。","nemu nemu."]]],
        ["everyday-016","Everyday","I'm full.","After eating enough.",[["Polite","お腹いっぱいです。","おなか いっぱいです。","onaka ippai desu."],["Casual","お腹いっぱい。","おなか いっぱい。","onaka ippai."],["Dramatic","もう何も入らない！","もう なにも はいらない！","mou nani mo hairanai!"]]],
        ["everyday-017","Everyday","I forgot.","Admitting something slipped your mind.",[["Polite","忘れていました。","わすれていました。","wasurete imashita."],["Casual","忘れてた。","わすれてた。","wasureteta."],["Soft","うっかり忘れちゃった。","うっかり わすれちゃった。","ukkari wasurechatta."]]],
        ["everyday-018","Everyday","I found it.","Locating something that was missing.",[["Polite","見つかりました。","みつかりました。","mitsukarimashita."],["Casual","見つけた！","みつけた！","mitsuketa!"],["SNS","あったー！","あったー！","attaa!"]]],
        ["everyday-019","Everyday","I'm ready.","Telling someone you can begin or leave.",[["Polite","準備できました。","じゅんび できました。","junbi dekimashita."],["Casual","準備できたよ。","じゅんび できたよ。","junbi dekita yo."],["Friendly","いつでもいいよ。","いつでも いいよ。","itsu demo ii yo."]]],
        ["everyday-020","Everyday","I'm home.","Greeting people when you return home.",[["Polite","ただいま帰りました。","ただいま かえりました。","tadaima kaerimashita."],["Casual","ただいま。","ただいま。","tadaima."],["Cute","ただいまー！","ただいまー！","tadaimaa!"]]],
        ["everyday-021","Everyday","Welcome back.","Greeting someone who has returned.",[["Polite","お帰りなさい。","おかえりなさい。","okaerinasai."],["Casual","おかえり。","おかえり。","okaeri."],["Friendly","おかえり、待ってたよ。","おかえり、まってたよ。","okaeri, matteta yo."]]],
        ["everyday-022","Everyday","Be careful.","Warning someone before they leave or act.",[["Polite","お気をつけください。","おきをつけ ください。","oki o tsuke kudasai."],["Casual","気をつけて。","きをつけて。","ki o tsukete."],["Friendly","気をつけて帰ってね。","きをつけて かえってね。","ki o tsukete kaette ne."]]],
        ["everyday-023","Everyday","Take your time.","Telling someone there is no need to hurry.",[["Polite","ごゆっくりどうぞ。","ごゆっくり どうぞ。","goyukkuri douzo."],["Casual","ゆっくりでいいよ。","ゆっくりで いいよ。","yukkuri de ii yo."],["Soft","急がなくて大丈夫だよ。","いそがなくて だいじょうぶだよ。","isoganakute daijoubu da yo."]]],
        ["everyday-024","Everyday","I'm lost.","Explaining that you cannot find your way.",[["Polite","道に迷いました。","みちに まよいました。","michi ni mayoimashita."],["Casual","迷った。","まよった。","mayotta."],["SNS","完全に迷子。","かんぜんに まいご。","kanzen ni maigo."]]],
        ["everyday-025","Everyday","I need a break.","Pausing after effort or concentration.",[["Polite","少し休憩したいです。","すこし きゅうけいしたいです。","sukoshi kyuukei shitai desu."],["Casual","ちょっと休みたい。","ちょっと やすみたい。","chotto yasumitai."],["Blunt","休憩しないと無理。","きゅうけいしないと むり。","kyuukei shinai to muri."]]],
        ["everyday-026","Everyday","It smells good.","Reacting to food being prepared.",[["Polite","いい香りですね。","いい かおりですね。","ii kaori desu ne."],["Casual","いい匂い。","いい におい。","ii nioi."],["Friendly","おいしそうな匂い！","おいしそうな におい！","oishisou na nioi!"]]],
        ["everyday-027","Everyday","I'm almost there.","Updating someone who is waiting.",[["Polite","もうすぐ着きます。","もうすぐ つきます。","mou sugu tsukimasu."],["Casual","もうすぐ着く。","もうすぐ つく。","mou sugu tsuku."],["SNS","あとちょっとで着く！","あと ちょっとで つく！","ato chotto de tsuku!"]]],
        ["friendship-009","Friendship","Are you free?","Inviting a friend to make plans.",[["Polite","お時間ありますか？","おじかん ありますか？","ojikan arimasu ka?"],["Casual","暇？","ひま？","hima?"],["Friendly","今度時間ある？","こんど じかん ある？","kondo jikan aru?"]]],
        ["friendship-010","Friendship","Let's hang out.","Suggesting time together.",[["Polite","今度一緒に出かけませんか？","こんど いっしょに でかけませんか？","kondo issho ni dekakemasen ka?"],["Casual","今度遊ぼう。","こんど あそぼう。","kondo asobou."],["Friendly","また近いうちに遊ぼうね。","また ちかいうちに あそぼうね。","mata chikai uchi ni asobou ne."]]],
        ["friendship-011","Friendship","I'm proud of you.","Praising a friend's achievement.",[["Polite","本当にすごいと思います。","ほんとうに すごいと おもいます。","hontou ni sugoi to omoimasu."],["Friendly","本当にすごいよ。","ほんとうに すごいよ。","hontou ni sugoi yo."],["Dramatic","さすがすぎる！","さすがすぎる！","sasuga sugiru!"]]],
        ["friendship-012","Friendship","Cheer up.","Supporting a discouraged friend.",[["Polite","元気を出してください。","げんきを だして ください。","genki o dashite kudasai."],["Soft","無理しなくていいよ。","むりしなくて いいよ。","muri shinakute ii yo."],["Friendly","いつでも話聞くよ。","いつでも はなし きくよ。","itsu demo hanashi kiku yo."]]],
        ["friendship-013","Friendship","Good luck.","Encouraging someone before a challenge.",[["Polite","応援しています。","おうえんしています。","ouen shite imasu."],["Casual","頑張って！","がんばって！","ganbatte!"],["Friendly","絶対大丈夫！","ぜったい だいじょうぶ！","zettai daijoubu!"]]],
        ["friendship-014","Friendship","That suits you.","Complimenting clothes or a hairstyle.",[["Polite","とてもお似合いです。","とても おにあいです。","totemo oniai desu."],["Casual","似合ってる。","にあってる。","niatteru."],["Gyaru","めっちゃ似合ってる！","めっちゃ にあってる！","meccha niatteru!"]]],
        ["friendship-015","Friendship","Tell me everything.","A friend has interesting news.",[["Polite","詳しく聞かせてください。","くわしく きかせて ください。","kuwashiku kikasete kudasai."],["Casual","全部聞かせて。","ぜんぶ きかせて。","zenbu kikasete."],["SNS","詳しく！","くわしく！","kuwashiku!"]]],
        ["friendship-016","Friendship","I'm on your side.","Supporting a friend during conflict.",[["Polite","あなたの味方です。","あなたの みかたです。","anata no mikata desu."],["Friendly","私は味方だよ。","わたしは みかただよ。","watashi wa mikata da yo."],["Soft","一人じゃないよ。","ひとりじゃないよ。","hitori janai yo."]]],
        ["friendship-017","Friendship","Keep it a secret.","Sharing something private.",[["Polite","内緒にしてください。","ないしょに して ください。","naisho ni shite kudasai."],["Casual","誰にも言わないで。","だれにも いわないで。","dare ni mo iwanaide."],["Cute","二人だけの秘密ね。","ふたりだけの ひみつね。","futari dake no himitsu ne."]]],
        ["friendship-018","Friendship","I agree.","Sharing the same opinion.",[["Polite","私もそう思います。","わたしも そう おもいます。","watashi mo sou omoimasu."],["Casual","私もそう思う。","わたしも そう おもう。","watashi mo sou omou."],["SNS","それな。","それな。","sore na."]]],
        ["friendship-019","Friendship","I disagree.","Giving a different opinion gently.",[["Polite","私は少し違うと思います。","わたしは すこし ちがうと おもいます。","watashi wa sukoshi chigau to omoimasu."],["Casual","私は違うと思う。","わたしは ちがうと おもう。","watashi wa chigau to omou."],["Soft","そういう見方もあるけどね。","そういう みかたも あるけどね。","sou iu mikata mo aru kedo ne."]]],
        ["friendship-020","Friendship","You made my day.","Thanking someone for a happy moment.",[["Polite","おかげで嬉しい一日になりました。","おかげで うれしい いちにちに なりました。","okage de ureshii ichinichi ni narimashita."],["Friendly","おかげで元気出た。","おかげで げんき でた。","okage de genki deta."],["SNS","今日いち嬉しい！","きょういち うれしい！","kyou ichi ureshii!"]]],
        ["workplace-006","Workplace","I'll handle it.","Taking responsibility for a task.",[["Workplace","私が対応いたします。","わたしが たいおう いたします。","watashi ga taiou itashimasu."],["Polite","私が対応します。","わたしが たいおうします。","watashi ga taiou shimasu."],["Casual","私がやるよ。","わたしが やるよ。","watashi ga yaru yo."]]],
        ["workplace-007","Workplace","I need more time.","Discussing a deadline.",[["Workplace","もう少しお時間をいただけますでしょうか。","もう すこし おじかんを いただけますでしょうか。","mou sukoshi ojikan o itadakemasu deshou ka."],["Polite","もう少し時間が必要です。","もう すこし じかんが ひつようです。","mou sukoshi jikan ga hitsuyou desu."],["Soft","今日中は難しそうです。","きょうじゅうは むずかしそうです。","kyoujuu wa muzukashisou desu."]]],
        ["workplace-008","Workplace","Could you explain?","Requesting clarification at work.",[["Workplace","ご説明いただけますでしょうか。","ごせつめい いただけますでしょうか。","gosetsumei itadakemasu deshou ka."],["Polite","説明していただけますか？","せつめいして いただけますか？","setsumei shite itadakemasu ka?"],["Casual","これ、どういうこと？","これ、どういう こと？","kore, dou iu koto?"]]],
        ["workplace-009","Workplace","That's a good idea.","Responding to a proposal.",[["Workplace","とてもよいご提案だと思います。","とても よい ごていあんだと おもいます。","totemo yoi goteian da to omoimasu."],["Polite","いいアイデアですね。","いい あいであですね。","ii aidea desu ne."],["Casual","それ、いいね。","それ、いいね。","sore, ii ne."]]],
        ["workplace-010","Workplace","I made a mistake.","Owning an error professionally.",[["Workplace","私の確認不足でした。","わたしの かくにんぶそくでした。","watashi no kakunin busoku deshita."],["Polite","間違えてしまいました。","まちがえて しまいました。","machigaete shimaimashita."],["Blunt","ごめん、ミスった。","ごめん、みすった。","gomen, misutta."]]],
        ["workplace-011","Workplace","Let's postpone it.","Suggesting a schedule change.",[["Workplace","今回は延期とさせていただければと思います。","こんかいは えんきと させて いただければと おもいます。","konkai wa enki to sasete itadakereba to omoimasu."],["Polite","延期にしませんか？","えんきに しませんか？","enki ni shimasen ka?"],["Casual","また今度にしよう。","また こんどに しよう。","mata kondo ni shiyou."]]],
        ["workplace-012","Workplace","I'll confirm it.","Promising to verify information.",[["Workplace","確認のうえ、ご連絡いたします。","かくにんの うえ、ごれんらく いたします。","kakunin no ue, gorenraku itashimasu."],["Polite","確認しておきます。","かくにんして おきます。","kakunin shite okimasu."],["Casual","確認しとくね。","かくにん しとくね。","kakunin shitoku ne."]]],
        ["workplace-013","Workplace","Please take care of it.","Entrusting a task to someone.",[["Workplace","ご対応のほど、よろしくお願いいたします。","ごたいおうの ほど、よろしく おねがいいたします。","gotaiou no hodo, yoroshiku onegai itashimasu."],["Polite","対応をお願いします。","たいおうを おねがいします。","taiou o onegai shimasu."],["Friendly","これ、お願いしてもいい？","これ、おねがいしても いい？","kore, onegai shite mo ii?"]]],
        ["expressive-006","Expressive","I can't believe it.","Reacting to shocking news.",[["Polite","信じられません。","しんじられません。","shinjiraremasen."],["Casual","信じられない。","しんじられない。","shinjirarenai."],["Dramatic","ありえない！","ありえない！","arienai!"]]],
        ["expressive-007","Expressive","That's hilarious.","Reacting to something very funny.",[["Polite","とても面白いです。","とても おもしろいです。","totemo omoshiroi desu."],["Casual","めっちゃ笑った。","めっちゃ わらった。","meccha waratta."],["SNS","笑い止まらん。","わらい とまらん。","warai tomaran."]]],
        ["expressive-008","Expressive","That's scary.","Reacting to something frightening.",[["Polite","ちょっと怖いです。","ちょっと こわいです。","chotto kowai desu."],["Casual","怖い。","こわい。","kowai."],["Dramatic","怖すぎて無理！","こわすぎて むり！","kowa sugite muri!"]]],
        ["expressive-009","Expressive","I'm embarrassed.","Reacting after awkward attention.",[["Polite","少し恥ずかしいです。","すこし はずかしいです。","sukoshi hazukashii desu."],["Casual","恥ずかしい。","はずかしい。","hazukashii."],["Cute","もう、恥ずかしいって！","もう、はずかしいって！","mou, hazukashii tte!"]]],
        ["expressive-010","Expressive","I'm jealous.","Admitting lighthearted envy.",[["Polite","少しうらやましいです。","すこし うらやましいです。","sukoshi urayamashii desu."],["Casual","うらやましい！","うらやましい！","urayamashii!"],["Gyaru","え、ずるい！","え、ずるい！","e, zurui!"]]],
        ["expressive-011","Expressive","I'm disappointed.","Reacting when hopes were not met.",[["Polite","少し残念です。","すこし ざんねんです。","sukoshi zannen desu."],["Casual","残念。","ざんねん。","zannen."],["Dramatic","期待してたのに！","きたいしてたのに！","kitai shiteta noni!"]]],
        ["expressive-012","Expressive","I'm confused.","Reacting when something makes no sense.",[["Polite","少し混乱しています。","すこし こんらんしています。","sukoshi konran shite imasu."],["Casual","よくわからない。","よく わからない。","yoku wakaranai."],["SNS","頭が追いつかない。","あたまが おいつかない。","atama ga oitsukanai."]]],
        ["expressive-013","Expressive","I'm impressed.","Reacting to skill or quality.",[["Polite","素晴らしいですね。","すばらしいですね。","subarashii desu ne."],["Casual","すごいね。","すごいね。","sugoi ne."],["Dramatic","レベルが違う！","れべるが ちがう！","reberu ga chigau!"]]],
        ["expressive-014","Expressive","I'm frustrated.","Struggling with something that will not work.",[["Polite","なかなかうまくいきません。","なかなか うまく いきません。","nakanaka umaku ikimasen."],["Casual","全然うまくいかない。","ぜんぜん うまく いかない。","zenzen umaku ikanai."],["Blunt","もう嫌だ。","もう いやだ。","mou iya da."]]],
        ["expressive-015","Expressive","I did it!","Celebrating a success.",[["Polite","できました！","できました！","dekimashita!"],["Casual","できた！","できた！","dekita!"],["Dramatic","やったー！","やったー！","yattaa!"]]]
    ];
    window.ONE_LINE_MANY_PERSONALITIES_DATA.push(...additions.map(([suffix, category, coreMeaning, situation, rows]) => ({ id:`personality-v2-${suffix}`, category, coreMeaning, situation, variants:makeVariants(coreMeaning, rows) })));
})();
