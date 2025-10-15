// Contract ABI کامل
const CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "string", "name": "message", "type": "string"}],
        "name": "DebugMessage",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256"}],
        "name": "EntryFeeUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
            {"indexed": false, "internalType": "string", "name": "poolType", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "ManualWithdraw",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "contributor", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "MinerPoolContribution",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "MinerTokensBought",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": false, "internalType": "string", "name": "poolType", "type": "string"}],
        "name": "NoEligibleUsers",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"},
            {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
            {"indexed": true, "internalType": "address", "name": "upline", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
            {"indexed": false, "internalType": "bool", "name": "placeOnLeft", "type": "bool"}
        ],
        "name": "Registered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"}
        ],
        "name": "UserMigrated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "CYCLE_DURATION",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ENTRY_FEE",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_CYCLE_BALANCES",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINER_BUY_INTERVAL",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PTOKEN_CONTRACT",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
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
    },
    {
        "inputs": [],
        "name": "buyMinerTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contributeToMinerPool",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "distributeMinerTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eligiblePoolUserCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eligibleSpecialUserCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMinerStats",
        "outputs": [
            {"internalType": "uint256", "name": "checkedOutPaidCount", "type": "uint256"},
            {"internalType": "uint256", "name": "eligibleInProgressCount", "type": "uint256"},
            {"internalType": "uint256", "name": "totalRemain", "type": "uint256"},
            {"internalType": "uint256", "name": "networkerCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "percent", "type": "uint256"}],
        "name": "getMinerStatsByPercent",
        "outputs": [
            {"internalType": "uint256", "name": "usersAbovePercent", "type": "uint256"},
            {"internalType": "uint256", "name": "totalRemaining", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSpecialPoolParticipants",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTokenPrice",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
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
        "inputs": [{"internalType": "uint8", "name": "day", "type": "uint8"}],
        "name": "isCurrentTimeMatchToDay",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isPoolWithdrawable",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastMinerBuyTime",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastPoolWithdrawTime",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minerTokenPool",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "address", "name": "userWallet", "type": "address"},
            {"internalType": "uint256", "name": "uplineId", "type": "uint256"},
            {"internalType": "address", "name": "leftChildAddress", "type": "address"},
            {"internalType": "address", "name": "rightChildAddress", "type": "address"},
            {"internalType": "uint256", "name": "oldLeftCount", "type": "uint256"},
            {"internalType": "uint256", "name": "oldRightCount", "type": "uint256"},
            {"internalType": "uint256", "name": "oldLeftSave", "type": "uint256"},
            {"internalType": "uint256", "name": "oldRightSave", "type": "uint256"}
        ],
        "name": "mpu",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pendingMinerFunds",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolPointCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "uplineCode", "type": "uint256"},
            {"internalType": "bool", "name": "placeOnLeft", "type": "bool"}
        ],
        "name": "register",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "specialPointCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "specialRewardPool",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalUsers",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "newFee", "type": "uint256"}],
        "name": "updateEntryFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawSpecials",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// آدرس قرارداد - مطمئن شوید این آدرس صحیح است
const CONTRACT_ADDRESS = "0x166dd205590240c90ca4e0e545ad69db47d8f22f";

// Global variables
let web3;
let contract;
let userAccount;
let userInfo = {};
let nodeCache = new Map();
let expandedNodes = new Set();
let currentRootId = null;

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletAddressSpan = document.getElementById('walletAddress');
const userInfoDiv = document.getElementById('userInfo');
const treeContainer = document.getElementById('treeContainer');
const currentUserIdSpan = document.getElementById('currentUserId');

// Initialize Application
window.addEventListener('load', async () => {
    console.log('Initializing application...');
    
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask detected!');
        web3 = new Web3(window.ethereum);
        
        try {
            // Initialize contract
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            console.log('Contract initialized:', contract);
            
            // Check if already connected
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                userAccount = accounts[0];
                console.log('Already connected with account:', userAccount);
                updateWalletUI();
                await loadUserInfo();
                await loadBinaryTree();
            } else {
                console.log('No accounts connected');
            }
        } catch (error) {
            console.error('Error initializing contract:', error);
            showError('خطا در اتصال به قرارداد هوشمند');
        }
    } else {
        console.error('MetaMask not found!');
        connectWalletBtn.disabled = true;
        connectWalletBtn.textContent = '❌ MetaMask یافت نشد';
        showError('لطفاً MetaMask را نصب کنید');
    }
});

// Connect wallet function
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
        
        // Update Web3 instance with current provider
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        updateWalletUI();
        await loadUserInfo();
        await loadBinaryTree();
        
    } catch (error) {
        console.error('Wallet connection error:', error);
        connectWalletBtn.textContent = '🔗 اتصال کیف پول';
        connectWalletBtn.disabled = false;
        
        if (error.code === 4001) {
            showError('اتصال توسط کاربر لغو شد');
        } else {
            showError('خطا در اتصال کیف پول: ' + error.message);
        }
    }
});

