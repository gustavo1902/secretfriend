document.addEventListener('DOMContentLoaded', function() {
    const participants = [];
    const drawResults = [];
    
    // Elementos DOM
    const participantNameInput = document.getElementById('participantName');
    const participantEmailInput = document.getElementById('participantEmail');
    const addParticipantBtn = document.getElementById('addParticipant');
    const drawBtn = document.getElementById('draw');
    const clearBtn = document.getElementById('clear');
    const participantsList = document.getElementById('participants');
    const countSpan = document.getElementById('count');
    const resultsDiv = document.getElementById('results');
    const drawResultsDiv = document.getElementById('drawResults');
    const sendEmailsBtn = document.getElementById('sendEmails');
    
    // Adicionar participante
    addParticipantBtn.addEventListener('click', function() {
        const name = participantNameInput.value.trim();
        const email = participantEmailInput.value.trim();
        
        if (name === '') {
            alert('Por favor, insira um nome para o participante.');
            return;
        }
        
        if (participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            alert('Já existe um participante com este nome.');
            return;
        }
        
        participants.push({ name, email });
        updateParticipantsList();
        
        // Limpar inputs
        participantNameInput.value = '';
        participantEmailInput.value = '';
        participantNameInput.focus();
    });
    
    // Atualizar lista de participantes
    function updateParticipantsList() {
        participantsList.innerHTML = '';
        participants.forEach((participant, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${participant.name} ${participant.email ? `(${participant.email})` : ''}</span>
                <button class="remove-btn" data-index="${index}">Remover</button>
            `;
            participantsList.appendChild(li);
        });
        
        countSpan.textContent = participants.length;
        drawBtn.disabled = participants.length < 2;
        
        // Adicionar eventos aos botões de remover
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                participants.splice(index, 1);
                updateParticipantsList();
            });
        });
    }
    
    // Realizar sorteio
    drawBtn.addEventListener('click', function() {
        if (participants.length < 2) {
            alert('É necessário pelo menos 2 participantes para realizar o sorteio.');
            return;
        }
        
        // Copiar array de participantes
        let availableParticipants = [...participants];
        drawResults.length = 0;
        
        // Embaralhar participantes
        availableParticipants = shuffleArray(availableParticipants);
        
        // Criar pares
        for (let i = 0; i < availableParticipants.length; i++) {
            const giver = availableParticipants[i];
            const receiver = availableParticipants[(i + 1) % availableParticipants.length];
            
            drawResults.push({
                giver: giver.name,
                giverEmail: giver.email,
                receiver: receiver.name
            });
        }
        
        // Exibir resultados
        showResults();
    });
    
    // Embaralhar array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Mostrar resultados
    function showResults() {
        drawResultsDiv.innerHTML = '';
        drawResults.forEach(result => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${result.giver}</strong> tirou <strong>${result.receiver}</strong>`;
            drawResultsDiv.appendChild(div);
        });
        
        resultsDiv.classList.remove('hidden');
        
        // Rolar até os resultados
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Limpar tudo
    clearBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar todos os participantes e resultados?')) {
            participants.length = 0;
            drawResults.length = 0;
            updateParticipantsList();
            resultsDiv.classList.add('hidden');
            participantNameInput.focus();
        }
    });
    
    // Enviar e-mails (simulado)
    sendEmailsBtn.addEventListener('click', function() {
        if (drawResults.length === 0) {
            alert('Nenhum resultado de sorteio para enviar.');
            return;
        }
        
        let emailsSent = 0;
        const totalEmails = drawResults.filter(r => r.giverEmail).length;
        
        if (totalEmails === 0) {
            alert('Nenhum participante tem e-mail cadastrado.');
            return;
        }
        
        // Simular envio de e-mails
        drawResults.forEach(result => {
            if (result.giverEmail) {
                // Em uma aplicação real, aqui você enviaria o e-mail
                console.log(`E-mail enviado para ${result.giverEmail}: Olá ${result.giver}, você tirou ${result.receiver} no Amigo Secreto!`);
                emailsSent++;
            }
        });
        
        alert(`E-mails enviados com sucesso para ${emailsSent} participantes!`);
    });
    
    // Permitir adicionar com Enter
    participantNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addParticipantBtn.click();
        }
    });
});
