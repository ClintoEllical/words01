document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM fully loaded and parsed');

    // Initialize variables
    let data = {};
    let keys = [];
    let index = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let totalWords = 0;
    let timer;
    let secondsElapsed = 0;
    let isTimerRunning = false;

    // Initialize the values for the boxes
    const leftKeyElement = document.getElementById('display-area-left-key');
    const leftValueElement = document.getElementById('display-area-left-value');
    const rightKeyElement = document.getElementById('display-area-right-key');
    const rightValueElement = document.getElementById('display-area-right-value');

    function updateDisplay() {
        if (index < keys.length - 1) {
            // Display current key-value pair in the first and second boxes
            const currentKey = keys[index];
            const currentValue = data[currentKey];
            
            // Display the next key in the third box and a question mark in the fourth box
            const nextKey = keys[index + 1] || '';
            const nextValue = data[nextKey] || '';
            
            console.log(`Updating display: Left Key = ${currentKey}, Left Value = ${currentValue}, Right Key = ${nextKey}, Right Value = ?`);

            leftKeyElement.textContent = currentKey;
            leftValueElement.textContent = currentValue;
            rightKeyElement.textContent = nextKey;
            rightValueElement.textContent = '?';
        } else {
            // Display the last key-value pair
            const lastKey = keys[index];
            const lastValue = data[lastKey];
            
            console.log(`Updating display: Left Key = ${lastKey}, Left Value = ${lastValue}, Right Key = , Right Value = ?`);

            leftKeyElement.textContent = lastKey;
            leftValueElement.textContent = lastValue;
            rightKeyElement.textContent = '';
            rightValueElement.textContent = '?';
        }
    }

    // Load file functionality
    const jsonFiles = [
        "level_01.json",
        "level_02.json",
        "level_03.json",
        "level_04.json",
        "level_05.json",
        "level_06.json",
        "level_07.json",
        "level_08.json",
        "level_09.json",
        "level_10.json",
        "level_11.json"
    ];

    const fileList = document.getElementById('file-list');

    jsonFiles.forEach(file => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = file.replace('.json', '').replace('_', ' ').toUpperCase();
        button.setAttribute('data-file', file);
        button.addEventListener('click', function() {
            loadFile(file);
        });
        li.appendChild(button);
        fileList.appendChild(li);
    });

    function loadFile(fileName) {
        console.log(`Loading file: ${fileName}`);
        fetch(fileName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(fetchedData => {
                console.log('Data loaded:', fetchedData);
                data = fetchedData;
                keys = Object.keys(data);
                index = 0;
                correctCount = 0;
                wrongCount = 0;
                totalWords = keys.length;

                document.getElementById('total-words').textContent = totalWords;
                document.getElementById('correct-count').textContent = correctCount;
                document.getElementById('wrong-count').textContent = wrongCount;
                document.getElementById('right-percentage').textContent = '0%';

                updateDisplay();
                resetTimer();
            })
            .catch(error => console.error('Error loading file:', error));
    }

    document.getElementById('right-button').addEventListener('click', function() {
        correctCount++;
        updateScore();
    });

    document.getElementById('wrong-button').addEventListener('click', function() {
        wrongCount++;
        updateScore();
    });

    function updateScore() {
        document.getElementById('total-words').textContent = totalWords;
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('wrong-count').textContent = wrongCount;

        const rightPercentage = totalWords > 0 ? ((correctCount / totalWords) * 100).toFixed(2) : 0;
        document.getElementById('right-percentage').textContent = rightPercentage + '%';

        index++;
        if (index < keys.length) {
            updateDisplay();
        } else {
            alert('No more words in the file.');
        }
    }

    // Timer functions
    function formatTime(seconds) {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    }

    function startTimer() {
        if (!isTimerRunning) {
            timer = setInterval(() => {
                secondsElapsed++;
                document.getElementById('timer').textContent = formatTime(secondsElapsed);
            }, 1000);
            isTimerRunning = true;
        }
    }

    function stopTimer() {
        clearInterval(timer);
        isTimerRunning = false;
    }

    function resetTimer() {
        clearInterval(timer);
        isTimerRunning = false;
        secondsElapsed = 0;
        document.getElementById('timer').textContent = formatTime(secondsElapsed);
    }

    document.getElementById('start-timer').addEventListener('click', startTimer);
    document.getElementById('stop-timer').addEventListener('click', stopTimer);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);
});
