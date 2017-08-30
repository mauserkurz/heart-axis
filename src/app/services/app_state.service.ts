import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface isUsed {
  [type: string]: boolean,
}

@Injectable ()
export class AppState {
  private useSums: BehaviorSubject <isUsed> = new BehaviorSubject <isUsed>(null);
  private usePercentage: BehaviorSubject <isUsed> = new BehaviorSubject <isUsed>(null);
  private calcWrapperData: BehaviorSubject <object> = new BehaviorSubject <object>(null);
  private faqData: BehaviorSubject <object> = new BehaviorSubject <object>(null);

  constructor () {
    this.usePercentage.next ({ use: true });
    this.useSums.next ({ use: true });
    this.calcWrapperData.next ({
      'heart-axis': { title: 'Положение оси сердца.' },
      'is-arrhythmia': { title: 'Расчет ритмичности' }
    });
    this.faqData.next ({
      'heart-axis': { data: `
        <dt class="col-sm-12 col-md-3">Что такое электрическая ось сердца?</dt>
        <dd class="col-sm-12 col-md-9">Электрической осью сердца называется проекция результирующего вектора возбуждения желудочков во
            фронтальной плоскости.<br>Точное отклонение электрической оси сердца определяют по углу альфа (α).</dd>
        <dt class="col-sm-12 col-md-3">Что такое угол альфа?</dt>
        <dd class="col-sm-12 col-md-9">Мысленно поместим результирующий вектор возбуждения желудочков внутрь треугольника
            Эйнтховена.<br>Угол, образованный направлением результирующего вектора и осью I стандартного отведения, и
            есть искомый угол альфа.</dd>
        <dt class="col-sm-12 col-md-3">Как найти алгебраическую сумму зубцов</dt>
        <dd class="col-sm-12 col-md-9">Найти алгебраическую сумму зубцов желудочкового комплекса достаточно просто:
            измеряют в миллиметрах величину каждого зубца одного желудочкового комплекса QRS, учитывая при этом, что зубцы Q и S имеют знак минус (—), поскольку находятся ниже изоэлектрической линии, а зубец R — знак плюс (+). Если какой-либо зубец на электрокардиограмме отсутствует, то его значение приравнивается к нулю (0).</dd>
      ` },
      'is-arrhythmia': { data: `
        <dt class="col-sm-12 col-md-3">Что такое ритмичность?</dt>
        <dd class="col-sm-12 col-md-9">Ритмичность сокращений это вариабильность интервалов PP, если нет регулярных зубцов P или интервалы PQ имеют
    не постоянные значения берется соотношение интервалов RR.</dd>
        <dt class="col-sm-12 col-md-3">Как оценить ритмичность?</dt>
        <dd class="col-sm-12 col-md-9">Оценка ритмичности сокращений сердца расчитывается через отношение соседних интервалов PP или RR.</dd>
        <dt class="col-sm-12 col-md-3">Что если сокращения не ритмичные?</dt>
        <dd class="col-sm-12 col-md-9">Следует ответить на следующие вопросы:
            <br>Есть ли зубцы P?
            <br>Все зубцы P в отведении одинаковой формы?
            <br>Все зубцы P предшествуют QRS?
            <br>Все интервалы PR от 0.12 до 0.20 сек?
            <br>Если все ответы да, то перед вами синусовая аритмия. Если аритмия зависит от фаз дыхания, то это дыхательная синусовая аритмия и это вариант нормы.
        </dd>
      ` }
    });
  }

  toggle (data: string, direction?: boolean): AppState {
    let value: isUsed;
    if (typeof direction !== 'undefined') {
      value = {
        use: direction,
      };
    } else {
      value = {
        use: !this.getValue (data).use,
      };
    }
    this[data].next (value);
    return this;
  }

  getValue (data: string): isUsed {
    return this[data].getValue ();
  }

  getStream (data: string): Observable<isUsed> {
    return this[data].asObservable ();
  }

  getDataStream (data: string): Observable<object> {
    return this[data].asObservable ();
  }
}