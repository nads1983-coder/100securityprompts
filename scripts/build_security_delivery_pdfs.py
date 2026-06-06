from pathlib import Path

from docx import Document
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from xml.sax.saxutils import escape


ROOT = Path("/Users/nadinepierre/Documents/New project")
BRAND = "100SecurityPrompts.com"
GOLD = colors.HexColor("#D6AA43")
GOLD_DARK = colors.HexColor("#7A5A00")
BLACK = colors.HexColor("#070707")
WHITE = colors.HexColor("#F7F2E6")
TEXT = colors.HexColor("#141414")
MUTED = colors.HexColor("#585858")
COVER_MUTED = colors.HexColor("#C8BFAE")

FILES = [
    {
        "src": Path(
            "/Users/nadinepierre/Library/Mobile Documents/com~apple~CloudDocs/"
            "Security_Manager_AI_Toolkit_Commercial_Edition.docx"
        ),
        "pdf": ROOT / "public/downloads/100-ai-prompts-for-security-managers.pdf",
        "title": "100 AI Prompts for Security Managers",
        "subtitle": (
            "Commercial Edition | Practical ChatGPT prompts for security "
            "managers, supervisors and corporate security teams"
        ),
        "delivery": "Main Product PDF",
    },
    {
        "src": Path(
            "/Users/nadinepierre/Library/Mobile Documents/com~apple~CloudDocs/"
            "25_Real_World_Security_Manager_AI_Use_Cases.docx"
        ),
        "pdf": ROOT
        / "public/downloads/25-real-world-security-manager-ai-use-cases-bonus.pdf",
        "title": "25 Real-World Security Manager AI Use Cases",
        "subtitle": "Bonus resource for the 100 AI Prompts for Security Managers product",
        "delivery": "Bonus PDF",
    },
]


def styles():
    base = getSampleStyleSheet()
    base.add(
        ParagraphStyle(
            "CoverBrand",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=18,
            textColor=GOLD,
            alignment=TA_CENTER,
            spaceAfter=44,
        )
    )
    base.add(
        ParagraphStyle(
            "CoverTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=34,
            leading=39,
            textColor=WHITE,
            alignment=TA_CENTER,
            spaceAfter=14,
        )
    )
    base.add(
        ParagraphStyle(
            "CoverSubtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=12,
            leading=17,
            textColor=COVER_MUTED,
            alignment=TA_CENTER,
            spaceAfter=30,
        )
    )
    base.add(
        ParagraphStyle(
            "ContentTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=28,
            leading=34,
            textColor=TEXT,
            alignment=TA_LEFT,
            spaceAfter=12,
        )
    )
    base.add(
        ParagraphStyle(
            "BodyTextCustom",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10.2,
            leading=13.2,
            textColor=TEXT,
            spaceAfter=6,
        )
    )
    base.add(
        ParagraphStyle(
            "H1Custom",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=15.5,
            leading=19,
            textColor=GOLD_DARK,
            spaceBefore=14,
            spaceAfter=9,
            keepWithNext=True,
        )
    )
    base.add(
        ParagraphStyle(
            "H2Custom",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12.4,
            leading=15.5,
            textColor=GOLD_DARK,
            spaceBefore=10,
            spaceAfter=6,
            keepWithNext=True,
        )
    )
    base.add(
        ParagraphStyle(
            "Footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
            alignment=TA_CENTER,
        )
    )
    return base


def footer(canvas, doc, cover=False):
    canvas.saveState()
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.45)
    canvas.line(inch, 0.68 * inch, letter[0] - inch, 0.68 * inch)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(COVER_MUTED if cover else MUTED)
    canvas.drawCentredString(
        letter[0] / 2,
        0.46 * inch,
        f"{BRAND} | Digital product for personal professional use | Page {doc.page}",
    )
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, letter[0], letter[1], stroke=0, fill=1)
    canvas.restoreState()
    footer(canvas, doc, cover=True)


def later_page(canvas, doc):
    footer(canvas, doc)


def labelled_paragraph(text, style):
    labels = [
        "Purpose:",
        "When to Use It:",
        "Example Input:",
        "Example Output:",
        "Copy-and-Paste Prompt:",
        "Advanced Version:",
        "Security Manager Tips:",
        "Challenge:",
        "Use AI To:",
        "Outcome:",
    ]
    clean = escape(text)
    for label in labels:
        if text.startswith(label):
            rest = escape(text[len(label) :].strip())
            return Paragraph(
                f'<font color="#7A5A00"><b>{escape(label)}</b></font> {rest}',
                style,
            )
    return Paragraph(clean, style)


def cover(item, style_sheet):
    badge = Table(
        [[Paragraph(f'<font color="#D6AA43"><b>{item["delivery"]} | Instant download | One-time purchase</b></font>', style_sheet["BodyTextCustom"])]],
        colWidths=[6.5 * inch],
    )
    badge.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), BLACK),
                ("BOX", (0, 0), (-1, -1), 0.75, GOLD),
                ("LEFTPADDING", (0, 0), (-1, -1), 18),
                ("RIGHTPADDING", (0, 0), (-1, -1), 18),
                ("TOPPADDING", (0, 0), (-1, -1), 18),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 18),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ]
        )
    )
    return [
        Paragraph(BRAND, style_sheet["CoverBrand"]),
        Spacer(1, 0.82 * inch),
        Paragraph(escape(item["title"]), style_sheet["CoverTitle"]),
        Paragraph(escape(item["subtitle"]), style_sheet["CoverSubtitle"]),
        badge,
        Spacer(1, 0.25 * inch),
        Paragraph(
            "Use these prompts as practical drafting support. Always verify facts, "
            "protect confidential information and follow site procedures.",
            style_sheet["CoverSubtitle"],
        ),
        PageBreak(),
    ]


def build(item):
    docx = Document(item["src"])
    pdf_path = item["pdf"]
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    style_sheet = styles()
    story = cover(item, style_sheet)
    story.extend(
        [
            Paragraph(BRAND, style_sheet["CoverBrand"]),
            Paragraph(escape(item["title"]), style_sheet["ContentTitle"]),
            Paragraph(
                "A practical AI resource created for security managers and supervisors "
                "who need clearer reports, stronger handovers, better client updates "
                "and more consistent operational communication.",
                style_sheet["BodyTextCustom"],
            ),
        ]
    )

    skipped_title = False
    buffer = []
    for para in docx.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        if not skipped_title and para.style.name == "Title":
            skipped_title = True
            continue
        if para.style.name == "Heading 1":
            if buffer:
                story.append(KeepTogether(buffer[:3]))
                story.extend(buffer[3:])
                buffer = []
            story.append(Paragraph(escape(text), style_sheet["H1Custom"]))
        elif para.style.name == "Heading 2":
            if buffer:
                story.extend(buffer)
                buffer = []
            buffer.append(Paragraph(escape(text), style_sheet["H2Custom"]))
        else:
            buffer.append(labelled_paragraph(text, style_sheet["BodyTextCustom"]))
    story.extend(buffer)

    pdf = SimpleDocTemplate(
        str(pdf_path),
        pagesize=letter,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=0.82 * inch,
        bottomMargin=0.86 * inch,
        title=item["title"],
        author=BRAND,
        subject=item["subtitle"],
    )
    pdf.build(story, onFirstPage=cover_page, onLaterPages=later_page)
    print(pdf_path)


if __name__ == "__main__":
    for file_item in FILES:
        build(file_item)
