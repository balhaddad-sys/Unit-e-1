# World Flags Reference

`worldFlags` is the sparse key/value bag in `GameState` that drives narrative branching.

When you set a flag in any data file, **document it here** so other contributors can reference it.

---

## Naming convention

Format: `<scope>_<descriptor>`. Snake_case. Lowercase. Specific.

✅ `p3_self_built` — clear scope (prologue scene 3) and meaning
✅ `khalid_kickback` — clear NPC + event
❌ `flag1` — meaningless
❌ `bu_khalid_was_offered_a_kickback_in_act_two` — too long, restructure

---

## Currently set flags

### Prologue

| Flag | Set when | Effect |
|------|---------|--------|
| `p1_honest` | Player chose "أنا اللي ما عرفت روحي" at airport | Honorable lean |
| `p1_polite` | Player chose "تعبتك يا عمي" at airport | Diplomatic lean |
| `p1_quiet` | Player chose silent hug at airport | Loyal lean |
| `p2_regret` | Player apologized to father | Loyal lean |
| `p2_promise` | Player promised never to leave again | Loyal lean |
| `p2_silent` | Player drank the cup in silence | Honorable lean — gates Act 1 "by_father_legacy" branch |
| `p3_self_built` | Player decided to build their own name | Calculating lean — variant intro for Act 1 |
| `p3_father_first` | Player decided to honor father's name | Loyal lean — variant intro for Act 1 |
| `p3_open` | Player chose "I don't know yet" | Diplomatic lean — variant intro for Act 1 |

### Act 1

| Flag | Set when | Effect |
|------|---------|--------|
| `act1_by_service` | Branch: known by service | Closing variant + Act 2 intro variant (planned) |
| `act1_by_charm` | Branch: known by charm | — |
| `act1_by_family` | Branch: known by family name | — |
| `act1_by_force` | Branch: known by force | Act 1 closing variant (father's quiet warning) |
| `act1_by_silence` | Branch: known by silence (requires Calculating) | Act 1 closing variant (Bu Khalid reveals your father did the same) |
| `act1_father_through_me` | Branch: family-name route (requires p2_silent) | Gates Act 3 "ask_father" branch + Act 4 "use_father_name" branch |

### Act 3

| Flag | Set when | Effect |
|------|---------|--------|
| `tribal_son` | Chose desert in Act 3 branch | Faction shift, ending pool narrows |
| `city_aligned` | Chose city in Act 3 branch | Faction shift |
| `split_loyalty` | Tried to attend both | Both factions cool slightly |
| `ducked` | Avoided both | Both factions remember |
| `refused_choice` | (Honorable only) Called both and refused | Highest respect both sides |

### Act 4

| Flag | Set when | Effect |
|------|---------|--------|
| `true_mediator` | Chose true mediation | Honorable trait + Act 5 ending pool |
| `tilted_mediation` | Accepted bribe in mediation | Compromised trait + closing variant |
| `bribed_someone` | (any source) Accepted dirty money | Used by reflection eligibility |

### Special / runtime

| Flag | Set when | Effect |
|------|---------|--------|
| `rockBottom` | Stats fall below threshold (engine-set) | Triggers rock-bottom reflection |
| `lastReflectionDay` | Reflection fires (engine-set, numeric) | Prevents same-day duplicate |
| `recentReflections` | (string array) | Selector avoids repeats |

---

## Adding a new flag

1. Choose a name following the convention above.
2. Set it via `dispatch({ type: "SET_FLAG", key: "your_flag", value: true })` or via a branch's `worldFlag` field.
3. Read it via `hasFlag(state, "your_flag")` from `lib/engine/initialState`.
4. **Add a row to this document.**

---

## Avoid

- **Boolean inflation** — don't make 10 flags when 3 + a number would do.
- **Hidden side effects** — if setting a flag changes something downstream, document it.
- **Unconditional branching** — every flag-checked branch should have a sensible default for players without the flag.
