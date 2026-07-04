document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const inputField = document.getElementById('user-input');
    const messageText = inputField.value.trim();
    
    if (messageText === '') return;

    // 1. 유저 메시지 화면에 추가
    appendMessage(messageText, 'user');
    inputField.value = '';

    // 로딩 표시 추가
    const chatContainer = document.getElementById('chat-container');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot loading';
    loadingDiv.innerHTML = `<div class="bubble">생각 중...</div>`;
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 2. 백엔드 Flask 서버 API 호출 (http://localhost:5000/api/chat)
    fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText })
    })
    .then(response => response.json())
    .then(data => {
        // 로딩 제거
        chatContainer.removeChild(loadingDiv);
        
        // 3. 챗봇 답변 화면에 추가
        if (data.reply) {
            appendMessage(data.reply, 'bot');
        } else {
            appendMessage('서버 오류가 발생했습니다.', 'bot');
        }
    })
    .catch(error => {
        chatContainer.removeChild(loadingDiv);
        console.error('Error:', error);
        appendMessage('서버와 연결할 수 없습니다. Flask 서버가 켜져 있는지 확인하세요.', 'bot');
    });
}

function appendMessage(text, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // 줄바꿈 브레이크 처리
    const cleanText = text.replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `<div class="bubble">${cleanText}</div>`;
    chatContainer.appendChild(messageDiv);
    
    // 스크롤 최하단 이동
    chatContainer.scrollTop = chatContainer.scrollHeight;
}