// Define violation rules with fines and imprisonment
const dictionary = {
    'Sec.25': { desc: 'Unauthorized processing of personal data', fine: '₱500,000–₱1,000,000', imprisonment: '1–3 years' },
    'Sec.26': { desc: 'Access due to negligence', fine: '₱100,000–₱500,000', imprisonment: '6 months–2 years' },
    'Sec.27': { desc: 'Improper disposal of personal data', fine: '₱50,000–₱250,000', imprisonment: '6 months–1 year' },
    'Sec.28': { desc: 'Processing for unauthorized purposes', fine: '₱200,000–₱500,000', imprisonment: '1–2 years' },
    'Sec.29': { desc: 'Unauthorized access or breach', fine: '₱500,000–₱2,000,000', imprisonment: '1–4 years' },
    'Sec.30': { desc: 'Concealment of security breaches', fine: '₱300,000–₱1,000,000', imprisonment: '6 months–3 years' },
    'Sec.31': { desc: 'Malicious disclosure of personal data', fine: '₱500,000–₱2,000,000', imprisonment: '2–6 years' },
    'Sec.32': { desc: 'Unauthorized disclosure of personal data', fine: '₱200,000–₱1,000,000', imprisonment: '1–3 years' },
    'Sec.33': { desc: 'Combination or series of unauthorized acts', fine: '₱1,000,000–₱5,000,000', imprisonment: '2–8 years' },
    'Sec.34': { desc: 'Liability of officers or agents', fine: '₱50,000–₱300,000', imprisonment: '6 months–2 years' },
    'Sec.35': { desc: 'Large-scale offense', fine: '₱5,000,000–₱10,000,000', imprisonment: '4–8 years' },
    'Sec.36': { desc: 'Offense by public officer', fine: '₱500,000–₱2,000,000', imprisonment: '2–6 years' }
};

// Category sequence and questions based on General-Questions.md
const categories = [
    {
        name: 'Personal/Sensitive Information',
        general: 'Was any personal or sensitive personal information involved in the case?',
        general_questions: [
            { 
                question: 'Was the data subject\'s consent obtained before processing?', 
                type: 'yesno' 
            },
            { 
                question: 'Was it accessed without any form of authorization due to negligence?', 
                type: 'yesno' 
            },
            { 
                question: 'Who processed the data?', 
                type: 'choice',
                options: ['Organization', 'Employee', 'Third Party'] 
            },
            { 
                question: 'Was the processing authorized by law or the Data Privacy Act?', 
                type: 'yesno' 
            }
        ],
        sections: [
            { section: 'Sec.25', question: 'Was the data processed without proper authorization or legal basis?' },
            { section: 'Sec.26', question: 'Was it accessed without authorization due to negligence?' },
            { section: 'Sec.27', question: 'Was any information improperly disposed of?' },
            { section: 'Sec.28', question: 'Was the processing done for a purpose not authorized by the data subject?' }
        ],
        follow_up: [
            { question: 'Did the processing involve sensitive personal information?', type: 'yesno' },
            { question: 'Is the violator a foreigner?', type: 'yesno' }
        ]
    },
    {
        name: 'Breaching',
        general: 'Was there any unauthorized access to information or data breaching involved in this case?',
        general_questions: [
            { question: 'Was the breach reported to the National Privacy Commission (NPC)?', type: 'yesno' }
        ],
        sections: [
            { section: 'Sec.29', question: 'Was there an intentional unauthorized access or breach?' },
            { section: 'Sec.30', question: 'Was there a failure to notify NPC about the breach?' }
        ],
        follow_up: [
            { question: 'Did the breach involve sensitive personal information?', type: 'yesno' },
            { 
                question: 'Who was responsible?', 
                type: 'choice',
                options: ['Internal Personnel', 'Third Party', 'External Attacker'] 
            },
            { question: 'Did the data breach affect multiple individuals?', type: 'yesno' },
            { question: 'If yes to previous question, how many individuals?', type: 'number' },
            { question: 'Is the violator a foreigner?', type: 'yesno' }
        ]
    },
    {
        name: 'Disclosure of Information',
        general: 'Was any personal or sensitive information disclosed to a third party?',
        general_questions: [
            { question: 'Was the disclosure authorized by the data subject or any law?', type: 'yesno' },
            { question: 'Was the disclosure done by a controller, processor, or employee?', type: 'yesno' }
        ],
        sections: [
            { section: 'Sec.31', question: 'Was the disclosure made with malice or bad faith?' },
            { section: 'Sec.32', question: 'Was the disclosure unauthorized?' }
        ],
        follow_up: [
            { question: 'Was the information false or unwarranted?', type: 'yesno' },
            { question: 'Did the disclosure affect multiple individuals?', type: 'yesno' },
            { question: 'If yes to previous question, how many individuals?', type: 'number' },
            { question: 'Is the violator a foreigner?', type: 'yesno' },
            { question: 'Was the disclosure part of a series of actions?', type: 'yesno' }
        ]
    },
    {
        name: 'Final Questions',
        general: 'Additional case assessment questions:',
        sections: [
            { section: 'Sec.33', question: 'Did the violator commit multiple violations?' },
            { section: 'Sec.33', question: 'Was the disclosure part of a series of actions?' },
            { section: 'Sec.34', question: 'Is an officer or agent liable?' },
            { section: 'Sec.35', question: 'Does this case affect more than 1000 individuals?' },
            { section: 'Sec.36', question: 'Is a public officer involved?' }
        ]
    }
];

