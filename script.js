const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const radius = canvas.width / 2;    // Dairenin yarıçapı
const ballRadius = 20;              // Topun yarıçapı
let x = radius;                     // Topun X koordinatı
let y = radius - 100;               // Topun Y koordinatı (başlangıç yüksekliği)
let speedX = 4;                     // Topun X yönündeki hızı, biraz artırıldı
let speedY = 0;                     // Başlangıçta dikey hız sıfır
let gravity = 0.3;                  // Yerçekimi ivmesi biraz artırıldı
let bounceFactor = 1;               // Zıplama katsayısı 1, hız kaybı yok
let dampingFactor = 1;              // Sönümleme sıfırlandı

// Topun daire içine zıplayıp zıplamadığını kontrol et
function isInsideCircle(x, y) {
    return Math.sqrt((x - radius) ** 2 + (y - radius) ** 2) <= radius - ballRadius;
}

function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Daireyi çiz
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ddd";
    ctx.fill();

    // Topu çiz
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
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
        const dx = x - radius;
        const dy = y - radius;
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
        if (Math.sqrt((x - radius) ** 2 + (y - radius) ** 2) > radius - ballRadius) {
            const angle = Math.atan2(y - radius, x - radius);
            x = radius + Math.cos(angle) * (radius - ballRadius);
            y = radius + Math.sin(angle) * (radius - ballRadius);
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
