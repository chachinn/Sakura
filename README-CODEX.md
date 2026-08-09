# Sakura Avatar Assets — Codex Integration

## Production contract

Every production PNG in this pack is:

- exactly **512 × 768 px**
- **RGBA PNG**
- on a transparent canvas
- registered to the same `(0, 0)` origin
- intended to be rendered without per-file x/y offsets

This pack was reconstructed from the supplied Sakura avatar reference atlas.
It is structurally aligned for a layer-based avatar renderer. Because the source
was a flattened reference/contact sheet rather than original high-resolution
master layers, some edge softness or raster artifacts can remain when heavily
zoomed.

## Layer order

Bottom → top:

1. `hair-back`
2. `body`
3. `expressions`
4. `eyes`
5. `outfits`
6. `hair-front`
7. `accessories`

Expressions `happy`, `wink`, and `laugh` set `suppressEyes: true` in the manifest.
When one of those is selected, hide the separate eyes layer.

## Rendering

All layers use the exact same element box:

```css
.sakura-avatar {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
}

.sakura-avatar__layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
```

Do **not** crop the PNGs at runtime.
Do **not** calculate individual coordinates.
Do **not** scale individual categories differently.

The PNG itself contains the registration spacing.

## Hair paths

Use the manifest patterns:

```text
hair-back/{style}/{color}.png
hair-front/{style}/{color}.png
```

Styles:

- long
- twin_tails
- ponytail
- bob
- shoulder_length
- bun

Colors:

- brown
- black
- dark_brown
- blonde
- pink
- lavender
- blue
- white_silver

## Important reference limitation

The reference design itself has a small sakura flower baked into many
`hair-front` images. Therefore `accessories/sakura_clip.png` can appear as an
additional/larger flower if selected.

## Default configuration

```json
{
  "body": "light",
  "eyes": "pink",
  "expression": "neutral",
  "hairStyle": "long",
  "hairColor": "brown",
  "outfit": "sakura_casual",
  "accessory": "none"
}
```

## Codex acceptance checks

Before changing application code, verify:

1. Every PNG is 512 × 768.
2. Every PNG is RGBA.
3. Every PNG has transparent pixels.
4. Load all selected layers at `(0, 0)`.
5. No production asset needs registration metadata.
6. Switching hair style must swap both hair-back and hair-front.
7. Switching hair color must use the same color for both hair layers.
8. `suppressEyes=true` expressions must hide the separate eye layer.
