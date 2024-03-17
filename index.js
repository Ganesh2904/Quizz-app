const Form = document.getElementById("form");
const Game = document.getElementById("game");
const Category = document.getElementById("Category");
const Difficulty = document.getElementById("Difficulty");
const AllQuestions = document.getElementById("allquestions");
const ToHome = document.querySelectorAll(".back-to-home");
const HomeForm = document.getElementById("startform");
const ResultSection = document.getElementById("result");

const questionAnswerData = {};

Form.addEventListener("submit", (e) => {
    e.preventDefault();

    const section = document.querySelectorAll("section");
    for (const element of section) {
        element.style.display = "none";
    }
    Game.style.display = "block";

    const category = Category.value;
    const difficulty = Difficulty.value;
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;

    fetch(url)
        .then((response) => response.json())
        .then((res) => {
            const questions = res.results;
            let index = 0;
            for (const questiondata of questions) {
                const question = questiondata.question;
                const correct_answer = String(questiondata.correct_answer);
                const incorrect_answers = questiondata.incorrect_answers;
                const allArrayTemp = incorrect_answers;
                allArrayTemp.push(correct_answer);
                const allOptionsArray = randomizeArray(allArrayTemp);

                questionAnswerData[String(index)] = correct_answer;

                const dom_question = document.createElement("div");
                dom_question.setAttribute("class", "questionbox");

                const dom_question_text = document.createElement("p");
                dom_question_text.innerHTML = question;
                dom_question.appendChild(dom_question_text);

                const dom_options = document.createElement("div");
                dom_options.setAttribute("class", "options");

                const label1 = document.createElement("label");
                label1.setAttribute("for", allOptionsArray[0]);
                const label2 = document.createElement("label");
                label2.setAttribute("for", allOptionsArray[1]);
                const label3 = document.createElement("label");
                label3.setAttribute("for", allOptionsArray[2]);
                const label4 = document.createElement("label");
                label4.setAttribute("for", allOptionsArray[3]);

                const input1 = document.createElement("input");
                input1.setAttribute("id", allOptionsArray[0]);
                input1.setAttribute("value", allOptionsArray[0]);
                input1.setAttribute("type", "radio");
                input1.setAttribute("name", String(index));

                const input2 = document.createElement("input");
                input2.setAttribute("id", allOptionsArray[1]);
                input2.setAttribute("value", allOptionsArray[1]);
                input2.setAttribute("type", "radio");
                input2.setAttribute("name", String(index));
                const input3 = document.createElement("input");
                input3.setAttribute("id", allOptionsArray[2]);
                input3.setAttribute("value", allOptionsArray[2]);
                input3.setAttribute("type", "radio");
                input3.setAttribute("name", String(index));
                const input4 = document.createElement("input");
                input4.setAttribute("id", allOptionsArray[3]);
                input4.setAttribute("value", allOptionsArray[3]);
                input4.setAttribute("type", "radio");
                input4.setAttribute("name", String(index));

                label1.appendChild(input1);
                const span1 = document.createElement("span");
                span1.innerHTML = " " + allOptionsArray[0];
                label1.appendChild(span1);

                label2.appendChild(input2);
                const span2 = document.createElement("span");
                span2.innerHTML = " " + allOptionsArray[1];
                label2.appendChild(span2);

                label3.appendChild(input3);
                const span3 = document.createElement("span");
                span3.innerHTML = " " + allOptionsArray[2];
                label3.appendChild(span3);

                label4.appendChild(input4);
                const span4 = document.createElement("span");
                span4.innerHTML = " " + allOptionsArray[3];
                label4.appendChild(span4);

                dom_options.appendChild(label1);
                dom_options.appendChild(label2);
                dom_options.appendChild(label3);
                dom_options.appendChild(label4);

                dom_question.appendChild(dom_options);

                AllQuestions.appendChild(dom_question);

                index++;
            }

            const submitDiv = document.createElement("div");
            submitDiv.setAttribute("id", "submit-div");

            const submitButton = document.createElement("button");
            submitButton.textContent = "submit";
            submitButton.setAttribute("id", "submit-answer");
            submitDiv.appendChild(submitButton);
            AllQuestions.appendChild(submitDiv);
            submitButton.addEventListener("click", SubmitAnswer);
        });
});

function randomizeArray(arr) {
    let newArray = [];
    let i = arr.length - 1;
    while (i >= 0) {
        const randomIndex = Math.round(0 + i * Math.random());
        newArray.push(String(arr[randomIndex]));
        arr = removeElement(arr, randomIndex);
        i--;
    }
    return newArray;
}

function removeElement(arr, index) {
    for (let i = index; i < arr.length; i++) {
        arr[i] = arr[i + 1];
    }
    arr.pop();
    return arr;
}

for(let i of ToHome){
    i.addEventListener("click", () => {
        const section = document.querySelectorAll("section");
        for (const element of section) {
            element.style.display = "none";
        }
        HomeForm.style.display = "block";
        AllQuestions.innerHTML = null;
    });
}

function getResult() {
    let unatempted = 0;
    let wrong = 0;
    let right = 0;
    for (let i = 0; i < AllQuestions.children.length - 1; i++) {
        let currentQuestionBox = AllQuestions.children[i];
        let options = currentQuestionBox.children[1];
        let currentAnswer = null;
        //options-label-input+span
        for (let option of options.children) {
            if (option.children[0].checked) {
                currentAnswer = option.children[0].value;
            }
        }
        if (currentAnswer === questionAnswerData[i]) {
            right++;
        } else if (currentAnswer === null) {
            unatempted++;
        } else {
            wrong++;
        }
    }

    return {
        wrong: wrong,
        right: right,
        unatempted: unatempted,
    };
}

function SubmitAnswer() {
    let result = getResult();

    const section = document.querySelectorAll("section");
    for (const element of section) {
        element.style.display = "none";
    }
    ResultSection.style.display = "block";

    let rightAnsDom = document.querySelector(".right");
    let wrongAnsDom = document.querySelector(".wrong");
    let unattemptedAnsDom = document.querySelector(".unattempted");

    const Piechart = document.getElementById("piechart");

    rightAnsDom.innerText = `${result.right} right`;
    wrongAnsDom.innerText = `${result.wrong} wrong`;
    unattemptedAnsDom.innerText = `${result.unatempted} unattempted`;

    let rightPercentage = Math.floor((result.right/10)*100);
    let wrongPercentage = Math.floor((result.wrong/10)*100);
    Piechart.style.background = `conic-gradient(
        rgb(38, 107, 171, 1) 0 ${rightPercentage}%,
        #fb2222ee 0 ${rightPercentage+wrongPercentage}%,
        #ffe41bf7 0 100%
    )`;
}
