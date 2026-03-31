<script setup>
import IconSulu from './components/IconSulu.vue'

const route = useRoute()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'SuluHub'
const description = 'A collection of community bundles for Sulu CMS.'

const config = useRuntimeConfig()

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
  // ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  // twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  // twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink
          v-if="route.path !== '/'"
          to="/"
        >
          <strong>Sulu<span class="text-green-500">Hub</span></strong>
        </NuxtLink>
        <span v-else />
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          :to="config.public.repositoryUrl"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator :icon="IconSulu" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          FriendsOfSulu © {{ new Date().getFullYear() }}
        </p>
      </template>
      <template #right>
        <NuxtLink
          :to="`${config.public.repositoryUrl}/issues/new`"
          external
          target="_blank"
          class="text-sm text-muted underline"
        >
          Contribute a bundle
        </NuxtLink>
      </template>
    </UFooter>
  </UApp>
</template>
