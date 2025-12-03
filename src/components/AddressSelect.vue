<template>
  <div class="layui-form-item">
    <label class="layui-form-label">所在地区</label>
    <div class="layui-input-block">
      <!-- 使用三级联动下拉框 -->
      <select v-model="selectedProvince" @change="handleProvinceChange">
        <option value="">请选择省份</option>
        <option :value="province.code" v-for="province in provinces" :key="province.code">
          {{ province.name }}
        </option>
      </select>

      <select v-model="selectedCity" @change="handleCityChange" :disabled="!selectedProvince">
        <option value="">请选择城市</option>
        <option :value="city.code" v-for="city in cities" :key="city.code">
          {{ city.name }}
        </option>
      </select>

      <select v-model="selectedDistrict" @change="handleDistrictChange" :disabled="!selectedCity">
        <option value="">请选择区县</option>
        <option :value="district.code" v-for="district in districts" :key="district.code">
          {{ district.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 导入china-division数据
import provincesData from 'china-division/dist/provinces.json';
import citiesData from 'china-division/dist/cities.json';
import districtsData from 'china-division/dist/areas.json';

// 定义地区数据类型接口
interface Area {
  code: string;
  name: string;
}

interface City extends Area {
  provinceCode: string;
}

interface District extends Area {
  cityCode: string;
}

interface Address {
  id: string | number;
  province: string;
  city: string;
  district: string;
  [key: string]: any; // 允许其他字段
}

export default defineComponent({
  name: 'AreaSelector',
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        province: '',
        city: '',
        district: ''
      }),
      validator: (value: any) => {
        return ['province', 'city', 'district'].every(key =>
          Object.prototype.hasOwnProperty.call(value, key)
        );
      }
    }
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
      showAddressForm: false
    };
  },
  watch: {
    // 监听modelValue变化并更新选择状态
    modelValue: {
      handler(newValue: { province?: string; city?: string; district?: string }) {
        if (newValue) {
          this.selectedProvince = newValue.province || '';
          this.selectedCity = newValue.city || '';
          this.selectedDistrict = newValue.district || '';

          // 更新联动选项
          if (this.selectedProvince) {
            this.cities = (citiesData as City[]).filter(
              city => city.provinceCode === this.selectedProvince
            );
          }

          if (this.selectedCity) {
            this.districts = (districtsData as District[]).filter(
              district => district.cityCode === this.selectedCity
            );
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 处理省份选择变化
    handleProvinceChange(e: Event) {
      const target = e.target as HTMLSelectElement;
      const provinceCode = target.value;
      this.selectedProvince = provinceCode;
      this.selectedCity = '';
      this.selectedDistrict = '';

      // 筛选对应城市
      this.cities = (citiesData as City[]).filter(
        city => city.provinceCode === provinceCode
      );

      // 更新地址表单
      this.addressForm.province = (provincesData as Area[]).find(
        p => p.code === provinceCode
      )?.name || '';
      this.addressForm.city = '';
      this.addressForm.district = '';

      // 触发更新事件
      this.emitUpdateModelValue();
    },

    // 处理城市选择变化
    handleCityChange(e: Event) {
      const target = e.target as HTMLSelectElement;
      const cityCode = target.value;
      this.selectedCity = cityCode;
      this.selectedDistrict = '';

      // 筛选对应区县
      this.districts = (districtsData as District[]).filter(
        district => district.cityCode === cityCode
      );

      // 更新地址表单
      this.addressForm.city = (citiesData as City[]).find(
        c => c.code === cityCode
      )?.name || '';
      this.addressForm.district = '';

      // 触发更新事件
      this.emitUpdateModelValue();
    },

    // 处理区县选择变化
    handleDistrictChange(e: Event) {
      const target = e.target as HTMLSelectElement;
      const districtCode = target.value;
      this.selectedDistrict = districtCode;

      // 更新地址表单
      this.addressForm.district = (districtsData as District[]).find(
        d => d.code === districtCode
      )?.name || '';

      // 触发更新事件
      this.emitUpdateModelValue();
    },

    // 编辑地址时回显地区信息
    editAddress(address: Address) {
      this.addressForm = { ...address };

      // 查找对应的地区编码
      const province = (provincesData as Area[]).find(
        p => p.name === address.province
      );
      if (province) {
        this.selectedProvince = province.code;
        this.cities = (citiesData as City[]).filter(
          city => city.provinceCode === province.code
        );

        const city = (citiesData as City[]).find(
          c => c.name === address.city
        );
        if (city) {
          this.selectedCity = city.code;
          this.districts = (districtsData as District[]).filter(
            d => d.cityCode === city.code
          );

          const district = (districtsData as District[]).find(
            d => d.name === address.district
          );
          if (district) {
            this.selectedDistrict = district.code;
          }
        }
      }

      this.editingAddressId = address.id;
      this.showAddressForm = true;
    },

    // 重置地址表单时清空选择
    resetAddressForm() {
      // 重置其他表单字段
      this.addressForm = {
        province: '',
        city: '',
        district: '',
      };
      // 重置选择器状态
      this.selectedProvince = '';
      this.selectedCity = '';
      this.selectedDistrict = '';
      this.cities = [];
      this.districts = [];
    },

    // 统一触发modelValue更新
    emitUpdateModelValue() {
      this.$emit('update:modelValue', {
        province: this.selectedProvince,
        city: this.selectedCity,
        district: this.selectedDistrict
      });
    }
  }
});
</script>

<style scoped>
/* 添加选择框样式 */
.layui-form-label {
  width: 100px;
  font-weight: 500;
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