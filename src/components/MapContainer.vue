<template>
    <div id="map-container">
    </div>
    <div id="myPageTop">
        <table>
            <tr>
                <td>
                    <label>请输入关键字：</label>
                </td>
            </tr>
            <tr>
                <td>
                    <input id="tipinput" />
                </td>
            </tr>
        </table>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

// 关键：手动声明高德地图核心类型（替代@types/amap-js-api）
declare const AMap: any; // 声明AMap全局对象（忽略细节类型，专注功能可用）
type AMapMap = { // 简单定义Map实例的核心方法，满足代码提示和类型检查
    addControl: (control: any) => void;
    destroy: () => void;
};
let map: AMapMap | null = null; // 明确map类型
// 声明window上的安全配置属性，避免类型报错
declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}

onMounted(() => {
    window._AMapSecurityConfig = {
        securityJsCode: "76efd4e49a820ee84255d33dffeb374f",
    };
    AMapLoader.load({
        key: "f9a61d8c1043186ca29b9675925160ff", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale", 'AMap.ToolBar', "AMap.Geolocation", 'AMap.AutoComplete'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
        .then((AMap) => {
            map = new AMap.Map("map-container", {
                // 设置地图容器id
                viewMode: "3D", // 是否为3D地图模式
                zoom: 11, // 初始化地图级别
                center: [116.397428, 39.90923], // 初始化地图中心点位置
            });


            let toolbar = new AMap.ToolBar(); //创建工具条插件实例
            map?.addControl(toolbar); //添加工具条插件到页面
            // toolbar.hide() //设置工具条隐藏


            //在回调函数中实例化插件，并使用插件功能
            let scale = new AMap.Scale(); //创建工具条插件实例
            map?.addControl(scale); //添加工具条插件到页面


            //在回调函数中实例化插件，并使用插件功能
            let geolocation = new AMap.Geolocation(); //创建工具条插件实例
            map?.addControl(geolocation); //添加工具条插件到页面

            let auto = new AMap.AutoComplete({
                city: '010'
            });



        })
        .catch((e) => {
            console.log(e);
        });
});

onUnmounted(() => {
    map?.destroy();
});
</script>
<style scoped>
#map-container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 800px;
}
</style>