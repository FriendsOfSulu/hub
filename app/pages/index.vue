<template>
  <div>
    <UPageHero
      description="A collection of community bundles and resources for Sulu CMS."
      orientation="horizontal"
      :links="[
        {
          label: `Browse ${bundles.length} bundles`,
          to: '#bundles',
          trailingIcon: 'i-lucide-arrow-down',
          size: 'xl'
        },
        {
          label: 'About',
          to: '#about',
          size: 'xl',
          variant: 'outline'
        }
      ]"
    >
      <template #title>
        Sulu<span class="text-green-500">Hub</span>
      </template>
      <HeroOrbit />
    </UPageHero>

    <BundleList :bundles="bundles" />
    <AboutGrid />
  </div>
</template>

<script setup lang="ts">
const { data: bundles } = await useAsyncData(() =>
  queryCollection('bundle').all()
)
</script>
