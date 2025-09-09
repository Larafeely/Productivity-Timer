document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const timerLabel = document.getElementById('timer-label');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const workTimeInput = document.getElementById('work-time');
    const breakTimeInput = document.getElementById('break-time');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks');
    const sessionCountDisplay = document.getElementById('session-count');

    let workTime = parseInt(workTimeInput.value) * 60;
    let breakTime = parseInt(breakTimeInput.value) * 60;
    let timeLeft = workTime;
    let isRunning = false;
    let isWorkSession = true;
    let interval = null;
    let sessionCount = 0;

    // ask the user to ahave - top of page notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
       const seconds = timeLeft % 60;
       timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function notify(message) {
        if (Notification.permission === 'granted') {
  new Notification(message);
        }
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            interval = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    isRunning = false;
                    if (isWorkSession) {
                        sessionCount++;
                        sessionCountDisplay.textContent = sessionCount;
                        notify('Work session complete! Time for a break.');


                        
                        isWorkSession = false;
                        timeLeft = breakTime;
                        timerLabel.textContent = 'Break';
                    } else {
                        notify('Break over! Back to work.');

                        
                        isWorkSession = true;
                        timeLeft = workTime;
                        timerLabel.textContent = 'Work';
      }
                    updateDisplay();
                    startTimer();
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        clearInterval(interval);
        isRunning = false;
    }
    function resetTimer() {
        clearInterval(interval);
        isRunning = false;
        isWorkSession = true;
        timeLeft = workTime;
        timerLabel.textContent = 'Work';
        updateDisplay();
    }




  
    function updateTimes() {
        workTime = parseInt(workTimeInput.value) * 60 || 25 * 60;

        
        breakTime = parseInt(breakTimeInput.value) * 60 || 5 * 60;


        
        if (!isRunning) {
            timeLeft = isWorkSession ? workTime : breakTime;
            updateDisplay();
        }
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const li = document.createElement('li');
            li.textContent = taskText;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => li.remove();
            li.appendChild(deleteBtn);
            tasksList.appendChild(li);
            taskInput.value = '';
        }
    }
 startBtn.addEventListener('click', startTimer);

  pauseBtn.addEventListener('click', pauseTimer);
   resetBtn.addEventListener('click', resetTimer);
    workTimeInput.addEventListener('input', updateTimes);
    breakTimeInput.addEventListener('input', updateTimes);
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    updateDisplay();
});
