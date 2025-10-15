// Contract ABI (فقط توابع ضروری)
const CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "getUserInfo",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "uint256", "name": "uplineId", "type": "uint256"},
            {"internalType": "uint256", "name": "leftCount", "type": "uint256"},
            {"internalType": "uint256", "name": "rightCount", "type": "uint256"},
            {"internalType": "uint256", "name": "saveLeft", "type": "uint256"},
            {"internalType": "uint256", "name": "saveRight", "type": "uint256"},
            {"internalType": "uint256", "name": "balanceCount", "type": "uint256"},
            {"internalType": "uint256", "name": "specialBalanceCount", "type": "uint256"},
            {"internalType": "uint256", "name": "totalMinerRewards", "type": "uint256"},
            {"internalType": "uint256", "name": "entryPrice", "type": "uint256"},
            {"internalType": "bool", "name": "isMiner", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "userId", "type": "uint256"}],
        "name": "getUserDirects",
        "outputs": [
            {"internalType": "uint256", "name": "leftId", "type": "uint256"},
            {"internalType": "uint256", "name": "rightId", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const CONTRACT_ADDRESS = "0x166dd205590240c90ca4e0e545ad69db47d8f22f";

// Global variables
let web3;
let contract;
let userAccount;
let userInfo = {};

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletAddressSpan = document.getElementById('walletAddress');
const userInfoDiv = document.getElementById('userInfo');
const treeContainer = document.getElementById('treeContainer');
const currentUserIdSpan = document.getElementById('currentUserId');

// Initialize
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                userAccount = accounts[0];
                updateWalletUI();
                await loadUserInfo();
            }
        } catch (error) {
            console.log('No connected accounts');
        }
    } else {
        connectWalletBtn.disabled = true;
        connectWalletBtn.textContent = 'کیف پول یافت نشد';
    }
});

// Connect wallet
connectWalletBtn.addEventListener('click', async () => {
    try {
        connectWalletBtn.textContent = 'در حال اتصال...';
        connectWalletBtn.disabled = true;
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        updateWalletUI();
        await loadUserInfo();
        
    } catch (error) {
        alert('خطا در اتصال کیف پول');
        connectWalletBtn.textContent = '🔗 اتصال کیف پول';
        connectWalletBtn.disabled = false;
    }
});

// Update wallet UI
function updateWalletUI() {
    const shortAddress = userAccount.substring(0, 6) + '...' + userAccount.substring(userAccount.length - 4);
    walletAddressSpan.textContent = shortAddress;
    connectWalletBtn.textContent = 'اتصال برقرار شد';
    connectWalletBtn.disabled = true;
}

// Load user info
async function loadUserInfo() {
    try {
        userInfoDiv.innerHTML = '<div class="loading">در حال بارگذاری اطلاعات کاربر</div>';
        
        const result = await contract.methods.getUserInfo(userAccount).call();
        
        userInfo = {
            id: Number(result.id),
            uplineId: Number(result.uplineId),
            leftCount: Number(result.leftCount),
            rightCount: Number(result.rightCount),
            saveLeft: Number(result.saveLeft),
            saveRight: Number(result.saveRight),
            balanceCount: Number(result.balanceCount),
            specialBalanceCount: Number(result.specialBalanceCount),
            totalMinerRewards: web3.utils.fromWei(result.totalMinerRewards, 'ether'),
            entryPrice: web3.utils.fromWei(result.entryPrice, 'ether'),
            isMiner: result.isMiner
        };
        
        displayUserInfo();
        currentUserIdSpan.textContent = userInfo.id;
        
        // Load tree immediately after user info
        await loadNetworkTree();
        
    } catch (error) {
        console.error('Error loading user info:', error);
        userInfoDiv.innerHTML = '<p>خطا در بارگذاری اطلاعات کاربر</p>';
    }
}

