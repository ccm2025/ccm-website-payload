import * as migration_20260109_004651 from './20260109_004651';
import * as migration_20260109_043009 from './20260109_043009';

export const migrations = [
  {
    up: migration_20260109_004651.up,
    down: migration_20260109_004651.down,
    name: '20260109_004651',
  },
  {
    up: migration_20260109_043009.up,
    down: migration_20260109_043009.down,
    name: '20260109_043009'
  },
];
