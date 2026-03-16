<template>
    <div class="ai-chat-container">
        <!-- 悬浮按钮 -->
        <button v-if="!isOpen" class="chat-button" @click="openChat" @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false">
            <div class="pet-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm7 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
                </svg>
                <div class="chat-bubble">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                        <path
                            d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                    </svg>
                </div>
            </div>
            <!-- 提示 tooltip -->
            <div v-if="showTooltip" class="chat-tooltip">
                AI 寄养顾问，解答你的所有问题
            </div>
        </button>

        <!-- 小屏对话框 -->
        <div v-else-if="!isFullscreen" class="chat-dialog" @click.stop>
            <!-- 对话框头部 -->
            <div class="chat-header">
                <div class="chat-header-left">
                    <div class="ai-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5-1c-1.1 0-2 .9-2 2v4h4V3H7zm10 0v4h4V3c0-1.1-.9-2-2-2h-2zM7 11H3v10c0 1.1.9 2 2 2h4v-4H7v-8zm10 0v8h4c1.1 0 2-.9 2-2V11h-4zm-4 8h-4v4h4v-4z" />
                        </svg>
                    </div>
                    <div class="chat-title">
                        <h3>AI 寄养顾问</h3>
                        <p class="chat-subtitle">随时为你解答寄养相关问题</p>
                    </div>
                </div>
                <div class="chat-header-right">
                    <button class="header-button" @click="toggleFullscreen">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                        </svg>
                    </button>
                    <button class="close-button" @click="closeChat">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 聊天内容区 -->
            <div class="chat-content">
                <!-- AI 欢迎消息 -->
                <div class="message ai-message">
                    <div class="message-bubble">
                        <p>你好！我是PetGo的AI寄养顾问，有什么可以帮到你的吗？</p>
                    </div>
                </div>

                <!-- 用户消息示例 -->
                <div class="message user-message">
                    <div class="message-bubble">
                        <p>寄养服务怎么收费？</p>
                    </div>
                </div>

                <!-- AI 回复示例 -->
                <div class="message ai-message">
                    <div class="message-bubble">
                        <p>寄养服务的收费根据宠物类型、寄养天数和服务内容不同而有所差异。一般来说，小型犬猫每天约50-100元，大型犬每天约100-200元。具体价格可以在寄养家庭详情页查看。</p>
                    </div>
                </div>

                <!-- 模拟正在输入状态 -->
                <div v-if="isTyping" class="message ai-message">
                    <div class="message-bubble typing">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 常见问题快捷按钮 -->
            <div class="quick-questions">
                <button class="quick-question-btn" @click="sendQuickQuestion('寄养价格')">寄养价格</button>
                <button class="quick-question-btn" @click="sendQuickQuestion('宠物饮食要求')">宠物饮食要求</button>
                <button class="quick-question-btn" @click="sendQuickQuestion('退订规则')">退订规则</button>
                <button class="quick-question-btn" @click="sendQuickQuestion('寄养环境')">寄养环境</button>
                <button class="quick-question-btn" @click="sendQuickQuestion('宠物安全')">宠物安全</button>
            </div>

            <!-- 输入区域 -->
            <div class="chat-input-area">
                <input type="text" class="chat-input" placeholder="输入你的问题..." v-model="messageInput"
                    @keyup.enter="sendMessage" />
                <button class="send-button" @click="sendMessage" :disabled="!messageInput.trim()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- 全屏对话框 -->
        <div v-else class="fullscreen-dialog" @click.stop>
            <!-- 全屏头部 -->
            <div class="fullscreen-header">
                <div class="fullscreen-logo">
                    <div class="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-10 h-10">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                    </div>
                    <div class="logo-text">
                        <h1>PetGo AI</h1>
                        <span>智能寄养顾问</span>
                    </div>
                </div>
                <div class="fullscreen-actions">
                    <button class="action-btn toggle-sidebar-btn" @click="toggleSidebar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                        </svg>
                        <span>{{ isSidebarOpen ? '收起' : '展开' }}</span>
                    </button>
                    <button class="action-btn minimize-btn" @click="toggleFullscreen">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                        </svg>
                        <span>小屏</span>
                    </button>
                    <button class="action-btn close-btn" @click="closeChat">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 全屏主内容区 -->
            <div class="fullscreen-main">
                <!-- 左侧面板 -->
                <div class="fullscreen-sidebar" :class="{ 'sidebar-closed': !isSidebarOpen }">
                    <!-- 左侧内容 -->
                    <div class="sidebar-content">
                        <!-- 新对话按钮 -->
                        <button class="new-chat-btn" @click="createNewChat">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-5 h-5">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            <span>新对话</span>
                        </button>

                        <!-- 历史对话列表 -->
                        <div class="chat-history">
                            <h3 class="history-title">历史对话</h3>
                            <div class="history-list">
                                <div class="history-item active">
                                    <div class="history-icon">💬</div>
                                    <div class="history-content">
                                        <div class="history-title-text">寄养服务咨询</div>
                                        <div class="history-preview">寄养服务怎么收费？</div>
                                        <div class="history-time">今天 14:30</div>
                                    </div>
                                    <button class="history-delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                            class="w-4 h-4">
                                            <path
                                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                        </svg>
                                    </button>
                                </div>
                                <div class="history-item">
                                    <div class="history-icon">🏠</div>
                                    <div class="history-content">
                                        <div class="history-title-text">寄养环境了解</div>
                                        <div class="history-preview">寄养环境怎么样？</div>
                                        <div class="history-time">昨天 10:15</div>
                                    </div>
                                    <button class="history-delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                            class="w-4 h-4">
                                            <path
                                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                        </svg>
                                    </button>
                                </div>
                                <div class="history-item">
                                    <div class="history-icon">🐾</div>
                                    <div class="history-content">
                                        <div class="history-title-text">宠物饮食要求</div>
                                        <div class="history-preview">宠物饮食有什么要求？</div>
                                        <div class="history-time">昨天 09:45</div>
                                    </div>
                                    <button class="history-delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                            class="w-4 h-4">
                                            <path
                                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 欢迎区 -->

                    </div>
                </div>

                <!-- 右侧聊天区 -->
                <div class="fullscreen-chat" :class="{ 'chat-expanded': !isSidebarOpen }">
                    <!-- 聊天消息区 -->
                    <div class="fullscreen-chat-content">
                        <!-- AI 欢迎消息 -->
                        <div class="message ai-message">
                            <div class="message-avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-6 h-6">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                </svg>
                            </div>
                            <div class="message-bubble">
                                <p>你好！我是PetGo的AI寄养顾问，有什么可以帮到你的吗？</p>
                            </div>
                        </div>

                        <!-- 用户消息示例 -->
                        <div class="message user-message">
                            <div class="message-bubble">
                                <p>寄养服务怎么收费？</p>
                            </div>
                        </div>

                        <!-- AI 回复示例 -->
                        <div class="message ai-message">
                            <div class="message-avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-6 h-6">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                </svg>
                            </div>
                            <div class="message-bubble">
                                <p>寄养服务的收费根据宠物类型、寄养天数和服务内容不同而有所差异。一般来说，小型犬猫每天约50-100元，大型犬每天约100-200元。具体价格可以在寄养家庭详情页查看。
                                </p>
                            </div>
                        </div>

                        <!-- 模拟正在输入状态 -->
                        <div v-if="isTyping" class="message ai-message">
                            <div class="message-avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-6 h-6">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                </svg>
                            </div>
                            <div class="message-bubble typing">
                                <div class="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 快捷问题区 -->
                    <div class="fullscreen-quick-questions">
                        <p class="quick-title">你可以问我：</p>
                        <div class="quick-buttons">
                            <button class="quick-btn" @click="sendQuickQuestion('寄养价格是多少？')">
                                <span class="btn-icon">💰</span>
                                <span>寄养价格</span>
                            </button>
                            <button class="quick-btn" @click="sendQuickQuestion('宠物饮食有什么要求？')">
                                <span class="btn-icon">🍖</span>
                                <span>饮食要求</span>
                            </button>
                            <button class="quick-btn" @click="sendQuickQuestion('退订规则是什么？')">
                                <span class="btn-icon">📝</span>
                                <span>退订规则</span>
                            </button>
                            <button class="quick-btn" @click="sendQuickQuestion('寄养环境怎么样？')">
                                <span class="btn-icon">🏠</span>
                                <span>寄养环境</span>
                            </button>
                            <button class="quick-btn" @click="sendQuickQuestion('宠物安全如何保障？')">
                                <span class="btn-icon">🛡️</span>
                                <span>安全保障</span>
                            </button>
                            <button class="quick-btn" @click="sendQuickQuestion('如何预订寄养服务？')">
                                <span class="btn-icon">📅</span>
                                <span>预订流程</span>
                            </button>
                        </div>
                    </div>

                    <!-- 输入区域 -->
                    <div class="fullscreen-input-area">
                        <div class="input-wrapper">
                            <input type="text" class="fullscreen-input" placeholder="输入你的问题，PetGo AI 为你解答..."
                                v-model="messageInput" @keyup.enter="sendMessage" />
                            <button class="fullscreen-send-btn" @click="sendMessage" :disabled="!messageInput.trim()">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-6 h-6">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                                <span>发送</span>
                            </button>
                        </div>
                        <p class="input-tip">PetGo AI 生成的内容仅供参考</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 状态管理
