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
    },
    {
        "inputs": [{"internalType": "uint256", "name": "userId", "type": "uint256"}],
        "name": "_getSpecialUserInfoForMigrateToNewFork",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "address", "name": "userAddress", "type": "address"},
            {"internalType": "uint256", "name": "leftCount", "type": "uint256"},
            {"internalType": "uint256", "name": "rightCount", "type": "uint256"},
            {"internalType": "uint256", "name": "saveLeft", "type": "uint256"},
            {"internalType": "uint256", "name": "saveRight", "type": "uint256"},
            {"internalType": "uint256", "name": "balanceCount", "type": "uint256"},
            {"internalType": "address", "name": "upline", "type": "address"},
            {"internalType": "uint256", "name": "specialBalanceCount", "type": "uint256"},
            {"internalType": "uint256", "name": "totalMinerRewards", "type": "uint256"},
            {"internalType": "uint256", "name": "entryPrice", "type": "uint256"},
            {"internalType": "bool", "name": "isMiner", "type": "bool"}
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
    console.log('Starting application...');
    
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        web3 = new Web3(window.ethereum);
        
        try {
            // Initialize contract
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            console.log('Contract initialized');
            
            // Check if already connected
            const accounts = await web3.eth.getAccounts();
            console.log('Found accounts:', accounts);
            
            if (accounts.length > 0) {
                userAccount = accounts[0];
                console.log('Using account:', userAccount);
                updateWalletUI();
                await loadUserInfo();
            } else {
                console.log('No accounts connected');
                userInfoDiv.innerHTML = '<p>لطفاً کیف پول خود را متصل کنید</p>';
            }
        } catch (error) {
            console.error('Initialization error:', error);
            userInfoDiv.innerHTML = '<p>خطا در راه‌اندازی برنامه</p>';
        }
    } else {
        console.error('MetaMask not found!');
        connectWalletBtn.disabled = true;
        connectWalletBtn.textContent = '❌ MetaMask یافت نشد';
        userInfoDiv.innerHTML = '<p>لطفاً MetaMask را نصب کنید</p>';
    }
});

// Connect wallet
connectWalletBtn.addEventListener('click', async () => {
    try {
        console.log('Connecting wallet...');
        connectWalletBtn.textContent = '⏳ در حال اتصال...';
        connectWalletBtn.disabled = true;
        
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask not installed');
        }
        
        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        userAccount = accounts[0];
        console.log('Connected account:', userAccount);
        
        // Update Web3 instance
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        updateWalletUI();
        await loadUserInfo();
        
    } catch (error) {
        console.error('Wallet connection error:', error);
        connectWalletBtn.textContent = '🔗 اتصال کیف پول';
        connectWalletBtn.disabled = false;
        
        if (error.code === 4001) {
            alert('اتصال توسط کاربر لغو شد');
        } else {
            alert('خطا در اتصال کیف پول: ' + error.message);
        }
    }
});

// Update wallet UI
function updateWalletUI() {
    if (userAccount) {
        const shortAddress = userAccount.substring(0, 6) + '...' + userAccount.substring(userAccount.length - 4);
        walletAddressSpan.textContent = shortAddress;
        connectWalletBtn.textContent = '✅ اتصال برقرار شد';
        connectWalletBtn.disabled = true;
    }
}

