---
name: liquid-glass
description: Design and build UI that follows Apple's Liquid Glass design language (iOS 26 / macOS Tahoe 26 and the other 26-series platforms). Use this skill whenever the user mentions Liquid Glass, glassmorphism, translucent or frosted-glass interfaces, iOS 26 or macOS 26 design, floating toolbars or tab bars, the SwiftUI glassEffect API, or asks for an "Apple-style", "glassy", or "modern iOS" look, even if they don't say "Liquid Glass" explicitly. Covers design principles, where glass should and should not be used, SwiftUI implementation, a CSS/web approximation, accessibility fallbacks, and a review checklist.
---

# Liquid Glass

Liquid Glass is Apple's translucent, dynamic material. It refracts what is behind it, reflects light, and responds to touch by flexing and morphing like a fluid. Content is the star; controls float above it as a distinct functional layer and stay out of the way.

## Workflow

When asked to design or build UI with this look:

1. **Identify the target.** Native Apple platform (SwiftUI/UIKit/AppKit) or web/other? Use section "SwiftUI" or "Web approximation" accordingly.
2. **Separate layers.** Decide what is content (never glass) and what is the control/navigation layer (glass).
3. **Prefer system components** on Apple platforms. They adopt Liquid Glass automatically when built with the latest SDK.
4. **Apply glass sparingly** using the rules below.
5. **Add accessibility fallbacks** (reduced transparency, reduced motion, increased contrast).
6. **Run the review checklist** at the end before delivering.

## Core principles

1. **Hierarchy**: Glass belongs to the navigation/control layer. Content lives beneath it.
2. **Harmony**: Shapes, concentricity, and rhythm match the hardware and surrounding UI.
3. **Consistency**: Use standard components and patterns so behavior is familiar across platforms.

## Where glass belongs

| Use glass for | Do NOT use glass for |
|---|---|
| Toolbars, tab bars, sidebars | Main content (lists, text, media, content cards) |
| Floating action buttons and controls | Full-screen backgrounds |
| Sheets, popovers, menus, alerts | Stacking glass on glass |
| Sliders and toggles while interacting | Decoration with no function |

Rule of thumb: if removing the element would not hurt navigation or control, it should not be glass.

## Variants

- **Regular**: default; adaptive and legible over any content. Use almost everywhere.
- **Clear**: highly transparent. Use only over rich media (photos, video, maps) and when a dimming layer is acceptable.
- **Tinted**: conveys meaning or a primary action. Limit to one primary tinted action per view.

## Layout and shape

- **Concentricity**: inner corner radius = outer radius minus padding, so nested shapes appear to share a center.
- **Capsules by default** for controls (buttons, tab bars, segmented controls); rounded rectangles for larger surfaces (sheets, cards).
- **Float, don't dock**: bars and controls sit inset from screen edges with a margin.
- **Touch targets**: at least 44x44 pt on iOS; larger for primary actions.
- **Group related controls** in a single glass container rather than many separate pieces.
- **Let content extend** behind bars and sidebars; use scroll edge effects for legibility instead of opaque bars.

## Color and contrast

- Glass is mostly colorless and takes color from what is behind it.
- Reserve tint for the primary action or a state (selected, destructive, confirm).
- Keep labels and symbols high contrast; verify over white, black, saturated color, and busy photos.
- Never fake glass with a flat semi-transparent white fill. Use real blur, a specular highlight, and adaptive shadow.

## Typography and icons

- Prefer bolder, left-aligned headings; avoid thin weights on glass.
- Use the system font and Dynamic Type; never fix text sizes.
- Use SF Symbols with weight consistent with adjacent text.
- Keep labels on glass short.

## Motion and interaction

- **Morph** related elements fluidly (a button expanding into a menu or sheet).
- **Respond to touch**: scale, bounce, and shimmer subtly, illuminating from the touch point.
- Use **spring physics**, not linear easing. Keep durations short (about 0.25 to 0.45 s).
- **Collapse on scroll**: tab bars and toolbars may shrink when scrolling down and expand when scrolling up.
- Honor Reduce Motion, Reduce Transparency, and Increase Contrast.

