<template>
 <div v-if="loading" class="loading-container">
    <i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i>
    <span class="loading-text">加载中...</span>
  </div>
  <div v-else class="address-manager" >
    <button class="layui-btn btn-save" @click="handleAdd" v-if="showAddressForm|| addressList.length > 0">
      <i class="layui-icon layui-icon-add-circle"></i> 添加新地址
    </button>

    <!-- 地址表单 -->
    <div v-if="showAddressForm" class="address-form-container">
      <form class="layui-form profile-form">
        <div class="layui-form-item">
          <label class="layui-form-label">收件人</label>
          <div class="layui-input-block">
            <input 
              type="text" 
              v-model="addressForm.consignee" 
              placeholder="请输入收件人姓名" 
              class="layui-input" 
            />
          </div>
        </div>

        <div class="layui-form-item">
          <label class="layui-form-label">联系电话</label>
          <div class="layui-input-block">
            <input 
              type="text" 
              v-model="addressForm.phone" 
              lay-verify="phone" 
              placeholder="请输入联系电话"
              class="layui-input" 
            />
          </div>
        </div>

        <AddressSelect v-model="selectedAddress" />

        <div class="layui-form-item">
          <label class="layui-form-label">详细地址</label>
          <div class="layui-input-block">
            <textarea 
              v-model="addressForm.detailAddress" 
              placeholder="请输入详细地址" 
              class="layui-textarea"
              rows="3" 
            ></textarea>
          </div>
        </div>

        <div class="layui-form-item">
          <label class="layui-form-label">默认地址</label>
          <div class="layui-input-block">
            <el-switch 
              style="height: 39px; line-height: 21px" 
              v-model="addressForm.isDefault" 
              active-text="是"
              inactive-text="否" 
              active-color="#fd9860" 
            />
          </div>
        </div>

        <div class="layui-form-item">
          <div class="layui-input-block">
            <button class="layui-btn btn-save" type="button" @click="handleSave">保存地址</button>
            <button class="layui-btn delete-btn" type="button" @click="handleReset">取消</button>
          </div>
        </div>
      </form>
    </div>

    <!-- 地址列表 -->
    <div class="address-list" v-if="!showAddressForm && addressList.length > 0">
      
   
      <div class="address-item" v-for="address in addressList" :key="address.id">
        <div class="address-header">
          <span class="recipient">{{ address.consignee }} {{ address.phone }}</span>
          <span class="default-tag" v-if="!address.isDefault">默认地址</span>
        </div>
        <div class="address-content">
          {{ getProvinceName(address.province) }} {{ getCityName(address.city) }}
          {{ getDistrictName(address.district) }} {{ address.detailAddress }}
        </div>
        <div class="address-actions">
          <button class="layui-btn btn-edit layui-btn-sm" @click="handleEdit(address)">编辑</button>
          <button class="layui-btn btn-delete layui-btn-sm" @click="handleDelete(address.id)">删除</button>
          <button class="layui-btn layui-btn-primary layui-btn-sm" @click="handleSetDefault(address.id)"
            v-if="address.isDefault">设为默认</button>
        </div>
      </div>
      <div class="pagination-container">
        <el-pagination 
          @current-change="handlePageChange" 
          @size-change="handleSizeChange"
          :page-sizes="[3, 5, 8, 10]" 
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize" 
          :total="pagination.total"
          layout="sizes,prev, pager, next, jumper, ->, total" 
          background 
        />
      </div>
   
