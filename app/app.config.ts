export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    pageHero: {
      slots: {
        container:
          'flex flex-col lg:grid py-12 md:py-18 lg:py-20 lg:pb-8 gap-16 sm:gap-y-24 max-w-(--hero-container)'
      }
    },
    pageGrid: {
      base: 'relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch'
    },
    pageCard: {
      slots: {
        footer: 'w-full',
        header: 'mb-2',
        container:
          'relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 md:py-3'
      },
      variants: {
        variant: {
          outline: {
            description: 'text-slate'
          }
        }
      }
    }
  }
})
