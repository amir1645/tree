// Contract ABI (همان ABI کامل)
const CONTRACT_ABI = [ /* ABI کامل اینجا قرار بگیرد */ ];

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
                await loadFullTree();
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
        await loadFullTree();
        
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

// Load full tree automatically
async function loadFullTree() {
    treeContainer.innerHTML = '<div class="loading">در حال بارگذاری کل شبکه زیرمجموعه</div>';
    
    if (!userInfo.id) {
        treeContainer.innerHTML = '<p>لطفاً ابتدا کیف پول خود را متصل کنید</p>';
        return;
    }
    
    const rootNode = await createTreeNode(userInfo.id, true);
    renderTree(rootNode);
}

// Create tree node recursively
async function createTreeNode(userId, isCurrentUser = false) {
    if (!userId || userId === 0) {
        return null;
    }
    
    try {
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
        
        // Recursively load children (up to 3 levels deep)
        if (node.leftId > 0) {
            node.left = await createTreeNode(node.leftId);
        }
        
        if (node.rightId > 0) {
            node.right = await createTreeNode(node.rightId);
        }
        
        return node;
        
    } catch (error) {
        console.log(`Error loading node ${userId}:`, error);
        return null;
    }
}

// Get user address
async function getUserAddress(userId) {
    if (userId === userInfo.id) {
        return userAccount;
    }
    
    try {
        const specialUserInfo = await contract.methods._getSpecialUserInfoForMigrateToNewFork(userId).call();
        return specialUserInfo.userAddress;
    } catch (error) {
        return '0x0000000000000000000000000000000000000000';
    }
}

// Render tree
function renderTree(rootNode) {
    if (!rootNode) {
        treeContainer.innerHTML = '<p>خطا در بارگذاری درخت</p>';
        return;
    }
    
    const treeElement = document.createElement('div');
    treeElement.className = 'binary-tree';
    
    // Render root level
    const rootLevel = document.createElement('div');
    rootLevel.className = 'tree-level';
    rootLevel.appendChild(createNodeElement(rootNode));
    treeElement.appendChild(rootLevel);
    
    // Render children if they exist
    if (rootNode.left || rootNode.right) {
        const childrenLevel = document.createElement('div');
        childrenLevel.className = 'tree-level';
        
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'node-children';
        
        if (rootNode.left) {
            const leftBranch = createChildBranch('left', rootNode.left);
            childrenContainer.appendChild(leftBranch);
        }
        
        if (rootNode.right) {
            const rightBranch = createChildBranch('right', rootNode.right);
            childrenContainer.appendChild(rightBranch);
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