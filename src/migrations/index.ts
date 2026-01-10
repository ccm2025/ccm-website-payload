import * as migration_20260110_005149 from './20260110_005149';

export const migrations = [
  {
    up: migration_20260110_005149.up,
    down: migration_20260110_005149.down,
    name: '20260110_005149'
  },
];
