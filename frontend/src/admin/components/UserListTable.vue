<template>
  <div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/30 w-full">
    <div class="grid grid-cols-[3fr_2fr_2fr_2fr_1fr] items-center bg-white/40 rounded-xl py-4 px-6 text-[#01172e] text-[17px] font-bold text-center" style="margin-bottom: 20px;">
      <div class="text-left">User Profile</div>
      <div>Levels</div>
      <div>Province</div>
      <div>Enrolled</div>
      <div>Details</div>
    </div>
    <!-- Wrap table in a scrollable container for mobile -->
    <div class="w-full overflow-x-auto rounded-xl">
      <div class="flex flex-col gap-3 pb-8 min-w-[800px]">
        <div 
          v-for="user in paginatedUsers" 
        :key="user.id"
        class="grid grid-cols-[3fr_2fr_2fr_2fr_1fr] items-center bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-3 px-6 cursor-pointer"
        @click="router.push('/admin/users/' + user.id)"
      >
        <div class="flex items-center gap-4 text-left">
          <div class="flex size-10 items-center justify-center rounded-full bg-black/20 text-white shrink-0">
            <UserIcon class="size-6" />
          </div>
          <div>
            <div class="text-[#01172e] font-extrabold text-[17px]">{{ user.name }}</div>
            <div class="text-[#4F6C83] text-[11px] font-bold">{{ user.email }}</div>
          </div>
        </div>

        <div class="flex justify-center">
          <div :class="[
            'px-2.5 py-1 rounded-md text-xs font-semibold',
            getLevelClasses(user.level)
          ]">
            Level {{ user.level }}: {{ getLevelName(user.level) }}
          </div>
        </div>

        <div class="text-center text-[#01172e] font-bold text-[15px]">
          {{ user.province }}
        </div>

        <div class="text-center text-[#01172e] font-bold text-[15px]">
          {{ user.enrolledDate }}
        </div>

        <div class="text-center">
          <BaseButton 
            variant="primary" 
            size="sm" 
            class="bg-transparent hover:bg-white/20 text-white hover:text-white rounded-lg px-4 font-extrabold border-2 border-white/50"
            @click="router.push('/admin/users/' + user.id)"
          >
            View
          </BaseButton>
        </div>
      </div>
    </div>
    </div>

    <div class="flex justify-end mt-16">
      <BasePagination 
        :total-items="users.length" 
        :page-size="pageSize"
        :current-page="currentPage" 
        @page-change="handlePageChange"
        class="[&_button]:bg-white/40 hover:[&_button]:bg-white/60 [&_button.bg-button-primary]:bg-white [&_button.bg-button-primary]:text-[#00385e] [&_button]:border-none [&_button]:text-[#01172e]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/shared/components/BaseButton.vue'
import BasePagination from '@/shared/components/BasePagination.vue'
import UserIcon from '@/shared/components/icons/UserIcon.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const router = useRouter()

export interface UserRow {
  id: string
  name: string
  email: string
  level: number
  province: string
  enrolledDate: string
}

const props = defineProps<{
  users: UserRow[]
  currentPage: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()


const paginatedUsers = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize
  const end = start + props.pageSize
  return props.users.slice(start, end)
})

function handlePageChange(page: number) {
  emit('page-change', page)
}

</script>
