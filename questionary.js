const file = "Questionarios/parte4 - Risk tolerance.txt"
let id_questao
let chave_questao
let tipo_questao
let questions
let ids_questao = []

function encontrarElementosPorChave(dados, chave, valorDesejado) {
    if (Array.isArray(dados)) {
        // Se for uma matriz
        return dados.filter(item => item[chave] === valorDesejado);
    } else if (typeof dados === 'object') {
        // Se for um objeto
        const elementosEncontrados = [];
        for (const chaveItem in dados) {
            if (dados[chaveItem][chave] === valorDesejado) {
                elementosEncontrados.push(dados[chaveItem]);
            }
        }
        return elementosEncontrados[0];
    } else {
        return [];
    }
}

function proximaChave() {
    const chaves = Object.keys(window.questions);
    const indiceAtual = chaves.indexOf(window.chave_questao);

    if (indiceAtual !== -1 && indiceAtual < chaves.length - 1) {
        window.chave_questao = Object.keys(window.questions)[indiceAtual + 1]
        window.id_questao = window.questions[window.chave_questao].Identificacao
        window.tipo_questao = removerCaracteresEspeciais(window.questions[window.chave_questao]['Tipo de Resposta'])
        return true
    } else {
        return false; // N�o h� pr�xima chave
    }
}



async function loadedScript() {
    // Aqui voc� pode chamar as fun��es definidas no script importado
    window.questions = await pegarQuestions(file)
    window.chave_questao = Object.keys(window.questions)[0]
    window.id_questao = window.questions[window.chave_questao].Identificacao
    window.tipo_questao = removerCaracteresEspeciais(window.questions[window.chave_questao]['Tipo de Resposta'])
    gestaoQuestions()
}

function selectAlternativa(alternativa){
    const elementosComBorder = document.querySelectorAll('button[style*="border"]');

    elementosComBorder.forEach(elemento => {
        elemento.style.removeProperty('border')
        elemento.classList.remove("Selected")
    });
    console.log(alternativa)
    const elementoComAtributoX = document.querySelector(`button[alternativa="${alternativa}"]`);
    elementoComAtributoX.style.border = "5px solid red"
    elementoComAtributoX.classList.add("Selected")
}

function selectCheck(alternativa){
    const elementoComAtributoX = document.querySelector(`button[alternativa="${alternativa}"]`);
    if (elementoComAtributoX.style.border) {
        elementoComAtributoX.style.removeProperty('border')
        elementoComAtributoX.classList.remove("Selected")
    } else {
        elementoComAtributoX.style.border = "5px solid red"
        elementoComAtributoX.classList.add("Selected")
    }
}

function plotAlternativas(){
    const regex = /A(\d+)/;

    const aswnerBox = document.querySelector('div[id="alternativas"]')
    aswnerBox.innerHTML = ''
    const questao = window.questions[window.chave_questao]
    for (let i = 1; i <= parseInt(questao['Tipo de Resposta'].match(regex)[1]); i++) {
        let alternativa = document.createElement("button")
        alternativa.className = 'button';
        alternativa.style.backgroundColor = '#4caf50';
        alternativa.setAttribute("Alternativa",i)
        alternativa.textContent = questao[`Alternativa ${i}`]
        alternativa.setAttribute("onclick",`selectAlternativa("${i}")`);
        aswnerBox.appendChild(alternativa)
        aswnerBox.appendChild(document.createElement("br"))
    }
}

function plotCheck(){
    const regex = /C(\d+)/;

    const aswnerBox = document.querySelector('div[id="alternativas"]')
    aswnerBox.innerHTML = ''
    const questao = window.questions[window.chave_questao]
    console.log("Come�ando debug")
    console.log(window.questions)
    console.log(window.chave_questao)
    console.log(questao)
    for (let i = 1; i <= parseInt(questao['Tipo de Resposta'].match(regex)[1]); i++) {
        let alternativa = document.createElement("button")
        alternativa.className = 'button';
        alternativa.style.backgroundColor = '#4caf50';
        alternativa.setAttribute("Alternativa",i)
        alternativa.textContent = questao[`Alternativa ${i}`]
        alternativa.setAttribute("onclick",`selectCheck("${i}")`);
        aswnerBox.appendChild(alternativa)
        aswnerBox.appendChild(document.createElement("br"))
    }
}

