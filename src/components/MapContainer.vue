<template>
  <div id="container"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, onUnmounted, ref } from 'vue'

export default {
  name: 'MapContainer',
  setup() {
    let map = ref(null)

    // 浏览器原生定位函数
    const browserGeolocation = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('浏览器不支持定位功能'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const lat = position.coords.latitude
              const lng = position.coords.longitude
              console.log('浏览器定位成功:', lng, lat)

              // 将WGS84坐标转换为高德坐标
              if (window.AMap) {
                window.AMap.convertFrom([lng, lat], 'gps', (status, result) => {
                  if (status === 'complete' && result.info === 'ok') {
                    const converted = result.locations[0]
                    resolve([converted.lng, converted.lat])
                  } else {
                    // 转换失败，使用原始坐标
                    resolve([lng, lat])
                  }
                })
              } else {
                resolve([lng, lat])
              }
            } catch (error) {
              reject(error)
            }
          },
          (error) => {
            let errorMsg = '定位失败：'
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMsg += '用户拒绝了定位请求'
                break
              case error.POSITION_UNAVAILABLE:
                errorMsg += '无法获取当前位置信息'
                break
              case error.TIMEOUT:
                errorMsg += '定位请求超时'
                break
              default:
                errorMsg += '未知错误'
            }
            reject(new Error(errorMsg))
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        )
      })
    }

    // IP城市定位
    const ipLocation = () => {
      return new Promise((resolve, reject) => {
        window.AMap.plugin('AMap.CitySearch', function () {
          const citySearch = new window.AMap.CitySearch()
          citySearch.getLocalCity((status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              console.log('IP定位成功:', result)
              // console.log(result.rectangle)
              // 使用城市中心坐标
              // 根据你打印的数据结构，rectangle是主要坐标来源
              if (result.rectangle) {
                console.log('解析rectangle:', result.rectangle)

                // rectangle格式: "左下经度,左下纬度,右上经度,右上纬度"
                // 你的是: "113.8240993, 82.8032046, 114.2748935, 53.108106"
                const coords = result.rectangle.split(',').map((coord) => parseFloat(coord.trim()))

                // 检查坐标是否有效
                if (coords.length === 4 && !coords.some(isNaN)) {
                  const centerLng = (coords[0] + coords[2]) / 2
                  const centerLat = (coords[1] + coords[3]) / 2
                  console.log('计算出的中心点:', centerLng, centerLat)
                  resolve([centerLng, centerLat])
                } else {
                  reject(new Error('rectangle坐标格式错误'))
                }
              }
            } else {
              reject(new Error('IP定位失败'))
            }
          })
        })
      })
    }

    // 智能定位 - 多级降级
    const smartLocation = async () => {
      console.log('开始智能定位...')

      // 第一级：尝试浏览器原生定位
      try {
        const position = await browserGeolocation()
        console.log('浏览器定位成功:', position)
        return position
      } catch (error) {
        console.log('浏览器定位失败:', error.message)
      }

      // 第二级：尝试高德定位
      try {
        const amapPosition = await new Promise((resolve, reject) => {
          window.AMap.plugin('AMap.Geolocation', function () {
            const geolocation = new window.AMap.Geolocation({
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
              noIpLocate: true, // 禁用IP定位
              convert: true,
            })

            geolocation.getCurrentPosition((status, result) => {
              if (status === 'complete') {
                resolve(result.position)
              } else {
                reject(new Error(result.message || '高德定位失败'))
              }
            })
          })
        })
        console.log('高德定位成功:', amapPosition)
        return amapPosition
      } catch (error) {
        console.log('高德定位失败:', error.message)
      }

      // 第三级：使用IP城市定位
      try {
        const cityPosition = await ipLocation()
        console.log('IP定位成功:', cityPosition)
        return cityPosition
      } catch (error) {
        console.log('IP定位失败:', error.message)
        throw new Error(
          '所有定位方式都失败了！请检查：\n1. 定位权限是否开启\n2. 网络连接是否正常\n3. 刷新页面重试'
        )
      }
    }

    // 初始化地图和定位
    const initMap = async () => {
      try {
        // 高德地图安全配置
        window._AMapSecurityConfig = {
          securityJsCode: '76efd4e49a820ee84255d33dffeb374f',
        }

        // 加载高德地图
        const AMap = await AMapLoader.load({
          key: 'f9a61d8c1043186ca29b9675925160ff',
          version: '2.0',
          plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.Geolocation', 'AMap.CitySearch'],
        })

        // 创建地图实例
        map.value = new AMap.Map('container', {
          viewMode: '3D',
          zoom: 11,
          center: [116.397428, 39.90923], // 默认北京中心，会被定位覆盖
        })

        // 添加工具栏
        AMap.plugin(['AMap.ToolBar'], function () {
          const toolbar = new AMap.ToolBar()
          map.value.addControl(toolbar)
        })

        // 执行智能定位
        try {
          const position = await smartLocation()
          console.log('最终定位位置:', position)

          // 设置地图中心
          map.value.setCenter(position)
          map.value.setZoom(15)

          // 添加位置标记
          new AMap.Marker({
            position: position,
            map: map.value,
            title: '我的位置',
          })

          console.log('定位和地图初始化完成！')
        } catch (locationError) {
          console.error('定位失败:', locationError)
          // 即使定位失败，地图也已经初始化成功
          alert(locationError.message)
        }
      } catch (error) {
        console.error('地图初始化失败:', error)
        alert('地图加载失败，请检查网络连接')
      }
    }

    onMounted(() => {
      initMap()
    })

    onUnmounted(() => {
      if (map.value) {
        map.value.destroy()
      }
    })

    return {
      map,
    }
  },
}
</script>

<style>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
</style>