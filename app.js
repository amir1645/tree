// Binary Tree Pyramid Implementation - کاملاً بازنویسی شده

// Global variables for tree management
let nodeCache = new Map();
let expandedNodes = new Set();
let currentRootId = null;

// Load binary tree with pyramid layout
async function loadBinaryTree() {
    treeContainer.innerHTML = '<div class="loading">در حال بارگذاری شبکه هرمی زیرمجموعه</div>';
    
    if (!userInfo.id) {
        treeContainer.innerHTML = '<p>لطفاً ابتدا کیف پول خود را متصل کنید</p>';
        return;
    }
    
    currentRootId = userInfo.id;
    const rootNode = await createBinaryNode(userInfo.id, true);
    renderPyramidTree(rootNode);
}

// Create binary node with enhanced data
async function createBinaryNode(userId, isCurrentUser = false) {
    if (nodeCache.has(userId)) {
        return nodeCache.get(userId);
    }
    
    // اگر کاربر وجود ندارد، یک نود خالی برگردان
    if (userId == 0) {
        return createEmptyNode(userId, isCurrentUser);
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
            isExpanded: expandedNodes.has(userId),
            level: 0 // برای نمایش سطح در هرم
        };
        
        // فقط اگر نود expand شده باشد، فرزندان را بارگذاری کن
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
        isExpanded: false,
        level: 0
    };
}

// Render pyramid tree
function renderPyramidTree(rootNode) {
    const treeElement = document.createElement('div');
    treeElement.className = 'pyramid-tree';
    
    // رندر ریشه
    const rootLevel = createTreeLevel([rootNode], 0);
    treeElement.appendChild(rootLevel);
    
    // رندر فرزندان اگر expand شده باشند
    if (rootNode.isExpanded && (rootNode.hasLeftChild || rootNode.hasRightChild)) {
        const childrenLevel = createChildrenLevel(rootNode, 1);
        treeElement.appendChild(childrenLevel);
    }
    
    treeContainer.innerHTML = '';
    treeContainer.appendChild(treeElement);
}

// Create tree level
function createTreeLevel(nodes, level) {
    const levelElement = document.createElement('div');
    levelElement.className = 'pyramid-level';
    
    // افزودن نشانگر سطح
    const levelIndicator = document.createElement('div');
    levelIndicator.className = 'level-indicator';
    levelIndicator.textContent = `سطح ${level}`;
    levelElement.appendChild(levelIndicator);
    
    nodes.forEach(node => {
        if (node && node.id > 0) {
            const nodeElement = createTreeNode(node);
            levelElement.appendChild(nodeElement);
        }
    });
    
    return levelElement;
}

// Create children level
function createChildrenLevel(parentNode, level) {
    const childrenLevel = document.createElement('div');
    childrenLevel.className = 'pyramid-level';
    
    // افزودن نشانگر سطح
    const levelIndicator = document.createElement('div');
    levelIndicator.className = 'level-indicator';
    levelIndicator.textContent = `سطح ${level}`;
    childrenLevel.appendChild(levelIndicator);
    
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'node-children';
    
    // شاخه چپ
    if (parentNode.hasLeftChild) {
        const leftBranch = createChildBranch('left', parentNode.leftId, parentNode.left);
        childrenContainer.appendChild(leftBranch);
    } else {
        const emptyLeftBranch = createEmptyBranch('left');
        childrenContainer.appendChild(emptyLeftBranch);
    }
    
    // شاخه راست
    if (parentNode.hasRightChild) {
        const rightBranch = createChildBranch('right', parentNode.rightId, parentNode.right);
        childrenContainer.appendChild(rightBranch);
    } else {
        const emptyRightBranch = createEmptyBranch('right');
        childrenContainer.appendChild(emptyRightBranch);
    }
    
    childrenLevel.appendChild(childrenContainer);
    return childrenLevel;
}

// Create tree node
function createTreeNode(node) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'tree-node';
    
    const nodeBox = document.createElement('div');
    nodeBox.className = `node-box ${node.isCurrentUser ? 'current-user' : ''} ${node.isExpanded ? 'expanded' : ''} new-node`;
    nodeBox.innerHTML = createNodeHTML(node);
    
    // افزودن connector برای نودهای غیرریشه
    if (!node.isCurrentUser) {
        const connector = document.createElement('div');
        connector.className = 'connector vertical';
        nodeElement.appendChild(connector);
    }
    
    // رویداد کلیک برای expand/collapse
    if (node.hasLeftChild || node.hasRightChild) {
        nodeBox.addEventListener('click', async (e) => {
            e.stopPropagation();
            await toggleNodeExpansion(node.id);
        });
    }
    
    nodeElement.appendChild(nodeBox);
    return nodeElement;
}