// Display user info
function displayUserInfo() {
    userInfoDiv.innerHTML = `
        <div class="info-item">
            <span class="info-label">شناسه کاربری:</span>
            <span class="info-value">${userInfo.id}</span>
        </div>
        <div class="info-item">
            <span class="info-label">شناسه آپلاین:</span>
            <span class="info-value">${userInfo.uplineId}</span>
        </div>
        <div class="info-item">
            <span class="info-label">تعداد چپ:</span>
            <span class="info-value">${userInfo.leftCount}</span>
        </div>
        <div class="info-item">
            <span class="info-label">تعداد راست:</span>
            <span class="info-value">${userInfo.rightCount}</span>
        </div>
        <div class="info-item">
            <span class="info-label">ذخیره چپ:</span>
            <span class="info-value">${userInfo.saveLeft}</span>
        </div>
        <div class="info-item">
            <span class="info-label">ذخیره راست:</span>
            <span class="info-value">${userInfo.saveRight}</span>
        </div>
        <div class="info-item">
            <span class="info-label">تعداد بالانس:</span>
            <span class="info-value">${userInfo.balanceCount}</span>
        </div>
        <div class="info-item">
            <span class="info-label">بالانس ویژه:</span>
            <span class="info-value">${userInfo.specialBalanceCount}</span>
        </div>
        <div class="info-item">
            <span class="info-label">پاداش ماینر:</span>
            <span class="info-value">${userInfo.totalMinerRewards} MATIC</span>
        </div>
        <div class="info-item">
            <span class="info-label">قیمت ورود:</span>
            <span class="info-value">${userInfo.entryPrice} MATIC</span>
        </div>
        <div class="info-item">
            <span class="info-label">وضعیت ماینر:</span>
            <span class="info-value">${userInfo.isMiner ? '✅ فعال' : '❌ غیرفعال'}</span>
        </div>
    `;
}

// Load network tree - سریع و بهینه
async function loadNetworkTree() {
    try {
        treeContainer.innerHTML = '<div class="loading">در حال بارگذاری کل شبکه...</div>';
        
        if (!userInfo.id) {
            throw new Error('User info not loaded');
        }

        // ساختار درخت را سریع ایجاد کن
        const treeStructure = await buildTreeStructure(userInfo.id);
        renderCompleteTree(treeStructure);
        
    } catch (error) {
        console.error('Error loading network tree:', error);
        treeContainer.innerHTML = '<p>خطا در بارگذاری شبکه</p>';
    }
}

// ساختار درخت را به صورت بهینه ایجاد کن
async function buildTreeStructure(rootId) {
    const queue = [];
    const tree = {};
    const maxLevels = 5; // حداکثر ۵ سطح برای جلوگیری از overload
    
    // اضافه کردن ریشه
    queue.push({ id: rootId, level: 0 });
    
    while (queue.length > 0) {
        const { id, level } = queue.shift();
        
        if (level >= maxLevels) continue;
        
        try {
            // گرفتن اطلاعات کاربر
            const userAddress = await getAddressForUser(id);
            const userInfoData = await contract.methods.getUserInfo(userAddress).call();
            const directs = await contract.methods.getUserDirects(id).call();
            
            tree[id] = {
                id: Number(id),
                leftCount: Number(userInfoData.leftCount),
                rightCount: Number(userInfoData.rightCount),
                balanceCount: Number(userInfoData.balanceCount),
                isMiner: userInfoData.isMiner,
                leftId: Number(directs.leftId),
                rightId: Number(directs.rightId),
                isCurrentUser: id === userInfo.id,
                level: level
            };
            
            // اضافه کردن فرزندان به صف
            if (directs.leftId > 0) {
                queue.push({ id: directs.leftId, level: level + 1 });
            }
            if (directs.rightId > 0) {
                queue.push({ id: directs.rightId, level: level + 1 });
            }
            
        } catch (error) {
            console.log(`Error loading user ${id}:`, error);
            // ادامه دادن حتی اگر یک کاربر خطا داد
        }
    }
    
    return tree;
}

