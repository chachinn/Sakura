/*
    Reusable Sakura Kanji content loader.
    Startup restores the levels needed by the saved global and Kanji-section
    preferences; other levels load on demand through the same public API.
*/
(function initializeSakuraKanjiLoader() {
    if (window.SakuraKanjiLoader) return;

    const levels = Object.freeze(["N5", "N4", "N3", "N2", "N1"]);
    const files = Object.freeze({
        N5: "./data/kanji/n5.json",
        N4: "./data/kanji/n4.json",
        N3: "./data/kanji/n3.json",
        N2: "./data/kanji/n2.json",
        N1: "./data/kanji/n1.json"
    });
    const loadedByLevel = new Map();
    const inFlightByLevel = new Map();

    function requireLevel(level) {
        if (!levels.includes(level)) throw new Error(`Invalid JLPT level ${JSON.stringify(level)}. Expected N5, N4, N3, N2, or N1.`);
        return level;
    }

    function loadKanjiLevel(level) {
        const validLevel = requireLevel(level);
        if (loadedByLevel.has(validLevel)) return Promise.resolve(loadedByLevel.get(validLevel));
        if (inFlightByLevel.has(validLevel)) return inFlightByLevel.get(validLevel);

        const fetchRequest = (async () => {
            const file = files[validLevel];
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Could not load ${file} (HTTP ${response.status}).`);
            const records = await response.json();
            if (!Array.isArray(records)) throw new Error(`${file} must contain a JSON array.`);
            if (records.some(record => record?.jlpt !== validLevel)) throw new Error(`${file} contains a record outside ${validLevel}.`);
            loadedByLevel.set(validLevel, records);
            return records;
        })();
        const request = fetchRequest
            .catch(error => {
                console.error(`Kanji loader: ${validLevel} could not be loaded.`, error);
                throw error;
            })
            .finally(() => {
                if (inFlightByLevel.get(validLevel) === request) inFlightByLevel.delete(validLevel);
            });
        inFlightByLevel.set(validLevel, request);
        return request;
    }

    async function loadKanjiLevels(requestedLevels) {
        if (!Array.isArray(requestedLevels)) throw new Error("Kanji levels must be provided as an array.");
        const requested = new Set(requestedLevels.map(requireLevel));
        const orderedLevels = levels.filter(level => requested.has(level));
        const groups = await Promise.all(orderedLevels.map(loadKanjiLevel));
        return groups.flat();
    }

    function loadAllKanji() {
        return loadKanjiLevels(levels);
    }

    function getLoadedKanji() {
        return levels.flatMap(level => loadedByLevel.get(level) || []);
    }

    function getLoadedKanjiLevels() {
        return levels.filter(level => loadedByLevel.has(level));
    }

    function getStartupKanjiLevels() {
        const required = new Set();
        try {
            const storedGlobal = JSON.parse(localStorage.getItem("chaGlobalJlptLevels") || "null");
            if (Array.isArray(storedGlobal)) storedGlobal.forEach(level => {
                if (levels.includes(level)) required.add(level);
            });

            const storedSections = JSON.parse(localStorage.getItem("chaSectionJlptLevels") || "null");
            ["kanjiOfDay", "randomKanji", "kanjiQuiz"].forEach(sectionName => {
                const setting = storedSections?.[sectionName];
                if (setting?.useGlobal === false && Array.isArray(setting.levels)) setting.levels.forEach(level => {
                    if (levels.includes(level)) required.add(level);
                });
            });
        }
        catch (error) {
            console.warn("Kanji loader: stored JLPT preferences could not be read; using N5.", error);
        }
        if (!required.size) required.add("N5");
        return levels.filter(level => required.has(level));
    }

    window.SakuraKanjiLoader = Object.freeze({
        levels,
        files,
        loadKanjiLevel,
        loadKanjiLevels,
        loadAllKanji,
        getLoadedKanji,
        getLoadedKanjiLevels,
        getStartupKanjiLevels
    });

    window.KANJI_DATA_READY = loadKanjiLevels(getStartupKanjiLevels())
        .then(async records => {
            window.KANJI_DATA = records;
            validateKanjiDataset(records);
            await window.VOCABULARY_DATA_READY;

            if (!document.querySelector("script[data-sakura-app]")) {
                const appScript = document.createElement("script");
                appScript.src = "./app.js?v=58";
                appScript.dataset.sakuraApp = "true";
                appScript.onerror = () => console.error("Sakura could not load app.js.");
                document.body.appendChild(appScript);
            }
            return records;
        })
        .catch(error => {
            console.error("Sakura could not initialize the Kanji dataset.", error);
            throw error;
        });
}());

/*
    Development safeguard for bulk Kanji editing. Validation reports every
    problem it finds but never prevents Sakura from starting.
*/
function validateKanjiDataset(dataset = window.KANJI_DATA) {
    const allowedLevels = new Set(["N5", "N4", "N3", "N2", "N1"]);
    const errors = [];
    const idOwners = new Map();
    const characterOwners = new Map();
    const describe = item => `[${typeof item?.id === "string" && item.id ? item.id : "missing id"} / ${typeof item?.character === "string" && item.character ? item.character : "missing character"}]`;
    const addError = (item, message) => errors.push(`${describe(item)} ${message}`);
    const validWordObject = value => value && typeof value === "object" && !Array.isArray(value);

    if (!Array.isArray(dataset)) {
        console.error("Kanji validation: window.KANJI_DATA must be an array.");
        return { valid: false, errors: ["window.KANJI_DATA must be an array."] };
    }

    dataset.forEach((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            errors.push(`[index ${index}] Kanji record must be an object.`);
            return;
        }

        if (!item.id || typeof item.id !== "string") addError(item, "Missing or invalid id.");
        else if (idOwners.has(item.id)) addError(item, `Duplicate id; first used by ${idOwners.get(item.id)}.`);
        else idOwners.set(item.id, describe(item));

        if (!item.character || typeof item.character !== "string") addError(item, "Missing or invalid character.");
        else if (characterOwners.has(item.character)) addError(item, `Duplicate character; first used by ${characterOwners.get(item.character)}.`);
        else characterOwners.set(item.character, describe(item));

        if (typeof item.id === "string" && item.id && typeof item.character === "string" && item.character) {
            const expectedId = `kanji-${item.character.codePointAt(0).toString(16)}`;
            if (item.id !== expectedId) addError(item, `ID ${JSON.stringify(item.id)} does not match character ${item.character}; expected ${expectedId}.`);
        }

        if (item.type !== "kanji") addError(item, `Incorrect type: expected "kanji", received ${JSON.stringify(item.type)}.`);
        if (!allowedLevels.has(item.jlpt)) addError(item, `Invalid JLPT value ${JSON.stringify(item.jlpt)}; expected N5, N4, N3, N2, or N1.`);
        ["meaning", "reading", "romaji", "exampleSentence", "exampleTranslation", "literalMeaning", "coreConcept", "naturalUsageNotes"].forEach(field => {
            if (typeof item[field] !== "string" || !item[field].trim()) addError(item, `Missing or invalid ${field}.`);
        });

        ["onyomi", "kunyomi"].forEach(field => {
            if (!Array.isArray(item[field])) addError(item, `Missing or invalid ${field} array.`);
            else item[field].forEach((reading, readingIndex) => {
                if (typeof reading !== "string" || !reading.trim()) addError(item, `Invalid ${field}[${readingIndex}] reading.`);
            });
        });

        if (!Array.isArray(item.examples)) addError(item, "Missing or invalid examples array.");
        else item.examples.forEach((example, exampleIndex) => {
            if (!validWordObject(example)) { addError(item, `Invalid examples[${exampleIndex}] object.`); return; }
            if (typeof example.word !== "string" || !example.word.trim()) addError(item, `Missing examples[${exampleIndex}].word.`);
            if (typeof example.reading !== "string" || !example.reading.trim()) addError(item, `Missing examples[${exampleIndex}].reading.`);
            if (typeof example.meaning !== "string" || !example.meaning.trim()) addError(item, `Missing examples[${exampleIndex}].meaning.`);
        });

        if (!Array.isArray(item.commonWords)) addError(item, "Missing or invalid commonWords array.");
        else item.commonWords.forEach((word, wordIndex) => {
            if (!validWordObject(word)) { addError(item, `Invalid commonWords[${wordIndex}] object.`); return; }
            if (typeof word.word !== "string" || !word.word.trim()) addError(item, `Missing commonWords[${wordIndex}].word.`);
            if (typeof word.reading !== "string" || !word.reading.trim()) addError(item, `Missing commonWords[${wordIndex}].reading.`);
            if (typeof word.meaning !== "string" || !word.meaning.trim()) addError(item, `Missing commonWords[${wordIndex}].meaning.`);
        });

    });

    if (errors.length) {
        console.group(`Kanji validation: ${errors.length} problem${errors.length === 1 ? "" : "s"} found.`);
        errors.forEach(error => console.error(error));
        console.groupEnd();
    }
    else console.info(`Kanji validation passed: ${dataset.length} built-in records are valid.`);

    return { valid: errors.length === 0, errors };
}

window.validateKanjiDataset = validateKanjiDataset;