function plotString(){
    let aswnerBox = document.querySelector('div[id="alternativas"]')
    aswnerBox.innerHTML = ''
    let stringInput = document.createElement("input")
    stringInput.classList.add('input-button')

    aswnerBox.appendChild(stringInput)
}
function plotInt(params){
    let aswnerBox = document.querySelector('div[id="alternativas"]')
    aswnerBox.innerHTML = ''
    if(params === 1) {
        let intInput = document.createElement("input")
        intInput.classList.add('input-button')
        intInput.type = "number";
        intInput.step = "1";
        aswnerBox.appendChild(intInput)
    } else {
        const questao = window.questions[window.chave_questao]
        for (let i = 1; i <= params; i++) {
            let box = document.createElement("div")
            box.style.width = "100%";
            box.style.justifyContent = "center"

            let descricao = document.createElement("p")
            descricao.textContent = questao[`Alternativa ${i}`]


            let intInput = document.createElement("input")
            intInput.classList.add('input-button')
            intInput.type = "number";
            intInput.step = "1";
            intInput.setAttribute("Alternativa",i)

            box.appendChild(descricao)
            box.appendChild(intInput)

            aswnerBox.appendChild(box)
            aswnerBox.appendChild(document.createElement("br"))
        }

    }
}

function respAlternativa(){
    let aswnerBox = document.querySelector('div[id="alternativas"]')
    let selectedButton = aswnerBox.querySelector('button.Selected');
    if(!selectedButton){
        alert("Selecione uma op��o!")
        return false
    }

    let resp = selectedButton.getAttribute('alternativa')
    window.resposta[window.id_questao] = resp
    return true

}

function respCheck(){
    let aswnerBox = document.querySelector('div[id="alternativas"]')

    let selectedButtons = aswnerBox.querySelectorAll('button.Selected');

    if(selectedButtons.length === 0){
        alert("Selecione uma op��o!")
        return false
    }

    let respostas = []
    selectedButtons.forEach(elemento => {
        respostas.push(elemento.getAttribute('alternativa'))
    });

    window.resposta[window.id_questao] = respostas
    return true
}

function respString(){
    // todo: multiplas strings input
    const input_box = document.querySelector('#alternativas > input')
    if(!input_box.value){
        alert("A resposta est� vazia")
        return false
    } else {
        window.resposta[window.id_questao] = input_box.value
        return true
    }
}

function respInt(param){
    if (param === 1) {
        const input_box = document.querySelector('#alternativas > input')
        if (!input_box.value) {
            alert("A resposta est� vazia")
            return false
        } else {
            window.resposta[window.id_questao] = input_box.value
            return true
        }
    } else {
        const input_boxs = document.querySelectorAll('#alternativas input')
        let resp = {}
        input_boxs.forEach(box => {
            if (box.value !== ''){
                resp[box.getAttribute('alternativa')] = box.value
            }
        })
        if (Object.keys(resp).length < param){
            alert('Preencha todos os campos, mesmo que com 0')
            return false
        } else {
            window.resposta[window.id_questao] = resp
            return true
        }
    }
}

function removerCaracteresEspeciais(texto) {
    const regex = /[\r\t\n]/g;
    return texto.replace(regex, '');
}

function condicionalVerifier(){
    var condi = removerCaracteresEspeciais(window.questions[window.chave_questao].Condicional.replaceAll('""',"'").replaceAll('"',""))
    if(!eval(condi)){
        window.resposta[window.id_questao] = 'Skip'
        next_question(true)
    }
}

function end(){
    localStorage.setItem("RiskAverssion", JSON.stringify(window.resposta))
    window.location.href = "/"
    console.log('Acabou')
}

function next_question(skipped = false){
    let ver_input

    if (skipped){
        if(!proximaChave()){
            end()
            return ''
        }
        console.log(window.resposta)
        showQuestion()
        return ''
    }

    let tipo = window.tipo_questao

    if(!window.resposta){
        window.resposta = {}
    }
    if (/[A-Z]\d+/.test(tipo)){
        let tipo_pratico = tipo[0]
        var match = tipo.match(/\d+/);
        let params = parseInt(match[0]);
        switch (tipo_pratico) {
            case "A":
                ver_input = respAlternativa()
                break
            case "S":
                ver_input = respString()
                break
            case "I":
                ver_input = respInt(params)
                break
            case "C":
                ver_input = respCheck()
                break
        }
    }

    if (!ver_input){
        return ''
    }

    if(!proximaChave()){
        end()
        return ''
    }

    if(window.questions[window.chave_questao].Condicional){
        condicionalVerifier()
    }

    console.log(window.resposta)
    showQuestion()
}

function showQuestion(){
    var questionText = document.querySelector('p[class="question"]')
    try{
        let questao = encontrarElementosPorChave(window.questions,"Identificacao",window.id_questao)
        console.log(questao)
        questionText.textContent = questao.Pergunta
        questionText.setAttribute("Identificador", window.id_questao)
        let tipo = questao['Tipo de Resposta']
        var match = tipo.match(/\d+/);
        if (/[A-Z]\d+/.test(tipo)){
            let tipo_pratico = tipo[0]
            let params = parseInt(match[0]);
            switch (tipo_pratico) {
                case "A":
                    plotAlternativas()
                    break
                case "S":
                    plotString()
                    break
                case "I":
                    plotInt(params)
                    break
                case "C":
                    plotCheck()
                    break
            }
        }
    } catch(e) {
        console.log(e)
    }
}

function gestaoQuestions(){
    showQuestion()
}