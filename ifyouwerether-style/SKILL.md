---
name: ifyouwerether-style
description: Recreate the "If You Were There" (@ifyouwerether) YouTube documentary style — low-poly 3D dioramas, second-person "you are there" narration, game-style status callouts, ~8–13 min. Encodes the full 7-step production pipeline (Setup → Script → Voice → Style → Fix → Render → Upload) as revealed in the creator's own tutorial video. Use for writing scripts, planning scene lists, generating a full video pipeline for any historical disaster or event, and running the skill-fix loop.
---

# If You Were There — style recreation

This skill reverse-engineers the @ifyouwerether channel (based on
"What If You Worked at Chernobyl in 1986?", "What If You Were 15 in
Hiroshima?", and the creator's own tutorial video) and encodes it so a
model can mechanically produce a new episode in the same style. Follow it
exactly — do not improvise the structure, the palette, or the narration voice.

## The core insight

The creator's workflow is **code-driven, not diffusion-driven**. Every
episode is a **Three.js scene rendered by FFmpeg** from a script written
by Claude Code. The skill is the single source of truth — it is edited
once, and every future video inherits the fix. This is the "fix the
skill, not the scene" loop:

> "The fight is too flat. Fix it in the skill."
> → `Edit skills/diorama/SKILL.md + low, more sky light`
> → re-render the test → the skill carries what matters.

The skill is versioned (v12 → v13 → v14) and every future video built on
the same skill inherits the fix automatically.

## What this style is

A mid-length (~8–13 min) YouTube documentary that places the **viewer** inside
a historical disaster or event. Every scene is a **low-poly 3D diorama** —
like a stylized game engine render — with small simple characters, a muted
palette, and a fixed camera. The narration is **second person, present tense**:
"you", "your house", "your street". The events unfold as a **chronological
timeline**, and game-style **status callouts** appear on screen as the
narrator's facts are spoken (e.g. "YOUR HOUSE STILL STANDING", "8:15 / ONE
MINUTE OF SILENCE").

The channel's core device: **"What if you were [role] in [event]?"** — the
viewer is placed in the scene, and the video walks them through what they
would see, feel, and survive.

## Style spec (do not deviate)

### Visual

- **Render style**: low-poly 3D, flat-shaded, minimal textures, simple
  geometry. Characters are small, simple, with minimal or no facial detail.
  No photorealism, no cartoon exaggeration, no bright colors.
- **Palette**: muted, desaturated. Browns, grays, muted greens, muted blues,
  muted reds, near-black. No saturated colors, no pastels, no neon.
- **Lighting**: dark, moody, overcast. Flat lighting, no dramatic shadows, no
  bright highlights. A soft vignette (dark edges) is acceptable.
- **Camera**: fixed or slow. Wide shots to show scale, medium shots to show
  the "you" figure. No fast pans, no zooms, no shake, no handheld. Camera
  moves are slow push-in or slow drift only. Numbers are specified explicitly
  (e.g. "high angle", "24mm lens", "slow push-in") — write them as numbers
  in the skill, not as vibes.
- **Composition**: dioramas sit on a flat ground plane. Characters are small
  relative to the environment — the environment is the subject.
- **Text overlays**: small caps, sans-serif, positioned in a corner with a
  light background box. Read like a game status UI. Examples:
  - "YOUR HOUSE STILL STANDING" (with a green checkmark)
  - "WALL STOPPED THE GLASS"
  - "PRESERVED AS A RUIN" / "KEEP STANDING, NOT REBUILT"
  - "8:15" / "ONE MINUTE OF SILENCE"
  - "THE EMPEROR'S VOICE — FIRST EVER BROADCAST SIGNAL"
  - "Peace Memorial City" / "1951" / "boulevard 100m wide"

### Narration

- **Second person**: "you", "your", "your house", "your street".
- **Present tense**: "It is 8:15 AM.", "The wall stopped the glass."
- **Calm, somber, documentary voice**: short sentences, no jargon, no hype,
  no exclamations. Facts woven in naturally ("20 meters", "100 meters",
  "8:15").
- **Show, don't tell.** Characters come from the context, not from
  description — the viewer is one of them, not a spectator being told.
- **Never**: "imagine", "picture this", "let's", rhetorical hype, clickbait,
  or a listicle tone. The viewer is *in* the scene, not being asked to imagine
  it.

### Structure

Each episode follows this beat order, roughly 8–13 minutes total:

1. **Hook** (0–15s): a question. "What if you were [role] in [event]?"
   Followed immediately by one concrete sensory detail to anchor the viewer.
2. **Premise** (15–30s): name the story they're entering. Where, when, who.
3. **Context** (30–60s): the minimum frame needed to follow the stakes —
   what the world was like, what the threat was, what the viewer's role is.
4. **Timeline** (60–90%): the event unfolds in chronological order. Each
   beat is a scene: a diorama, a camera angle, a narration paragraph, and a
   status callout. Escalate: normal → warning → crisis → survival → aftermath.
5. **Aftermath/epilogue** (last 10%): what happened to the viewer, the
   survivors, the place. End with a status callout (e.g. "PRESERVED AS A
   RUIN").

### Audio

- **Music**: calm ambient, low, no drums, no build. Sits under the voice.
- **Voiceover**: AI TTS, calm and even. A single voice, no characters, no
  dialogue reenactment.

## Production pipeline (7 steps, in order)

Each step produces a concrete artifact before the next begins. Do not skip.

### Step 01 — Setup

Create the project folder structure:

```
<project>/
  videos/
    <episode-slug>/
      finished/
      engines/
      skills/          # ← the SKILL.md that defines this episode's look
      notes.txt        # ← timestamped observations for the fix loop
      script.md        # ← the VO script (Step 02)
      scenes.csv       # ← the scene list (Step 03)
  audio/               # my_score.wav, rain_ambience.wav, etc.
```

### Step 02 — Script

Write `script.md` using the narration voice. Every paragraph must be
second person, present tense, and ≤ 3 sentences. Organize it into the five
beats above. Insert a `[CALLOUT: ...]` marker at the exact point where a
status callout appears on screen.

Example paragraph:

> It is 8:15 AM. You are standing on your street, two kilometers from the
> center. The air is still. The sound arrives before the light does.
> [CALLOUT: 8:15]

Choose granularity: **"Least work"** (whole episode as one script) or
**"Scene by scene"** (one scene per beat). Scene-by-scene is required for
this style — it is what makes the fix loop possible.

### Step 03 — Scene list

Write `scenes.csv` with one row per scene. Columns:

`scene_id, beat, duration_sec, camera, diorama, narration, callout`

- `camera`: one of `wide`, `medium`, `close`, `overhead`.
- `diorama`: a short description of the scene, in plain English, that an
  image generator can be prompted with.
- `callout`: the exact text of the status callout, or empty.

Target 20–40 scenes for a 10-minute episode.

### Step 04 — Voice

Feed the narration paragraphs to a TTS model with a calm, even, documentary
tone. Options the creator uses: **ElevenLabs, Fish Audio, Cartesia, Google
TTS, MS Playground**. Do not use character voices, do not reenact dialogue,
do not add exclamations. Output one audio file per scene.

### Step 05 — Style

Write `skills/<episode-slug>/SKILL.md` with **explicit numbers**, not vibes:

```
# Camera
- angle: high
- lens: 24mm
- movement: slow push-in

# Storytelling
- Show, don't tell.
- Characters come from the context, not from description.
- The viewer is in the scene, not watching it.
```

Then generate a visual per scene. For each scene, use this prompt template.
Fill in the brackets with the scene's diorama description and a specific detail.

```
low-poly 3D diorama, flat-shaded, minimal textures, muted desaturated palette
(browns, grays, muted greens, muted blues), dark moody overcast lighting, soft
vignette, small simple characters with minimal facial detail, no photorealism,
no cartoon exaggeration, [DIORAMA DESCRIPTION], [CAMERA ANGLE], fixed camera,
16:9
```

Then, if a video tool is available, animate each still into a 3–5 second clip
with a slow pan or slow push-in. If no video tool is available, use the stills
with a slow crossfade — the style tolerates stills.

### Step 06 — Fix (the fix loop)

This is the most important step. Run it before the final render:

1. Render a **20-second test** first: `node render.js --length 0:20`.
2. Watch the test. Write timestamped notes (`notes.txt`), e.g.:
   - `1:38 tag covers his face`
   - `2:04 light is too flat`
3. **Fix the skill, not the scene.** Edit `skills/<episode-slug>/SKILL.md`
   with a declarative change:
   ```
   Edit skills/diorama/SKILL.md + low, more sky light
   ```
   → re-render the test → the skill carries what matters.
4. The skill is versioned (v12 → v13). Every future video built on the same
   skill inherits the fix.
5. Repeat until the test is clean. Only then render the full episode.

The creator logged **152 notes** on the first review — expect many notes.
Do not skip the fix loop to save time.

### Step 07 — Render

Render the full episode from the scene list. The creator renders each scene
as a separate file (`c_001` … `c_008`) and assembles them:

```
node render.js --all --quality max
```

- Each scene renders as a separate clip (`c_001.mp4`, `c_002.mp4`, …).
- Assemble the clips in order with FFmpeg.
- Add the callout text over each scene as a small-caps box in a corner
  (e.g. bottom-left) with a light background.
- Add the voiceover audio per scene, then the music track under the
  voiceover.
- Export 16:9, 1080p.

### Step 08 — Upload

Generate the thumbnail with an image model (the creator uses Google Flow).
The thumbnail should be one diorama frame that matches the style — a
low-poly, muted, overcast still with a small figure in the scene.

## Checklist before publishing

- [ ] The hook is a second-person question.
- [ ] Every narration paragraph is second person, present tense, ≤ 3 sentences.
- [ ] Every scene has a diorama, a camera, a narration paragraph, and a
      callout (or empty).
- [ ] Every visual is low-poly 3D, muted palette, overcast lighting.
- [ ] Every callout is small caps, in a corner, with a light background box.
- [ ] The music is one calm ambient track, no drums, no build.
- [ ] The voiceover is one calm voice, no characters, no dialogue reenactment.
- [ ] The 20-second test was run and reviewed before the final render.
- [ ] Style fixes were applied to `SKILL.md`, not to individual scenes.
- [ ] The episode ends with a status callout.
- [ ] The thumbnail is one diorama frame matching the style.
