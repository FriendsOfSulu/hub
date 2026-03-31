import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function useSuluVersions(
  targetSuluVersion: MaybeRefOrGetter<string | null | undefined>
) {
  return computed(() => {
    const target = toValue(targetSuluVersion)

    if (!target) return []

    const versions: string[] = []

    if (target.includes('2.')) {
      versions.push('2.x')
    }

    if (target.includes('3.')) {
      versions.push('3.x')
    }

    return versions
  })
}
