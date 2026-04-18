// 品牌接口
export interface Brand {
  id: number;
  name: string;
  logo: string;
}

// 分类接口
export interface Category {
  id: number;
  name: string;
  parentId: number;
}

export interface Type {
  id: number;
  name: string;
}

export interface ShopRegisterForm {
  shopName: string;
  shopType: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  province: string;
  city: string;
  district: string;
  address: string;
  description: string;
  shopAvatar: string;
  businessLicense: string;
  idCardFront: string;
  idCardBack: string;
}

// 商品编辑表单接口
export interface ProductEditForm {
  id?: string | number
  productName: string
  productSn: string
  brandId: number
  typeParent: number
  typeChild: number
  currentPrice: number
  marketPrice: number
  costPrice: number
  stock: number
  status: number
  detail: string
  mainImage: string
  imagesList: string[]
  videoUrl?: string
  warrantyTip?: string
}
export interface SkuInfo {
  skuId: string | number
  productId: number
  skuSn: string
  specJson: string | null
  specText: string
  imageUrl?: string
  price?: number
  stock?: number
  volume?: number
  weight?: number
}

// 商品详情接口
export interface ProductDetail {
  id: number | string
  brandId: string | number
  couponsList: Array<{
    id:string | number
    denomination?: number
    minAmount?: number
    couponType?: string
    couponName?: string
    discountType?: string
    discount?: number
  }>
  shopOwnerId: number
  currentPrice: number
  detail: string | null
    brandName: string
  images: string | null
  mainImage: string
  imageUrls: string[]
  marketPrice: number
  name: string
  productScore: number
  productSn: string
  productWeight: number
  reviewCount: number
  sales: number
  shopId: string
  shopName: string
  shopType: string
  skuList: SkuInfo[]
  subTitle: string
  title: string
  typeId: number
  videoUrl: string
  warrantyTip: string
}
//面向用户的商品接口
export interface Products {
  id: string
  mainImage: string
  brandName: string
  shopName: string
  sales: number
  currentPrice: number
  originalPrice: number
  warrantyTip: string
  title: string
}
//购物车
export interface CartItem {
  productName?: string;
  skuSpecText?: string;
  mainImage?: string;
  id: number
  skuId?: number
  productId?: number
  stock?: number
  shopName?: string
  name: string
  price: number
  imgUrl: string
  spec: string
  quantity: number
  selected: boolean | string
    status?: string
  invalidReason?: string
}
//订单
export interface Order {
  id: string
  orderSn: string
  date: string
  status: string
  statusType: 'pending' | 'shipping' | 'receiving' | 'returning'
  product: {
    name: string
    image: string
    spec: string
  }
  price: number
  quantity: number
  total: number
}