// Global variables
let username = '';
let detected = [];
let current_category_index = 0;
let current_question_index = 0;
let question_type = 'general'; // general, general_questions, sections, follow_up
let follow_up_answers = {};
let is_large_scale = false;
let has_sensitive_info = false;
let has_multiple_violations = false;
let total_affected_individuals = 0;
let should_check_breach = false;
let should_check_disclosure = false;
let category_finished = false;
let prevAnswer = '';

// Function to validate numeric input before submitting
function validateNumber() {
    const input = document.getElementById('number-input');
    const value = parseInt(input.value);
    
    if (value < 0) {
        input.value = 0;
        return false;
    }
    return true;
}

// DOM function to switch between sections smoothly
function switchSection(fromId, toId) {
    const fromSection = document.getElementById(fromId);
    const toSection = document.getElementById(toId);
    
    // Make sure both sections exist before switching
    if (!fromSection || !toSection) {
        console.error(`Error switching sections: One of the sections (${fromId}, ${toId}) doesn't exist.`);
        return;
    }
    
    fromSection.classList.remove('section-visible');
    fromSection.classList.add('section-hidden');
    
    toSection.classList.remove('section-hidden');
    toSection.classList.add('section-visible');
}

// Start the assessment
function startAssessment() {
    username = document.getElementById('username').value.trim();
    
    if (!username) {
        alert('Please enter your name to continue.');
        return;
    }
    
    // Reset variables
    detected = [];
    current_category_index = 0;
    current_question_index = 0;
    question_type = 'general';
    follow_up_answers = {};
    is_large_scale = false;
    has_sensitive_info = false;
    has_multiple_violations = false;
    total_affected_individuals = 0;
    should_check_breach = false;
    should_check_disclosure = false;
    
    // Switch to question section
    switchSection('user-info', 'question-section');
    
    // Start with first category's general question
    displayCurrentQuestion();
}