const isOpen = ref(false)
const isFullscreen = ref(false)
const showTooltip = ref(false)
const messageInput = ref('')
const isTyping = ref(false)
const isSidebarOpen = ref(true)

// 打开聊天
const openChat = () => {
    isOpen.value = true
}

// 关闭聊天
const closeChat = () => {
    isOpen.value = false
    isFullscreen.value = false
    isSidebarOpen.value = true
}

// 切换全屏
const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
}

// 切换侧边栏
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

// 创建新对话
const createNewChat = () => {
    console.log('创建新对话')
    // 这里可以添加创建新对话的逻辑
}

// 发送消息
const sendMessage = () => {
    if (messageInput.value.trim()) {
        console.log('发送消息:', messageInput.value)
        messageInput.value = ''
        simulateTyping()
    }
}

// 模拟AI正在输入
const simulateTyping = () => {
    isTyping.value = true
    setTimeout(() => {
        isTyping.value = false
        console.log('AI回复')
    }, 2000)
}

// 发送快捷问题
const sendQuickQuestion = (question: string) => {
    messageInput.value = question
    sendMessage()
}
</script>

<style scoped lang="scss">
.ai-chat-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
}

/* 悬浮按钮样式 */
.chat-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border: none;
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 6px 24px rgba(249, 115, 22, 0.5);
    }

    &:active {
        animation: shake 0.3s ease;
    }

    .pet-icon {
        position: relative;
        color: white;

        .chat-bubble {
            position: absolute;
            top: -8px;
            right: -8px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
    }

    .chat-tooltip {
        position: absolute;
        bottom: 100%;
        right: 0;
        background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
        color: white;
        padding: 10px 16px;
        border-radius: 12px;
        font-size: 13px;
        white-space: nowrap;
        margin-bottom: 12px;
        z-index: 1001;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: tooltipFadeIn 0.2s ease;

        &::after {
            content: '';
            position: absolute;
            top: 100%;
            right: 20px;
            border-width: 8px;
            border-style: solid;
            border-color: #374151 transparent transparent transparent;
        }
    }
}

