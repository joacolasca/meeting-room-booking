# BookRoom Design System

> Generated via Stitch MCP | Style: Modern SaaS (Linear.app aesthetic)

---

## Color Palette

### Primary — Electric Blue
| Token              | Hex       | Usage                        |
|--------------------|-----------|------------------------------|
| `primary-50`       | `#eff6ff` | Hover backgrounds, tints     |
| `primary-100`      | `#dbeafe` | Active nav bg, avatar bg     |
| `primary-200`      | `#bfdbfe` | Spinner track, focus ring    |
| `primary-300`      | `#93c5fd` | Decorative accents           |
| `primary-400`      | `#60a5fa` | Focus border                 |
| `primary-500`      | `#3b82f6` | Links, secondary buttons     |
| `primary-600`      | `#2563eb` | Primary buttons, CTA         |
| `primary-700`      | `#1d4ed8` | Button hover, gradient end   |
| `primary-800`      | `#1e40af` | Dark accents                 |
| `primary-900`      | `#1e3a8a` | Deep brand tones             |

### Neutrals — Slate
| Token        | Hex       | Usage                     |
|--------------|-----------|---------------------------|
| `slate-50`   | `#f8fafc` | Page background           |
| `slate-100`  | `#f1f5f9` | Card hover bg, dividers   |
| `slate-200`  | `#e2e8f0` | Borders, input borders    |
| `slate-300`  | `#cbd5e1` | Disabled states           |
| `slate-400`  | `#94a3b8` | Placeholder text, icons   |
| `slate-500`  | `#64748b` | Secondary text            |
| `slate-600`  | `#475569` | Body text                 |
| `slate-700`  | `#334155` | Strong body text          |
| `slate-900`  | `#0f172a` | Headings, dark hero bg    |

### Semantic Colors
| Role     | Color       | Hex       |
|----------|-------------|-----------|
| Success  | Emerald-500 | `#10b981` |
| Warning  | Amber-500   | `#f59e0b` |
| Error    | Rose-500    | `#f43f5e` |
| Favorite | Red-500     | `#ef4444` |

---

## Typography

**Font Family:** Inter (Google Fonts)

| Role      | Size         | Weight | Tracking      |
|-----------|-------------|--------|---------------|
| Display   | 3.75rem     | 700    | tight (-0.02) |
| H1        | 1.875rem    | 700    | tight         |
| H2        | 1.5rem      | 600    | normal        |
| H3        | 1.125rem    | 600    | normal        |
| Body      | 0.875rem    | 400    | normal        |
| Body-sm   | 0.75rem     | 400    | normal        |
| Label     | 0.75rem     | 500    | normal        |
| Button    | 0.875rem    | 600    | normal        |

---

## Spacing Tokens

| Token | Value | Usage                        |
|-------|-------|------------------------------|
| xs    | 4px   | Icon gaps                    |
| sm    | 8px   | Badge padding, tight gaps    |
| md    | 12px  | Input padding, small gaps    |
| lg    | 16px  | Card padding inner           |
| xl    | 20px  | Card padding, grid gap       |
| 2xl   | 24px  | Section padding              |
| 3xl   | 32px  | Section gaps                 |
| 4xl   | 48px  | Page padding top/bottom      |

---

## Border Radius

| Element        | Radius      | Tailwind Class |
|----------------|-------------|----------------|
| Buttons        | 12px        | `rounded-xl`   |
| Cards          | 16px        | `rounded-2xl`  |
| Inputs         | 12px        | `rounded-xl`   |
| Modals         | 16px        | `rounded-2xl`  |
| Badges/Pills   | 9999px      | `rounded-full` |
| Icon containers| 12px        | `rounded-xl`   |
| Avatars        | 50%         | `rounded-full` |

---

## Shadows

| Level    | Tailwind                            | Usage          |
|----------|-------------------------------------|----------------|
| None     | —                                   | Default cards  |
| Hover    | `shadow-lg shadow-primary-50`       | Card hover     |
| Elevated | `shadow-xl`                         | Dropdowns      |
| Modal    | `shadow-2xl`                        | Modals         |

---

## Component Patterns

### Navigation Bar
- Sticky top, `bg-white/80 backdrop-blur-md`
- 64px height, max-w-7xl centered
- Logo: Blue square with calendar icon + "BookRoom" text
- Active link: `bg-primary-50 text-primary-700`
- User avatar: Initials in `bg-primary-100` circle

### Cards
- `bg-white rounded-2xl border border-slate-200`
- Hover: `hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50`
- Accent bar: `h-2 bg-gradient-to-r from-primary-500 to-primary-600`
- Padding: `p-5`

### Buttons
- **Primary**: `bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold`
- **Secondary**: `bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl`
- **Danger**: `text-red-600 bg-red-50 hover:bg-red-100 rounded-lg`
- **Ghost**: `text-slate-500 hover:bg-slate-100 rounded-lg`
- All: `cursor-pointer transition-colors`

### Inputs
- `bg-slate-50 border border-slate-200 rounded-xl`
- `focus:border-primary-400 focus:ring-2 focus:ring-primary-100`
- Icon prefix: `absolute left-3 text-slate-400`
- Padding: `pl-10 pr-4 py-2.5`

### Modals
- Backdrop: `bg-black/40 backdrop-blur-sm`
- Container: `bg-white rounded-2xl shadow-2xl max-w-md`
- Header: `p-5 border-b border-slate-100` with close X button
- Body: `p-5 space-y-4`

### Status Badges
- Active: `bg-emerald-100 text-emerald-700`
- Cancelled: `bg-red-100 text-red-700`
- Finished: `bg-slate-100 text-slate-600`
- Format: `rounded-full px-3 py-1 text-xs font-medium`

### Loading Spinner
- `border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`

---

## Dark Hero Section (Landing)
- Background: `bg-slate-900` (#0F172A)
- Heading: `text-white` with `text-primary-400` accent word
- Subtext: `text-slate-400`
- Decorative: Gradient orbs with `bg-primary-500/10 blur-3xl`
- CTA: Blue filled + white outlined buttons

---

## Stitch Project Reference
- **Project ID**: `1517241724351816962`
- **Design System Asset**: `assets/9664321277802024401`
- **Login Screen**: `screens/23e257363e2446998e635ce004f8afc6`