</div>
    <!-- 空状态 -->
      <div class="empty-address" v-if="!showAddressForm && addressList.length === 0">
      <div class="empty-address-content">
        <i class="layui-icon layui-icon-location" style="font-size: 48px; color: #ccc;"></i>
        <h3>暂无收货地址</h3>
        <p>您还没有添加任何收货地址</p>
        <button class="layui-btn btn-save" @click="handleAdd">
          <i class="layui-icon layui-icon-add-circle"></i> 添加新地址
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {  ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import AddressSelect from '@/components/business/AddressSelect.vue'
import provincesData from 'china-division/dist/provinces.json';
import citiesData from 'china-division/dist/cities.json';
import districtsData from 'china-division/dist/areas.json';

// 类型定义
interface Address {
  id: string
  consignee: string
  phone: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault: boolean
}

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

// 定义事件（通知父组件刷新）
const emit = defineEmits(['refresh'])
// 在现有ref定义中添加
const loading = ref(false)
// 本地状态
const addressForm = ref<Partial<Address>>({
  consignee: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false
})
const selectedAddress = ref({ province: '', city: '', district: '' })
const addressList = ref<Address[]>([])
const pagination = ref({
  currentPage: 1,
  pageSize: 5,
  total: 0,
  pages: 1
})
const showAddressForm = ref(false)
const editingAddressId = ref<string | null>(null)

// 初始化加载地址列表
onMounted(() => {
  getAddressList()
})

// 监听刷新事件（父组件触发）
watch(() => emit, () => {
  getAddressList()
})

// 获取地址列表
const getAddressList = async () => {
    loading.value = true
  try {
    const userId = localStorage.getItem('userId') || ''
    if (!userId) {
      ElMessage.warning('用户未登录！')
      addressList.value = []
      return
    }
    const response = await request('/server/api/user/getUserAddresses', 'GET', {
      pageNum: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    })
    console.log(response)
    if(response.code === 0){
      if(response.msg === '操作成功'){
    addressList.value = response.data.list || []
    pagination.value.total = response.data.total || 0
    pagination.value.pages = response.data.pages || 1
    if (pagination.value.currentPage === 1 && addressList.value.length === 0) {
      showAddressForm.value = true
    }
      }
      if(response.msg === '用户暂无地址！'){
        ElMessage.warning('您还没有添加收货地址！')
      }
    
 
    }
       
   
  } catch (error) {
    console.log(error)
    ElMessage.error('获取地址失败！')
  }finally {
    // 无论成功失败，结束加载时隐藏加载状态
    loading.value = false
  }
}

// 省市区名称转换
const getProvinceName = (code: string) => {
  const province = (provincesData as Area[]).find(p => p.code === code)
  return province ? province.name : code
}

const getCityName = (code: string) => {
  const city = (citiesData as City[]).find(c => c.code === code)
  return city ? city.name : code
}

const getDistrictName = (code: string) => {
  const district = (districtsData as District[]).find(d => d.code === code)
  return district ? district.name : code
}

// 分页切换
const handlePageChange = (page: number) => {
  pagination.value.currentPage = page
  getAddressList()
}

const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
  getAddressList()
}

// 添加新地址
const handleAdd = () => {
  resetAddressForm()
  showAddressForm.value = true
}

// 编辑地址
const handleEdit = async (address: Address) => {
  try {
    const response = await request('/server/api/user/UserAddressDetail', 'GET', { id: address.id })
    if (response.code === 0 && response.data) {
      const detail = response.data
      addressForm.value = {
        consignee: detail.consignee,
        phone: detail.phone,
        province: detail.province,
        city: detail.city,
        district: detail.district,
        detailAddress: detail.detailAddress,
        isDefault: detail.isDefault === 0,
      }
      selectedAddress.value = {
        province: detail.province,
        city: detail.city,
        district: detail.district,
      }
      editingAddressId.value = detail.id
      showAddressForm.value = true
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('获取地址详情失败！')
  }
}

// 保存地址
const handleSave = async () => {
  // 本地验证
  if (!addressForm.value.consignee) return ElMessage.error('请填写收件人！')
  if (!addressForm.value.phone) return ElMessage.error('请填写联系电话！')
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(addressForm.value.phone)) return ElMessage.error('请输入正确的手机号码！')
  
  addressForm.value.province = selectedAddress.value.province
  addressForm.value.city = selectedAddress.value.city
  addressForm.value.district = selectedAddress.value.district
  
  if (!addressForm.value.province || !addressForm.value.city || !addressForm.value.district || !addressForm.value.detailAddress) {
    return ElMessage.error('请填写完整地址信息！')
  }

  try {
    const addressData = {
      id: editingAddressId.value,
      consignee: addressForm.value.consignee,
      phone: addressForm.value.phone,
      province: addressForm.value.province,
      city: addressForm.value.city,
      district: addressForm.value.district,
      detailAddress: addressForm.value.detailAddress,
      isDefault: addressForm.value.isDefault ? 0 : 1,
    }

    let response: any
    if (editingAddressId.value) {
      // 编辑地址
      response = await request(`/server/api/user/updateUserAddress?id=${editingAddressId.value}`, 'POST', addressData)
    } else {
      // 新增地址
      response = await request('/server/api/user/addUserAddress', 'POST', addressData)
    }

    if (response.code === 0) {
      ElMessage.success(editingAddressId.value ? '地址更新成功！' : '地址添加成功！')
      resetAddressForm()
      getAddressList()
      emit('refresh') // 通知父组件刷新
    }
  } catch (error) {
    console.log(error)
 
  }
}

