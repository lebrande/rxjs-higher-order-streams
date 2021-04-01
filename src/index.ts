import { range, interval, fromEvent } from 'rxjs';
import { map, mergeAll, take } from 'rxjs/operators';
import './styles.css';

const gameMap = document.getElementById('gameMap');
const TILE_SIZE = 70;
const COLS = 7;
const ROWS = 11;

type Coordinates = [x: number, y: number];

const renderTile = ([x, y]: Coordinates) => {
  const point = document.createElement('div');
  point.classList.add('Point');
  point.style.left = `${TILE_SIZE * x}px`;
  point.style.top = `${TILE_SIZE * y}px`;
  const tile = document.createElement('div');
  tile.classList.add('Tile');

  point.appendChild(tile);
  gameMap.appendChild(point);
}

// const columns$ = range(0, COLS);
const columns$ = interval(200).pipe(
  take(COLS),
);
// const columns$ = fromEvent(document, 'click').pipe(
//   map((_, index) => index),
//   take(COLS),
// );

// const rows$ = range(0, ROWS);
const rows$ = interval(200).pipe(
  take(ROWS),
);
// const rows$ = fromEvent(document, 'click').pipe(
//   map((_, index) => index),
//   take(ROWS),
// );

const tiles$ = columns$.pipe(
  map((x) => rows$.pipe(
    map((y) => [x, y] as Coordinates),
  )),
  mergeAll(),
);

tiles$.subscribe(renderTile);

