from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

def create_resume(path):
    c = canvas.Canvas(path, pagesize=letter)
    width, height = letter
    y = height - 50
    x_margin = 50

    lines = [
        "Goddeti Shankar Narayana Reddy",
        "LinkedIn: https://www.linkedin.com/in/shankar04/ | Email: shankarnarayanareddy196@gmail.com",
        "GitHub: https://github.com/Shankar6300 | Mobile: +916300783770",
        "",
        "SKILLS",
        "Languages: C, C++, Python, Java",
        "DevOps & Tools: Visual Studio Code, Ubuntu, Linux, Git, GitHub, Docker",
        "Cloud: AWS, Lambda, S3, IAM",
        "Web Technologies: HTML and CSS, JavaScript",
        "Soft Skills: Problem-Solving, Analytical Thinking, Teamwork, Quick Learning",
        "",
        "PROJECTS",
        "Digital Library Management System | DSA, C++, Console Application Development (Jun 25 - Jul 25)",
        "- Engineered a console-based system to organize books, maintain user data, and enable fast retrieval.",
        "- Used vector for dynamic data storage, stack to maintain recently issued books, and applied linear",
        "  search and STL sort for optimized operations.",
        "- Elevated academic resource handling by enabling structured access and simplified navigation.",
        "Tech stack: C++, Data Structures, Console Application",
        "",
        "AI Language Survival Guide | Python, HTML, CSS, JavaScript (Mar 25 - Apr 25)",
        "- Produced a web application assisting travellers with real-time translation and cultural guidance.",
        "- Crafted an adaptive interface featuring phrase suggestions, instant responses, and interactive modules.",
        "- Enhanced user experience through seamless front-end behaviour supported by Python-powered logic.",
        "Tech stack: Python, HTML, CSS, JavaScript",
        "",
        "AWS S3 File Conversion System | AWS Lambda, S3, IAM, Python (Feb 25 - Mar 25)",
        "- Architected a serverless workflow that transforms CSV files into JSON through AWS event triggers.",
        "- Configured S3-based automation with secure IAM permissions for controlled and reliable execution.",
        "- Streamlined cloud data processing by reducing manual intervention and ensuring on-demand conversions.",
        "Tech stack: AWS Lambda, Amazon S3, IAM, Python",
        "",
        "TRAINING",
        "Data Structures & Algorithms Training-Cipher Schools (Jun 25 - Jul 25)",
        "- Covered essential concepts including arrays, linked lists, stacks, queues, trees, graphs,",
        "  and dynamic programming.",
        "- Tackled 100+ coding challenges, strengthening analytical reasoning and logical problem-solving.",
        "- Examined time/space complexity and applied efficient algorithmic strategies.",
        "- Completed a C++ console-based Library Management System as the capstone project.",
        "",
        "CERTIFICATES",
        "- Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate | Oracle (Mar 26)",
        "- Java Programming | IAM Neo Platform (May 25)",
        "- Privacy And Security in Online Social Media | NPTEL (Apr 25)",
        "- Object-Oriented Programming (OOP) | IAM Neo Platform (Dec 24)",
        "- Responsive Web Design | Free Code Camp (Nov 23)"
    ]

    c.setFont("Helvetica", 10)
    for line in lines:
        if "SKILLS" in line or "PROJECTS" in line or "TRAINING" in line or "CERTIFICATES" in line:
            c.setFont("Helvetica-Bold", 12)
        elif "Goddeti" in line:
            c.setFont("Helvetica-Bold", 14)
        else:
            c.setFont("Helvetica", 10)
        c.drawString(x_margin, y, line)
        y -= 15
        if y < 50:
            c.showPage()
            c.setFont("Helvetica", 10)
            y = height - 50

    lines_page2 = [
        "ACHIEVEMENTS",
        "HackerRank 5* in C++ Programming (Feb 26)",
        "- Achieved a 5-star rating on HackerRank by solving advanced programming challenges using C++.",
        "",
        "HackerRank 5* in Problem Solving (Feb 26)",
        "- Earned a 5-star rating by solving algorithmic and data structure challenges.",
        "",
        "Adobe India Hackathon (Jul 25)",
        "- Competed in Adobe India Hackathon Round-1 (MCQ + Coding) representing LPU as part of",
        "  Team Hack Street Boys.",
        "",
        "Code Of Duty Hackathon (Mar 24)",
        "- Participated in the Code of Duty Web Hackathon 2024, demonstrating strong teamwork and",
        "  innovative problem solving.",
        "",
        "EDUCATION",
        "Lovely Professional University | Phagwara, Punjab",
        "- Bachelor of Technology - Computer Science and Engineering; CGPA: 8.27 (Aug 23 - Present)",
        "",
        "Sri Chaitanya Junior College | Vijayawada, Andhra Pradesh",
        "- Intermediate - PCM; Percentage: 98.2% (Sep 21 - Apr 23)",
        "",
        "Sri Chaitanya Techno School | Pulivendula, Andhra Pradesh",
        "- Matriculation - Percentage: 99% (Jun 20 - May 21)"
    ]

    c.showPage()
    y = height - 50
    for line in lines_page2:
        if "ACHIEVEMENTS" in line or "EDUCATION" in line:
            c.setFont("Helvetica-Bold", 12)
        else:
            c.setFont("Helvetica", 10)
        c.drawString(x_margin, y, line)
        y -= 15
        
    c.save()

if __name__ == '__main__':
    create_resume('Goddeti_Shankar_Resume.pdf')
