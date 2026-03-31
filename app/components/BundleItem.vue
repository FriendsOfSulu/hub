<template>
  <NuxtLink :to="bundle.path">
    <UPageCard
      :title="title"
      :description="bundle.shortDescription"
      spotlight-color="primary"
      class="h-full flex flex-col cursor-pointer hover:bg-elevated transition-colors"
    >
      <template
        v-if="bundle.targetSuluVersion"
        #header
      >
        <UBadge
          size="xs"
          variant="outline"
        >
          Sulu {{ bundle.targetSuluVersion }}
        </UBadge>
      </template>

      <template #footer>
        <div class="flex gap-4">
          <span
            v-if="bundle.githubMaintainer"
            class="flex items-center gap-2 text-muted transition-colors truncate"
          >
            <UAvatar
              v-if="bundle.githubAvatar"
              :src="bundle.githubAvatar"
              size="xs"
            />
            <span class="truncate">@{{ bundle.githubMaintainer }}</span>
          </span>
          <span class="flex items-center gap-1 text-muted ml-auto">
            <UIcon
              name="i-lucide-download"
              class="size-4"
            />
            {{ parseInt(bundle.totalDownloads.toString()).toLocaleString() }}
          </span>
          <span class="flex items-center gap-1 text-muted">
            <UIcon
              name="i-lucide-star"
              class="size-4"
            />
            {{ bundle.githubStars }}
          </span>
        </div>
      </template>
    </UPageCard>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BundleCollectionItem } from '@nuxt/content'

const props = defineProps<{
  bundle: BundleCollectionItem
}>()

const to = computed(() => `/${props.bundle.path.split('/').pop() || ''}`)

const title = computed(() =>
  props.bundle.title.startsWith('Sulu')
    ? props.bundle.title.replace('Sulu', '')
    : props.bundle.title
)
</script>
