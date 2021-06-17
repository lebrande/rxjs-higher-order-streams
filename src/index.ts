import { interval, fromEvent } from 'rxjs';
import {
  map,
  // mergeMap,
  // concatMap,
  switchMap,
  // exhaustMap,
  take,
} from 'rxjs/operators';
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

const columns$ = interval(200).pipe(
  take(COLS),
);
const rows$ = fromEvent(document, 'click').pipe(
  map((_, index) => index),
  take(ROWS),
);

const tiles$ = rows$.pipe(
  switchMap((y) => columns$.pipe(
    map((x) => [x, y] as Coordinates),
  )),
);

tiles$.subscribe(renderTile);

