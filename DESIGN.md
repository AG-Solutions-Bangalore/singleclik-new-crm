---
version: alpha
name: Notion
description: >-
  The AI workspace that works for you. Notion combines collaborative document editing, database management, and
  AI-powered agents into a unified system of record for teams.
logo:
  src: https://notion.so/front-static/logo-ios.png
colors:
  surface: '#ffffff'
  surface-dim: '#f8f9fa'
  surface-bright: '#ffffff'
  surface-container-lowest: '#f8f9fa'
  surface-container-low: '#f0f2f5'
  surface-container: '#e9ecef'
  surface-container-high: '#e0e3e8'
  surface-container-highest: '#d9dce1'
  on-surface: '#202124'
  on-surface-variant: '#5f6368'
  inverse-surface: '#202124'
  inverse-on-surface: '#f8f9fa'
  outline: '#dadce0'
  outline-variant: '#c4c7c5'
  surface-tint: '#0075de'
  primary: '#0075de'
  on-primary: '#ffffff'
  primary-container: '#e6f3fe'
  on-primary-container: '#005bb3'
  inverse-primary: '#4db8ff'
  secondary: '#ffb110'
  on-secondary: '#202124'
  secondary-container: '#fff3e0'
  on-secondary-container: '#cc8800'
  tertiary: '#f64932'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffe0d9'
  on-tertiary-container: '#cc3d28'
  error: '#d33b27'
  on-error: '#ffffff'
  error-container: '#f9dedb'
  on-error-container: '#a1261f'
  primary-fixed: '#e6f3fe'
  primary-fixed-dim: '#cce5fd'
  on-primary-fixed: '#001f4d'
  on-primary-fixed-variant: '#004a99'
  secondary-fixed: '#fff3e0'
  secondary-fixed-dim: '#ffe0b2'
  on-secondary-fixed: '#331f00'
  on-secondary-fixed-variant: '#994d00'
  tertiary-fixed: '#ffe0d9'
  tertiary-fixed-dim: '#ffb3a3'
  on-tertiary-fixed: '#3d0f08'
  on-tertiary-fixed-variant: '#992817'
  background: '#ffffff'
  on-background: '#202124'
  surface-variant: '#e9ecef'
typography:
  display:
    fontFamily: NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 96px
    fontWeight: '600'
    lineHeight: 104px
    letterSpacing: '-0.04em'
  headline-lg:
    fontFamily: NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: '-0.02em'
  headline-md:
    fontFamily: NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: '-0.01em'
  title-lg:
    fontFamily: NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: NotionInter, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  container-max: 1280px
elevation:
  sm: 0 1px 2px rgba(0, 0, 0, 0.06)
  md: 0 3px 8px rgba(0, 0, 0, 0.15)
  lg: 0 8px 24px rgba(0, 0, 0, 0.12)