// Update wallet UI
function updateWalletUI() {
    const shortAddress = userAccount ? 
        userAccount.substring(0, 6) + '...' + userAccount.substring(userAccount.length - 4) : 
        'اتصال برقرار نشده';
    
    walletAddressSpan.textContent = shortAddress;
    connectWalletBtn.textContent = '✅ اتصال برقرار شد';
    connectWalletBtn.disabled = true;
}

// Load user info from contract
async function loadUserInfo() {
    try {
        console.log('Loading user info for:', userAccount);
        userInfoDiv.innerHTML = '<div class="loading">در حال بارگذاری اطلاعات کاربر</div>';
        
        if (!contract || !userAccount) {
            throw new Error('Contract or user account not initialized');
        }
        
        const result = await contract.methods.getUserInfo(userAccount).call();
        console.log('User info result:', result);
        
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
        
        console.log('Processed user info:', userInfo);
        displayUserInfo();
        currentUserIdSpan.textContent = userInfo.id;
        
    } catch (error) {
        console.error('Error loading user info:', error);
        userInfoDiv.innerHTML = `
            <div style="text-align: center; color: var(--accent); padding: 20px;">
                <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
                <div style="font-weight: 700; margin-bottom: 10px;">خطا در بارگذاری اطلاعات</div>
                <div style="font-size: 0.9rem; color: var(--gray);">${error.message}</div>
            </div>
        `;
    }
}

// Display user info in UI
function displayUserInfo() {
    userInfoDiv.innerHTML = `
        <div class="info-item">
            <span class="info-label">👤 شناسه کاربری:</span>
            <span class="info-value">${userInfo.id || '0'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">🔼 شناسه آپلاین:</span>
            <span class="info-value">${userInfo.uplineId || '0'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">👈 تعداد چپ:</span>
            <span class="info-value">${userInfo.leftCount || '0'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">👉 تعداد راست:</span>
            <span class="info-value">${userInfo.rightCount || '0'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">💾 ذخیره چپ:</span>
            <span class="info-value">${userInfo.saveLeft || '0'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">💾 ذخیره راست:</span>
            <span class="info-value">${userInfo.saveRight || '0'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">⚖️ تعداد بالانس:</span>
            <span class="info-value">${userInfo.balanceCount || '0'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">🎯 بالانس ویژه:</span>
            <span class="info-value">${userInfo.specialBalanceCount || '0'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">⛏️ پاداش ماینر:</span>
            <span class="info-value">${userInfo.totalMinerRewards || '0'} MATIC</span>
        </div>
        <div class="info-item">
            <span class="info-label">💰 قیمت ورود:</span>
            <span class="info-value">${userInfo.entryPrice || '0'} MATIC</span>
        </div>
        <div class="info-item">
            <span class="info-label">🔧 وضعیت ماینر:</span>
            <span class="info-value">${userInfo.isMiner ? '✅ فعال' : '❌ غیرفعال'}</span>
        </div>
    `;
}

// Load binary tree
async function loadBinaryTree() {
    try {
        treeContainer.innerHTML = '<div class="loading">در حال بارگذاری شبکه هرمی زیرمجموعه</div>';
        
        if (!userInfo.id) {
            throw new Error('User info not loaded');
        }
        
        currentRootId = userInfo.id;
        const rootNode = await createBinaryNode(userInfo.id, true);
        
        if (rootNode) {
            renderPyramidTree(rootNode);
        } else {
            throw new Error('Failed to create root node');
        }
        
    } catch (error) {
        console.error('Error loading binary tree:', error);
        treeContainer.innerHTML = `
            <div style="text-align: center; color: var(--accent); padding: 40px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🌳</div>
                <div style="font-weight: 700; margin-bottom: 10px; font-size: 1.2rem;">خطا در بارگذاری درخت شبکه</div>
                <div style="color: var(--gray); margin-bottom: 20px;">${error.message}</div>
                <button onclick="loadBinaryTree()" class="btn-primary" style="padding: 10px 20px;">
                    🔄 تلاش مجدد
                </button>
            </div>
        `;
    }
}

