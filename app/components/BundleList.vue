<template>
  <UPageSection id="bundles">
    <div class="flex flex-col align-start lg:flex-row gap-8">
      <UDrawer
        v-model:open="filterDrawerOpen"
        direction="left"
        :handle="false"
        class="lg:hidden"
      >
        <UButton
          icon="i-lucide-search"
          label="Filter"
          color="neutral"
          variant="outline"
          class="absolute"
        />

        <template #content>
          <div class="flex flex-col gap-4 py-6 px-4 overflow-y-auto">
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="outline"
              class="self-end"
              @click="filterDrawerOpen = false"
            />
            <UNavigationMenu
              v-model="selectedCategory"
              orientation="vertical"
              :items="categoryItems"
            />
            <UNavigationMenu
              v-model="selectedVersion"
              orientation="vertical"
              :items="versionItems"
            />
          </div>
        </template>
      </UDrawer>
      <div
        class="hidden lg:flex w-64 flex-shrink-0 flex-col gap-4 pb-4 sticky top-[calc(var(--ui-header-height)_+_1rem)] h-fit max-h-[calc(100vh_-_var(--ui-header-height)_-_1rem)] overflow-y-auto"
      >
        <UNavigationMenu
          v-model="selectedCategory"
          orientation="vertical"
          :items="categoryItems"
        />
        <UNavigationMenu
          v-model="selectedVersion"
          orientation="vertical"
          :items="versionItems"
        />
      </div>
      <UPageBody class="flex-1 mt-0 space-y-6">
        <div class="flex justify-end">
          <div class="font-semibold text-xs/5 text-highlighted px-2.5 py-1.5">
            <span class="truncate">Sort by:</span>
          </div>
          <UTabs
            v-model="selectedSort"
            :content="false"
            :items="sortItems"
            size="xs"
          />
        </div>
        <UPageGrid
          v-if="filteredBundles.length > 0"
        >
          <BundleItem
            v-for="bundle in filteredBundles"
            :key="bundle.path"
            :bundle="bundle"
          />
        </UPageGrid>
        <div
          v-else
          class="text-center text-muted"
        >
          <UIcon
            name="i-lucide-package-search"
            class="size-10"
          />
          <p class="text-xl">
            No bundles found
          </p>
        </div>
      </UPageBody>
    </div>
  </UPageSection>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { BundleCollectionItem, NavigationMenuItem } from '@nuxt/content'

const props = defineProps<{
  bundles: BundleCollectionItem[] | undefined
}>()

const bundles = computed(() => props.bundles ?? [])

const filterDrawerOpen = ref(false)

const selectedSort = ref('githubStars')

const sortItems = ref<TabsItem[]>([
  {
    label: 'Stars',
    value: 'githubStars'
  },
  {
    label: 'Downloads',
    value: 'totalDownloads'
  },
  {
    label: 'Last update',
    value: 'lastRepositoryUpdate'
  }
])

const selectedVersion = ref('All')

const versionItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Supported Sulu version:',
    type: 'label'
  },
  {
    label: 'All',
    onClick: () => {
      selectedVersion.value = 'All'
    },
    ...(selectedVersion.value === 'All' && { active: true })
    // @todo Add <USeparator /> below
  },
  {
    label: '2.x',
    onClick: () => {
      selectedVersion.value = '2.x'
    },
    ...(selectedVersion.value === '2.x' && { active: true })
  },
  {
    label: '3.x',
    onClick: () => {
      selectedVersion.value = '3.x'
    },
    ...(selectedVersion.value === '3.x' && { active: true })
  }
])

const selectedCategory = ref('All')

const categoryItems = computed<NavigationMenuItem[]>(() => {
  return [
    {
      label: 'Filter by category:',
      type: 'label'
    },
    {
      label: 'All',
      onClick: () => {
        selectedCategory.value = 'All'
      },
      tooltip: 'All categories',
      ...(selectedCategory.value === 'All' && { active: true })
      // @todo Add <USeparator /> below
    },
    {
      label: 'Blog',
      icon: 'i-lucide-newspaper',
      onClick: () => {
        selectedCategory.value = 'blog'
      },
      ...(selectedCategory.value === 'blog' && { active: true })
    },
    {
      label: 'Content',
      icon: 'i-lucide-file-text',
      onClick: () => {
        selectedCategory.value = 'content'
      },
      ...(selectedCategory.value === 'content' && { active: true })
    },
    {
      label: 'Media',
      icon: 'i-lucide-image',
      onClick: () => {
        selectedCategory.value = 'media'
      },
      ...(selectedCategory.value === 'media' && { active: true })
    },
    {
      label: 'Form',
      icon: 'i-lucide-form-input',
      onClick: () => {
        selectedCategory.value = 'form'
      },
      ...(selectedCategory.value === 'form' && { active: true })
    },
    {
      label: 'Translation',
      icon: 'i-lucide-languages',
      onClick: () => {
        selectedCategory.value = 'translation'
      },
      ...(selectedCategory.value === 'translation' && { active: true })
    },
    {
      label: 'SEO',
      icon: 'i-lucide-search',
      onClick: () => {
        selectedCategory.value = 'seo'
      },
      ...(selectedCategory.value === 'seo' && { active: true })
    },
    {
      label: 'Events',
      icon: 'i-lucide-calendar-clock',
      onClick: () => {
        selectedCategory.value = 'events'
      },
      ...(selectedCategory.value === 'events' && { active: true })
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings-2',
      onClick: () => {
        selectedCategory.value = 'settings'
      },
      ...(selectedCategory.value === 'settings' && { active: true })
    },
    {
      label: 'DX',
      icon: 'i-lucide-code-2',
      onClick: () => {
        selectedCategory.value = 'dx'
      },
      ...(selectedCategory.value === 'dx' && { active: true })
    }
  ]
})

const filteredBundles = computed(() => {
  if (!bundles.value) return []

  let result = bundles.value.slice()

  if (selectedCategory.value !== 'All') {
    result = result.filter((bundle) => {
      const bundleCategories = bundle.categories || []
      return bundleCategories
        .map((cat: string) => cat.toLowerCase())
        .includes(selectedCategory.value.toLowerCase())
    })
  }

  if (selectedVersion.value !== 'All') {
    result = result.filter((bundle) => {
      if (selectedVersion.value === '2.x') {
        return bundle.targetSuluVersion?.includes('^2.')
      }

      if (selectedVersion.value === '3.x') {
        return bundle.targetSuluVersion?.includes('^3.')
      }

      return true
    })
  }

  result.sort((a, b) => {
    switch (selectedSort.value) {
      case 'githubStars':
        return (b.githubStars || 0) - (a.githubStars || 0)
      case 'totalDownloads':
        return (b.totalDownloads || 0) - (a.totalDownloads || 0)
      case 'lastRepositoryUpdate':
      default: {
        const aTime = a.lastRepositoryUpdate
          ? new Date(a.lastRepositoryUpdate).getTime()
          : 0
        const bTime = b.lastRepositoryUpdate
          ? new Date(b.lastRepositoryUpdate).getTime()
          : 0

        return bTime - aTime
      }
    }
  })

  return result
})
</script>
