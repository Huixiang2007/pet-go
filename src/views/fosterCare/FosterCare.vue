<template>
    <div class="app">
        <NavBar />
        <div class="map-component-container">
            <div class="page-container">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- 左侧筛选面板 -->
                    <div class="lg:col-span-1">
                        <div class="cute-card p-5 bg-white mb-6">
                            <!-- 用户家庭住址展示 -->
                            <div class="mb-5">
                                <div class="flex justify-between">
                                    <h3 class="font-semibold text-gray-700 mb-2">你的位置</h3>
                                    <button class="text-xs text-blue-500" @click="goToPerson">
                                        定位不准确？去修改
                                    </button>
                                </div>

                                <div v-if="locationError" class="text-xs text-red-500 bg-red-50 p-2 rounded mt-1">
                                    ⚠️ {{ locationError }}
                                </div>
                                <div v-else-if="currentLocation.address"
                                    class="text-sm text-green-600 bg-green-50 p-2 rounded mt-2">
                                    <div class="flex justify-between items-start">
                                        <div class="flex-1">
                                            <i class="iconfont mr-1">&#xe603;</i>
                                            <span>已定位: {{ userHomeAddress }}</span>
                                        </div>
                                        <button class="text-xs text-blue-500 hover:text-blue-600 ml-2 whitespace-nowrap"
                                            @click="showAddressSelector = true">
                                            重新选择
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- 搜索框 -->
                            <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">搜索寄养服务</h3>
                                <div class="flex">
                                    <el-input v-model="searchKeyword" placeholder="搜索店家名称或宠物品种" class="mr-2"
                                        @keyup.enter="handleSearch">
                                        <template #prefix>
                                            <el-icon>
                                                <Search />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <button class="cute-btn w-[70px]" style="padding:0"
                                        @click="handleSearch">搜索</button>
                                </div>
                            </div>

                            <!-- 寄养家庭类型 -->
                            <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">寄养家庭类型</h3>
                                <el-checkbox-group v-model="filters.fosterTypes" @change="handleFilterChange">
                                    <el-checkbox value="个人">个人</el-checkbox>
                                    <el-checkbox value="机构">机构</el-checkbox>
                                </el-checkbox-group>
                            </div>

                            <!-- 宠物类型 -->
                            <!-- <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">宠物类型</h3>
                                <el-checkbox-group v-model="filters.petTypes" @change="handleFilterChange">
                                    <el-checkbox v-for="pet in allPetTypes" :key="pet" :value="pet">{{ pet
                                        }}</el-checkbox>
                                </el-checkbox-group>
                            </div> -->

                            <!-- 价格区间 -->
                            <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">价格区间 (元/天)</h3>
                                <el-slider v-model="filters.priceRange" range :min="0" :max="200" :step="10"
                                    @change="handleFilterChange"></el-slider>
                                <div class="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>{{ filters.priceRange[0] }}元</span>
                                    <span>{{ filters.priceRange[1] }}元</span>
                                </div>
                            </div>

                            <!-- 搜索范围 -->
                            <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">搜索范围 (公里)</h3>
                                <el-input v-model="filters.radius" type="number" placeholder="请输入搜索范围（公里）" min="1"
                                    max="100" @input="handleRadiusInput" @keyup.enter="handleRadiusConfirm"
                                    style="width: 100%;">
                                    <template #suffix>公里</template>
                                </el-input>
                            </div>

                            <!-- 智能排序 -->
                            <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">智能排序</h3>
                                <el-select v-model="sortOption" placeholder="选择排序方式" class="w-full"
                                    @change="handleSortChange">
                                    <el-option label="综合排序" value="comprehensive"></el-option>
                                    <el-option label="评分最高" value="rating"></el-option>
                                    <el-option label="价格最低" value="price"></el-option>
                                </el-select>
                            </div>

                            <!-- <button class="cute-btn w-full mt-4" @click="applyFilters">应用筛选</button> -->
                            <button class="cute-btn-secondary w-full mt-2" @click="resetFilters">重置筛选</button>
                        </div>
                    </div>

                    <!-- 右侧地图和列表 -->
                    <div class="lg:col-span-3">
                        <div class="cute-card p-4 bg-white mb-6">
                            <div class="map-container h-96 relative">
                                <!-- 地图按需加载 -->
                                <div v-if="!mapRequested"
                                    class="w-full h-full flex items-center justify-center bg-gray-50">
                                    <button type="button" class="cute-btn" @click="initMap">
                                        查看附近地图
                                    </button>
                                </div>
                                <!-- 地图加载失败提示 -->
                                <div v-else-if="mapLoadError"
                                    class="w-full h-full flex items-center justify-center bg-gray-50">
                                    <div class="text-center">
                                        <p class="text-red-500 mb-2">地图加载失败</p>
                                        <p class="text-xs text-gray-400">{{ mapLoadError }}</p>
                                        <button type="button" class="text-xs text-blue-500 mt-2" :disabled="mapLoading"
                                            @click="initMap">
                                            {{ mapLoading ? '加载中...' : '重试' }}
                                        </button>
                                    </div>
                                </div>
                                <!-- 地图容器 -->
                                <div v-else id="custom-map-container" ref="mapContainer" class="w-full h-full"></div>
                                <div v-if="mapLoading"
                                    class="absolute inset-0 flex items-center justify-center bg-white/80">
                                    <span class="text-sm text-gray-600">地图加载中...</span>
                                </div>
                            </div>
                        </div>

                        <div class="cute-card p-4 bg-white mb-4" v-if="total > 0">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">找到 {{ total }} 个寄养服务</span>
                                <span class="text-sm text-blue-500">参考位置: {{ currentLocation.address || '未定位' }}</span>
                            </div>
                        </div>

                        <div class="cute-card p-5 bg-white">
                            <h2 class="text-xl font-bold text-blue-500 mb-4">附近的寄养家庭</h2>

                            <!-- 无限滚动列表 -->
                            <div class="infinite-list-wrapper virtual-list" ref="listScrollRef" v-infinite-scroll="load"
                                :infinite-scroll-disabled="disabled" :infinite-scroll-immediate="false">
                                <ul class=" list virtual-list__inner"
                                    :style="{ height: `${rowVirtualizer.getTotalSize()}px` }">
                                    <li v-for="virtualRow in rowVirtualizer.getVirtualItems()"
                                        :key="String(virtualRow.key)" :ref="measureVirtualRow"
                                        :data-index="virtualRow.index" class="virtual-list__row" :style="{
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }">
                                        <div class="virtual-list__grid" :style="{
                                            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                                        }">
                                            <article v-for="foster in rows[virtualRow.index] ?? []" :key="foster.id"
                                                class="list-item border border-blue-100 rounded-xl p-4
