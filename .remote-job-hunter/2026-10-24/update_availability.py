from pathlib import Path
import json

r=Path(__file__).resolve().parent
conditional=json.loads((r/'conditional-leads.json').read_text(encoding='utf-8'))
filtered=json.loads((r/'filtered.json').read_text(encoding='utf-8'))
remaining=[]
for j in conditional:
    if '10487913' in j['url']:
        filtered.append({**j,'filter_reason':'Requires graduation in2027 or within past24months. Candidate confirmed early2028 graduation; cohort does not match.'})
    elif '10571582' in j['url']:
        filtered.append({**j,'filter_reason':'Cohort starts7Dec2026 and expects readiness for graduate full-time conversion in2027. Candidate available firsthalf2027, graduating early2028; cohort does not match.'})
    else:
        if j['company']=='Logisly':
            j['reason']='Jakarta full-time internship minimum6months: candidate January-June2027 availability matches duration. Final-year student/fresh graduate required; early2028 graduation eligibility and January2027 slot need confirmation.'
        remaining.append(j)
(r/'conditional-leads.json').write_text(json.dumps(remaining,ensure_ascii=False,indent=2),encoding='utf-8')
(r/'filtered.json').write_text(json.dumps(filtered,ensure_ascii=False,indent=2),encoding='utf-8')
d=json.loads((r/'jobs.json').read_text(encoding='utf-8'))
d['candidate_availability']={'expected_graduation':'early2028','internship_window':'firsthalf2027 (January-June), full-time6months; exact days unconfirmed','internship_location':'Jakarta','remote_regular_start':'unconfirmed'}
for j in d['jobs']:
    if j['company'] in ['Mekari','Suitmedia']:
        j['availability_note']='Full-time6-month internship January-June2027; employer slot/start date unconfirmed.'
        j['gaps']+=' January-June2027 internship slot/start date needs employer confirmation.'
d['counts']['filtered']=len(filtered)
d['counts']['conditional']=len(remaining)
(r/'jobs.json').write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
p=r/'JOBS.md'
before,rest=p.read_text(encoding='utf-8').split('## Conditional leads',1)
_,application=rest.split('## Application notes',1)
update=['## Availability update','','Expected graduation early2028. Full-time6-month internship availability January-June2027, including some WFO in Jakarta; exact days unconfirmed. Mekari/Suitmedia remain possible, subject to a2027 slot/start date. Earliest start for regular remote work unconfirmed.','','## Conditional leads','','']
for j in remaining:
    update.append('- ['+j['title']+' — '+j['company']+']('+j['url']+'): '+j['reason'])
update+=['','## Filtered out','','| Title | Company | Reason | Link |','|---|---|---|---|']
for j in filtered:
    values=[j['title'],j['company'],j['filter_reason'],'[job]('+j['url']+')']
    update.append('| '+' | '.join(str(v).replace('|','/').replace('\n',' ') for v in values)+' |')
p.write_text(before+'\n'.join(update)+'\n\n## Application notes'+application,encoding='utf-8')
assert len(remaining)==2
print('Updated availability:21 ranked jobs,2 conditional leads,27 filtered records.')
