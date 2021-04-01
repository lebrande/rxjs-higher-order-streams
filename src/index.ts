import { range } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
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

const rows$ = range(0, ROWS);
const columns$ = range(0, COLS);

const tiles$ = columns$.pipe(
  map((x) => rows$.pipe(
    map((y) => [x, y] as Coordinates),
  )),
  mergeAll(),
);

tiles$.subscribe(renderTile);

