<template>
  <div class="health-records">
    <el-tabs v-model="activeHealthTab" type="border-card">
      <el-tab-pane label="💉 疫苗记录" name="vaccine">
        <!-- 向子组件传递数据records和列配置columes -->
        <VaccineRecords :records="pet.healthRecords?.vaccineList" :columns="vaccineColumns"
          @add-records="addHealthRecords($event)" @update-records="updateHealthRecords($event)"
          @delete-records="deleteHealthRecords($event)" />
      </el-tab-pane>

      <el-tab-pane label="🧼 驱虫记录" name="deworming">
        <DewormRecords :records="pet.healthRecords?.dewormingList" :columns="dewormingColumns"
          @add-records="addHealthRecords($event)" @update-records="updateHealthRecords($event)"
          @delete-records="deleteHealthRecords($event)" />
      </el-tab-pane>

      <el-tab-pane label="🏥 病历记录" name="medical">
        <MedicineRecords :records="pet.healthRecords?.medicalList" :columns="medicalColumns"
          @add-records="addHealthRecords($event)" @update-records="updateHealthRecords($event)"
          @delete-records="deleteHealthRecords($event)" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DewormRecords from './DewormRecords.vue'
import MedicineRecords from './MedicineRecords.vue'
import VaccineRecords from './VaccineRecords.vue'
import type { Pet } from '@/types/pet'
// 接收父组件传递过来的pet
const props = defineProps<{
  pet: Pet
}>()
console.log(props.pet)
const activeHealthTab = ref('vaccine')

// 表格列定义
const vaccineColumns = [
  { prop: 'vaccineType', label: '疫苗类型' },
  { prop: 'date', label: '接种时间' },
  { prop: 'nextReminderDate', label: '下次提醒' },
]

const dewormingColumns = [
  { prop: 'medicine', label: '药品' },
  { prop: 'date', label: '时间' },
  { prop: 'nextReminderDate', label: '下次提醒' },
]

const medicalColumns = [
  { prop: 'hospital', label: '医院' },
  { prop: 'diagnosis', label: '诊断' },
  { prop: 'medicine', label: '用药' },
  { prop: 'date', label: '日期' },
]
const emit = defineEmits<{
  'add-pet-health': [petId: number, records: any],
  'update-pet-health': [petId: number, records: any]
  'delete-pet-health': [petId: number, id: number, type: string]
}>()

const addHealthRecords = (newRecord: any) => {
  console.log(newRecord)
  emit('add-pet-health', props.pet.id, newRecord)
}
const updateHealthRecords = (newRecords: any) => {
  emit('update-pet-health', props.pet.id, newRecords)
}
const deleteHealthRecords = (id: number) => {
  emit('delete-pet-health', props.pet.id, id, 'health')
}
</script>
