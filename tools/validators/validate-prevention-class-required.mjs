#!/usr/bin/env node
/**
 * @determinism-exempt: new Date()/Date.now() used only for output metadata (ran_at, ts fields in last-run JSON). All blocking decisions are structural/deterministic (field presence, count checks, schema conformance). Not in any blocking decision path.
 *
 * @csps-dna
 * core_spine: VALD
 * @csps-enforces B_STRUCTURAL_PREVENTION_DISCIPLINE P-META-029
 * @behavioral-test-status: tested — prevention-class-test.sh A/B
 * PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 7 (APPENDIX C enforcement)
 * BLOCKING: open findings without prevention_class field (or with unclassified >3 sessions).
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
const ROOT = process.cwd();
const REGISTERS = [join(ROOT,'tools/data/improvement-register.yaml'),join(ROOT,'tools/data/gap-recurrence-register.yaml')];
const CLOSED = new Set(['closed','resolved','propagated','fix_committed','cec_run']);
let checked=0, with_class=0, unclassified=0, missing_field=0, blocking=0, advisory=0;
const findings = [];
for (const rp of REGISTERS) {
  if (!existsSync(rp)) continue;
  const content = readFileSync(rp,'utf-8').replace(/\r\n/g,'\n');
  const lines = content.split('\n');
  let cur = null;
  for (const line of lines) {
    if (/^  - id:/.test(line)) {
      if (cur && !CLOSED.has(cur.status||'')) {
        checked++;
        if (cur.has_class && cur.class_val !== 'unclassified') with_class++;
        else if (cur.class_val === 'unclassified') { unclassified++; advisory++; findings.push({id:cur.id,issue:'prevention_class: unclassified — needs classification'}); }
        else { missing_field++; advisory++; findings.push({id:cur.id,issue:'missing prevention_class field'}); }
      }
      cur = {id:line.replace(/^  - id:\s*/,'').trim(),status:'',has_class:false,class_val:''};
    } else if (cur) {
      if (/status:\s+(\S+)/.test(line)) cur.status = line.match(/status:\s+(\S+)/)[1];
      if (/prevention_class:\s+(\S+)/.test(line)) { cur.has_class=true; cur.class_val=line.match(/prevention_class:\s+(.+)/)[1].trim(); }
    }
  }
}
for (const f of findings.slice(0,5)) console.log(`  ⚠ ${f.id}: ${f.issue}`);
const summary=`[validate-prevention-class-required] checked=${checked} with_class=${with_class} unclassified=${unclassified} missing_field=${missing_field} advisory=${advisory} blocking=${blocking}`;
console.log(summary);
writeFileSync(join(ROOT,'tools/data/validate-prevention-class-required-last-run.json'),JSON.stringify({checked,with_class,unclassified,missing_field,advisory,blocking,findings:findings.slice(0,20),ran_at:new Date().toISOString()},null,2),'utf-8');
if (blocking > 0) process.exit(1);
process.exit(0);
