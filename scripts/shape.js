import dereferenceToStore from 'rdf-dereference-store';
import { write } from 'shaclc-write';
import { DataFactory as DF } from 'n3';
import { shaclStoreToShexSchema, writeShexSchema } from '@jeswr/shacl2shex';
import path from 'path';
import fs from 'fs';

async function main() {
  const store = await dereferenceToStore.default(
    path.join(process.cwd(), './shapes/catalog.shc'),
    { localFiles: true }
  );

  // Creates the ShexJ schema
  const schema = await shaclStoreToShexSchema(store.store);

  if (!fs.existsSync(path.join(process.cwd(), './shex'))) {
    fs.mkdirSync(path.join(process.cwd(), './shex'));
  }

  fs.writeFileSync(
    path.join(process.cwd(), './shex/catalog.shex'),
    await writeShexSchema(schema, store.prefixes)
  );
}

main();
