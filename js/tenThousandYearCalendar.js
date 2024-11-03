const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const calendarBody = document.getElementById('calendarBody');
const datePicker = document.getElementById('datePicker');
const selectedDate = document.getElementById('selectedDate');
const todayString = new Date().toISOString().split('T')[0];
const yearFrom = 2020;
const yearTo   = 2100;

let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

// Populate year and month select options
for (let i = yearFrom; i <= yearTo; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
}
for (let i = 0; i < 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = new Date(0, i).toLocaleString('default', { month: 'long' });
    monthSelect.appendChild(option);
}

yearSelect.value = currentYear;
monthSelect.value = currentMonth;

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        if(currentYear > yearFrom) currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        if(currentYear < yearTo) currentYear++;
    }
    yearSelect.value = currentYear;
    monthSelect.value = currentMonth;
    updateCalendar();
}

function changeYear(direction) {
    currentYear += direction;
    if (currentYear < yearFrom) {
        currentYear = yearFrom;
        alert("this calendar is from 2020");
    } else if (currentYear > yearTo) {
        currentYear = yearTo;
        alert("this calendar is to 2100");
    }
    yearSelect.value = currentYear;
    monthSelect.value = currentMonth;
    updateCalendar();
}

function updateCalendar() {
    calendarBody.innerHTML = ''; // Clear previous calendar
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);

    const firstDay = new Date(year, month, 1).getDay();//会返回该日期是星期几，返回值为0到6的整数，分别表示星期日到星期六。
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let holiday = firstDay;//0週日 and 6週六
    let date = 1;
    let d = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.textContent = '';
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.textContent = date;
                cell.style.cursor = 'pointer';
                if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
                    cell.classList.add('today');
                }else if(holiday == 0){
                    cell.classList.add('sunday');
                }else if(holiday == 6){
                    cell.classList.add('saturday');
                }

                /* Add click event listener to each cell,本來GPT是叫我用date取代cell.textContent，但我發現若在八月時，date固定是32(8/31+1)*/
                cell.addEventListener('click', () => {
                    const selectedDateValue = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.textContent).padStart(2, '0')}`;
                    datePicker.value = selectedDateValue;
                    selectedDate.textContent = selectedDateValue;
                    loadMemo(selectedDateValue);
                });

                
                date++;
                holiday = (holiday + 1) % 7;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }

    // 更新備註清單
    updateMemoList();
}

// Function to save memo to localStorage
function saveMemo() {
    const selectedDate = document.getElementById('selectedDate').textContent;
    const memoContent = document.getElementById('memo').value;
    const currentTime = new Date().toLocaleString(); // 獲取當前時間的字串格式
    const data = {
        memo: memoContent,
        time: currentTime
    };
    localStorage.setItem(selectedDate, JSON.stringify(data));
    location.reload(true);// 这是最常用的刷新页面的方法。还可传入布尔值参数true强制从服务器重新加载页面（忽略缓存），例如 location.reload(true);。
}

// Function to load memo from localStorage
function loadMemo(date) {
    const storedData = JSON.parse(localStorage.getItem(date)) || {};
    const memoContent = storedData.memo || ''; // 默認為空字符串
    document.getElementById('memo').value = memoContent;
    document.getElementById('selectedDate').textContent = date;
    // 更新備註清單
    updateMemoList();
}

// Function to delete the memo for the selected date
function deleteSelectedMemo() {
    const selectedDate = document.getElementById('selectedDate').textContent;
    if (confirm(`Are you sure you want to delete the memo for ${selectedDate}?`)) {
        localStorage.removeItem(selectedDate);
        document.getElementById('memo').value = '';
        alert(`Memo for ${selectedDate} deleted.`);
        location.reload(true);// 这是最常用的刷新页面的方法。还可传入布尔值参数true强制从服务器重新加载页面（忽略缓存），例如 location.reload(true);。
    }
}

// Function to delete all memos
function deleteAllMemos() {
    if (confirm('Are you sure you want to delete all memos?')) {
        localStorage.clear();
        document.getElementById('memo').value = '';
        alert('All memos deleted.');
        location.reload(true);// 这是最常用的刷新页面的方法。还可传入布尔值参数true强制从服务器重新加载页面（忽略缓存），例如 location.reload(true);。
    }
}

function updateMemoList() {
    const memoList = document.getElementById('memoList');
    memoList.innerHTML = ''; // 清空現有清單

    const firstItem = document.createElement('li');
    firstItem.classList.add('list-group-item'); // 添加 class
    firstItem.innerHTML = `2024-02-04: First Day`;
    memoList.appendChild(firstItem);

    // 讀取所有備註到數組中
    const memos = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const memoContent = JSON.parse(localStorage.getItem(key));
        memos.push({ date: key, content: memoContent });
    }

    // 按日期升序排序
    memos.sort((a, b) => new Date(a.date) - new Date(b.date));    

    // 更新備註清單
    memos.forEach(me => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item'); // 添加 class
        listItem.innerHTML = `${me.date}: ${me.content.memo}(${me.content.time})`;
        memoList.appendChild(listItem);
    });
}

// Event listeners for selects
// yearSelect.addEventListener('change', updateCalendar);
yearSelect.addEventListener('change', (event) => {
    currentYear = parseInt(event.target.value); // Update currentYear
    updateCalendar();
});
monthSelect.addEventListener('change', (event) => {
    currentMonth = parseInt(event.target.value); // Update currentMonth
    updateCalendar();
});

document.getElementById("memo").addEventListener("keydown", function(event) {
    // 檢查是否按下了 Insert 鍵 (keyCode 為 45)
    if (event.key === "Insert") {
        event.preventDefault(); // 可選：阻止默認行為
        saveMemo(); // 呼叫保存函數
    }
});

document.addEventListener("keydown", function(event) {
    // 檢查是否按下了左方向鍵 (ArrowLeft)
    /*if (event.key === "ArrowLeft") {
        event.preventDefault(); // 可選：阻止默認行為
        changeMonth(-1); // 呼叫 changeMonth 函數
    }else if (event.key === "ArrowRight") {
        event.preventDefault(); // 可選：阻止默認行為
        changeMonth(1); // 呼叫 changeMonth 函數
    }else */
    if (event.key === "ArrowUp") {
        event.preventDefault(); // 可選：阻止默認行為
        changeYear(1);
    }else if (event.key === "ArrowDown") {
        event.preventDefault(); // 可選：阻止默認行為
        changeYear(-1);
    }
});

document.querySelector('#memoList').addEventListener('click', function(event) {
    // 檢查點擊的是否是 li 元素
    if (event.target && event.target.nodeName === "LI") {
        // 取得點選的 li 元素
        const clickedItem = event.target;
        let liDate = clickedItem.textContent.substring(0, 10);
        let liYear = clickedItem.textContent.substring(0, 4);
        let liMonth = clickedItem.textContent.substring(5, 7);
        let liDay = clickedItem.textContent.substring(8, 10);
        console.log(`${liYear}-${liMonth}-${liDay}`); // 輸出點選的項目內容
        datePicker.value = liDate;
        loadMemo(liDate);
    }
});

// Initialize the calendar on page load
updateCalendar();

// Example: Load memo for today's date on page load
document.getElementById('datePicker').value = todayString;
loadMemo(todayString);

flatpickr("#datePicker", {
    dateFormat: "Y-m-d", // 設定日期格式
    minDate: "2020-01-01",   // "today"設定最小日期為今天
    maxDate: "2100-12-31",
    // enableTime: true,
    // dateFormat: "Y-m-d H:i",
    // 其他選項
});