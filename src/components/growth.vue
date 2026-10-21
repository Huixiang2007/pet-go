<template>
    <div class="growth-record-demo">
        <!-- 切换展现形式的标签 -->
        <el-radio-group v-model="displayType" class="display-type-tabs">
            <el-radio label="card">卡片式</el-radio>
            <el-radio label="timeline">时间轴</el-radio>
            <el-radio label="collapse">折叠面板</el-radio>
        </el-radio-group>

        <!-- 卡片式展现 -->
        <div v-if="displayType === 'card'" class="growth-record-cards">
            <div v-for="(record, index) in growthRecords" :key="index" class="record-card">
                <div class="record-header">
                    <span class="record-event">{{ record.event }}</span>
                    <span class="record-date">{{ record.date }}</span>
                </div>
                <div class="record-note">{{ record.note }}</div>
                <el-button type="text" icon="Edit" @click="editRecord(index)" />
            </div>
            <el-button type="primary" icon="Plus" @click="addRecord">+ 添加成长记录</el-button>
        </div>

        <!-- 时间轴展现 -->
        <div v-else-if="displayType === 'timeline'">
            <el-timeline>
                <el-timeline-item v-for="(record, index) in growthRecords" :key="index" :timestamp="record.date"
                    type="primary">
                    <h4 class="timeline-event">{{ record.event }}</h4>
                    <p class="timeline-note">{{ record.note }}</p>
                    <el-button type="text" icon="Edit" @click="editRecord(index)" />
                </el-timeline-item>
                <el-button type="primary" icon="Plus" @click="addRecord">+ 添加成长记录</el-button>
            </el-timeline>
        </div>

        <!-- 折叠面板展现 -->
        <div v-else class="collapse-records">
            <el-collapse>
                <el-collapse-item v-for="(record, index) in growthRecords" :key="index"
                    :title="`${record.event} · ${record.date}`">
                    <div class="collapse-note">{{ record.note }}</div>
                    <el-button type="text" icon="Edit" @click="editRecord(index)" />
                </el-collapse-item>
            </el-collapse>
            <el-button type="primary" icon="Plus" @click="addRecord">+ 添加成长记录</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElRadioGroup, ElRadio, ElTimeline, ElTimelineItem, ElButton, ElCollapse, ElCollapseItem } from 'element-plus';

// 状态管理
const displayType = ref('card'); // 默认展示卡片式
const growthRecords = ref([
    {
        event: '3岁生日',
        date: '2023年5月15日',
        note: '体重32.5kg'
    },
    {
        event: '学会握手',
        date: '2021年2月10日',
        note: '训练3天后学会'
    }
]);

// 方法：添加记录
const addRecord = () => {
    growthRecords.value.push({
        event: '新事件',
        date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
        note: '请输入备注...'
    });
};

// 方法：编辑记录（示例，实际可结合弹窗实现）
const editRecord = (index) => {
    alert(`即将编辑第 ${index + 1} 条记录`);
};
</script>

<style scoped>
.growth-record-demo {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.display-type-tabs {
    margin-bottom: 20px;
}

/* 卡片式样式 */
.growth-record-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.record-card {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s;
}

.record-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.record-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.record-event {
    font-weight: bold;
    color: #333;
}

.record-date {
    color: #666;
    font-size: 14px;
}

.record-note {
    color: #555;
    line-height: 1.5;
    white-space: pre-wrap;
}

/* 时间轴样式 */
.timeline-event {
    margin-bottom: 8px;
    font-size: 16px;
}

.timeline-note {
    color: #555;
    line-height: 1.5;
    white-space: pre-wrap;
}

/* 折叠面板样式 */
.collapse-note {
    color: #555;
    line-height: 1.5;
    white-space: pre-wrap;
    padding: 10px 0;
}
</style>