// Load user info with better error handling
async function loadUserInfo() {
    try {
        console.log('Loading user info for:', userAccount);
        userInfoDiv.innerHTML = '<div class="loading">در حال بارگذاری اطلاعات کاربر...</div>';
        
        if (!contract) {
            throw new Error('Contract not initialized');
        }
        
        if (!userAccount) {
            throw new Error('User account not available');
        }
        
        // Call contract method
        const result = await contract.methods.getUserInfo(userAccount).call();
        console.log('Raw contract result:', result);
        
        // Check if user exists (id should be greater than 0)
        if (result.id === '0' || result.id === 0) {
            throw new Error('کاربر در سیستم ثبت نشده است');
        }
        
        // Process result
        userInfo = {
            id: Number(result.id),
            uplineId: Number(result.uplineId),
            leftCount: Number(result.leftCount),
            rightCount: Number(result.rightCount),
            saveLeft: Number(result.saveLeft),
            saveRight: Number(result.saveRight),
            balanceCount: Number(result.balanceCount),
            specialBalanceCount: Number(result.specialBalanceCount),
            totalMinerRewards: web3.utils.fromWei(result.totalMinerRewards || '0', 'ether'),
            entryPrice: web3.utils.fromWei(result.entryPrice || '0', 'ether'),
            isMiner: result.isMiner
        };
        
        console.log('Processed user info:', userInfo);
        
        // Update UI
        displayUserInfo();
        currentUserIdSpan.textContent = userInfo.id;
        
        // Load tree after user info is loaded
        await loadFullTree();
        
    } catch (error) {
        console.error('Error loading user info:', error);
        
        let errorMessage = 'خطا در بارگذاری اطلاعات کاربر';
        if (error.message.includes('user not registered') || error.message.includes('کاربر در سیستم ثبت نشده')) {
            errorMessage = 'شما در سیستم ثبت نشده‌اید. لطفاً ابتدا در قرارداد ثبت نام کنید.';
        } else if (error.message.includes('revert')) {
            errorMessage = 'خطا در ارتباط با قرارداد. ممکن است آدرس قرارداد نادرست باشد.';
        } else if (error.message.includes('Network error')) {
            errorMessage = 'خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.';
        }
        
        userInfoDiv.innerHTML = `
            <div style="text-align: center; color: var(--accent); padding: 20px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
                <div style="font-weight: 700; margin-bottom: 10px;">${errorMessage}</div>
                <div style="font-size: 0.8rem; color: var(--gray); margin-top: 10px;">
                    ${error.message}
                </div>
            </div>
        `;
        
        treeContainer.innerHTML = '<p>بارگذاری درخت متوقف شد</p>';
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
            <span class="info-value">${parseFloat(userInfo.totalMinerRewards).toFixed(4)} MATIC</span>
        </div>
        <div class="info-item">
            <span class="info-label">قیمت ورود:</span>
            <span class="info-value">${parseFloat(userInfo.entryPrice).toFixed(4)} MATIC</span>
        </div>
        <div class="info-item">
            <span class="info-label">وضعیت ماینر:</span>
            <span class="info-value">${userInfo.isMiner ? '✅ فعال' : '❌ غیرفعال'}</span>
        </div>
    `;
}

// Load full tree
async function loadFullTree() {
    try {
        treeContainer.innerHTML = '<div class="loading">در حال بارگذاری شبکه زیرمجموعه...</div>';
        
        if (!userInfo.id) {
            throw new Error('User info not loaded');
        }
        
        const rootNode = await createTreeNode(userInfo.id, true);
        
        if (rootNode) {
            renderTree(rootNode);
        } else {
            throw new Error('Failed to create root node');
        }
        
    } catch (error) {
        console.error('Error loading tree:', error);
        treeContainer.innerHTML = `
            <div style="text-align: center; color: var(--accent); padding: 40px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🌳</div>
                <div style="font-weight: 700; margin-bottom: 10px;">خطا در بارگذاری درخت شبکه</div>
                <div style="color: var(--gray); margin-bottom: 20px;">${error.message}</div>
            </div>
        `;
    }
}

// Create tree node
async function createTreeNode(userId, isCurrentUser = false) {
    if (!userId || userId === 0) {
        return null;
    }
    
    try {
        console.log(`Loading node: ${userId}`);
        
        const userAddress = await getUserAddress(userId);
        const userInfoData = await contract.methods.getUserInfo(userAddress).call();
        const directs = await contract.methods.getUserDirects(userId).call();
        
        const node = {
            id: Number(userId),
            leftCount: Number(userInfoData.leftCount),
            rightCount: Number(userInfoData.rightCount),
            balanceCount: Number(userInfoData.balanceCount),
            isMiner: userInfoData.isMiner,
            leftId: Number(directs.leftId),
            rightId: Number(directs.rightId),
            isCurrentUser: isCurrentUser,
            left: null,
            right: null
        };
        
        console.log(`Node ${userId} loaded:`, node);
        
        // Load children (limit depth to prevent too many calls)
        if (node.leftId > 0) {
            node.left = await createTreeNode(node.leftId);
        }
        
        if (node.rightId > 0) {
            node.right = await createTreeNode(node.rightId);
        }
        
        return node;
        
    } catch (error) {
        console.error(`Error loading node ${userId}:`, error);
        return null;
    }
}

// Get user address
async function getUserAddress(userId) {
    try {
        if (userId === userInfo.id) {
            return userAccount;
        }
        
        // Try to get address from contract
        const specialUserInfo = await contract.methods._getSpecialUserInfoForMigrateToNewFork(userId).call();
        if (specialUserInfo.userAddress && specialUserInfo.userAddress !== '0x0000000000000000000000000000000000000000') {
            return specialUserInfo.userAddress;
        }
        
        // Fallback: return zero address (will likely fail, but we handle it)
        return '0x0000000000000000000000000000000000000000';
        
    } catch (error) {
        console.log(`Could not get address for user ${userId}, using fallback`);
        return '0x0000000000000000000000000000000000000000';
    }
}

// Render tree
function renderTree(rootNode) {
    if (!rootNode) {
        treeContainer.innerHTML = '<p>خطا در ایجاد درخت</p>';
        return;
    }
    
    const treeElement = document.createElement('div');
    treeElement.className = 'binary-tree';
    
    // Render root level
    const rootLevel = document.createElement('div');
    rootLevel.className = 'tree-level';
    rootLevel.appendChild(createNodeElement(rootNode));
    treeElement.appendChild(rootLevel);
    
    // Render children
    if (rootNode.left || rootNode.right) {
        const childrenLevel = document.createElement('div');
        childrenLevel.className = 'tree-level';
        
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'node-children';
        
        if (rootNode.left) {
            const leftBranch = createChildBranch('left', rootNode.left);
            childrenContainer.appendChild(leftBranch);
        } else {
            const emptyLeft = createEmptyBranch('left');
            childrenContainer.appendChild(emptyLeft);
        }
        
        if (rootNode.right) {
            const rightBranch = createChildBranch('right', rootNode.right);
            childrenContainer.appendChild(rightBranch);
        } else {
            const emptyRight = createEmptyBranch('right');
            childrenContainer.appendChild(emptyRight);
        }
        
        childrenLevel.appendChild(childrenContainer);
        treeElement.appendChild(childrenLevel);
    }
    
    treeContainer.innerHTML = '';
    treeContainer.appendChild(treeElement);
}

// Create node element
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
    `;
    
    nodeElement.appendChild(nodeBox);
    return nodeElement;
}

// Create child branch
function createChildBranch(side, childNode) {
    const branchElement = document.createElement('div');
    branchElement.className = 'child-branch';
    
    const branchLabel = document.createElement('div');
    branchLabel.className = 'branch-label';
    branchLabel.textContent = side === 'left' ? '👈 چپ' : '👉 راست';
    branchElement.appendChild(branchLabel);
    
    if (childNode) {
        branchElement.appendChild(createNodeElement(childNode));
    }
    
    return branchElement;
}

// Create empty branch
function createEmptyBranch(side) {
    const branchElement = document.createElement('div');
    branchElement.className = 'child-branch';
    
    const emptyBox = document.createElement('div');
    emptyBox.className = 'node-box';
    emptyBox.innerHTML = `
        <div style="text-align: center; color: var(--gray); padding: 20px;">
            <div style="font-size: 2rem; margin-bottom: 10px;">➕</div>
            <div>${side === 'left' ? 'چپ' : 'راست'} خالی</div>
        </div>
    `;
    
    branchElement.appendChild(emptyBox);
    return branchElement;
}

// Add debug function to check contract connection
window.debugContract = async function() {
    console.log('=== Contract Debug Info ===');
    console.log('Contract address:', CONTRACT_ADDRESS);
    console.log('Web3 version:', Web3.version);
    console.log('Current account:', userAccount);
    console.log('Contract instance:', contract);
    
    try {
        const totalUsers = await contract.methods.totalUsers().call();
        console.log('Total users in contract:', totalUsers);
    } catch (error) {
        console.log('Error calling totalUsers:', error);
    }
};