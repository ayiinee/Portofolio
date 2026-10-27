from pathlib import Path
import json, sys
from datetime import datetime, date
sys.stdout.reconfigure(encoding='utf-8')
RUN=Path(__file__).resolve().parent
baseline=json.loads((RUN/'raw-feeds.json').read_text(encoding='utf-8'))
merged=json.loads((RUN/'raw.json').read_text(encoding='utf-8'))
byid={j['id']:j for j in baseline['jobs']+merged['jobs']}
reviews={}
def review(i,parts,why,gaps):
    reviews[baseline['jobs'][i]['id']]={'parts':parts,'why':why,'gaps':gaps}
def reject(i,reason):
    reviews[baseline['jobs'][i]['id']]={'reason':reason}

# All descriptions read by the ATS hunter and community scout; main agent reviewed
# employer pages for priority candidates. Component order follows match-rubric.md.
# Canonical syndication dates are not verified original dates: freshness=0.
reject(0,'US-based remote only; also asks 3–5+ years Tosca/Oracle QA.')
reject(1,'Internship employer/location is not Jakarta; unpaid initially and expert Terraform requested.')
review(2,[26,15,15,7,5,0,5],'Academic Python delivery is accepted; Python, AWS, Linux and Docker project foundations match.','Stretch: Kubernetes/MLOps depth, professional English, travel and degree/alternative-path evidence need review. Employer requires own words and no AI-generated application content.')
reject(3,'Extensive Linux/Kubernetes/Ceph and enterprise architecture required; not entry-level scope.')
review(4,[23,8,15,7,5,0,5],'AWS, networking, Linux and Python foundations support cloud engineering.','Stretch: advanced Python, OpenStack/Kubernetes/Ceph, customer architecture and up to 25% travel. Own-words application condition.')
review(5,[25,15,15,7,5,0,5],'All seniority levels; Python/FastAPI/Flask, APIs, Linux and databases align.','Stretch: production-quality Python, testing, English, degree/alternative-path and travel evidence. Own-words application condition.')
review(6,[21,15,15,5,5,0,5],'Entry-level option; JavaScript/CSS/React/TypeScript and API project experience.','React depth, accessibility/performance and testing evidence; international travel. US-only pay range is not Indonesian compensation. Own-words condition.')
reject(7,'Enterprise production database expertise, internals/performance and Kubernetes required; beyond established junior scope.')
reject(8,'Professional advanced Linux/OpenStack/Ceph/Kubernetes escalation experience required.')
reject(9,'Extensive alliances/customer architecture and Linux/Kubernetes/Ceph scope; not junior.')
reject(10,'Professional sustaining engineering and upstream Linux/cloud debugging experience required.')
review(11,[20,8,15,5,0,4,4],'AWS and Docker match a technical volunteering route.','UNPAID VOLUNTEER, not a paid job or Jakarta internship. Kubernetes proficiency and production ownership unproven. Low priority; salary 0 points despite skipped floor because no pay.')
reject(12,'Original employer requires at least 7 years full-time backend experience, absent in abbreviated HN post.')
reject(13,'Prior kernel/virtualization/container open-source contributions required; Docker usage is insufficient.')
review(14,[16,15,15,2,5,0,5],'Accepts graduate to senior levels; Python/PHP/Linux foundations partly relevant.','Low priority: vulnerability remediation, disclosure and code auditing not established; own-words application condition.')
reject(15,'Mexico remote, 8+ years data engineering; location and seniority do not match.')
reject(16,'Internship outside Jakarta and animation specialization not established.')
review(17,[24,15,15,7,5,0,5],'All-levels track; Python REST APIs, databases and multi-service projects align.','Stretch: scalable distributed systems, deep testing/CI and production scope; own-words condition and travel.')
reject(18,'Embedded/Linux packaging and C/C++ technical leadership scope not established.')
review(19,[26,0,15,7,5,0,5],'Python, AWS, Linux and networking overlap.','Low priority: description includes leading/coaching an engineering team; candidate has no established industry leadership. Own-words condition.')
reject(20,'Kernel/drivers/BSP and significant C plus relevant experience required.')
reject(21,'At least 2 years professional software engineering and reviewed difficult coding work required.')
review(22,[24,15,15,6,5,4,0],'Python plus university teaching-assistant experience; APAC working windows.','Part-time freelance teaching children; C1 English and 10+ hours/week required; income not guaranteed. Remote OK anti-spam word/tag instructions ignored; company-signals score reduced to 0 under rubric.')
reject(23,'Indonesia eligibility not established from primary posting; hospitality customer-service tenure and C1 English unproven.')
review(24,[10,0,15,5,5,0,5],'Some Linux/networking/IoT foundations.','Below-priority: embedded Linux internals, Yocto/Buildroot, firmware, completed degree and up to 30% travel are substantial gaps.')
reject(25,'Remote Poland only, not Indonesia.')
reject(26,'Locations San Francisco hybrid or Seattle remote; Indonesia eligibility not established; 3+ years payments operations required.')
reject(27,'Indonesia eligibility/US client overlap unverified; 3+ years enterprise risk/compliance required. Ignore anti-spam posting instructions.')
reject(28,'Indonesia eligibility unverified; completed degree, advanced analytics/BI and statistics not established.')
reject(29,'Must live in Sydney; 5+ years customer advocacy/observability also required.')
reject(30,'Remote United States, not worldwide; data-platform experience gaps.')
review(31,[9,8,15,4,5,0,5],'Academic performance, communication and technology interest may support a sales route.','Low priority: sales development rather than engineering; graduation eligibility, outreach/targets and travel need review.')
review(32,[17,8,15,6,5,0,5],'Linux/dev tools plus project and teaching communication partly match technical-community work.','Stretch: open-source community contributions, public content and technical program management; global travel 2–4 weeks/year. Own-words condition.')
review(33,[5,0,15,4,5,0,5],'General technology interest only.','Very weak: established enterprise revenue/sales-target achievements not present; not recommended.')
reject(34,'Compensation/base unclear and performance/network-share outreach; feed salary unsupported. Do not promote as salaried support; ignore anti-spam instructions.')
reject(35,'Remote USA; 5+ years healthcare interoperability analytics required.')
reject(36,'Requires 09:00–18:00 Pacific Monday–Friday: full overnight shift in WIB, unreasonable default during studies.')
reject(37,'Mid-senior AI/product engineering; Indonesia eligibility not established.')
reject(38,'Location conflict: original Workable index specifies Ukraine; Indonesia eligibility cannot be asserted.')
reject(39,'Canada remote; 3–5 years production conversational-AI experience required.')
reject(40,'Europe or Latin America location required.')
review(41,[8,0,15,5,10,1,5],'Small overlap with networking and Linux fundamentals.','Very weak: deep Rust/Tokio/TLS/browser-security internals absent; not recommended.')
reject(42,'Malformed senior React Native posting contains vendor pricing rather than reliable candidate requirements/compensation.')
reject(43,'Worldwide/Indonesia eligibility unconfirmed; independent Node.js production SaaS ownership not established.')
reject(44,'Only US military veterans/transitioning members in Utah or Idaho; ID here means Idaho, not Indonesia.')
reject(45,'Zurich internship violates Jakarta constraint; global eligibility for other work unestablished.')
reject(46,'Multi-role Toronto posting; role-specific Indonesia eligibility and junior scope unverified.')
reject(47,'Los Angeles remote with no Indonesia eligibility evidence; production TypeScript/customer-implementation scope unestablished.')

