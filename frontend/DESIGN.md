---
name: Analyst-Grade Intelligence System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#49607c'
  primary: '#001428'
  on-primary: '#ffffff'
  primary-container: '#0f2942'
  on-primary-container: '#7991af'
  inverse-primary: '#b0c9e8'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#310001'
  on-tertiary: '#ffffff'
  tertiary-container: '#580005'
  on-tertiary-container: '#f25d53'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b0c9e8'
  on-primary-fixed: '#011d35'
  on-primary-fixed-variant: '#314863'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ac'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#8e1214'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  label-mono-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 2px
  space-xs: 4px
  space-sm: 8px
  space-md: 12px
  space-base: 16px
  space-lg: 20px
  space-xl: 24px
  space-2xl: 32px
  panel-gap: 8px
  dock-padding: 12px
  table-row-h: 32px
---

## Brand & Style

The design system establishes a mission-critical, institutional environment engineered for intelligence operators, fraud investigators, and defense analysts. The visual identity prioritizes clarity, cognitive stamina, and unambiguous hierarchy over novelty. It completely rejects cyberpunk tropes, decorative glowing accents, speculative futuristic widgets, and high-frequency animations. 

Instead, the identity embodies the rigor of high-stakes analytical workspaces:
- **Authority & Restraint**: Visual quietness enables prolonged visual triage without fatigue.
- **Sober Functionality**: Every visual marker signals actionable status, entity relationships, or verification certainty.
- **High Information Density**: Structured arrays, precise tabular data, and compact controls maximize workspace utility across multi-monitor workstations.
- **Institutional Trust**: Surfaces emulate rigorous dossier and command-center tools, balancing sterile precision with tactical ergonomics.

## Colors

The palette relies on a disciplined light/slate architecture, avoiding true pitch blacks and saturated primaries in favor of grounded, functional pigments.

- **Backgrounds**: The system canvas sits on `#F1F5F9` (cool slate foundation) with secondary canvas recessions at `#E2E8F0`. Application cards, document panels, and inspection views use pure `#FFFFFF` to provide distinct high-contrast reading surfaces.
- **Borders & Dividers**: Low-reflection structural dividers use `#CBD5E1` for active borders and `#E2E8F0` for interior subdivisions, ensuring razor-sharp spatial separation without visual clutter.
- **Primary Navy (`#0F2942`)**: Deep naval slate serves as the primary visual anchor for command actions, active primary navigation items, and dominant structural frames.
- **Secondary Slate (`#475569`)**: Used for contextual secondary controls, filter chips, metadata headers, and non-critical status indicators.
- **Tertiary Alert Crimson (`#991B1B`)**: Reserved strictly for high-confidence threats, severe discrepancies, urgent operational warnings, and destructive triggers. Never used decoratively.
- **Supporting Telemetry & Status**:
  - Operational Positive (Verified / Nominal): Deep Forest `#166534` on background `#DCFCE7` with border `#86EFAC`.
  - Staged Suspicion / Pending Triage: Amber Ochre `#92400E` on background `#FEF3C7` with border `#FDE68A`.
  - Inactive / Historical: Muted Iron `#64748B` on background `#F8FAFC`.

## Typography

Typography prioritizes fast scanning, technical precision, and absolute character distinction (e.g., distinguishing `0` from `O`, `1` from `l`).

- **IBM Plex Sans** serves as the operational baseline for all interface labels, narrative reports, structural headers, and interactive elements. It provides an institutional, industrial aesthetic without idiosyncratic flourishes.
- **JetBrains Mono** is mandatory for all identifier strings, case numbers, IP addresses, geolocations, timestamps (ISO-8601), telemetry readouts, cryptographic hashes, and structured metadata chips.
- Font scales are kept dense and compact, deliberately capped below consumer-marketing display sizes to conserve screen real estate and maximize intelligence throughput.

## Layout & Spacing

The layout model uses a multi-pane operational grid built for desktop-first workflows, with responsive docking for tactical tablets and field displays.

- **Grid Architecture**: Content is structured across collapsible, dockable panes: Primary Navigation (narrow, 56px fixed or 200px labeled), Case Navigation/Entity Tree (280px to 360px), Central Workspace (fluid multi-document canvas), and Contextual Dossier/Inspector (320px to 400px pinned right).
- **Rhythm & Padding**: A disciplined 4px/8px baseline grid maintains consistent density. Standard panel margins are 12px to 16px; table rows collapse to compact 32px or standard 38px heights.
- **Multi-Monitor Adaptation**: Fluid panels dynamically recalculate layout breakpoints without introducing arbitrary horizontal whitespace. Unused canvas area is allocated to data columns and split-view analysis grids rather than empty outer margins.

