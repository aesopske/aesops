'use client'

// import all the project visualization components and depending on the project render the appropriate component
import React, { useMemo } from 'react'
import OilPrices from '../templates/Oilprices'

interface VisualizationSelectorProps {
    project: string
    endpoint: string
}

function VisualizationSelector({
    project,
    endpoint,
}: VisualizationSelectorProps) {
    const ProjectComponent = useMemo(() => {
        const projectComponents = {
            'oil-prices': OilPrices,
        }
        return projectComponents[project]
    }, [project])

    if (ProjectComponent && endpoint) {
        return <ProjectComponent endpoint={endpoint} />
    }

    return null
}

export default VisualizationSelector
