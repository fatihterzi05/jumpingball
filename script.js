const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Sayfanın boyutuna göre canvas'ı ayarla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Dairenin yarıçapı
const radius = Math.min(canvas.width, canvas.height) / 9;  
const ballRadius = 35;  // Topun yarıçapı sabit kalacak
let x = canvas.width / 2;  // Topun X koordinatı, ekranın ortasında
let y = canvas.height / 2 - 100;  // Topun Y koordinatı (başlangıçta biraz yukarıda)
let speedX = 8;  // Topun X yönündeki hızını artırdık (daha hızlı hareket etmesi için)
let speedY = 0;  // Başlangıçta dikey hız sıfır
let gravity = 0.5;  // Yerçekimi ivmesini artırdık (daha hızlı düşmesi için)
let bounceFactor = 1;  // Zıplama katsayısı
let dampingFactor = 1;  // Hız kaybı sıfırlı (sürekli hızlanmasını sağlar)

// Topun daire içine zıplayıp zıplamadığını kontrol et
function isInsideCircle(x, y) {
    return Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2) <= radius - ballRadius;
}

function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Daireyi neon yeşil renkte çiz
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#39FF14";  // Neon yeşil renk
    ctx.lineWidth = 25;  // Çizgi kalınlığını 5 piksel olarak ayarladık
    ctx.stroke();
    ctx.fillStyle = "black";  // Çemberin içini siyah yapıyoruz
    ctx.fill();

    // Topu beyaz renkte çiz
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";  // Topun rengi beyaz
    ctx.fill();
}

function updateBallPosition() {
    // Yerçekimi etkisiyle topun dikey hızını güncelle
    speedY += gravity;

    // Topun pozisyonunu güncelle
    x += speedX;
    y += speedY;

    // Daire dışına çıkmaması için sınır kontrolü
    if (!isInsideCircle(x, y)) {
        const dx = x - canvas.width / 2;
        const dy = y - canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Çarpma noktasındaki normal vektörü hesapla
        const normalX = dx / distance;
        const normalY = dy / distance;

        // Topun hız vektörünü (speedX, speedY) normal vektörüyle yansıt
        const dotProduct = speedX * normalX + speedY * normalY;
        speedX = speedX - 2 * dotProduct * normalX;
        speedY = speedY - 2 * dotProduct * normalY;

        // Zıplama sonrası hız kaybını engellemek için bounceFactor'ı 1 yapıyoruz
        speedX *= bounceFactor;
        speedY *= bounceFactor;

        // Topu daire sınırına geri yerleştir
        const overlap = radius - distance + ballRadius;
        x -= speedX * overlap / distance;
        y -= speedY * overlap / distance;

        // Daire sınırından topun dışarıya çıkmaması için küçük bir düzeltme
        if (Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2) > radius - ballRadius) {
            const angle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
            x = canvas.width / 2 + Math.cos(angle) * (radius - ballRadius);
            y = canvas.height / 2 + Math.sin(angle) * (radius - ballRadius);
        }
    }

    // Sönümlemeyi sıfırladık, hız kaybı olmayacak
    speedX *= dampingFactor;
    speedY *= dampingFactor;

    drawBall();
}

function animate() {
    updateBallPosition();
    requestAnimationFrame(animate);
}

animate();
