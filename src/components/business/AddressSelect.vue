<template>
  <div class="layui-form-item ">
    <label class="layui-form-label">所在地区</label>
    <div class="layui-input-block ">
      <!-- 使用三级联动下拉框 -->
      <select v-model="selectedProvince" @change="handleProvinceChange"    class="address-select province-select">
        <option value=""  class="address-placeholder">请选择省份</option>
        <option :value="province.code" v-for="province in provinces" :key="province.code"  class="address-option">
          {{ province.name }}
        </option>
      </select>

      <select v-model="selectedCity" @change="handleCityChange" :disabled="!selectedProvince" class="address-select province-select">
        <option value="" class="address-placeholder">请选择城市</option>
        <option :value="city.code" v-for="city in cities" :key="city.code"  class="address-option">
          {{ city.name }}
        </option>
      </select>

      <select v-model="selectedDistrict" @change="handleDistrictChange" :disabled="!selectedCity" class="address-select province-select">
        <option value="" class="address-placeholder">请选择区县
        </option>
        <option :value="district.code" v-for="district in districts" :key="district.code"  class="address-option">
          {{ district.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// 导入china-division数据
import provincesData from 'china-division/dist/provinces.json'
import citiesData from 'china-division/dist/cities.json'
import districtsData from 'china-division/dist/areas.json'

// 定义地区数据类型接口
interface Area {
  code: string
  name: string
}

interface City extends Area {
  provinceCode: string
}

interface District extends Area {
  cityCode: string
}

interface Address {
  id: string | number
  province: string
  city: string
  district: string
  [key: string]: any
}

export default defineComponent({
  name: 'AreaSelector',
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        province: '',
        city: '',
        district: '',
      }),
      validator: (value: any) => {

        return ['province', 'city', 'district'].every((key) =>
          Object.prototype.hasOwnProperty.call(value, key),
        )
      },
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      // 地区选择状态
      selectedProvince: '',
      selectedCity: '',
      selectedDistrict: '',
      // 地区数据源
      provinces: provincesData as Area[],
      cities: [] as City[],
      districts: [] as District[],
      // 地址表单数据
      addressForm: {
        province: '',
        city: '',
        district: '',
      },
      // 编辑相关状态
      editingAddressId: null as string | number | null,
      showAddressForm: false,
    }
  },
 
  watch: {
  modelValue: {
    handler(newValue) {
      if (!newValue) return

      // 1. 拿到后端返回的省市区名称
      const { province: provName, city: cityName, district: distName } = newValue
      if (!provName) return

      // 2. 第一步：根据名称找到省份code，赋值并加载城市列表
      const targetProv = this.provinces.find(p => p.name === provName)
      if (!targetProv) return
      this.selectedProvince = targetProv.code
      this.cities = citiesData.filter(c => c.provinceCode === targetProv.code)

      // 3. 第二步：根据名称找到城市code，赋值并加载区县列表
      if (!cityName) return
      const targetCity = this.cities.find(c => c.name === cityName)
      if (!targetCity) return
      this.selectedCity = targetCity.code
      this.districts = districtsData.filter(d => d.cityCode === targetCity.code)

      // 4. 第三步：根据名称找到区县code，赋值
      if (!distName) return
      const targetDist = this.districts.find(d => d.name === distName)
      if (targetDist) {
        this.selectedDistrict = targetDist.code
      }
    },
    immediate: true,
    deep: true
  }
},
  methods: {
    // 处理省份选择变化
    handleProvinceChange(e: Event) {
      const target = e.target as HTMLSelectElement
      const provinceCode = target.value
      this.selectedProvince = provinceCode
      this.selectedCity = ''
      this.selectedDistrict = ''

      // 筛选对应城市
      this.cities = (citiesData as City[]).filter((city) => city.provinceCode === provinceCode)

      // 更新地址表单
      this.addressForm.province =
        (provincesData as Area[]).find((p) => p.code === provinceCode)?.name || ''
      this.addressForm.city = ''
      this.addressForm.district = ''

      // 触发更新事件
      this.emitUpdateModelValue()
    },

    // 处理城市选择变化
    handleCityChange(e: Event) {
      const target = e.target as HTMLSelectElement
      const cityCode = target.value
      this.selectedCity = cityCode
      this.selectedDistrict = ''

      // 筛选对应区县
      this.districts = (districtsData as District[]).filter(
        (district) => district.cityCode === cityCode,
      )

      // 更新地址表单
      this.addressForm.city = (citiesData as City[]).find((c) => c.code === cityCode)?.name || ''
      this.addressForm.district = ''

      // 触发更新事件
      this.emitUpdateModelValue()
    },

    // 处理区县选择变化
    handleDistrictChange(e: Event) {
      const target = e.target as HTMLSelectElement
      const districtCode = target.value
      this.selectedDistrict = districtCode

      // 更新地址表单
      this.addressForm.district =
        (districtsData as District[]).find((d) => d.code === districtCode)?.name || ''

      // 触发更新事件
      this.emitUpdateModelValue()
    },

    // 编辑地址时回显地区信息
    editAddress(address: Address) {
      this.addressForm = { ...address }

      // 查找对应的地区编码
      const province = (provincesData as Area[]).find((p) => p.name === address.province)
      if (province) {
        this.selectedProvince = province.code
        this.cities = (citiesData as City[]).filter((city) => city.provinceCode === province.code)

        const city = (citiesData as City[]).find((c) => c.name === address.city)
        if (city) {
          this.selectedCity = city.code
          this.districts = (districtsData as District[]).filter((d) => d.cityCode === city.code)

          const district = (districtsData as District[]).find((d) => d.name === address.district)
          if (district) {
            this.selectedDistrict = district.code
          }
        }
      }

      this.editingAddressId = address.id
      this.showAddressForm = true
    },

    // 重置地址表单时清空选择
    resetAddressForm() {
      // 重置其他表单字段
      this.addressForm = {
        province: '',
        city: '',
        district: '',
      }
      // 重置选择器状态
      this.selectedProvince = ''
      this.selectedCity = ''
      this.selectedDistrict = ''
      this.cities = []
      this.districts = []
    },

    // 统一触发modelValue更新
    emitUpdateModelValue() {
      this.$emit('update:modelValue', {
        province: this.selectedProvince,
        city: this.selectedCity,
        district: this.selectedDistrict,
      })
    },
  },
})
</script>