hover:shadow-md transition-all duration-300
bg-blue-50/30 hover:bg-blue-50/50 cursor-pointer" @click="selectFoster(foster, 'list')" :class="{
    'list-item--selected': selectedFosterId === foster.id,
}">
                                                <!-- 上面 -->
                                                <div class="flex">
                                                    <!-- 左侧 -->
                                                    <div
                                                        class="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                                        <img :src="foster.cover"
                                                            class="w-full h-full object-cover rounded-lg"
                                                            v-if="foster.cover" />
                                                        <span class="text-2xl" v-else>🐾</span>
                                                    </div>
                                                    <!-- 右侧 -->
                                                    <div class="flex-1">
                                                        <div class="flex justify-between items-start">
                                                            <h3 class="font-bold text-lg text-gray-800">{{
                                                                foster.name
                                                            }}
                                                            </h3>
                                                            <span
                                                                class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                                                {{ foster.type }}
                                                            </span>
                                                        </div>
                                                        <div class="flex items-center mt-1">
                                                            <el-rate :model-value="foster.reviewCount" disabled
                                                                :colors="['#F7B500', '#F7B500', '#F7B500']"
                                                                class="mr-2"></el-rate>
                                                            <span class="text-sm text-gray-600">({{
                                                                foster.reviewCount
                                                            }})</span>
                                                        </div>
                                                        <p class="text-gray-600 text-sm mt-1 truncate">{{
                                                            foster.address
                                                        }}
                                                        </p>
                                                        <div class="flex justify-between items-center mt-2">
                                                            <span class="text-blue-500 font-bold">{{ foster.price
                                                            }}元/天</span>
                                                            <div class="flex items-center">
                                                                <span class="text-xs text-gray-500 mr-2"
                                                                    v-if="currentLocation.lat">
                                                                    距离: {{ foster.distance.toFixed(1) }}km
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>



                                                </div>
                                                <!-- 按钮 -->
                                                <div>
                                                    <button class="cute-btn w-full mt-3"
                                                        @click.stop="viewDetails(foster)">
                                                        查看详情
                                                    </button>
                                                </div>
                                            </article>



                                        </div>

                                    </li>
                                </ul>
                                <div v-if="loading" class="col-span-full text-center py-4">

                                    <span class="ml-2 text-gray-500">加载中...</span>
                                </div>

                                <!-- 无数据提示 -->
                                <div v-if="fosterHomes.length === 0 && !loading" class="col-span-full text-center py-8">
                                    <div class="text-4xl mb-4">🐾</div>
                                    <p class="text-gray-500 text-lg mb-2">没有找到符合条件的寄养家庭</p>
                                    <p class="text-gray-400 text-sm mb-4">尝试调整筛选条件或搜索关键词</p>
                                    <button class="cute-btn" @click="resetFilters">重置筛选条件</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
                    <el-icon>
                        <ArrowUp />
                    </el-icon>
                </button>
            </div>
        </div>
    </div>

    <!-- 地址选择器对话框 -->
    <el-dialog v-model="showAddressSelector" title="您的默认地址不精确，请选择正确的地址" width="500px"
        custom-class="address-selector-dialog" @close="handleDialogClose">
        <div class="address-selector">
            <div v-for="(item, index) in addressResults" :key="index" class="address-item"
                :class="{ 'is-selected': selectedAddress === item }" @click="selectedAddress = item">
                <div class="address-content">
                    <span class="address-text">{{ item.formattedAddress }}</span>
                    <el-icon v-if="selectedAddress === item">
                        <Check class="check-icon" />
                    </el-icon>
                    <!-- <i v-if="selectedAddress === item" class="iconfont check-icon">&#xe60b;</i> -->
                </div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleDialogClose">取消</el-button>
                <el-button type="primary" @click="selectAddress(selectedAddress)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, onUnmounted, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { ElMessage, ElLoading, } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import NavBar from '@/components/common/NavBar.vue';
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request';
import { useVirtualizer } from '@tanstack/vue-virtual'

declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}

const router = useRouter();
const route = useRoute();


// 地图相关
const mapContainer = ref<HTMLElement>()
let map: any = null
let AMapInstance: any | null = null
let locationRequestStarted = false
let pendingLocationReload = false
const mapRequested = ref(false)
const mapLoading = ref(false)
const mapLoadError = ref('')
const defaultLocation = {
    lat: 35.2869,
    lng: 113.9274,
    address: '默认位置'
}
// 用户位置Marker单独保存
let userMarker: AMap.Marker | null = null;
// 寄养点Marker
const fosterMarkerById = new Map<number, AMap.Marker>();
// 保存构建 Marker 所需数据的摘要，用于判断是否需要更新
const fosterSignatureById = new Map<number, string>();
// 聚合实例
let fosterCluster: any = null
//统一选中状态

