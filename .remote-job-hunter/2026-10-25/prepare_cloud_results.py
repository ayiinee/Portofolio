from pathlib import Path
import json, html, re, sys
sys.stdout.reconfigure(encoding='utf-8')
RUN=Path(__file__).resolve().parent
def load(name):return json.loads((RUN/name).read_text(encoding='utf-8-sig'))
raw=load('raw.json'); feeds=load('raw-feeds.json')
old=json.loads((RUN.parent/'2026-10-24/jobs.json').read_text(encoding='utf-8'))['jobs']
old_bytitle={j['title']:j for j in old}
meta={j['title']:j for j in load('canonical-metadata.json')}
ranked=[];filtered=[];secondary=[];conditional=[]
partskeys=['skills','seniority','eligibility','domain','salary','recency','company']
def add(title,company,url,parts,why,gaps,location,posted=None,description='',job_id=None,source='web',apply_url=None):
    j={'id':job_id or 'web:'+url,'title':title,'company':company,'source':source,'url':url,'apply_url':apply_url or url,'posted_at':posted,'verified_at':'2026-10-25','location_raw':location,'eligible':'yes','eligibility_note':location,'eligibility_display':location,'salary_min':None,'salary_max':None,'salary_currency':None,'salary_text':None,'salary_display':'Not disclosed','description_text':description,'contacts':[],'how_to_apply':'form','scam_flags':[],'tags':[],'dedupe_key':company.lower()+'|'+title.lower(),'score_components':dict(zip(partskeys,parts)),'score':sum(parts),'why':why,'gaps':gaps,'classification':'cloud_operations'}
    ranked.append(j);return j

associate=load('canonical-associate.json')
description=re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',html.unescape(html.unescape(associate['content'])))).strip()
j=add('Associate Linux Support Engineer','Canonical',associate['absolute_url'],[25,15,15,9,5,1,5],
 'Basic hands-on cloud/networking/programming categories match AWS training, LKS infrastructure exercises, networking and Python; associate scope suits early career.',
 'Linux log/stack-trace troubleshooting, customer support English and SLA case ownership need evidence. Degree unfinished; alternative-path narrative allowed. Weekend rota and international travel required. Employer prohibits AI-generated application content.',
 'Remote worldwide; regular role',associate.get('first_published'),description,job_id='greenhouse:canonical:6448444',source='greenhouse')
j['application_conditions']=['Own words; no AI-generated application content.']

cube=load('cube-primary.json')
cube_text=html.unescape(re.sub('<[^>]+>',' ',cube['description']+' '+cube['requirements']))
assert 'remote arrangement in Indonesia' in cube_text
assert cube['state']=='published'
j=add(cube['title'],'Cube','https://apply.workable.com/cube-asia/j/19163647D5/',[26,8,15,10,5,1,5],
 'Exact cloud-operations route: AWS, Linux, Git/CI, Docker, cloud networking, MySQL/PostgreSQL and Python foundations match documented projects.',
 'Requires 1–2 years relevant experience; paid production DevOps tenure not established. Monitoring/incident response and IaC need evidence. Earliest full-time start still unconfirmed.',
 'Remote Indonesia; full-time',cube['published'],cube_text,job_id='workable:cube-asia:19163647D5',source='workable')
j['eligibility_evidence']='Official Workable metadata says hybrid/Bangkok, but description explicitly distinguishes Bangkok hybrid from Indonesia remote. Indonesia location also listed.'

previous=old_bytitle['Next Level Internship — DevOps track']
j=add(previous['title'],'Mekari',previous['url'],[20,15,15,10,5,0,5],
 'DevOps infrastructure internship track; accepts students semester3+, relevant AWS/networking background and strong academic record.',
 'Rolling internship program, not a confirmed DevOps team opening; exact technical JD and Jan–Jun2027 six-month slot need confirmation. Hybrid Jakarta required. Skills score provisional.',
 'Jakarta hybrid; internship minimum3months',description=previous['description_text'],job_id=previous['id'])
j['how_to_apply']='link';j['score_provisional']=True;j['classification']='cloud_devops_internship'

