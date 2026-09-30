#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6be81407fcc131b0a44c1eeab4b78bd6a10cbd58a6bdeab04c50ed557a62b508/contract';
import endContract from '../../snapshots/6be81407fcc131b0a44c1eeab4b78bd6a10cbd58a6bdeab04c50ed557a62b508/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f07fa245d93b3d1b65a59a7127be487a10bf9f2b6396b98cc7321a9ad4ff2b13/contract';
import startContract from '../../snapshots/f07fa245d93b3d1b65a59a7127be487a10bf9f2b6396b98cc7321a9ad4ff2b13/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
