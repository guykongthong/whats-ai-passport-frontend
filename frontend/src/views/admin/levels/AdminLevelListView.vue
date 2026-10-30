<template>
  <AdminPageLayout title="Criteria of Levels" main-padding="px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-white/10 gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Competency Levels & Criteria</h2>
          <p class="text-xs sm:text-sm text-white/60 mt-1">
            Overview of all 4 certification tiers, required pass criteria, campus privileges, and student services.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white/80">
            4 Tiers Configured
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white/10 backdrop-blur-md rounded-2xl p-16 border border-white/20 flex flex-col items-center justify-center gap-3 text-white"
      >
        <div class="size-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span class="text-sm font-medium text-white/70">Loading levels criteria...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-2xl p-6 text-center text-sm"
      >
        <p class="font-semibold">{{ error }}</p>
        <button
          type="button"
          class="mt-3 px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer"
          @click="fetchLevels"
        >
          Try Again
        </button>
      </div>

      <!-- 4 Level Cards Grid (Criteria #15 & #16) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          v-for="level in levels"
          :key="level.levelNumber"
          :class="[
            'bg-white/10 backdrop-blur-md rounded-2xl p-6 border shadow-lg text-white flex flex-col justify-between transition-all duration-200 hover:bg-white/15 group',
            getLevelBorderClass(level.levelNumber),
          ]"
        >
          <!-- Card Top Content -->
          <div class="flex flex-col flex-1">
            <!-- Header: Badge Icon & Level Pill -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <!-- Badge Image / Icon -->
              <div
                :class="[
                  'size-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm text-2xl',
                  getBadgeContainerClass(level.levelNumber),
                ]"
              >
                <img
                  v-if="level.badge?.imageUrl"
                  :src="level.badge.imageUrl"
                  :alt="level.name"
                  class="size-14 rounded-2xl object-cover"
                />
                <span v-else>{{ getBadgeIcon(level.levelNumber) }}</span>
              </div>

              <!-- Level Tag Badge -->
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-xs select-none',
                  getLevelClasses(level.levelNumber),
                ]"
              >
                Level {{ level.levelNumber }}
              </span>
            </div>

            <!-- Level Name & Tier -->
            <div class="mb-4">
              <h3 class="text-xl font-bold text-white tracking-tight">
                {{ level.name || getLevelName(level.levelNumber) }}
              </h3>
              <p class="text-xs text-white/60 mt-0.5">
                Competency Tier {{ level.levelNumber }}
              </p>
            </div>

            <!-- Pass Criteria Box -->
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-5 flex items-center gap-3">
              <div class="size-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-300">
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="min-w-0">
                <span class="text-xs text-white/50 block font-medium uppercase tracking-wider">Pass Criteria</span>
                <span class="text-sm font-bold text-emerald-300">
                  {{ formatPassCriteria(level.passCriteria) }}
                </span>
              </div>
            </div>

            <!-- Benefits Section -->
            <div class="mb-5 flex-1">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                  <svg class="size-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Benefits
                </span>
                <span class="text-[11px] text-white/50 font-medium">
                  {{ normalizeStringList(level.benefits).length }} items
                </span>
              </div>

              <ul class="space-y-1.5 text-xs text-white/80">
                <li
                  v-for="(benefit, idx) in normalizeStringList(level.benefits)"
                  :key="idx"
                  class="flex items-start gap-2 leading-relaxed"
                >
                  <span class="text-emerald-400 shrink-0 mt-0.5">&bull;</span>
                  <span class="line-clamp-2" :title="benefit">{{ benefit }}</span>
                </li>
                <li
                  v-if="normalizeStringList(level.benefits).length === 0"
                  class="text-xs text-white/40 italic"
                >
                  No benefits configured
                </li>
              </ul>
            </div>

            <!-- Services Section -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                  <svg class="size-3.5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Available Services
                </span>
                <span class="text-[11px] text-white/50 font-medium">
                  {{ normalizeStringList(level.services).length }} services
                </span>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(service, idx) in normalizeStringList(level.services)"
                  :key="idx"
                  class="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-white/90"
                  :title="service"
                >
                  {{ service }}
                </span>
                <span
                  v-if="normalizeStringList(level.services).length === 0"
                  class="text-xs text-white/40 italic"
                >
                  No services configured
                </span>
              </div>
            </div>
          </div>

          <!-- Card Footer: Edit Level Action Button -->
          <div class="pt-4 border-t border-white/10 mt-auto">
            <RouterLink
              :to="`/admin/levels/${level.levelNumber}`"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm group-hover:bg-white/20"
              :aria-label="`Edit Level ${level.levelNumber} (${level.name})`"
            >
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Level</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </AdminPageLayout>
</template>
