// utils/supabase.js
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const url = SUPABASE_URL.trim();
const key = SUPABASE_ANON_KEY.trim();

export const supabase = createClient(url, key);
