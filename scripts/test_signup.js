
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://drxsvsqjuwdrzaupdcpo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyeHN2c3FqdXdkcnphdXBkY3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MjE0MTYsImV4cCI6MjA4NDI5NzQxNn0._0i0wrqyopkBHdyolF8T4XnFnN8RvPBo-gvO5CoIHrc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'Password123!';
    const name = 'Test User Node';

    console.log(`Attempting to register user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
        },
    });

    if (error) {
        console.error('Signup Error:', error.message);
        process.exit(1);
    } else {
        console.log('Signup Successful!');
        console.log('User ID:', data.user?.id);
        console.log('Confirmation sent:', !data.session); // If session is null, email confirmation is required
    }
}

testSignup();
