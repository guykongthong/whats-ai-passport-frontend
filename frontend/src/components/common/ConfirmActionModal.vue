<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <!-- Dimmed Backdrop with Blur -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="handleCancel"
        />

        <!-- Modal Card Container -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-md transform rounded-2xl bg-[#002742]/95 border border-white/20 p-6 text-left shadow-2xl backdrop-blur-md transition-all z-10 text-white"
          >
            <!-- Header with Warning / Info Icon and Title -->
            <div class="flex items-start gap-4">
              <div
                :class="[
                  'size-10 rounded-xl flex items-center justify-center shrink-0 border',
                  iconContainerClasses,
                ]"
              >
                <!-- Warning / Alert Triangle Icon for Danger / Red / Amber -->
                <svg
                  v-if="isWarningOrDanger"
                  class="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>

                <!-- Information / Check Icon for Primary / Success -->
                <svg
                  v-else
                  class="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <h3
                  :id="titleId"
                  class="text-lg font-bold text-white leading-6 truncate"
                >
                  {{ title }}
                </h3>
                <p class="mt-2 text-sm text-white/70 leading-relaxed whitespace-pre-line">
                  {{ message }}
                </p>
              </div>
            </div>

            <!-- Footer Action Buttons -->
            <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                :disabled="isLoading"
                class="px-4 py-2.5 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>

              <button
                type="button"
                :disabled="isLoading"
                :class="[
                  'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed',
                  confirmButtonClasses,
                ]"
                @click="handleConfirm"
              >
                <span
                  v-if="isLoading"
                  class="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"
                />
                <span>{{ confirmText }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