// Display the current question based on the current category and question indices
function displayCurrentQuestion() {
    const current_category = categories[current_category_index];
    document.getElementById('category-title').textContent = current_category.name;
    
    const questionContainer = document.getElementById('question-container');
    const yesNoButtons = document.getElementById('yesno-buttons');
    const choiceButtons = document.getElementById('choice-buttons');
    const numericInput = document.getElementById('numeric-input');
    const yesnoTip = document.getElementById('yesno-tip');
    const choiceTip = document.getElementById('choice-tip');
    const numericTip = document.getElementById('numeric-tip');
    
    // Reset containers
    const questionDiv = questionContainer.querySelector('.bg-gray-50');
    yesNoButtons.style.display = 'none';
    choiceButtons.style.display = 'none';
    numericInput.style.display = 'none';
    numericInput.classList.add('section-hidden');
    yesnoTip.style.display = 'none';
    choiceTip.style.display = 'none';
    numericTip.style.display = 'none';
    
    let currentQuestion = '';
    let questionType = 'yesno';
    let options = [];
    
    // Determine the current question based on question_type
    // Skip the general question for Final Questions category
    if (question_type === 'general') {
        if (current_category.name === 'Final Questions') {
            // Skip to sections directly
            question_type = 'sections';
            current_question_index = 0;
            if (current_category.sections && current_category.sections.length > 0) {
                currentQuestion = current_category.sections[current_question_index].question;
            }
        } else {
            currentQuestion = current_category.general;
        }
    } else if (question_type === 'general_questions') {
        if (current_category.general_questions && current_question_index < current_category.general_questions.length) {
            const q = current_category.general_questions[current_question_index];
            currentQuestion = q.question;
            questionType = q.type || 'yesno';
            options = q.options || [];
        }
    } else if (question_type === 'sections') {
        if (current_category.sections && current_question_index < current_category.sections.length) {
            currentQuestion = current_category.sections[current_question_index].question;
        }
    } else if (question_type === 'follow_up') {
        if (current_category.follow_up && current_question_index < current_category.follow_up.length) {
            const q = current_category.follow_up[current_question_index];
            // Special logic: Only show the 'how many individuals' question if the previous answer was 'yes'
            if (q.type === 'number' && current_question_index > 0) {
                // Get the previous answer
                const prevAnswer = follow_up_answers[current_category.name]?.[current_question_index - 1];
                if (prevAnswer !== 'yes') {
                    // Skip this question and move to the next follow_up
                    current_question_index++;
                    displayCurrentQuestion();
                    return;
                }
            }
            currentQuestion = q.question;
            questionType = q.type || 'yesno';
            options = q.options || [];
        }
    }
    
    // Display the question
    questionDiv.innerHTML = `<p class="text-lg text-gray-800 font-medium">${currentQuestion}</p>`;
    
    // Display appropriate input based on question type
    if (questionType === 'yesno') {
        yesNoButtons.style.display = 'flex';
        yesnoTip.style.display = 'inline';
    } else if (questionType === 'choice') {
        choiceButtons.style.display = 'block';
        choiceTip.style.display = 'inline';
        
        // Update choice button texts
        const choiceButtonElements = choiceButtons.querySelectorAll('button');
        options.forEach((option, index) => {
            if (index < choiceButtonElements.length) {
                const buttonSpan = choiceButtonElements[index].querySelector('span');
                choiceButtonElements[index].innerHTML = 
                    `<span class="inline-block w-6 h-6 rounded-full bg-court-primary text-white text-center mr-2">${index + 1}</span> ${option}`;
            }
        });
        
        // Hide extra buttons if there are fewer options
        for (let i = options.length; i < choiceButtonElements.length; i++) {
            choiceButtonElements[i].style.display = 'none';
        }
        
        // Show all buttons that are needed
        for (let i = 0; i < options.length; i++) {
            if (i < choiceButtonElements.length) {
                choiceButtonElements[i].style.display = 'block';
            }
        }
    } else if (questionType === 'number') {
        numericInput.style.display = 'block';
        numericInput.classList.remove('section-hidden');
        numericTip.style.display = 'inline';
        document.getElementById('number-input').value = '';
        document.getElementById('number-input').focus();
    }
}

