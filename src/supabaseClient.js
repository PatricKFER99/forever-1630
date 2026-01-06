import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yudixupjmznuumbrflxs.supabase.co'
const supabaseKey = 'sb_publishable_77t-YAX08kEiw8yxXNp37A_w-27Mf83'

export const supabase = createClient(supabaseUrl, supabaseKey)