"""Seed realistic initial demonstration data for Capacity Connect."""
import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.models import (
    Announcement,
    Assessment,
    AssessmentAttempt,
    AssessmentQuestion,
    Category,
    Certificate,
    Course,
    CourseModule,
    CourseResource,
    Enrollment,
    Notification,
    ResourceProgress,
    Skill,
    TraineeProfile,
    TrainerProfile,
    User,
)
from app.services.certificate_service import render_certificate_pdf

logger = logging.getLogger("capacity_connect.seed")


def seed_database(db: Session) -> None:
    """Populate realistic domain taxonomy, roles, courses, assessments, and certifications."""
    # Check if admin already exists
    admin_exists = db.scalar(select(User).where(User.email == settings.FIRST_ADMIN_EMAIL.lower()))
    if admin_exists:
        logger.info("Database already contains seed data.")
        return

    logger.info("Seeding Capacity Connect demonstration database...")

    # 1. Admin User
    admin = User(
        email=settings.FIRST_ADMIN_EMAIL.lower(),
        password_hash=hash_password(settings.FIRST_ADMIN_PASSWORD),
        full_name="National Governance Administrator",
        role="admin",
        status="active",
        phone="+91 98765 00001",
        organization="Ministry of Electronics & IT / Capacity Building Commission",
        bio="National platform administrator overseeing capacity building standards, accreditation, and trainer governance.",
    )
    db.add(admin)

    # 2. Trainers
    trainer_rajesh = User(
        email="rajesh.sharma@capacity-connect.example",
        password_hash=hash_password("TrainerPassword123!"),
        full_name="Dr. Rajesh Sharma",
        role="trainer",
        status="active",
        phone="+91 98765 11002",
        organization="National Institute of Smart Governance (NISG)",
        bio="Lead Advisor in Public Sector Cybersecurity, Certified Information Security Auditor (CISA), 14+ years training civil servants.",
    )
    db.add(trainer_rajesh)
    db.flush()

    prof_rajesh = TrainerProfile(
        user_id=trainer_rajesh.id,
        expertise_subjects=["Cybersecurity in Governance", "Critical Infrastructure Protection", "ISO 27001 Compliance"],
        skills=[
            {"name": "Cybersecurity & Incident Response", "level": 5, "years": 12},
            {"name": "Threat Modeling", "level": 5, "years": 10},
            {"name": "Security Auditing & Compliance", "level": 4, "years": 8},
            {"name": "Cloud Infrastructure Security", "level": 4, "years": 6},
        ],
        qualifications=[
            {"degree": "Ph.D. in Computer Science & Security", "institution": "IIT Delhi", "year": 2012},
            {"degree": "M.Tech in Information Security", "institution": "IIT Bombay", "year": 2008},
        ],
        experience_years=14.0,
        hourly_rate=2500.0,
        availability_status=True,
    )
    db.add(prof_rajesh)

    trainer_ananya = User(
        email="ananya.verma@capacity-connect.example",
        password_hash=hash_password("TrainerPassword123!"),
        full_name="Prof. Ananya Verma",
        role="trainer",
        status="active",
        phone="+91 98765 11003",
        organization="Centre for Digital Public Infrastructure (CDPI)",
        bio="Specialist in India Stack, Aadhaar/UPI architecture, open digital ecosystems, and citizen-centric digital delivery.",
    )
    db.add(trainer_ananya)
    db.flush()

    prof_ananya = TrainerProfile(
        user_id=trainer_ananya.id,
        expertise_subjects=["Digital Public Infrastructure (DPI)", "API Architecture & Interoperability", "Data Privacy & DPDP Act"],
        skills=[
            {"name": "Digital Public Infrastructure", "level": 5, "years": 9},
            {"name": "API Architecture", "level": 4, "years": 7},
            {"name": "Data Privacy & Governance", "level": 4, "years": 6},
        ],
        qualifications=[
            {"degree": "Master in Public Policy & Technology", "institution": "IIM Ahmedabad", "year": 2015},
            {"degree": "B.Tech in Computer Science", "institution": "NIT Trichy", "year": 2012},
        ],
        experience_years=9.0,
        hourly_rate=2000.0,
        availability_status=True,
    )
    db.add(prof_ananya)

    # Pending Trainer (for admin approval workflow demo)
    trainer_vikram = User(
        email="vikram.patel@capacity-connect.example",
        password_hash=hash_password("TrainerPassword123!"),
        full_name="Vikram Patel",
        role="trainer",
        status="pending",
        phone="+91 98765 11004",
        organization="AI Governance Research Group",
        bio="AI Ethics and Governance researcher applying for certified trainer accreditation.",
    )
    db.add(trainer_vikram)
    db.flush()

    prof_vikram = TrainerProfile(
        user_id=trainer_vikram.id,
        expertise_subjects=["Responsible AI in Public Services", "Algorithmic Accountability"],
        skills=[
            {"name": "AI Policy & Ethics", "level": 4, "years": 5},
            {"name": "Machine Learning Governance", "level": 3, "years": 4},
        ],
        qualifications=[
            {"degree": "M.S. in Artificial Intelligence", "institution": "IISc Bangalore", "year": 2019},
        ],
        experience_years=5.0,
        availability_status=True,
    )
    db.add(prof_vikram)

    # 3. Trainees
    trainee_arun = User(
        email="arun.kumar@capacity-connect.example",
        password_hash=hash_password("TraineePassword123!"),
        full_name="Arun Kumar",
        role="trainee",
        status="active",
        phone="+91 98765 22001",
        organization="Department of Telecommunications",
        bio="Assistant Director working on telecom security guidelines and digital infrastructure.",
    )
    db.add(trainee_arun)
    db.flush()

    prof_arun = TraineeProfile(
        user_id=trainee_arun.id,
        department="Network Security Wing",
        designation="Assistant Director",
        employee_id="DOT-2024-884",
        qualifications=[{"degree": "B.Tech in Electronics", "institution": "Anna University", "year": 2018}],
        experience_years=6.0,
        skills=[
            {"name": "Network Administration", "level": 4},
            {"name": "Cybersecurity & Incident Response", "level": 3},
        ],
        interests=["Cybersecurity in Governance", "Digital Public Infrastructure"],
    )
    db.add(prof_arun)

    trainee_priya = User(
        email="priya.singh@capacity-connect.example",
        password_hash=hash_password("TraineePassword123!"),
        full_name="Priya Singh",
        role="trainee",
        status="active",
        phone="+91 98765 22002",
        organization="National Health Authority (NHA)",
        bio="Project Manager overseeing Ayushman Bharat Digital Mission implementations.",
    )
    db.add(trainee_priya)
    db.flush()

    prof_priya = TraineeProfile(
        user_id=trainee_priya.id,
        department="Digital Health Platforms",
        designation="Senior Technical Manager",
        employee_id="NHA-2023-109",
        qualifications=[{"degree": "Master of Computer Applications", "institution": "Delhi University", "year": 2017}],
        experience_years=7.0,
        skills=[
            {"name": "API Architecture", "level": 4},
            {"name": "Health Data Standards", "level": 4},
        ],
        interests=["Digital Public Infrastructure", "Data Privacy & DPDP Act"],
    )
    db.add(prof_priya)

    # 4. Master Taxonomy Categories
    cat_cyber = Category(
        name="Cybersecurity & Critical Infrastructure",
        slug="cybersecurity-governance",
        description="Information security, incident management, threat defense, and sovereign data protection for government systems.",
        icon="ShieldCheck",
    )
    cat_dpi = Category(
        name="Digital Public Infrastructure (DPI)",
        slug="digital-public-infrastructure",
        description="Open protocols, India Stack architectures, identity layers, and digital payments in public administration.",
        icon="Layers",
    )
    cat_ai = Category(
        name="AI & Emerging Technologies",
        slug="ai-emerging-tech",
        description="Responsible artificial intelligence, data governance, algorithmic accountability, and automated citizen services.",
        icon="Cpu",
    )
    db.add_all([cat_cyber, cat_dpi, cat_ai])
    db.flush()

    # Master Skills
    skills_data = [
        ("Cybersecurity & Incident Response", cat_cyber.id),
        ("Threat Modeling", cat_cyber.id),
        ("Security Auditing & Compliance", cat_cyber.id),
        ("Digital Public Infrastructure", cat_dpi.id),
        ("API Architecture", cat_dpi.id),
        ("Data Privacy & DPDP Act", cat_dpi.id),
        ("AI Policy & Ethics", cat_ai.id),
        ("Machine Learning Governance", cat_ai.id),
    ]
    for s_name, c_id in skills_data:
        db.add(Skill(name=s_name, category_id=c_id))
    db.flush()

    # 5. Full Courses with Modules and Resources
    course_cyber = Course(
        title="Cybersecurity Fundamentals for Government Information Systems",
        slug="cybersecurity-fundamentals-government",
        description="A comprehensive, certified training course designed for technical officers and system administrators in government departments. Covers perimeter defense, incident classification (CERT-In directives), privileged access security, and compliance auditing.",
        short_description="Essential cybersecurity, CERT-In compliance, and defense-in-depth for government IT systems.",
        category_id=cat_cyber.id,
        trainer_id=trainer_rajesh.id,
        level="intermediate",
        status="published",
        thumbnail_url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        estimated_hours=4.5,
    )
    db.add(course_cyber)
    db.flush()

    # Module 1
    m1 = CourseModule(
        course_id=course_cyber.id,
        title="Module 1: Sovereign Threat Landscape & Threat Vectors",
        description="Understanding state-sponsored APTs, supply-chain vulnerabilities, and cyber defense posture.",
        sequence_order=1,
        duration_minutes=45,
    )
    # Module 2
    m2 = CourseModule(
        course_id=course_cyber.id,
        title="Module 2: CERT-In Directives & Incident Reporting Guidelines",
        description="Mandatory 6-hour reporting workflows, log preservation norms, and forensic containment.",
        sequence_order=2,
        duration_minutes=50,
    )
    # Module 3
    m3 = CourseModule(
        course_id=course_cyber.id,
        title="Module 3: Zero Trust Architecture in Public Networks",
        description="Identity-first boundary models, multi-factor enforcement, and continuous cryptographic verification.",
        sequence_order=3,
        duration_minutes=60,
    )
    db.add_all([m1, m2, m3])
    db.flush()

    # Resources for Module 1
    r1 = CourseResource(
        module_id=m1.id,
        title="Threat Landscape Overview in Public Administration",
        resource_type="video",
        file_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        content_text="Detailed briefing on contemporary cyber attacks targeting government digital assets.",
        duration_minutes=15,
        sequence_order=1,
    )
    r2 = CourseResource(
        module_id=m1.id,
        title="National Information Security Policy Handbook (PDF)",
        resource_type="pdf",
        file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        content_text="Reference guidelines for department infosec compliance.",
        duration_minutes=30,
        sequence_order=2,
    )
    # Resources for Module 2
    r3 = CourseResource(
        module_id=m2.id,
        title="CERT-In Cyber Incident Reporting Framework",
        resource_type="text",
        content_text="""
### CERT-In Mandatory Directions Overview
Under Section 70B of the IT Act, 2000, all government organizations and service providers must report cyber security incidents within **6 hours** of noticing them.

#### Types of Mandatorily Reportable Incidents:
1. Targeted scanning/probing of critical networks and systems
2. Compromise of critical systems/information
3. Unauthorized access of IT systems/data
4. Defacement of website or intrusion into a website
5. Malicious code attacks such as Ransomware, Spyware, Trojan
6. Denial of Service (DoS) and Distributed Denial of Service (DDoS) attacks
7. Identity theft, spoofing, and phishing attacks

#### Log Retention Requirement:
All organizations shall mandatorily enable logs of all their ICT systems and maintain them securely for a rolling period of **180 days** within the Indian jurisdiction.
        """,
        duration_minutes=25,
        sequence_order=1,
    )
    db.add_all([r1, r2, r3])
    db.flush()

    # Course Assessment
    assessment_cyber = Assessment(
        course_id=course_cyber.id,
        title="Official Certification Assessment: Government Information Security",
        description="Timed assessment evaluating comprehension of CERT-In directives, threat vectors, and zero trust governance.",
        time_limit_minutes=15,
        passing_percentage=70.0,
        total_marks=100,
        is_active=True,
    )
    db.add(assessment_cyber)
    db.flush()

    q1 = AssessmentQuestion(
        assessment_id=assessment_cyber.id,
        question_text="Under current CERT-In directions, within what time frame must mandatory cyber security incidents be reported to CERT-In?",
        question_type="single_choice",
        marks=25,
        sequence_order=1,
        options=[
            {"id": "A", "text": "Within 24 hours of confirmation"},
            {"id": "B", "text": "Within 6 hours of noticing or being brought to notice"},
            {"id": "C", "text": "Within 48 hours during business days"},
            {"id": "D", "text": "Within 7 days of incident resolution"},
        ],
        correct_answers=["B"],
        explanation="CERT-In directives mandatorily require reportable incidents to be communicated within 6 hours.",
    )
    q2 = AssessmentQuestion(
        assessment_id=assessment_cyber.id,
        question_text="What is the mandatory log retention period prescribed for government and enterprise ICT systems in India?",
        question_type="single_choice",
        marks=25,
        sequence_order=2,
        options=[
            {"id": "A", "text": "30 days"},
            {"id": "B", "text": "90 days"},
            {"id": "C", "text": "180 days"},
            {"id": "D", "text": "365 days"},
        ],
        correct_answers=["C"],
        explanation="Logs of all ICT systems must be securely retained for 180 days within sovereign Indian jurisdiction.",
    )
    q3 = AssessmentQuestion(
        assessment_id=assessment_cyber.id,
        question_text="Which foundational pillar distinguishes a Zero Trust Architecture from traditional perimeter security?",
        question_type="single_choice",
        marks=25,
        sequence_order=3,
        options=[
            {"id": "A", "text": "Trusting all devices physically located inside the corporate LAN"},
            {"id": "B", "text": "Never Trust, Always Verify: continuous authentication & least-privilege access"},
            {"id": "C", "text": "Relying exclusively on single password authentication"},
            {"id": "D", "text": "Disabling TLS encryption for internal intranet traffic"},
        ],
        correct_answers=["B"],
        explanation="Zero Trust enforces explicit, continuous verification and least privilege regardless of network location.",
    )
    q4 = AssessmentQuestion(
        assessment_id=assessment_cyber.id,
        question_text="Which cryptographic technique ensures log file integrity against unauthorized tampering by malicious actors?",
        question_type="single_choice",
        marks=25,
        sequence_order=4,
        options=[
            {"id": "A", "text": "Base64 encoding"},
            {"id": "B", "text": "ROT13 substitution"},
            {"id": "C", "text": "Cryptographic hashing with HMAC / append-only write-once storage"},
            {"id": "D", "text": "Gzip compression only"},
        ],
        correct_answers=["C"],
        explanation="Cryptographic hashes (such as SHA-256) combined with write-once/immutable storage guarantee tamper-evident audit logs.",
    )
    db.add_all([q1, q2, q3, q4])
    db.flush()

    # Course 2: Digital Public Infrastructure
    course_dpi = Course(
        title="Architecting Digital Public Infrastructure (DPI) & India Stack",
        slug="architecting-digital-public-infrastructure",
        description="Comprehensive technical analysis of modular, interoperable public digital goods. Covers consent managers, DigiLocker, UPI payment settlement rails, and the Digital Personal Data Protection (DPDP) Act compliance.",
        short_description="Deep dive into identity, payment, and data exchange rails of India Stack and DPI.",
        category_id=cat_dpi.id,
        trainer_id=trainer_ananya.id,
        level="advanced",
        status="published",
        thumbnail_url="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        estimated_hours=6.0,
    )
    db.add(course_dpi)
    db.flush()

    dpi_m1 = CourseModule(
        course_id=course_dpi.id,
        title="Module 1: India Stack Identity & Auth Layer (Aadhaar / eSign)",
        sequence_order=1,
        duration_minutes=60,
    )
    db.add(dpi_m1)
    db.flush()

    dpi_r1 = CourseResource(
        module_id=dpi_m1.id,
        title="Architectural Blueprint of Open Digital Ecosystems",
        resource_type="video",
        file_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration_minutes=20,
        sequence_order=1,
    )
    db.add(dpi_r1)
    db.flush()

    # 6. Trainee Arun Enrollment & Completed Certificate
    enrollment_arun = Enrollment(
        user_id=trainee_arun.id,
        course_id=course_cyber.id,
        status="completed",
        progress_percent=100.0,
        started_at=datetime.now(UTC) - timedelta(days=5),
        completed_at=datetime.now(UTC) - timedelta(days=2),
    )
    db.add(enrollment_arun)
    db.flush()

    # Resource progress for Arun
    for res in [r1, r2, r3]:
        db.add(
            ResourceProgress(
                enrollment_id=enrollment_arun.id,
                resource_id=res.id,
                completed=True,
                time_spent_seconds=res.duration_minutes * 60,
            )
        )

    # Assessment attempt for Arun (Score: 100/100)
    attempt_arun = AssessmentAttempt(
        assessment_id=assessment_cyber.id,
        user_id=trainee_arun.id,
        enrollment_id=enrollment_arun.id,
        score=100.0,
        percentage=100.0,
        passed=True,
        started_at=datetime.now(UTC) - timedelta(days=2),
        submitted_at=datetime.now(UTC) - timedelta(days=2),
        answers={
            str(q1.id): ["B"],
            str(q2.id): ["C"],
            str(q3.id): ["B"],
            str(q4.id): ["C"],
        },
    )
    db.add(attempt_arun)
    db.flush()

    # Issued Certificate for Arun
    cert_code = "CC-2026-N8X9L2"
    pdf_path = render_certificate_pdf(
        certificate_code=cert_code,
        recipient_name=trainee_arun.full_name,
        course_title=course_cyber.title,
        issue_date_str=(datetime.now(UTC) - timedelta(days=2)).strftime("%B %d, %Y"),
        organization=trainee_arun.organization or "Department of Telecommunications",
    )
    cert_arun = Certificate(
        certificate_code=cert_code,
        user_id=trainee_arun.id,
        course_id=course_cyber.id,
        assessment_attempt_id=attempt_arun.id,
        issue_date=datetime.now(UTC) - timedelta(days=2),
        pdf_url=pdf_path,
        status="issued",
        verification_qr_data=f"{settings.FRONTEND_BASE_URL}/verify/{cert_code}",
        metadata_snapshot={
            "recipient_name": trainee_arun.full_name,
            "course_title": course_cyber.title,
            "score_percentage": 100.0,
            "organization": trainee_arun.organization,
        },
    )
    db.add(cert_arun)

    # 7. Notifications and Announcements
    db.add(
        Announcement(
            title="National Capacity Building Directives for Q3 2026",
            content="All certified personnel are requested to complete the updated DPI Architecture and Data Protection compliance modules before the end of the quarter.",
            target_role="all",
            created_by_id=admin.id,
            is_active=True,
        )
    )
    db.add(
        Notification(
            user_id=trainee_arun.id,
            title="Certificate Issued!",
            message=f"Congratulations! Your official certificate for '{course_cyber.title}' is ready for download.",
            notification_type="success",
            link_url=f"/verify/{cert_code}",
        )
    )

    db.commit()
    logger.info("Demonstration database successfully seeded!")
