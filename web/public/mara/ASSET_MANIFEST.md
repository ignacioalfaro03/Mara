# Mara Vera — Canonical Web Asset Manifest

Status: **AUTHORITATIVE FOR THE CREATOR ALPHA VISUAL IDENTITY**

Canonical decision date: **2026-09-10**

## Founder-approved source

The founder explicitly supplied the new Mara visual reference and confirmed: **“Así es Mara.”**

The source is an intact JPEG reference card containing Mara's photo plus a measurement/canon panel.

Source fingerprint:

- dimensions: `1024 × 1536`
- JPEG structure: valid SOI/EOI
- source SHA-256: `15c2bfed61b407bd4e0c3a5ab8a7c5c2d3440f0b48390dc85a377ac290ba6b65`
- approval date: `2026-09-10`

This source is the identity anchor. It confirms the existing textual canon: fictional adult woman, age 24; blonde; green/hazel eyes; Chilean/Latina visual read; curvy/realistic body; natural, sexy, casual styling.

## Runtime derivative

Public runtime path:

`web/public/mara/mara-v2-reference.webp`

Runtime fingerprint:

- dimensions: `384 × 576`
- format: `WebP (lossy)`
- expected Git blob SHA-1: `2e96dd45fbd2fdeaf1a060ab57da6b8de916bf98`
- expected SHA-256: `b4db8bb2c0cb5e0be811bb18982973ec9219f6f1943313630799793387003a1e`

The runtime asset is a deterministic technical derivative of the founder-approved source, not a regenerated woman. Derivation used for this Alpha asset:

1. crop the photographic left side of the reference card at source coordinates `(0, 0) → (660, 990)`;
2. preserve the `2:3` portrait aspect ratio;
3. resize to `384 × 576` using Lanczos resampling;
4. encode to WebP quality `60`, method `6`.

The crop intentionally removes the black measurement panel from the public hero while preserving Mara's approved face, hair, body and scene. A future higher-resolution derivative may replace this file without changing identity, but it must be generated from the same approved source or receive a new explicit founder canonical decision.

## Legacy V1

`web/public/mara/mara-v1-reference.jpg` is **DEPRECATED AND MUST NOT BE SERVED AS THE CANONICAL RUNTIME ASSET**.

Its historical Git blob is:

`1c4c4d3615eac915cf42efd9416ed20479eb8126`

The file is physically truncated and lacks a valid JPEG EOI marker. It is retained only as forensic/history evidence. Do not repair it by appending bytes and do not use its legacy blob lock as proof of visual integrity.

## Integrity rule

The Web Launch CI must fail unless all of the following are true:

1. `mara-v2-reference.webp` exists and is non-empty;
2. its Git blob equals `2e96dd45fbd2fdeaf1a060ab57da6b8de916bf98`;
3. its SHA-256 equals `b4db8bb2c0cb5e0be811bb18982973ec9219f6f1943313630799793387003a1e`;
4. it has a valid RIFF/WEBP/VP8 signature;
5. its natural dimensions are `384 × 576`;
6. the Mara runtime component points to `/mara/mara-v2-reference.webp` and never falls back to the corrupt V1 file.

Changing these fingerprints is a canonical-asset decision, not a routine visual refresh.

Permanent rules:

> **THIS WOMAN IS MARA.**

> **ONE MARA. MANY CONTEXTS.**

> **IDENTITY SOURCE > RUNTIME ENCODING.**