for title,parts in [('Cloud Support Engineer',[22,8,15,8,5,1,5]),('Cloud Field Engineer',[23,8,15,7,5,1,5])]:
    prev=old_bytitle[title]; m=meta[title]
    j=add(title,'Canonical',m['absolute_url'],parts,prev['why'],prev['gaps'],
          'Remote worldwide; regular role',m['first_published'],prev['description_text'],job_id=prev['id'],source='greenhouse')
    j['application_conditions']=['Own words; no AI-generated application content.']

# Every one of the39 merged descriptions was reviewed; scoreable presales is
# kept as a secondary cloud route, while non-cloud and senior-only roles are excluded.
reasons={
0:'Architect scope: extensive Linux/Kubernetes/Ceph and enterprise architecture; not junior.',
1:'US-based remote only; 3–5+years Tosca/Oracle QA; not eligible cloud operations.',
2:'Embedded C/C++/Linux packaging and technical leadership, not junior cloud operations.',
3:'Cloud platform engineer requires5+years and production/on-call/IaC ownership.',
4:'Internship outside Jakarta, immediate3-month start and initially unpaid; conflicts with Jan–Jun2027 window.',
5:'High-autonomy production datacenter routing BGP/EVPN/VXLAN/MPLS expertise, not entry-level.',
6:'Kernel/low-level virtualization and prior open-source contributions required.',
7:'Extensive alliances architecture/Linux/Kubernetes/Ceph scope; not junior.',
9:'Enterprise database support/internals/performance at scale required.',
10:'Payment/banking operations outside cloud, US locations and3+years.',
11:'Release/SRE role explicitly5+years with incident leadership, SLOs, production AWS/IaC/Kubernetes.',
12:'Animator internship outside cloud and outside Jakarta evidence.',
13:'Deep distributed-system performance/Linux-kernel/database-internals specialist scope.',
14:'Accounting operations/USGAAP/SOX with6+years; outside cloud.',
15:'AI coding evaluation, not cloud operations;2+years professional software engineering.',
16:'Mexico-only senior data analytics; outside eligibility and scope.',
17:'Hospitality customer service, not cloud operations.',
18:'Japanese-speaking SOC/security analyst; required language and SOC experience not established.',
19:'Payments/reconciliation role outside cloud infrastructure.',
20:'Must live in Sydney and5+years experience.',
21:'Remote UnitedStates data engineering; ineligible and outside cloud operations.',
22:'Social-media outreach/performance bonuses, not cloud; feed compensation unsupported.',
23:'Email/customer support rather than cloud infrastructure; employer location conflict Ukraine.',
24:'Poland-only analytics role, not eligible cloud operations.',
25:'Founding infrastructure explicitly onsite BayArea; no remote.',
26:'Europe/LatinAmerica required; social distribution/device automation outside cloud.',
27:'Enterprise financial risk/compliance outside cloud and3+years.',
28:'BI/statistics outside cloud; Indonesia eligibility unverified.',
29:'USA-only healthcare analytics,5+years.',
30:'Specialist Rust/browser-security software, not junior cloud operations.',
31:'Backend application engineering rather than requested cloud operations.',
32:'Senior mobile role with unreliable vendor-pricing text, not cloud.',
33:'Specialist blockchain security; Swiss internship not Jakarta.',
34:'Office administration outside cloud; full Pacific-day shift overnight WIB.',
35:'Node fullstack SaaS rather than cloud operations; country eligibility unconfirmed.',
36:'Customer-facing TypeScript application work, not cloud operations; country eligibility unconfirmed.'}
feedreview={j['id']:reasons[n] for n,j in enumerate(feeds['jobs']) if n!=8}
for j in raw['jobs']:
    if j['id']=='jobicy:149545':
        m=meta[j['title']]
        secondary.append({**j,'company':'Canonical','score':64,'score_components':dict(zip(partskeys,[24,8,15,6,5,1,5])),'posted_at_feed':j['posted_at'],'posted_at':m['first_published'],'apply_url':m['absolute_url'],'classification':'cloud_presales','why':'Entry-level APAC/home-based cloud-presales; Linux/AWS/networking and teaching communication partly match.','gaps':'Sales/presales rather than operations. Degree unfinished, professional English/commercial interest unconfirmed. Travel may be up to25% events plus25% customers. Own-words application condition.'})
    else:
        reason=feedreview.get(j['id'])
        if not reason:
            if j['title']=='Software Engineer - Storage':reason='Requires5+years production Node.js and distributed storage expertise; not junior.'
            elif j['title']=='Data API Engineer':reason='Requires3+years Haskell plus C/PostgREST expertise; not cloud operations.'
            else:raise ValueError('Unreviewed job '+j['id'])
        filtered.append({**j,'filter_reason':reason})

