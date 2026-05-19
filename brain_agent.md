# TouchVPN - Project Documentation

## Project Overview
VPN service with country code selector, Freekassa payment integration, and Marzban backend for VPN management.

## Tech Stack
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **VPN Backend:** Marzban (http://142.93.107.127:8000)
- **Payment:** Freekassa
- **Frontend:** HTML + CSS + Vanilla JS

## Environment Variables (.env)
```
PORT=3000
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/vpndb
JWT_SECRET=your_jwt_secret

# Freekassa
FREEKASSA_MERCHANT_ID=70757
FREEKASSA_SECRET1=your_secret1
FREEKASSA_SECRET2=your_secret2
FREEKASSA_API_KEY=your_api_key

# Marzban
MARZBAN_URL=http://142.93.107.127:8000
MARZBAN_USERNAME=Bogach
MARZBAN_PASSWORD=your_password

SITE_URL=https://vpn.touchme.tech

ADMIN_KEY=your_admin_key
```

## Database Schema

### users
- id (SERIAL PK)
- phone VARCHAR(20)
- email VARCHAR(255)
- password_hash VARCHAR(255) NOT NULL
- vpn_name VARCHAR(100)
- created_at TIMESTAMP

### subscriptions
- id (SERIAL PK)
- user_id INTEGER (FK users)
- plan_days INTEGER NOT NULL
- started_at TIMESTAMP
- expires_at TIMESTAMP
- marzban_username VARCHAR(255)
- marzban_link TEXT
- status VARCHAR(20) DEFAULT 'pending'
- created_at TIMESTAMP

### payments
- id (SERIAL PK)
- user_id INTEGER (FK users)
- subscription_id INTEGER (FK subscriptions)
- amount DECIMAL(10,2) NOT NULL
- freekassa_id VARCHAR(255)
- order_id VARCHAR(255) UNIQUE
- status VARCHAR(20) DEFAULT 'pending'
- created_at TIMESTAMP

## Deployment to Ocean Server

**Server:** `root@134.209.75.233`
**Project path:** `/var/www/vpn`

### Commands to run after changes:
```bash
ssh root@134.209.75.233
cd /var/www/vpn
git pull
pm2 restart vpn
```

### First-time setup:
```bash
# Clone repo
git clone https://github.com/bogachpixel/vpn.git /var/www/vpn
cd /var/www/vpn
npm install
cp .env.example .env
# Edit .env with real values
pm2 start server.js --name vpn
pm2 save
pm2 startup
```

### Check logs:
```bash
pm2 logs vpn
pm2 status
```

## Freekassa Configuration

In Freekassa merchant panel (Settings → Links & Methods):
- **Notification URL (POST):** `https://vpn.touchme.tech/api/webhook/freekassa`
- **Success URL (GET):** `https://vpn.touchme.tech/payment/success`
- **Failure URL (GET):** `https://vpn.touchme.tech/payment/fail`

Test status check should return `200 YES`.

## Key Features Implemented

### 1. Phone Input with Country Selector
- **195 countries** with flags, dial codes, and phone masks
- Searchable dropdown by country name or dial code
- Dynamic phone formatting based on country mask
- Files: `public/js/auth.js`, `public/login.html`, `public/register.html`, `public/css/style.css`

### 2. Freekassa Payment Integration
- Widget iframe modal (not redirect)
- Payment polling every 3 seconds
- Webhook handles both GET and POST
- Signature verification for both API v1 (no currency) and v2 (with currency)
- Files: `src/services/freekassaService.js`, `src/controllers/paymentController.js`, `src/controllers/webhookController.js`, `public/dashboard.html`, `public/js/dashboard.js`

### 3. Email Edit for All Users
- Profile card visible to all users (with/without subscription)
- Email validation and duplicate check
- Two edit instances (in subscription card and profile card)
- Files: `src/controllers/authController.js`, `src/routes/auth.js`, `public/dashboard.html`, `public/js/dashboard.js`

### 4. VPN Name Injection Fix
- Only injects VPN name into direct protocol URIs (vless://, vmess://, etc.)
- Does NOT modify HTTP subscription URLs
- Files: `src/controllers/subscriptionController.js`

### 5. Broken Link Detection and Fix
- Detects placeholder links with `00000000-0000-0000-0000-000000000000`
- "Fix broken link" button only appears for broken links (cannot be abused for subscription extension)
- Webhook and test-activate now fail if Marzban unavailable instead of saving placeholder
- Files: `src/controllers/webhookController.js`, `src/controllers/subscriptionController.js`, `src/routes/subscription.js`, `public/dashboard.html`, `public/js/dashboard.js`

## Important Gotchas

### Phone Input
- Country selector uses `.phone-field-wrap` wrapper
- Mask uses `#` as digit placeholder
- Fallback to raw digits if no mask defined
- Clean phone sent to backend: dial code + digits only

### Payment
- Use `www.free-kassa.ru/merchant/cash.php` (NOT `pay.freekassa.ru` - SSL broken)
- Widget URL uses `default_amount` parameter
- Always return HTTP 200 from webhook (body YES/NO determines success)
- Poll `/api/payment/status/:orderId` not subscription status

### VPN Links
- HTTP subscription URLs must NOT have `#name` appended
- Only direct protocol URIs get VPN name injection
- Placeholder links indicate Marzban was unavailable
- Never save placeholder links to DB - fail webhook instead

### Testing
- Test activation creates 1-day subscription
- If Marzban unavailable, test activation returns 503 error
- Test subscriptions are cancelled before new test activation

## File Structure

```
VPN/
├── public/
│   ├── css/style.css          # All styles (neon sci-fi theme)
│   ├── js/
│   │   ├── auth.js            # Phone input + country selector
│   │   ├── api.js             # API request helper
│   │   ├── dashboard.js       # Dashboard logic
│   │   └── security-check.js   # Security checks
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── success.html           # Payment success with polling
│   ├── fail.html
│   └── index.html
├── src/
│   ├── controllers/
│   │   ├── authController.js          # Auth + email edit
│   │   ├── paymentController.js       # Payment creation + status
│   │   ├── subscriptionController.js  # Subscription + broken link fix
│   │   └── webhookController.js       # Freekassa webhook
│   ├── routes/
│   │   ├── auth.js
│   │   ├── payment.js
│   │   ├── subscription.js
│   │   ├── webhook.js
│   │   └── admin.js
│   ├── services/
│   │   ├── freekassaService.js        # Payment URL + webhook verification
│   │   └── marzbanService.js          # Marzban API client
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── models/
│       └── db.js                      # PostgreSQL pool + schema
├── server.js
├── package.json
├── .env.example
└── brain_agent.md                      # THIS FILE
```

## Workflow for New Features

1. **Backend changes:**
   - Add controller function
   - Add route
   - Update database schema if needed (via `initDB` in `models/db.js`)

2. **Frontend changes:**
   - Update HTML with new elements
   - Add JS logic in appropriate file (auth.js, dashboard.js, etc.)
   - Add CSS to style.css (maintain neon sci-fi theme)

3. **Testing:**
   - Test locally
   - Deploy to Ocean: `git pull && pm2 restart vpn`
   - Check logs: `pm2 logs vpn`

4. **Payment testing:**
   - Use Freekassa test mode
   - Check webhook logs
   - Verify subscription activation

## Common Issues

### Payment not activating
- Check webhook URL in Freekassa panel
- Check Marzban availability
- Check webhook logs for signature errors
- Verify FREEKASSA_SECRET2 matches

### VPN link broken
- Check if Marzban server is accessible
- Look for placeholder UUID in link
- Use "Fix broken link" button (only if broken)
- Check Marzban credentials in .env

### Phone input not working
- Check phone-field-wrap structure in HTML
- Verify country selector dropdown renders
- Check mask formatting logic in auth.js
