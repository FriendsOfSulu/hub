<template>
  <div class="hero-orbit-container">
    <div class="hero-orbit hero-orbit--outest" />
    <div class="hero-orbit hero-orbit--outer" />
    <div class="hero-orbit hero-orbit--inner" />
    <div class="hero-orbit__icons">
      <div
        class="hero-orbit__icon bg-white dark:bg-slate-700 text-green-600 dark:text-slate-300"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-languages"
          class="size-8"
        />
      </div>
      <div
        class="hero-orbit__icon bg-white dark:bg-slate-700 text-green-600 dark:text-slate-300"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-code-2"
          class="size-14"
        />
      </div>
      <div
        class="hero-orbit__icon bg-white dark:bg-slate-700 text-green-600 dark:text-slate-300"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-calendar-clock"
          class="size-11"
        />
      </div>
      <div
        class="hero-orbit__icon bg-white dark:bg-slate-700 text-green-600 dark:text-slate-300"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-plug"
          class="size-12"
        />
      </div>
    </div>
    <div class="hero-logo" />
  </div>
</template>

<style scoped lang="css">
.hero-orbit-container {
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
  width: 60%;
  height: 100%;
  background: linear-gradient(
    -45deg,
    var(--color-green-700),
    var(--color-green-500),
    var(--color-green-100)
  );
  background-size: 300% 300%;
  animation: gradient 6s ease infinite;
}

.hero-orbit {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid rgb(157, 171, 191);
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

.hero-orbit__icon:nth-child(1) {
  top: 14%;
  left: 18%;
}
.hero-orbit__icon:nth-child(2) {
  top: 5%;
  right: 16%;
  animation-delay: 1.5s;
}
.hero-orbit__icon:nth-child(3) {
  bottom: 0;
  left: 18%;
  animation-delay: 3s;
}
.hero-orbit__icon:nth-child(4) {
  bottom: 2%;
  right: 2%;
  animation-delay: 4.5s;
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
