"""Certificate generation, PDF rendering with ReportLab, and public verification."""
import os
import secrets
import string
from datetime import UTC, datetime

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import landscape, letter
from reportlab.pdfgen import canvas
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.core.errors import NotFoundError
from app.db.models import AssessmentAttempt, Certificate, Course, User
from app.schemas.all_schemas import CertificateOut, PublicVerificationOut


def generate_certificate_code() -> str:
    """Generate human-readable, unique certificate code e.g. CC-2026-X8K9L."""
    alphabet = string.ascii_uppercase + string.digits
    rand_str = "".join(secrets.choice(alphabet) for _ in range(6))
    year = datetime.now(UTC).year
    return f"CC-{year}-{rand_str}"


def render_certificate_pdf(
    certificate_code: str,
    recipient_name: str,
    course_title: str,
    issue_date_str: str,
    organization: str = "Digital Capacity Building Portal",
) -> str:
    """Render a formal government/institutional PDF certificate and save to disk."""
    upload_dir = os.path.join(settings.LOCAL_STORAGE_DIR, "certificates")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{certificate_code}.pdf")

    # Generate landscape letter certificate
    c = canvas.Canvas(file_path, pagesize=landscape(letter))
    width, height = landscape(letter)

    # 1. Background and Border
    c.setFillColor(HexColor("#F8FAFC"))
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Outer border
    c.setStrokeColor(HexColor("#0B192C"))
    c.setLineWidth(4)
    c.rect(20, 20, width - 40, height - 40, fill=0, stroke=1)

    # Inner decorative border
    c.setStrokeColor(HexColor("#059669"))
    c.setLineWidth(1.5)
    c.rect(28, 28, width - 56, height - 56, fill=0, stroke=1)

    # 2. Header
    c.setFillColor(HexColor("#0B192C"))
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2.0, height - 60, "CAPACITY CONNECT · DIGITAL CAPACITY BUILDING PORTAL")

    c.setFillColor(HexColor("#059669"))
    c.setFont("Helvetica-Bold", 26)
    c.drawCentredString(width / 2.0, height - 100, "CERTIFICATE OF COMPLETION")

    # 3. Subtext
    c.setFillColor(HexColor("#475569"))
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2.0, height - 135, "This is formally presented and awarded to")

    # 4. Recipient Name
    c.setFillColor(HexColor("#0B192C"))
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2.0, height - 175, recipient_name.upper())

    # Underline under name
    c.setStrokeColor(HexColor("#CBD5E1"))
    c.setLineWidth(1)
    c.line(width / 2.0 - 150, height - 185, width / 2.0 + 150, height - 185)

    # 5. Course Details
    c.setFillColor(HexColor("#475569"))
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2.0, height - 215, "for successfully fulfilling all curriculum requirements and passing the rigorous assessment for")

    c.setFillColor(HexColor("#1E3E62"))
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2.0, height - 250, course_title)

    # 6. Verification and Signatures Footer
    c.setFillColor(HexColor("#64748B"))
    c.setFont("Helvetica", 10)
    c.drawString(50, 70, f"Issued Date: {issue_date_str}")
    c.drawString(50, 55, f"Verification Code: {certificate_code}")
    c.drawString(50, 40, f"Verify Online: {settings.FRONTEND_BASE_URL}/verify/{certificate_code}")

    # Signatures
    c.setFillColor(HexColor("#0B192C"))
    c.setFont("Helvetica-Bold", 11)
    c.drawRightString(width - 50, 75, "Authorized Institutional Signatory")
    c.setStrokeColor(HexColor("#0B192C"))
    c.line(width - 250, 90, width - 50, 90)
    c.setFillColor(HexColor("#64748B"))
    c.setFont("Helvetica", 9)
    c.drawRightString(width - 50, 58, "Capacity Connect Accreditation Board")

    c.save()
    return f"/uploads/certificates/{certificate_code}.pdf"


class CertificateService:
    @staticmethod
    def issue_certificate_for_course(
        db: Session,
        user: User,
        course: Course,
        attempt: AssessmentAttempt | None = None,
    ) -> Certificate:
        """Issue an official certificate if not already issued for this course."""
        existing = db.scalar(
            select(Certificate).where(
                Certificate.user_id == user.id,
                Certificate.course_id == course.id,
                Certificate.status == "issued",
            )
        )
        if existing:
            return existing

        code = generate_certificate_code()
        while db.scalar(select(Certificate).where(Certificate.certificate_code == code)):
            code = generate_certificate_code()

        issue_dt = datetime.now(UTC)
        issue_date_str = issue_dt.strftime("%B %d, %Y")

        pdf_relative_url = render_certificate_pdf(
            certificate_code=code,
            recipient_name=user.full_name,
            course_title=course.title,
            issue_date_str=issue_date_str,
            organization=user.organization or "Capacity Connect",
        )

        cert = Certificate(
            certificate_code=code,
            user_id=user.id,
            course_id=course.id,
            assessment_attempt_id=attempt.id if attempt else None,
            issue_date=issue_dt,
            pdf_url=pdf_relative_url,
            status="issued",
            verification_qr_data=f"{settings.FRONTEND_BASE_URL}/verify/{code}",
            metadata_snapshot={
                "recipient_name": user.full_name,
                "course_title": course.title,
                "score_percentage": attempt.percentage if attempt else 100.0,
                "organization": user.organization or "Capacity Connect",
            },
        )
        db.add(cert)
        db.commit()
        db.refresh(cert)
        return cert

    @staticmethod
    def verify_public_certificate(
        db: Session,
        certificate_code: str,
    ) -> PublicVerificationOut:
        """Publicly verify a certificate by its unique code."""
        cert = db.scalar(
            select(Certificate)
            .options(
                joinedload(Certificate.user),
                joinedload(Certificate.course),
            )
            .where(Certificate.certificate_code == certificate_code.strip().upper())
        )
        if not cert:
            raise NotFoundError(
                f"No certificate found with code '{certificate_code}'.",
                code="CERTIFICATE_NOT_FOUND",
            )

        return PublicVerificationOut(
            is_valid=(cert.status == "issued"),
            certificate_code=cert.certificate_code,
            recipient_name=cert.user.full_name if cert.user else cert.metadata_snapshot.get("recipient_name", "Trainee"),
            course_title=cert.course.title if cert.course else cert.metadata_snapshot.get("course_title", "Capacity Building Course"),
            issue_date=cert.issue_date,
            status=cert.status,
            organization=cert.metadata_snapshot.get("organization", "Capacity Connect"),
            score_percentage=cert.metadata_snapshot.get("score_percentage", 100.0),
            pdf_url=cert.pdf_url,
        )

    @staticmethod
    def get_user_certificates(
        db: Session,
        user: User,
    ) -> list[CertificateOut]:
        """Fetch all certificates awarded to the specified user."""
        certs = db.scalars(
            select(Certificate)
            .options(
                joinedload(Certificate.course),
                joinedload(Certificate.user),
            )
            .where(Certificate.user_id == user.id)
            .order_by(Certificate.issue_date.desc())
        ).all()

        results: list[CertificateOut] = []
        for c in certs:
            out = CertificateOut.model_validate(c)
            out.recipient_name = c.user.full_name if c.user else None
            out.course_title = c.course.title if c.course else None
            results.append(out)

        return results
