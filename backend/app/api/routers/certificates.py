"""Certificate issuance, PDF downloads, and public verification endpoints."""
import os
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.db.models import User
from app.schemas.all_schemas import CertificateOut, PublicVerificationOut
from app.services.certificate_service import CertificateService

router = APIRouter(prefix="/certificates", tags=["Certificates"])


@router.get("/verify/{code}", response_model=PublicVerificationOut)
def verify_certificate(
    code: str,
    db: Annotated[Session, Depends(get_db)],
) -> PublicVerificationOut:
    """Public, unauthenticated verification lookup for any issued certificate."""
    return CertificateService.verify_public_certificate(db, code)


@router.get("/my", response_model=list[CertificateOut])
def get_my_certificates(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[CertificateOut]:
    """List all certificates earned by the authenticated trainee."""
    return CertificateService.get_user_certificates(db, current_user)


@router.get("/download/{code}")
def download_certificate_pdf(
    code: str,
    db: Annotated[Session, Depends(get_db)],
) -> FileResponse:
    """Download the official ReportLab generated PDF certificate."""
    cert_info = CertificateService.verify_public_certificate(db, code)
    file_path = os.path.join(settings.LOCAL_STORAGE_DIR, "certificates", f"{code.upper()}.pdf")

    if not os.path.exists(file_path):
        # Regenerate on demand if missing
        from app.services.certificate_service import render_certificate_pdf
        render_certificate_pdf(
            certificate_code=code.upper(),
            recipient_name=cert_info.recipient_name,
            course_title=cert_info.course_title,
            issue_date_str=cert_info.issue_date.strftime("%B %d, %Y"),
            organization=cert_info.organization,
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=f"Certificate-{code.upper()}.pdf",
    )
