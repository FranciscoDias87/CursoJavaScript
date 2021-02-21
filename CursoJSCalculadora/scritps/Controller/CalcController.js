class CalcController {

  constructor() {

    this._operation = [];
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._timeEl = document.querySelector("#hora");
    this._dataEl = document.querySelector("#data");
    this._currentDate;
    this.initialize();
    this.initButtonEvents();
  }

  initialize() {
    this.setDisplayDateTime()
    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);
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

  }

  cancelEntry() {
    //limpando ultimo elemento do array
    this._operation.pop();

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

  pushOperation(value) { //calcular de dois em dois
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  calc() {

    //removendo ultimo elemento do array
    let last = this._operation.pop()

    //transformando em string com join 
    //e calculando com eval
    let result = eval(this._operation.join(""));

    if (last == '%') {

      result /= 100;

      //fomando novo array com primeiro elemento sendo o result,      
      this._operation = [result];

    } else {
      //fomando novo array com primeiro elemento sendo o result,
      //e o segundo elemento sendo o last (ultimo carinha digitado)
      this._operation = [result, last];
    }


    //atualiza display apos calculo
    this.setLastNumberToDisplay();

  }

  setLastNumberToDisplay() {//mostra numeros na tela depois do calculo

    let lastNumber;
    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (!this.isOperator(this._operation[i])) {
        lastNumber = this._operation[i];
        break;
      }
    }
    this.displayCalc = lastNumber;
  }


  addOperation(value) {//adicionando nova operação

    if (isNaN(this.getLastOperation())) {

      if (this.isOperator(value)) {
        //trocar operador
        this.setLastOperation(value);

      } else if (isNaN(value)) {

        console.log('Outra Coisa', value);

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
        this.setLastOperation(parseInt(newValue));

        //atualizando diplay
        this.setLastNumberToDisplay();
      }
    }

  }

  setError() {
    //adicionando Mensagem de erro ao display
    this.displayCalc = "Error";
  }

  execBtn(value) {
    switch (value) {
      case 'ac':
        this.clearAll();
        break;
      case 'ac':
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

        break;
      case 'ponto':
        this.addOperation('.');
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