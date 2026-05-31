const CACHE = "lms-v1";

// Masukkan semua aset statis utama yang wajib ada biar PWA jalan lancar pas offline
const ASSETS = [
    "/",                  // Mengcache root domain/localhost
    "index.html",         // Mengcache file utama
    "manifest.json",      // Mengcache konfigurasi PWA
    "data.json",          // PENTING: Mengcache data materi awal agar tidak eror pas offline!
    "favicon-192.png",    // Mengcache icon aplikasi
    "favicon-512.png"
];

// 1. Fase Install - Menyimpan aset ke Cache Storage
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => {
            console.log("PWA: Mendaftarkan core aset ke dalam cache...");
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Fase Activate - Membersihkan cache lama jika ada update versi (misal dari v1 ke v2)
self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE) {
                        console.log("PWA: Menghapus cache lama:", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// 3. Fase Fetch - Strategi Cache First (Ambil dari cache dulu, kalau gak ada baru tembak ke network)
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            // Jika ada di cache, pakai cache. Jika tidak, lakukan fetch ke internet.
            return res || fetch(e.request);
        })
    );
});
