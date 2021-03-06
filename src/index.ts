import {
  from,
  fromEvent,
  interval,
  range,
  Observable,
} from 'rxjs';
import {
  map,
  mapTo,
  combineAll,
  concatAll,
  mergeAll,
  switchAll,
  zipAll,
  take,
  tap,
} from 'rxjs/operators';
import './styles.css';

type Coordinates = [y: number, x: number];

const gameMap = document.getElementById('gameMap');

const extractCoordinates = (tileRef: HTMLElement) => {
  return {
    coordinates: [
      +tileRef.getAttribute('y'),
      +tileRef.getAttribute('x'),
    ] as Coordinates,
    tileRef,
  }
}

const renderTile = (coordinates: Coordinates) => {
  const point = document.createElement('div');
  point.classList.add('Point');
  point.style.left = `${coordinates[1] * 70}px`;
  point.style.top = `${coordinates[0] * 70}px`;
  const tile = document.createElement('div');
  tile.classList.add('Tile');
  tile.setAttribute('y', coordinates[0].toString());
  tile.setAttribute('x', coordinates[1].toString());

  point.appendChild(tile);
  gameMap.appendChild(point);
}

// 1 INSTANT COLUMNS
// const instantGameColumns$ = range(0, 7);
// const gameColumns$ = instantGameColumns$;

// 2 TIME INTERVAL COLUMNS
const timeIntervalColumns$ = interval(100).pipe(
  take(7),
);
const gameColumns$ = timeIntervalColumns$;


// 1 INSTANT ROWS
// const instantGameRows$ = range(0, 11);
// const coordinates$$ = instantGameRows$.pipe(
//   map((row) => gameColumns$.pipe(
//     map((column) => [row, column] as Coordinates),
//   )),
// );

// 2 ON CLICK ROWS
const onClickGameRows$ = fromEvent(document, 'click').pipe(
  take(11),
);
const coordinates$$ = onClickGameRows$.pipe(
  map((_, row) => gameColumns$.pipe(
    map((column) => [row, column] as Coordinates),
  )),
);

// 3 TIME INTERVAL ROWS
// const timeIntervalGameRows$ = interval(400).pipe(
//   take(11),
// );
// const coordinates$$ = timeIntervalGameRows$.pipe(
//   map((_, row) => gameColumns$.pipe(
//     map((column) => [row, column] as Coordinates),
//   )),
// );

// coordinates$$ musi być Higher Order Streamem
// aby poprawnie zadziałał operatory *All
const tiles$ = coordinates$$.pipe(
  // wszystkie rzędy na raz, bez czekania
  mergeAll(),

  // po jednym rzędzie, rozpocznij następny
  // kiedy poprzedni się skończy
  // concatAll(), 

  // raczej nie oczekiwany wynik
  // jest to iloraz wszystkich kombinacji row * [row, column]
  // nalezaloby jeszcze przemapowac na jakis sensowny wynik
  // mozna w tensposob dodac 3 wymiar :D
  // combineAll(),
  // tap((t) => {
  //   console.log(t)
  // }),

  // wiersze renderują tylko tyle kolumn ile zdązą
  // przed załadowaniem kolejnego wiersza
  // switchAll(),

  // otrzymujesz tablicę wszystkich wartości
  // z kazdego streama
  // nie zgadza się format,
  // bo to jakby spłaszać cały stream do jednej tablicy
  // zipAll(),
  // tap((t) => {
  //   console.log(t)
  // }),
);

const createRenderedTitles$ = () => from(
  gameMap.querySelectorAll('[y][x]') as NodeListOf<HTMLElement>
).pipe(
  map((element) => interval(40).pipe(
    take(1),
    mapTo(element),
  )),

  // Tutaj juz trzeba zrobić concatAll,
  // aby było widac kolorowanie po jednym klocku
  concatAll(),
  map(extractCoordinates),
);

type InferObservable<T> = T extends Observable<infer V>
 ? V
 : never;
type RenderedTile = InferObservable<ReturnType<typeof createRenderedTitles$>>;

const colorTile = (tile: RenderedTile) => {
  const max = 11 * 7;
  const [y, x] = tile.coordinates.map((v) => v+1);
  const hue = (x*y/max)*100;
  console.log({ hue });
  tile.tileRef.style.backgroundColor = `hsl(${100 - hue},100%,50%)`
}

tiles$.subscribe(
  renderTile,
  () => {},
  () => {
    createRenderedTitles$().subscribe(colorTile);
  },
);


