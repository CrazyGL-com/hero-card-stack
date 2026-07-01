import * as React from 'react';
import CrazyGLWrapper, {
	useContent,
	useHeroReady,
	type HeroComponentProps,
} from '@crazygl/core';
import metadata from './metadata.json';
import './style.css';

/* ─────────────────────────────────────────────────────────────────────────
   Card Stack — your main screenshot floats on top of a deck of secondary
   UI cards. On hover the cards fan out down-and-right with a damped spring,
   revealing the screens underneath.

   Physics / motion statement
     - Each card is a rounded-rectangle PlaneGeometry built from a shared
       THREE.Shape (rounded-rect outline). The geometry is created once and
       re-used across cards; only the screenshot texture differs.
     - At rest, card i is offset by (+i*Dx, -i*Dy, -i*Dz) — diagonally
       behind+below the top card — and scaled by (1 - i*0.025) for a
       perspective hint. A small alternating Z rotation (i % 2 ? -1 : +1)
       gives the "hand-shuffled" feel mentioned in the brief.
     - The fan-out is a damped harmonic oscillator per card:
           a = stiffness * (target - x) - damping * v
           v += a * dt
           x += v * dt
       (a.k.a. critically-damped-ish spring; see Robert Bridson, "Fluid
       Simulation for CG", and the ubiquitous CSS spring formulation).
       Target = 0 when not hovered, target = i * fanDistance when hovered.
       This gives the physical "settle with a touch of overshoot" feel that
       linear lerp can't.
     - Pointer parallax tilts the whole stack ±~8° yaw / ±~5° pitch with
       exponential easing (lerp(current, target, 1 - exp(-dt*k))). The TOP
       card subtracts a fraction of the stack-wide rotation, so it stays
       more head-on to the viewer than the cards behind it (secondary
       motion — sells the depth, also handy because the top card is the
       one the user actually wants to read).
     - Soft shadows: a slightly larger dark-radial plane sits just behind
       each card. Cheaper than three.js shadow maps + looks the same at
       this camera distance. (Same trick as hero-floating-metal-frame.)
     - Edge glow: a slightly larger BackSide plane behind the top card,
       carrying a glow canvas texture. The BackSide means the front of the
       plane is rendered from BEHIND, so we only see the glow's silhouette
       extending past the card edges — not a colored rectangle over the
       card face.

   HDRI flash guard: a procedural studio HDRI is built once and assigned to
   scene.environment only — never scene.background — per the catalog
   "metal / mercury / chrome" entry. Even though our cards are mostly
   matte+screenshot, the rim of each card picks up env reflections and the
   PBR pipeline needs an env to look right.

   Coordinate spaces
     world   — three world units. Stack centred at origin, cards ~2.4 wide.
     uv      — plane UVs (0..1), used by the screenshot textures.
     u_input — wrapper pointer 0..1 (top-left origin).

   References
     - Three.js MeshStandardMaterial (Cook-Torrance metallic-roughness).
     - "Real Shading in Unreal Engine 4" (Karis 2013).
     - hero-floating-metal-frame for the procedural HDRI + contact shadow
       patterns this hero re-uses.
   ───────────────────────────────────────────────────────────────────────── */

const StackStage = React.lazy(() => import('./StackStage'));

type ContentAlign = 'start' | 'center' | 'end';

function CardStackHero(props: HeroComponentProps) {
	const {
		size,
		input,
		seed,
		reducedMotion,
		rootRef,
		// Screenshots
		screenshot1 = 'https://crazygl.com/samples/screenshot-dashboard-dark.avif',
		screenshot2 = 'https://crazygl.com/samples/screenshot-dashboard-dark-2.avif',
		screenshot3 = 'https://crazygl.com/samples/screenshot-video-editor-dark.avif',
		screenshot4 = 'https://crazygl.com/samples/screenshot-dashboard-light.avif',
		screenshot5 = 'https://crazygl.com/samples/screenshot-video-editor-light.avif',
		// Stack
		cardCount = 5,
		stackOffsetX = 0.06,
		stackOffsetY = 0.04,
		stackOffsetZ = 0.04,
		cardSize = 2.4,
		groupOffsetX = 0,
		groupOffsetY = 0,
		cardCornerRadius = 0.07,
		// Flip cycle
		flipCycle = true,
		cycleInterval = 3.5,
		// Hover
		fanDistance = 0.25,
		fanRotation = 0.04,
		springStiffness = 180,
		springDamping = 14,
		// Motion
		cursorTilt = 0.7,
		ambientFloat = 0.35,
		// Style
		edgeGlowColor = '#56e3ff',
		edgeGlowStrength = 0.5,
		shadowStrength = 0.55,
		// Lighting
		keyColor = '#ffffff',
		fillColor = '#a0bcff',
		screenBrightness = 0.4,
		// Layout
		contentAlign = 'start' as ContentAlign,
		paddingX = 64,
		paddingY = 48,
		// Background
		bgTop = '#161a24',
		bgBottom = '#06080d',
	} = props as any;

	const content = useContent(props);
	useHeroReady(props);
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);

	const align: React.CSSProperties =
		contentAlign === 'end'
			? { justifyContent: 'flex-end', textAlign: 'right' }
			: contentAlign === 'center'
				? { justifyContent: 'center', textAlign: 'center' }
				: { justifyContent: 'flex-start', textAlign: 'left' };

	const screenshots = React.useMemo(
		() => [screenshot1, screenshot2, screenshot3, screenshot4, screenshot5],
		[screenshot1, screenshot2, screenshot3, screenshot4, screenshot5],
	);

	return (
		<>
			<crazygl-stage
				style={
					{
						position: 'absolute',
						inset: 0,
						zIndex: 0,
						overflow: 'hidden',
						background: `linear-gradient(180deg, ${bgTop} 0%, ${bgBottom} 100%)`,
					} as React.CSSProperties
				}
			>
				{mounted ? (
					<React.Suspense fallback={null}>
						<StackStage
							rootRef={rootRef}
							size={size}
							input={input}
							seed={seed}
							reducedMotion={reducedMotion}
							screenshots={screenshots}
							cardCount={cardCount}
							stackOffsetX={stackOffsetX}
							stackOffsetY={stackOffsetY}
							stackOffsetZ={stackOffsetZ}
							cardSize={cardSize}
							groupOffsetX={groupOffsetX}
							groupOffsetY={groupOffsetY}
							cardCornerRadius={cardCornerRadius}
							flipCycle={flipCycle}
							cycleInterval={cycleInterval}
							fanDistance={fanDistance}
							fanRotation={fanRotation}
							springStiffness={springStiffness}
							springDamping={springDamping}
							cursorTilt={cursorTilt}
							ambientFloat={ambientFloat}
							edgeGlowColor={edgeGlowColor}
							edgeGlowStrength={edgeGlowStrength}
							shadowStrength={shadowStrength}
							keyColor={keyColor}
							fillColor={fillColor}
							screenBrightness={screenBrightness}
						/>
					</React.Suspense>
				) : null}
			</crazygl-stage>
			<crazygl-content
				style={
					{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						alignItems: 'center',
						zIndex: 1,
						pointerEvents: 'none',
						padding: `${paddingY}px ${paddingX}px`,
						...align,
					} as React.CSSProperties
				}
			>
				<div className="crazygl-cs-content">{content.node}</div>
			</crazygl-content>
		</>
	);
}

export { metadata };
export default function CardStack(props: any) {
	return <CrazyGLWrapper hero={CardStackHero} metadata={metadata as any} {...props} />;
}
