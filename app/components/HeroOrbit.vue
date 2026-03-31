<template>
  <div class="hero-logo-orbit">
    <div class="hero-orbit hero-orbit--outest"></div>
    <div class="hero-orbit hero-orbit--outer">
      <div
        class="hero-orbit__icon hero-orbit__icon--outer-one bg-white dark:bg-green-700 text-green-600 dark:text-slate-400"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-languages"
          class="size-8"
        />
      </div>
      <div
        class="hero-orbit__icon hero-orbit__icon--outer-two bg-white dark:bg-green-700 text-green-600 dark:text-slate-400"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-plug"
          class="size-9"
        />
      </div>
    </div>
    <div class="hero-orbit hero-orbit--inner">
      <div
        class="hero-orbit__icon hero-orbit__icon--inner-one bg-white dark:bg-green-700 text-green-600 dark:text-slate-400"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-code-2"
          class="size-14"
        />
      </div>
      <div
        class="hero-orbit__icon hero-orbit__icon--inner-two bg-white dark:bg-green-700 text-green-600 dark:text-slate-400"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-calendar-clock"
          class="size-12"
        />
      </div>
    </div>
    <div class="hero-logo" />
  </div>
</template>

<style scoped lang="css">
.hero-logo-orbit {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-logo {
  position: relative;
  z-index: 2;
  mask: url("/sulu.svg") 0 0/100% 100%;
  width: 70%;
  height: 100%;
  background: linear-gradient(
    -45deg,
    var(--color-green-700),
    var(--color-green-600),
    var(--color-green-500)
  );
  background-size: 300% 300%;
  animation: gradient 6s ease infinite;
}

.hero-orbit {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid rgba(148, 163, 184, 1);
  z-index: 1;
}

.hero-orbit--inner {
  transform: scale(0.8);
}

.hero-orbit--outer {
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.hero-orbit--outest {
  border: 1px solid rgba(148, 163, 184, 0.2);
  transform: scale(1.2);
}

.hero-orbit__icon {
  position: absolute;
  z-index: 10;
  display: grid;
  place-items: center;
  border-radius: 9999px;
  padding: 10px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
  transform: translate(-50%, -50%);
  animation: orbit-float 6s ease-in-out infinite;
}

.hero-orbit__icon--outer-one {
  top: 14%;
  left: 18%;
}

.hero-orbit__icon--outer-two {
  bottom: 18%;
  right: 6%;
}

.hero-orbit__icon--inner-one {
  top: 6%;
  right: 16%;
}

.hero-orbit__icon--inner-two {
  bottom: 1%;
  left: 18%;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes orbit-float {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-6px);
  }
}
</style>