<style scoped>


.address-select-container {
  width: 100%;
  max-width: 360px; /* 可选：限制最大宽度 */
}

/* 核心选择框样式 */
.address-select {
    z-index: 1000;
  width: 100%;
  height: 40px;
  line-height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 0 15px 0 15px;
  box-sizing: border-box;
  font-size: 14px;
  color: #606266;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
  appearance: none !important;
  -webkit-appearance: none !important;
  /* 自定义下拉箭头 */
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23606266' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 12px;
}

/* 悬停状态 */
.address-select:hover {
  border-color: #fd9860;
  box-shadow: 0 0 0 2px rgba(225, 170, 88, 0.1);

}

/* 聚焦状态 */
.address-select:focus {
  outline: none;
  border-color: #fd9860; /* 主题色 */
  box-shadow: 0 0 0 2px rgba(235, 168, 101, 0.2);
}

/* 禁用状态（如果需要） */
.address-select:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
  color: #c0c4cc;
  border-color: #e4e7ed;
  /* 禁用状态的箭头 */
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c0c4cc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
}

/* 占位选项样式（请选择省份） */
.address-placeholder {
  color: #909399;
}
.address-placeholder:hover {
  border-color: #fd9860;
  box-shadow: 0 0 0 2px rgba(225, 170, 88, 0.1);
}
/* 添加选择框样式 */
.layui-form-label {
  width: 100px;
  font-weight: 500;
}
/* 普通选项样式 */
.address-option {
  color: #606266;
  background-color: #fff;
  padding: 10px 15px;
  transition: all 0.2s ease;
  cursor: pointer;
  /* 确保样式生效 */
  font-size: 14px;
  line-height: 1.5;
}

/* 选项悬停效果 */
:deep(.address-option:hover) {
     background-color: #fd9860 !important;
  color: #fff;
  transform: translateX(5px);
  border-left: 3px solid #fd9860;
}
.address-option:checked {
  background-color: #fff8f0;
  color: #fd9860;
  font-weight: 500;
}

/* 下拉菜单整体样式 */
.address-select::-webkit-scrollbar {
  width: 6px;
}

.address-select::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.address-select::-webkit-scrollbar-thumb {
  background: #fd9860;
  border-radius: 10px;
}

.address-select::-webkit-scrollbar-thumb:hover {
  background: #e78a50;
}

.layui-input-block select {
  width: 32%;
  display: inline-block;
  margin-right: 2%;
  height: 38px;
  line-height: 1.3;
  line-height: 38px\9;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 0 10px;
  box-sizing: border-box;
  /* 修复盒模型问题 */
}

.layui-input-block select:last-child {
  margin-right: 0;
}

/* 禁用状态样式优化 */
.layui-input-block select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
