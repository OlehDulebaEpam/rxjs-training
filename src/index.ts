import "./common.scss";
import {from, fromEvent, of, pipe} from "rxjs";
import {concatMap, delay, exhaustMap, filter, finalize, mergeMap, pluck, switchMap, tap} from "rxjs/operators";


const sections = document.querySelectorAll('section');
const buttons = document.querySelectorAll('.actions button');

const clicks = from(buttons).pipe(
    mergeMap((button: HTMLButtonElement) => fromEvent(button, 'click')),
    pluck('target', 'dataset', 'type')
);

const car = (section: HTMLElement) => {
    const track = document.createElement('img', {is: 'od-track'});
    track.classList.add('car');
    track.src = Math.random() > 0.5 ? './unnamed.png' : './unnamed2.png';

    return of(track).pipe(
        tap(() => {
            const sound = Math.random() > 0.5 ? './VEHHorn_Recent car horn 2 (ID 0258)_BSB.wav' : './VEHHorn_Old car horn 3 (ID 0256)_BSB.wav';

            new Audio(sound).play();
        }),
        tap((track: HTMLElement) => {
            section.appendChild(track);
        }),
        delay(2000),
        finalize(() => {
            track.remove();
        })
    );
}

const mergeCar = clicks.pipe(
    filter((type: string) => type === 'merge'),
    mergeMap(() => car(sections.item(0)))
).subscribe({
    next: v => console.log('merge', v)
});

const concatCar = clicks.pipe(
    filter((type: string) => type === 'concat'),
    concatMap(() => car(sections.item(1)))
).subscribe({
    next: v => console.log('concat', v)
});

const switchCar = clicks.pipe(
    filter((type: string) => type === 'switch'),
    switchMap(() => car(sections.item(2)))
).subscribe({
    next: v => console.log('switch', v)
});

const exhaustCar = clicks.pipe(
    filter((type: string) => type === 'exhaust'),
    exhaustMap(() => car(sections.item(3)))
).subscribe({
    next: v => console.log('exhaust', v)
});

function td(type: string) {
    return pipe();
}

class Track extends HTMLImageElement {
    constructor() {
        super();
    }

    connectedCallback() {
    }
}

customElements.define('od-track', Track, {extends: 'image'});