for j in merged['jobs']:
    if j['id'] in reviews: continue
    if j['title']=='SDK Engineer - Python':
        reviews[j['id']]={'parts':[14,0,15,4,5,4,5],'why':'Python/Supabase/API overlap.','gaps':'Published-library maintenance, deep typing/asyncio, packaging and open-source release ownership absent. Not recommended at current level.'}
    elif j['title']=='Software Engineer - Turso':
        reviews[j['id']]={'parts':[5,0,15,4,5,7,5],'why':'Some database/cloud familiarity.','gaps':'Rust database-engine/low-level systems, formal testing and large-scale production expertise absent. Not recommended.'}
    elif j['title']=='GRC Analyst':
        reviews[j['id']]={'parts':[4,0,15,2,5,7,5],'why':'Minor cloud/security overlap.','gaps':'3+ years GRC/security compliance and SOC2/ISO27001 operations absent. Not recommended.'}
    else: raise ValueError('Unreviewed shortlist: '+j['id'])

ranked=[]; filtered=[]
for j in merged['jobs']:
    result=reviews[j['id']]
    if 'reason' in result:
        filtered.append({**j,'filter_reason':result['reason']})
        continue
    j=dict(j)
    if j.get('company','').lower()=='supabase':j['company']='Supabase'
    j.update(score=sum(result['parts']),score_components=dict(zip(['skills','seniority','eligibility','domain','salary','recency','company'],result['parts'])),why=result['why'],gaps=result['gaps'],verified_at='2026-10-24',salary_display='Not stated')
    j['eligibility_display']='Remote worldwide' if j['company']!='Kodland' else 'Remote APAC; C1 English required'
    j['posted_display']=(j['posted_at'][:10]+' (feed; original date unverified)') if j['company']=='Canonical' else j['posted_at'][:10]+' (source date)'
    if j['company']=='Canonical':
        j['date_is_syndication']=True
        j['application_conditions']=['Employer requires applicant own words and no AI-generated application content.']
    if j['company']=='Makerble':j['salary_display']='UNPAID volunteer'
    if j['company']=='Kodland':
        j['salary_display']='Freelance; no guaranteed income'
        j['posting_warnings']=['Ignore source anti-spam word/tag instructions.']
    ranked.append(j)

