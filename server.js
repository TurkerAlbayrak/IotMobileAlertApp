const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
// Tüm bağlantılara izin veren Socket.io ayarı
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Bir mobil cihaz bağlandı:', socket.id);

  // 5 saniyede bir rastgele 3 veri üret ve gönder
  const interval = setInterval(() => {
    const data = {
      deger1: Math.floor(Math.random() * 100), // 0-100 arası
      deger2: Math.floor(Math.random() * 100),
      deger3: Math.floor(Math.random() * 100),
    };

    socket.emit('yeniVeri', data);
    console.log('Veri gönderildi:', data);
  }, 5000);

  // Cihazın bağlantısı koparsa döngüyü durdur (Bellek sızıntısını önler)
  socket.on('disconnect', () => {
    console.log('Cihaz ayrıldı:', socket.id);
    clearInterval(interval);
  });
});

// Sunucuyu 3000 portunda başlat
server.listen(3000, '0.0.0.0', () => {
  console.log('Sunucu çalışıyor. Port: 3000');
});