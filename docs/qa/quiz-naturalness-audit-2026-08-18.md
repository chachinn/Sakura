# Sakura Quiz Naturalness Audit — 2026-08-18

## Scope

Quality audit of the generated JLPT Translation and Particle Quiz examples for N5–N1. The goal is not merely grammatical validity: generated combinations should be plausible, learner-safe Japanese that a native speaker could reasonably encounter or say in the represented situation.

## User-reported trigger

The N5 generator produced:

- `今夜、先輩とカフェでうどんを食べます。`
- `kon'ya, senpai to kafe de udon o tabemasu.`

The reading `kon'ya` was technically correct for `今夜`, but the sentence exposed two quality issues:

1. Everyday-plan examples are better served by `今晩 / konban` in this beginner context.
2. A café + udon combination was grammatically valid but contextually poor.

## Changes made

### N5

- Everyday `今夜 / kon'ya` time tokens are normalized to `今晩 / konban` for these generated plan/activity examples.
- Meal templates use dedicated meal locations (restaurant, dining hall, food court, hotel/station/department-store restaurants) and meal foods.
- Basic daily activity templates no longer randomly attach an unrelated companion to every activity.
- Generic purchase prompts no longer force every item into an arbitrary place.
- Destination pools avoid combinations such as going to school with an arbitrary family member merely because of a cross-product.
- Activity pools and activity places are narrowed toward broadly plausible combinations.

### N4

- Everyday `今夜` tokens are normalized to `今晩` in the affected generated examples.
- Meal templates use meal-compatible places and foods.
- Plan vocabulary is narrowed to plans that remain plausible across today/tomorrow/evening/weekend/next-week time frames.

### N3

- Discussion matrices use dedicated discussion-place, discussion-person, and discussion-topic pools instead of freely mixing all generic people/places/topics.
- Particle prompts using `について` and `に対して` use the same compatibility-aware pools.

### N2

- Formal discussion matrices use work-appropriate topics.
- Work time tokens avoid combinations such as `会議のあと、オンライン会議で…` generated only because both values happened to exist in separate pools.

### N1

- Deliberation matrices use work-appropriate topics and compatible time contexts.
- `と相まって` examples were rewritten so two factors are explicitly present; this avoids standalone generated sentences that felt semantically incomplete even though the grammar pattern was technically valid.

## Guardrails added

- Known implausible meal-place combinations are rejected during materialization.
- Each quiz pool now has a hard quality-count assertion: Sakura must successfully materialize the configured target (minimum 1,200) after filtering. It may not silently advertise 1,200 while returning a smaller pool.
- Particle romaji answer support from the previous update is preserved.
- EN→JP exact stored-romaji answer support from the previous update is preserved.

## Capacity check after restrictions

The compatibility pools still provide more unique candidates than the advertised 1,200 target:

| JLPT | Translation candidate capacity | Particle candidate capacity | Target |
|---|---:|---:|---:|
| N5 | 1,806+ | 1,639+ | 1,200 each |
| N4 | 1,300+ | 1,300+ | 1,200 each |
| N3 | 1,440+ | 1,700+ | 1,200 each |
| N2 | 1,300+ | 1,500+ | 1,200 each |
| N1 | 1,300+ | 1,900+ | 1,200 each |

The runtime assertion is the final fail-safe if future edits reduce these pools.

## Representative before/after

### Before

`今夜、先輩とカフェでうどんを食べます。`

### After style

`今晩、先輩とレストランでうどんを食べます。`

`Konban, senpai to resutoran de udon o tabemasu.`

The goal is not to ban unusual real-life situations; it is to avoid teaching randomly assembled oddities as Sakura's default examples.

## QA status

- Quiz Engine v2.3 syntax checked.
- Unique-pool capacity checked against all five level templates after compatibility restrictions.
- Hard 1,200-target runtime assertion added.
- No changes to scoring history, saved data, authentication, Reading Garden, Travel data, or AI-provider configuration.