// Process the user's answer and determine the next question
function processAnswer(answer) {
    // Save the previous answer for reference
    prevAnswer = answer;
    
    const current_category = categories[current_category_index];
    let currentQuestion = null;
    
    // Determine current question based on question_type
    if (question_type === 'general_questions' && current_category.general_questions) {
        currentQuestion = current_category.general_questions[current_question_index];
    } else if (question_type === 'follow_up' && current_category.follow_up) {
        currentQuestion = current_category.follow_up[current_question_index];
    }

    // If it's a numeric question and the previous answer was 'no', skip the number input
    if (currentQuestion?.type === 'number' && prevAnswer === 'no') {
        answer = '0';
    }
    
    // Special handling for numeric input validation
    if (currentQuestion?.type === 'number' && answer !== '0') {
        if (!validateNumber()) {
            return; // Don't proceed if validation fails
        }
    }
    
    // Process the answer based on question_type
    if (question_type === 'general') {
        if (answer === 'yes') {
            // Move to general_questions if they exist, otherwise move to sections
            if (current_category.general_questions && current_category.general_questions.length > 0) {
                question_type = 'general_questions';
                current_question_index = 0;
            } else {
                question_type = 'sections';
                current_question_index = 0;
            }
            
            // Special handling for category-specific logic
            if (current_category.name === 'Personal/Sensitive Information') {
                // No special handling needed here, just moving to next questions
            }
        } else {
            // If answer is no, move to the next category
            moveToNextCategory();
            return;
        }
    } else if (question_type === 'general_questions') {
        // Process general questions answers
        if (current_category.name === 'Personal/Sensitive Information') {
            if (current_question_index === 1 && answer === 'yes') { // negligence question
                should_check_breach = true;
            }
            if (current_question_index === 3 && answer === 'no') { // authorization question
                should_check_breach = true;
            }
        }
        
        // Move to the next general question or to sections
        current_question_index++;
        if (current_category.general_questions && current_question_index >= current_category.general_questions.length) {
            question_type = 'sections';
            current_question_index = 0;
        }
    } else if (question_type === 'sections') {
        // Process section question answers
        if (answer === 'yes') {
            const section = current_category.sections[current_question_index].section;
            if (!detected.includes(section)) {
                detected.push(section);
            }
            
            // Special handling for specific sections
            if (current_category.name === 'Personal/Sensitive Information') {
                const q = current_category.sections[current_question_index].question.toLowerCase();
                if (q.includes('unauthorized') || q.includes('negligence') || q.includes('improper')) {
                    should_check_breach = true;
                }
            } else if (current_category.name === 'Breaching') {
                should_check_disclosure = true;
            }
        }
        
        // Move to the next section question or to follow_up
        current_question_index++;
        if (current_category.sections && current_question_index >= current_category.sections.length) {
            // If violations detected and follow-up questions exist, move to follow_up
            if (detected.length > 0 && current_category.follow_up && current_category.follow_up.length > 0) {
                question_type = 'follow_up';
                current_question_index = 0;
            } else {
                // Otherwise, move to the next category
                moveToNextCategory();
                return;
            }
        }
    } else if (question_type === 'follow_up') {
        // Store follow-up answers
        if (!follow_up_answers[current_category.name]) {
            follow_up_answers[current_category.name] = [];
        }
        
        follow_up_answers[current_category.name].push(answer);
        
        // Process follow-up answers
        const q_data = current_category.follow_up[current_question_index]; // Current question being processed
        const q_text = q_data.question.toLowerCase();

        if (q_text.includes('sensitive personal information') && answer === 'yes') {
            has_sensitive_info = true;
            if (current_category.name === 'Personal/Sensitive Information') {
                should_check_breach = true;
            }
        } else if (q_text.includes('how many individuals')) { // This is the "how many individuals" question itself. 'answer' is the number.
            // We need the answer to the *previous* question ("Did the disclosure affect multiple individuals?")
            let previousYesNoAnswer = '';
            if (current_question_index > 0 &&
                follow_up_answers[current_category.name] &&
                follow_up_answers[current_category.name].length > current_question_index 
                ) {
                previousYesNoAnswer = follow_up_answers[current_category.name][current_question_index -1];
            }

            if (previousYesNoAnswer === 'yes') {
                const affected = parseInt(answer); // 'answer' is the number entered for "how many"
                if (!isNaN(affected) && affected >= 0) { 
                    total_affected_individuals = Math.max(total_affected_individuals, affected);
                    if (affected > 1000) {
                        is_large_scale = true;
                    }
                }
            }
            // If previousYesNoAnswer was 'no', the question "how many individuals" was still asked.
            // The value entered is not used to update total_affected_individuals.
        }
        
        // Move to the next follow_up question or to the next category
        current_question_index++;
        if (current_category.follow_up && current_question_index >= current_category.follow_up.length) {
            // Move to the next category
            moveToNextCategory();
            return;
        }
    }
    
    // Display the next question
    displayCurrentQuestion();
}

// Function to handle Yes/No answers (to match HTML button onclick)
function answerQuestion(answer) {
    processAnswer(answer);
}

// Function to handle multiple choice answers (to match HTML button onclick)
function answerChoice(choice) {
    processAnswer(choice.toString());
}

