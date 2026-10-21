<template>
  <footer :class="['flex flex-col lg:grid lg:grid-cols-3 items-center gap-4 px-4 sm:px-8 py-6 text-center lg:text-left', theme === 'dark' ? 'bg-transparent text-white' : 'bg-footer shadow-sm text-button-primary']">
    <span :class="['text-lg font-extrabold lg:justify-self-start', theme === 'dark' ? 'text-white' : 'text-button-primary']">{{ logoText }}</span>

    <nav class="flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:justify-self-center">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :class="['text-sm font-medium hover:underline underline-offset-4', theme === 'dark' ? 'text-white' : 'text-button-primary']"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <span :class="['text-sm text-center lg:text-right lg:justify-self-end', theme === 'dark' ? 'text-white/70' : 'text-button-primary']">
      &copy; {{ currentYear }} {{ logoText }}. HO ARAI WA KHON THAI.
    </span>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface FooterLink {
  label: string
  to: string
}

interface Props {
  logoText?: string
  links: FooterLink[]
  theme?: 'light' | 'dark'
}

withDefaults(defineProps<Props>(), {
  logoText: "WHAT'S",
  theme: 'light',
})

const currentYear = new Date().getFullYear()
</script>