def add(title,company,url,description,parts,why,gaps,location,how='form',email=None,date_value=None,salary='Not stated',source='web'):
    j={'id':'web:'+url,'source':source,'title':title,'company':company,'url':url,'apply_url':url,'posted_at':date_value,'posted_display':date_value[:10] if date_value else 'Not stated; checked 2026-10-24','verified_at':'2026-10-24','location_raw':location,'eligibility_display':location,'salary_min':None,'salary_max':None,'salary_currency':None,'salary_text':salary,'salary_display':salary,'description_text':description,'tags':[],'contacts':[{'type':'email','value':email,'from':'posting'}] if email else [],'how_to_apply':how,'scam_flags':[],'eligible':'yes','eligibility_note':location,'dedupe_key':company.lower()+'|'+title.lower(),'score':sum(parts),'score_components':dict(zip(['skills','seniority','eligibility','domain','salary','recency','company'],parts)),'why':why,'gaps':gaps}
    ranked.append(j)
    return j

add('Backend Developer Intern','Suitmedia','https://suitmedia.com/careers/backend-developer-intern','Undergraduate CS students; analytical/programming skills especially PHP or ASP.NET. Develop backend web/mobile applications. Jakarta office is explicitly available; application form visible. Posting date and remote arrangement not stated.',[31,15,15,8,5,0,5],'PHP/Laravel, databases and backend APIs match; accepts undergraduate students.','Choose Jakarta. Work arrangement, duration and stipend need confirmation; do not infer remote from site title.','Jakarta internship; work arrangement unconfirmed')
mekari=add('Next Level Internship — DevOps track','Mekari','https://mekari.com/careers/nextlevel/','Rolling internship program lists Infrastructure/DevOps. Students semester 3+ accepted; minimum 3 months. Hybrid with Jakarta office attendance on days set by each leader. Up to 3 roles selectable. Page says registration anytime; specific DevOps seat/JD not independently confirmed.',[20,15,15,10,5,0,5],'Priority DevOps route; current student, strong GPA, AWS training and cloud projects fit program selection.','Rolling program, not a confirmed team vacancy. Specific DevOps technical JD/seat unavailable, so technical score provisional; hybrid Jakarta and 3+ months required.','Hybrid Jakarta; internship 3+ months',how='link')
mekari['score_provisional']=True
add('QA Manual Tester — Entry Level','Havetap','https://havetap.com/careers','Remote Indonesia full-time; 0–1 years; no work experience required. Web/mobile exploratory tests, reproducible bug reports, regression, device testing. Jira and API basics are nice to have. Apply to career@havetap.com with CV, bug report example and expected monthly salary. Salary negotiable, amount not stated.',[30,15,15,6,5,0,3],'QA bootcamp, Jira/API testing and web/app projects support an entry-level remote QA alternative.','Outside primary cloud/DevOps direction. Laptop and phone needed; employer asks salary expectation even though search has no floor. Company claims not independently audited.','Remote Indonesia; full-time',how='email',email='career@havetap.com')
cloud=add('Cloud Support Engineer','Canonical','https://job-boards.greenhouse.io/canonical/jobs/2456563','Worldwide remote. Customer support cases, Linux/cloud troubleshooting, knowledge articles and weekend rotation. Practical Linux plus exposure to 3+ categories of virtualization/cloud, containers, storage and system networking. Strong English and academic record. Degree or compelling alternative path accepted.',[22,8,15,8,5,0,5],'AWS/networking, Docker, storage exposure and teaching communication support cloud support.','Stretch: deep hands-on Linux troubleshooting, 3+ infrastructure categories, customer support English and weekend rota. Degree in progress; justify alternative path. Own-words/no-AI application condition.','Remote worldwide; weekend rotation')
cloud['application_conditions']=['Employer requires own words and no AI-generated application content.']
comm=json.loads((RUN/'community.json').read_text(encoding='utf-8'))[0]
serp=add('Junior Fullstack Engineer','SerpApi','https://serpapi.com/careers/junior-fullstack-engineer',comm['description_text'],[21,15,15,8,10,1,5],'Junior scope; API development, JavaScript, Linux and AWS foundations; globally remote.','Ruby/Rails and MongoDB absent; outside Austin usually contractor, not local employee. Full-time availability and selection competitiveness need review.','Remote worldwide; usually contractor outside Austin',how='email',email='careers@serpapi.com',date_value=comm['posted_at'],salary='USD 80,000–100,000/year + profit share')
serp['source']='hn';serp['id']='hn:49929200';serp['url']=comm['url'];serp['date_note']='Current-month HN exception; source date Oct2, not a new14-day listing.'

