from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Flowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER

ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'output/pdf/aws-case-study-nusadata.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyModule',fontName='Helvetica',fontSize=10.2,leading=14,spaceAfter=7))
styles.add(ParagraphStyle(name='SectionModule',fontName='Helvetica-Bold',fontSize=17,leading=21,spaceBefore=13,spaceAfter=10))
styles.add(ParagraphStyle(name='SubModule',fontName='Helvetica-Bold',fontSize=11.5,leading=15,spaceBefore=9,spaceAfter=6))
styles.add(ParagraphStyle(name='CellModule',fontName='Helvetica',fontSize=8.8,leading=12))
styles.add(ParagraphStyle(name='CodeModule',fontName='Courier',fontSize=8,leading=11,spaceAfter=7))
story=[]
def p(t): story.append(Paragraph(t,styles['BodyModule']))
def h(t): story.append(Paragraph(t,styles['SectionModule']))
def sub(t): story.append(Paragraph(t,styles['SubModule']))
def num(items):
    for i,t in enumerate(items,1): p(f'{i}. {t}')
def table(headers,rows,widths):
    data=[[Paragraph(escape(str(c)),styles['CellModule']) for c in headers]]+[[Paragraph(escape(str(c)),styles['CellModule']) for c in row] for row in rows]
    t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9edf1')),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.4,colors.HexColor('#b7bec5')),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    story.extend([t,Spacer(1,9)])
def page(): story.append(PageBreak())
def code(lines):
    for line in lines: story.append(Paragraph(escape(line).replace(' ','&nbsp;'),styles['CodeModule']))

class Architecture(Flowable):
    def __init__(self):
        super().__init__()
        self.width=475
        self.height=230
    def draw(self):
        c=self.canv
        def box(x,y,w,title,detail):
            c.setStrokeColor(colors.HexColor('#526374')); c.setFillColor(colors.HexColor('#f3f5f7')); c.roundRect(x,y,w,45,4,fill=1)
            c.setFillColor(colors.black); c.setFont('Helvetica-Bold',9); c.drawCentredString(x+w/2,y+28,title); c.setFont('Helvetica',8); c.drawCentredString(x+w/2,y+13,detail)
        def arrow(x,y,x2,y2):
            c.setStrokeColor(colors.HexColor('#526374')); c.line(x,y,x2,y2)
            import math
            a=math.atan2(y2-y,x2-x)
            for da in [-.45,.45]: c.line(x2,y2,x2-6*math.cos(a+da),y2-6*math.sin(a+da))
        box(0,165,100,'Branch uploader','CSV files via CLI')
        box(135,165,100,'S3 raw','incoming/*.csv')
        box(270,165,90,'SQS Standard','ingest + DLQ')
        box(385,165,90,'Lambda','validate / transform')
        arrow(100,187,135,187); arrow(235,187,270,187); arrow(360,187,385,187)
        box(385,75,90,'S3 curated','partitioned JSONL'); arrow(430,165,430,120)
        box(250,75,105,'Glue Catalog','explicit table schema'); arrow(385,98,355,98)
        box(110,75,105,'Athena','SQL workgroup'); arrow(250,98,215,98)
        box(0,75,85,'Analyst','saved SQL'); arrow(110,98,85,98)
        box(250,0,105,'DynamoDB','processing ledger')
        c.line(420,165,370,140); c.line(370,140,370,57); c.line(370,57,303,57); arrow(303,57,303,45)
        box(110,0,105,'S3 quarantine','rejection report')
        c.line(390,165,235,140); c.line(235,140,235,57); c.line(235,57,163,57); arrow(163,57,163,45)

