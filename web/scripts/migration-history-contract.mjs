import fs from "node:fs";
import path from "node:path";
const dir=path.resolve(import.meta.dirname,"..","supabase","migrations");
const files=fs.readdirSync(dir).filter(f=>f.endsWith(".sql")).sort();
const versions=new Map();
let failed=false;
for(const file of files){
  const m=file.match(/^(\d{8}|\d{14})_[a-z0-9_]+\.sql$/);
  if(!m){ console.error("FAIL invalid migration filename:",file); failed=true; continue; }
  const version=m[1];
  if(versions.has(version)){ console.error("FAIL duplicate migration version:",version,versions.get(version),file); failed=true; }
  versions.set(version,file);
}
if(!files.some(f=>f.startsWith("20260920203000_"))) { console.error("FAIL payments ledger migration missing"); failed=true; }
if(!files.some(f=>f.startsWith("20260921012140_"))) { console.error("FAIL reconciliation migration missing"); failed=true; }
if(failed) process.exit(1);
console.log("migration-history-contract: PASS",files.length,"unique migrations");

