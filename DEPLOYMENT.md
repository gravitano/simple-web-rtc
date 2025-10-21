# Deployment Guide - POC WebRTC

Panduan lengkap untuk deploy aplikasi WebRTC ke production.

## 🚀 Quick Start - Vercel + Railway

### 1. Deploy Backend ke Railway

> 📘 **Untuk panduan Railway lengkap dengan troubleshooting, lihat [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)**

**Langkah 1: Persiapan**
```bash
# Pastikan kode sudah di-push ke GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

**Langkah 2: Deploy di Railway**

1. Buka [railway.app](https://railway.app) dan login dengan GitHub
2. Klik **"New Project"** → **"Deploy from GitHub repo"**
3. Pilih repository `poc-web-rtc`
4. **PENTING:** Klik service → **Settings** → Set **Root Directory** = `backend`
5. Railway akan otomatis detect Node.js dan install dependencies dengan npm
6. Tunggu sampai build & deploy selesai (check di tab "Deployments")
7. Klik **"Settings"** → **"Networking"** → **"Generate Domain"**
8. Copy domain yang digenerate (contoh: `poc-webrtc-production.up.railway.app`)

**Langkah 3: Verify Deployment**

Check logs di tab "Deployments", pastikan muncul:
```
🚀 WebSocket server is running on port XXXX
📡 Ready to accept connections...
```

### 2. Deploy Frontend ke Vercel

**Langkah 1: Update WebSocket URL**

Edit `frontend/index.html` baris 41-43:
```javascript
const WS_URL = window.location.hostname === 'localhost' 
  ? 'ws://localhost:3001'
  : 'wss://poc-webrtc-backend.railway.app'; // Ganti dengan domain Railway Anda
```

**Langkah 2: Deploy ke Vercel**

```bash
# Install Vercel CLI jika belum
npm install -g vercel

# Deploy
vercel --prod
```

Atau via Vercel Dashboard:
1. Buka [vercel.com](https://vercel.com) dan login
2. Klik **"Add New"** → **"Project"**
3. Import repository dari GitHub
4. Vercel akan otomatis detect `vercel.json` dan deploy
5. Done! Akses URL yang diberikan

---

## 🔄 Alternative: Deploy Semua ke Render

### Option A: Using render.yaml (Automated)

1. Buka [render.com](https://render.com)
2. Klik **"New"** → **"Blueprint"**
3. Connect repository
4. Render akan detect `render.yaml` dan setup:
   - Backend WebSocket service
   - Frontend static site
5. Update WebSocket URL di frontend dengan backend URL dari Render
6. Deploy!

### Option B: Manual Setup

**Backend:**
1. **New** → **Web Service**
2. Connect repository
3. Configure:
   - **Name**: `poc-webrtc-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pnpm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
4. Deploy

**Frontend:**
1. **New** → **Static Site**
2. Connect repository
3. Configure:
   - **Name**: `poc-webrtc-frontend`
   - **Build Command**: `echo "No build needed"`
   - **Publish Directory**: `frontend`
4. Deploy

---

## 🧪 Testing Production Deployment

### Test WebSocket Connection

Buka browser console di frontend production dan check:

```javascript
// Di console browser, cek:
// 1. WebSocket connection
console.log('WS ready state:', ws.readyState); // Should be 1 (OPEN)

// 2. Peer connection state
console.log('PC state:', pc.connectionState); // Should become 'connected'
```

### Test dengan Multiple Clients

1. Buka production URL di browser pertama
2. Allow camera/microphone
3. Buka production URL di tab/browser kedua (atau device lain)
4. Allow camera/microphone
5. Kedua video stream harus muncul dan tersambung

---

## 🔧 Troubleshooting

### WebSocket Connection Failed

**Problem**: Frontend tidak bisa connect ke backend
```
❌ Failed to connect to signaling server
```

**Solutions**:
1. ✅ Pastikan URL WebSocket menggunakan `wss://` (bukan `ws://`)
2. ✅ Pastikan backend sudah deploy dan running
3. ✅ Check backend logs di Railway/Render dashboard
4. ✅ Pastikan tidak ada typo di URL

### CORS Error

**Problem**: Browser block request
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: 
Tidak perlu CORS untuk WebSocket, tapi jika menggunakan HTTP API, tambahkan di `server.js`:
```javascript
import cors from 'cors';
app.use(cors());
```

### Camera/Microphone Access Denied

**Problem**: 
```
❌ Failed to access camera/microphone
```

**Solutions**:
1. ✅ Production HARUS menggunakan HTTPS (Vercel/Railway/Render otomatis provide)
2. ✅ Allow permissions di browser
3. ✅ Test di Chrome/Firefox (better WebRTC support)

### Video Stream Not Showing

**Problem**: WebSocket connected tapi video tidak muncul

**Solutions**:
1. ✅ Check browser console untuk errors
2. ✅ Verify ICE candidates berhasil di-exchange
3. ✅ Mungkin butuh TURN server untuk restrictive NAT
4. ✅ Test di network lain

### Railway/Render Service Sleeping

**Problem**: Free tier services sleep after inactivity

**Solution**:
1. Upgrade ke paid plan
2. Atau setup ping service (not recommended for WebSocket)
3. Accept cold start latency (~30 detik first request)

---

## 💰 Pricing Estimasi

### Vercel (Frontend)
- ✅ **Free tier**: Unlimited bandwidth untuk hobby projects
- ⚡ Fast global CDN
- 📱 Automatic HTTPS

### Railway (Backend WebSocket)
- ✅ **Free tier**: $5 credit/month
- ⚠️ Will sleep if credit runs out
- 💵 Paid: ~$5-10/month untuk always-on

### Render (Alternative)
- ✅ **Free tier**: Web services dengan limitations
- ⚠️ Service sleeps after 15 mins inactivity
- 💵 Paid: $7/month untuk always-on

### Recommendation untuk Production Real:
- **Vercel** (frontend): Free tier OK
- **Railway/Render Paid** (backend): ~$5-10/month
- **Total**: ~$5-10/month

---

## 🔐 Production Security Checklist

Sebelum deploy ke production real:

- [ ] Implementasi authentication/authorization
- [ ] Add rate limiting
- [ ] Setup CORS dengan whitelist domain
- [ ] Use environment variables untuk semua config
- [ ] Add input validation
- [ ] Setup monitoring & logging (Sentry, LogRocket)
- [ ] Add TURN server untuk better connectivity
- [ ] Implement reconnection logic
- [ ] Add user session management
- [ ] Setup analytics
- [ ] Add error boundary & fallbacks
- [ ] Test di berbagai network conditions
- [ ] Setup CI/CD pipeline
- [ ] Add health check endpoint

---

## 📊 Monitoring

### Railway Dashboard
- View real-time logs
- Check memory/CPU usage
- Monitor deployment status

### Render Dashboard
- View logs
- Check service health
- Monitor uptime

### Recommended Tools
- **Sentry**: Error tracking
- **LogRocket**: Session replay & monitoring
- **Uptime Robot**: Uptime monitoring
- **Google Analytics**: User analytics

---

## 🎯 Next Steps

Setelah deploy berhasil:

1. ✅ Test thoroughly di production
2. 📝 Document your production URLs
3. 🔐 Implement security features
4. 📊 Setup monitoring
5. 🚀 Share dengan users!

---

## 📞 Support

Jika ada masalah:
1. Check logs di Railway/Render dashboard
2. Test locally terlebih dahulu
3. Verify environment variables
4. Check browser console untuk errors
5. Review WebRTC connection states

Happy deploying! 🚀