h('Description of Project and Tasks')
p('<b>Project: NusaData - Retail Sales Data Pipeline</b><br/>Independent AWS portfolio assignment | Suggested effort: 20-30 hours over 2-3 weeks')
p('You are working as a Cloud Engineer at PT Nusa Retail Analytics. The company operates several retail branches. Each branch exports daily sales as CSV files. Analysts currently combine these files manually, leading to duplicated records, inconsistent totals, and delayed reports.')
p('You are required to implement an event-driven ingestion pipeline that validates sales files, stores queryable data, and supports SQL reporting. The infrastructure must be secure, recoverable, automated, and suitable for a small demonstration workload.')
h('Task')
num(['Read the application requirements, data contract, and architecture.','Create private storage for raw, curated, rejected, and query-result data.','Configure S3 notifications, an SQS ingestion queue, and a dead-letter queue.','Implement a Lambda processor and a processing ledger.','Create a Glue Data Catalog database and an Athena table.','Implement the required sales queries and verify their results.','Configure access controls, monitoring, and operational notifications.','Automate infrastructure deployment and application checks.','Demonstrate duplicate handling, failure recovery, and raw-data replay.','Submit the architecture, test evidence, cost record, and cleanup procedure.'])
h('Technical Details')
num(['Use one AWS Region with the required services available to your account. Verify access and estimate usage before deployment; this assignment does not guarantee zero cost.','Use Python or TypeScript with a currently supported Lambda runtime. You must implement the processor; no starter application repository is supplied.','Use the prefix <b>nusadata-dev-</b> for named resources. Add Project, Environment, and Owner tags wherever supported.','Use synthetic data only. A custom domain, website, VPC, NAT Gateway, EC2, RDS, and Glue ETL job are not required.'])
page()

h('Architecture')
story.append(Architecture())
p('The diagram shows the minimum processing path. CloudWatch monitors Lambda and SQS; CloudWatch alarms publish to an SNS topic for the operator. Athena writes query results to a separate S3 bucket.')
h('Application Details')
p('Branch staff upload files using an authenticated AWS CLI profile. A web interface is not required. Only objects under incoming/ with the .csv suffix generate ingestion notifications. The queue buffers new files while Lambda processes them.')
p('For each file, Lambda reads and validates the source object. An accepted file produces newline-delimited JSON (JSONL) in the curated bucket. A rejected file produces an error report in quarantine and no curated data. Raw source objects remain available for audit and replay.')
sub('Required processing outcomes')
table(['Outcome','Required behavior'],[
('ACCEPTED','All rows satisfy the contract. Write curated output and record row count, revenue total, and output keys.'),
('REJECTED','A permanent validation error exists. Write a reason report and acknowledge the queue message after recording rejection.'),
('DUPLICATE','An already completed source version is delivered again. Do not create extra curated rows.'),
('RETRYABLE FAILURE','An infrastructure or transient error prevents completion. Return message failure so SQS can retry.')],[105,370])
p('Each sales export must contain unique sale IDs and cover disjoint sales. The baseline handles duplicate delivery of the same source version; cross-file business-record reconciliation is optional.')
p('Use immutable keys such as incoming/JKT/2026-11-01/batch-001.csv. Do not overwrite keys for corrections. Reject or operationally prevent overwrites and document your approach.')
page()

h('Data Contract - Application Details')
p('Files must be UTF-8 CSV with one header row, comma delimiters, and the exact column order below. Limit each file to 1 MiB and 1,000 data rows for this lab. Each file must contain records for only one branch and one date.')
table(['Column','Type / validation'],[
('sale_id','Non-empty; unique within the file; use letters, digits, or hyphens.'),
('sale_date','Valid calendar date in YYYY-MM-DD format.'),
('branch_id','JKT or BDG. All rows must match the branch in the source key.'),
('product_id','Non-empty; use letters, digits, or hyphens.'),
('quantity','Integer greater than zero.'),
('unit_price_idr','Integer greater than or equal to zero; no currency symbol.')],[115,360])
p('Calculate <b>revenue_idr = quantity * unit_price_idr</b> with integer arithmetic. Any invalid row rejects the entire file. Include the line number and reason in its rejection report. The source-key date must match all row dates.')
sub('Required fixtures - create these exact files')
p('<b>incoming/JKT/2026-11-01/batch-001.csv</b>')
code(['sale_id,sale_date,branch_id,product_id,quantity,unit_price_idr','S001,2026-11-01,JKT,P001,2,50000','S002,2026-11-01,JKT,P002,1,150000'])
p('<b>incoming/BDG/2026-11-02/batch-001.csv</b>')
code(['sale_id,sale_date,branch_id,product_id,quantity,unit_price_idr','S003,2026-11-02,BDG,P001,3,25000','S004,2026-11-02,BDG,P003,1,125000'])
p('<b>incoming/JKT/2026-11-01/invalid-001.csv</b>')
code(['sale_id,sale_date,branch_id,product_id,quantity,unit_price_idr','S005,2026-11-01,JKT,P004,-1,50000'])
sub('Expected result after processing all three fixtures')
p('Two accepted files, one rejected file, four curated rows, seven units, and total revenue of <b>IDR 450,000</b>. JKT revenue is IDR 250,000; BDG revenue is IDR 200,000. P001 has five units and IDR 175,000 revenue. Re-delivering an accepted event must leave these totals unchanged.')
page()

