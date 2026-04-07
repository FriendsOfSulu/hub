<script setup lang="ts">
const route = useRoute()

const { data: bundle } = await useAsyncData(route.path, () =>
  queryCollection('bundle').path(route.path).first()
)

const { data: allBundles } = await useAsyncData('bundles-all', () =>
  queryCollection('bundle').all()
)

if (!bundle.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Bundle not found'
  })
}

const bundleValue = computed(() => bundle.value!)

const currentCategorySet = computed(() => {
  const cats = bundle.value?.categories ?? []
  return new Set(cats.map((c: string) => c.toLowerCase()))
})

const similarBundles = computed(() => {
  const list = allBundles.value ?? []
  const currentPath = bundle.value?.path
  const categorySet = currentCategorySet.value
  const scored = list
    .filter(b => b.path !== currentPath)
    .map((b) => {
      const points
        = b.categories?.filter((c: string) => categorySet.has(c.toLowerCase()))
          .length ?? 0
      return { bundle: b, points }
    })
    .filter(({ points }) => points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map(({ bundle: b }) => b)
  return scored
})

const moreBundlesByAuthor = computed(() => {
  const list = allBundles.value ?? []
  const currentPath = bundle.value?.path
  const currentMaintainer = bundle.value?.githubMaintainer?.trim().toLowerCase()

  if (!currentMaintainer) {
    return []
  }

  return list.filter((b) =>
    b.path !== currentPath
    && b.githubMaintainer?.trim().toLowerCase() === currentMaintainer
  )
})

const installCommand = computed(() =>
  bundle.value ? `composer require ${bundle.value.packageName}` : ''
)

const formattedLastRepositoryUpdate = computed(() => {
  const raw = bundle.value?.lastRepositoryUpdate

  if (!raw) {
    return null
  }

  const date = new Date(raw)

  if (Number.isNaN(date.getTime())) {
    return raw
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const suluVersionBadges = useSuluVersions(
  computed(() => bundle.value?.targetSuluVersion)
)

const copyInstallCommand = () => {
  if (!installCommand.value) {
    return
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(installCommand.value)
  }
}

useSeoMeta({
  title: `Sulu Hub - Bundles - ${bundle.value?.title}`,
  description: bundle.value?.shortDescription
})
</script>

<template>
  <UContainer class="py-10">
    <UPage>
      <UPageHeader
        headline="Bundles"
        :title="bundleValue.title"
        :description="bundleValue.shortDescription"
      />

      <UPageBody class="space-y-10">
        <div class="grid gap-6 lg:grid-cols-12">
          <UCard class="lg:col-span-9">
            <template #header>
              <div class="flex items-center justify-between gap-2">
                <span
                  class="text-sm font-semibold uppercase tracking-wide text-gray-500"
                >
                  Bundle overview
                </span>

                <UBadge
                  v-if="bundleValue.license"
                  color="neutral"
                  variant="soft"
                  class="font-mono"
                  :label="bundleValue.license"
                />
              </div>
            </template>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-1">
                <p class="text-xs font-medium uppercase text-gray-500">
                  Package name
                </p>
                <p class="font-mono text-sm break-all">
                  {{ bundleValue.packageName }}
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase text-gray-500">
                  Maintainer
                </p>
                <NuxtLink
                  :to="bundleValue.githubLink"
                  external
                  target="_blank"
                  class="flex items-center gap-2 underline"
                >
                  <UAvatar
                    v-if="bundleValue.githubAvatar"
                    :src="bundleValue.githubAvatar"
                    size="xs"
                  />
                  <span class="text-sm">
                    {{ bundleValue.githubMaintainer }}
                  </span>
                </NuxtLink>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase text-gray-500">
                  Latest release
                </p>
                <p class="text-sm font-medium">
                  {{ bundleValue.latestRelease || "?" }}
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase text-gray-500">
                  Target Sulu version
                </p>
                <div
                  v-if="suluVersionBadges.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <UBadge
                    v-for="version in suluVersionBadges"
                    :key="version"
                    size="sm"
                    variant="soft"
                    class="rounded-full px-2"
                  >
                    {{ version }}
                  </UBadge>
                </div>
                <p
                  v-else
                  class="text-sm font-medium"
                >
                  {{ bundleValue.targetSuluVersion || "?" }}
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase text-gray-500">
                  GitHub stars
                </p>
                <p class="flex items-center gap-1 text-sm font-medium">
                  <UIcon
                    name="i-lucide-star"
                    class="size-4"
                  />
                  <span>
                    {{ bundleValue.githubStars?.toLocaleString?.() ?? "–" }}
                  </span>
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase text-gray-500">
                  Total downloads
                </p>
                <p class="text-sm font-medium">
                  {{ bundleValue.totalDownloads?.toLocaleString?.() ?? "–" }}
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase text-gray-500">
                  Last repository update
                </p>
                <p class="text-sm font-medium">
                  {{ formattedLastRepositoryUpdate ?? "–" }}
                </p>
              </div>

              <div
                v-if="bundleValue.categories?.length > 0"
                class="space-y-1"
              >
                <p class="text-xs font-medium uppercase text-gray-500 pb-1">
                  Categories
                </p>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="category in bundleValue.categories"
                    :key="category"
                    color="primary"
                    variant="soft"
                    :label="category"
                  />

                  <span
                    v-if="!bundleValue.categories?.length"
                    class="text-sm text-gray-500"
                  >
                    –
                  </span>
                </div>
              </div>
            </div>
          </UCard>

          <div class="space-y-4 lg:col-span-3">
            <UCard v-if="bundleValue.githubLink || installCommand">
              <template #header>
                <span
                  class="text-sm font-semibold uppercase tracking-wide text-gray-500"
                >
                  Get the bundle
                </span>
              </template>

              <div class="space-y-3">
                <UButton
                  v-if="bundleValue.githubLink"
                  color="neutral"
                  variant="solid"
                  target="_blank"
                  :to="bundleValue.githubLink"
                  icon="i-simple-icons-github"
                  class="w-full justify-center"
                >
                  View on GitHub
                </UButton>

                <UButton
                  v-if="bundleValue.packageName"
                  color="neutral"
                  variant="outline"
                  target="_blank"
                  :to="`https://packagist.org/packages/${encodeURIComponent(bundleValue.packageName)}`"
                  class="w-full justify-center"
                >
                  View on Packagist
                </UButton>

                <div
                  v-if="installCommand"
                  class="space-y-2"
                >
                  <p class="text-xs font-medium uppercase text-gray-500">
                    Install via Composer
                  </p>
                  <div
                    class="flex items-center gap-2 rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs dark:border-gray-800 dark:bg-gray-900/40"
                  >
                    <span class="truncate">
                      {{ installCommand }}
                    </span>
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-clipboard-document"
                      @click="copyInstallCommand"
                    >
                      Copy
                    </UButton>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <UPageSection
          v-if="moreBundlesByAuthor.length > 0"
          title="More bundles by this author"
          :ui="{
            title: 'lg:text-4xl',
            container: 'pb-2'
          }"
        >
          <UPageGrid
            cols="3"
            class="gap-4 items-stretch"
          >
            <BundleItem
              v-for="b in moreBundlesByAuthor"
              :key="b.path"
              :bundle="b"
            />
          </UPageGrid>
        </UPageSection>

        <UPageSection
          v-if="similarBundles.length > 0"
          title="Similar bundles"
          :ui="{
            title: 'lg:text-4xl',
            container: 'pb-0'
          }"
        >
          <UPageGrid
            cols="3"
            class="gap-4 items-stretch"
          >
            <BundleItem
              v-for="b in similarBundles"
              :key="b.path"
              :bundle="b"
            />
          </UPageGrid>
        </UPageSection>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
