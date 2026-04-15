<template>
    <div class="ai-chat-container">
        <!-- 悬浮按钮 -->
        <DraggableContainer v-if="!isOpen" @click="openChat" @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false" :initialPosition="buttonPosition" :preventClickOnDrag="true"
            :container-style="{ width: '60px', height: '60px' }" class="chat-button">
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
        </DraggableContainer>

        <DraggableContainer v-else-if="!isFullscreen" @click.stop :initialPosition="dialogPosition"
            :preventClickOnDrag="false" :container-style="{ width: '600px', height: '720px' }" class="chat-dialog">
            <!-- 小屏对话框 -->
            <div class="small-chat-wrapper">
                <!-- 对话框头部 -->
                <div class="chat-header">
                    <div class="chat-header-left">
                        <div class="ai-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-8 h-8">
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-5 h-5">
                                <path
                                    d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                        </button>
                        <button class="close-button" @click="closeChat">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-5 h-5">
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- 聊天内容区 -->
                <div class="chat-content" ref="chatContent">
                    <!-- AI 欢迎消息 -->
                    <div class="message-list" ref="messageList">
                        <div v-for="message in Messages" :key="message.id" class="message"
                            :class="{ 'user-message': message.sender == 'user', 'ai-message': message.sender == 'ai' }">
                            <div class="message-bubble">
                                <p>{{ message.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部固定区域 -->
                <div class="chat-bottom-area">
                    <!-- 常见问题快捷按钮 -->
                    <div class="quick-questions">
                        <button class="quick-question-btn" @click="sendQuickQuestion('项目的简单介绍')">项目的简单介绍</button>
                        <button class="quick-question-btn" @click="sendQuickQuestion('寄样预定流程')">寄样预定流程</button>
                        <button class="quick-question-btn" @click="sendQuickQuestion('宠物寄样注意事项')">宠物寄样注意事项</button>
                        <button class="quick-question-btn"
                            @click="sendQuickQuestion('PetGo宠物信息管理')">PetGo宠物信息管理</button>
                    </div>

                    <!-- 输入区域 -->
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" placeholder="输入你的问题..." v-model="messageInput"
                            @keyup.enter="sendMessage" />
                        <button class="send-button" @click="sendMessage" :disabled="!messageInput.trim()">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-5 h-5">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </DraggableContainer>

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
                        <div class="message-list" ref="messageList">
                            <div v-for="message in Messages" :key="message.id" class="message"
                                :class="{ 'user-message': message.sender == 'user', 'ai-message': message.sender == 'ai' }">

                                <template v-if="message.sender == 'ai'">
                                    <div class="message-avatar">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                            class="w-6 h-6">
                                            <path
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                        </svg>
                                    </div>
                                    <div v-if="message.isTyping">
                                        <div class="message-bubble typing">
                                            <div class="typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <template v-else>
                                        <div class="message-bubble">
                                            <span>{{ message.content }}</span>
                                        </div>
                                    </template>
                                </template>
                                <template v-else>
                                    <div class="message-bubble">
                                        <span>{{ message.content }}</span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- 快捷问题区 -->
                    <div class="fullscreen-quick-questions">
                        <p class="quick-title">你可以问我：</p>
                        <div class="quick-buttons">
                            <button class="quick-btn" @click="sendQuickQuestion('项目的简单介绍')">
                                <span class="btn-icon">�</span>
                                <span>项目的简单介绍</span>
                            </button>
                            <button class="quick-btn" @click="sendQuickQuestion('寄样预定流程')">
                                <span class="btn-icon">📅</span>
                                <span>寄样预定流程</span>
                            </button>
                            <button class="quick-btn" @click="sendQuickQuestion('宠物寄样注意事项')">
                                <span class="btn-icon">⚠️</span>
                                <span>宠物寄样注意事项</span>
                            </button>
                            <button class="quick-btn" @click="sendQuickQuestion('PetGo宠物信息管理')">
                                <span class="btn-icon">🐾</span>
                                <span>PetGo宠物信息管理</span>
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
import { ref, onMounted, nextTick } from 'vue'
import DraggableContainer from '@/components/common/DraggableContainer.vue'
import { getAiChat } from '@/api/ai/ai'
// 状态管理
const isOpen = ref(false)
const isFullscreen = ref(false)
const showTooltip = ref(false)
const isSidebarOpen = ref(true)
interface Message {
    id: string
    content: string
    sender: string
    isTyping: boolean
}

// 拖动功能
const buttonPosition = ref({
    x: window.innerWidth - 90,
    y: window.innerHeight - 90
})
const dialogPosition = ref({
    x: (window.innerWidth - 700) / 2,
    y: (window.innerHeight - 620) / 2
})

// 初始化按钮位置
const initPosition = () => {
    buttonPosition.value = {
        x: window.innerWidth - 90,
        y: window.innerHeight - 90
    }
    dialogPosition.value = {
        x: (window.innerWidth - 600) / 2,
        y: (window.innerHeight - 720) / 2
    }
}
onMounted(() => {
    console.log(window.innerWidth)
    initPosition()
})
const Messages = ref<Message[]>([])
const messageList = ref<HTMLElement | null>(null)
const chatContent = ref<HTMLElement | null>(null)
const messageInput = ref('')
//当前会话的id
const currentMemoryId = ref('')
//生成uuid
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);

    });
}
// 创建新对话
const createNewChat = () => {
    const newMemoryId = generateUUID();
    currentMemoryId.value = newMemoryId;
    Messages.value = [];
    // console.log('创建新对话')
    //添加欢迎消息
    addWelcomeMessage();
    // 这里可以添加创建新对话的逻辑
}
// 添加欢迎消息
const addWelcomeMessage = () => {
    const welcomeMessage = {
        id: generateUUID(),
        content: '你好！我是PetGo AI寄养顾问，有什么可以帮助你的吗？',
        sender: 'ai',
        isTyping: false
    };
    Messages.value.push(welcomeMessage);

}

