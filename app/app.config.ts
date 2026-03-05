export default defineAppConfig({
  ui: {
    colors: {
      primary: "green",
      neutral: "slate",
    },
    pageHero: {
      slots: {
        container:
          "flex flex-col lg:grid py-12 sm:py-20 lg:py-32 lg:pb-8 gap-16 sm:gap-y-24 max-w-(--hero-container)",
      },
    },
    pageCard: {
      slots: {
        footer: "w-full",
        header: "mb-2",
        container:
          "relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 md:py-3",
      },
      variants: {
        variant: {
          outline: {
            description: "text-slate",
          },
        },
      },
    },
  },
});
