<template>

</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import MapContainer from '@/components/MapCom.vue'
export interface Location {
    lat: number | null;
    lng: number | null;
    address: string;
}

export interface FosterHome {
    id: number;
    name: string;
    type: '个人' | '机构';
    lat: number;
    lng: number;
    address: string;
    rating: number;
    reviewCount: number;
    price: number;
    availableSpots: number;
    petTypes: string[];
    tags: string[];
}

export interface Filters {
    area: string;
    fosterTypes: string[];
    petTypes: string[];
    priceRange: [number, number];
    minRating: number;
}

export type SortOption = 'comprehensive' | 'distance' | 'rating' | 'price';

// 响应式引用
const mapContainer = ref<HTMLElement>()
const markers = ref<any[]>([])
let clusters: any = null

// 当前定位信息
const currentLocation = reactive<Location>({
    lat: null,
    lng: null,
    address: '',
})

declare const AMap: any;
type AMapMap = {
    addControl: (control: any) => void;
    destroy: () => void;
};
let map: AMapMap | null = null;

declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}

// 筛选条件
const filters = reactive<Filters>({
    area: 'all',
    fosterTypes: ['个人', '机构'],
    petTypes: ['猫', '狗', '其他'],
    priceRange: [0, 200],
    minRating: 0,
})

// 排序选项
const sortOption = ref<SortOption>('comprehensive')

// 区域选项
const areaOptions = ref<string[]>(['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区'])

// 模拟寄养家庭数据
const fosterHomes = ref<FosterHome[]>([
    {
        id: 1,
        name: '蓝海宠物乐园',
        type: '机构',
        lat: 39.90923,
        lng: 116.397428,
        address: '北京市东城区王府井大街',
        rating: 4.8,
        reviewCount: 128,
        price: 120,
        availableSpots: 3,
        petTypes: ['猫', '狗'],
        tags: ['环境优美', '专业护理'],
    },
    {
        id: 2,
        name: '小蓝的家',
        type: '个人',
        lat: 39.91923,
        lng: 116.407428,
        address: '北京市朝阳区三里屯',
        rating: 4.5,
        reviewCount: 76,
        price: 80,
        availableSpots: 2,
        petTypes: ['猫'],
        tags: ['温馨家庭', '爱猫人士'],
    },
    {
        id: 3,
        name: '汪汪托管中心',
        type: '机构',
        lat: 39.89923,
        lng: 116.387428,
        address: '北京市西城区金融街',
        rating: 4.9,
        reviewCount: 203,
        price: 150,
        availableSpots: 0,
        petTypes: ['狗'],
        tags: ['专业训练', '大型犬友好'],
    },
    {
        id: 4,
        name: '喵星人驿站',
        type: '个人',
        lat: 39.92923,
        lng: 116.417428,
        address: '北京市海淀区中关村',
        rating: 4.7,
        reviewCount: 94,
        price: 70,
        availableSpots: 1,
        petTypes: ['猫', '其他'],
        tags: ['独立空间', '经验丰富'],
    },
])

// 筛选后的寄养家庭
const filteredFosters = computed(() => {
    let result = [...fosterHomes.value]

    // 按寄养类型筛选
    if (filters.fosterTypes.length > 0) {
        result = result.filter((foster) => filters.fosterTypes.includes(foster.type))
    }

    // 按宠物类型筛选
    if (filters.petTypes.length > 0) {
        result = result.filter((foster) =>
            foster.petTypes.some((petType) => filters.petTypes.includes(petType)),
        )
    }

    // 按价格区间筛选
    result = result.filter(
        (foster) =>
            foster.price >= filters.priceRange[0] && foster.price <= filters.priceRange[1],
    )

    // 按评分筛选
    result = result.filter((foster) => foster.rating >= filters.minRating)

    // 排序
    if (sortOption.value === 'distance') {
        result.sort((a, b) => {
            const distA = calculateDistance(a)
            const distB = calculateDistance(b)
            return distA - distB
        })
    } else if (sortOption.value === 'rating') {
        result.sort((a, b) => b.rating - a.rating)
    } else if (sortOption.value === 'price') {
        result.sort((a, b) => a.price - b.price)
    } else {
        // 综合排序
        result.sort((a, b) => {
            const scoreA = calculateComprehensiveScore(a)
            const scoreB = calculateComprehensiveScore(b)
            return scoreB - scoreA
        })
    }

    return result
})

// 计算距离的辅助函数
const calculateDistance = (foster: FosterHome): number => {
    if (!currentLocation.lat || !currentLocation.lng) return 5

    const latDiff = Math.abs(foster.lat - currentLocation.lat)
    const lngDiff = Math.abs(foster.lng - currentLocation.lng)
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 100
}

// 计算综合评分
const calculateComprehensiveScore = (foster: FosterHome): number => {
    const distanceScore = 5 - calculateDistance(foster)
    const ratingScore = foster.rating
    const priceScore = (200 - foster.price) / 200
    return distanceScore * 0.4 + ratingScore * 0.4 + priceScore * 0.2
}

// 初始化地图
const initMap = (): void => {
    if (!mapContainer.value) return

    map = new AMap.Map(mapContainer.value, {
        zoom: 12,
        center: [116.397428, 39.90923],
        mapStyle: 'amap://styles/fresh',
    })

    // 添加控件
    map?.addControl(new AMap.Zoom())
    map?.addControl(new AMap.Scale())
    map?.addControl(new AMap.ToolBar())

    updateMapMarkers()
}