## Elevation & Depth

Visual hierarchy is established strictly through **structural borders and planar surface layering**, avoiding ambient glowing or dramatic, heavy drop shadows.

- **Layering Principle**: 
  - Level 0 (Canvas): Background tone `#F1F5F9`.
  - Level 1 (Panels & Toolbars): Grounded `#FFFFFF` with `#CBD5E1` 1px solid hairline borders.
  - Level 2 (Inserts & Sub-Panels): `#F8FAFC` recessed fields for raw log streams, telemetry tables, and query editors.
  - Level 3 (Modals, Command Palettes & Flyouts): Elevated pure `#FFFFFF` with a micro-shadow: `0 2px 4px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)` paired with an explicit 1px boundary border (`#94A3B8`).
- **No Diffusion Halos**: Glows, neon halos, and dramatic blur filters are banned across all focus states, warning indicators, and status points. Focus rings are crisp 2px solid strokes (`#0F2942` with 1px white offset).

## Shapes

The interface adopts a tight, purposeful shape language (`roundedness: 1`). Radii are strictly utilitarian to convey structural discipline and preserve internal screen space:

- Base interface components (buttons, input fields, badges, table containers) use **4px (`0.25rem`)** corner rounding.
- Flyout panels, dialog modals, and floating inspector cards use **6px to 8px** maximum rounding.
- Segmented switches, tag pills, and indicator markers avoid full circular pill geometries to prevent a playful, casual demeanor.

## Components

### Buttons
- **Primary**: Solid Navy `#0F2942`, text `#FFFFFF`, hover `#1E3A5F`, active `#0B1E32`. 4px radius, 32px height, 12px horizontal padding. Font: IBM Plex Sans SemiBold 13px.
- **Secondary**: Slate `#FFFFFF` surface with 1px border `#CBD5E1`, text `#334155`, hover background `#F8FAFC` and border `#94A3B8`.
- **Destructive/Alert**: Subdued Crimson `#991B1B`, text `#FFFFFF`, hover `#7F1D1D`.
- **Subtle/Toolbar**: Transparent background, text `#475569`, hover `#E2E8F0`, borderless until hovered.

### Input Fields & Search Queries
- Crisp `#FFFFFF` surface with 1px border `#CBD5E1`. On focus: 1px border `#0F2942` and a 1px solid inset outline `#0F2942`.
- Height: 32px for filters and data tables; 36px for primary search bars.
- Search prefixes use JetBrains Mono for syntax queries (e.g., `id:`, `source:`, `timestamp:`).
- Error inputs: 1px border `#DC2626` accompanied by a direct text descriptor; no flashing or pulsing effects.

### Data Tables & Log Stream
- Table headers: Background `#F8FAFC`, uppercase JetBrains Mono 11px, text `#475569`, border-bottom 1px solid `#CBD5E1`.
- Row layout: 32px height, border-bottom 1px solid `#F1F5F9`, hover background `#F1F5F9`. Selected row: `#E2E8F0` with a 3px left indicator strip in `#0F2942`.
- Numerical columns and timestamps are right-aligned and monospaced for zero-jitter vertical scanning.

### Badges, Status Indicators & Tags
- **High Risk**: Background `#FEE2E2`, border 1px solid `#FCA5A5`, text `#991B1B`.
- **Medium / Review**: Background `#FEF3C7`, border 1px solid `#FDE68A`, text `#92400E`.
- **Verified / Low Risk**: Background `#DCFCE7`, border 1px solid `#86EFAC`, text `#166534`.
- **Neutral Metadata Chip**: Background `#F1F5F9`, border 1px solid `#CBD5E1`, text `#475569`, font JetBrains Mono 11px.
- No dynamic glowing dots or animated radar pulses; static, high-contrast symbols indicate state changes unambiguously.

### Cards & Dossier Panels
- White `#FFFFFF` base, 1px border `#CBD5E1`, 4px radius.
- Header bands are delineated by a 1px bottom border `#E2E8F0` with uppercase 11px section metadata and actionable contextual menus aligned right.