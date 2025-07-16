import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Post {
  id: string
  title: string
  excerpt?: string
  content: string
  category_id?: string
  tags: string[]
  featured_image?: string
  status: 'draft' | 'published'
  featured: boolean
  post_type: 'article' | 'thread'
  author_id: string
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface Comment {
  id: string
  post_id: string
  parent_id?: string
  author_name: string
  author_email?: string
  content: string
  approved: boolean
  created_at: string
  replies?: Comment[]
}