// 当前选中的寄养点
const selectedFosterId = ref<number | null>(null)
// 地图还没加载完时，暂存待聚焦坐标
const pendingMapFocus = ref<{
    lng: number
    lat: number
} | null>(null)
// 选中点对应的完整数据
// const selectedFoster = computed(() => {
//     return fosterHomes.value.find(
//         (item) => item.id === selectedFosterId.value,
//     ) ?? null
// })

// 用户家庭住址相关
const userHomeAddress = ref('')
const locationError = ref('')
const mapInitialized = ref(false)
const isConfirming = ref(false);//判断是通过确定还是取消来关闭对话框的
// 当前定位信息（经纬度+地址）
const currentLocation = reactive({
    lat: 0 as number,
    lng: 0 as number,
    address: '' as string
})
// 地址选择器相关
const addressResults = ref<any[]>([])
const showAddressSelector = ref(false)
const selectedAddress = ref<any>(null)
//分页相关
const currentPage = ref(1)
const total = ref(0)
const loading = ref(false)
const hasMore = ref(true)
const disabled = computed(() => loading.value || !hasMore.value)
const fosterHomes = ref<FosterHome[]>([])
//回到顶部
const showBackToTop = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
//查询参数相关
const readQueryValue = (value: unknown) => {
    if (Array.isArray(value)) return value[0]
    return typeof value === 'string' ? value : ''
}

const initialFosterTypes = readQueryValue(route.query.types) === 'all'
    ? ['个人', '机构']
    : ['个人']
const requestedRadius = Number(readQueryValue(route.query.radius))
const initialRadius = Number.isFinite(requestedRadius) && requestedRadius > 0
    ? String(requestedRadius)
    : '100'
const requestedFixture = Number(readQueryValue(route.query.fixture))
const initialFixture = import.meta.env.DEV && [20, 100, 500].includes(requestedFixture)
    ? requestedFixture
    : 0

// 寄养服务数据
interface FosterHome {
    id: number;
    name: string;
    cover: string;
    type: '个人' | '机构';
    lat: number;
    lng: number;
    address: string;
    rating: number;
    reviewCount: number;
    price: number;
    petTypes: string[];
    distance: number;
}
interface FosterClusterPoint {
    id: number
    lnglat: [number, number]
    extData: FosterHome
}
interface GeocodeResult {
    geocodes: {
        location: {
            lat: number;
            lng: number;
        };
        formattedAddress: string;
    }[];
    info: string;
}
const goToPerson = () => {
    router.push({ path: '/persons' })
}
// 筛选条件
const filters = reactive({
    fosterTypes: [...initialFosterTypes],
    petTypes: [] as string[],
    priceRange: [0, 200] as [number, number],
    radius: initialRadius,
})

// 排序选项
const sortOption = ref('comprehensive')


// 搜索关键词
const searchKeyword = ref('')

// 接口请求参数
const requestParams = computed(() => ({
    current: currentPage.value,
    userLng: currentLocation.lng,
    userLat: currentLocation.lat,
    keyword: searchKeyword.value,
    radius: Number(filters.radius),
    providerType: filters.fosterTypes.length == 2 ? null : filters.fosterTypes[0],
    name: '',
}));

// 判断 Marker 是否需要更新。坐标、名称和价格都没变时，就复用原 Marker
const getFosterMarkerSignature = (foster: FosterHome) => {
    return [
        foster.lng,
        foster.lat,
        foster.name,
        foster.price,
    ].join('|')
}

// 获取用户家庭住址
const getUserHomeAddress = async () => {
    const loading = ElLoading.service({ text: '获取家庭住址中...' })
    try {
        const response = await request(
            '/server/api/shop/user-address-manage/get-default-address',
            'POST'
        );
        if (response.code === 0) {
            userHomeAddress.value = response.data.detailAddress;

            // 获取地址后解析经纬度
            if (mapInitialized.value) {
                await parseAddressToLatLng(userHomeAddress.value);

            }
        } else {
            locationError.value = '未获取到您的家庭住址，请先完善个人信息';
            return;
        }
    } catch (err) {
        console.error('获取家庭住址失败:', err);
        locationError.value = '获取地址失败，请刷新重试';
    } finally {
        loading.close();
    }
}

// 定位不准时用户手动选择地址
const selectAddress = (address: any) => {
    isConfirming.value = true;

    if (address.location && !isNaN(address.location.lat) && !isNaN(address.location.lng)) {
        currentLocation.lat = address.location.lat;
        currentLocation.lng = address.location.lng;
        currentLocation.address = address.formattedAddress;
        userHomeAddress.value = address.formattedAddress;
        locationError.value = '';

        // 存储选择的地址到localStorage
        localStorage.setItem('userLocation', JSON.stringify({
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            address: currentLocation.address
        }));

        // 重置分页状态，确保重新加载数据
        currentPage.value = 1;
        hasMore.value = true;
        fosterHomes.value = [];
        // 更新地图中心
        if (map) {
            map.setCenter([currentLocation.lng, currentLocation.lat], true);
            map.setZoom(15, true);
        }

        reloadListForLocation()
    }
    showAddressSelector.value = false;
    setTimeout(() => {
        isConfirming.value = false;
    }, 0);
}

// 处理对话框关闭
const handleDialogClose = () => {
    // 如果用户没有选择地址，默认选择第一个地址
    console.log(selectedAddress.value)
    if (isConfirming.value) {
        return;
    }
    if (addressResults.value.length > 0) {
        console.log("关闭对话框")

        selectAddress(addressResults.value[0]);
    }
    showAddressSelector.value = false;
}