// 更新地图标记点
const updateMapMarkers = (): void => {
    if (!map) return

    // 清除现有标记
    //   if (markers.value.length > 0) {
    //     map.remove(markers.value)
    //     markers.value = []
    //   }

    // 为每个寄养家庭添加标记
    filteredFosters.value.forEach((foster) => {
        const marker = new AMap.Marker({
            position: [foster.lng, foster.lat],
            content: createMarkerContent(foster),
            offset: new AMap.Pixel(-20, -40),
        })

        marker.on('click', () => {
            showFosterInfo(foster)
        })

        markers.value.push(marker)
    })

    // map.add(markers.value)

    // 标记点聚合
    if (filteredFosters.value.length > 10 && clusters) {
        // map.remove(clusters)
    }

    if (filteredFosters.value.length > 10) {
        clusters = new AMap.MarkerClusterer(map, markers.value, {
            gridSize: 80,
            maxZoom: 16,
            renderCluster: (count: number) => {
                return `<div class="cluster-marker">${count}</div>`
            },
        })
    }

    // 调整地图视野
    // if (filteredFosters.value.length > 0) {
    //     map.setFitView()
    // }
}

// 创建标记点内容
const createMarkerContent = (foster: FosterHome): string => {
    const color = foster.type === '个人' ? '#4A90E2' : '#6BC4FF'
    const icon = foster.petTypes.includes('狗') ? '🐕' : foster.petTypes.includes('猫') ? '🐈' : '🐾'

    return `
    <div class="pet-icon" style="background-color: ${color};">
      ${icon}
    </div>
  `
}

// 显示寄养家庭信息
const showFosterInfo = (foster: FosterHome): void => {
    ElMessage({
        message: `查看 ${foster.name} 的详情`,
        type: 'info',
        duration: 2000,
    })
    viewDetails(foster)
}

// 定位功能
const locateMe = (): void => {
    if (!navigator.geolocation) {
        ElMessage.error('您的浏览器不支持地理定位')
        return
    }

    ElMessage.info('正在获取您的位置...')

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude

            currentLocation.lat = lat
            currentLocation.lng = lng

            try {
                const geocoder = new AMap.Geocoder()
                geocoder.getAddress([lng, lat], (status: string, result: any) => {
                    if (status === 'complete' && result.regeocode) {
                        currentLocation.address = result.regeocode.formattedAddress
                    } else {
                        currentLocation.address = '位置获取成功'
                    }

                    // map?.setCenter([lng, lat])
                    // map?.setZoom(15)

                    const locationMarker = new AMap.Marker({
                        position: [lng, lat],
                        content: '<div class="pet-icon" style="background-color: #4CAF50;">📍</div>',
                        offset: new AMap.Pixel(-20, -40),
                    })

                    // map?.add(locationMarker)
                    ElMessage.success('位置获取成功')
                })
            } catch (error) {
                console.error('逆地理编码失败:', error)
                currentLocation.address = '位置获取成功'
                ElMessage.success('位置获取成功')
            }
        },
        (error) => {
            console.error('定位失败:', error)
            let errorMsg = '位置获取失败'

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = '用户拒绝提供位置信息'
                    break
                case error.POSITION_UNAVAILABLE:
                    errorMsg = '位置信息不可用'
                    break
                case error.TIMEOUT:
                    errorMsg = '获取位置信息超时'
                    break
            }

            ElMessage.error(errorMsg)
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
        },
    )
}

// 应用筛选
const applyFilters = (): void => {
    updateMapMarkers()
    ElMessage.success('筛选条件已应用')
}

// 重置筛选
const resetFilters = (): void => {
    filters.area = 'all'
    filters.fosterTypes = ['个人', '机构']
    filters.petTypes = ['猫', '狗', '其他']
    filters.priceRange = [0, 200]
    filters.minRating = 0
    sortOption.value = 'comprehensive'

    updateMapMarkers()
    ElMessage.success('筛选条件已重置')
}

// 查看详情
const viewDetails = (foster: FosterHome): void => {
    ElMessage({
        message: `查看 ${foster.name} 的详细信息`,
        type: 'success',
        duration: 2000,
    })
}

// 组件挂载后初始化
onMounted(() => {
    nextTick(() => {
        initMap()
        setTimeout(locateMe, 1000)
    })
})
</script>

<style scoped>
.page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.cute-card {
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.12);
    border: 1px solid #e0f0ff;
    transition: all 0.3s ease;
    background-color: white;
}

.cute-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(74, 144, 226, 0.15);
}

.cute-btn {
    background: linear-gradient(135deg, #6BC4FF, #4A90E2);
    border: none;
    border-radius: 20px;
    color: white;
    font-weight: 600;
    padding: 10px 20px;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(74, 144, 226, 0.2);
}

.cute-btn:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 12px rgba(74, 144, 226, 0.3);
}

.map-container {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.pet-icon {
    width: 36px;
    height: 36px;
    background-color: #6BC4FF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cluster-marker {
    width: 45px;
    height: 45px;
    background-color: #4A90E2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

/* 优化Element UI组件样式 */
:deep(.el-rate__icon) {
    font-size: 18px;
}

:deep(.el-checkbox) {
    margin-right: 12px;
}

:deep(.el-slider__bar) {
    background-color: #6BC4FF;
}

:deep(.el-slider__button) {
    border-color: #4A90E2;
}

:deep(.el-select .el-input__inner) {
    border-radius: 10px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #4A90E2;
    border-color: #4A90E2;
}
</style>