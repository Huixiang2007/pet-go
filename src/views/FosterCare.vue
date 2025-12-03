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
                                <h3 class="font-semibold text-gray-700 mb-2">你的位置</h3>
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm text-gray-600 truncate" :title="userHomeAddress">
                                        {{ userHomeAddress || '加载中...' }}
                                    </span>
                                    <button class="text-xs text-blue-500" @click="">
                                        去修改
                                    </button>
                                </div>
                                <div v-if="locationError" class="text-xs text-red-500 bg-red-50 p-2 rounded mt-1">
                                    ⚠️ {{ locationError }}
                                </div>
                                <div v-else-if="currentLocation.address"
                                    class="text-sm text-green-600 bg-green-50 p-2 rounded mt-2">
                                    <i class="iconfont mr-1 ">&#xe603;</i>
                                    <span class="">已定位: {{ currentLocation.address }}</span>
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
                                <el-checkbox-group v-model="filters.fosterTypes">
                                    <el-checkbox value="个人">个人</el-checkbox>
                                    <el-checkbox value="机构">机构</el-checkbox>
                                </el-checkbox-group>
                            </div>

                            <!-- 宠物类型 -->
                            <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">宠物类型</h3>
                                <el-checkbox-group v-model="filters.petTypes">
                                    <el-checkbox v-for="pet in allPetTypes" :key="pet" :value="pet">{{ pet
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </div>

                            <!-- 价格区间 -->
                            <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">价格区间 (元/天)</h3>
                                <el-slider v-model="filters.priceRange" range :min="0" :max="200"
                                    :step="10"></el-slider>
                                <div class="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>{{ filters.priceRange[0] }}元</span>
                                    <span>{{ filters.priceRange[1] }}元</span>
                                </div>
                            </div>

                            <!-- 评分 -->
                            <!-- <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">评分</h3>
                                <el-rate v-model="filters.minRating"
                                    :colors="['#F7B500', '#F7B500', '#F7B500']"></el-rate>
                            </div> -->

                            <!-- 智能排序 -->
                            <div class="mb-5">
                                <h3 class="font-semibold text-gray-700 mb-2">智能排序</h3>
                                <el-select v-model="sortOption" placeholder="选择排序方式" class="w-full">
                                    <el-option label="综合排序" value="comprehensive"></el-option>
                                    <!-- <el-option label="距离最近" value="distance"></el-option> -->
                                    <el-option label="评分最高" value="rating"></el-option>
                                    <el-option label="价格最低" value="price"></el-option>
                                </el-select>
                            </div>

                            <button class="cute-btn w-full mt-4" @click="applyFilters">应用筛选</button>
                            <button class="cute-btn-secondary w-full mt-2" @click="resetFilters">重置筛选</button>
                        </div>

                        <!-- 当前位置卡片 -->
                        <!-- <div class="cute-card p-4 bg-white" v-if="currentLocation.address">
                            <div class="flex items-center">
                                <div class="pet-icon bg-blue-400 mr-3">📍</div>
                                <div>
                                    <p class="font-semibold">参考位置</p>
                                    <p class="text-sm text-gray-600">{{ currentLocation.address }}</p>
                                </div>
                            </div>
                            <div class="mt-2 text-sm text-gray-500">
                                <p>距离计算以此位置为参考</p>
                            </div>
                        </div> -->
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

                        <div class="cute-card p-4 bg-white mb-4" v-if="filteredFosters.length > 0">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">找到 {{ filteredFosters.length }} 个寄养服务</span>
                                <span class="text-sm text-blue-500">参考位置: {{ currentLocation.address || '未定位' }}</span>
                            </div>
                        </div>

                        <div class="cute-card p-5 bg-white">
                            <h2 class="text-xl font-bold text-blue-500 mb-4">附近的寄养家庭</h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="foster in filteredFosters" :key="foster.id"
                                    class="border border-blue-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 bg-blue-50/30 hover:bg-blue-50/50 cursor-pointer"
                                    @click="focusOnMarker(foster)">
                                    <div class="flex">
                                        <div
                                            class="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                            <span class="text-2xl">🐾</span>
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex justify-between items-start">
                                                <h3 class="font-bold text-lg text-gray-800">{{ foster.name }}</h3>
                                                <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                                    {{ foster.type }}
                                                </span>
                                            </div>
                                            <div class="flex items-center mt-1">
                                                <el-rate :model-value="foster.rating" disabled
                                                    :colors="['#F7B500', '#F7B500', '#F7B500']" class="mr-2"></el-rate>
                                                <span class="text-sm text-gray-600">({{ foster.reviewCount }})</span>
                                            </div>
                                            <p class="text-gray-600 text-sm mt-1 truncate">{{ foster.address }}</p>
                                            <div class="flex items-center mt-1">
                                                <span class="text-xs text-gray-500">可接受: </span>
                                                <div class="flex ml-1">
                                                    <span v-for="pet in foster.petTypes" :key="pet"
                                                        class="text-xs bg-gray-100 px-1 rounded mr-1">
                                                        {{ pet }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="flex justify-between items-center mt-2">
                                                <span class="text-blue-500 font-bold">{{ foster.price }}元/天</span>
                                                <div class="flex items-center">
                                                    <span class="text-xs text-gray-500 mr-2" v-if="currentLocation.lat">
                                                        距离: {{ calculateDistance(foster).toFixed(1) }}km
                                                    </span>

                                                </div>
                                            </div>
                                            <button class="cute-btn w-full mt-3" @click.stop="viewDetails(foster)">
                                                查看详情
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="filteredFosters.length === 0" class="text-center py-8">
                                <div class="text-4xl mb-4">🐾</div>
                                <p class="text-gray-500 text-lg mb-2">没有找到符合条件的寄养家庭</p>
                                <p class="text-gray-400 text-sm mb-4">尝试调整筛选条件或搜索关键词</p>
                                <button class="cute-btn" @click="resetFilters">重置筛选条件</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import AMapLoader from "@amap/amap-jsapi-loader";
import NavBar from '@/components/NavBar.vue';
import { useRouter } from 'vue-router'

// 地图相关
const mapContainer = ref<HTMLElement>()
let map: any = null
let markers: any[] = []
let geocoder: any = null
let AMapInstance: any = null
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

// 筛选条件
const filters = reactive({
    fosterTypes: ['个人', '机构'],
    petTypes: [] as string[],
    priceRange: [0, 200] as [number, number],
    minRating: 0,
})

// 排序选项
const sortOption = ref('comprehensive')

// 所有宠物类型
const allPetTypes = ref(['猫', '狗', '鱼', '鸟类', '兔子', '蛇', '其他'])

// 搜索关键词
const searchKeyword = ref('')
interface FosterHome {
    id: number;
    createBy: number;
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
}
// 寄养服务数据
const fosterHomes = ref<FosterHome[]>([
    {
        id: 1,//寄养方ID
        createBy: 2,//创建人ID
        name: '爱心宠物寄养中心',
        cover: 'https://picsum.photos/200/300',//封面
        type: '机构',
        lat: 35.2890,
        lng: 113.9300,
        address: '新乡市红旗区华兰大道东段',
        rating: 4.8,
        reviewCount: 128,
        price: 120,
        petTypes: ['猫', '狗', '兔子'],
    },
    {
        id: 2,
        createBy: 3,//创建人ID
        name: '喵星人小屋',
        cover: 'https://picsum.photos/200/300',//封面
        type: '个人',
        lat: 35.2850,
        lng: 113.9250,
        address: '新乡市红旗区五一路',
        rating: 4.5,
        reviewCount: 76,
        price: 80,
        petTypes: ['猫'],
    },
    {
        id: 3,
        createBy: 4,//创建人ID
        cover: 'https://picsum.photos/200/300',//封面

        name: '汪汪宠物乐园',
        type: '机构',
        lat: 35.2820,
        lng: 113.9320,
        address: '新乡市牧野区建设路',
        rating: 4.9,
        reviewCount: 203,
        price: 150,
        petTypes: ['狗'],
    },
    {
        id: 4,
        createBy: 5,//创建人ID
        cover: 'https://picsum.photos/200/300',//封面

        name: '小宠之家',
        type: '个人',
        lat: 35.2900,
        lng: 113.9200,
        address: '新乡市卫滨区解放大道',
        rating: 4.7,
        reviewCount: 94,
        price: 70,
        petTypes: ['仓鼠', '兔子', '鸟类'],
    },
    {
        id: 5,
        createBy: 6,//创建人ID
        cover: 'https://picsum.photos/200/300',//封面

        name: '全能宠物托管',
        type: '机构',
        lat: 35.2800,
        lng: 113.9350,
        address: '新乡市凤泉区宝山大道',
        rating: 4.6,
        reviewCount: 156,
        price: 100,
        petTypes: ['猫', '狗', '仓鼠', '兔子', '鸟类'],
    }
])

// 筛选后的寄养家庭
const filteredFosters = computed(() => {
    let result = [...fosterHomes.value]

    // 搜索筛选
    if (searchKeyword.value.trim()) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(foster =>
            foster.name.toLowerCase().includes(keyword) ||
            foster.petTypes.some(pet => pet.toLowerCase().includes(keyword)) ||
            foster.address.toLowerCase().includes(keyword)
        )
    }

    // 寄养类型筛选
    if (filters.fosterTypes.length > 0) {
        result = result.filter(foster => filters.fosterTypes.includes(foster.type))
    }

    // 宠物类型筛选
    if (filters.petTypes.length > 0) {
        result = result.filter(foster =>
            foster.petTypes.some(pet => filters.petTypes.includes(pet))
        )
    }

    // 价格筛选
    result = result.filter(foster =>
        foster.price >= filters.priceRange[0] && foster.price <= filters.priceRange[1]
    )

    // 评分筛选
    result = result.filter(foster => foster.rating >= filters.minRating)

    // 排序
    if (sortOption.value === 'distance' && currentLocation.lat) {
        result.sort((a, b) => calculateDistance(a) - calculateDistance(b))
    } else if (sortOption.value === 'rating') {
        result.sort((a, b) => b.rating - a.rating)
    } else if (sortOption.value === 'price') {
        result.sort((a, b) => a.price - b.price)
    }

    return result
})

// 从后端获取用户家庭住址
const getUserHomeAddress = async () => {
    const loading = ElLoading.service({ text: '获取家庭住址中...' })
    try {
        // 实际项目中替换为真实接口
        // const res = await api.getUserInfo();
        // userHomeAddress.value = res.data.address;

        // 模拟后端返回（测试用，实际删除此行）
        userHomeAddress.value = '河南省新乡市河南科技学院';

        if (!userHomeAddress.value) {
            locationError.value = '未获取到您的家庭住址，请先完善个人信息';
            return;
        }

        // 获取地址后解析经纬度
        await parseAddressToLatLng(userHomeAddress.value);
    } catch (err) {
        console.error('获取家庭住址失败:', err);
        locationError.value = '获取地址失败，请稍后重试';
    } finally {
        loading.close();
    }
}

// 地址转经纬度
const parseAddressToLatLng = async (address: string) => {
    if (!geocoder) {
        locationError.value = '地图服务未就绪，请稍等';
        return;
    }

    return new Promise((resolve) => {
        geocoder.getLocation(address, (status: string, result: any) => {
            if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
                const { location, formattedAddress } = result.geocodes[0];
                if (location && !isNaN(location.lat) && !isNaN(location.lng)) {
                    console.log('解析地址经纬度:', location);
                    // 确保经纬度有效
                    currentLocation.lat = location.lat;
                    currentLocation.lng = location.lng;
                    currentLocation.address = formattedAddress;
                    locationError.value = '';

                    // 更新地图中心
                    if (map) {
                        map.setCenter([currentLocation.lng, currentLocation.lat]);
                        map.setZoom(15);
                        updateMapMarkers(); // 刷新标记
                    }
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


// 计算两点距离（公里）
const calculateDistance = (foster: any): number => {
    if (!currentLocation.lat || !currentLocation.lng) return Infinity;

    const R = 6371; // 地球半径（公里）
    const dLat = (foster.lat - currentLocation.lat) * Math.PI / 180;
    const dLng = (foster.lng - currentLocation.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(currentLocation.lat * Math.PI / 180) * Math.cos(foster.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
    }).then((AMap: any) => {
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
    }).catch((err: any) => {
        console.error('地图加载失败:', err);
        mapLoadError.value = `地图加载失败: ${err.message || '请检查API密钥'}`;
        loading.close();
    });
}

// 更新地图标记
const updateMapMarkers = () => {
    if (!map) return;

    // 清除现有标记
    markers.forEach(marker => marker.remove && marker.remove());
    markers = [];

    // 添加用户位置标记
    if (currentLocation.lat && currentLocation.lng && !isNaN(currentLocation.lat) && !isNaN(currentLocation.lng)) {
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
    filteredFosters.value.forEach(foster => {
        if (!foster.lng || !foster.lat || isNaN(foster.lng) || isNaN(foster.lat)) {
            console.warn(`寄养家庭 ${foster.name} 经纬度无效，跳过标记`);
            return;
        }


        const marker = new AMapInstance.Marker({
            position: [foster.lng, foster.lat],
            content: `
                <div style="
                    background-color:'#ff6b8c';
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
}

// 聚焦到寄养家庭
const focusOnMarker = (foster: any) => {
    if (map && foster.lng && foster.lat && !isNaN(foster.lng) && !isNaN(foster.lat)) {
        map.setCenter([foster.lng, foster.lat]);
        map.setZoom(16);
    }
}

// 搜索处理
const handleSearch = () => {
    applyFilters();
}

// 应用筛选
const applyFilters = () => {
    updateMapMarkers();
    // 筛选后请求后端（实际项目中启用）
    // if (currentLocation.lat && currentLocation.lng) {
    //     fetchNearbyFosters();
    // }
}

// 重置筛选
const resetFilters = () => {
    searchKeyword.value = '';
    filters.fosterTypes = ['个人', '机构'];
    filters.petTypes = [];
    filters.priceRange = [0, 200];
    filters.minRating = 0;
    sortOption.value = 'comprehensive';
    applyFilters();
}

// 查看详情
const router = useRouter();
const viewDetails = (foster: any) => {
    ElMessage.success(`查看 ${foster.name} 的详情`);
    // 实际项目中跳转到详情页
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
/* 适配移动端 */
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
    }
}
</style>