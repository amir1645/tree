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
let expandedNodes = new Set();

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
                await loadBinaryTree();
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
        await loadBinaryTree();
        
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

// Load binary tree
async function loadBinaryTree() {
    treeContainer.innerHTML = '<div class="loading">در حال بارگذاری شبکه زیرمجموعه</div>';
    
    const rootNode = await createBinaryNode(userInfo.id, true);
    renderBinaryTree(rootNode);
}

// Create binary node
async function createBinaryNode(userId, isCurrentUser = false) {
    if (nodeCache.has(userId)) {
        return nodeCache.get(userId);
    }
    
    try {
        const userAddress = await getUserAddress(userId);
        const userInfoData = await contract.methods.getUserInfo(userAddress).call();
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
            right: null,
            isExpanded: expandedNodes.has(userId)
        };
        
        // Only load children if node is expanded
        if (node.isExpanded) {
            if (node.hasLeftChild) {
                node.left = await createBinaryNode(node.leftId);
            }
            if (node.hasRightChild) {
                node.right = await createBinaryNode(node.rightId);
            }
        }
        
        nodeCache.set(userId, node);
        return node;
        
    } catch (error) {
        console.log(`Error loading node ${userId}:`, error);
        return createEmptyNode(userId, isCurrentUser);
    }
}

// Create empty node
function createEmptyNode(userId, isCurrentUser = false) {
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
        right: null,
        isExpanded: false
    };
}

// Get user address by ID
async function getUserAddress(userId) {
    if (userId == userInfo.id) {
        return userAccount;
    }
    return '0x0000000000000000000000000000000000000000';
}

// Render binary tree
function renderBinaryTree(rootNode) {
    const treeElement = document.createElement('div');
    treeElement.className = 'binary-tree';
    
    // Render root level
    const rootLevel = document.createElement('div');
    rootLevel.className = 'tree-level';
    
    const rootTreeNode = document.createElement('div');
    rootTreeNode.className = 'tree-node';
    rootTreeNode.appendChild(createTreeNode(rootNode));
    rootLevel.appendChild(rootTreeNode);
    
    treeElement.appendChild(rootLevel);
    
    // Render children if root has any
    if (rootNode.hasLeftChild || rootNode.hasRightChild) {
        const childrenLevel = document.createElement('div');
        childrenLevel.className = 'tree-level';
        
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'node-children';
        
        if (rootNode.hasLeftChild) {
            const leftChild = createChildNode('left', rootNode.leftId, rootNode.isExpanded && rootNode.left);
            childrenContainer.appendChild(leftChild);
        }
        
        if (rootNode.hasRightChild) {
            const rightChild = createChildNode('right', rootNode.rightId, rootNode.isExpanded && rootNode.right);
            childrenContainer.appendChild(rightChild);
        }
        
        childrenLevel.appendChild(childrenContainer);
        treeElement.appendChild(childrenLevel);
    }
    
    treeContainer.innerHTML = '';
    treeContainer.appendChild(treeElement);
}

// Create tree node
function createTreeNode(node) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'tree-node';
    
    const nodeContent = document.createElement('div');
    nodeContent.className = `node-content ${node.isCurrentUser ? 'current-user' : ''}`;
    nodeContent.innerHTML = createNodeHTML(node);
    
    // Add click event to toggle expansion
    if (node.hasLeftChild || node.hasRightChild) {
        nodeContent.style.cursor = 'pointer';
        nodeContent.addEventListener('click', async (e) => {
            e.stopPropagation();
            await toggleNodeExpansion(node.id);
        });
    }
    
    nodeElement.appendChild(nodeContent);
    
    // Add connector for non-root nodes
    if (!node.isCurrentUser) {
        const connector = document.createElement('div');
        connector.className = 'connector vertical';
        nodeElement.appendChild(connector);
    }
    
    return nodeElement;
}

// Create child node
function createChildNode(side, childId, childNode = null) {
    const childElement = document.createElement('div');
    childElement.className = 'child-node';
    
    // Add horizontal connector
    const horizontalConnector = document.createElement('div');
    horizontalConnector.className = `connector horizontal-${side}`;
    childElement.appendChild(horizontalConnector);
    
    // Add vertical connector
    const verticalConnector = document.createElement('div');
    verticalConnector.className = 'connector vertical';
    childElement.appendChild(verticalConnector);
    
    // Add label
    const label = document.createElement('div');
    label.className = 'child-label';
    label.textContent = side === 'left' ? '👈 چپ' : '👉 راست';
    childElement.appendChild(label);
    
    // Add node content
    if (childNode) {
        childElement.appendChild(createTreeNode(childNode));
        
        // Recursively render grandchildren if expanded
        if (childNode.isExpanded && (childNode.hasLeftChild || childNode.hasRightChild)) {
            const grandChildrenLevel = document.createElement('div');
            grandChildrenLevel.className = 'tree-level';
            
            const grandChildrenContainer = document.createElement('div');
            grandChildrenContainer.className = 'node-children';
            
            if (childNode.hasLeftChild) {
                const leftGrandChild = createChildNode('left', childNode.leftId, childNode.left);
                grandChildrenContainer.appendChild(leftGrandChild);
            }
            
            if (childNode.hasRightChild) {
                const rightGrandChild = createChildNode('right', childNode.rightId, childNode.right);
                grandChildrenContainer.appendChild(rightGrandChild);
            }
            
            grandChildrenLevel.appendChild(grandChildrenContainer);
            childElement.appendChild(grandChildrenLevel);
        }
    } else {
        const placeholderContent = document.createElement('div');
        placeholderContent.className = 'node-content';
        placeholderContent.innerHTML = `
            <div class="node-id">${childId}</div>
            <div class="node-stats">
                <div class="stat-row">
                    <span class="stat-label">وضعیت:</span>
                    <span class="stat-value">کلیک برای نمایش</span>
                </div>
            </div>
        `;
        
        placeholderContent.addEventListener('click', async (e) => {
            e.stopPropagation();
            await expandNode(childId, childElement);
        });
        
        childElement.appendChild(placeholderContent);
    }
    
    return childElement;
}

// Toggle node expansion
async function toggleNodeExpansion(userId) {
    if (expandedNodes.has(userId)) {
        expandedNodes.delete(userId);
    } else {
        expandedNodes.add(userId);
    }
    
    await loadBinaryTree();
}

// Expand node
async function expandNode(userId, parentElement) {
    if (expandedNodes.has(userId)) {
        expandedNodes.delete(userId);
    } else {
        expandedNodes.add(userId);
    }
    
    await loadBinaryTree();
}

// Create node HTML content
function createNodeHTML(node) {
    return `
        <div class="node-id">
            ${node.id} 
            ${node.isCurrentUser ? '👤' : ''} 
            ${node.isMiner ? '⛏️' : ''}
        </div>
        <div class="node-stats">
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
                `<div class="stat-row">
                    <span class="stat-label">وضعیت:</span>
                    <span class="stat-value ${node.isExpanded ? 'balance' : ''}">
                        ${node.isExpanded ? 'باز' : 'بسته'}
                    </span>
                </div>` : 
                '<div class="stat-row"><span class="stat-label">زیرمجموعه:</span><span class="stat-value">❌ ندارد</span></div>'
            }
        </div>
    `;
}