/* 小屏对话框样式 */
.chat-dialog {
    width: 400px;
    max-width: 90vw;
    height: 520px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    animation: dialogFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    @media (max-width: 768px) {
        width: 90vw;
        height: 70vh;
        position: fixed;
        bottom: 20px;
        right: 5vw;
    }
}

/* 对话框头部 */
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;

    .chat-header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .ai-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        }

        .chat-title {
            h3 {
                font-size: 16px;
                font-weight: 600;
                margin: 0;
            }

            .chat-subtitle {
                font-size: 12px;
                opacity: 0.9;
                margin: 2px 0 0 0;
            }
        }
    }

    .chat-header-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .header-button,
    .close-button {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        cursor: pointer;
        color: white;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
        }
    }
}

/* 聊天内容区 */
.chat-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #f8fafc;

    .message {
        max-width: 85%;

        &.ai-message {
            align-self: flex-start;

            .message-bubble {
                background: white;
                border-radius: 18px 18px 18px 4px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            }
        }

        &.user-message {
            align-self: flex-end;

            .message-bubble {
                background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                color: white;
                border-radius: 18px 18px 4px 18px;
            }
        }

        .message-bubble {
            padding: 14px 18px;
            font-size: 14px;
            line-height: 1.6;

            &.typing {
                min-width: 80px;
                padding: 18px;

                .typing-indicator {
                    display: flex;
                    gap: 6px;

                    span {
                        width: 10px;
                        height: 10px;
                        background: #cbd5e1;
                        border-radius: 50%;
                        animation: typing 1.4s ease-in-out infinite both;

                        &:nth-child(1) {
                            animation-delay: -0.32s;
                        }

                        &:nth-child(2) {
                            animation-delay: -0.16s;
                        }
                    }
                }
            }
        }
    }
}

/* 常见问题快捷按钮 */
.quick-questions {
    padding: 16px 20px;
    background: white;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    .quick-question-btn {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 13px;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            background: #f97316;
            color: white;
            border-color: #f97316;
            transform: translateY(-2px);
        }
    }
}

