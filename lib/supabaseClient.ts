
import { createClient } from '@supabase/supabase-js';

// 제공해주신 실제 Supabase 프로젝트 정보를 기본값으로 설정합니다.
// 환경 변수가 설정되어 있다면 환경 변수를 우선 사용합니다.

const supabaseUrl = process.env.SUPABASE_URL || 'https://yafvltczvbqpmffdsvmt.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZnZsdGN6dmJxcG1mZmRzdm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwOTQ2MzUsImV4cCI6MjA4MjY3MDYzNX0.k86vzyOmJGjOhnouGB_fGfp2S6yZfA-1S77LhOSrF7g';

export const supabase = createClient(supabaseUrl, supabaseKey);