h('Service Details')
sub('Object Storage - Amazon S3')
p('Create four buckets using nusadata-dev-{purpose}-{unique-suffix}, where purpose is raw, curated, quarantine, or results. Enable Block Public Access, disable ACL-based access, and require TLS in each bucket policy. Use SSE-S3 default encryption for the baseline.')
num(['Enable versioning on the raw bucket. Source versions must remain available throughout the replay test.','Configure ObjectCreated notifications for incoming/ and .csv to the Standard SQS queue in the same Region. Restrict the queue policy to the source bucket and account.','Write accepted output under sales/sale_date=YYYY-MM-DD/branch_id=BRANCH/{source-id}.jsonl. Store one JSON object per line, with no outer array.','Derive source-id deterministically from bucket, key, and version ID. URL-decode event keys and read the exact source version. Handle S3 test notifications without treating them as sales data.','Write rejection reports under rejected/{source-id}.json. Include source identity, validation reasons, timestamp, and processing version.','Set results expiration to seven days. Do not expire raw data before the replay demonstration. Include noncurrent versions and incomplete multipart uploads in your cleanup plan.'])
sub('Identity and Access Management')
table(['Identity','Allowed access'],[
('Branch uploader','Upload only to its assigned raw prefix. No curated, quarantine, or results access.'),
('Processor role','Read raw object versions; write curated output and rejection reports; access its ledger; consume the ingestion queue; write logs.'),
('Analyst role','Read curated data, use the project Glue catalog and Athena workgroup, and read/write project query results. No raw or quarantine access.'),
('Deployment role','Manage project resources through the chosen deployment system. Document permissions that cannot be scoped to individual resources.')],[105,370])
p('Use temporary credentials. Do not copy LabRole from the competition environment or commit access keys. Prove access restrictions using an actual test with the relevant role, not only screenshots of policies.')
page()

h('Service Details - Processing')
sub('Simple Queue Service')
table(['Setting','Required value'],[
('Queue type','Standard; source queue nusadata-dev-ingest, DLQ nusadata-dev-ingest-dlq'),
('Source retention','4 days'),('DLQ retention','14 days'),
('Visibility timeout','180 seconds'),('Redrive maxReceiveCount','5'),
('Lambda batch size / window','1 message / 0 seconds')],[160,315])
p('A message may contain multiple S3 records. Process all records safely. Return a failed message identifier if a retryable error occurs; previously completed records must remain safe to reprocess. Expand batch size only after baseline verification.')
sub('Lambda Function')
p('Create nusadata-dev-processor with a 30-second timeout and an initial 256 MiB memory allocation. Keep it outside a VPC. Use normal on-demand execution and bound test traffic. Document any memory or timeout adjustment using measured execution results.')
p('Validate the complete file before publishing curated data. Permanent validation failures must not loop through retries. Unexpected errors must remain visible to monitoring and queue recovery; do not silently acknowledge failed processing.')
sub('Processing Ledger - DynamoDB')
p('Create nusadata-dev-ledger in on-demand mode with source_id as the partition key. Record source bucket/key/version, status, processing version, timestamps, row count, revenue, and output location. Use conditional writes to coordinate claims and completion.')
p('Track IN_PROGRESS, ACCEPTED, and REJECTED. An IN_PROGRESS claim must have a lease expiry so a crash does not permanently block replay. Competing processors must not both own an active lease. Keep test ledger records until evidence is captured.')
sub('Crash Recovery and Idempotency')
p('Use a deterministic output key and deterministic transformation so retrying a source overwrites the same logical output rather than adding another file. This must remain safe if Lambda crashes after writing S3 output but before marking the ledger complete.')
p('Demonstrate that failure window explicitly. S3 and DynamoDB do not form one transaction here; document how your implementation converges. The baseline requires correct totals after processing settles, not transactional visibility across the services.')
page()