## SwiftUI (iOS 26+)

```swift
// Basic glass (default: regular, capsule shape)
Text("Hello")
    .padding()
    .glassEffect()

// Custom shape, tint, interactive response
Image(systemName: "plus")
    .padding()
    .glassEffect(.regular.tint(.blue).interactive(), in: .circle)

// Clear variant (only over rich media)
Label("Play", systemImage: "play.fill")
    .padding()
    .glassEffect(.clear)

// Group glass elements so they share a backdrop and can morph
GlassEffectContainer(spacing: 24) {
    HStack(spacing: 24) {
        Button("Edit")  { }.buttonStyle(.glass)
        Button("Share") { }.buttonStyle(.glass)
    }
}

// Morphing between states
@Namespace private var ns
Button("Menu") { }
    .glassEffect()
    .glassEffectID("menu", in: ns)

// Primary action
Button("Done") { }.buttonStyle(.glassProminent)
```

Implementation rules:
- Apply `.glassEffect()` **after** other appearance modifiers (padding, frame, font).
- Wrap nearby glass views in a `GlassEffectContainer`; glass cannot sample other glass, so grouping gives consistent rendering and enables morphing.
- Use `.glassEffectUnion` to merge several views into one glass shape.
- Prefer standard components (`NavigationStack`, `TabView`, `.toolbar`, `.sheet`). Remove custom bar backgrounds and presentation backgrounds that fight the system material.
- Use `.tabBarMinimizeBehavior(.onScrollDown)` and scroll edge effects for collapsing bars.
- API names may change between SDK releases; verify against current documentation if unsure.

## Web approximation (CSS)

Browsers cannot match real refraction, but this gets close for web, Electron, and prototypes.

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.18);
  --glass-border: rgba(255, 255, 255, 0.35);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  --glass-radius: 24px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --glass-bg: rgba(30, 30, 34, 0.35);
    --glass-border: rgba(255, 255, 255, 0.14);
  }
}

.glass {
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius);
  box-shadow:
    var(--glass-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.glass:active { transform: scale(0.97); }

@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: rgba(245, 245, 247, 0.92);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
@media (prefers-reduced-motion: reduce) { .glass { transition: none; } }
@media (prefers-contrast: more) { .glass { border-color: currentColor; } }
```

Web rules:
- Use glass only on a floating control layer, never on body-text containers.
- Provide a solid fallback for browsers without `backdrop-filter`.
- Keep blur moderate (12 to 24 px) and limit simultaneous blurred layers for performance.
- Always include a visually rich background behind the glass in demos; glass over a flat color looks like a plain translucent box.

## Accessibility checklist

- Text contrast meets WCAG AA (4.5:1 body, 3:1 large) in light and dark mode
- Reduce Transparency produces a more frosted or opaque surface
- Reduce Motion removes morph/shimmer in favor of simple fades
- Increase Contrast adds visible borders
- Dynamic Type works up to the largest accessibility sizes without clipping
- Every icon-only control has a VoiceOver label
- Touch targets are at least 44x44 pt

## Do and don't

**Do**
- Let content run edge to edge beneath floating controls
- Group related actions in one glass container
- Use one tinted primary action per screen
- Match corner radii to device and container
- Test over light, dark, and busy backgrounds

**Don't**
- Stack glass on glass
- Put glass on content cards, list rows, or full-screen backgrounds
- Tint everything
- Use thin text or low-contrast icons on glass
- Use clear glass without a dimming layer over bright content
- Skip accessibility fallbacks

## Pre-delivery review

1. Is glass used only for the navigation/control layer?
2. Is there a clear hierarchy of content, then controls?
3. Are shapes concentric and consistent?
4. Is contrast legible on every background tested?
5. Do motion and transparency settings degrade gracefully?
6. Are system components used wherever possible?

Fix any "no" before delivering, and briefly tell the user which fallbacks and assumptions were made.

## References

Apple Human Interface Guidelines ("Materials", "Adopting Liquid Glass") and the WWDC25 sessions on the new design system.
