# Money Machine experience redesign

This update preserves React, Vite, HashRouter, the existing people directory, public profiles, saved profiles, and local invitation drafts. The root now shows a public landing page with creator and business entry points.

## Scope

- Shared responsive workspace, light navy/teal palette, text-led navigation, fewer decorative icons.
- Creator and business overviews; collaboration filters/details; sample agreements and financial source inspection; message draft UI; profile and settings pages.
- Business affiliate programs: create/edit and pause/activate local demo programs, view sample activity. Data is versioned in browser storage, with an in-memory fallback notice when storage fails. New programs start with zero activity.
- Role-specific income/spending. Business sample totals: agreed INR 78,000; invoiced INR 48,000; recorded paid INR 18,000; pending invoices INR 30,000; uninvoiced commitments INR 30,000. Creator view contains Maya's record only. Recorded payment is explicitly manual and unverified.
- Badge cards describe criteria and distinguish earned demo badges from unearned badges. They are not identity, quality, or payment verification.
- Web app manifest, generated app icons, native installation prompt where available, iOS/Android instructions otherwise. Service worker provides an offline explanation; it does not cache financial records or claim a fully offline app.
- Entrance transitions and hover/focus feedback respect reduced-motion settings. Page scrollbars are hidden; normal scrolling remains available.

## Limits

No backend, authentication, actual messages, affiliate attribution, payouts, escrow, payment verification, or signing is implemented. Everything is clearly a UI demo. Existing requests remain local drafts. The Developer Specification PDF and reference videos were not supplied; this follows the written requirements and seven images.

## Validation

Production Vite build passes. Browser checks covered desktop homepage and workspace, affiliate program creation and reload persistence, creator search, financial provenance dialog, and 390px iframe layouts with a working mobile menu. Native installation on a physical iOS/Android device remains unverified; it requires HTTPS and a supporting browser. No automated mobile device emulation was available.

## Asset

Landing-page illustrative photograph: https://images.unsplash.com/photo-1542038784456-1ea8e935640e (downloaded, resized, and encoded as WebP). The person pictured is not represented as a customer, testimonial, or a real platform profile.
