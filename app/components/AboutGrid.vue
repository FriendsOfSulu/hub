<template>
  <UContainer
    id="about"
    class="mb-14 bg-elevated/50 rounded-lg py-12 max-w-(--hero-container)"
  >
    <UPageGrid>
      <UPageCard
        title="About Sulu Hub"
        class="lg:col-span-3"
        variant="ghost"
        :ui="{
          title: 'text-4xl font-bold'
        }"
      >
        <template #footer>
          <p class="text-lg text-toned">
            A place for developers to share their contributions with the <NuxtLink
              to="https://sulu.io"
              external
              target="_blank"
              class="underline text-primary"
            >Sulu CMS</NuxtLink> ecosystem.
          </p>
          <span class="text-lg text-toned inline-flex items-center flex-wrap justify-start gap-1 pb-4">
            The hub is maintained by the
            <NuxtLink
              to="https://github.com/FriendsOfSulu"
              external
              target="_blank"
              class="underline text-primary"
            >FriendsOfSulu</NuxtLink>
            <UAvatarGroup size="2xs">
              <UAvatar
                src="https://avatars.githubusercontent.com/u/141835158?s=200&v=4"
                alt="FriendsOfSulu user avatar"
                loading="lazy"
              />
              <UAvatar
                src="https://avatars.githubusercontent.com/u/142887197?v=4"
                alt="FriendsOfSulu user avatar"
                loading="lazy"
              />
              <UAvatar
                src="https://avatars.githubusercontent.com/u/9395097?s=96&v=4"
                alt="FriendsOfSulu user avatar"
                loading="lazy"
                class="opacity-70"
              />
              <UAvatar
                src="https://avatars.githubusercontent.com/u/1698337?s=96&v=4"
                alt="FriendsOfSulu user avatar"
                loading="lazy"
                class="opacity-30"
              />
            </UAvatarGroup>
            community.
          </span>

          <!-- <p v-if="false" class="text-lg text-toned pt-2">
            It may be extended in future to provide more helpful information on getting started, best practices, and other resources, such as snippets, blog posts or videos.
          </p> -->
        </template>
      </UPageCard>
      <UPageCard
        title="Contribute a bundle"
        description="Sulu Hub lives from your contributions. Got feedback, ideas or want to contribute a new bundle? Let's talk!"
        :ui="{
          title: 'text-2xl font-bold pb-4',
          container: 'md:py-4',
          description: 'text-base'
        }"
      >
        <template #footer>
          <div class="flex flex-col gap-2 items-start">
            <UButton
              :to="`${config.public.repositoryUrl}/issues/new`"
              external
              target="_blank"
              icon="i-lucide-plus"
              class="mt-2"
              color="neutral"
            >
              Open an issue
            </UButton>
          </div>
        </template>
      </UPageCard>

      <UPageCard
        title="Reach out to the community"
        class="lg:col-span-2"
        :ui="{
          title: 'text-2xl font-bold',
          container: 'md:py-4'
        }"
      >
        <template #footer>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2 items-start">
              <p>Ask questions and get support on:</p>
              <div class="flex flex-wrap gap-2">
                <UButton
                  to="https://sulu-io.slack.com/"
                  target="_blank"
                  icon="i-simple-icons-slack"
                  class="bg-[#481449] hover:bg-[#601e61] dark:text-white"
                >
                  Slack
                </UButton>
                <UButton
                  to="https://github.com/sulu"
                  target="_blank"
                  icon="i-simple-icons-github"
                  color="neutral"
                >
                  Official Sulu organization
                </UButton>
              </div>
            </div>
            <div class="flex flex-col gap-2 items-start">
              <p>Learning resources:</p>

              <div class="flex flex-wrap gap-2">
                <UButton
                  to="https://docs.sulu.io/3.x/"
                  target="_blank"
                  icon="i-lucide-book"
                  variant="outline"
                  color="neutral"
                >
                  Official documentation
                </UButton>
                <UButton
                  to="https://github.com/FriendsOfSulu#keynotes"
                  target="_blank"
                  icon="i-lucide-newspaper"
                  variant="outline"
                  color="neutral"
                >
                  Keynotes, blog posts &amp; podcasts
                </UButton>
                <UButton
                  to="https://github.com/sulu/sulu-workshop/pulls"
                  target="_blank"
                  icon="i-lucide-braces"
                  variant="outline"
                  color="neutral"
                >
                  Sulu workshop (2.x)
                </UButton>
                <UButton
                  to="https://github.com/sulu/sulu-demo/pulls"
                  target="_blank"
                  icon="i-lucide-braces"
                  variant="outline"
                  color="neutral"
                >
                  Sulu demo (2.x)
                </UButton>
              </div>
            </div>
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
  </UContainer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>
