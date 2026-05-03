import React, { useState } from 'react'
import {
  Button,
  Card,
  Modal,
  Alert,
  Loader,
  Input,
  Select,
  Badge,
  Tabs,
  Accordion,
  AccordionItem,
  ImagePreview,
  DetectionResult,
  DiseaseCard,
  StatCard,
  StatsGrid,
  FileUpload,
  EmptyState,
  SearchBar,
  Tooltip,
  useToast
} from '../components'

/**
 * Example page demonstrating all available components
 * This is a reference implementation showing how to use each component
 */
export default function ComponentsDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { showToast } = useToast()

  // Example detection result data
  const sampleResult = {
    prediction: 'Tomato Late Blight',
    confidence: 0.92,
    treatments: [
      { type: 'Chemical', description: 'Apply copper-based fungicides' },
      { type: 'Cultural', description: 'Improve air circulation and reduce humidity' }
    ],
    lifecycle: {
      pathogen: 'Phytophthora infestans',
      symptoms: 'Dark brown spots on leaves and stems',
      conditions: 'Cool, wet weather'
    },
    metadata: {
      plantType: 'Tomato',
      timestamp: new Date().toISOString()
    }
  }

  // Example disease data
  const sampleDiseases = [
    {
      id: 1,
      name: 'Late Blight',
      plantType: 'Tomato',
      description: 'A serious fungal disease affecting tomato plants',
      severity: 'High',
      icon: '🍅'
    },
    {
      id: 2,
      name: 'Powdery Mildew',
      plantType: 'Grape',
      description: 'White powdery spots on leaves and stems',
      severity: 'Medium',
      icon: '🍇'
    }
  ]

  const handleFileUpload = (file) => {
    const url = URL.createObjectURL(file)
    setSelectedImage(url)
    showToast('Image uploaded successfully!', 'success')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Component Library Demo</h1>
      
      {/* Buttons */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Statistics */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Statistics Cards</h2>
        <StatsGrid columns={4}>
          <StatCard 
            title="Total Scans"
            value="1,234"
            icon="📊"
            trend="up"
            trendValue="12%"
            color="primary"
          />
          <StatCard 
            title="Diseases Found"
            value="89"
            icon="🦠"
            trend="down"
            trendValue="8%"
            color="danger"
          />
          <StatCard 
            title="Healthy Plants"
            value="1,145"
            icon="🌱"
            trend="up"
            trendValue="15%"
            color="success"
          />
          <StatCard 
            title="Accuracy"
            value="94.5%"
            icon="🎯"
            color="primary"
          />
        </StatsGrid>
      </section>

      {/* Search Bar */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Search</h2>
        <SearchBar 
          placeholder="Search diseases..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={(query) => console.log('Searching:', query)}
        />
      </section>

      {/* Alerts */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Alerts</h2>
        <Alert type="success" message="Operation completed successfully!" />
        <Alert type="error" title="Error" message="Something went wrong." />
        <Alert type="warning" message="Please review your input." />
        <Alert type="info" message="Did you know? Early detection saves plants!" />
      </section>

      {/* File Upload */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>File Upload</h2>
        <FileUpload 
          onFileSelect={handleFileUpload}
          label="Upload Plant Image"
          helperText="Drag and drop an image or click to browse"
        />
        {selectedImage && (
          <ImagePreview 
            src={selectedImage}
            onRemove={() => setSelectedImage(null)}
          />
        )}
      </section>

      {/* Inputs */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Form Inputs</h2>
        <div style={{ maxWidth: '500px' }}>
          <Input 
            label="Plant Name"
            placeholder="Enter plant name"
            icon="🌿"
          />
          <Select 
            label="Plant Type"
            options={['Tomato', 'Potato', 'Grape', 'Apple', 'Corn']}
          />
        </div>
      </section>

      {/* Badges */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Badges</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="success">Healthy</Badge>
          <Badge variant="danger">Diseased</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="info">Processing</Badge>
          <Badge variant="primary">New</Badge>
        </div>
      </section>

      {/* Cards */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Card 
            title="Simple Card" 
            subtitle="With subtitle"
            hoverable
          >
            This is a simple card with some content inside.
          </Card>
          <Card 
            title="Card with Footer"
            footer={<Button fullWidth>Action</Button>}
          >
            This card has a footer with an action button.
          </Card>
        </div>
      </section>

      {/* Disease Cards */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Disease Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {sampleDiseases.map(disease => (
            <DiseaseCard 
              key={disease.id}
              disease={disease}
              onClick={() => showToast(`Viewing ${disease.name}`, 'info')}
            />
          ))}
        </div>
      </section>

      {/* Detection Result */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Detection Result</h2>
        <DetectionResult result={sampleResult} />
      </section>

      {/* Tabs */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Tabs</h2>
        <Tabs 
          tabs={[
            { label: 'Overview', icon: '📊', content: <div>Overview content</div> },
            { label: 'Details', icon: '📝', content: <div>Details content</div> },
            { label: 'History', icon: '📅', content: <div>History content</div> }
          ]}
        />
      </section>

      {/* Accordion */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Accordion</h2>
        <Accordion>
          <AccordionItem title="What is plant disease detection?" defaultOpen>
            Plant disease detection uses AI and machine learning to identify diseases in plants
            from images, enabling early intervention and treatment.
          </AccordionItem>
          <AccordionItem title="How accurate is the detection?">
            Our system achieves over 94% accuracy across 38 different plant diseases.
          </AccordionItem>
          <AccordionItem title="What plants are supported?">
            We support 14 different plant species including tomatoes, potatoes, grapes, and more.
          </AccordionItem>
        </Accordion>
      </section>

      {/* Modal */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Modal</h2>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Modal"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p>This is a modal dialog. Click outside or press the X to close it.</p>
        </Modal>
      </section>

      {/* Tooltips */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Tooltips</h2>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', padding: '2rem' }}>
          <Tooltip content="Tooltip on top" position="top">
            <Button>Hover me (Top)</Button>
          </Tooltip>
          <Tooltip content="Tooltip on bottom" position="bottom">
            <Button>Hover me (Bottom)</Button>
          </Tooltip>
          <Tooltip content="Tooltip on left" position="left">
            <Button>Hover me (Left)</Button>
          </Tooltip>
          <Tooltip content="Tooltip on right" position="right">
            <Button>Hover me (Right)</Button>
          </Tooltip>
        </div>
      </section>

      {/* Empty State */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Empty State</h2>
        <Card>
          <EmptyState 
            icon="🔍"
            title="No results found"
            description="Try adjusting your search criteria or upload a new image for detection."
            actionLabel="Upload Image"
            onAction={() => showToast('Upload clicked', 'info')}
          />
        </Card>
      </section>

      {/* Loader */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Loaders</h2>
        <Card>
          <Loader message="Processing image..." />
        </Card>
      </section>

      {/* Toast Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>Toast Notifications</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={() => showToast('Success message!', 'success')}>Success Toast</Button>
          <Button onClick={() => showToast('Error occurred!', 'error')}>Error Toast</Button>
          <Button onClick={() => showToast('Warning message!', 'warning')}>Warning Toast</Button>
          <Button onClick={() => showToast('Info message!', 'info')}>Info Toast</Button>
        </div>
      </section>
    </div>
  )
}
