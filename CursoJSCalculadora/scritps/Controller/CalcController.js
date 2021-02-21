class CalcController {

  constructor() {

    this._audio = new Audio('click.mp3');
    this._audioOnOff = false;
    this._lastOperator = '';
    this._lastNumber = '';

    this._operation = [];
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._timeEl = document.querySelector("#hora");
    this._dataEl = document.querySelector("#data");
    this._currentDate;
    this.initialize();
    this.initButtonEvents();
    this.initKeyboard();
  }

  copyToClipboard() { //Copiando dados da calculadora para area de tranferencia
    //criando novo elemento
    let input = document.createElement('input');

    //colocando valor dentro do elemento input
    input.value = this.displayCalc;

    //inserindo dentro do body
    document.body.appendChild(input);

    //selecionando conteudo
    input.select();

    //copiando informacao selecionado para o SO
    document.execCommand("Copy");

    //tirando input da tela
    input.remove();
  }

  pasteFromClipboard() {//copiando dados da area de transferencia para calculadora

    //
    document.addEventListener('paste', e => {

      //fazendo a captura do dado selecionado
      let text = e.clipboardData.getData('Text');

      //colocando na tela
      this.displayCalc = parseFloat(text);
    });

  }

  initialize() {
    this.setDisplayDateTime()
    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);

    //coloca dados na tela

    this.setLastNumberToDisplay();

    //coloando dados na tela da calculadora
    this.pasteFromClipboard();

    //adicionando duploclick a tecla AC
    document.querySelectorAll('.btn-ac').forEach(btn => {
      btn.addEventListener('dblclick', e => {

        this.toggleAudio();

      });
    });
  }

  toggleAudio() {//ligando e desligando o audio

    this._audioOnOff = !this._audioOnOff;

    //this._audioOnOff = (this._audioOnOff) ? false : true;

    //if (this._audioOnOff) {
    //this._audioOnOff = false;
    //} else {
    //this._audioOnOff = true;
    //}
  }

  playAudio() {

    if (this._audioOnOff) {
      this._audio.currentTime = 0;
      this._audio.play();

    }

  }

  initKeyboard() {

    document.addEventListener('keyup', e => {

      //habilita tocar o audio
      //this.playAudio();

      switch (e.key) {

        case 'Escape':
          this.clearAll();
          break;
        case 'Backspace':
          this.cancelEntry();
          break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
          this.addOperation(e.key);
          break;
        case 'Enter':
        case '=':
          this.calc();
          break;
        case '.':
        case ',':
          this.addDot();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(e.key));
          break;

        case 'c':
          if (e.ctrlKey) this.copyToClipboard();
          break;
      }
    });
  }

  addEventListenerAll(element, events, fn) {
    //criando eventos
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    //limpando tudo
    this._operation = [];

    //zerando 
    this._lastNumber = '';
    this._lastOperator = '';

    //coloca dados na tela
    this.setLastNumberToDisplay();

  }

  cancelEntry() {
    //limpando ultimo elemento do array
    this._operation.pop();

    //coloca dados na tela
    this.setLastNumberToDisplay();
  }

  //pegar ultima operação
  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  //se é operador
  isOperator(value) {
    //indexof busca valor dentro do array
    return (['+', '-', '*', '/', '%'].indexOf(value) > -1);

  }

  pushOperation(value) {
    //calcular de dois em dois
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  getResult() {
    //transformando em string com join 
    //e calculando com eval
    return eval(this._operation.join(""));
  }

  calc() {

    let last = '';

    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      //removendo ultimo elemento do array
      last = this._operation.pop();
      this._lastNumber = this.getResult();

    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false);
    }

    //transformando em string com join 
    //e calculando com eval
    let result = this.getResult();

    if (last == '%') {

      result /= 100;

      //fomando novo array com primeiro elemento sendo o result,      
      this._operation = [result];

    } else {
      //fomando novo array com primeiro elemento sendo o result,
      this._operation = [result];
      if (last) this._operation.push(last);
    }


    //atualiza display apos calculo
    this.setLastNumberToDisplay();

  }

  getLastItem(isOperator = true) {
    let lastItem

    for (let i = this._operation.length - 1; i >= 0; i--) {

      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      //se ultimo item for igual ao operador continua com operador
      //se não continua com ultimo numero
      lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
    }

    return lastItem;

  }

  setLastNumberToDisplay() {//mostra numeros na tela depois do calculo

    let lastNumber = this.getLastItem(false);

    if (!lastNumber) lastNumber = 0;

    this.displayCalc = lastNumber;
  }


  addOperation(value) {//adicionando nova operação

    if (isNaN(this.getLastOperation())) {

      if (this.isOperator(value)) {
        //trocar operador
        this.setLastOperation(value);

      } else {
        //insere dados no array
        this.pushOperation(value);

        //coloca dados na tela
        this.setLastNumberToDisplay();
      }

    } else {
      if (this.isOperator(value)) {
        //adicionando operadores não números ao array 
        this.pushOperation(value);
      } else {

        //convertento e contatenando ultimo valor para string
        let newValue = this.getLastOperation().toString() + value.toString();
        //adicionando valor ao array
        this.setLastOperation(newValue);

        //atualizando diplay
        this.setLastNumberToDisplay();
      }
    }

  }

  setError() {
    //adicionando Mensagem de erro ao display
    this.displayCalc = "Error";
  }

  addDot() {

    //verificar ultima operação
    let lastOperation = this.getLastOperation();

    //verifica da variavel lasOperation tem string, e se dentro dela tem um .(Ponto)
    if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return

    //se ultima operação é um operadaor ou não existir(for vazio)    
    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation('0.')
    } else {
      //se não é um operador e não é vazio
      this.setLastOperation(lastOperation.toString() + '.');
    }
    //atualiza a tela
    this.setLastNumberToDisplay();

  }

  execBtn(value) {

    //habilita tocar o audio 
    //this.playAudio();

    switch (value) {
      case 'ac':
        this.clearAll();
        break;
      case 'ce':
        this.cancelEntry();
        break;
      case 'soma':
        this.addOperation('+');
        break;
      case 'subtracao':
        this.addOperation('-');
        break;
      case 'multiplicacao':
        this.addOperation('*');
        break;
      case 'divisao':
        this.addOperation('/');
        break;
      case 'porcento':
        this.addOperation('%');
        break;
      case 'igual':
        this.calc();
        break;
      case 'ponto':
        this.addDot('.');
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value));
        break;

      default:
        this.setError();
        break;

    }

  }


  initButtonEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {
      //percorrendo os botoes e adicionando o evento de click
      this.addEventListenerAll(btn, "click drag", e => {
        //extrair texto da classe do botão btn
        let textBtn = btn.className.baseVal.replace("btn-", "");

        this.execBtn(textBtn);

      });

      this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
        btn.style.cursor = "pointer";

      });
    });
  }


  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString
      (this._locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

    this.displayTime = this.currentDate.toLocaleTimeString
      (this._locale);

  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    this._displayCalcEl.innerHTML = value;
  }

  get displayTime() {
    return this._timeEl.innerHTML;
  }

  set displayTime(value) {
    return this._timeEl.innerHTML = value;
  }

  get displayDate() {
    return this._dataEl.innerHTML;
  }

  set displayDate(value) {
    return this._dataEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(value) {
    this._currentDate = value;
  }

}