// 地址转经纬度
const parseAddressToLatLng = async (address: string) => {
    if (!AMapInstance || !mapInitialized.value) {
        console.warn('地图未初始化，等待初始化完成后再解析地址');
        locationError.value = '地图未初始化，无法解析地址';
        return;
    }
    AMapInstance.plugin("AMap.Geocoder", function () {
        console.log('开始解析地址:', address)

        const geocoder = new AMapInstance.Geocoder();

        geocoder.getLocation(address, (status: string, result: GeocodeResult) => {
            if (status === 'complete' && result.geocodes != undefined && result.geocodes.length > 0) {
                console.log(result)
                if (result.geocodes.length === 1) {
                    // 只有一个结果，直接使用
                    const { location, formattedAddress } = result.geocodes[0]!;
                    if (location && !isNaN(location.lat) && !isNaN(location.lng)) {
                        currentLocation.lat = location.lat;
                        currentLocation.lng = location.lng;
                        currentLocation.address = formattedAddress;
                        userHomeAddress.value = formattedAddress;
                        locationError.value = '';

                        // 存储地址信息到localStorage
                        localStorage.setItem('userLocation', JSON.stringify({
                            lat: currentLocation.lat,
                            lng: currentLocation.lng,
                            address: currentLocation.address
                        }));

                        console.log(requestParams.value);
                        // 更新地图中心
                        if (map) {
                            console.log("设置地图中心")
                            map.setCenter([currentLocation.lng, currentLocation.lat], true);
                            map.setZoom(15, true);
                        }

                        reloadListForLocation()

                    } else {
                        locationError.value = '地址解析失败，无法获取有效位置';
                    }
                } else {
                    // 多个结果，显示选择器
                    addressResults.value = result.geocodes;
                    selectedAddress.value = result.geocodes[0]; // 默认选择第一个地址
                    showAddressSelector.value = true;
                }
            } else {
                locationError.value = `地址解析失败: ${result.info || '未知错误'}`;

            }
        });
    });
}



// 初始化地图
const initMap = async () => {
    if (map || mapLoading.value) return

    mapRequested.value = true
    mapLoadError.value = ''
    mapLoading.value = true

    // v-else 地图容器需要先渲染，之后才能初始化
    await nextTick()

    if (!mapContainer.value) {
        mapLoadError.value = '地图容器未找到'
        mapLoading.value = false
        return
    }

    try {
        const { default: AMapLoader } = await import('@amap/amap-jsapi-loader')

        window._AMapSecurityConfig = {
            securityJsCode: "76efd4e49a820ee84255d33dffeb374f",
        };

        const AMap = await AMapLoader.load({
            key: "f9a61d8c1043186ca29b9675925160ff",
            version: "2.0",
            plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.Geocoder", "AMap.MarkerCluster"],
        })

        if (map || !mapContainer.value) return

        AMapInstance = AMap;
        map = new AMap.Map("custom-map-container", {
            viewMode: "3D",
            zoom: 15,
            center: [defaultLocation.lng, defaultLocation.lat]
        });
        mapInitialized.value = true;
        if (currentLocation.lat && currentLocation.lng) {
            map.setCenter([currentLocation.lng, currentLocation.lat], true);
            map.setZoom(15, true);
            updateMapMarkers();
        }

        // 添加地图控件
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
        if (pendingMapFocus.value) {
            const target = pendingMapFocus.value
            pendingMapFocus.value = null

            focusOnMarker(target.lng, target.lat)
        }
    } catch (error) {
        pendingMapFocus.value = null
        const message = error instanceof Error ? error.message : '请检查 API 密钥'
        console.error('地图加载失败:', error);
        mapLoadError.value = `地图加载失败: ${message}`;
    } finally {
        mapLoading.value = false
    }


}

const reloadListForLocation = () => {
    currentPage.value = 1
    hasMore.value = true

    if (loading.value) {
        pendingLocationReload = true
        return
    }

    nextTick(() => {
        load()
    })
}

// 定位用户当前位置
const locateUserPosition = () => {
    if (locationRequestStarted) return
    locationRequestStarted = true
    // 检查localStorage中是否有存储的位置信息
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
        try {
            const location = JSON.parse(storedLocation);
            currentLocation.lat = location.lat;
            currentLocation.lng = location.lng;
            currentLocation.address = location.address;
            userHomeAddress.value = location.address;

            // 移动地图中心到存储的位置
            if (map) {
                map.setCenter([location.lng, location.lat], true);
                map.setZoom(15, true);
            }

            reloadListForLocation()

            console.log('使用存储的位置信息');
            return;
        } catch (error) {
            console.error('解析存储的位置信息失败:', error);
            // 解析失败，继续执行定位
        }
    }

    if (!navigator.geolocation) {
        ElMessage.error('您的浏览器不支持地理定位');
        // 如果不支持地理定位，尝试使用用户默认地址
        getUserHomeAddress();
        return;
    }

    ElMessage.info('正在获取您的位置...');

    navigator.geolocation.getCurrentPosition(
        // 成功回调
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            currentLocation.lat = lat;
            currentLocation.lng = lng;
            currentLocation.address = '当前位置'
            userHomeAddress.value = '当前位置'

            // 地图是否打开不影响列表更新
            localStorage.setItem('userLocation', JSON.stringify({
                lat,
                lng,
                address: currentLocation.address
            }))
            reloadListForLocation()

            if (map) {
                map.setCenter([lng, lat], true);
                map.setZoom(15, true);
                updateMapMarkers()
            }

            // 地图已加载时再补全详细地址，失败不影响列表
            if (AMapInstance) {
                try {
                    const geocoder = new AMapInstance.Geocoder()
                    geocoder.getAddress([lng, lat], (status: string, result: any) => {
                        if (status !== 'complete' || !result.regeocode) return

                        currentLocation.address = result.regeocode.formattedAddress
                        userHomeAddress.value = result.regeocode.formattedAddress
                        localStorage.setItem('userLocation', JSON.stringify({
                            lat,
                            lng,
                            address: currentLocation.address
                        }))
                    })
                } catch (error) {
                    console.error('逆地理编码失败:', error)
                }
            }

            ElMessage.success('位置获取成功');
        },
        // 失败回调
        (error) => {
            // console.error('定位失败:', error);
            let errorMsg = '位置获取失败';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = '请前往设置中允许请求位置信息';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = '位置信息不可用';
                    break;
                case error.TIMEOUT:
                    errorMsg = '获取位置信息超时';
                    break;
            }

            ElMessage.error(errorMsg);

            // 定位失败时，尝试使用用户默认地址
            getUserHomeAddress();
        },
        // 选项
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
        },
    );
}