// Function to handle Enter key in numeric input
document.addEventListener('DOMContentLoaded', function() {
    const numberInput = document.getElementById('number-input');
    if (numberInput) {
        numberInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                submitNumber();
            }
        });
    }
    
    // Add Enter key support for username input to start assessment
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                startAssessment();
            }
        });
    }
      // Add keyboard event listener for the entire document
    document.addEventListener('keydown', function(event) {
        // Check if we're in the user-info section and Enter key is pressed
        if (document.getElementById('user-info').classList.contains('section-visible') && event.key === 'Enter') {
            const username = document.getElementById('username').value.trim();
            if (username) {
                startAssessment();
                event.preventDefault();
            }
        }
        
        // Only process question section keyboard shortcuts if we're in the question section
        if (document.getElementById('question-section').classList.contains('section-visible')) {
            const current_category = categories[current_category_index];
            let questionType = 'yesno';
            
            // Determine question type
            if (question_type === 'general_questions' && current_category.general_questions) {
                const q = current_category.general_questions[current_question_index];
                if (q && q.type) questionType = q.type;
            } else if (question_type === 'follow_up' && current_category.follow_up) {
                const q = current_category.follow_up[current_question_index];
                if (q && q.type) questionType = q.type;
            }
            
            // Process keyboard input based on question type
            if (questionType === 'yesno') {
                if (event.key.toLowerCase() === 'y') {
                    answerQuestion('yes');
                    event.preventDefault();
                } else if (event.key.toLowerCase() === 'n') {
                    answerQuestion('no');
                    event.preventDefault();
                }
            } else if (questionType === 'choice') {
                if (event.key >= '1' && event.key <= '3') {
                    answerChoice(parseInt(event.key));
                    event.preventDefault();
                }
            }
        }
    });
});

// Function to handle numeric input submission
function submitNumber() {
    const numberInput = document.getElementById('number-input');
    const value = numberInput.value.trim();
    
    if (value === '' || isNaN(parseInt(value))) {
        alert('Please enter a valid number.');
        return;
    }
    
    processAnswer(value);
}

// Move to the next category based on flow logic
function moveToNextCategory() {
    const current_category = categories[current_category_index];
    
    // Apply category-specific logic
    if (current_category.name === 'Personal/Sensitive Information') {
        current_category_index = 1; // Move to Breaching
    } else if (current_category.name === 'Breaching') {
        current_category_index = 2; // Move to Disclosure
    } else if (current_category.name === 'Disclosure of Information') {
        // If any violations were detected, proceed to Final Questions
        if (detected.length > 0) {
            current_category_index = 3; // Move to Final Questions
        } else {
            // If no violations, skip to report
            generateReport();
            return;
        }
    } else if (current_category.name === 'Final Questions') {
        // After Final Questions, generate the report
        generateReport();
        return;
    }
    
    // Reset for new category
    question_type = 'general';
    current_question_index = 0;
    
    // Special handling based on flow logic
    if (current_category.name === 'Personal/Sensitive Information' && current_category_index === 1) {
        if (should_check_breach) {
            // Skip the general question for Breaching if should_check_breach is true
            const breachCategory = categories[current_category_index];
            if (breachCategory.general_questions && breachCategory.general_questions.length > 0) {
                question_type = 'general_questions';
            } else {
                question_type = 'sections';
            }
        }
    } else if (current_category.name === 'Breaching' && current_category_index === 2) {
        if (should_check_disclosure) {
            // Skip the general question for Disclosure if should_check_disclosure is true
            const disclosureCategory = categories[current_category_index];
            if (disclosureCategory.general_questions && disclosureCategory.general_questions.length > 0) {
                question_type = 'general_questions';
            } else {
                question_type = 'sections';
            }
        }
    }
    
    // Display the question for the new category
    displayCurrentQuestion();
}

