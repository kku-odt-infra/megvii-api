# Megvii API Authentication Client

ระบบ Authentication Client สำหรับการเชื่อมต่อกับ Megvii API โดยใช้การเข้ารหัส SHA-256

## 🚀 คุณสมบัติ

- รองรับการ Authentication แบบ Challenge-Response
- ใช้การเข้ารหัส SHA-256 สำหรับรหัสผ่าน
- จัดการ Session ID อัตโนมัติ
- รองรับการตั้งค่าผ่านไฟล์ .env
- แสดงผลการทำงานแบบละเอียด

## 📋 ความต้องการของระบบ

- Node.js (เวอร์ชั่น 14 หรือสูงกว่า)
- npm (Node Package Manager)

## ⚙️ การติดตั้ง

1. Clone repository:
```bash
git clone <repository-url>
cd megvii-api
```

2. สร้างโปรเจค Node.js:

```bash
npm init -y
```

3. ติดตั้ง dependencies:
```bash
npm install axios dotenv
```

4. สร้างไฟล์ `.env` และกำหนดค่าต่างๆ:
```env
BASE_URL=http://your-api-server
USER=your-username
PASS=your-password
```

## 🔧 การตั้งค่า

### การกำหนดค่าใน .env
| ตัวแปร | คำอธิบาย | ตัวอย่าง |
|--------|----------|----------|
| BASE_URL | URL ของ API Server | http://192.168.1.20 |
| USER | ชื่อผู้ใช้สำหรับการเข้าสู่ระบบ | iamgroot |
| PASS | รหัสผ่านสำหรับการเข้าสู่ระบบ | iampassword |

## 🎯 การใช้งาน

1. รันโปรแกรมด้วยคำสั่ง:
```bash
npm start
```

2. โปรแกรมจะแสดงขั้นตอนการทำงานดังนี้:
   - การขอ Challenge และ Salt
   - การสร้าง Hash Password
   - การส่ง Login Request
   - ผลลัพธ์การเข้าสู่ระบบ

## 📊 ตัวอย่างผลลัพธ์

```
=== เริ่มกระบวนการ Login ===

กำลังใช้:
Server: http://192.168.1.20
Username: iamgroot
Password: ********

1. ขอ Challenge และ Salt...
✓ ได้รับข้อมูล:
   Session ID: df15117dc5b1521bcda0dd1485979b21
   Challenge: r1fz06x2c0kq4jgk152geg71411p63p
   Salt: 32s8gq1q9000e9au3v7q4b80p1166qkbm3b31sm0802e1e256r015328uhq02uo

2. สร้าง Hash Password...
✓ Hashed Password: 249254981b83dda0d9482849bd8a14ae5b3bc50534dff6b66554e8008f312fdf

3. ส่ง Login Request...
=== ผลลัพธ์ ===
Status: Login สำเร็จ ✓
```

## 🔒 ความปลอดภัย

- รหัสผ่านจะถูกเข้ารหัสด้วย SHA-256 ก่อนส่งไปยังเซิร์ฟเวอร์
- ข้อมูลสำคัญถูกเก็บในไฟล์ .env แยกจากโค้ด
- ใช้ session ID เพื่อป้องกันการโจมตีแบบ replay attack

## 📝 หมายเหตุ

- อย่าลืมเพิ่ม `.env` ไว้ใน `.gitignore`
- ตรวจสอบการเชื่อมต่อกับ API Server ก่อนใช้งาน
- สำหรับการใช้งานในระบบจริง ควรใช้ HTTPS

## 🤝 การมีส่วนร่วมพัฒนา

หากพบปัญหาหรือต้องการเพิ่มเติมฟีเจอร์ สามารถสร้าง Issue หรือ Pull Request ได้

## 📜 License

โปรเจคนี้อยู่ภายใต้ GNU General Public License v3.0 - ดูรายละเอียดเพิ่มเติมได้ที่ [LICENSE](LICENSE)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.