let hasFittedInitialMarkers = false
// 地图只在第一次有点位时适配范围
const updateMapMarkers = () => {
    if (!map) return;
    syncUserMarker();
    syncFosterMarkers(fosterHomes.value)
    if (
        !hasFittedInitialMarkers &&
        fosterHomes.value.some((foster) =>
            isValidCoordinate(foster.lng, foster.lat),
        )
    ) {
       fitMapToFosterHomes()
        hasFittedInitialMarkers = true
    }
}
// 封装创建Marker的方法
const createFosterMarker = (foster: FosterHome) => {
    const marker = new AMapInstance.Marker({
        position: [foster.lng, foster.lat],
        content: renderFosterMarkerContent(foster),
        offset: new AMapInstance.Pixel(-50, -30),
        extData: foster,
    })

    marker.on('click', () => {
        const latestFoster = marker.getExtData() as FosterHome

        if (!latestFoster) return

        selectFoster(latestFoster, 'marker')
    })

    return marker
}
const renderFosterMarkerContent = (foster: FosterHome) => {
    const element = document.createElement('div')

    element.textContent = foster.name
    element.style.backgroundColor = '#ff6b8c'
    element.style.border = '2px solid white'
    element.style.borderRadius = '20px'
    element.style.padding = '5px 10px'
    element.style.color = 'white'
    element.style.fontSize = '12px'
    element.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
    element.style.whiteSpace = 'nowrap'

    return element
}
// 聚合点样式
const renderClusterMarkerContent = (count: number) => {
    const element = document.createElement('div')
    const size = count >= 100 ? 48 : count >= 10 ? 42 : 36

    element.textContent = String(count)
    element.title = `${count} 个寄养点`
    element.style.width = `${size}px`
    element.style.height = `${size}px`
    element.style.display = 'flex'
    element.style.alignItems = 'center'
    element.style.justifyContent = 'center'
    element.style.backgroundColor = '#ff6b8c'
    element.style.border = '3px solid white'
    element.style.borderRadius = '50%'
    element.style.color = 'white'
    element.style.fontSize = '14px'
    element.style.fontWeight = '700'
    element.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.28)'

    return element
}
// 清除聚合点
const destroyFosterCluster = () => {
    if (!fosterCluster) return

    if (typeof fosterCluster.setMap === 'function') {
        fosterCluster.setMap(null)
    }

    fosterCluster = null
}
// 创建聚合点
const createFosterCluster = (points: FosterClusterPoint[]) => {
    if (!map || !AMapInstance?.MarkerCluster) return null

    return new AMapInstance.MarkerCluster(map, points, {
        gridSize: 60,
        maxZoom: 18,

        renderClusterMarker: (context: any) => {
            context.marker.setContent(
                renderClusterMarkerContent(context.count),
            )

            if (typeof context.marker.setAnchor === 'function') {
                context.marker.setAnchor('center')
            }
        },

        renderMarker: (context: any) => {
            const foster = context.data?.[0]?.extData as
                | FosterHome
                | undefined

            if (!foster) return

            context.marker.setContent(
                renderFosterMarkerContent(foster),
            )
            context.marker.setExtData(foster)

            if (typeof context.marker.setAnchor === 'function') {
                context.marker.setAnchor('center')
            }

            context.marker.on('click', () => {
                selectFoster(foster, 'marker')
            })
        },
    })
}
// 聚合层的统一入口，负责创建、更新、销毁和降级
const syncFosterCluster = (points: FosterClusterPoint[]) => {
    if (!map || !AMapInstance?.MarkerCluster) {
        return false
    }

    // 当前没有寄养点时，直接销毁聚合实例
    if (points.length === 0) {
        destroyFosterCluster()
        return true
    }

    // 聚合实例已存在且支持 setData 时，优先增量更新
    if (fosterCluster && typeof fosterCluster.setData === 'function') {
        try {
            fosterCluster.setData(points)
            return true
        } catch (error) {
            console.error('更新地图聚合数据失败，准备重建聚合实例:', error)
            destroyFosterCluster()
        }
    }

    // 第一次创建，或当前版本不支持 setData 时重建
    destroyFosterCluster()

    try {
        fosterCluster = createFosterCluster(points)
        return fosterCluster !== null
    } catch (error) {
        console.error('创建地图聚合实例失败:', error)
        fosterCluster = null
        return false
    }
}

