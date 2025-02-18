require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

// ดึงค่าจาก .env
const BASE_URL = process.env.BASE_URL;
const username = process.env.USER;
const password = process.env.PASS;

async function login() {
    try {
        console.log('=== เริ่มกระบวนการ Login ===\n');
        console.log('กำลังใช้:');
        console.log(`Server: ${BASE_URL}`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${'*'.repeat(password.length)}\n`);
        
        // Step 1: Get challenge and salt
        console.log('1. ขอ Challenge และ Salt...');
        const challengeResponse = await axios.get(`${BASE_URL}/api/auth/login/challenge`, {
            params: { username }
        });

        const { session_id, challenge, salt } = challengeResponse.data;
        console.log('✓ ได้รับข้อมูล:');
        console.log('   Session ID:', session_id);
        console.log('   Challenge:', challenge);
        console.log('   Salt:', salt);
        console.log();

        // Step 2: Hash the password
        console.log('2. สร้าง Hash Password...');
        const combinedString = password + salt + challenge;
        console.log('   ข้อมูลที่นำมาต่อกัน:', combinedString);
        
        const hashedPassword = crypto.createHash('sha256')
            .update(combinedString)
            .digest('hex');
        console.log('✓ Hashed Password:', hashedPassword);
        console.log();

        // Step 3: Send login request
        console.log('3. ส่ง Login Request...');
        const loginData = {
            session_id,
            username,
            password: hashedPassword
        };
        console.log('   ข้อมูลที่ส่ง:', JSON.stringify(loginData, null, 2));

        const loginResponse = await axios.post(
            `${BASE_URL}/api/auth/login`,
            loginData,
            {
                params: { type: 'web' },
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0'
                }
            }
        );

        console.log('\n=== ผลลัพธ์ ===');
        console.log('Status:', loginResponse.status === 200 ? 'Login สำเร็จ ✓' : 'Login ไม่สำเร็จ ✗');
        console.log('Response:', loginResponse.data);
        
        if (loginResponse.data.session_id) {
            console.log('\n=== Session Info ===');
            console.log('New Session ID:', loginResponse.data.session_id);
        }

        return loginResponse.data;

    } catch (error) {
        console.error('\n=== เกิดข้อผิดพลาด ===');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        throw error;
    }
}

// ตรวจสอบว่ามีการตั้งค่าทั้งหมดที่จำเป็นหรือไม่
if (!BASE_URL || !username || !password) {
    console.error('กรุณาตั้งค่า BASE_URL, USERNAME และ PASSWORD ในไฟล์ .env');
    process.exit(1);
}

console.log('เริ่มทดสอบระบบ Login...\n');
login().then(() => {
    console.log('\nจบการทำงาน');
}).catch(() => {
    console.log('\nจบการทำงานแบบมีข้อผิดพลาด');
});