layout:
  containerMaxWidth: 1280px
  gridColumns: 12
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label-md}'
    rounded: '{rounded.lg}'
    padding: 6px 15px
    height: 40px
    fontWeight: '500'
  button-primary-hover:
    backgroundColor: '#0059b3'
    textColor: '{colors.on-primary}'
    transition: background-color 0.2s ease
  button-primary-active:
    backgroundColor: '#004a99'
    textColor: '{colors.on-primary}'
  button-secondary:
    backgroundColor: '{colors.primary-container}'
    textColor: '{colors.primary}'
    typography: '{typography.label-md}'
    rounded: '{rounded.lg}'
    padding: 6px 15px
    height: 40px
    fontWeight: '500'
  button-secondary-hover:
    backgroundColor: '#cce5fd'
    textColor: '{colors.primary}'
    transition: background-color 0.2s ease
  button-ghost:
    backgroundColor: transparent
    textColor: '{colors.on-surface}'
    typography: '{typography.label-md}'
    rounded: '{rounded.lg}'
    padding: 6px 15px
    height: 40px
    fontWeight: '400'
  button-ghost-hover:
    backgroundColor: '{colors.surface-container-low}'
    textColor: '{colors.on-surface}'
  card:
    backgroundColor: '{colors.surface-container-lowest}'
    rounded: '{rounded.lg}'
    padding: 16px
    boxShadow: '{elevation.md}'
    border: 1px solid {colors.outline}
  card-hover:
    backgroundColor: '{colors.surface-container-low}'
    boxShadow: '{elevation.lg}'
    transition: all 0.2s ease
  input-field:
    backgroundColor: '{colors.surface-container-low}'
    textColor: '{colors.on-surface}'
    typography: '{typography.body-md}'
    rounded: '{rounded.DEFAULT}'
    padding: 8px 12px
    border: 1px solid {colors.outline}
    height: 40px
  input-field-focus:
    borderColor: '{colors.primary}'
    boxShadow: 0 0 0 3px {colors.primary-container}
    outline: none
  badge:
    backgroundColor: '{colors.secondary-container}'
    textColor: '{colors.on-secondary-container}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.full}'
    padding: 4px 12px
    fontWeight: '500'
  badge-accent:
    backgroundColor: '{colors.tertiary-container}'
    textColor: '{colors.on-tertiary-container}'
  list-item:
    backgroundColor: transparent
    rounded: '{rounded.md}'
    padding: 12px 16px
    textColor: '{colors.on-surface}'
  list-item-hover:
    backgroundColor: '{colors.surface-container-high}'
    textColor: '{colors.primary}'
    transition: background-color 0.15s ease
---

## Overview

