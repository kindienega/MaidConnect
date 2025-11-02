# Component Architecture Plan: Reusing AddisBroker for MaidConnect

## Visual Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     SHARED COMPONENT LIBRARY                     │
│                    (/components/shared)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │   Forms/UI      │  │   Listings      │  │    Profile      │   │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤   │
│  │ MultiStepWizard │  │ SearchableList  │  │ ProfileSection  │   │
│  │ FileUpload      │  │ FilterBar       │  │ DocumentUpload  │   │
│  │ FormField       │  │ CardGrid        │  │ StatusBadge     │   │
│  │ Validation      │  │ Pagination      │  │ EditMode        │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │                    │
                            ▼                    ▼
        ┌───────────────────────────┐  ┌───────────────────────────┐
        │     ADDISBROKER APP        │  │    MAIDCONNECT APP        │
        │  (/components/broker)      │  │  (/components/worker)     │
        ├───────────────────────────┤  ├───────────────────────────┤
        │                           │  │                           │
        │ BrokerInfoTab ──────────┐ │  │ WorkerProfileWizard ──────┼─┐
        │   ├─ Uses: ProfileSection │  │   ├─ Uses: MultiStepWizard│ │
        │   ├─ Uses: FileUpload     │  │   ├─ Uses: FileUpload     │ │
        │   └─ Uses: FormField     │  │   └─ Uses: FormField      │ │
        │                           │  │                           │ │
        │ PropertiesClient ────────┼─┐│ WorkersListing ────────────┼─┤
        │   ├─ Uses: SearchableList│ ││   ├─ Uses: SearchableList │ │
        │   ├─ Uses: FilterBar     │ ││   ├─ Uses: FilterBar       │ │
        │   └─ Uses: CardGrid      │ ││   └─ Uses: CardGrid       │ │
        │                           │ ││                           │ │
        │ PropertyCard ─────────────┼─┘│ WorkerCard ────────────────┘ │
        │   (specific to properties)│  │   (specific to workers)       │
        └───────────────────────────┘  └───────────────────────────┘
```

## Component Transformation Map

### 1. Broker Profile → Worker Profile

**Before (AddisBroker):**
```tsx
// Single form in BrokerInfoTab.tsx
<Form>
  <Input name="companyName" />
  <Input name="description" />
  <Input name="specialties" />
  <Input name="yearsOfExperience" />
  <FileUpload name="license" />
  <FileUpload name="businessCard" />
</Form>
```

**After (Shared + MaidConnect):**
```tsx
// Step 1-7 Wizard using shared components
<MultiStepWizard steps={7}>
  <Step1>
    <FormField label="Name" />
    <FormField label="Phone" />
    <FormField label="Email" />
  </Step1>
  <Step2>
    <FormField label="Bio" />
    <FormField label="Location" />
    <FormField label="Expected Salary" />
  </Step2>
  ...
  <Step5>
    <FileUpload label="ID Card" />
  </Step5>
  <Step6>
    <FileUpload label="Certificates" />
  </Step6>
</MultiStepWizard>
```

### 2. Properties Listing → Workers/Jobs Listing

**Before (AddisBroker):**
```tsx
// PropertiesClient.tsx
<SearchableList
  items={properties}
  filters={['propertyType', 'location', 'priceRange']}
  renderCard={(property) => <PropertyCard property={property} />}
/>
```

**After (Shared + MaidConnect):**
```tsx
// WorkersListing.tsx (reuses SearchableList)
<SearchableList
  items={workers}
  filters={['skills', 'location', 'salaryRange', 'workType']}
  renderCard={(worker) => <WorkerCard worker={worker} />}
/>

// JobsListing.tsx (also reuses SearchableList)
<SearchableList
  items={jobs}
  filters={['requiredSkills', 'location', 'salaryRange', 'workType']}
  renderCard={(job) => <JobCard job={job} />}
/>
```

## File Structure Recommendation

```
frontend/
├── components/
│   ├── shared/                    # NEW: Shared components
│   │   ├── forms/
│   │   │   ├── MultiStepWizard.tsx
│   │   │   ├── FormStep.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── FormField.tsx
│   │   ├── listings/
│   │   │   ├── SearchableList.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── CardGrid.tsx
│   │   │   └── Pagination.tsx
│   │   └── profile/
│   │       ├── ProfileSection.tsx
│   │       ├── DocumentUpload.tsx
│   │       └── StatusBadge.tsx
│   │
│   ├── broker/                    # AddisBroker specific
│   │   ├── BrokerInfoTab.tsx     # Uses shared ProfileSection
│   │   └── broker-property-card.tsx
│   │
│   ├── worker/                    # MaidConnect specific
│   │   ├── WorkerProfileWizard.tsx # Uses shared MultiStepWizard
│   │   ├── WorkerCard.tsx         # Uses shared CardGrid
│   │   └── WorkersListing.tsx     # Uses shared SearchableList
│   │
│   └── property/                   # AddisBroker specific
│       ├── PropertyCard.tsx
│       └── PropertiesClient.tsx   # Refactor to use shared SearchableList
│
├── app/
│   ├── brokers/                   # AddisBroker routes
│   ├── properties/                # AddisBroker routes
│   └── workers/                    # MaidConnect routes (NEW)
│       ├── page.tsx               # Uses WorkersListing
│       ├── [id]/
│       │   └── page.tsx           # Worker detail page
│       └── profile/
│           └── page.tsx            # Uses WorkerProfileWizard
│
└── lib/
    ├── shared/                     # NEW: Shared utilities
    │   ├── form-validation.ts
    │   ├── file-upload.ts
    │   └── search-filters.ts
    └── ...
