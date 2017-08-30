import { animate, state, style, transition, trigger } from "@angular/animations";

export const fadeIn = trigger ('fadeIn', [
  transition (':enter', [
    style ({ opacity: 0 }),
    animate ('.3s', style ({ opacity: 1 }))
  ]),
]);

export const slideInOut = trigger ('slideInOut', [
  state ('*', style ({
    opacity: 1,
    transform: 'translateX(0)',
  })),
  transition (':enter', [
    style ({
      opacity: 0,
      transform: 'translateX(-20vw)',
    }),
    animate ('.5s ease-in-out', style ({
      opacity: 1,
      transform: 'translateX(0)',
    }))
  ])
]);