/* 输入区域 */
.chat-input-area {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    background: white;
    border-top: 1px solid #e2e8f0;

    .chat-input {
        flex: 1;
        padding: 12px 18px;
        border: 2px solid #e2e8f0;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: all 0.2s ease;

        &:focus {
            border-color: #f97316;
            box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
        }
    }

    .send-button {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);

        &:hover:not(:disabled) {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
        }

        &:disabled {
            background: #cbd5e1;
            cursor: not-allowed;
            box-shadow: none;
        }
    }
}

/* 全屏对话框样式 - 豆包风格 */
.fullscreen-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    display: flex;
    flex-direction: column;
    animation: fullscreenFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
}

/* 全屏头部 */
.fullscreen-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    .fullscreen-logo {
        display: flex;
        align-items: center;
        gap: 16px;

        .logo-icon {
            width: 50px;
            height: 50px;
            border-radius: 14px;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .logo-text {
            h1 {
                font-size: 24px;
                font-weight: 700;
                color: #1e293b;
                margin: 0;
                background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            span {
                font-size: 14px;
                color: #64748b;
            }
        }
    }

    .fullscreen-actions {
        display: flex;
        gap: 12px;

        .action-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            background: white;
            color: #475569;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background: #f8fafc;
                border-color: #cbd5e1;
            }

            &.close-btn {
                padding: 10px;

                &:hover {
                    background: #fef2f2;
                    color: #ef4444;
                    border-color: #fecaca;
                }
            }
        }
    }
}