// 发送消息
const sendMessage = async () => {
    if (messageInput.value.trim()) {
        console.log('发送消息:', messageInput.value)

        // 保存用户输入
        const userInput = messageInput.value

        // 添加用户消息
        const userMessage: Message = {
            id: generateUUID(),
            content: userInput,
            sender: 'user',
            isTyping: false
        };
        Messages.value.push(userMessage)
        scrollToBottom()

        messageInput.value = ''

        // 添加 AI 消息占位
        const aiMessageId = generateUUID();
        const aiMessage = ref({
            id: aiMessageId,
            content: '',
            sender: 'ai',
            isTyping: true
        })
        Messages.value.push(aiMessage.value);

        // 滚动到底部
        scrollToBottom()

        try {
            console.log('开始请求 AI 聊天接口...')
            const res = await getAiChat(currentMemoryId.value, userInput)
            console.log('API 响应:', res)
            console.log('响应数据类型:', typeof res.body)

            // 直接处理字符串格式的 SSE 数据
            if (res.body?.getReader) {
                // 处理 ReadableStream 格式
                console.log('处理 ReadableStream 格式...')
                const reader = res.body.getReader()
                const decoder = new TextDecoder()
                let buffer = ''

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value, { stream: true })
                    // console.log(chunk);
                    buffer += chunk

                    const lines = buffer.split('\n')
                    buffer = lines.pop() || ''
                    console.log(lines)
                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            const data = line.slice(5)
                            if (data.trim() != '[DONE]') {
                                // 标记 AI 回复完成
                                aiMessage.value.isTyping = false

                                aiMessage.value.content += data
                                console.log(aiMessage.value.content)
                                scrollToBottom()
                            }

                        }

                    }

                    // console.log(aiMessage.content)
                }

            } else {
                throw new Error('Unsupported response format')
            }
            console.log(aiMessage.value.content)

            // 标记 AI 回复完成


        } catch (error) {
            console.error('流式请求失败:', error);
            aiMessage.value.content = aiMessage.value.content || 'AI 回复失败，请重试';
            // isTyping.value = false;
        }
    }
}
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


// 滚动到底部
const scrollToBottom = async () => {
    await nextTick()
    // 小屏模式：滚动 chatContent
    if (chatContent.value) {
        chatContent.value.scrollTop = chatContent.value.scrollHeight
    }
    // 全屏模式：滚动 messageList（全屏模式下 messageList 是可滚动的）
    if (messageList.value && isFullscreen.value) {
        const fullscreenContent = messageList.value.closest('.fullscreen-chat-content')
        if (fullscreenContent) {
            fullscreenContent.scrollTop = fullscreenContent.scrollHeight
        }
    }
}

onMounted(() => {
    createNewChat();
});

// 发送快捷问题
const sendQuickQuestion = (question: string) => {
    messageInput.value = question
    sendMessage()
}

</script>

<style scoped lang="scss">
.ai-chat-container {
    position: fixed;
    top: 0;
    left: 0;
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
    cursor: move;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: fixed;
    user-select: none;
    -webkit-user-select: none;

    &:hover {
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
    width: 700px;
    max-width: 90vw;
    height: 620px;
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

    /* 小屏对话框包装器 */
    .small-chat-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    /* 底部固定区域 */
    .chat-bottom-area {
        flex-shrink: 0;
        background: white;
        border-top: 1px solid #e2e8f0;
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
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    min-height: 0;

    .message-list {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .message {
        max-width: 85%;
        margin-bottom: 16px;

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
            max-width: 100%;

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
    padding: 12px 20px;
    background: white;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    border-bottom: 1px solid #e2e8f0;

    .quick-question-btn {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 12px;
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
    padding: 12px 20px;
    background: white;

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
                margin-bottom: 45px;

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
                    max-width: 100%;

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