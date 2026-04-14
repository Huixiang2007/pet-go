type DateString = `${number}-${number}-${number}`
interface HealthRecords {
  // 疫苗
  vaccineList: Array<{
    id?: number
    vaccineType: string
    date: DateString
    nextReminderDate?: DateString
  }>
  // 驱虫
  dewormingList: Array<{
    id?: number
    medicine: string
    date: DateString
    nextReminderDate?: DateString
  }>
  //病历
  medicalList: Array<{
    id?: number
    hospital: string
    diagnosis: string //诊断
    medicine: string
    date: DateString
    nextReminderDate?: DateString
  }>
}
interface Photos {
  src: string
  description: string
  date: DateString
}
interface GrowthRecords {
  id?: number
  age: string
  photos: Array<Photos>
}

export interface Pet {
  id: number
  userId: number
  name: string
  type: string
  breed: string
  avatar: string
  gender: '公' | '母'
  birthday: DateString
  age: number
  weight: number
  sterilization: '已绝育' | '未绝育'
  healthStatus: string
  characterTags: string[]
  healthRecords?: HealthRecords
  growthRecords?: GrowthRecords[]
}
export interface MyPets {
  id: number
  name: string
  type: string
}
