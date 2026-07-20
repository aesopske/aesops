import { z } from 'zod'

export const DATASET_CATEGORIES = [
    { value: 'finance', label: 'Finance' },
    { value: 'housing', label: 'Housing' },
    { value: 'demographics', label: 'Demographics' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'environment-climate', label: 'Environment & Climate' },
    { value: 'energy', label: 'Energy' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'trade-economy', label: 'Trade & Economy' },
    { value: 'governance-public-sector', label: 'Governance & Public Sector' },
    { value: 'labor-employment', label: 'Labor & Employment' },
    { value: 'technology', label: 'Technology' },
    { value: 'crime-safety', label: 'Crime & Safety' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' },
] as const

export type DatasetCategory = (typeof DATASET_CATEGORIES)[number]['value']

const CATEGORY_VALUES = DATASET_CATEGORIES.map((c) => c.value) as [
    DatasetCategory,
    ...DatasetCategory[],
]

export const datasetCategorySchema = z.enum(CATEGORY_VALUES)

// Closed vocabulary the classifier picks from — keeps tags consistent and
// filterable instead of drifting into near-duplicate free text over time.
export const DATASET_TAGS = [
    // finance
    'mortgage-rates', 'interest-rates', 'stock-market', 'inflation', 'personal-debt',
    'banking', 'insurance', 'investment-funds', 'currency-exchange', 'credit-scores',
    // housing
    'rental-market', 'home-prices', 'housing-supply', 'homelessness', 'construction-permits',
    'property-tax', 'real-estate-listings',
    // demographics
    'census', 'population-growth', 'migration', 'age-distribution', 'household-income',
    'ethnicity', 'urbanization',
    // education
    'school-enrollment', 'test-scores', 'graduation-rates', 'higher-education',
    'literacy', 'school-funding', 'student-loans',
    // health
    'public-health', 'disease-surveillance', 'healthcare-access', 'mental-health',
    'life-expectancy', 'vaccination', 'hospital-capacity',
    // agriculture
    'crop-yields', 'livestock', 'food-security', 'farm-subsidies', 'irrigation',
    // environment & climate
    'air-quality', 'water-quality', 'carbon-emissions', 'deforestation',
    'weather-patterns', 'natural-disasters', 'biodiversity', 'waste-management',
    // energy
    'electricity-generation', 'renewable-energy', 'fossil-fuels', 'energy-consumption',
    'fuel-prices',
    // transportation
    'public-transit', 'traffic-accidents', 'road-infrastructure', 'aviation',
    'vehicle-registration', 'commute-patterns',
    // trade & economy
    'gdp', 'imports-exports', 'exchange-rates', 'economic-growth', 'consumer-spending',
    'business-registrations', 'supply-chain',
    // governance & public sector
    'election-results', 'government-spending', 'public-budgets', 'voter-registration',
    'legislation', 'court-records', 'public-procurement',
    // labor & employment
    'unemployment', 'wages', 'job-postings', 'labor-force-participation',
    'workplace-safety', 'union-membership',
    // technology
    'internet-access', 'mobile-usage', 'software-adoption', 'cybersecurity-incidents',
    'ai-adoption', 'digital-payments',
    // crime & safety
    'crime-rates', 'police-activity', 'incarceration', 'emergency-response',
    'fire-incidents',
    // research
    'survey-data', 'clinical-trials', 'academic-publications', 'experimental-results',
] as const

export type DatasetTag = (typeof DATASET_TAGS)[number]

const TAG_VALUES = DATASET_TAGS as unknown as [DatasetTag, ...DatasetTag[]]

export const datasetTagSchema = z.enum(TAG_VALUES)
