const selectedSortOptions = [
  'githubStars',
  'totalDownloads',
  'lastRepositoryUpdate'
] as const

const selectedVersionOptions = ['All', '2.x', '3.x'] as const

const selectedCategoryOptions = [
  'All',
  'blog',
  'content',
  'media',
  'form',
  'translation',
  'seo',
  'events',
  'settings',
  'dx'
] as const

type SelectedSort = (typeof selectedSortOptions)[number]
type SelectedVersion = (typeof selectedVersionOptions)[number]
type SelectedCategory = (typeof selectedCategoryOptions)[number]

function isAllowedValue<T extends readonly string[]>(
  value: string,
  options: T
): value is T[number] {
  return options.includes(value as T[number])
}

export function useBundleListState() {
  const selectedSort = useState<SelectedSort>(
    'bundle-list:selected-sort',
    () => 'githubStars'
  )
  const selectedVersion = useState<SelectedVersion>(
    'bundle-list:selected-version',
    () => 'All'
  )
  const selectedCategory = useState<SelectedCategory>(
    'bundle-list:selected-category',
    () => 'All'
  )

  if (import.meta.client) {
    const storedSort = sessionStorage.getItem('bundle-list:selected-sort')
    if (storedSort && isAllowedValue(storedSort, selectedSortOptions)) {
      selectedSort.value = storedSort
    }

    const storedVersion = sessionStorage.getItem('bundle-list:selected-version')
    if (storedVersion && isAllowedValue(storedVersion, selectedVersionOptions)) {
      selectedVersion.value = storedVersion
    }

    const storedCategory = sessionStorage.getItem(
      'bundle-list:selected-category'
    )
    if (
      storedCategory &&
      isAllowedValue(storedCategory, selectedCategoryOptions)
    ) {
      selectedCategory.value = storedCategory
    }

    watch(selectedSort, (value) => {
      sessionStorage.setItem('bundle-list:selected-sort', value)
    })

    watch(selectedVersion, (value) => {
      sessionStorage.setItem('bundle-list:selected-version', value)
    })

    watch(selectedCategory, (value) => {
      sessionStorage.setItem('bundle-list:selected-category', value)
    })
  }

  return {
    selectedSort,
    selectedVersion,
    selectedCategory
  }
}