// Generate the report
function generateReport() {
    // Apply flow chart logic for penalties
    if (detected.length > 1) {
        has_multiple_violations = true;
        if (!detected.includes('Sec.33')) {
            detected.push('Sec.33');
        }
    }
    
    if (is_large_scale && !detected.includes('Sec.35')) {
        detected.push('Sec.35');
    }
    
    // Remove duplicates while preserving order
    detected = [...new Set(detected)];
    
    // Determine severity based on flowchart paths
    let severity_level = "Standard";
    if (is_large_scale && has_sensitive_info) {
        severity_level = "Critical";
    } else if (is_large_scale || has_sensitive_info) {
        severity_level = "High";
    } else if (has_multiple_violations) {
        severity_level = "Elevated";
    }
    
    // Generate Statement of Facts
    const violation_descriptions = detected.map(sec => dictionary[sec].desc.toLowerCase());
    let violations_text = "";
    if (violation_descriptions.length > 1) {
        violations_text = violation_descriptions.slice(0, -1).join(", ") + ", and " + violation_descriptions[violation_descriptions.length - 1];
    } else if (violation_descriptions.length === 1) {
        violations_text = violation_descriptions[0];
    } else {
        violations_text = "no specific violations";
    }
    
    // Format date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
    
    // Set report date
    document.getElementById('report-date').textContent = dateString;
    
    // Display the facts section
    const factsSection = document.getElementById('facts-section');
    const factContent = factsSection.querySelector('.p-6 .space-y-4');
    
    if (factContent) {
        factContent.innerHTML = `
            <p class="mb-3">On ${dateString}, the subject individual, <strong>${username}</strong>, was found to have potentially committed violation(s) of Republic Act No. 10173 (Data Privacy Act of 2012).</p>
            <p class="mb-3">The alleged violations involve ${violations_text}.</p>
            ${total_affected_individuals > 0 ? `<p class="mb-3">These violations affected approximately ${total_affected_individuals} individuals.</p>` : ''}
            <p>The violations constitute potential breaches under Section(s) ${detected.join(', ')} of the aforementioned Act, warranting assessment under its penal provisions.</p>
            <p class="text-sm text-gray-500 mt-4">This report is generated for legal assessment purposes only.</p>
            <div class="flex justify-end mt-4">
                <div class="bg-court-primary text-white inline-block px-3 py-1 rounded text-sm">
                    Severity: ${severity_level}
                </div>
            </div>
        `;
    }
    
    // Add a button to view full report if not already added
    const viewReportBtn = factsSection.querySelector('.flex.justify-center button');
    if (!viewReportBtn) {
        const btnContainer = factsSection.querySelector('.flex.justify-center');
        if (btnContainer) {
            btnContainer.innerHTML = `
                <button onclick="showFullReport()" 
                        class="bg-court-secondary text-white py-3 px-6 rounded-lg hover:bg-court-primary transition duration-300 flex items-center space-x-2 group">
                    <span>View Full Assessment</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </button>
            `;
        }
    }
    // Generate the full detailed report
    generateFullReport(severity_level);
    
    // Reset display states
    document.getElementById('facts-section').style.display = 'block';
    document.getElementById('detailed-report').style.display = 'none';
    document.getElementById('full-report').classList.add('hidden');
    
    // Switch to report section
    switchSection('question-section', 'report-section');
}