// Create binary node with enhanced error handling
async function createBinaryNode(userId, isCurrentUser = false) {
    if (!userId || userId === 0) {
        return createEmptyNode(userId, isCurrentUser);
    }
    
    const cacheKey = `${userId}-${isCurrentUser}`;
    if (nodeCache.has(cacheKey)) {
        return nodeCache.get(cacheKey);
    }
    
    try {
        console.log(`Creating node for user ID: ${userId}`);
        
        // Get user info
        const userAddress = await getUserAddress(userId);
        const userInfoData = await contract.methods.getUserInfo(userAddress).call();
        
        // Get direct referrals
        const directs = await contract.methods.getUserDirects(userId).call();
        
        const node = {
            id: Number(userId),
            leftCount: Number(userInfoData.leftCount),
            rightCount: Number(userInfoData.rightCount),
            balanceCount: Number(userInfoData.balanceCount),
            saveLeft: Number(userInfoData.saveLeft),
            saveRight: Number(userInfoData.saveRight),
            isMiner: userInfoData.isMiner,
            leftId: Number(directs.leftId),
            rightId: Number(directs.rightId),
            isCurrentUser: isCurrentUser,
            hasLeftChild: Number(directs.leftId) > 0,
            hasRightChild: Number(directs.rightId) > 0,
            left: null,
            right: null,
            isExpanded: expandedNodes.has(Number(userId)),
            level: 0
        };
        
        // Load children if expanded
        if (node.isExpanded) {
            if (node.hasLeftChild) {
                node.left = await createBinaryNode(node.leftId);
                if (node.left) node.left.level = node.level + 1;
            }
            if (node.hasRightChild) {
                node.right = await createBinaryNode(node.rightId);
                if (node.right) node.right.level = node.level + 1;
            }
        }
        
        nodeCache.set(cacheKey, node);
        return node;
        
    } catch (error) {
        console.error(`Error creating node ${userId}:`, error);
        return createEmptyNode(userId, isCurrentUser);
    }
}

// Create empty node
function createEmptyNode(userId, isCurrentUser = false) {
    return {
        id: Number(userId),
        leftCount: 0,
        rightCount: 0,
        balanceCount: 0,
        saveLeft: 0,
        saveRight: 0,
        isMiner: false,
        leftId: 0,
        rightId: 0,
        isCurrentUser: isCurrentUser,
        hasLeftChild: false,
        hasRightChild: false,
        left: null,
        right: null,
        isExpanded: false,
        level: 0
    };
}

// Get user address by ID - استفاده از تابع جدید قرارداد
async function getUserAddress(userId) {
    try {
        if (userId === userInfo.id) {
            return userAccount;
        }
        
        // استفاده از تابع جدید برای گرفتن آدرس کاربر
        const specialUserInfo = await contract.methods._getSpecialUserInfoForMigrateToNewFork(userId).call();
        return specialUserInfo.userAddress;
        
    } catch (error) {
        console.log(`Could not get address for user ${userId}, using fallback`);
        // Fallback address
        return '0x0000000000000000000000000000000000000000';
    }
}

// Render pyramid tree (کدهای رندر مانند قبل باقی می‌مانند)
// [کدهای renderPyramidTree, createTreeLevel, createChildrenLevel, createTreeNode, 
//  createChildBranch, createEmptyBranch, createNodeHTML مانند قبل باقی می‌مانند]

// Toggle node expansion
async function toggleNodeExpansion(userId) {
    const numericUserId = Number(userId);
    if (expandedNodes.has(numericUserId)) {
        expandedNodes.delete(numericUserId);
    } else {
        expandedNodes.add(numericUserId);
    }
    
    clearNodeCache(numericUserId);
    await loadBinaryTree();
}

// Expand specific node
async function expandNode(userId) {
    expandedNodes.add(Number(userId));
    clearNodeCache(Number(userId));
    await loadBinaryTree();
}

// Clear node cache
function clearNodeCache(userId) {
    const keysToDelete = [];
    for (let key of nodeCache.keys()) {
        if (key.startsWith(`${userId}-`)) {
            keysToDelete.push(key);
        }
    }
    
    keysToDelete.forEach(key => nodeCache.delete(key));
}

// Utility function to show errors
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        font-weight: 600;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 5000);
}

// Listen for account changes
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
            // User disconnected wallet
            userAccount = null;
            userInfo = {};
            nodeCache.clear();
            expandedNodes.clear();
            
            connectWalletBtn.textContent = '🔗 اتصال کیف پول';
            connectWalletBtn.disabled = false;
            walletAddressSpan.textContent = 'اتصال برقرار نشده';
            userInfoDiv.innerHTML = '<p>لطفاً کیف پول خود را متصل کنید</p>';
            treeContainer.innerHTML = '<p>پس از اتصال کیف پول، شبکه شما اینجا نمایش داده می‌شود</p>';
            currentUserIdSpan.textContent = '-';
        } else {
            // Account changed
            userAccount = accounts[0];
            updateWalletUI();
            await loadUserInfo();
            await loadBinaryTree();
        }
    });
    
    // Listen for chain changes
    window.ethereum.on('chainChanged', (chainId) => {
        // Reload the page when network changes
        window.location.reload();
    });
}