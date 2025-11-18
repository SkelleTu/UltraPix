# Design Guidelines: Advanced AI Video Generation Platform

## Design Approach
**System Foundation**: Material Design 3 with heavy customization for creative workflows
**Creative References**: Runway ML (AI video generation), CapCut (video editing UX), Linear (modern productivity aesthetics), Canva (accessible creative tools)

**Core Principles**: 
- Professional-grade creative workspace with intuitive controls
- Visual hierarchy that guides users through complex workflows
- Sophisticated yet approachable interface for all skill levels
- Performance-focused layout supporting real-time previews

---

## Typography System

**Primary Font**: Inter (Google Fonts) - UI elements, controls, forms
**Secondary Font**: Space Grotesk (Google Fonts) - Headers, feature callouts

**Hierarchy**:
- Hero Headings: Space Grotesk, 48px (mobile: 32px), weight 700
- Section Headings: Space Grotesk, 32px (mobile: 24px), weight 600
- Card Titles: Inter, 20px, weight 600
- Body Text: Inter, 16px, weight 400
- UI Labels: Inter, 14px, weight 500
- Caption/Meta: Inter, 12px, weight 400

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 8, 12, 16 for consistency
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-16
- Element gaps: gap-4 to gap-8
- Margins: m-2, m-4, m-8

**Grid Structure**:
- Desktop: max-w-7xl container with multi-column layouts
- Editor workspace: 70% preview area / 30% controls sidebar
- Gallery: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Dashboard: grid-cols-1 lg:grid-cols-12 for flexible layouts

---

## Component Library

### Navigation
**Top App Bar**: Fixed header with logo, main navigation tabs (Create, Library, Effects, Export), user profile, credits indicator
- Height: h-16
- Layout: Horizontal with space-between alignment
- Icons: Heroicons (outline for inactive, solid for active states)

**Secondary Navigation**: Context-aware toolbar below main nav showing relevant tools/options
- Height: h-12
- Compact button groups with clear visual separation

### Video Creation Interface

**Main Workspace**:
- Split layout: Video preview (aspect ratio 16:9 or 9:16 switchable) dominates left/center
- Right sidebar: h-full with scrollable controls, organized in collapsible sections
- Bottom timeline: h-32 when expanded, minimizes to h-12

**Timeline Component**:
- Horizontal track with keyframe markers
- Zoom controls (slider + presets)
- Playhead with time indicator
- Layer tracks for multi-element compositions
- Drag-and-drop enabled zones

**Control Panels**:
- Accordion-style sections: "Prompt Settings," "Camera Controls," "Effects," "Audio"
- Each section: p-4 spacing between controls
- Input fields: Full-width with clear labels above
- Sliders: Range inputs with numeric value display
- Toggle switches: For binary options (physics on/off, etc.)

### Cards & Gallery

**Video Preview Cards**:
- Aspect ratio preserved thumbnail
- Overlay on hover: Play button (centered), duration badge, action menu
- Bottom section: Title (truncated), metadata (resolution, date), quick actions
- Border radius: rounded-lg
- Shadow: Subtle elevation on hover

**Project Cards** (Library view):
- Larger thumbnails with status indicators (processing, completed, failed)
- Grid layout with consistent spacing (gap-6)
- Batch selection checkboxes
- Filter bar above grid: Dropdowns for sorting, date range, resolution

### Forms & Inputs

**Text-to-Video Generator**:
- Large textarea: min-h-32, placeholder with example prompts
- Character counter below
- Advanced options: Expandable section with style presets (Cinematic, Anime, Realistic, etc.)
- Generate button: Primary CTA, full-width on mobile, min-w-48 on desktop

**Image Upload Zone**:
- Drag-and-drop area: min-h-64, dashed border
- Click to browse alternative
- Preview thumbnails grid after upload
- Remove/replace controls per image

**Settings Forms**:
- Two-column layout on desktop (label left, input right)
- Single column on mobile
- Clear validation states (success, error, warning)
- Inline help text below inputs

### Effects Library

**Effect Browser**:
- Masonry grid showcasing effect previews (short video loops)
- Category filters: Pills/chips for quick filtering (Trending, Transformations, Social, etc.)
- Search bar: Full-width, prominent placement
- Apply button overlays effect preview on hover

### Modals & Overlays

**Export Dialog**:
- Centered modal: max-w-2xl
- Resolution selector: Radio buttons with visual representation (720p, 1080p, 4K icons)
- Format dropdown: MP4, WebM, GIF
- Quality slider: Low, Medium, High, Ultra presets
- Estimated file size indicator
- Progress bar during export

**Template Selection**:
- Full-screen overlay with dismissible backdrop
- Grid of template cards with preview videos
- Category navigation sidebar
- Search and filter options

### Status & Feedback

**Progress Indicators**:
- Linear progress bar: Fixed top position during generation
- Circular progress: Inside cards for individual items
- Estimated time remaining display
- Queue position indicator

**Notifications/Toasts**:
- Top-right corner positioning
- Auto-dismiss after 5 seconds
- Action buttons for important notifications (View, Download)
- Icon indicators: Success (check), Error (alert), Info (info circle)

**Empty States**:
- Centered content with illustrative icon
- Encouraging message
- Primary CTA to get started
- Example/tutorial link

---

## Dashboard & Analytics

**Overview Section**:
- Stats cards in 4-column grid: Total Videos, Credits Used, Storage, Processing Time
- Each card: Icon, number (large), label, trend indicator (if applicable)

**Recent Projects**:
- Horizontal scrollable carousel on mobile
- Grid on desktop
- Quick access to continue/duplicate/share

---

## Accessibility Standards

- Keyboard navigation: Tab order follows logical flow, escape closes modals
- Focus indicators: Visible outline on all interactive elements
- ARIA labels: All buttons, inputs, and dynamic content properly labeled
- Screen reader announcements: For processing states, errors, completion
- Contrast ratios: WCAG AAA compliance throughout
- Form validation: Clear error messages with suggestions

---

## Responsive Breakpoints

- Mobile: < 768px - Single column, stacked controls, simplified timeline
- Tablet: 768px - 1024px - Two-column layouts, sidebar toggleable
- Desktop: > 1024px - Full multi-column, persistent sidebars
- Large Desktop: > 1536px - Wider previews, expanded controls visibility

---

## Images

**Hero Section** (Landing/Homepage):
- Large hero image showcasing impressive AI-generated video frame (cinematic quality)
- Dimensions: Full viewport width, 60vh height on desktop
- Content: Gradient overlay (top to bottom) for text readability
- Example: Futuristic cityscape or dynamic character animation still
- Placement: Above the fold with CTA buttons (blurred background on buttons)

**Feature Showcases**:
- Video preview GIFs/thumbnails demonstrating each key feature
- Before/after comparisons for image-to-video transformations
- Effect examples in gallery grid format
- User-generated content gallery for inspiration

**Gallery/Library**:
- User-generated video thumbnails in masonry grid
- No hero image needed - content-first approach
- Placeholder images for empty states

---

## Performance Considerations

- Lazy loading: Video thumbnails and preview images
- Skeleton screens: During content loading
- Optimistic UI: Immediate feedback before server confirmation
- Infinite scroll: For large galleries with pagination fallback
- Debounced inputs: For search and filter operations