// Generate detailed full report
function generateFullReport(severity_level) {
    // Violations Summary
    const violationsContent = document.getElementById('violations-content');
    let violationsHTML = '';
    
    if (detected.length === 0) {
        violationsHTML = `<p>No specific violations of RA 10173 were detected based on the provided information.</p>`;
    } else {
        violationsHTML = `<ul class="list-disc pl-5 space-y-2">`;
        detected.forEach(section => {
            violationsHTML += `
                <li class="text-gray-700">
                    <span class="font-medium">${section}:</span> ${dictionary[section].desc}
                </li>
            `;
        });
        violationsHTML += `</ul>`;
    }
    
    if (violationsContent) {
        violationsContent.innerHTML = violationsHTML;
    }
    
    // Penalties Content
    const penaltiesContent = document.getElementById('penalties-content');
    let penaltiesHTML = '';
    
    if (detected.length === 0) {
        penaltiesHTML = `<p>No penalties applicable as no violations were detected.</p>`;
    } else {
        penaltiesHTML = `
            <p class="font-medium text-gray-800 mb-2">Based on the identified violations, the following penalties may apply:</p>
            <table class="min-w-full border-collapse">
                <thead>
                    <tr class="bg-gray-50">
                        <th class="p-2 text-left border border-gray-300">Section</th>
                        <th class="p-2 text-left border border-gray-300">Violation</th>
                        <th class="p-2 text-left border border-gray-300">Fine</th>
                        <th class="p-2 text-left border border-gray-300">Imprisonment</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        detected.forEach(section => {
            penaltiesHTML += `
                <tr>
                    <td class="p-2 border border-gray-300">${section}</td>
                    <td class="p-2 border border-gray-300">${dictionary[section].desc}</td>
                    <td class="p-2 border border-gray-300">${dictionary[section].fine}</td>
                    <td class="p-2 border border-gray-300">${dictionary[section].imprisonment}</td>
                </tr>
            `;
        });
        
        penaltiesHTML += `
                </tbody>
            </table>
        `;
    }
    
    if (penaltiesContent) {
        penaltiesContent.innerHTML = penaltiesHTML;
    }
    
    // Special Considerations
    const considerationsContent = document.getElementById('considerations-content');
    let considerationsHTML = '';
    
    considerationsHTML += `<ul class="list-disc pl-5 space-y-1">`;
    
    if (has_sensitive_info) {
        considerationsHTML += `<li class="text-red-700">This case involves sensitive personal information, which is subject to stricter penalties.</li>`;
    }
    
    if (is_large_scale) {
        considerationsHTML += `<li class="text-red-700">The large-scale nature of this violation (affecting over 1,000 individuals) escalates the penalties.</li>`;
    }
    
    if (has_multiple_violations) {
        considerationsHTML += `<li class="text-red-700">Multiple violations were detected, which may lead to compounded penalties.</li>`;
    }
    
    if (detected.includes('Sec.36')) {
        considerationsHTML += `<li class="text-red-700">The involvement of a public officer increases liability and potential penalties.</li>`;
    }
    
    if (!has_sensitive_info && !is_large_scale && !has_multiple_violations && !detected.includes('Sec.36')) {
        considerationsHTML += `<li>No special aggravating factors were identified in this case.</li>`;
    }
    
    considerationsHTML += `</ul>`;
    
    if (considerationsContent) {
        considerationsContent.innerHTML = considerationsHTML;
    }
    
    // IRR References
    const irrContent = document.getElementById('irr-content');
    let irrHTML = `
        <p class="mb-2">The following provisions of the Implementing Rules and Regulations of RA 10173 are relevant to this case:</p>
        <ul class="list-disc pl-5 space-y-1">
            <li>Rule IV - Data Privacy Principles</li>
            <li>Rule VIII - Rights of Data Subjects</li>
            <li>Rule XI - Registration and Compliance Requirements</li>
            <li>Rule XII - Security Measures for Protection of Personal Data</li>
            <li>Rule XIII - Rules on Accountability</li>
        </ul>
    `;
    
    if (irrContent) {
        irrContent.innerHTML = irrHTML;
    }
    
    // Compliance Recommendations
    const recommendationsContent = document.getElementById('recommendations-content');
    let recommendationsHTML = `<ul class="list-disc pl-5 space-y-1">`;
    
    if (detected.includes('Sec.25') || detected.includes('Sec.28')) {
        recommendationsHTML += `<li>Establish proper consent mechanisms and legal bases for data processing.</li>`;
    }
    
    if (detected.includes('Sec.26')) {
        recommendationsHTML += `<li>Implement stronger access controls and authorization processes.</li>`;
    }
    
    if (detected.includes('Sec.27')) {
        recommendationsHTML += `<li>Develop proper data disposal and retention policies.</li>`;
    }
    
    if (detected.includes('Sec.29') || detected.includes('Sec.31') || detected.includes('Sec.32')) {
        recommendationsHTML += `<li>Strengthen data security measures and confidentiality protocols.</li>`;
    }
    
    if (detected.includes('Sec.30')) {
        recommendationsHTML += `<li>Establish breach notification procedures that comply with NPC requirements.</li>`;
    }
    
    recommendationsHTML += `
        <li>Conduct regular privacy impact assessments and compliance audits.</li>
        <li>Appoint a Data Protection Officer (DPO) if not already in place.</li>
        <li>Provide regular training on data privacy to all staff members.</li>
    </ul>`;
    
    if (recommendationsContent) {
        recommendationsContent.innerHTML = recommendationsHTML;
    }
    
    // NPC Notification Requirements
    const npcContent = document.getElementById('npc-content');
    let npcHTML = '';
    
    if (detected.includes('Sec.30') || detected.includes('Sec.29')) {
        npcHTML = `
            <p class="mb-2">For data breaches, the following NPC notification requirements apply:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Notify the NPC within 72 hours of discovery of a breach.</li>
                <li>Submit a detailed incident report using the NPC prescribed form.</li>
                <li>Notify affected data subjects if the breach involves sensitive personal information.</li>
                <li>Document all breaches and remedial actions taken.</li>
            </ul>
        `;
    } else {
        npcHTML = `
            <p>Based on the identified violations, no immediate NPC notification is required. However, compliance with the following is recommended:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Registration as a Personal Information Controller/Processor with the NPC.</li>
                <li>Implementation of a Privacy Management Program.</li>
                <li>Regular submission of Annual Security Incident Reports.</li>
            </ul>
        `;
    }
    
    if (npcContent) {
        npcContent.innerHTML = npcHTML;
    }
    
    // International Transfer Requirements
    const internationalSection = document.getElementById('international-section');
    const internationalContent = document.getElementById('international-content');
    
    if (internationalSection && internationalContent) {
        if (follow_up_answers && Object.values(follow_up_answers).some(answers => 
            answers.includes('yes') && answers.some(ans => ans.toLowerCase() === 'foreigner'))) {
            internationalSection.classList.remove('hidden');
            internationalContent.innerHTML = `
                <p class="mb-2">As this case involves cross-border data transfer or foreign entities, the following additional requirements apply:</p>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Ensure the foreign recipient country has adequate data protection laws.</li>
                    <li>Implement binding corporate rules or contractual clauses for data protection.</li>
                    <li>Obtain explicit consent for cross-border data transfers from data subjects.</li>
                    <li>Document all international data transfers and maintain records.</li>
                </ul>
            `;
        } else {
            internationalSection.classList.add('hidden');
        }
    }
    
    // Add a new report button
    const newReportButton = document.querySelector('#full-report .flex.justify-center');
    if (newReportButton) {
        newReportButton.innerHTML = `
            <button onclick="resetAssessment()" 
                    class="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2.5 2v6h6M21.5 22v-6h-6"></path>
                    <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"></path>
                </svg>
                <span>Start New Assessment</span>
            </button>
        `;
    }
}

// Show the full detailed report
function showFullReport() {
    // Target the specific containers
    const factsSection = document.getElementById('facts-section');
    const fullReport = document.getElementById('full-report');
    const detailedReport = document.getElementById('detailed-report');
    
    // Make sure the full report is visible
    if (fullReport) fullReport.classList.remove('hidden');
    
    // Keep the facts section visible and also show the detailed report
    if (factsSection) factsSection.style.display = 'block';
    if (detailedReport) detailedReport.style.display = 'block';
    
    // Hide the "View Full Detailed Report" button since we're already showing it
    const viewReportBtn = factsSection ? factsSection.querySelector('.flex.justify-center') : null;
    if (viewReportBtn) {
        viewReportBtn.style.display = 'none';
    }
}

// Generate a new report
function generateNewReport() {
    // Clear any displayed reports
    const fullReport = document.getElementById('full-report');
    const factsSection = document.getElementById('facts-section');
    const detailedReport = document.getElementById('detailed-report');
    
    if (fullReport) fullReport.classList.add('hidden');
    if (factsSection) factsSection.style.display = 'block';
    if (detailedReport) detailedReport.style.display = 'none';
    
    // Make sure the view report button is visible
    const viewReportBtn = factsSection ? factsSection.querySelector('.flex.justify-center') : null;
    if (viewReportBtn) {
        viewReportBtn.style.display = 'flex';
    }
    
    // Reset to the start screen
    resetAssessment();
}

// Reset assessment and return to start
function resetAssessment() {
    // Reset all variables
    detected = [];
    current_category_index = 0;
    current_question_index = 0;
    question_type = 'general';
    follow_up_answers = {};
    is_large_scale = false;
    has_sensitive_info = false;
    has_multiple_violations = false;
    total_affected_individuals = 0;
    should_check_breach = false;
    should_check_disclosure = false;
      // Reset UI
    const fullReport = document.getElementById('full-report');
    const username = document.getElementById('username');
    const factsSection = document.getElementById('facts-section');
    const detailedReport = document.getElementById('detailed-report');
    
    if (fullReport) fullReport.classList.add('hidden');
    if (username) username.value = '';
    
    // Reset visibility of sections
    if (factsSection) factsSection.style.display = 'block';
    if (detailedReport) detailedReport.style.display = 'none';
    
    // Make the view report button visible again
    const viewReportBtn = factsSection ? factsSection.querySelector('.flex.justify-center') : null;
    if (viewReportBtn) {
        viewReportBtn.style.display = 'flex';
    }
    
    // Clear report content sections - with null checks
    const elementsToEmpty = [
        'facts-content', 'violations-content', 'penalties-content', 
        'considerations-content', 'irr-content', 'recommendations-content', 'npc-content'
    ];
    
    elementsToEmpty.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = '';
    });
    
    // Hide international section if it was shown
    const internationalSection = document.getElementById('international-section');
    if (internationalSection) internationalSection.classList.add('hidden');
    
    // Switch back to user info section
    switchSection('report-section', 'user-info');
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('ripple-button') || e.target.closest('.ripple-button')) {
        const button = e.target.classList.contains('ripple-button') ? e.target : e.target.closest('.ripple-button');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.left = e.clientX - rect.left - (ripple.offsetWidth / 2) + 'px';
        ripple.style.top = e.clientY - rect.top - (ripple.offsetHeight / 2) + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            button.removeChild(ripple);
        }, 600);
    }
});