// 删除地址
const handleDelete = (id: string) => {
  window.layui.layer.confirm('确定要删除这个地址吗？', { title: '提示' }, async (index: number) => {
    try {
      const response = await request('/server/api/user/deleteUserAddress', 'POST', { id }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      if (response.code === 0) {
        ElMessage.success('地址删除成功！')
        getAddressList()
        emit('refresh')
      }
    } catch (error) {
      console.log(error)
      ElMessage.error('删除地址失败！')
    } finally {
      window.layui.layer.close(index)
    }
  })
}

// 设为默认地址
const handleSetDefault = async (id: string) => {
  try {
    const response = await request('/server/api/user/setDefaultUserAddress', 'POST', { id:id }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    if (response.code === 0) {
      ElMessage.success('默认地址更改成功！')
      getAddressList()
      emit('refresh')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('设置默认地址失败！')
  }
}

// 重置地址表单
const resetAddressForm = () => {
  addressForm.value = {
    consignee: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false
  }
  selectedAddress.value = { province: '', city: '', district: '' }
  editingAddressId.value = null
  showAddressForm.value = false
}

// 取消编辑
const handleReset = () => {
  resetAddressForm()
}
</script>

<style scoped>
.loading-container {
  text-align: center;
  padding: 2rem 0;
  color: #fd9860;
}

.loading-text {
  margin-left: 0.5rem;
  color: #666;
}
.layui-btn-primary:hover {
    border-color: #fd9860 !important;
    color: #333;
}
.layui-input:focus,
.layui-textarea:focus {
  border-color: #fd9860 !important;
  box-shadow: 0 0 0 3px #fd98600f;
}

.empty-address {
  margin-top: 2rem;
  text-align: center;
  color: #999;
  padding: 2rem 0;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.empty-address-content {
  padding: 2rem 1rem;
}

.empty-address-content h3 {
  margin: 1rem 0 0.5rem 0;
  color: #666;
  font-size: 1.2rem;
}

.empty-address-content p {
  margin: 0 0 1.5rem 0;
}

.empty-address-content .layui-btn {
  background-color: #fd9860;
  border-color: #fd9860;
}

.empty-address-content .layui-btn:hover {
  background-color: #fc8747;
  border-color: #fc8747;
}
.address-form-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.address-list {
  margin-top: 1.5rem;
}

.address-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  position: relative;
}

.address-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.recipient {
  font-weight: 500;
}

.default-tag {
  background-color: #fd9860;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  font-size: 0.8rem;
}

.address-content {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.empty-address {
  margin-top: 2rem;
  text-align: center;
  color: #999;
  padding: 2rem 0;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.layui-form-label) {
  width:87px;
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #fd9860 !important;
  border-color: #fd9860 !important;
}

:deep(.el-switch__label.is-active) {
  color: #fd9860;
}

.btn-save {
  background-color: #fd9860;
  border-color: #fd9860;
  min-width: 120px;
}

.btn-save:hover {
  background-color: #fc8747;
  border-color: #fc8747;
}

.delete-btn {
  min-width: 120px;
  border-color: #d2d2d2;
  background: 0 0;
  color: #5f5f5f;
}

.delete-btn:hover {
  border-color: #fd9860;
  color: #fd9860;
}

.btn-edit {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
  min-width: 60px;
}

.btn-edit:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.btn-delete {
  background-color: #f44b4b;
  border-color: #f44b4b;
  color: white;
  min-width: 60px;
}

.btn-delete:hover {
  background-color: #fb7b7b;
  border-color: #fb7b7b;
}
</style>