Notion is a unified workspace platform that combines collaborative document management, database organization, and AI-powered automation into a single system of record. The design language embraces 'Functional Minimalism'—a clean, light aesthetic with strategic use of primary blue (#0075de) as the signature accent color, complemented by warm secondary accents (orange #ffb110 and red #f64932) that highlight key actions and AI-driven features. The brand personality is professional yet approachable, designed to make complex workflows feel intuitive and accessible to teams of all sizes. The UI prioritizes clarity and efficiency: generous whitespace, high contrast typography, and purposeful color application guide users through task-oriented workflows without visual noise.

Notion's voice is direct, confident, and action-oriented. The tone avoids jargon while maintaining technical credibility. Example sentence: 'Capture context, find answers, and automate tasks with AI built for your team.' The vocabulary emphasizes collaboration, intelligence, and unified systems—never fragmented or siloed. Visual hierarchy is achieved through weight and scale rather than decoration, reflecting a design philosophy that respects user attention and values substance over ornament.

## Colors

The color system is anchored by a primary blue (#0075de) used exclusively for primary CTAs, active states, and brand-critical interactions. This blue is vibrant enough to command attention on the white background (rgb(255, 255, 255)) without feeling aggressive. The primary container (#e6f3fe) provides a soft, low-contrast background for secondary actions and informational contexts. Secondary orange (#ffb110) highlights AI-powered features and creative actions—it appears on the 'Create' badge in the hero and signals automation or intelligence. Tertiary red (#f64932) is reserved for destructive actions, warnings, and high-priority alerts. The surface stack uses a carefully calibrated neutral palette: surface-container-lowest (#f8f9fa) for cards and panels, surface-container (#e9ecef) for div

## Typography

The type system uses NotionInter (a custom variant of Inter) as the primary typeface, with system fallbacks (BlinkMacSystemFont, Segoe UI) for cross-platform consistency. Display (96px, 600 weight) anchors hero sections with commanding presence and -0.04em letter-spacing to tighten the visual impact. Headline-lg (48px, 600 weight) and headline-md (32px, 600 weight) establish section hierarchy with -0.02em and -0.01em letter-spacing respectively, creating a sophisticated, slightly condensed feel. Body-lg (18px, 400 weight) and body-md (16px, 400 weight) maintain 1.5x line-height (28px and 24px) for comfortable reading in both hero copy and card content. Label-md (16px, 500 weight) is used for button text and interactive labels, while label-sm (12px, 500 weight) handles metadata, badges, and

## Layout

The page layout uses a 12-column grid with a max-width of 1280px, centered on the viewport. Hero sections span full width with generous vertical padding (40px top/bottom minimum) to create breathing room around the display-sized headline. Content sections use a gutter of 24px between columns and 40px (lg spacing) for vertical separation between major sections. Cards and containers maintain 16px internal padding (md spacing) with 12px (sm spacing) for nested elements. The design favors asymmetrical whitespace: wider margins above sections than below, creating a natural reading rhythm that guides the eye downward. Container max-width of 1280px ensures text remains readable on ultra-wide displays while maintaining focus. Buttons and CTAs are grouped with 12px horizontal spacing (sm) and 24px

## Elevation & Depth

Depth is conveyed through subtle shadows and layering rather than dramatic effects. Level 1 (Base): the white background (rgb(255, 255, 255)) with no shadow. Level 2 (Standard Card): box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15) with a 1px solid border at #dadce0, creating a soft separation from the background. Level 3 (Elevated/Hover): box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) with the same border, used for modals, popovers, and hover states on cards. Shadows use a 15% black opacity at 3px blur for standard cards and 12% at 8px blur for elevated states, creating a consistent, naturalistic light

## Shapes

The shape philosophy is 'Geometric Clarity'—rounded corners are used sparingly and consistently to soften hard edges without introducing visual softness. Buttons and input fields use rounded.lg (1rem / 16px border-radius) for a modern, approachable feel that avoids both sharp rectangles and overly rounded pill shapes. Cards use the same 1rem radius for visual consistency. The 'Create' badge in the hero uses rounded.full (9999px) to signal a special, highlighted action—this is the only full-pill element on the page, making it visually distinctive. Smaller UI elements like badges and chips use r

## Components

### Action Elements
Buttons follow a three-tier system: primary (solid blue #0075de on white background, 40px height, 6px 15px padding, 500 weight label-md), secondary (light blue background #e6f3fe with blue text #0075de, same dimensions), and ghost (transparent with dark text, used for tertiary actions). Primary buttons transition to #0059b3 on hover with a 0.2s ease timing function. All buttons use rounded.lg (16px) and maintain a minimum 44px touch target height. Focus states add a 3px outline ring of primary-container (#e6f3fe) at 100% opacity, visible at 2px offset from the button edge.

### Containers & Surfaces
Cards use a 1px solid border (#dadce0) with 16px padding and rounded.lg (16px). The background is surface-container-lowest (#f8f9fa). On hover, the background shifts to surf

## Do's and Don'ts

**Do**
- Do use primary blue (#0075de) exclusively for primary CTAs and active states—it is the brand's signature accent and must not be diluted across secondary elements.
- Do maintain 24px (md spacing) as the standard vertical gap between major sections and 12px (sm spacing) for grouped elements to create rhythm and breathing room.
- Do apply box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15) to cards and 0 8px 24px rgba(0, 0, 0, 0.12) to elevated states; never use drop-shadows or blurred effects outside this range.
- Do use 600 weight typography for all headings (display, headline-lg, headline-md) and 500 weight for button labels and interactive text; body text remains 400 weight.
- Do use the secondary orange (#ffb110) and tertiary red (#f64932) sparingly—only for AI-powered features, creative actions, or destructive/warning states respectively.

**Don't**
- Don't use primary blue for non-interactive elements, backgrounds, or decorative purposes—reserve it exclusively for CTAs, focus states, and active indicators.
- Don't apply rounded corners smaller than 0.5rem (8px) to buttons or cards; the minimum is rounded.DEFAULT (8px) for inputs and rounded.lg (16px) for primary actions.
- Don't mix shadow depths—use only the two defined levels (0 3px 8px for standard, 0 8px 24px for elevated); never create custom shadow values.
- Don't use the secondary orange or tertiary red as background colors for large areas; they are accent colors for small, high-priority UI elements only.
- Don't exceed 1280px container max-width on any section; if content is wider, use a fixed-width container or allow the layout to reflow at smaller breakpoints rather than stretching.
