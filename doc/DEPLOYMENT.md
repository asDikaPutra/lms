# Deployment Guide — LMS Islam Fakultas

Panduan deployment ke shared hosting Hostinger.

## 1. Upload & Install

```bash
# Upload source ke server, lalu:
composer install --optimize-autoloader --no-dev
npm install && npm run build
```

## 2. Konfigurasi `.env`

```env
APP_NAME="LMS Islam Fakultas"
APP_ENV=production
APP_KEY=           # php artisan key:generate
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_user
DB_PASSWORD=your_password

QUEUE_CONNECTION=database
CACHE_STORE=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

## 3. Database & Storage

```bash
php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force
php artisan storage:link
```

## 4. Optimasi Cache

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 5. Scheduler & Queue

Tambahkan **satu** cron job via cPanel (menangani scheduler sekaligus queue fallback):

```
* * * * * cd /home/username/public_html && php artisan schedule:run >> /dev/null 2>&1
```

Jika server mendukung background process, jalankan queue worker:

```bash
php artisan queue:work --daemon --sleep=3 --tries=3
```

Scheduler menjalankan:
- **Setiap hari pukul 08.00** — kirim reminder deadline tugas (H-1)

## 6. Permissions

```bash
chmod -R 775 storage bootstrap/cache
```

## 7. Akun Admin Default

> **Ganti segera setelah login pertama.**

```
Email    : admin@lms.test
Password : password
```

Ganti via Tinker:
```bash
php artisan tinker
>>> App\Models\User::where('email','admin@lms.test')->first()
...     ->update(['email'=>'admin@domain.com','password'=>bcrypt('password_baru')]);
```

## 8. Security Checklist

- [ ] `APP_DEBUG=false`
- [ ] `APP_KEY` sudah di-set
- [ ] File `.env` tidak bisa diakses via browser
- [ ] HTTPS aktif
- [ ] Password admin sudah diganti

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Queue tidak jalan | `php artisan queue:work --once` |
| Notifikasi tidak terkirim | `php artisan queue:retry all` |
| Scheduler tidak jalan | `php artisan schedule:run` (manual test) |
| Error 500 | Cek `storage/logs/laravel.log` |

### Cek status queue

```bash
php artisan queue:failed          # lihat job gagal
php artisan queue:retry all       # retry semua job gagal
php artisan queue:flush           # hapus semua job gagal
```

## Maintenance Mode

```bash
php artisan down --secret="token-rahasia"
# Akses: https://yourdomain.com/token-rahasia

php artisan up
```

## Backup

```bash
# Database
mysqldump -u user -p database > backup_$(date +%Y%m%d).sql

# File upload
tar -czf uploads_$(date +%Y%m%d).tar.gz storage/app/public
```
