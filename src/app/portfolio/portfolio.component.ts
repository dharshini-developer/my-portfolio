import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, ResumeData } from './portfolio.service';

interface Project { n: string; d: string; t: string[]; p: string[]; }
interface SkillGroup { name: string; items: string[]; }

@Component({
    selector: 'app-portfolio',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {

    @ViewChild('glowEl') glowEl!: ElementRef<HTMLDivElement>;

    year = new Date().getFullYear();

    links = ['About', 'Skills', 'Experience', 'Projects', 'Training', 'Education', 'Contact'];

    roles = ['.NET Full Stack Developer', 'Angular + ASP.NET Core', 'REST APIs & SQL Server'];
    displayedRole = '';
    private roleIndex = 0;
    private charIndex = 0;
    private deleting = false;
    private typingTimer: any;

    about: string[] = [
        'I am a .NET Full Stack Developer with hands-on experience building, maintaining and enhancing web applications using Angular, ASP.NET Core Web API, C# and Microsoft SQL Server. I work with RESTful APIs, database design, stored procedures, Entity Framework Core, LINQ and debugging.',
        'Along with development, I perform manual testing to validate functionality, find defects and keep application quality high. I enjoy solving technical problems and collaborating with teams.'
    ];

    skills: SkillGroup[] = [
        { name: 'Frontend', items: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap 5'] },
        { name: 'Backend', items: ['C#', 'ASP.NET Core', 'Web API', 'ASP.NET MVC', 'REST APIs'] },
        { name: 'Database', items: ['SQL Server', 'SQL Queries', 'Stored Procedures', 'Database Design'] },
        { name: 'Data Access & Tools', items: ['Entity Framework Core', 'LINQ', 'JWT', 'Swagger', 'Gitee'] },
        { name: 'Testing', items: ['Manual Testing', 'Functional Testing', 'Regression Testing', 'Bug Reporting'] }
    ];

    exp: string[] = [
        'Develop and maintain web applications using C#, ASP.NET Core Web API, Angular and SQL Server.',
        'Build and integrate RESTful APIs to support frontend features and business requirements.',
        'Implement CRUD operations and database logic using SQL queries and stored procedures.',
        'Use Entity Framework Core and LINQ for data access.',
        'Perform manual testing, debug issues and support bug fixes and enhancements.',
        'Collaborate on requirement analysis, development, testing and maintenance.'
    ];

    projects: Project[] = [
        {
            n: 'QTrak: Quality Tracking System',
            d: 'Web application to record, monitor and report product and process quality checks.',
            t: ['ASP.NET', 'C#', 'SQL Server', 'Stored Procedures', '3-Tier'],
            p: ['NCR, CAR and fault-tracking modules', 'Report data using stored procedures', 'Testing, debugging and defect resolution']
        },
        {
            n: 'Cwmbran: Quote Management System',
            d: 'Workflow from quotation to purchase order, sales order and invoice.',
            t: ['ASP.NET MVC', 'C#', 'jQuery', 'SQL Server'],
            p: ['Approval workflows', 'Debit/credit notes and shipment tracking', 'Stored procedure based reports']
        },
        {
            n: 'DMS: Distributor Management System',
            d: 'End-to-end distributor workflow covering customers, quality records, purchase orders, sales and parts inventory.',
            t: ['Angular', 'ASP.NET Core Web API', 'C#', 'LINQ'],
            p: ['Customer management with user creation', 'NCR and CAR modules', 'PO creation to sales order and invoice', 'Parts stock maintenance']
        }
    ];

    education: string[] = [
        'B.E., Surya Engineering College, Erode',
        'HSC, Govt. Hr. Sec. School, Karamadai',
        'SSLC, TKNM Hr. Sec. School, Karamadai'
    ];

    training: string[] = [
        'Completed a 6-month .NET training course',
        'Built a hands-on project as part of the course'
    ];

    certifications: string[] = [
        'Speech Certificate: Women’s Freedom, Ramakrishna Vidyalaya'
    ];

    resumeOpen = false;
    downloadMessage = '';

    constructor(private portfolioService: PortfolioService) { }

    ngOnInit(): void {
        this.startTyping();
        this.setupRevealObserver();
        document.documentElement.dataset['theme'] =
            matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    ngOnDestroy(): void {
        clearTimeout(this.typingTimer);
    }

    // ── Typing effect ─────────────────────────────
    private startTyping(): void {
        const tick = () => {
            const w = this.roles[this.roleIndex];
            this.displayedRole = w.slice(0, this.charIndex);

            if (!this.deleting && this.charIndex === w.length) {
                this.deleting = true;
                this.typingTimer = setTimeout(tick, 1500);
                return;
            }
            if (this.deleting && this.charIndex === 0) {
                this.deleting = false;
                this.roleIndex = (this.roleIndex + 1) % this.roles.length;
            }
            this.charIndex += this.deleting ? -1 : 1;
            this.typingTimer = setTimeout(tick, this.deleting ? 35 : 70);
        };
        tick();
    }

    // ── Reveal on scroll ──────────────────────────
    private setupRevealObserver(): void {
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });

        setTimeout(() => {
            document.querySelectorAll('.rv').forEach(el => io.observe(el));
        }, 0);
    }

    // ── Glow follows cursor ───────────────────────
    @HostListener('window:pointermove', ['$event'])
    onPointerMove(e: PointerEvent): void {
        if (this.glowEl) {
            this.glowEl.nativeElement.style.left = e.clientX + 'px';
            this.glowEl.nativeElement.style.top = e.clientY + 'px';
        }
    }

    // ── Theme toggle ──────────────────────────────
    toggleTheme(): void {
        const root = document.documentElement;
        const cur = root.dataset['theme'] || 'light';
        root.dataset['theme'] = cur === 'dark' ? 'light' : 'dark';
    }

    // ── Resume modal ──────────────────────────────
    openResume(): void { this.resumeOpen = true; document.body.style.overflow = 'hidden'; }
    closeResume(): void { this.resumeOpen = false; document.body.style.overflow = ''; this.downloadMessage = ''; }

    @HostListener('window:keydown.escape')
    onEsc(): void { this.closeResume(); }

    onOverlayClick(e: MouseEvent): void {
        if ((e.target as HTMLElement).id === 'ov') this.closeResume();
    }

    // ── PDF download ──────────────────────────────
    downloadPdf(): void {
        const data: ResumeData = {
            about: this.about,
            skills: this.skills,
            exp: this.exp,
            projects: this.projects,
            education: this.education,
            training: this.training,
            certifications: this.certifications
        };
        try {
            const blob = this.portfolioService.generatePdf(data);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Nagadharshini_Resume.pdf';
            a.click();
            URL.revokeObjectURL(url);
            this.downloadMessage = 'Resume saved ✓';
        } catch (err) {
            this.downloadMessage = 'Download unavailable';
        }
    }
}