// تابع ساده برای گرفتن آدرس کاربر
async function getAddressForUser(userId) {
    // برای کاربر فعلی از آدرس کیف پول استفاده کن
    if (userId === userInfo.id) {
        return userAccount;
    }
    // برای سایر کاربران، از آدرس پیش‌فرض استفاده کن
    // در قراردادهای واقعی، باید تابع مناسب برای گرفتن آدرس داشته باشی
    return '0x0000000000000000000000000000000000000000';
}

// رندر کل درخت
function renderCompleteTree(treeStructure) {
    const treeElement = document.createElement('div');
    treeElement.className = 'binary-tree';
    
    // گروه‌بندی نودها بر اساس سطح
    const levels = {};
    Object.values(treeStructure).forEach(node => {
        if (!levels[node.level]) {
            levels[node.level] = [];
        }
        levels[node.level].push(node);
    });
    
    // رندر هر سطح
    Object.keys(levels).sort().forEach(level => {
        const levelElement = document.createElement('div');
        levelElement.className = 'tree-level';
        
        levels[level].forEach(node => {
            const nodeElement = createNodeElement(node);
            levelElement.appendChild(nodeElement);
        });
        
        treeElement.appendChild(levelElement);
        
        // اضافه کردن connector بین سطوح
        if (level < Object.keys(levels).length - 1) {
            const connectorLevel = createConnectorLevel(levels[level], levels[parseInt(level) + 1], treeStructure);
            treeElement.appendChild(connectorLevel);
        }
    });
    
    treeContainer.innerHTML = '';
    treeContainer.appendChild(treeElement);
}

// ایجاد المان نود
function createNodeElement(node) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'tree-node';
    
    const nodeBox = document.createElement('div');
    nodeBox.className = `node-box ${node.isCurrentUser ? 'current-user' : ''}`;
    
    const badges = [];
    if (node.isCurrentUser) badges.push('<span class="badge">شما</span>');
    if (node.isMiner) badges.push('<span class="badge">⛏️</span>');
    
    nodeBox.innerHTML = `
        <div class="node-header">
            <div class="node-id">${node.id}</div>
            <div>${badges.join('')}</div>
        </div>
        <div class="node-stats">
            <div class="stat-item">
                <span class="stat-value left">${node.leftCount}</span>
                <span class="stat-label">چپ</span>
            </div>
            <div class="stat-item">
                <span class="stat-value right">${node.rightCount}</span>
                <span class="stat-label">راست</span>
            </div>
            <div class="stat-item">
                <span class="stat-value balance">${node.balanceCount}</span>
                <span class="stat-label">بالانس</span>
            </div>
        </div>
        <div class="node-children-info">
            ${node.leftId > 0 ? '👈' : ''} ${node.rightId > 0 ? '👉' : ''}
        </div>
    `;
    
    nodeElement.appendChild(nodeBox);
    return nodeElement;
}

// ایجاد سطح connector بین نودها
function createConnectorLevel(parentNodes, childNodes, treeStructure) {
    const connectorLevel = document.createElement('div');
    connectorLevel.className = 'connector-level';
    
    const connectorsContainer = document.createElement('div');
    connectorsContainer.className = 'connectors-container';
    
    parentNodes.forEach(parentNode => {
        const parentConnectors = document.createElement('div');
        parentConnectors.className = 'parent-connectors';
        
        // connector برای فرزند چپ
        if (parentNode.leftId > 0 && treeStructure[parentNode.leftId]) {
            const leftConnector = document.createElement('div');
            leftConnector.className = 'branch-connector left-connector';
            leftConnector.innerHTML = '<div class="connector-line"></div><div class="branch-label">👈 چپ</div>';
            parentConnectors.appendChild(leftConnector);
        }
        
        // connector برای فرزند راست
        if (parentNode.rightId > 0 && treeStructure[parentNode.rightId]) {
            const rightConnector = document.createElement('div');
            rightConnector.className = 'branch-connector right-connector';
            rightConnector.innerHTML = '<div class="connector-line"></div><div class="branch-label">👉 راست</div>';
            parentConnectors.appendChild(rightConnector);
        }
        
        connectorsContainer.appendChild(parentConnectors);
    });
    
    connectorLevel.appendChild(connectorsContainer);
    return connectorLevel;
}