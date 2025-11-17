import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const fullName = process.argv[4] || 'Admin User';

  if (!email || !password) {
    console.error('Usage: ts-node scripts/create-admin.ts <email> <password> [fullName]');
    process.exit(1);
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error('Error creating auth user:', authError);
    process.exit(1);
  }

  console.log('✓ Auth user created:', authData.user.id);

  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .insert({
      user_id: authData.user.id,
      full_name: fullName,
      role: 'admin',
    })
    .select()
    .single();

  if (adminError) {
    console.error('Error creating admin record:', adminError);
    process.exit(1);
  }

  console.log('✓ Admin record created:', adminData);
  console.log('\nYou can now login at /admin/login with:');
  console.log('Email:', email);
  console.log('Password:', password);
}

createAdmin().catch(console.error);