h('Service Details - Analytics')
sub('AWS Glue Data Catalog')
p('Create database nusadata_dev and external table sales_curated. Define the schema using infrastructure code or a versioned SQL migration. A crawler and Glue ETL job are not required.')
table(['Column','Athena type'],[
('sale_id','string'),('product_id','string'),('quantity','bigint'),
('unit_price_idr','bigint'),('revenue_idr','bigint'),
('source_id','string'),('processed_at','string'),
('sale_date (partition)','string'),('branch_id (partition)','string')],[240,235])
p('Use a JSON SerDe compatible with JSONL. Do not duplicate partition fields in the payload unless you explicitly verify the mapping. Register new date/branch partitions through a repeatable command or deployment step. The baseline allows partition registration after ingestion rather than inside the processor.')
sub('Amazon Athena')
num(['Create workgroup nusadata-dev-analytics using Athena SQL. Store results in the dedicated results bucket with encryption enabled.','Enforce workgroup configuration. Set a 10 MiB per-query bytes-scanned cutoff and enable workgroup metrics. This is a scan control, not a guaranteed account-wide spending cap.','Provide SQL for total row count, units and revenue; daily revenue; branch revenue; and units/revenue per product.','Run all queries against the fixtures and save query execution IDs, result exports, duration, and bytes scanned.','Run a query filtered by one sale_date partition. Compare its bytes scanned with an unfiltered query; explain small-file effects and do not claim savings unsupported by measurements.'])
sub('Required Query Checks')
p('The aggregate query must return 4 rows, 7 units, and IDR 450,000. The date query must show IDR 250,000 for 2026-11-01 and IDR 200,000 for 2026-11-02. The invalid file must contribute no data. Run the checks again after duplicate delivery and after failure recovery.')
page()

h('Automation and Operational Details')
sub('Infrastructure and Deployment')
p('Use Terraform, CloudFormation, or AWS SAM. A fresh checkout must contain the infrastructure definitions, processor source, dependencies, SQL, fixtures, and verification scripts. Pin dependencies and document prerequisites.')
num(['Create a pull-request workflow that validates infrastructure and runs processor tests with fixtures. Tests must include invalid headers, invalid values, duplicate IDs, and deterministic output.','Use GitHub Actions OIDC for deployment. Restrict trust to the intended repository and branch or protected environment.','On merge to the deployment branch, deploy dev, upload fixtures, register partitions, and run smoke checks. Avoid rerunning the fixture upload under new keys on every deployment.','Expose bucket names, queue URLs, function name, table name, workgroup, and database as deployment outputs.','Document one command or script for deploy, verification, replay, and teardown. A second full production environment is optional.'])
sub('CloudWatch and SNS')
p('Retain application logs for seven days. Emit structured records containing source_id, request_id, status, row_count, duration_ms, and error_code. Do not log file contents or credentials.')
p('Create alarms for visible DLQ messages (at least 1), oldest source-queue message age (over 300 seconds), and Lambda Errors (at least 1 in five minutes). Send notifications to nusadata-dev-ops SNS and confirm the operator email subscription.')
p('Emit a ProcessingFailure metric when returning SQS batch item failures: partial failures may not appear in Lambda Errors. Create an alarm for this metric and show one successful notification.')
sub('Recovery and Replay')
p('Temporarily deny curated writes to simulate an infrastructure failure. Capture retries and DLQ arrival. Restore permissions, redrive messages, and verify the expected totals. Restore every temporary fault before completing the lab.')
p('For raw replay, use a separate empty recovery bucket and ledger, point a temporary processor configuration at them, and reprocess only the two accepted raw source versions. Create a separate recovery table or database for validation. The rejected file can be replayed to confirm rejection. Compare totals; do not mix recovery output into the production table.')
page()

