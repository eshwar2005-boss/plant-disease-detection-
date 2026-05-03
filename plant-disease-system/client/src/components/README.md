# Components Library

A comprehensive collection of reusable React components for the Plant Disease Detection System.

## 🎨 UI Components

### Button
Customizable button component with multiple variants and sizes.

```jsx
import { Button } from './components'

<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
- `size`: 'small' | 'medium' | 'large'
- `fullWidth`: boolean
- `disabled`: boolean

---

### Card
Container component for displaying content in a card layout.

```jsx
import { Card } from './components'

<Card 
  title="Title" 
  subtitle="Subtitle"
  hoverable 
  footer={<Button>Action</Button>}
>
  Card content
</Card>
```

**Props:**
- `title`: string
- `subtitle`: string
- `footer`: ReactNode
- `hoverable`: boolean
- `onClick`: function

---

### Modal
Modal dialog component with customizable size.

```jsx
import { Modal } from './components'

<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Modal Title"
  size="medium"
>
  Modal content
</Modal>
```

**Props:**
- `isOpen`: boolean (required)
- `onClose`: function (required)
- `title`: string
- `size`: 'small' | 'medium' | 'large'
- `closeOnOverlay`: boolean

---

### Alert
Alert message component for displaying notifications.

```jsx
import { Alert } from './components'

<Alert 
  type="success" 
  title="Success!"
  message="Operation completed successfully"
  onClose={handleClose}
/>
```

**Props:**
- `type`: 'success' | 'error' | 'warning' | 'info'
- `message`: string (required)
- `title`: string
- `onClose`: function

---

### Loader & Spinner
Loading indicators for async operations.

```jsx
import { Loader, Spinner, ProgressBar } from './components'

<Loader message="Loading..." fullScreen />
<Spinner size="large" color="primary" />
<ProgressBar progress={75} showPercentage />
```

**Loader Props:**
- `message`: string
- `fullScreen`: boolean

**Spinner Props:**
- `size`: 'small' | 'medium' | 'large'
- `color`: 'primary' | 'secondary' | 'white'

**ProgressBar Props:**
- `progress`: number (0-100)
- `showPercentage`: boolean

---

### Input Components
Form input components with validation support.

```jsx
import { Input, TextArea, Select } from './components'

<Input 
  label="Name"
  icon="👤"
  error="This field is required"
  helperText="Enter your full name"
/>

<TextArea 
  label="Description"
  rows={5}
/>

<Select 
  label="Choose Option"
  options={['Option 1', 'Option 2']}
/>
```

**Common Props:**
- `label`: string
- `error`: string
- `helperText`: string

---

### Badge
Small status indicators.

```jsx
import { Badge, StatusBadge } from './components'

<Badge variant="success" size="medium">Active</Badge>
<StatusBadge status="healthy" />
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info'
- `size`: 'small' | 'medium' | 'large'

---

### Tabs
Tabbed navigation component.

```jsx
import { Tabs } from './components'

<Tabs 
  defaultTab={0}
  tabs={[
    { label: 'Tab 1', icon: '🏠', content: <div>Content 1</div> },
    { label: 'Tab 2', icon: '⚙️', content: <div>Content 2</div> }
  ]}
  onChange={(index) => console.log(index)}
/>
```

**Props:**
- `tabs`: Array of { label, icon, content }
- `defaultTab`: number
- `onChange`: function

---

### Accordion
Collapsible content sections.

```jsx
import { Accordion, AccordionItem } from './components'

<Accordion>
  <AccordionItem title="Section 1" defaultOpen>
    Content 1
  </AccordionItem>
  <AccordionItem title="Section 2">
    Content 2
  </AccordionItem>
</Accordion>
```

**AccordionItem Props:**
- `title`: string (required)
- `defaultOpen`: boolean

---

### Toast
Toast notifications with auto-dismiss.

```jsx
import { ToastContainer, useToast } from './components'

// Add ToastContainer to your App.jsx
<ToastContainer />

// Use in components
const { showToast } = useToast()
showToast('Success!', 'success', 3000)
```

**showToast Parameters:**
- `message`: string
- `type`: 'success' | 'error' | 'warning' | 'info'
- `duration`: number (milliseconds)

---

## 🌱 Feature Components

### ImagePreview
Display and manage uploaded images.

```jsx
import { ImagePreview, ImageGallery } from './components'

<ImagePreview 
  src={imageUrl} 
  alt="Preview"
  onRemove={handleRemove}
/>

<ImageGallery 
  images={imageArray}
  onImageClick={handleClick}
/>
```

---

### DetectionResult
Display plant disease detection results.

```jsx
import { DetectionResult } from './components'

<DetectionResult 
  result={{
    prediction: 'Tomato Late Blight',
    confidence: 0.95,
    treatments: [...],
    lifecycle: {...},
    metadata: {...}
  }}
/>
```

---

### DiseaseCard
Display disease information in card format.

```jsx
import { DiseaseCard, DiseaseList } from './components'

<DiseaseCard 
  disease={{
    name: 'Late Blight',
    plantType: 'Tomato',
    description: '...',
    severity: 'High'
  }}
  onClick={handleClick}
/>

<DiseaseList 
  diseases={diseaseArray}
  onDiseaseClick={handleClick}
/>
```

---

### StatCard
Statistics display card for analytics.

```jsx
import { StatCard, StatsGrid } from './components'

<StatsGrid columns={4}>
  <StatCard 
    title="Total Detections"
    value={1234}
    icon="📊"
    trend="up"
    trendValue="12%"
    color="primary"
  />
</StatsGrid>
```

**Props:**
- `title`: string
- `value`: string | number
- `icon`: string
- `trend`: 'up' | 'down' | 'neutral'
- `trendValue`: string
- `color`: 'primary' | 'success' | 'warning' | 'danger'

---

### FileUpload
Drag-and-drop file upload component.

```jsx
import { FileUpload } from './components'

<FileUpload 
  onFileSelect={handleFile}
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  label="Upload Image"
/>
```

**Props:**
- `onFileSelect`: function (required)
- `accept`: string
- `maxSize`: number (bytes)
- `label`: string
- `helperText`: string

---

## 📦 Installation & Usage

### Import all components:
```jsx
import { Button, Card, Modal, Alert } from './components'
```

### Import individual components:
```jsx
import Button from './components/Button'
```

---

## 🎨 Customization

All components use CSS modules and can be customized by:
1. Modifying the component's CSS file
2. Passing custom className props
3. Using inline styles for one-off customizations

---

## 📝 Notes

- All components are built with React and use hooks
- Components are fully responsive and mobile-friendly
- Accessibility features included (ARIA labels, keyboard navigation)
- Animations use CSS for better performance
