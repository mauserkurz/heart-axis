import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component ({
  selector: 'calc',
  template: `
    <header></header>
    <article>
        <h1>Расчет ЭОС</h1>
        <form id="count-form"[formGroup]="calculatorForm" (ngSubmit)="onSubmit(myForm.value)" class="count-form">
            <label>Точность - количество знаков после запятой.<br>
                <input id="accuracy" class="" type="number" [formControl]="accuracy" min="0" max="15" value="2">
            </label><br>
            <label>Максимальная алгебраическая сумма зубцов.<br>
                <input id="maxSum" class="" type="number" [formControl]="maxSum" min="0" max="1000" value="10">
            </label><br>
            <label>Алгебраическая сумма зубцов QRS I отведения.<br>
                <input id="sumI" class="" type="number" [formControl]="sumI" required>
            </label><br>
            <label>Алгебраическая сумма зубцов QRS III отведения.<br>
                <input id="sumIII" class="" type="number" [formControl]="sumIII" required>
            </label><br>
            <label>Угл альфа в градусах<br>
                <input id="output" class="" type="text" [(ngModel)]="outputValue" readonly>
            </label><br>
            <button id="to-count">Расчитать</button>
            <button type="reset">Сбросить</button>
        </form>
    </article>
    <footer></footer>
  `
})

function verifyNum (control: FormControl): { [s: string]: boolean } {
  let value = Number (control.value);

  if (!isNaN (value) && isFinite (value)) {
    return { verified: true };
  }
}

export class CalculatorComponent implements OnInit {
  myForm: FormGroup;
  accuracy: AbstractControl;
  maxSum: AbstractControl;
  sumI: AbstractControl;
  sumIII: AbstractControl;
  outputValue: AbstractControl;

  constructor (fb: FormBuilder) {
    this.myForm = fb.group({
        'accuracy': ['', verifyNum],
        'maxSum': ['', verifyNum],
        'sumI': ['', Validators.compose([Validators.required, verifyNum])],
        'sumIII': ['', Validators.compose([Validators.required, verifyNum])],
    });
    /*
    function countAngle (accuracy?: number) {
      if (accuracy === undefined) {
        accuracy = 2;
      }
      else if (arguments.length !== 1) {
        throw new Error ('Введено не верное количество значений');
      }
      else if (!verifyNum (accuracy)) {
        throw new Error ('Введено не число');
      }
      else if (accuracy < 0 || accuracy > 15) {
        throw new Error ('Точность должна быть между 0 и 15');
      }
      else {
        return function (maxSum) {
          if (maxSum === undefined) {
            maxSum = 10;
          }
          else if (arguments.length !== 1) {
            throw new Error ('Введено не верное количество значений');
          }
          else if (!verifyNum (maxSum)) {
            throw new Error ('Введено не число');
          }
          else if (maxSum <= 0 || maxSum > 1000) {
            throw new Error ('Максимальная сумма должна быть больше 0 и меньше 1000');
          }
          else {
            return function (sumI, sumIII) {
              if (arguments.length !== 2) {
                throw new Error ('Введено не верное количество значений');
              }
              else if (!verifyNum (sumI) || !verifyNum (sumIII)) {
                throw new Error ('Введено не число');
              }
              else if (sumI < (-1 * maxSum) || sumI > maxSum) {
                throw new Error ('sumI должна быть от -' + maxSum + 'до ' + maxSum);
              }
              else if (sumIII < (-1 * maxSum) || sumIII > maxSum) {
                throw new Error ('sumIII должна быть от -' + maxSum + 'до ' + maxSum);
              }
              else {
                let coef = Math.pow (10, accuracy),
                  tanAlfa = ((sumIII / sumI) - Math.cos (120 * Math.PI / 180)) / Math.sin (120 * Math.PI / 180),
                  alfa = Math.round ((Math.atan (tanAlfa) * 180 / Math.PI) * coef) / coef;
                if (sumI < 0) {
                  if (alfa <= 0) {
                    alfa = alfa + 180;
                  }
                  else {
                    alfa = alfa - 180;
                  }
                }
                return alfa;
              }
            }
          }
        }
      }
    }

    let filterFloat = function (value) {
      if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test (value)) {
        return Number (value);
      }
      return NaN;
    };

    function getValue () {
      let accuracy = document.getElementById ('accuracy'),
        maxSum = document.getElementById ('maxSum'),
        sumI = document.getElementById ('sumI'),
        sumIII = document.getElementById ('sumIII'),
        output = document.getElementById ('output'),
        count = document.getElementById ('to-count');
      count.addEventListener ('click', function (e) {
        e.preventDefault ();
        try {
          output.value = countAngle (filterFloat (accuracy.value)) (filterFloat (maxSum.value)) (filterFloat (sumI.value), filterFloat (sumIII.value));
        }
        catch (e) {
          output.value = e.message;
        }
      })
    }

    getValue ();*/
  }

  ngOnInit (): void {
    this.getValue ();
    console.log('run');
  }

  getValue (): number {
    let accuracy: string = this.accuracy.value,
      maxSum: string = this.maxSum.value,
      sumI: string = this.sumI.value,
      sumIII: string = this.sumIII.value;
    return accuracy + maxSum + sumI + sumIII;

    /*countAngle (filterFloat (accuracy.value)) (filterFloat (maxSum.value)) (filterFloat (sumI.value), filterFloat
     (sumIII.value))*/
  }

  // TODO refactor
  onSubmit (val: string): void {
    console.log(val);
    event.preventDefault ();
      try {
        this.outputValue.value = this.getValue ();
      }
      catch (error) {
        this.outputValue.value = error.message;
      }
  }
}