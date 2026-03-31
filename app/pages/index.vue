<template>
  <div>
    <UPageHero
      description="A collection of community bundles for Sulu CMS."
      orientation="horizontal"
      :links="[
        {
          label: `Browse ${bundles.length} bundles`,
          to: '#bundles',
          trailingIcon: 'i-lucide-arrow-down',
          size: 'xl'
        }
      ]"
    >
      <template #title>
        Sulu<span class="text-green-500">Hub</span>
      </template>
      <HeroOrbit />
    </UPageHero>

    <BundleList :bundles="bundles" />

    <UContainer class="pt-0 pb-10">
      <UPageCTA
        title="About Sulu Hub"
        description="This page is intended for developers who want to share their contributions with the Sulu CMS ecosystem.

It is a community-driven project and is not affiliated with Sulu GmbH, the company maintaining Sulu CMS.

While we aim to provide a useful collection of community bundles, we cannot guarantee that it is complete. Feedback, suggestions, and contributions from the community are always welcome."
        variant="subtle"
        :links="[
          {
            label: 'Suggest a bundle',
            to: 'https://github.com/robole-dev/sulu-hub',
            target: '_blank',
            icon: 'i-lucide-plus',
            color: 'neutral',
            variant: 'outline'
          },
          {
            label: 'More resources on @FriendsOfSulu',
            to: 'https://github.com/FriendsOfSulu/',
            target: '_blank',
            trailingIcon: 'i-simple-icons-github',
            color: 'neutral'
          }
        ]"
      />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { data: bundles } = await useAsyncData(() =>
  queryCollection('bundle').all()
)
</script>