// Create child branch
function createChildBranch(side, childId, childNode = null) {
    const branchElement = document.createElement('div');
    branchElement.className = 'child-branch';
    
    // افزودن connector افقی
    const horizontalConnector = document.createElement('div');
    horizontalConnector.className = `connector horizontal-${side}`;
    branchElement.appendChild(horizontalConnector);
    
    // افزودن connector عمودی
    const verticalConnector = document.createElement('div');
    verticalConnector.className = 'connector vertical';
    branchElement.appendChild(verticalConnector);
    
    // افزودن برچسب شاخه
    const branchLabel = document.createElement('div');
    branchLabel.className = 'branch-label';
    branchLabel.textContent = side === 'left' ? '👈 شاخه چپ' : '👉 شاخه راست';
    branchElement.appendChild(branchLabel);
    
    // افزودن نود فرزند
    if (childNode) {
        branchElement.appendChild(createTreeNode(childNode));
        
        // رندر فرزندان اگر expand شده باشند
        if (childNode.isExpanded && (childNode.hasLeftChild || childNode.hasRightChild)) {
            const grandChildrenLevel = createChildrenLevel(childNode, childNode.level + 1);
            branchElement.appendChild(grandChildrenLevel);
        }
    } else {
        const placeholderBox = document.createElement('div');
        placeholderBox.className = 'empty-node';
        placeholderBox.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 10px;">👤</div>
            <div style="font-weight: 700; margin-bottom: 5px;">${childId}</div>
            <div style="font-size: 0.8rem; color: var(--gray);">کلیک برای بارگذاری</div>
        `;
        
        placeholderBox.addEventListener('click', async (e) => {
            e.stopPropagation();
            await expandNode(childId);
        });
        
        branchElement.appendChild(placeholderBox);
    }
    
    return branchElement;
}

// Create empty branch
function createEmptyBranch(side) {
    const branchElement = document.createElement('div');
    branchElement.className = 'child-branch';
    
    const emptyBox = document.createElement('div');
    emptyBox.className = 'empty-node';
    emptyBox.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 10px;">⚡</div>
        <div style="font-weight: 700;">${side === 'left' ? 'چپ' : 'راست'}</div>
        <div style="font-size: 0.8rem; color: var(--gray); margin-top: 5px;">خالی</div>
    `;
    
    branchElement.appendChild(emptyBox);
    return branchElement;
}

// Create node HTML content - کاملاً بازطراحی شده
function createNodeHTML(node) {
    const badges = [];
    if (node.isCurrentUser) badges.push('<span class="badge current">کاربر فعلی</span>');
    if (node.isMiner) badges.push('<span class="badge miner">⛏️ ماینر</span>');
    
    return `
        <div class="node-header">
            <div class="node-id">${node.id}</div>
            <div class="node-badges">${badges.join('')}</div>
        </div>
        
        <div class="node-stats-grid">
            <div class="stat-card left">
                <span class="stat-value">${node.leftCount}</span>
                <span class="stat-label">زیرمجموعه چپ</span>
            </div>
            <div class="stat-card right">
                <span class="stat-value">${node.rightCount}</span>
                <span class="stat-label">زیرمجموعه راست</span>
            </div>
            <div class="stat-card balance">
                <span class="stat-value">${node.balanceCount}</span>
                <span class="stat-label">تعداد بالانس</span>
            </div>
        </div>
        
        <div class="node-actions">
            <div class="children-count">
                ${node.hasLeftChild || node.hasRightChild ? 
                    `فرزندان: ${(node.hasLeftChild ? 1 : 0) + (node.hasRightChild ? 1 : 0)}` : 
                    'بدون فرزند'
                }
            </div>
            ${node.hasLeftChild || node.hasRightChild ? 
                `<button class="expand-btn">
                    ${node.isExpanded ? 'بستن ▼' : 'باز کردن ▲'}
                </button>` : 
                '<div style="width: 80px;"></div>'
            }
        </div>
    `;
}

// Toggle node expansion
async function toggleNodeExpansion(userId) {
    if (expandedNodes.has(userId)) {
        expandedNodes.delete(userId);
    } else {
        expandedNodes.add(userId);
    }
    
    // پاک کردن cache برای نود مورد نظر و فرزندانش
    clearNodeCache(userId);
    await loadBinaryTree();
}

// Expand specific node
async function expandNode(userId) {
    expandedNodes.add(userId);
    clearNodeCache(userId);
    await loadBinaryTree();
}

// Clear node cache
function clearNodeCache(userId) {
    nodeCache.delete(userId);
    // همچنین cache فرزندان این نود را هم پاک کنید
    Array.from(nodeCache.keys()).forEach(key => {
        if (key.toString().startsWith(userId.toString() + '-')) {
            nodeCache.delete(key);
        }
    });
}

// اضافه کردن توابع utility
function getNodeLevel(nodeId) {
    // محاسبه سطح نود در درخت
    return Math.floor(Math.log2(nodeId));
}

function shouldDisplayNode(node, maxLevel = 5) {
    // تعیین کنید که آیا نود باید نمایش داده شود یا خیر
    return node.level <= maxLevel;
}