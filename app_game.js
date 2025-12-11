// 英语单词连连看游戏逻辑

// 游戏状态管理
class GameManager {
    constructor() {
        // 游戏状态
        this.currentScreen = 'welcome';
        this.currentTheme = null;
        this.selectedWord = null;
        this.selectedImage = null;
        this.score = 0;
        this.level = 1;
        this.correctPairs = 0;
        this.totalPairs = 0;
        
        // 游戏数据
        this.wordData = {
            animals: [
                { word: 'cat', chinese: '猫', image: '🐱' },
                { word: 'dog', chinese: '狗', image: '🐶' },
                { word: 'duck', chinese: '鸭子', image: '🦆' },
                { word: 'fish', chinese: '鱼', image: '🐟' },
                { word: 'bird', chinese: '鸟', image: '🐦' },
                { word: 'bee', chinese: '蜜蜂', image: '🐝' },
                { word: 'rabbit', chinese: '兔子', image: '🐰' },
                { word: 'elephant', chinese: '大象', image: '🐘' }
            ],
            fruits: [
                { word: 'apple', chinese: '苹果', image: '🍎' },
                { word: 'banana', chinese: '香蕉', image: '🍌' },
                { word: 'orange', chinese: '橙子', image: '🍊' },
                { word: 'grape', chinese: '葡萄', image: '🍇' },
                { word: 'peach', chinese: '桃子', image: '🍑' },
                { word: 'pear', chinese: '梨', image: '🍐' },
                { word: 'strawberry', chinese: '草莓', image: '🍓' },
                { word: 'watermelon', chinese: '西瓜', image: '🍉' }
            ],
            colors: [
                { word: 'red', chinese: '红色', image: '🔴' },
                { word: 'blue', chinese: '蓝色', image: '🔵' },
                { word: 'yellow', chinese: '黄色', image: '🟡' },
                { word: 'green', chinese: '绿色', image: '🟢' },
                { word: 'orange', chinese: '橙色', image: '🟠' },
                { word: 'purple', chinese: '紫色', image: '🟣' },
                { word: 'pink', chinese: '粉色', image: '💖' },
                { word: 'brown', chinese: '棕色', image: '🟤' }
            ],
            numbers: [
                { word: 'one', chinese: '一', image: '1️⃣' },
                { word: 'two', chinese: '二', image: '2️⃣' },
                { word: 'three', chinese: '三', image: '3️⃣' },
                { word: 'four', chinese: '四', image: '4️⃣' },
                { word: 'five', chinese: '五', image: '5️⃣' },
                { word: 'six', chinese: '六', image: '6️⃣' },
                { word: 'seven', chinese: '七', image: '7️⃣' },
                { word: 'eight', chinese: '八', image: '8️⃣' }
            ]
        };
        
        // DOM元素
        this.initializeDOM();
        
        // 事件监听
        this.setupEventListeners();
        
        console.log('游戏管理器初始化完成');
    }
    
    // 初始化DOM元素
    initializeDOM() {
        // 屏幕元素
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            select: document.getElementById('word-select-screen'),
            game: document.getElementById('game-screen'),
            gameOver: document.getElementById('game-over-screen')
        };
        
        // 按钮元素
        this.buttons = {
            start: document.getElementById('start-btn'),
            backToWelcome: document.getElementById('back-to-welcome'),
            backToWelcomeEnd: document.getElementById('back-to-welcome-end'),
            restart: document.getElementById('restart-btn'),
            backToSelect: document.getElementById('back-to-select'),
            playAgain: document.getElementById('play-again-btn'),
            changeTheme: document.getElementById('change-theme-btn')
        };
        