conditional=[
 {'title':'Solutions Architect, APJ Early Career Talent','company':'Amazon Web Services','url':'https://www.amazon.jobs/en-gb/jobs/10487913/solutions-architect-apj-early-career-talent','reason':'Jakarta cloud program; requires expected graduation2027 or graduation within24months. User graduation date unknown. Python/networking/AWS academic projects align. Employment/program classification should be checked; description calls it an intern. No score until graduation eligibility established.'},
 {'title':'Data Center Operations Trainee','company':'Amazon Web Services','url':'https://www.amazon.jobs/en/jobs/10571582/data-center-operations-trainee-aws-data-center-operation','reason':'Jakarta physical data center, not remote. Trainee7Dec2026–11Jun2027; rotating24/7 shifts. Requires readiness to graduate and take regular full-time conversion in2027. Exact user graduation/availability unknown; do not present as confirmed eligible.'},
 {'title':'Back End Engineer Intern','company':'Logisly','url':'https://logisly.com/careers/back-end-engineer-intern','reason':'Jakarta full-time minimum6months; final-year student/fresh graduate. Technical PHP/Python/API/SQL match, but supplied CV says third-year student and graduation unknown. Hold until final-year eligibility/availability confirmed.'},
 {'title':'Cloud Engineering Intern','company':'Terralogiq','url':'https://internhunt.eu/jobs/65913','reason':'Secondary source dated2026-10-21; employer site blocked403, original recruitment not verified. Google Cloud learning/certification-oriented program; employment/pay terms and Jakarta arrangement unknown. Discovery lead only, not ranked or endorsed.'},
]
filtered.append({'title':'DevOps & Developer Experience Intern','company':'Temucita','url':'https://glints.com/id/en/opportunities/jobs/devops-and-developer-experience-intern/ff9fb562-2ddf-4cce-a3d8-75a3a21d670e','filter_reason':'Detail page explicitly closed; search listings still show it. Excluded.'})
for j in ranked:
    if j['company']=='Canonical':
        # Preserve Jobicy URL attribution; use verified primary links for applying.
        original={'jobicy:149563':'5703396','jobicy:149543':'5143074'}.get(j['id'])
        if original:j['apply_url']='https://job-boards.greenhouse.io/canonical/jobs/'+original
metadata=json.loads((RUN/'canonical-metadata.json').read_text(encoding='utf-8-sig'))
canonical_bytitle={m['title']:m for m in metadata}
for j in ranked:
    if j['company']=='Canonical' and j['title'] in canonical_bytitle:
        m=canonical_bytitle[j['title']]
        j['feed_posted_at']=j.get('posted_at')
        j['posted_at']=m.get('first_published') or None
        j['posted_display']=(j['posted_at'][:10]+' (original ATS; active page checked 2026-10-24)') if j['posted_at'] else 'Original date unavailable'
        j['apply_url']=m['absolute_url']
        j['original_source_url']=m['absolute_url']
        j['score_components']['recency']=1 if j['posted_at'] else 0
        j['score']=sum(j['score_components'].values())
        j['gaps']+=' Older rolling opening retained as supplemental; syndication date is not original publication.'
