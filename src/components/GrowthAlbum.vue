<template>
  <div class="growth-album">
    <!-- 成长记录列表 -->
    <div class="growth-records">
      <div v-for="(record, index) in pet.growthRecords" :key="index" class="growth-record cute-card">
        <div class="record-header">
          <h4 class="record-age">🎯 {{ record.age }}</h4>
          <!-- <el-button type="danger" icon="Delete" size="small" @click="deleteGrowthRecord(index)" class="cute-btn">
            删除
          </el-button> -->
        </div>

        <!-- 照片 -->
        <div v-if="record.photos && record.photos.length" class="photos">
          <h5>📷 照片</h5>
          <div class="photos-grid">
            <div v-for="(photo, pIndex) in record.photos" :key="pIndex" class="photo-item"
              @click="viewPhoto(record.age, pIndex)">
              <img :src="photo.src" :alt="`${record.age}的照片`" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有记录时的提示 -->
    <div v-if="pet.growthRecords?.length === 0" class="empty-state">
      <div class="empty-icon">📸</div>
      <h3>还没有成长记录</h3>
      <p>记录宝贝的成长历程，留下美好回忆</p>
    </div>

    <!-- 添加记录按钮 -->
    <div class="add-record-btn">
      <el-button type="primary" icon="Plus" @click="$emit('add-record')" class="cute-btn">
        添加成长记录
      </el-button>
    </div>

    <!-- 图片查看器 -->
    <el-dialog v-model="photoViewerVisible" :title="`${currentPhotoAge} - 照片`" width="60%" class="cute-dialog">
      <div class="photo-viewer">
        <img :src="currentPhoto" class="viewer-image" />
        <div v-if="currentPhotoDescription" class="photo-description">
          {{ currentPhotoDescription }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { ElMessage, ElMessageBox } from 'element-plus';
// import { Delete, Plus } from '@element-plus/icons-vue';
enum PetGender {
  Male = 1,
  Female = 0,
};
enum SterilizationStatus {
  Neutered = 1, // 已绝育
  NotNeutered = 0, // 未绝育
}
type DateString = `${number}-${number}-${number}`;
interface HealthRecords {
  // 疫苗
  vaccine: Array<{
    type: string,
    date: DateString,
    nextReminder?: DateString
  }>;
  // 驱虫
  deworming: Array<{
    medicine: string,
    date: string,
    nextReminder?: string
  }>
  //病历
  medical: Array<{
    hospital: string,
    diagnosis: string,//诊断
    medicine: string,
    date: string
  }>
}
interface Photos {
  src: string,
  description: string,
  date: DateString
}
interface GrowthRecords {
  age: string,
  photos: Photos[]
};

interface Pet {
  id: number,
  userId: number,
  name: string,
  type: string,
  breed: string,
  avatar: string,
  gender: PetGender,
  birthday: DateString,
  age: string,
  weight: number,
  sterilization?: SterilizationStatus,
  healthStatus?: string,
  description?: string,
  specialNotes?: string,
  characterTags?: string[],
  healthRecords?: HealthRecords,
  growthRecords?: GrowthRecords[]
}
interface Props {
  pet: Pet;
}

const props = defineProps<Props>();
console.log(props.pet);
// const emit = defineEmits<{
//   'add-record': [];
// }>();

const photoViewerVisible = ref(false);
const currentPhotoAge = ref('');
const currentPhotoIndex = ref(0);
const currentPhoto = ref('');
const currentPhotoDescription = ref('');
// 查看照片
const viewPhoto = (age: string, index: number) => {
  if (!props.pet.growthRecords) return;
  const record = props.pet.growthRecords.find(r => r.age === age);
  if (record && record.photos[index]) {
    currentPhotoAge.value = age;
    currentPhotoIndex.value = index;
    currentPhoto.value = record.photos[index].src;
    currentPhotoDescription.value = record.photos[index].description;
    photoViewerVisible.value = true;
  }
};

// 删除成长记录
// const deleteGrowthRecord = async (index: number) => {
//   try {
//     await ElMessageBox.confirm(
//       '确定要删除这条成长记录吗？',
//       '删除确认',
//       {
//         confirmButtonText: '确定删除',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }
//     );

//     props.pet.growthRecords?.splice(index, 1);
//     ElMessage.success('成长记录删除成功');
//   } catch {
//     // 用户取消删除
//   }
// };
</script>

<style scoped>
.growth-album {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.growth-records {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-right: 5px;
}

.growth-record {
  padding: 15px;
  background: linear-gradient(135deg, #FFF9C4 0%, #FFECB3 100%);
  border: 2px dashed #FFD54F;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-age {
  color: #FF6F00;
  margin: 0;
  font-size: 1.1rem;
}

.record-description {
  color: #5D4037;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.milestones,
.photos {
  margin-top: 12px;
}

.milestones h5,
.photos h5 {
  color: #FF6F00;
  margin: 0 0 8px 0;
  font-size: 0.9rem;
}

.milestones-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.milestone-tag {
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  border: none;
  border-radius: 12px;
  color: #E65100;
  font-size: 0.8rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.photo-item {
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.photo-item:hover {
  transform: scale(1.05);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #FF69B4;
}

.empty-state p {
  margin: 0;
  opacity: 0.7;
}

.add-record-btn {
  padding: 15px 0 5px 0;
  text-align: center;
}

.photo-viewer {
  text-align: center;
}

.viewer-image {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 滚动条样式 */
.growth-records::-webkit-scrollbar {
  width: 6px;
}

.growth-records::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.growth-records::-webkit-scrollbar-thumb {
  background: #FFB6C1;
  border-radius: 3px;
}

.growth-records::-webkit-scrollbar-thumb:hover {
  background: #FF69B4;
}
</style>