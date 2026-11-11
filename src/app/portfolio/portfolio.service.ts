import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

export interface ResumeData {
    about: string[];
    skills: { name: string; items: string[] }[];
    exp: string[];
    projects: { n: string; d: string; t: string[]; p: string[] }[];
    education: string[];
    training: string[];
    certifications: string[];
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {

    generatePdf(data: ResumeData): Blob {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const W = 595, M = 44, mw = W - 2 * M;
        let y = 54;

        const write = (s: string, size: number, bold = false, color: [number, number, number] = [40, 40, 50]) => {
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            doc.setFontSize(size);
            doc.setTextColor(...color);
            doc.splitTextToSize(s, mw).forEach((line: string) => {
                if (y > 800) { doc.addPage(); y = 54; }
                doc.text(line, M, y);
                y += size + 4;
            });
        };

        const heading = (s: string) => {
            y += 8;
            if (y > 780) { doc.addPage(); y = 54; }
            write(s, 10.5, true, [109, 74, 255]);
            doc.setDrawColor(210);
            doc.line(M, y - 8, W - M, y - 8);
            y += 2;
        };

        const clean = (s: string) => s.replace(/[’‘]/g, "'").replace(/–/g, '-');

        write('Nagadharshini', 24, true, [27, 30, 41]);
        write('.NET Full Stack Developer', 12, true, [109, 74, 255]);
        write('dharshiniramya98@gmail.com | +91 8270091366 | Coimbatore, Tamil Nadu, India', 9, false, [90, 90, 100]);
        write('Portfolio: dharshini-portfolio-gray.vercel.app', 9, false, [90, 90, 100]);
        heading('SUMMARY');
        data.about.forEach(p => write(p, 9.5));

        heading('SKILLS');
        data.skills.forEach(s => write(s.name + ': ' + s.items.join(', '), 9.5));

        heading('EXPERIENCE');
        write('.NET Full Stack Developer - eBiz Global Corp, Coimbatore (Jan 2023 - Present)', 10, true);
        data.exp.forEach(x => write('- ' + x, 9.5));

        heading('PROJECTS');
        data.projects.forEach(p => {
            write(p.n, 10, true);
            write(p.d, 9.5);
            write('Tech: ' + p.t.join(', '), 9, false, [90, 90, 100]);
            p.p.forEach(x => write('- ' + x, 9.5));
            y += 4;
        });

        heading('EDUCATION');
        data.education.forEach(x => write('- ' + x, 9.5));

        heading('TRAINING');
        write('.NET Course - PUMO Technovation (6 months)', 10, true);
        data.training.forEach(x => write('- ' + x, 9.5));

        heading('CERTIFICATIONS');
        data.certifications.forEach(x => write('- ' + clean(x), 9.5));

        return doc.output('blob');
    }
}