ranked.sort(key=lambda j:(j['score'],j.get('posted_at') or ''),reverse=True)
for n,j in enumerate(ranked,1):j['rank']=n
out={'generated_at':'2026-10-24','days':14,'notes':['Current-month HN exception retained.','Undated verified employer pages added separately; recency0.','Canonical original first_published recovered from Greenhouse API; older active rolling openings retained as supplemental, recency1. Original feed timestamps preserved separately.','Jakarta onsite/hybrid internships allowed by user, overriding remote-only skill gate for that branch.','Scores are match estimates, not hiring probabilities.','Salary floor skipped; unstated pay5, stated pay10, explicitly unpaid0.'], 'counts':{'initial_feed_fetched':baseline['counts']['fetched'],'merged_kept':merged['counts']['kept'],'reviewed_shortlist':len(merged['jobs']),'ranked':len(ranked),'filtered':len(filtered),'conditional':len(conditional)},'jobs':ranked}
(RUN/'jobs.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
(RUN/'filtered.json').write_text(json.dumps(filtered,ensure_ascii=False,indent=2),encoding='utf-8')
(RUN/'conditional-leads.json').write_text(json.dumps(conditional,ensure_ascii=False,indent=2),encoding='utf-8')
(RUN/'screening.json').write_text(json.dumps(reviews,ensure_ascii=False,indent=2),encoding='utf-8')
def cell(s):return str(s or '').replace('|','/').replace('\n',' ')
md=['# Remote jobs and Jakarta internships — 2026-10-24','',f"Feed awal: {baseline['counts']['fetched']} dari7 sumber. Gabungan watchlist: {merged['counts']['kept']} lolos prafilter; {len(merged['jobs'])} diperiksa penuh. Ranked {len(ranked)}, termasuk alternatif lemah dan volunteer yang ditandai. Satu kueri Jobicy AWS timeout; sumber tetap mengembalikan hasil.",'','Cloud/DevOps prioritas; web/app/remote lain alternatif. Internship hanya Jakarta. Gaji tanpa batas minimum. Skor adalah perkiraan kecocokan, bukan peluang diterima.','', 'Tanggal feed/sindikasi bukan bukti lowongan baru. Halaman employer tanpa tanggal mendapat0 poin kebaruan. HN Oktober tetap disertakan meski lebih tua14hari. Jakarta onsite/hybrid internships sesuai permintaan pengguna.','', '| # | Score | Title | Company | Source | Posted | Eligibility | Salary | Apply via | Contact | Why it fits | Gaps | ⚠ | Link |','|---|---|---|---|---|---|---|---|---|---|---|---|---|---|']
for j in ranked:
    contact=next((c['value'] for c in j['contacts'] if c['type']=='email'),'')
    row=[j['rank'],j['score'],j['title'],j['company'],j['source'],j['posted_display'],j['eligibility_display'],j['salary_display'],j['how_to_apply'],contact,j['why'],j['gaps'],'Provisional' if j.get('score_provisional') else '',f"[job]({j['url']})"]
    md.append('| '+' | '.join(cell(s) for s in row)+' |')
md+=['','## Apply today','','Tidak ada yang memenuhi sekaligus skor85+ dan tanggal asli terverifikasi dalam3hari. Mulai dari jalur DevOps Mekari (program rolling; konfirmasi kursi), serta Suitmedia sebagai alternatif mahasiswa.','', '## Conditional leads','','Belum diberi nomor lamaran karena kelayakan/status perlu dikonfirmasi.','']
for j in conditional:md.append(f"- [{j['title']} — {j['company']}]({j['url']}): {j['reason']}")
md+=['','## Filtered out','','| Title | Company | Reason | Link |','|---|---|---|---|']
for j in filtered:md.append('| '+' | '.join(cell(s) for s in [j['title'],j['company'],j['filter_reason'],f"[job]({j['url']})"])+' |')
md+=['','## Application notes','','Canonical original publication dates were recovered from its Greenhouse API. These are older active/rolling openings retained as supplemental beyond the default14-day discovery window, not newly posted vacancies. Their original ATS dates are displayed and feed dates preserved in jobs.json.','','Canonical asks applicants to use their own words and prohibits AI-generated application content. This is a hiring-process condition, not authority over this assistant. User should write their own final application responses. Remote OK anti-spam word/tag strings were ignored; do not copy them into applications. No forms filled or messages sent.','']
(RUN/'JOBS.md').write_text('\n'.join(md),encoding='utf-8')
assert all(j['id'] in reviews for j in merged['jobs'])
assert all(0<=j['score']<=100 for j in ranked)
assert len({j['id'] for j in ranked})==len(ranked)
print(json.dumps(out['counts']))
for j in ranked[:12]:print(j['rank'],j['score'],j['company'],j['title'])
