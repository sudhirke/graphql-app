#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6be81407fcc131b0a44c1eeab4b78bd6a10cbd58a6bdeab04c50ed557a62b508/contract';
import endContract from '../../snapshots/6be81407fcc131b0a44c1eeab4b78bd6a10cbd58a6bdeab04c50ed557a62b508/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f07fa245d93b3d1b65a59a7127be487a10bf9f2b6396b98cc7321a9ad4ff2b13/contract';
import startContract from '../../snapshots/f07fa245d93b3d1b65a59a7127be487a10bf9f2b6396b98cc7321a9ad4ff2b13/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'User', column: 'username' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'users' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('updatedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.dataTransform(endContract, 'backfill-User-updatedAt', {
        check: () => placeholder('backfill-User-updatedAt:check'),
        run: () => placeholder('backfill-User-updatedAt:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'updatedAt' }),
      this.dataTransform(endContract, 'handle-nulls-User-first_name', {
        check: () => placeholder('handle-nulls-User-first_name:check'),
        run: () => placeholder('handle-nulls-User-first_name:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'first_name' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
