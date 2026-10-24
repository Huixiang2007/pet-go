// import './assets/main.css'

import { createApp } from 'vue'

import './index.css'
import App from './App.vue'

// 只引入项目实际使用的图标
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Back,
  Bell,
  Box,
  Calendar,
  ChatDotRound,
  Check,
  CircleCheckFilled,
  CircleClose,
  CircleCloseFilled,
  Clock,
  Close,
  DataBoard,
  Delete,
  Document,
  DocumentAdd,
  DocumentCopy,
  Download,
  Edit,
  EditPen,
  Female,
  Flag,
  GoldMedal,
  Goods,
  HomeFilled,
  House,
  Loading,
  Location,
  Lock,
  MagicStick,
  Male,
  Menu,
  Message,
  Money,
  MoreFilled,
  Notebook,
  Picture,
  PieChart,
  Plus,
  Refresh,
  Search,
  Service,
  Setting,
  Shop,
  ShoppingCart,
  Stamp,
  Star,
  StarFilled,
  SuccessFilled,
  SwitchButton,
  Ticket,
  Timer,
  TrophyBase,
  UploadFilled,
  User,
  UserFilled,
  View,
  Wallet,
  Warning,
} from '@element-plus/icons-vue'
// import 'element-plus/dist/index.css'
// import ElementPlus from 'element-plus'
import router from './router/index'
import '@/assets/icon.css'
import { store } from './stores'
import { ElInfiniteScroll, ElLoading } from 'element-plus'
import '@fortawesome/fontawesome-free/css/all.min.css'
const app = createApp(App)
// 注册所有图标
const ElementPlusIcons = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Back,
  Bell,
  Box,
  Calendar,
  ChatDotRound,
  Check,
  CircleCheckFilled,
  CircleClose,
  CircleCloseFilled,
  Clock,
  Close,
  DataBoard,
  Delete,
  Document,
  DocumentAdd,
  DocumentCopy,
  Download,
  Edit,
  EditPen,
  Female,
  Flag,
  GoldMedal,
  Goods,
  HomeFilled,
  House,
  Loading,
  Location,
  Lock,
  MagicStick,
  Male,
  Menu,
  Message,
  Money,
  MoreFilled,
  Notebook,
  Picture,
  PieChart,
  Plus,
  Refresh,
  Search,
  Service,
  Setting,
  Shop,
  ShoppingCart,
  Stamp,
  Star,
  StarFilled,
  SuccessFilled,
  SwitchButton,
  Ticket,
  Timer,
  TrophyBase,
  UploadFilled,
  User,
  UserFilled,
  View,
  Wallet,
  Warning,
}
for (const [key, component] of Object.entries(ElementPlusIcons)) {
  app.component(key, component)
}
app.use(store)
app.use(router)
// app.use(ElementPlus)

app.use(ElLoading)
app.use(ElInfiniteScroll)
app.mount('#app')
