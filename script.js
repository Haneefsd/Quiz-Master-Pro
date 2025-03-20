let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let homeBtn = document.getElementById("home"); // Home Button
let userScore = document.getElementById("user-score");
let leaderboardList = document.getElementById("leaderboard-list");

let questionCount = 0;
let scoreCount = 0;
let count = 10;
let countdown;

// Quiz Questions Array
const quizArray = [
    { question: "Which is the most widely spoken language in the world?", options: ["Spanish", "Mandarin", "English", "German"], correct: "Mandarin" },
    { question: "Which is the only continent without a desert?", options: ["North America", "Asia", "Africa", "Europe"], correct: "Europe" },
    { question: "Who invented the Computer?", options: ["Charles Babbage", "Henry Luce", "Henry Babbage", "Charles Luce"], correct: "Charles Babbage" },
    { question: "What is a computer requesting files from another computer called?", options: ["A client", "A host", "A router", "A web server"], correct: "A client" },
    { question: "What is a device added to a computer system later called?", options: ["Peripheral", "Clip art", "Highlight", "Execute"], correct: "Peripheral" },
    { question: "What stores files on a network?", options: ["Clip art", "Motherboard", "Peripheral", "File server"], correct: "File server" },
    { question: "How can you catch a computer virus?", options: ["Sending emails", "Using a laptop in winter", "Opening email attachments", "Shopping online"], correct: "Opening email attachments" },
    { question: "Google (www.google.com) is a:", options: ["Search Engine", "Math Number", "Directory of images", "Chat service"], correct: "Search Engine" },
    { question: "Which is not an Internet protocol?", options: ["HTTP", "FTP", "STP", "IP"], correct: "STP" },
    { question: "Which is not a valid domain name?", options: ["www.yahoo.com", "www.yahoo.co.uk", "www.com.yahoo", "www.yahoo.co.in"], correct: "www.com.yahoo" },
    
    // 🎉 New Questions Added Below
    { question: "What does RAM stand for?", options: ["Random Access Memory", "Read Access Memory", "Run Access Memory", "Random Allocation Memory"], correct: "Random Access Memory" },
    { question: "Which part of the computer performs calculations?", options: ["Monitor", "CPU", "Keyboard", "Hard Disk"], correct: "CPU" },
    { question: "What is the term for unsolicited bulk emails?", options: ["Spam", "Phishing", "Virus", "Trojan"], correct: "Spam" },
    { question: "Which language is used to style web pages?", options: ["HTML", "Python", "JavaScript", "CSS"], correct: "CSS" },
    { question: "What is the brain of any computer system?", options: ["RAM", "Hard Disk", "CPU", "Power Supply"], correct: "CPU" },
    { question: "Which HTML tag is used to link an external JavaScript file?", options: ["<script>", "<link>", "<js>", "<javascript>"], correct: "<script>" },
    { question: "Which technology is used to connect devices wirelessly?", options: ["Bluetooth", "HDMI", "Ethernet", "VGA"], correct: "Bluetooth" },
    { question: "What does URL stand for?", options: ["Universal Resource Locator", "Uniform Resource Locator", "Unique Resource Locator", "United Resource Locator"], correct: "Uniform Resource Locator" },
    { question: "What is the default port number for HTTP?", options: ["80", "21", "25", "443"], correct: "80" },
    { question: "Which programming language is known as the backbone of web development?", options: ["Python", "Java", "JavaScript", "C++"], correct: "JavaScript" }
];


// Fetch leaderboard from localStorage
function getLeaderboard() {
    return JSON.parse(localStorage.getItem("leaderboard")) || [];
}

// Save leaderboard to localStorage
function saveLeaderboard(scores) {
    localStorage.setItem("leaderboard", JSON.stringify(scores));
}

// Display updated leaderboard
function updateLeaderboard() {
    let scores = getLeaderboard();
    leaderboardList.innerHTML = "";

    scores.forEach((entry, index) => {
        let li = document.createElement("li");
        li.textContent = `#${index + 1} - ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

// Save Score after Quiz Completion
function saveScore() {
    let name = prompt("Enter your name for the leaderboard:") || "Guest";
    let scores = getLeaderboard();

    scores.push({ name, score: scoreCount });
    scores.sort((a, b) => b.score - a.score); // Sort by highest score
    scores = scores.slice(0, 5); // Keep only top 5 scores

    saveLeaderboard(scores);
    updateLeaderboard();
}

// Restart Quiz
restart.addEventListener("click", () => {
    initial();
    displayContainer.classList.remove("hide");
    scoreContainer.classList.add("hide");
});

// Home Button - Reload to Home
homeBtn.addEventListener("click", () => {
    window.location.reload(); // Reload the page to reset the quiz
});

// Next Question Button
nextBtn.addEventListener("click", () => {
    questionCount++;

    if (questionCount === quizArray.length) {
        displayContainer.classList.add("hide");
        scoreContainer.classList.remove("hide");

        userScore.innerHTML = `🎉 Your score is ${scoreCount} out of ${quizArray.length}`;
        saveScore(); // Save score to leaderboard
    } else {
        countOfQuestion.innerHTML = `${questionCount + 1} of ${quizArray.length} Questions`;
        quizDisplay(questionCount);
        count = 10;
        clearInterval(countdown);
        timerDisplay();
    }
});

// Timer for Each Question
const timerDisplay = () => {
    clearInterval(countdown);
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count === 0) {
            clearInterval(countdown);
            displayNext();
        }
    }, 1000);
};

// Display Quiz Questions
const quizDisplay = (questionCount) => {
    document.querySelectorAll(".container-mid").forEach((card) => card.classList.add("hide"));
    document.querySelectorAll(".container-mid")[questionCount].classList.remove("hide");
};

// Create Quiz Elements
function quizCreator() {
    quizArray.sort(() => Math.random() - 0.5);

    for (let i of quizArray) {
        i.options.sort(() => Math.random() - 0.5);

        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");

        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.question;
        div.appendChild(question_DIV);

        i.options.forEach(option => {
            let button = document.createElement("button");
            button.classList.add("option-div");
            button.innerText = option;
            button.onclick = () => checker(button);
            div.appendChild(button);
        });

        quizContainer.appendChild(div);
    }
}

// Check Answer
function checker(userOption) {
    let userSolution = userOption.innerText;
    let question = document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");

    if (userSolution === quizArray[questionCount].correct) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
        options.forEach((element) => {
            if (element.innerText === quizArray[questionCount].correct) {
                element.classList.add("correct");
            }
        });
    }

    clearInterval(countdown);
    options.forEach((element) => (element.disabled = true));
}

// Initialize Quiz
function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    count = 10;
    clearInterval(countdown);
    timerDisplay();
    quizCreator();
    quizDisplay(questionCount);
}

// Start Quiz Automatically
window.onload = () => {
    displayContainer.classList.remove("hide");
    initial();
    updateLeaderboard(); // Load leaderboard on page load
};
