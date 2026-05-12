import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'
import { projectId, dataset, apiVersion } from './src/sanity/env'

export default defineConfig({
  name: 'default',
  title: 'RR Granites Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
})
