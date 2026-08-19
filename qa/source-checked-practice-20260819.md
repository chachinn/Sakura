# Sakura Source-Checked Practice — QA / Source Record

Date: 2026-08-19

## Purpose

Add real-life Practice content without presenting invented or unsourced lesson objectives as authoritative Japanese-learning material.

## Authoritative grounding used

1. Japan Foundation, **Irodori: Japanese for Life in Japan — Starter (A1)**
   - https://www.irodori.jpf.go.jp/en/starter/pdf.html
2. Japan Foundation, **Irodori: Japanese for Life in Japan — Elementary 1 (A2)**
   - https://www.irodori.jpf.go.jp/en/elementary01/pdf.html
3. Japan Foundation, **Marugoto — Can-do / communication-oriented approach**
   - https://marugoto.jpf.go.jp/en/about/marugoto/

## Content policy for this pack

- Sakura does **not** copy Irodori dialogue or textbook exercises into the app.
- Sakura authors its own short practice scenario, answer choices, romaji, English gloss, and explanation.
- Each question is anchored to an official Irodori lesson topic / communication objective and stores the official source page plus lesson reference.
- The UI displays the source after the learner answers.
- “Source-checked” therefore means the **communication objective is grounded in the cited official material**; it does not mean the Sakura wording is an official Japan Foundation quotation.

## Initial pack coverage

30 drills total:

### Starter A1 — 16 drills
- Lesson 2 — misunderstanding / repetition
- Lesson 3 — self-introduction
- Lesson 6 — ordering food
- Lesson 10 — borrowing / requesting permission
- Lesson 12 — invitations / soft refusal
- Lesson 13 — bus / transportation questions
- Lesson 15 — finding items in stores
- Lesson 16 — asking prices

### Elementary 1 A2 — 14 drills
- Lesson 6 — asking / giving directions
- Lesson 7 — being late / communicating delay
- Lesson 9 — asking how to read / what something means
- Lesson 13 — workplace status / estimated completion time
- Lesson 14 — asking for leave / leaving early
- Lesson 15 — describing symptoms / duration
- Lesson 18 — suggesting and agreeing on gifts

## UI / behavior checks

- New Practice card is injected without changing Sakura's core route table.
- Existing Practice activities remain available if the source pack fails to load.
- Level filter: All / Starter A1 / Elementary 1 A2.
- Category filter is generated from the actual dataset.
- Sessions randomize and avoid repeating the previous session's first card when possible.
- Session length is 10 or the full filtered pool when fewer than 10 are available.
- Romaji is optional before answering.
- Correct answer, kana, romaji, English gloss, explanation, lesson reference, and official source link appear after answering.
- No external source content is fetched at runtime; the exercises remain usable offline after Sakura's PWA cache is updated.

## PWA delivery

- Added `features/sakura-source-practice.js?v=1` to the app shell.
- Added `data/practice-source-checked.js?v=1` to the app shell.
- Added both paths to the network-no-cache bypass list.
- Shell cache bumped from `sakura-shell-v159` to `sakura-shell-v160`.

## Follow-up QA target

Manual iPhone acceptance test after GitHub Pages publishes:
1. Open Practice.
2. Confirm **Source-Checked Real Life** appears at the top.
3. Open it and confirm 30 drills are reported with All filters.
4. Switch between Starter A1 and Elementary 1 A2.
5. Start a session; verify question 1 is randomized on reopening.
6. Toggle romaji.
7. Answer correctly and incorrectly; verify correct-answer marking and source panel.
8. Open the official Irodori source link.
9. Complete a 10-question session and confirm score/result.
10. Reopen Sakura offline and confirm the pack can load from the PWA cache.