/* 全屏主内容区 */
.fullscreen-main {
    flex: 1;
    display: flex;
    overflow: hidden;

    /* 左侧面板 */
    .fullscreen-sidebar {
        width: 15%;
        min-width: 400px;
        background: white;
        border-right: 1px solid #e2e8f0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        display: flex;
        flex-direction: column;

        &.sidebar-closed {
            width: 0;
            min-width: 0;
            border-right: none;
        }

        .sidebar-content {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            transition: all 0.3s ease;

            /* 新对话按钮 */
            .new-chat-btn {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
                background: white;
                border: 2px solid #f97316;
                border-radius: 12px;
                color: #f97316;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 30px;

                &:hover {
                    background: #f97316;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(249, 115, 22, 0.2);
                }
            }

            /* 历史对话 */
            .chat-history {
                margin-bottom: 30px;

                .history-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #64748b;
                    margin: 0 0 16px 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .history-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 14px 16px;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.2s ease;

                        &:hover {
                            background: #fef3c7;
                            border-color: #f97316;
                        }

                        &.active {
                            background: #f97316;
                            border-color: #f97316;
                            color: white;
                        }

                        .history-icon {
                            font-size: 20px;
                            flex-shrink: 0;
                        }

                        .history-content {
                            flex: 1;
                            min-width: 0;

                            .history-title-text {
                                font-size: 14px;
                                font-weight: 500;
                                margin: 0 0 4px 0;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }

                            .history-preview {
                                font-size: 12px;
                                opacity: 0.7;
                                margin: 0 0 4px 0;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }

                            .history-time {
                                font-size: 11px;
                                opacity: 0.6;
                                margin: 0;
                            }
                        }

                        .history-delete {
                            background: transparent;
                            border: none;
                            color: inherit;
                            opacity: 0.5;
                            cursor: pointer;
                            padding: 4px;
                            border-radius: 4px;
                            transition: all 0.2s ease;

                            &:hover {
                                opacity: 1;
                                background: rgba(255, 255, 255, 0.2);
                            }
                        }
                    }
                }
            }

            /* 欢迎区 */
            .welcome-section {
                text-align: center;
                color: #f97316;
                margin-top: auto;
                padding-top: 30px;
                border-top: 1px solid #e2e8f0;

                .welcome-avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    color: white;
                    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
                }

                .welcome-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .welcome-subtitle {
                    font-size: 16px;
                    opacity: 0.8;
                    margin: 0 0 32px 0;
                    color: #f97316;
                }

                .welcome-features {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    margin-bottom: 32px;

                    .feature-item {
                        background: #f8fafc;
                        border-radius: 12px;
                        padding: 16px;
                        border: 1px solid #e2e8f0;
                        color: #f97316;
                        transition: all 0.3s ease;

                        &:hover {
                            transform: translateY(-4px);
                            background: #f97316;
                            color: white;
                            border-color: #f97316;
                            box-shadow: 0 4px 16px rgba(249, 115, 22, 0.2);
                        }

                        .feature-icon {
                            font-size: 24px;
                            margin-bottom: 8px;
                        }

                        span {
                            font-size: 13px;
                            font-weight: 500;
                        }
                    }
                }

                /* 背景插画 */
                .welcome-illustration {
                    margin-top: 24px;

                    .illustration-img {
                        width: 100%;
                        max-width: 200px;
                        border-radius: 16px;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                    }
                }
            }
        }
    }

    /* 右侧聊天区 */
    .fullscreen-chat {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: white;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &.chat-expanded {
            width: 100%;
        }

        .fullscreen-chat-content {
            flex: 1;
            padding: 40px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 24px;

            .message {
                max-width: 80%;
                display: flex;
                align-items: flex-start;
                gap: 12px;

                &.ai-message {
                    align-self: flex-start;

                    .message-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        flex-shrink: 0;
                    }

                    .message-bubble {
                        background: #f8fafc;
                        border-radius: 20px 20px 20px 4px;
                        padding: 18px 24px;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #334155;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

                        &.typing {
                            min-width: 100px;
                            padding: 24px;

                            .typing-indicator {
                                display: flex;
                                gap: 8px;

                                span {
                                    width: 12px;
                                    height: 12px;
                                    background: #cbd5e1;
                                    border-radius: 50%;
                                    animation: typing 1.4s ease-in-out infinite both;

                                    &:nth-child(1) {
                                        animation-delay: -0.32s;
                                    }

                                    &:nth-child(2) {
                                        animation-delay: -0.16s;
                                    }
                                }
                            }
                        }
                    }
                }

                &.user-message {
                    align-self: flex-end;
                    flex-direction: row-reverse;

                    .message-bubble {
                        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                        color: white;
                        border-radius: 20px 20px 4px 20px;
                        padding: 18px 24px;
                        font-size: 15px;
                        line-height: 1.7;
                    }
                }
            }
        }

        /* 快捷问题区 */
        .fullscreen-quick-questions {
            padding: 24px 40px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;

            .quick-title {
                font-size: 14px;
                color: #64748b;
                margin: 0 0 16px 0;
            }

            .quick-buttons {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;

                .quick-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 14px;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.2s ease;

                    .btn-icon {
                        font-size: 18px;
                    }

                    &:hover {
                        background: #f97316;
                        color: white;
                        border-color: #f97316;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
                    }
                }
            }
        }

        /* 输入区域 */
        .fullscreen-input-area {
            padding: 24px 40px;
            background: white;
            border-top: 1px solid #e2e8f0;

            .input-wrapper {
                display: flex;
                gap: 16px;
                background: #f8fafc;
                border-radius: 16px;
                padding: 8px;
                border: 2px solid #e2e8f0;
                transition: all 0.2s ease;

                &:focus-within {
                    border-color: #f97316;
                    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
                }

                .fullscreen-input {
                    flex: 1;
                    padding: 16px 20px;
                    border: none;
                    background: transparent;
                    font-size: 16px;
                    outline: none;
                    color: #1e293b;

                    &::placeholder {
                        color: #94a3b8;
                    }
                }

                .fullscreen-send-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 14px 28px;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;

                    &:hover:not(:disabled) {
                        transform: scale(1.02);
                        box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
                    }

                    &:disabled {
                        background: #cbd5e1;
                        cursor: not-allowed;
                    }
                }
            }

            .input-tip {
                text-align: center;
                font-size: 12px;
                color: #94a3b8;
                margin: 12px 0 0 0;
            }
        }
    }
}

/* 动画 */
@keyframes tooltipFadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes dialogFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes fullscreenFadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes shake {

    0%,
    100% {
        transform: rotate(0);
    }

    25% {
        transform: rotate(-5deg);
    }

    75% {
        transform: rotate(5deg);
    }
}

@keyframes typing {

    0%,
    80%,
    100% {
        transform: scale(0);
    }

    40% {
        transform: scale(1);
    }
}

/* 滚动条样式 */
.chat-content::-webkit-scrollbar,
.fullscreen-chat-content::-webkit-scrollbar {
    width: 8px;
}

.chat-content::-webkit-scrollbar-track,
.fullscreen-chat-content::-webkit-scrollbar-track {
    background: transparent;
}

.chat-content::-webkit-scrollbar-thumb,
.fullscreen-chat-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.chat-content::-webkit-scrollbar-thumb:hover,
.fullscreen-chat-content::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* 响应式适配 */
@media (max-width: 1024px) {
    .fullscreen-main {
        .fullscreen-welcome {
            display: none;
        }

        .fullscreen-chat {
            width: 100%;
        }
    }
}
</style>