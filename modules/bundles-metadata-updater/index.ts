import { defineNuxtModule, createResolver } from 'nuxt/kit'

export interface BundlesMetadataUpdaterModuleOptions {
  /**
   * Maximum age of cached data in hours before a new refresh is allowed.
   */
  maxAgeHours?: number
  /**
   * Force a refresh even if the `.timestamp` file is considered fresh.
   */
  force?: boolean
}

export default defineNuxtModule<BundlesMetadataUpdaterModuleOptions>({
  meta: {
    name: 'bundles-metadata-updater'
  },
  defaults: {
    maxAgeHours: 24,
    force: false
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimePath = resolver.resolve('./runtime/server/bundlesMetadataUpdater')

    const { runBundlesMetadataUpdater } = await import(runtimePath)

    const maxAgeMs
      = typeof options.maxAgeHours === 'number'
        ? options.maxAgeHours * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000

    const logger
      = nuxt.options.dev || nuxt.options.debug
        ? (message: string) => {
            console.info(message)
          }
        : () => {}

    await runBundlesMetadataUpdater({
      rootDir: nuxt.options.rootDir,
      force: options.force,
      maxAgeMs,
      logger
    })
  }
})
