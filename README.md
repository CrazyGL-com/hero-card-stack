<sub>*Hero made by [@ybouane](https://x.com/ybouane).*</sub>
<p align="center">
  <img src="https://crazygl.com/heroes/hero-card-stack/banner-full.png" alt="Screenshot as a 3D Card Stack" width="640">
</p>

# @crazygl/hero-card-stack

Your main product screenshot sits on top of a stack of secondary UI cards. The front card swoops up and over to the back at a configurable interval, autonomously cycling through every screen. Soft drop shadows, a cyan edge glow on the top card, cursor parallax tilt.

## Demo
[Screenshot as a 3D Card Stack](https://crazygl.com/hero/card-stack)

## Install

```bash
npm install @crazygl/hero-card-stack
```

## Usage

```tsx
import HeroCardStack from '@crazygl/hero-card-stack';

export default function Hero() {
	return (
		<HeroCardStack
			heading="One product, every module."
			subheading="Watch the deck cycle through every screen."
			screenshot1="/screens/dashboard.png"
			screenshot2="/screens/builder.png"
			screenshot3="/screens/editor.png"
			cycleInterval={3.5}
		/>
	);
}
```

## Customise

- **Content** — `heading` / `subheading`, or switch `contentType` to `two-columns` / `custom` for richer copy.
- **Screenshots** — `screenshot1..5`, one image per card. Screenshot 1 is the top (most visible) card, 5 is the bottom. Each card adopts its image's own aspect ratio.
- **Stack** — `cardCount` (2–6), `stackOffsetX/Y/Z`, `cardSize`, `cardCornerRadius`, plus `groupOffsetX/Y` to position the whole deck.
- **Flip cycle** — `flipCycle` toggles the auto-cycle; `cycleInterval` (seconds) sets the pace.
- **Motion** — `cursorTilt` for pointer parallax, `ambientFloat` for a gentle continuous bob.
- **Style & lighting** — `edgeGlowColor` / `edgeGlowStrength`, `shadowStrength`, `keyColor` / `fillColor`, `screenBrightness`, and `bgTop` / `bgBottom` gradient.

## Best for

- SaaS landing pages with multiple modules — dashboards, app builders, template galleries.
- Multi-product suites or design tools that want to show several screens at once.
- Product launches where an auto-cycling reel of screenshots tells the story hands-free.



This hero is part of [CrazyGL](https://crazygl.com), a collection of production-ready WebGL, canvas, 3D, and typography effects. Every CrazyGL hero ships with an agent-ready `SKILL.md` file that helps developers and coding agents adapt the effect into custom landing pages and interactive experiences.
