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
                                        去修改
                                    </button>
                                </div>

                                <!-- <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm text-gray-600 truncate" :title="userHomeAddress">
                                        {{ userHomeAddress || '加载中...' }}
                                    </span>
                                    
                                </div> -->
                                <div v-if="locationError" class="text-xs text-red-500 bg-red-50 p-2 rounded mt-1">
                                    ⚠️ {{ locationError }}
                                </div>
                                <div v-else-if="currentLocation.address"
                                    class="text-sm text-green-600 bg-green-50 p-2 rounded mt-2">
                                    <i class="iconfont mr-1 ">&#xe603;</i>
                                    <span class="">已定位: {{ userHomeAddress }}</span>

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
                            <div class="map-container h-96">
                                <!-- 地图加载失败提示 -->
                                <div v-if="mapLoadError"
                                    class="w-full h-full flex items-center justify-center bg-gray-50">
                                    <div class="text-center">
                                        <p class="text-red-500 mb-2">地图加载失败</p>
                                        <p class="text-xs text-gray-400">{{ mapLoadError }}</p>
                                        <button class="text-xs text-blue-500 mt-2" @click="initMap">重试</button>
                                    </div>
                                </div>
                                <!-- 地图容器 -->
                                <div id="custom-map-container" ref="mapContainer" v-else></div>
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
                            <div class="infinite-list-wrapper" style="overflow: auto">
                                <ul v-infinite-scroll="load" class="list" :infinite-scroll-disabled="disabled"
                                    :infinite-scroll-immediate="false" style="list-style: none; margin: 0; padding: 0;
                                    display: grid;
                                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                                    gap: 16px;
                                    margin-bottom: 16px;
                                    ">
                                    <li v-for="foster in fosterHomes" :key="foster.id" @click="focusOnMarker(foster)"
                                        class="list-item border border-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 bg-blue-50/30 hover:bg-blue-50/50 cursor-pointer">
                                        <div style="
                                          border: 1px solid #e0f0ff;
                                          border-radius: 16px;
                                          padding: 16px;
                                          background-color: rgba(224, 240, 255, 0.15);
                                           transition: all 0.3s ease;
                                            cursor: pointer;
                                           ">
                                            <div class="flex flex-col">

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




                                            </div>
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElLoading, } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import AMapLoader from "@amap/amap-jsapi-loader";
import NavBar from '@/components/common/NavBar.vue';
import { useRouter } from 'vue-router'
import request from '@/utils/request';
declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}

const router = useRouter();

const goToPerson = () => {
    router.push({ path: '/person' })
}
// 地图相关
const mapContainer = ref<HTMLElement>()
let map: any = null
let markers: any = []
let geocoder: any | null = null
let AMapInstance: any | null = null
const mapLoadError = ref('')

// 用户家庭住址相关
const userHomeAddress = ref('')
const locationError = ref('')

// 当前定位信息（经纬度+地址）
const currentLocation = reactive({
    lat: 0 as number,
    lng: 0 as number,
    address: '' as string
})
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


