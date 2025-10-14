// Contract ABI
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
let nodeCache = new Map();

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
                await loadInitialTree();
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
        await loadInitialTree();
        
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
            id: result.id,
            uplineId: result.uplineId,
            leftCount: result.leftCount,
            rightCount: result.rightCount,
            saveLeft: result.saveLeft,
            saveRight: result.saveRight,
            balanceCount: result.balanceCount,
            specialBalanceCount: result.specialBalanceCount,
            totalMinerRewards: web3.utils.fromWei(result.totalMinerRewards, 'ether'),
            entryPrice: web3.utils.fromWei(result.entryPrice, 'ether'),
            isMiner: result.isMiner
        };
        
        displayUserInfo();
        currentUserIdSpan.textContent = userInfo.id;
        
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

// Load initial tree
async function loadInitialTree() {
    treeContainer.innerHTML = '<div class="loading">در حال بارگذاری شبکه زیرمجموعه</div>';
    
    const rootNode = await createNode(userInfo.id, true);
    renderTree(rootNode);
}

// Create node with complete info
async function createNode(userId, isCurrentUser = false) {
    // Check cache first
    if (nodeCache.has(userId)) {
        return nodeCache.get(userId);
    }
    
    try {
        // Get user info from contract
        const userAddress = await getUserAddress(userId);
        const userInfoData = await contract.methods.getUserInfo(userAddress).call();
        
        // Get direct children
        const directs = await contract.methods.getUserDirects(userId).call();
        
        const node = {
            id: userId,
            leftCount: userInfoData.leftCount,
            rightCount: userInfoData.rightCount,
            balanceCount: userInfoData.balanceCount,
            saveLeft: userInfoData.saveLeft,
            saveRight: userInfoData.saveRight,
            isMiner: userInfoData.isMiner,
            leftId: directs.leftId,
            rightId: directs.rightId,
            isCurrentUser: isCurrentUser,
            hasLeftChild: directs.leftId > 0,
            hasRightChild: directs.rightId > 0,
            left: null,
            right: null
        };
        
        // Cache the node
        nodeCache.set(userId, node);
        
        return node;
        
    } catch (error) {
        console.log(`Error loading node ${userId}:`, error);
        return {
            id: userId,
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
            right: null
        };
    }
}

// Get user address by ID
async function getUserAddress(userId) {
    if (userId == userInfo.id) {
        return userAccount;
    }
    
    // For other users, we need to find their address
    // This is a simplified approach - in production you might need a different method
    try {
        // Try to get address from special function if available
        // If not, return a placeholder (this might need adjustment based on your contract)
        return '0x0000000000000000000000000000000000000000';
    } catch (error) {
        return '0x0000000000000000000000000000000000000000';
    }
}

// Render tree
function renderTree(rootNode) {
    const genealogyElement = document.createElement('div');
    genealogyElement.className = 'genealogy';
    
    // Root level
    const rootLevel = document.createElement('div');
    rootLevel.className = 'level';
    rootLevel.appendChild(createNodeElement(rootNode));
    genealogyElement.appendChild(rootLevel);
    
    // Direct children
    if (rootNode.hasLeftChild || rootNode.hasRightChild) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'children-container';
        
        if (rootNode.hasLeftChild) {
            const leftBranch = createChildBranch('چپ', rootNode.leftId);
            childrenContainer.appendChild(leftBranch);
        }
        
        if (rootNode.hasRightChild) {
            const rightBranch = createChildBranch('راست', rootNode.rightId);
            childrenContainer.appendChild(rightBranch);
        }
        
        genealogyElement.appendChild(childrenContainer);
    }
    
    treeContainer.innerHTML = '';
    treeContainer.appendChild(genealogyElement);
}

// Create child branch
function createChildBranch(side, childId) {
    const branch = document.createElement('div');
    branch.className = 'child-branch';
    
    const label = document.createElement('div');
    label.className = 'child-label';
    label.textContent = side === 'چپ' ? '👈 شاخه چپ' : '👉 شاخه راست';
    branch.appendChild(label);
    
    const nodeElement = document.createElement('div');
    nodeElement.className = 'member-node';
    nodeElement.innerHTML = `
        <div class="member-id">${childId}</div>
        <div class="member-stats">
            <div class="stat-row">
                <span class="stat-label">وضعیت:</span>
                <span class="stat-value">کلیک برای نمایش</span>
            </div>
        </div>
    `;
    
    nodeElement.addEventListener('click', async () => {
        await expandNode(childId, branch);
    });
    
    branch.appendChild(nodeElement);
    
    return branch;
}

// Expand node
async function expandNode(userId, parentElement) {
    const node = await createNode(userId);
    
    // Remove existing children
    const existingChildren = parentElement.querySelector('.children-container');
    if (existingChildren) {
        existingChildren.remove();
    }
    
    // Update the node element with complete info
    const nodeElement = parentElement.querySelector('.member-node');
    nodeElement.innerHTML = createNodeHTML(node);
    nodeElement.classList.add('has-children');
    
    if (node.hasLeftChild || node.hasRightChild) {
        nodeElement.addEventListener('click', async (e) => {
            e.stopPropagation();
            await expandNode(userId, parentElement);
        });
    }
    
    // Add new children if any
    if (node.hasLeftChild || node.hasRightChild) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'children-container';
        
        if (node.hasLeftChild) {
            const leftBranch = createChildBranch('چپ', node.leftId);
            childrenContainer.appendChild(leftBranch);
        }
        
        if (node.hasRightChild) {
            const rightBranch = createChildBranch('راست', node.rightId);
            childrenContainer.appendChild(rightBranch);
        }
        
        parentElement.appendChild(childrenContainer);
    }
}

// Create node element
function createNodeElement(node) {
    const element = document.createElement('div');
    const classes = ['member-node'];
    
    if (node.isCurrentUser) classes.push('current-user');
    if (node.hasLeftChild || node.hasRightChild) classes.push('has-children');
    
    element.className = classes.join(' ');
    element.innerHTML = createNodeHTML(node);
    
    if (node.hasLeftChild || node.hasRightChild) {
        element.addEventListener('click', async (e) => {
            e.stopPropagation();
            // For root node, we don't need to do anything as children are already shown
        });
    }
    
    return element;
}

// Create node HTML content
function createNodeHTML(node) {
    return `
        <div class="member-id">
            ${node.id} 
            ${node.isCurrentUser ? '👤' : ''} 
            ${node.isMiner ? '⛏️' : ''}
        </div>
        <div class="member-stats">
            <div class="stat-row">
                <span class="stat-label">تعداد چپ:</span>
                <span class="stat-value left">${node.leftCount}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">تعداد راست:</span>
                <span class="stat-value right">${node.rightCount}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">ذخیره چپ:</span>
                <span class="stat-value">${node.saveLeft}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">ذخیره راست:</span>
                <span class="stat-value">${node.saveRight}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">بالانس:</span>
                <span class="stat-value balance">${node.balanceCount}</span>
            </div>
            ${node.hasLeftChild || node.hasRightChild ? 
                '<div class="stat-row"><span class="stat-label">زیرمجموعه:</span><span class="stat-value">✅ دارد</span></div>' : 
                '<div class="stat-row"><span class="stat-label">زیرمجموعه:</span><span class="stat-value">❌ ندارد</span></div>'
            }
        </div>
    `;
}