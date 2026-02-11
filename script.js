// 全局变量
let flowers = [];
let particles = [];
let animationId = null;
let isGathered = false;

// 颜色数组 - 玫瑰花色
const roseColors = ['#ff6b6b', '#ff8e53', '#ff4757', '#ff6b81', '#ff3742', '#e84393'];

// 初始化函数
function init() {
    createParticles();
    createFlowers();
    startAnimation();
    setupEventListeners();
}

// 创建粒子效果
function createParticles() {
    const container = document.getElementById('background-container');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const isHeart = Math.random() > 0.7;
        const particle = document.createElement('div');
        
        if (isHeart) {
            particle.className = 'heart';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        } else {
            particle.className = 'particle';
            const size = Math.random() * 10 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.backgroundColor = roseColors[Math.floor(Math.random() * roseColors.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        }

        container.appendChild(particle);
        particles.push(particle);
    }
}

// 创建花束
function createFlowers() {
    const container = document.getElementById('flower-container');
    
    // 只创建一朵玫瑰花
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    // 初始状态：花朵位于页面中心
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 - 100;
    const rotation = 0;
    
    flower.style.position = 'absolute';
    flower.style.left = centerX + 'px';
    flower.style.top = centerY + 'px';
    flower.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
    flower.style.transition = 'all 2s ease-out';
    
    // 存储初始位置，用于后续动画
    flower.dataset.initialX = centerX;
    flower.dataset.initialY = centerY;
    flower.dataset.initialRotation = rotation;
    
    // 创建茎
    const stemHeight = 150;
    const stem = document.createElement('div');
    stem.className = 'stem';
    stem.style.height = stemHeight + 'px';
    flower.appendChild(stem);
    
    // 创建叶子
    for (let i = 0; i < 2; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.bottom = 50 + i * 30 + 'px';
        leaf.style.left = i % 2 === 0 ? '-40px' : '6px';
        leaf.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
        flower.appendChild(leaf);
    }
    
    // 创建花朵 - 更逼真的玫瑰花
    const flowerHead = document.createElement('div');
    flowerHead.style.position = 'absolute';
    flowerHead.style.top = '-20px';
    flowerHead.style.left = '50%';
    flowerHead.style.transform = 'translateX(-50%)';
    
    // 创建花瓣 - 多层花瓣，更像玫瑰
    const petalCount = 12; // 12个花瓣，使花朵更丰满
    const petalSize = 30; // 固定花瓣大小，使花朵更统一
    const baseColor = roseColors[Math.floor(Math.random() * roseColors.length)];
    
    // 生成花瓣颜色渐变
    function createPetalGradient(color, intensity) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const newR = Math.min(255, Math.round(r * intensity));
        const newG = Math.min(255, Math.round(g * intensity));
        const newB = Math.min(255, Math.round(b * intensity));
        return `rgb(${newR}, ${newG}, ${newB})`;
    }
    
    // 内层花瓣
    for (let j = 0; j < petalCount; j++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.width = petalSize * 0.6 + 'px';
        petal.style.height = petalSize * 1.4 + 'px';
        petal.style.backgroundColor = createPetalGradient(baseColor, 1.1);
        petal.style.bottom = '0';
        petal.style.right = '0';
        petal.style.borderRadius = '150% 0 100% 30%';
        petal.style.transformOrigin = 'bottom right';
        petal.style.transform = `rotate(${j * (360 / petalCount)}deg) scale(0)`;
        petal.style.animation = 'bloom 1.2s ease-out forwards';
        petal.style.animationDelay = (j * 0.08) + 's';
        petal.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        flowerHead.appendChild(petal);
    }
    
    // 中层花瓣
    for (let j = 0; j < petalCount; j++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.width = petalSize * 0.8 + 'px';
        petal.style.height = petalSize * 1.6 + 'px';
        petal.style.backgroundColor = baseColor;
        petal.style.bottom = '0';
        petal.style.right = '0';
        petal.style.borderRadius = '150% 0 100% 30%';
        petal.style.transformOrigin = 'bottom right';
        petal.style.transform = `rotate(${j * (360 / petalCount)}deg) scale(0)`;
        petal.style.animation = 'bloom 1.2s ease-out forwards';
        petal.style.animationDelay = (j * 0.08 + 0.3) + 's';
        petal.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        flowerHead.appendChild(petal);
    }
    
    // 外层花瓣
    for (let j = 0; j < petalCount; j++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.width = petalSize + 'px';
        petal.style.height = petalSize * 1.8 + 'px';
        petal.style.backgroundColor = createPetalGradient(baseColor, 0.9);
        petal.style.bottom = '0';
        petal.style.right = '0';
        petal.style.borderRadius = '150% 0 100% 30%';
        petal.style.transformOrigin = 'bottom right';
        petal.style.transform = `rotate(${j * (360 / petalCount)}deg) scale(0)`;
        petal.style.animation = 'bloom 1.2s ease-out forwards';
        petal.style.animationDelay = (j * 0.08 + 0.6) + 's';
        petal.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        flowerHead.appendChild(petal);
    }
    
    // 创建花心
    const center = document.createElement('div');
    center.className = 'center';
    center.style.width = petalSize * 0.4 + 'px';
    center.style.height = petalSize * 0.4 + 'px';
    center.style.bottom = '5px';
    center.style.left = '50%';
    center.style.transform = 'translateX(-50%)';
    center.style.backgroundColor = '#ffd700';
    center.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.2)';
    
    // 添加花心细节
    const stamenCount = 8;
    for (let j = 0; j < stamenCount; j++) {
        const stamen = document.createElement('div');
        stamen.style.position = 'absolute';
        stamen.style.width = '2px';
        stamen.style.height = petalSize * 0.2 + 'px';
        stamen.style.backgroundColor = '#e67e22';
        stamen.style.bottom = '50%';
        stamen.style.left = '50%';
        stamen.style.transformOrigin = 'bottom center';
        stamen.style.transform = `translateX(-50%) rotate(${j * (360 / stamenCount)}deg)`;
        
        // 花药
        const anther = document.createElement('div');
        anther.style.position = 'absolute';
        anther.style.width = '4px';
        anther.style.height = '4px';
        anther.style.backgroundColor = '#8b4513';
        anther.style.borderRadius = '50%';
        anther.style.top = '-2px';
        anther.style.left = '50%';
        anther.style.transform = 'translateX(-50%)';
        stamen.appendChild(anther);
        
        center.appendChild(stamen);
    }
    
    flowerHead.appendChild(center);
    
    flower.appendChild(flowerHead);
    container.appendChild(flower);
    flowers.push(flower);
}

// 开始动画
function startAnimation() {
    animateFlowers();
}

// 花朵动画
function animateFlowers() {
    if (!isGathered) {
        flowers.forEach((flower, index) => {
            const rotation = parseFloat(flower.dataset.initialRotation) + Math.sin(Date.now() * 0.001 + index) * 10;
            flower.style.transform = `rotate(${rotation}deg) scale(0.8)`;
        });
    }

    animationId = requestAnimationFrame(animateFlowers);
}

// 设置事件监听器
function setupEventListeners() {
    const flowerContainer = document.getElementById('flower-container');
    flowerContainer.addEventListener('click', () => {
        if (!isGathered) {
            // 停止当前动画
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            // 添加花朵点击动画效果
            flowers.forEach((flower) => {
                flower.style.transform = `translate(-50%, -50%) rotate(0deg) scale(1.2)`;
                flower.style.transition = 'all 1s ease-out';
            });
            
            // 标记为已点击
            isGathered = true;
            
            // 2秒后显示祝福语
            setTimeout(() => {
                document.getElementById('flower-container').style.display = 'none';
                document.getElementById('message-container').classList.remove('hidden');
            }, 2000);
        }
    });
}

// 页面加载完成后初始化
window.addEventListener('load', init);