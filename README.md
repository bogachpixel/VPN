# TouchVPN — VPN Service

Полноценный VPN-сервис с интеграцией Marzban + Freekassa.

## Стек
- Node.js + Express
- PostgreSQL
- Marzban (VLESS/VMess)
- Freekassa (платежи)

## Быстрый старт

### 1. Клонировать и установить зависимости

```bash
npm install
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env
```

Заполнить `.env`:

```
PORT=3000
DATABASE_URL=postgresql://vpnuser:password@localhost:5432/vpndb
JWT_SECRET=<длинный случайный секрет>

FREEKASSA_MERCHANT_ID=<ID магазина в Freekassa>
FREEKASSA_SECRET1=<Секретный ключ 1>
FREEKASSA_SECRET2=<Секретный ключ 2>

MARZBAN_URL=http://142.93.107.127:8000
MARZBAN_USERNAME=admin
MARZBAN_PASSWORD=<пароль от Marzban>

SITE_URL=https://vpn.touchme.tech
```

### 3. Создать базу данных PostgreSQL

```sql
CREATE USER vpnuser WITH PASSWORD 'password';
CREATE DATABASE vpndb OWNER vpnuser;
```

Таблицы создаются автоматически при первом запуске.

### 4. Запустить

```bash
# Продакшн
npm start

# Разработка
npm run dev
```

---

## Деплой на Ubuntu/Debian сервер

### Установка зависимостей

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# PM2
sudo npm install -g pm2
```

### PostgreSQL

```bash
sudo -u postgres psql
CREATE USER vpnuser WITH PASSWORD 'your_password';
CREATE DATABASE vpndb OWNER vpnuser;
\q
```

### Запуск через PM2

```bash
cd /var/www/vpn
npm install
cp .env.example .env
nano .env  # заполнить переменные

pm2 start server.js --name vpn-service
pm2 save
pm2 startup
```

### Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name vpn.touchme.tech;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/vpn /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
```

### SSL через Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d vpn.touchme.tech
```

---

## Настройка Freekassa

1. Зарегистрироваться на [freekassa.ru](https://freekassa.ru)
2. Создать магазин, получить Merchant ID, Secret 1, Secret 2
3. В настройках магазина указать:
   - **URL уведомления (webhook):** `https://vpn.touchme.tech/api/webhook/freekassa`
   - **URL успешной оплаты:** `https://vpn.touchme.tech/payment/success`
   - **URL неудачной оплаты:** `https://vpn.touchme.tech/payment/fail`

---

## Структура проекта

```
├── server.js               # Entry point
├── src/
│   ├── routes/             # Express routes
│   ├── controllers/        # Business logic
│   ├── models/             # DB connection & init
│   ├── middleware/         # JWT auth
│   └── services/           # Marzban & Freekassa API
├── public/
│   ├── css/style.css       # Dark theme styles
│   ├── js/                 # Frontend JS
│   ├── index.html          # Landing page
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html      # Personal cabinet
│   ├── success.html
│   └── fail.html
├── .env.example
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Auth | Описание |
|--------|----------|------|----------|
| POST | `/api/auth/register` | — | Регистрация |
| POST | `/api/auth/login` | — | Вход |
| GET | `/api/auth/me` | JWT | Профиль |
| POST | `/api/payment/create` | JWT | Создать платёж |
| GET | `/api/subscription/active` | JWT | Активная подписка + QR |
| GET | `/api/subscription/payments` | JWT | История платежей |
| POST | `/api/webhook/freekassa` | — | Webhook Freekassa |
