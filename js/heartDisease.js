const display = document.getElementById('display');
const cardNumber = document.getElementById('cardNumber');
const timeDisplay = document.getElementById('time');
const timeA = document.getElementById('timeA');
const timeL = document.getElementById('timeL');
const btnStart = document.getElementById('btnStart');
const btnA = document.getElementById('btnA');
const btnL = document.getElementById('btnL');
const winA = document.getElementById('winA');
const winL = document.getElementById('winL');
const winner = document.getElementById('winner');
const playerAInput = document.getElementById('playerAInput');
const playerLInput = document.getElementById('playerLInput');
const playerA = document.getElementById('playerA');
const playerL = document.getElementById('playerL');
const pic = document.getElementById('pic');

let needToWin;
let currentCard;
let intervalId;
let startTime;
let elapsedTime = Number.MAX_VALUE;
let lastA = null;
let lastL = null;

// Helper function to format time
function formatTime(ms) {
    const date = new Date(ms);
    // return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}:${(ms % 1000).toString().padStart(3, '0')}`;
    return `${date.getUTCSeconds().toString().padStart(2, '0')}:${(ms % 1000).toString().padStart(3, '0')}`;
}

// Start the game
function startGame() {
    if(playerAInput.value != '') playerA.textContent = playerAInput.value;
    if(playerLInput.value != '') playerL.textContent = playerLInput.value;
    startTime = new Date();
    let displayedNumber = 1;
    let max = document.getElementById('maxNumber').value;
    let maxNumber = max == '' ? 2 : max;//數字會從1數到maxNumber
    timeDisplay.textContent = `Time: 00:000`;

    intervalId = setInterval(() => {
        // Draw a new card number between 1 and 13
        currentCard = Math.floor(Math.random() * maxNumber) + 1;
        cardNumber.textContent = currentCard;
        
        // Update the displayed number (cycling through 1 to 13)
        displayedNumber = (displayedNumber % maxNumber) + 1;
        display.textContent = displayedNumber;

        // Check if the drawn card matches the displayed number
        if (currentCard === displayedNumber) {
            clearInterval(intervalId);
            elapsedTime = new Date() - startTime;
            timeDisplay.textContent = `Time: ${formatTime(elapsedTime)}`;
        }
    }, 1000);
}

function compare(time, btn){
    let winTimes = 0;
    needToWin = document.getElementById('needToWin').value;
    needToWin = needToWin == '' ? 1 : parseInt(needToWin, 10);

    if(time < elapsedTime){
        // alert(`${btn} win`);
    }else{
        btn = btn == 'A' ? 'L' : 'A';
        // alert(`${btn} win`);
    }
    if(btn == 'A'){
        winTimes = parseInt(winA.textContent, 10) + 1;
        winA.textContent = winTimes;
    }else{
        winTimes = parseInt(winL.textContent, 10) + 1;
        winL.textContent = winTimes;
    }
    lastA = null;
    lastL = null;
    if(winTimes >= needToWin){//game over
        let picSrc;
        btn = btn == 'A' &&  playerAInput.value != '' ? playerAInput.value :
              btn == 'A' ? '1P' :
              playerLInput.value != '' ? playerLInput.value : '2P';
        //textContent是純文本，無法解析为 HTML 代码
        winner.innerHTML = `<strong>Congratulation!!</strong> the winner is ${btn}`;
        btnStart.style.display = 'none';  // 隐藏按钮
        btnStart.disabled = true;  // 禁用按钮
        // location.reload(true);// 这是最常用的刷新页面的方法。还可传入布尔值参数true强制从服务器重新加载页面（忽略缓存），例如 location.reload(true);。
        pic.style.display = 'block';
        if(btn == 'Hans' || btn == '黃漢昇'){//top pic
            picSrc = '319368.jpg';
        }else{
            picSrc = 'https://picsum.photos/1200/600?random=1';
        }
        pic.src = picSrc;
    }else{
        startGame();
    }
}

// Event listeners for buttons
btnA.addEventListener('click', () => {
    lastA = new Date() - startTime;
    console.log(`Button A pressed at: ${formatTime(lastA)}`);
    timeA.textContent = `Button A pressed at: ${formatTime(lastA)}`;
    if(lastL != null){//代表L比較快按，那就要去跟time比較，若L按的時間在time之前，就是A贏；不然就是L贏
        compare(lastL, 'A');
    }
});

btnL.addEventListener('click', () => {
    lastL = new Date() - startTime;
    console.log(`Button L pressed at: ${formatTime(lastL)}`);
    timeL.textContent = `Button L pressed at: ${formatTime(lastL)}`;
    if(lastA != null){//類似if(lastL != null)的解釋，只是倒過來
        compare(lastA, 'L');
    }
});

// Start the game when the script loads
// startGame();

// Keyboard event listener
document.addEventListener('keydown', (event) => {
    // 检查当前焦点是否在任何文本输入框内
    if (document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') {
        return; // 如果焦点在文本输入框内，什么都不做
    }

    if (event.key === 'a' || event.key === 'A') { // Check if the pressed key is 'A'
        btnA.click(); // Simulate a click on btnA
    } else if (event.key === 'l' || event.key === 'L') { // Check if the pressed key is 'L'
        btnL.click(); // Simulate a click on btnL
    } else if (event.key === 'Enter') { // Check if the pressed key is 'Enter'
        if (!btnStart.disabled) { // 检查按钮是否被禁用
            btnStart.click();
        }
    }
});