h('Verification and Assessment')
p('Perform tests in an isolated dev environment. Record initial state, exact action, observed result, and supporting evidence. Expected outcomes below are acceptance criteria, not claims that your implementation already meets them.')
table(['ID','Test','Expected result'],[
('01','Upload the two valid fixtures','2 ACCEPTED ledger records; 4 rows; 7 units; IDR 450,000.'),
('02','Upload the invalid fixture','REJECTED with line/reason; no additional curated rows.'),
('03','Replay an accepted source event','Aggregate totals and output-object count remain unchanged.'),
('04','Crash after output write, before completion','Retry recovers after lease expiry; no extra rows.'),
('05','Deny curated writes; then recover','Failures visible; message reaches DLQ; redrive succeeds.'),
('06','Test uploader and analyst roles','Uploader cannot read curated; analyst cannot read raw.'),
('07','Attempt anonymous bucket access','Access denied for all four buckets.'),
('08','Run partition-filtered SQL','Correct result; execution ID and bytes scanned captured.'),
('09','Deploy from a clean checkout','Documented deployment produces a working environment.'),
('10','Replay raw versions into recovery','Recovery table matches accepted row count and totals.'),
('11','Check alarm and SNS delivery','Failure notification received; recovery state recorded.'),
('12','Teardown all project resources','Versions, result objects, queues, logs and other retained resources accounted for.')],[25,180,270])
sub('Assessment Weighting')
table(['Area','Weight'],[('Ingestion and validation','20'),('Duplicate handling and crash recovery','20'),('Catalog, SQL and correct results','20'),('IAM and storage security','15'),('Infrastructure automation and CI/CD','10'),('Monitoring and operational recovery','10'),('Documentation and cost evidence','5')],[390,85])
p('Critical acceptance failures: anonymous data access, committed credentials, incorrect baseline totals, or duplicates that inflate revenue. Fix these before presenting the project as complete.')
page()

h('Submission and Portfolio Evidence')
num(['Provide a repository containing source code, infrastructure, SQL, fixtures, and automated checks. Credit external code or templates you reuse.','Submit a final architecture diagram showing actual data flow and access boundaries. Explain any difference from the reference design.','Include a test report for all 12 verification scenarios, with command output, query results, and selected screenshots.','Provide a runbook for ingestion failure, DLQ redrive, stuck processing leases, raw replay, and teardown.','Record actual spend and credit usage for a stated observation period. Separate estimated service cost, credits consumed, and cash charged.','Record a 5-8 minute demonstration: fixture upload, SQL results, rejected file, duplicate event, access denial, and recovery.','Write a portfolio case study explaining the problem, design choices, measured results, limitations, and the next improvement. Do not describe this lab as production-proven.'])
sub('Cost and Cleanup Requirements')
p('Review service eligibility and account-plan status before starting. Keep the baseline data under 10 MiB, use only a few fixture uploads, and avoid continuous polling scripts. AWS Budgets alerts are notifications rather than a universal spending stop.')
p('Before teardown, export required evidence. Empty versioned buckets including noncurrent versions and delete markers, remove query results and recovery resources, and inspect retained log groups and deployment state. Do not remove resources belonging to other projects.')
sub('Optional Extensions - Complete the Baseline First')
p('Convert curated data to Parquet and compare scan volume using a larger synthetic dataset; add cross-file sale_id reconciliation; or build a read-only dashboard. Report measured outcomes rather than assuming that an added service improves the design.')
h('References')
p('Consult current AWS documentation before implementation. These references support service behavior; all names, limits, and expected dataset results above are assignment requirements.')
refs=[('S3 event notification types and destinations','https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html'),('Using Lambda with SQS','https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html'),('Handling errors for an SQS event source','https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html'),('Athena data usage controls','https://docs.aws.amazon.com/athena/latest/ug/workgroups-setting-control-limits-cloudwatch.html'),('AWS Free Tier account-plan terms','https://aws.amazon.com/free/free-tier-faqs/')]
for title,url in refs: p(f'<link href="{url}" color="#174a7e"><u>{title}</u></link>')
p('<i>Original portfolio exercise. Company and dataset are fictional. Prepared 3 November 2026. This is not an official AWS or LKS assessment.</i>')

def footer(c,doc):
    c.setStrokeColor(colors.HexColor('#b7bec5')); c.line(60,44,535,44)
    c.setFont('Helvetica',8); c.setFillColor(colors.HexColor('#526374'))
    c.drawString(60,31,'AWS Portfolio Assignment | NusaData | 03 November 2026')
    c.drawRightString(535,31,str(doc.page))
doc=SimpleDocTemplate(str(OUT),pagesize=(595.28,841.89),rightMargin=60,leftMargin=60,topMargin=58,bottomMargin=60,title='NusaData - AWS Cloud Computing Case Study',author='AWS Portfolio Practice',pageCompression=1)
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(OUT)
