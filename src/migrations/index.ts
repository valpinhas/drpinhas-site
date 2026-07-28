import * as migration_20260725_115541 from './20260725_115541';
import * as migration_20260725_230806 from './20260725_230806';
import * as migration_20260727_023214 from './20260727_023214';
import * as migration_20260728_002826 from './20260728_002826';

export const migrations = [
  {
    up: migration_20260725_115541.up,
    down: migration_20260725_115541.down,
    name: '20260725_115541',
  },
  {
    up: migration_20260725_230806.up,
    down: migration_20260725_230806.down,
    name: '20260725_230806',
  },
  {
    up: migration_20260727_023214.up,
    down: migration_20260727_023214.down,
    name: '20260727_023214',
  },
  {
    up: migration_20260728_002826.up,
    down: migration_20260728_002826.down,
    name: '20260728_002826'
  },
];