// 判断当前需要哪些 Marker → 调用 syncFosterCluster
const syncFosterMarkers = (nextHomes: FosterHome[]) => {
    if (!map) return

    const validHomes = nextHomes.filter((foster) =>
        isValidCoordinate(foster.lng, foster.lat),
    )

    const clusterPoints: FosterClusterPoint[] = validHomes.map(
        (foster) => ({
            id: foster.id,
            lnglat: [foster.lng, foster.lat],
            extData: foster,
        }),
    )

    const clusterReady = syncFosterCluster(clusterPoints)

    // 聚合正常时不需要再创建一套普通 Marker
    if (clusterReady) {
        fosterMarkerById.forEach((marker) => marker.setMap(null))
        fosterMarkerById.clear()
        fosterSignatureById.clear()
        return
    }

    // 聚合不可用时的降级逻辑
    const nextIds = new Set<number>()
    const removedMarkers: AMap.Marker[] = []

    for (const foster of validHomes) {
        nextIds.add(foster.id)

        const signature = getFosterMarkerSignature(foster)
        const existingMarker = fosterMarkerById.get(foster.id)

        if (!existingMarker) {
            const marker = createFosterMarker(foster)

            marker.setMap(map)
            fosterMarkerById.set(foster.id, marker)
            fosterSignatureById.set(foster.id, signature)
            continue
        }

        if (fosterSignatureById.get(foster.id) !== signature) {
            existingMarker.setPosition([foster.lng, foster.lat])
            existingMarker.setContent(renderFosterMarkerContent(foster))
            existingMarker.setExtData(foster)
            fosterSignatureById.set(foster.id, signature)
        }
    }

    for (const [id, marker] of fosterMarkerById) {
        if (nextIds.has(id)) continue

        removedMarkers.push(marker)
        fosterMarkerById.delete(id)
        fosterSignatureById.delete(id)
    }

    removedMarkers.forEach((marker) => marker.setMap(null))
}
// 坐标校验，避免null,NaN,非法的经纬度传给AMap
const isValidCoordinate = (lng: number, lat: number) => {
    const isFiniteNumber = (value: number) =>
        Number.isFinite(value)

    if (!isFiniteNumber(lng) || !isFiniteNumber(lat)) {
        return false
    }

    // 排除明显的无效坐标
    if (lng === 0 && lat === 0) {
        return false
    }

    return lng >= -180 && lng <= 180
        && lat >= -90 && lat <= 90
}
const renderUserMarkerContent = () => {
    const element = document.createElement('div')

    element.textContent = '我'
    element.style.width = '24px'
    element.style.height = '24px'
    element.style.display = 'flex'
    element.style.alignItems = 'center'
    element.style.justifyContent = 'center'
    element.style.backgroundColor = '#FF6B6B'
    element.style.border = '2px solid white'
    element.style.borderRadius = '50%'
    element.style.color = 'white'
    element.style.fontSize = '12px'
    element.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'

    return element
}
// 创建用户Marker
const syncUserMarker = () => {
    if (!map) return

    const position: [number, number] = [
        currentLocation.lng,
        currentLocation.lat,
    ]

    if (!userMarker) {
        userMarker = new AMapInstance.Marker({
            position,
            content: renderUserMarkerContent(),
            offset: new AMapInstance.Pixel(-12, -12),
        })
        userMarker.setMap(map)
        return
    }

    userMarker.setPosition(position)
}
// 将Marker添加到地图中
const fitMapToFosterHomes = () => {
    if (!map || !AMapInstance) return

    const validHomes = fosterHomes.value.filter((foster) =>
        isValidCoordinate(foster.lng, foster.lat),
    )

    if (validHomes.length === 0) return

    if (validHomes.length === 1) {
        const foster = validHomes[0]
        map.setZoomAndCenter(16, [foster.lng, foster.lat])
        return
    }

    const lngList = validHomes.map((foster) => foster.lng)
    const latList = validHomes.map((foster) => foster.lat)

    const minLng = Math.min(...lngList)
    const maxLng = Math.max(...lngList)
    const minLat = Math.min(...latList)
    const maxLat = Math.max(...latList)

    const bounds = new AMapInstance.Bounds(
        minLng,
        minLat,
        maxLng,
        maxLat,
    )

    map.setBounds(bounds, false, [20, 20, 20, 20])
}
//点击Marker,地图聚焦地址
const focusOnMarker = (lng: number, lat: number) => {

    if (map && lng && lat && !isNaN(lng) && !isNaN(lat)) {
        map.setCenter([lng, lat]);
        map.setZoom(16);
    }
    scrollToTop();
}
// 请求寄养列表
const load = async () => {
    console.log('准备请求数据');
    if (currentLocation.lat === 0 && currentLocation.lng === 0) {
        ElMessage.warning('请先完成定位后再操作');
        return;
    }
    if (loading.value || !hasMore.value) return;
    loading.value = true;
    console.log('requestParams:', requestParams.value)

    try {
        if (initialFixture) {
            const response = await fetch(`/fixtures/foster-homes/${initialFixture}.json`, {
                cache: 'no-store',
            })
            if (!response.ok) {
                throw new Error(`Fixture 加载失败: HTTP ${response.status}`)
            }
            const fixtureList = (await response.json()) as FosterHome[]
            const fixtureHomes = sortFosterHomes(
                fixtureList.filter((item) => {
                    return (
                        filters.fosterTypes.includes(item.type) &&
                        item.price >= filters.priceRange[0] &&
                        item.price <= filters.priceRange[1]
                    )
                }),
            )
            fosterHomes.value = fixtureHomes
            total.value = fixtureHomes.length
            hasMore.value = false
            currentPage.value = 1
            updateMapMarkers()
            return
        }

        const response = await request(
            '/server/api/foster/provider/listByPage',
            'POST',
            requestParams.value,
        );
        console.log('查询结果:', response);
        if (response.code === 0) {
            let newList = response.data.list || [];
            newList = newList.filter((item: FosterHome) => {
                return item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];
            });
            newList = sortFosterHomes(newList);
            if (currentPage.value === 1) {
                console.log("是第一页")
                fosterHomes.value = newList
            } else {
                fosterHomes.value = [...fosterHomes.value, ...newList]
            }
            total.value = response.data.total;

            // 判断是否还有更多数据
            hasMore.value = fosterHomes.value.length < response.data.total;
            if (hasMore.value) {
                currentPage.value++;

            } else {
                // ElMessage.info('已加载全部数据');
            }

            // 更新地图标记
            updateMapMarkers();
        } else {
            ElMessage.error(response.msg || '获取数据失败');
        }
    } catch (error) {
        console.error('请求失败:', error);
        ElMessage.error('获取寄养列表失败，请稍后重试');
    } finally {
        loading.value = false;
        if (pendingLocationReload) {
            pendingLocationReload = false
            nextTick(() => {
                load()
            })
        }
    }
}
type SelectionSource = 'list' | 'marker'
// 把列表选中和地图聚焦统一到这一个入口,并根据点击来源决定是否滚动虚拟列表
const selectFoster = async (
    foster: FosterHome,
    source: SelectionSource,
) => {
    // 检查坐标是否合法
    if (!isValidCoordinate(foster.lng, foster.lat)) return
    // 更新统一选中ID,保证点击后卡片立即显示选中样式
    selectedFosterId.value = foster.id

    // 地图未加载时，先记录待聚焦目标
    if (!map) {
        // 用户如果连续点击多个卡片, 只会聚焦最后一个, 避免重复初始化地图
        pendingMapFocus.value = {
            lng: foster.lng,
            lat: foster.lat,
        }

        await initMap()
    } else {
        focusOnMarker(foster.lng, foster.lat)
    }

    // Marker 点击后，滚动虚拟列表
    if (source === 'marker') {
        // 等待Vue完成当前状态更新
        await nextTick()
        // 找到寄养点所在的虚拟行
        const rowIndex = fosterRowIndexById.value.get(foster.id)

        if (rowIndex !== undefined) {
            rowVirtualizer.value.scrollToIndex(rowIndex, {
                align: 'center',
            })
        }
    }
}
// 建立寄养点到虚拟行索引的映射
const fosterRowIndexById = computed(() => {
    const indexById = new Map<number, number>()

    rows.value.forEach((row, rowIndex) => {
        row.forEach((foster) => {
            indexById.set(foster.id, rowIndex)
        })
    })

    return indexById
})


