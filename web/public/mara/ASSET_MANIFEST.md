# Mara Vera — Canonical Web Asset Manifest

Status: **AUTHORITATIVE FOR THE PUBLIC ALPHA WEB DERIVATIVE**

## Runtime asset

Path:

`web/public/mara/mara-v1-reference.jpg`

Dimensions:

`1024 × 1536`

Expected Git blob SHA-1:

`1c4c4d3615eac915cf42efd9416ed20479eb8126`

Introduced by commit:

`257fa744ff62b3926cdcf27d6ae8941f3008d01a`

Commit message:

`launch: add canonical Mara image to public web`

The runtime component uses this file by default through:

`/mara/mara-v1-reference.jpg`

## Canonical source reference

The founder-approved source image is registered in Foundation at:

`docs/character/canonical-visual-reference.md`

Source-generation fingerprint:

- generation ID: `deb9733e-63aa-4068-a38a-090bc2c30bc9`
- source filename: `mujer_elegante_en_terraza_moderna.png`
- dimensions: `1024 × 1536`
- source PNG SHA-256: `b931964b5317460e02ce7ebc77f2182d81a101bdcc4b451377fdf6033204143c`

The web JPG is the committed launch derivative used by the application. This manifest does **not** claim byte identity between the JPG derivative and the PNG source; different image encodings necessarily have different binary fingerprints.

## Integrity rule

The Web Launch CI and one-shot production deploy gate must fail if:

`git hash-object public/mara/mara-v1-reference.jpg`

differs from:

`1c4c4d3615eac915cf42efd9416ed20479eb8126`

This prevents a visually different woman from being silently substituted while leaving the same filename in place.

Changing this expected blob hash requires an explicit canonical-asset decision, not a routine visual refresh.

Permanent rule:

> **THIS WOMAN IS MARA.**

> **ONE MARA. MANY CONTEXTS.**