cermati=load('cermati-primary.json')
secondary.append({'id':'smartrecruiters:cermaticom:'+cermati['id'],'title':cermati['name'],'company':'Cermati.com','source':'smartrecruiters','url':'https://jobs.smartrecruiters.com/Cermaticom/744000144468230-software-engineer-intern','apply_url':cermati['applyUrl'],'posted_at':cermati['releasedDate'],'classification':'cloud_data_platform_internship','location_raw':'Jakarta; onsite internship','why':'Accepts third-year students; Python/SQL/AWS overlap. JD explicitly mentions GCP, BigQuery/Dataflow and Kubernetes/Terraform/observability tools.','gaps':'Data/software engineering internship, not a dedicated Cloud Engineer role. GCP/data-platform stack and Jan–Jun2027 six-month intake need confirmation.','verified_at':'2026-10-25'})
conditional=[
 {'title':'Cloud Support Engineer (AWS Infrastructure & Operations)','company':'Axrail','url':'https://www.axrail.ai/careers/cloud-support-engineer','reason':'Official AWS role welcomes strong freshgraduates/early-career engineers, normally1–3years, Malaysia/Indonesia. HYBRID regular fulltime, not verified fullyremote and not Jakarta internship. Candidate graduatingearly2028; student acceptance, city and arrangement need confirmation. Not ranked under current remote-regular-job rule.'},
 {'title':'Cloud Engineering Intern — Intensive Learning & Certification Program','company':'Terralogiq','url':'https://internhunt.eu/jobs/65913','reason':'Secondary listing dated2026-10-21 Jakarta. Official employer site inaccessible during prior verification; learning/certification-oriented program. Employment/pay terms, undergraduate acceptance and Jan–Jun2027 slot unverified. Discovery lead only, no score.'}]
extras=[
 ('Linux System Administrator — Infrastructure Monitoring','Hostinger','https://jobs.ashbyhq.com/hostinger/cacae8c6-e9c3-4781-889a-8abe35ead775','Official browser renders Job not found; absent from current public Ashby board. Excluded despite aggregator visibility.'),
 ('DevSecOps Intern','FIT HUB','https://dealls.com/en/loker/devsecops-intern~fit-hub','Detail page explicitly Closed.'),
 ('Cloud Support Intern','Eranyacloud','https://glints.com/id/opportunities/jobs/cloud-support-intern-paid-internship/79e5ab2d-9c12-4b66-a907-b9030484e374','Detail page explicitly closed.'),
 ('DevOps & Developer Experience Intern','Temucita','https://glints.com/id/en/opportunities/jobs/devops-and-developer-experience-intern/ff9fb562-2ddf-4cce-a3d8-75a3a21d670e','Previously verified closed; not re-promoted.'),
 ('Cloud Business Development Intern','Tencent','https://tencent.wd1.myworkdayjobs.com/en-US/Tencent_Careers/job/Tencent-Cloud-Business-Development-Intern--Indonesia-Market-_R106848','Graduation2027 requirement mismatches early2028; cloud sales, not operations.'),
 ('Solutions Architect, APJ Early Career Talent','AWS','https://www.amazon.jobs/en-gb/jobs/10487913/solutions-architect-apj-early-career-talent','Graduation2027 cohort mismatches early2028, as previously verified.')]