//虚拟列表滚动
const listScrollRef = ref<HTMLElement | null>(null)
const columnCount = ref(1)
// 按行虚拟化
const rows = computed(() => {
    const result: FosterHome[][] = []
    const size = columnCount.value

    for (let index = 0; index < fosterHomes.value.length; index += size) {
        result.push(
            fosterHomes.value.slice(index, index + size),
        )
    }

    return result
})

// 适配移动端（1列）和桌面端（2列）
let listResizeObserver: ResizeObserver | null = null

const updateColumnCount = (width: number) => {
    columnCount.value = width >= 900 ? 2 : 1
}
// 创建虚拟器
const virtualizerOptions = computed(() => ({
    count: rows.value.length,
    getScrollElement: () => listScrollRef.value,
    estimateSize: () => 270,
    overscan: 3,
    getItemKey: (index: number) => {
        return rows.value[index]
            ?.map((item) => item.id)
            .join(':') ?? index
    },
}))
const measureVirtualRow = (
    element: Element | ComponentPublicInstance | null,
) => {
    if (element instanceof Element) {
        rowVirtualizer.value.measureElement(element)
    }
}
const rowVirtualizer = useVirtualizer(virtualizerOptions)
const resetListScroll = () => {
    listScrollRef.value?.scrollTo({
        top: 0,
        behavior: 'auto',
    })
}
// 搜索处理
const handleSearch = () => {
    resetListScroll()
    currentPage.value = 1; // 重置为第一页
    hasMore.value = true;
    load();
}

// 筛选条件变化
const handleFilterChange = () => {
    resetListScroll()
    currentPage.value = 1;
    hasMore.value = true;
    load();
}

// 半径变化（防抖处理）
const handleRadiusInput = () => {

    handleRadiusConfirm(); // 防抖后执行请求

};
const handleRadiusConfirm = () => {
    resetListScroll()
    currentPage.value = 1;
    hasMore.value = true;
    load();
};
// 排序变化
const handleSortChange = () => {
    resetListScroll()
    currentPage.value = 1;
    hasMore.value = true;
    load();
}
// 当前选中的寄养点，被新一轮搜索或筛选排除后，不能继续保留旧的选中状态和地图聚焦目标
watch(
    () => fosterHomes.value.map((item) => item.id),
    async (ids) => {
        if (
            selectedFosterId.value !== null &&
            !ids.includes(selectedFosterId.value)
        ) {
            selectedFosterId.value = null
            pendingMapFocus.value = null
        }
        resetListScroll()

        await nextTick()
        // 确保虚拟列表使用新的行数据。
        rowVirtualizer.value.measure()
    },
)
// 排序处理函数（根据选中的排序类型排序）
const sortFosterHomes = (list: FosterHome[]) => {
    const sortedList = [...list]; // 深拷贝避免修改原数组
    switch (sortOption.value) {
        case 'rating': // 评分最高（降序）
            sortedList.sort((a, b) => b.rating - a.rating);
            break;
        case 'price': // 价格最低（升序）
            sortedList.sort((a, b) => a.price - b.price);
            break;
        case 'comprehensive': // 综合排序（默认按id/距离）
        default:
            sortedList.sort((a, b) => a.id - b.id); // 或按距离排序：a.distance - b.distance
            break;
    }
    return sortedList;
};

