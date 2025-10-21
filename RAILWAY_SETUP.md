# Setup Railway - Step by Step

## 🚂 Deploy Backend WebSocket ke Railway

### Cara 1: Auto-Deploy dari GitHub (Recommended)

1. **Login ke Railway**
   - Buka [railway.app](https://railway.app)
   - Login dengan GitHub account

2. **Create New Project**
   - Klik **"New Project"**
   - Pilih **"Deploy from GitHub repo"**
   - Pilih repository `poc-web-rtc`
   - Klik **"Deploy Now"**

3. **Configure Service**
   
   Setelah service dibuat, klik service tersebut, lalu:
   
   **a. Set Root Directory:**
   - Klik tab **"Settings"**
   - Scroll ke **"Service"** section
   - Set **Root Directory** = `backend`
   - Klik **"Save Changes"**

   **b. Verify Build & Start Commands (auto-detected):**
   - **Build Command**: `npm install` (auto-detected dari package.json)
   - **Start Command**: `npm start` atau `node server.js` (auto-detected)
   - Biasanya sudah benar, tidak perlu diubah

4. **Generate Public URL**
   - Masih di tab **"Settings"**
   - Scroll ke **"Networking"** section
   - Klik **"Generate Domain"**
   - Copy domain yang digenerate (contoh: `poc-webrtc-production.up.railway.app`)
   - **PENTING:** Ini adalah WebSocket URL Anda!

5. **Monitor Deployment**
   - Klik tab **"Deployments"**
   - Lihat progress build & deploy
   - Jika success, status akan jadi **"Success ✓"**
   - Klik deployment untuk lihat logs

6. **Test WebSocket Server**
   ```bash
   # Test di terminal (install wscat dulu: npm install -g wscat)
   wscat -c wss://your-domain.up.railway.app
   
   # Kirim test message:
   {"type":"join","room":"test"}
   ```

### Cara 2: Deploy Manual (Alternative)

Jika cara 1 tidak work:

1. **Di Railway Dashboard:**
   - New Project → Empty Project
   - Add Service → GitHub Repo

2. **Settings yang HARUS di-set:**
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: node server.js
   ```

3. **Environment Variables:**
   - Tidak perlu set PORT (Railway auto-provide)
   - Tambahkan variable lain jika perlu

---

## 🔧 Troubleshooting

### Error: "pnpm: command not found"

**Problem:** Railway tidak recognize pnpm

**Solution:**
```bash
# Option 1: Hapus pnpm-lock.yaml dan pakai npm
rm backend/pnpm-lock.yaml
cd backend
npm install  # generate package-lock.json
git add .
git commit -m "Switch to npm for Railway compatibility"
git push
```

**Option 2:** Atau install pnpm di nixpacks:
- Buat file `nixpacks.toml` di root project:
```toml
[phases.setup]
nixPkgs = ['nodejs', 'pnpm']

[phases.install]
cmds = ['cd backend && pnpm install']

[start]
cmd = 'cd backend && node server.js'
```

### Error: "Module not found"

**Problem:** Dependencies tidak ter-install

**Solution:**
1. Pastikan Root Directory = `backend`
2. Pastikan `backend/package.json` ada
3. Force rebuild: Settings → Redeploy

### Error: "Application failed to respond"

**Problem:** Server not listening atau crash

**Solution:**
1. Check logs di Deployments tab
2. Pastikan code tidak ada error
3. Verify PORT handling di `server.js`:
   ```javascript
   const PORT = process.env.PORT || 3001;
   ```

### Service Keep Restarting

**Problem:** Crash loop

**Solution:**
1. Check logs untuk error message
2. Verify dependencies compatible
3. Test locally terlebih dahulu

---

## 📊 Check Logs

**Realtime Logs:**
- Klik service → **"Deployments"** tab
- Klik deployment terakhir
- Lihat build logs & runtime logs
- Cari error message jika ada

**Useful Log Commands:**
```bash
# Logs akan show:
🚀 WebSocket server is running on port 3001
📡 Ready to accept connections...
✅ New client connected
👤 User joined room: demo (1 users in room)
```

---

## 🌐 Update Frontend dengan Railway URL

Setelah Railway deploy success, update frontend:

**File: `frontend/index.html`** (line ~41-43)

Ganti:
```javascript
const WS_URL = window.location.hostname === 'localhost' 
  ? 'ws://localhost:3001'
  : 'wss://your-domain.up.railway.app'; // ← UPDATE INI
```

Dengan domain Railway Anda:
```javascript
const WS_URL = window.location.hostname === 'localhost' 
  ? 'ws://localhost:3001'
  : 'wss://poc-webrtc-production.up.railway.app'; // ← Domain Railway Anda
```

Kemudian deploy frontend ke Vercel:
```bash
git add frontend/index.html
git commit -m "Update WebSocket URL to Railway"
git push
vercel --prod
```

---

## 💡 Tips

### Free Tier Limits
- Railway free tier: **$5 credit/month**
- WebSocket server usage: ~$2-5/month
- Monitor usage di **"Usage"** tab

### Keep Service Running
- Free tier services tetap running selama credit masih ada
- Tidak auto-sleep seperti platform lain
- Jika credit habis, service akan stop

### Custom Domain
- Settings → Networking → Custom Domain
- Tambahkan domain sendiri jika punya
- Update DNS records sesuai instruksi

### Environment Variables
- Settings → Variables
- Tambahkan environment variables
- Railway auto-restart service saat variable berubah

---

## ✅ Checklist Deploy Success

- [ ] Service deployed tanpa error
- [ ] Public domain generated
- [ ] Logs menunjukkan "WebSocket server is running"
- [ ] wscat test connection berhasil
- [ ] Frontend updated dengan Railway URL
- [ ] Test video chat berfungsi dari 2 devices

---

## 📞 Next Steps

Setelah Railway setup success:
1. Deploy frontend ke Vercel
2. Test end-to-end connection
3. Monitor logs & usage
4. Setup monitoring (optional)

Happy deploying! 🚀

