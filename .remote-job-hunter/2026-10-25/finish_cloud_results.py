from pathlib import Path
import csv, json, sys, html

run=Path(__file__).resolve().parent
skills=Path.home()/'.codex/skills/remote-job-hunter/scripts'
sys.path.insert(0,str(skills))
import board

jobs=json.loads((run/'jobs.json').read_text(encoding='utf-8'))['jobs']
tracker=Path.home()/'.claude/remote-job-hunter/tracker.csv'
profile=Path.home()/'.claude/remote-job-hunter/profile.md'
with tracker.open(newline='',encoding='utf-8') as f:
    reader=csv.DictReader(f);fields=reader.fieldnames;rows=list(reader)
lookup={j['id']:j for j in jobs}
for row in rows:
    if row['id'] in lookup:
        j=lookup[row['id']]
        for key in ['score','posted_at','url','apply_url','source']:
            row[key]=j.get(key) or ''
with tracker.open('w',newline='',encoding='utf-8') as f:
    writer=csv.DictWriter(f,fieldnames=fields);writer.writeheader();writer.writerows(rows)

_,data=board.board_data(str(run.parent),str(tracker),str(profile))
data['jobs']=[j for j in data['jobs'] if j['id'] in lookup]
assert len(data['jobs'])==5
blob=json.dumps(data,ensure_ascii=False).replace('</','<\\/').replace('<!--','<\\!--')
page=board.PAGE.replace('{{TITLE}}',html.escape('Cloud jobs — Qurrotul A\'ini')).replace('{{DATA}}',blob)
page=page.replace("'Remote job board' +", "'Cloud job board' +")
(run/'cloud-board.html').write_text(page,encoding='utf-8')
assert all(j['score']==sum(j['score_components'].values()) for j in jobs)
assert len({j['id'] for j in jobs})==5
print('Verified five cloud-only board entries; tracker synchronized with statuses preserved.')