// 重置筛选
const resetFilters = () => {
    searchKeyword.value = ''
    filters.fosterTypes = [...initialFosterTypes]
    filters.petTypes = []
    filters.priceRange = [0, 200]
    filters.radius = initialRadius
    sortOption.value = 'comprehensive'
    // 重置分页状态
    currentPage.value = 1
    hasMore.value = true
    load()
}
const scrollToTop = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}
// 查看详情

const viewDetails = (foster: FosterHome) => {
    router.push({ name: 'fosterDetail', params: { id: foster.id } });
}

// 组件挂载时先加载列表，地图等待用户主动打开
onMounted(() => {
    nextTick(() => {
        let hasValidStoredLocation = false
        const storedLocation = localStorage.getItem('userLocation')

        if (storedLocation) {
            try {
                const location = JSON.parse(storedLocation)
                hasValidStoredLocation =
                    Number.isFinite(location.lat) &&
                    Number.isFinite(location.lng)
            } catch (error) {
                console.error('解析存储的位置信息失败:', error)
            }
        }

        if (!hasValidStoredLocation) {
            Object.assign(currentLocation, defaultLocation)
            userHomeAddress.value = defaultLocation.address
            reloadListForLocation()
        }
        if (!listScrollRef.value) return

        updateColumnCount(listScrollRef.value.clientWidth)

        listResizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (!entry) return

            const nextColumnCount =
                entry.contentRect.width >= 900 ? 2 : 1

            if (nextColumnCount === columnCount.value) return

            columnCount.value = nextColumnCount

            nextTick(() => {
                rowVirtualizer.value.measure()
                resetListScroll()
            })
        })

        listResizeObserver.observe(listScrollRef.value)
        locateUserPosition();
    });
});
// 离开页面清理地图和Marker
onUnmounted(() => {
    destroyFosterCluster()
    fosterMarkerById.forEach((marker) => marker.setMap(null))
    fosterMarkerById.clear()
    fosterSignatureById.clear()

    userMarker?.setMap(null)
    userMarker = null

    map?.destroy()
    map = null
    AMapInstance = null
    listResizeObserver?.disconnect()
    listResizeObserver = null
})


</script>

<style lang="scss" scoped>
@media (max-width: 1024px) {
    .map-container {
        height: 300px;
    }
}

.app {
    margin: 0;
    padding: 0;
    border-top: 1px solid transparent;

    .map-component-container {
        width: 100%;
        height: 100%;
        margin-top: 4rem;

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

        .cute-btn-secondary {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border: none;
            border-radius: 20px;
            color: #666;
            font-weight: 600;
            padding: 10px 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .cute-btn-secondary:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .map-container {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            position: relative;
        }

        #custom-map-container {
            width: 100%;
            height: 100%;
            min-height: 384px;
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



        /* 原有Element UI样式优化 */
        :deep(.el-rate__icon) {
            font-size: 18px;
        }

        :deep(.el-checkbox) {
            margin-right: 8px;
            margin-bottom: 4px;
        }

        :deep(.el-checkbox-group) {
            display: flex;
            flex-wrap: wrap;
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

        :deep(.el-input) {
            border-radius: 10px;
        }

        /* 无限滚动样式 */
        :deep(.el-infinite-scroll) {
            overflow: visible;
        }

        /* 地址选择器样式 */

    }


}

.address-selector-dialog {
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(74, 144, 226, 0.15);
}

.address-selector {
    max-height: 300px;
    overflow-y: auto;
    padding: 12px 8px;
}

.address-item {
    padding: 16px 18px;
    margin: 8px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    background-color: #fafafa;
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #4A90E2, #6BC4FF);
        transform: scaleY(0);
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
        background-color: #f0f7ff;
        transform: translateX(6px) scale(1.01);
        box-shadow: 0 4px 16px rgba(74, 144, 226, 0.15);
        border-color: rgba(74, 144, 226, 0.2);

        &::before {
            transform: scaleY(1);
        }
    }

    &:active {
        transform: translateX(4px) scale(0.99);
        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
    }

    &.is-selected {
        background: linear-gradient(135deg, rgba(74, 144, 226, 0.12), rgba(107, 196, 255, 0.08));
        border-color: #4A90E2;
        box-shadow: 0 4px 20px rgba(74, 144, 226, 0.2);
        transform: translateX(6px);

        &::before {
            transform: scaleY(1);
        }
    }
}

.address-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.address-text {
    font-size: 14px;
    color: #444;
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    transition: color 0.3s ease;
}

.address-item:hover .address-text {
    color: #4A90E2;
}

.address-item.is-selected .address-text {
    color: #4A90E2;
    font-weight: 600;
}

.check-icon {
    font-size: 20px;
    color: #4A90E2;
    flex-shrink: 0;
    animation: checkIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.3));
}

@keyframes checkIn {
    0% {
        transform: scale(0) rotate(-180deg);
        opacity: 0;
    }

    50% {
        transform: scale(1.2) rotate(0deg);
    }

    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

/* 对话框标题样式 */
/* 对话框标题样式 */
:deep(.el-dialog .el-dialog__header .el-dialog__title) {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.virtual-list {
    height: min(70vh, 640px);
    overflow-y: auto;
    overflow-x: hidden;
    contain: strict;
}

.virtual-list__inner {
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
}

.virtual-list__row {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-bottom: 16px;
}

.virtual-list__grid {
    display: grid;
    gap: 16px;
}

.list-item--selected {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgb(74 144 226 / 20%);
    background-color: #eff8ff;
}
</style>