        // 游戏元素
        this.gameElements = {
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            wordList: document.getElementById('word-list'),
            imageList: document.getElementById('image-list'),
            gameStatus: document.getElementById('game-status'),
            successMessage: document.getElementById('success-message'),
            finalScore: document.getElementById('final-score'),
            finalLevel: document.getElementById('final-level'),
            correctPairs: document.getElementById('correct-pairs'),
            totalPairs: document.getElementById('total-pairs')
        };
    }
    
    // 设置事件监听
    setupEventListeners() {
        // 欢迎界面按钮
        this.buttons.start.addEventListener('click', () => this.showScreen('select'));
        
        // 返回按钮
        this.buttons.backToWelcome.addEventListener('click', () => this.showScreen('welcome'));
        this.buttons.backToWelcomeEnd.addEventListener('click', () => this.showScreen('welcome'));
        this.buttons.backToSelect.addEventListener('click', () => {
            this.resetGame();
            this.showScreen('select');
        });
        
        // 重新开始按钮
        this.buttons.restart.addEventListener('click', () => this.restartGame());
        this.buttons.playAgain.addEventListener('click', () => this.restartGame());
        this.buttons.changeTheme.addEventListener('click', () => {
            this.resetGame();
            this.showScreen('select');
        });
        
        // 主题选择
        const themeCards = document.querySelectorAll('.theme-card');
        themeCards.forEach(card => {
            card.addEventListener('click', () => {
                const theme = card.dataset.theme;
                this.selectTheme(theme);
            });
        });
    }
    
    // 显示指定屏幕
    showScreen(screenName) {
        // 隐藏所有屏幕
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // 显示目标屏幕
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            this.currentScreen = screenName;
        }
    }
    
    // 选择主题
    selectTheme(theme) {
        this.currentTheme = theme;
        this.resetGame();
        this.initGame();
        this.showScreen('game');
    }
    
    // 初始化游戏
    initGame() {
        // 获取当前主题的单词数据
        const words = this.wordData[this.currentTheme];
        
        // 根据关卡决定显示的单词数量
        let pairCount;
        switch(this.level) {
            case 1:
                pairCount = 4;
                break;
            case 2:
                pairCount = 6;
                break;
            case 3:
                pairCount = 8;
                break;
            default:
                pairCount = 4;
        }
        
        this.totalPairs = pairCount;
        
        // 随机选择指定数量的单词
        const selectedWords = this.shuffleArray([...words]).slice(0, pairCount);
        
        // 打乱单词和图片顺序
        const shuffledWords = this.shuffleArray([...selectedWords]);
        const shuffledImages = this.shuffleArray([...selectedWords]);
        
        // 清空列表
        this.gameElements.wordList.innerHTML = '';
        this.gameElements.imageList.innerHTML = '';
        
        // 创建单词卡片
        shuffledWords.forEach((item, index) => {
            const wordCard = this.createWordCard(item, index);
            this.gameElements.wordList.appendChild(wordCard);
        });
        
        // 创建图片卡片
        shuffledImages.forEach((item, index) => {
            const imageCard = this.createImageCard(item, index);
            this.gameElements.imageList.appendChild(imageCard);
        });
        
        // 更新显示
        this.updateDisplay();
        
        // 根据关卡调整卡片大小
        this.adjustCardSize();
        
        console.log(`游戏初始化完成，主题：${this.currentTheme}，关卡：${this.level}，总配对数：${this.totalPairs}`);
    }
    
    // 创建单词卡片
    createWordCard(item, index) {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.dataset.word = item.word;
        card.dataset.index = index;
        card.textContent = item.word;
        
        // 初始样式
        card.style.display = 'flex';
        card.style.justifyContent = 'center';
        card.style.alignItems = 'center';
        card.style.borderRadius = '15px';
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';
        card.style.fontWeight = 'bold';
        card.style.color = '#8B4513';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        card.style.border = '3px solid transparent';
        card.style.background = 'linear-gradient(135deg, #FFF8DC, #DEB887)';
        
        card.addEventListener('click', () => {
            if (this.selectedWord === card) {
                // 取消选择
                this.selectedWord.classList.remove('selected');
                this.selectedWord = null;
            } else {
                // 取消之前的选择（只取消单词卡片的选择）
                if (this.selectedWord) {
                    this.selectedWord.classList.remove('selected');
                }
                // 选择新单词
                this.selectedWord = card;
                this.selectedWord.classList.add('selected');
                
                // 检查是否可以匹配
                this.checkMatch();
            }
        });
        
        return card;
    }
    
    // 创建图片卡片
    createImageCard(item, index) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.word = item.word;
        card.dataset.index = index;
        
        const image = document.createElement('div');
        image.className = 'card-image';
        image.textContent = item.image;
        
        const chinese = document.createElement('div');
        chinese.className = 'card-chinese';
        chinese.textContent = item.chinese;
        
        card.appendChild(image);
        card.appendChild(chinese);
        
        card.addEventListener('click', () => {
            if (this.selectedImage === card) {
                // 取消选择
                this.selectedImage.classList.remove('selected');
                this.selectedImage = null;
            } else {
                // 取消之前的选择（只取消图片卡片的选择）
                if (this.selectedImage) {
                    this.selectedImage.classList.remove('selected');
                }
                // 选择新图片
                this.selectedImage = card;
                this.selectedImage.classList.add('selected');
                
                // 检查是否可以匹配
                this.checkMatch();
            }
        });
        
        return card;
    }
    
    // 检查匹配
    checkMatch() {
        if (this.selectedWord && this.selectedImage) {
            const word = this.selectedWord.dataset.word;
            const imageWord = this.selectedImage.dataset.word;
            
            if (word === imageWord) {
                // 匹配成功
                this.handleMatch();
            } else {
                // 匹配失败
                this.handleMismatch();
            }
        }
    }
    
    // 处理匹配成功
    handleMatch() {
        // 播放成功动画
        this.showSuccessMessage();
        
        // 更新卡片状态
        this.selectedWord.classList.add('matched');
        this.selectedImage.classList.add('matched');
        
        // 保存当前选中的卡片引用
        const wordCard = this.selectedWord;
        const imageCard = this.selectedImage;
        
        // 绘制连接线
        this.drawConnection();
        
        // 更新分数和进度
        this.score += 10;
        this.correctPairs++;
        
        // 重置选择
        this.selectedWord = null;
        this.selectedImage = null;
        
        // 更新显示
        this.updateDisplay();
        
        // 延迟后从DOM中移除卡片
        setTimeout(() => {
            wordCard.style.display = 'none';
            imageCard.style.display = 'none';
            
            // 检查游戏是否完成
            if (this.correctPairs === this.totalPairs) {
                this.nextLevel();
            }
        }, 500);
    }
    
    // 处理匹配失败
    handleMismatch() {
        // 短暂高亮错误
        this.selectedWord.style.borderColor = '#ff4444';
        this.selectedImage.style.borderColor = '#ff4444';
        
        // 显示错误信息
        this.gameElements.gameStatus.textContent = '❌ 配对错误，请再试一次！';
        this.gameElements.gameStatus.style.color = '#ff4444';
        
        // 重置选择
        setTimeout(() => {
            this.selectedWord.classList.remove('selected');
            this.selectedImage.classList.remove('selected');
            this.selectedWord.style.borderColor = '';
            this.selectedImage.style.borderColor = '';
            this.selectedWord = null;
            this.selectedImage = null;
            
            this.gameElements.gameStatus.textContent = '点击左边的英文单词，再点击右边对应的图片和中文含义！';
            this.gameElements.gameStatus.style.color = '#8B4513';
        }, 1000);
    }
    
    // 显示成功信息
    showSuccessMessage() {
        this.gameElements.successMessage.classList.remove('hidden');
        
        setTimeout(() => {
            this.gameElements.successMessage.classList.add('hidden');
        }, 2000);
    }
    
    // 绘制连接线
    drawConnection() {
        if (!this.selectedWord || !this.selectedImage) return;
        
        const wordRect = this.selectedWord.getBoundingClientRect();
        const imageRect = this.selectedImage.getBoundingClientRect();
        const connectionArea = document.querySelector('.connection-area');
        const connectionRect = connectionArea.getBoundingClientRect();
        
        // 创建连接线
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        // 设置连接线位置
        line.style.top = `${connectionRect.height / 2}px`;
        line.style.left = '0';
        
        connectionArea.appendChild(line);
        
        // 1秒后移除连接线
        setTimeout(() => {
            if (line.parentNode) {
                line.parentNode.removeChild(line);
            }
        }, 1000);
    }
    
    // 下一关
    nextLevel() {
        this.level++;
        
        // 检查是否需要增加难度
        if (this.level > 3) {
            // 游戏完成
            this.showGameOver();
        } else {
            // 重置游戏数据
            this.correctPairs = 0;
            
            // 更新显示
            this.updateDisplay();
            
            // 清空单词和图片列表
            this.gameElements.wordList.innerHTML = '';
            this.gameElements.imageList.innerHTML = '';
            
            // 延迟加载新关卡
            setTimeout(() => {
                this.gameElements.gameStatus.textContent = `🎉 恭喜！进入第 ${this.level} 关！`;
                this.gameElements.gameStatus.style.color = '#4CAF50';
                
                setTimeout(() => {
                    // 重新初始化游戏
                    this.initGame();
                    this.gameElements.gameStatus.textContent = '点击左边的英文单词，再点击右边对应的图片和中文含义！';
                    this.gameElements.gameStatus.style.color = '#8B4513';
                }, 2000);
            }, 1000);
        }
    }
    
    // 显示游戏结束界面
    showGameOver() {
        // 更新游戏结束数据
        this.gameElements.finalScore.textContent = this.score;
        this.gameElements.finalLevel.textContent = this.level;
        this.gameElements.correctPairs.textContent = this.correctPairs;
        this.gameElements.totalPairs.textContent = this.totalPairs;
        
        // 显示游戏结束界面
        this.showScreen('gameOver');
    }
    
    // 重新开始游戏
    restartGame() {
        this.resetGame();
        this.initGame();
        this.showScreen('game');
    }
    
    // 重置游戏数据
    resetGame() {
        this.selectedWord = null;
        this.selectedImage = null;
        this.score = 0;
        this.level = 1;
        this.correctPairs = 0;
        this.totalPairs = 0;
        
        // 清除连接线
        const connectionArea = document.querySelector('.connection-area');
        connectionArea.innerHTML = '';
        
        // 重置状态信息
        this.gameElements.gameStatus.textContent = '点击左边的英文单词，再点击右边对应的图片和中文含义！';
        this.gameElements.gameStatus.style.color = '#8B4513';
        this.gameElements.successMessage.classList.add('hidden');
        
        this.updateDisplay();
    }
    
    // 更新显示
    updateDisplay() {
        this.gameElements.score.textContent = this.score;
        this.gameElements.level.textContent = this.level;
    }
    
    // 根据关卡调整卡片大小
    adjustCardSize() {
        // 获取单词列表和图片列表
        const wordCards = this.gameElements.wordList.querySelectorAll('.word-card');
        const imageCards = this.gameElements.imageList.querySelectorAll('.image-card');
        
        // 根据关卡设置不同的卡片大小
        let cardWidth, cardHeight, fontSize;
        
        switch (this.level) {
            case 1:
                // 第一关：4对单词，大卡片
                cardWidth = '160px';
                cardHeight = '100px';
                fontSize = '32px';
                break;
            case 2:
                // 第二关：6对单词，中卡片
                cardWidth = '140px';
                cardHeight = '90px';
                fontSize = '28px';
                break;
            case 3:
                // 第三关：8对单词，小卡片
                cardWidth = '120px';
                cardHeight = '80px';
                fontSize = '24px';
                break;
            default:
                cardWidth = '140px';
                cardHeight = '90px';
                fontSize = '28px';
        }
        
        // 应用单词卡片样式
        wordCards.forEach(card => {
            card.style.width = cardWidth;
            card.style.height = cardHeight;
            card.style.fontSize = fontSize;
            card.style.padding = '25px 20px';
            card.style.boxSizing = 'border-box';
            card.style.display = 'flex';
            card.style.justifyContent = 'center';
            card.style.alignItems = 'center';
            card.style.borderRadius = '15px';
            card.style.cursor = 'pointer';
            card.style.transition = 'all 0.3s ease';
            card.style.fontWeight = 'bold';
            card.style.color = '#8B4513';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            card.style.border = '3px solid transparent';
            card.style.background = 'linear-gradient(135deg, #FFF8DC, #DEB887)';
        });
        
        // 应用图片卡片样式
        imageCards.forEach(card => {
            card.style.width = cardWidth;
            card.style.height = cardHeight;
            card.style.padding = '20px 15px';
            card.style.boxSizing = 'border-box';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'center';
            card.style.alignItems = 'center';
            card.style.borderRadius = '15px';
            card.style.cursor = 'pointer';
            card.style.transition = 'all 0.3s ease';
            card.style.fontWeight = 'bold';
            card.style.color = '#8B4513';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            card.style.border = '3px solid transparent';
            card.style.background = 'linear-gradient(135deg, #FFF8DC, #DEB887)';
        });
        
        // 调整图片大小
        const cardImages = this.gameElements.imageList.querySelectorAll('.card-image');
        let imageSize;
        switch (this.level) {
            case 1:
                imageSize = '90px';
                break;
            case 2:
                imageSize = '80px';
                break;
            case 3:
                imageSize = '70px';
                break;
            default:
                imageSize = '80px';
        }
        
        cardImages.forEach(img => {
            img.style.width = imageSize;
            img.style.height = imageSize;
            img.style.marginBottom = '10px';
            img.style.background = 'white';
            img.style.padding = '12px';
            img.style.borderRadius = '10px';
            img.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        // 调整中文文本大小
        const cardChinese = this.gameElements.imageList.querySelectorAll('.card-chinese');
        let chineseFontSize;
        switch (this.level) {
            case 1:
                chineseFontSize = '20px';
                break;
            case 2:
                chineseFontSize = '18px';
                break;
            case 3:
                chineseFontSize = '16px';
                break;
            default:
                chineseFontSize = '18px';
        }
        
        cardChinese.forEach(text => {
            text.style.fontSize = chineseFontSize;
            text.style.color = '#A0522D';
            text.style.fontWeight = 'bold';
            text.style.textAlign = 'center';
        });
    }
    
    // 打乱数组
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏管理器实例
    const game = new GameManager();
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        // ESC键返回上一级
        if (e.key === 'Escape') {
            if (game.currentScreen === 'game') {
                game.resetGame();
                game.showScreen('select');
            } else if (game.currentScreen === 'select') {
                game.showScreen('welcome');
            }
        }
        
        // R键重新开始
        if (e.key.toLowerCase() === 'r' && game.currentScreen === 'game') {
            game.restartGame();
        }
    });
    
    console.log('英语单词连连看游戏已初始化完成！');
});

// 辅助功能：添加触摸支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
        // 防止触摸设备上的默认行为
        if (e.target.classList.contains('word-card') || e.target.classList.contains('image-card')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// 辅助功能：添加音效支持（可选）
class SoundManager {
    constructor() {
        this.sounds = {
            click: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='),
            success: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='),
            error: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=')
        };
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play().catch(e => {
                // 忽略自动播放限制
            });
        }
    }
}

// 初始化音效管理器（如果需要）
// const soundManager = new SoundManager();