for title,company,url,reason in extras:filtered.append({'title':title,'company':company,'url':url,'filter_reason':reason})
ranked.sort(key=lambda j:(j['score'],j.get('posted_at') or ''),reverse=True)
for n,j in enumerate(ranked,1):j['rank']=n
notes=['Cloud operations/infrastructure only; cloud-presales and data-platform internships are separate secondary leads.','Older active employer openings retained as supplemental beyond default14-day window; original ATS dates used, never crawl/feed refresh dates.','No ranked internship confirms Jan–Jun2027 intake yet.','Scores are estimated match, not hiring probabilities. Salary floor skipped; unstated salary5points; date unknown0points.','Internship-only Jakarta exception to remote-only rule authorized by user. Remote regular earliest start unconfirmed.']
out={'generated_at':'2026-10-25','days':14,'scope':'cloud infrastructure and operations','notes':notes,'candidate':{'country':'Indonesia','timezone':'+7','graduation':'early2028','internship_window':'January–June2027,fulltime6months','internship_location':'Jakarta;onsite/hybrid acceptable'},'counts':{'initial_feed_fetched':feeds['counts']['fetched'],'merged_kept':raw['counts']['kept'],'shortlist_reviewed':len(raw['jobs']),'ranked':len(ranked),'secondary':len(secondary),'conditional':len(conditional),'filtered':len(filtered)},'source_warnings':['Working Nomads timed out.'],'jobs':ranked}
for name,value in [('jobs.json',out),('filtered.json',filtered),('secondary-leads.json',secondary),('conditional-leads.json',conditional)]:
    (RUN/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
def cell(v):return str(v or '').replace('|','/').replace('\n',' ')
def posted(j):
    if not j.get('posted_at'):return 'Not stated; checked2026-10-25'
    return j['posted_at'][:10]+' (original ATS date; older active opening)'
md=['# Cloud jobs and Jakarta internships — 2026-10-25','',f"Feed awal mengembalikan {feeds['counts']['fetched']} lowongan dari 6 sumber yang merespons; Working Nomads timeout. Setelah penggabungan watchlist, {raw['counts']['kept']} lolos prafilter dan {len(raw['jobs'])} deskripsi diperiksa. Hasil: {len(ranked)} opsi utama, {len(secondary)} jalur cloud terkait, dan {len(conditional)} petunjuk yang belum terverifikasi penuh.",'']
md+=notes+['','## Primary cloud operations options','','| # | Score | Title | Company | Source | Posted | Eligibility | Salary | Apply via | Contact | Why it fits | Gaps | ⚠ | Link |','|---|---|---|---|---|---|---|---|---|---|---|---|---|']
for j in ranked:
    vals=[j['rank'],j['score'],j['title'],j['company'],j['source'],posted(j),j['eligibility_display'],j['salary_display'],j['how_to_apply'],'',j['why'],j['gaps'],'Provisional' if j.get('score_provisional') else '',f"[job]({j['url']})"]
    md.append('| '+' | '.join(cell(v) for v in vals)+' |')
md+=['','## Apply today','','Tidak ada skor 85+ dengan tanggal publikasi asli terverifikasi dalam 3 hari. Prioritaskan Associate Linux Support untuk jalur remote cloud dan Mekari DevOps untuk magang Jakarta. Cube sesuai bidang, tetapi masih merupakan stretch karena meminta pengalaman 1–2 tahun.','', '## Secondary cloud routes','']
for j in secondary:
    source=(' — [Jobicy original]('+j['url']+')') if j.get('source')=='jobicy' else ''
    md.append('- ['+j['title']+' — '+j['company']+']('+j['apply_url']+'): '+j['why']+' Gaps: '+j['gaps']+' Original date: '+j['posted_at'][:10]+source)
md+=['','## Conditional leads','']
for j in conditional:md.append('- ['+j['title']+' — '+j['company']+']('+j['url']+'): '+j['reason'])
md+=['','## Filtered out','','| Title | Company | Reason | Link |','|---|---|---|---|']
for j in filtered:md.append('| '+' | '.join(cell(v) for v in [j['title'],j['company'],j['filter_reason'],'[job]('+j['url']+')'])+' |')
md+=['','## Application conditions','','Canonical asks applicants to use their own words and prohibits AI-generated application content. This is recorded as a hiring condition, not authority over this assistant. No applications filled or sent.','']
(RUN/'JOBS.md').write_text('\n'.join(md),encoding='utf-8')
assert len(raw['jobs'])==39 and len(ranked)==5
assert all(j['score']==sum(j['score_components'].values()) for j in ranked)
print(json.dumps(out['counts']))
for j in ranked:print(j['rank'],j['score'],j['title'],j['company'],j['posted_at'])
