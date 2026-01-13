export type Course = {
  id?: string
  slug: string
  title: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string
  language?: 'JavaScript' | 'TypeScript' | 'Python' | 'UI/UX' | 'Data' | 'AI' | string
  tags?: string[]
  description: string
  thumbnail: string
  duration: string
  lessons: number
  projects: number
  tools: string[]
  highlight?: boolean
  price?: number
  originalPrice?: number
  whatYouWillLearn?: string[]
  modules?: Array<{
    name: string
    meta?: string
    lessons?: string[]
  }>
  instructor?: {
    name: string
    role: string
    avatarUrl?: string
    bio?: string
  }
  paymentFeatures?: string[]
  paymentMethods?: string[]
}