```

## Implementation Phases

### Phase 1: Extract & Create Shared Components (Week 1-2)

**Priority 1: Forms**
1. Extract `MultiStepWizard` from broker profile pattern
2. Create generic `FileUpload` component
3. Create `FormField` wrapper with validation

**Priority 2: Listings**
1. Extract search/filter logic to `SearchableList`
2. Create reusable `FilterBar` component
3. Create `CardGrid` layout component

**Priority 3: Profile**
1. Extract profile sections to `ProfileSection`
2. Create `DocumentUpload` component
3. Create `StatusBadge` component

### Phase 2: Build MaidConnect Components (Week 2-3)

**Worker Profile:**
```tsx
// components/worker/WorkerProfileWizard.tsx
import { MultiStepWizard, FormStep, FileUpload } from '@/components/shared/forms';

export function WorkerProfileWizard() {
  const steps = [
    { id: 1, title: 'Basic Info', component: Step1BasicInfo },
    { id: 2, title: 'Background', component: Step2Background },
    { id: 3, title: 'Education & Experience', component: Step3Education },
    { id: 4, title: 'Skills & Services', component: Step4Skills },
    { id: 5, title: 'ID Verification', component: Step5ID },
    { id: 6, title: 'Documents', component: Step6Documents },
    { id: 7, title: 'Review & Submit', component: Step7Review },
  ];
  
  return <MultiStepWizard steps={steps} />;
}
```

**Workers Listing:**
```tsx
// components/worker/WorkersListing.tsx
import { SearchableList, FilterBar, CardGrid } from '@/components/shared/listings';
import { WorkerCard } from './WorkerCard';

export function WorkersListing() {
  return (
    <SearchableList
      endpoint="/api/workers"
      filters={workerFilters}
      renderCard={(worker) => <WorkerCard worker={worker} />}
    />
  );
}
```

### Phase 3: Refactor AddisBroker (Week 3-4)

Update existing AddisBroker components to use shared components:

```tsx
// components/broker/BrokerInfoTab.tsx (Refactored)
import { ProfileSection, FileUpload } from '@/components/shared/profile';

export function BrokerInfoTab() {
  return (
    <ProfileSection>
      {/* Now uses shared components */}
      <FileUpload label="License" />
      <FileUpload label="Business Card" />
    </ProfileSection>
  );
}
```

```tsx
// app/properties/properties-client.tsx (Refactored)
import { SearchableList } from '@/components/shared/listings';
import { PropertyCard } from '@/components/property/PropertyCard';

export function PropertiesClient() {
  return (
    <SearchableList
      endpoint="/api/properties"
      filters={propertyFilters}
      renderCard={(property) => <PropertyCard property={property} />}
    />
  );
}
```

## Data Model Mapping

### Profile Fields

| AddisBroker (Broker) | MaidConnect (Worker) | Shared Component |
|---------------------|---------------------|------------------|
| `companyName` | - | FormField (text) |
| `description` | `bio` | FormField (textarea) |
| `specialties` | `skills[]` | FormField (multi-select) |
| `yearsOfExperience` | `experienceYears` | FormField (number) |
| `license` (file) | `idCard` (file) | FileUpload |
| `businessCard` (file) | `certificates[]` (files) | FileUpload |

### Listing Filters

| AddisBroker (Properties) | MaidConnect (Workers) | MaidConnect (Jobs) |
|-------------------------|----------------------|-------------------|
| `propertyType` | - | `workType` |
| `location` | `location` | `location` |
| `priceRange` | `salaryRange` | `salaryRange` |
| `bedrooms` | - | - |
| `bathrooms` | - | - |
| - | `skills[]` | `requiredSkills[]` |
| - | `availability` | `status` |
| - | `rating` | - |

## API Integration Pattern

### Shared API Utilities

```typescript
// lib/shared/api-client.ts
export class SearchableListClient<T> {
  async search(filters: SearchFilters): Promise<PaginatedResponse<T>> {
    // Generic search logic
  }
  
  async getById(id: string): Promise<T> {
    // Generic get by ID
  }
}

// Usage in MaidConnect
const workersClient = new SearchableListClient<Worker>('/api/workers');
const jobsClient = new SearchableListClient<Job>('/api/jobs');

// Usage in AddisBroker
const propertiesClient = new SearchableListClient<Property>('/api/properties');
```

## Testing Strategy

### Shared Component Tests
```typescript
// __tests__/shared/MultiStepWizard.test.tsx
describe('MultiStepWizard', () => {
  it('should work for broker profile (1 step)', () => {});
  it('should work for worker profile (7 steps)', () => {});
});
```

### Integration Tests
```typescript
// __tests__/worker/WorkerProfileWizard.test.tsx
describe('WorkerProfileWizard', () => {
  it('should complete all 7 steps', () => {});
  it('should validate each step', () => {});
});
```

## Migration Checklist

- [ ] Create `/components/shared` directory structure
- [ ] Extract `MultiStepWizard` component
- [ ] Extract `FileUpload` component
- [ ] Extract `SearchableList` component
- [ ] Extract `FilterBar` component
- [ ] Create `WorkerProfileWizard` using shared components
- [ ] Create `WorkersListing` using shared components
- [ ] Refactor `BrokerInfoTab` to use shared components
- [ ] Refactor `PropertiesClient` to use shared components
- [ ] Update tests for shared components
- [ ] Update documentation

---

*This architecture plan supports both applications while maximizing code reuse and maintainability.*