// 筛选条件
const filters = reactive({
    fosterTypes: ["个人"],
    petTypes: [] as string[],
    priceRange: [0, 200] as [number, number],
    radius: '5', // 默认5公里
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




// 获取用户家庭住址
const getUserHomeAddress = async () => {
    const loading = ElLoading.service({ text: '获取家庭住址中...' })
    try {
        const response = await request(
            '/server/api/user/getDefaultUserAddress',
            'GET'
        );
        if (response.code === 0) {
            console.log('获取用户地址响应:', response.data.detailAddress);
            userHomeAddress.value = response.data.detailAddress;

            // 获取地址后解析经纬度
            await parseAddressToLatLng(userHomeAddress.value);
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
// 地址转经纬度
const parseAddressToLatLng = async (address: string) => {
    if (!geocoder) {
        locationError.value = '地图服务未就绪，请稍等';
        return;
    }

    return new Promise((resolve) => {
        geocoder.getLocation(address, (status: string, result: GeocodeResult) => {
            if (status === 'complete' && result.geocodes != undefined && result.geocodes.length > 0) {
                const { location, formattedAddress } = result.geocodes[0]!;
                if (location && !isNaN(location.lat) && !isNaN(location.lng)) {
                    currentLocation.lat = location.lat;
                    currentLocation.lng = location.lng;
                    currentLocation.address = formattedAddress;
                    locationError.value = '';
                    console.log(requestParams.value);
                    // 更新地图中心
                    if (map) {
                        map.setCenter([currentLocation.lng, currentLocation.lat]);
                        map.setZoom(15);
                    }

                    // 初始化请求数据
                    nextTick(() => {
                        load();
                    });
                    resolve(true);
                } else {
                    locationError.value = '地址解析失败，无法获取有效位置';
                    resolve(false);
                }
            } else {
                locationError.value = `地址解析失败: ${result.info || '未知错误'}`;
                resolve(false);
            }
        });
    });
}



// 初始化地图

const initMap = () => {
    if (!mapContainer.value) {
        mapLoadError.value = '地图容器未找到';
        return;
    }

    mapLoadError.value = '';
    const loading = ElLoading.service({ text: '加载地图中...' });

    window._AMapSecurityConfig = {
        securityJsCode: "76efd4e49a820ee84255d33dffeb374f",
    };

    AMapLoader.load({
        key: "f9a61d8c1043186ca29b9675925160ff",
        version: "2.0",
        plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.Geocoder"],
    }).then((AMap: any
    ) => {
        AMapInstance = AMap;

        map = new AMap.Map("custom-map-container", {
            viewMode: "3D",
            zoom: 12,
            center: [113.9274, 35.2869]
        });

        // 添加地图控件
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());

        // 初始化地理编码器
        geocoder = new AMap.Geocoder({ city: "全国" });

        // 地图加载完成后，获取用户地址并定位
        getUserHomeAddress();

        ElMessage.success('地图加载成功');
        loading.close();
    }).catch((err) => {
        console.error('地图加载失败:', err);
        mapLoadError.value = `地图加载失败: ${err.message || '请检查API密钥'}`;
        loading.close();
    });
}

// 更新地图标记
const updateMapMarkers = () => {
    if (!map) return;

    // 清除现有标记
    markers.forEach((marker: any

    ) => marker.remove && marker.remove());
    markers = [];

    // 添加用户位置标记
    if (currentLocation.lat && currentLocation.lng && !isNaN(currentLocation.lat) && !isNaN(currentLocation.lng)) {
        console.log('添加用户位置标记:', currentLocation);
        const userMarker = new AMapInstance.Marker({
            position: [currentLocation.lng, currentLocation.lat],
            content: `
                <div style="
                    background: #FF6B6B;
                    border: 2px solid white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                ">
                    <span style="color:white;font-size:12px;">📍</span>
                </div>
            `,
            offset: new AMapInstance.Pixel(-12, -12)
        });
        markers.push(userMarker);
        map.add(userMarker);
    }

    // 添加寄养家庭标记
    fosterHomes.value.forEach(foster => {
        if (!foster.lng || !foster.lat || isNaN(foster.lng) || isNaN(foster.lat)) {
            console.warn(`寄养家庭 ${foster.name} 经纬度无效，跳过标记`);
            return;
        }


        const marker = new AMapInstance.Marker({
            position: [foster.lng, foster.lat],
            content: `
                <div style="
                    background-color:#ff6b8c;
                    border: 2px solid white;
                    border-radius: 20px;
                    padding: 5px 10px;
                    color: white;
                    font-size: 12px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                ">
                    ${foster.name}
                </div>
            `,
            offset: new AMapInstance.Pixel(-50, -30)
        });
        marker.on('click', () => focusOnMarker(foster));
        markers.push(marker);
        map.add(marker);
    });
    fitMapToMarkers();
}

const fitMapToMarkers = () => {
    if (!map || markers.length === 0) return;

    // 收集所有标记的经纬度
    const bounds = new AMapInstance.Bounds();
    markers.forEach((marker: any

    ) => {
        bounds.extend(marker.getPosition());
    });

    // 适配范围（添加padding避免标记贴边）
    map.setBounds(bounds, false, [20, 20, 20, 20]);
};
// 聚焦到寄养家庭
const focusOnMarker = (foster: FosterHome) => {

    if (map && foster.lng && foster.lat && !isNaN(foster.lng) && !isNaN(foster.lat)) {
        map.setCenter([foster.lng, foster.lat]);
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
                ElMessage.info('已加载全部数据');
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
    }
}



// 搜索处理
const handleSearch = () => {
    currentPage.value = 1; // 重置为第一页
    hasMore.value = true;
    load();
}

// 筛选条件变化
const handleFilterChange = () => {
    currentPage.value = 1;
    hasMore.value = true;
    load();
}

// 半径变化（防抖处理）
const handleRadiusInput = () => {

    handleRadiusConfirm(); // 防抖后执行请求

};
const handleRadiusConfirm = () => {
    currentPage.value = 1;
    hasMore.value = true;
    load();
};
// 排序变化
const handleSortChange = () => {
    currentPage.value = 1;
    hasMore.value = true;
    load();
}

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
    filters.fosterTypes = ["个人"]
    filters.petTypes = []
    filters.priceRange = [0, 200]
    filters.radius = '5'
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

// 组件挂载时初始化地图
onMounted(() => {
    nextTick(() => {
        initMap();
    });
});


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
    }
}
</style>