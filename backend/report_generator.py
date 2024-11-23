from fpdf import FPDF
import os
from datetime import datetime

class DamageReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Vehicle Damage Analysis Report', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_report(data):
    pdf = DamageReport()
    pdf.add_page()
    
    # Add report date
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'Report Date: {datetime.now().strftime("%Y-%m-%d %H:%M")}', 0, 1)
    pdf.ln(5)
    
    # Vehicle Information
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Vehicle Information', 0, 1)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'Make: {data["vehicle_info"]["make"]}', 0, 1)
    pdf.cell(0, 10, f'Model: {data["vehicle_info"]["model"]}', 0, 1)
    pdf.cell(0, 10, f'Year: {data["vehicle_info"]["year"]}', 0, 1)
    pdf.ln(5)
    
    # Damage Analysis
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Damage Analysis', 0, 1)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'Severity: {data["severity"].capitalize()}', 0, 1)
    pdf.cell(0, 10, f'Estimated Cost: ${data["estimated_cost"]:,.2f}', 0, 1)
    
    # Affected Areas
    pdf.cell(0, 10, 'Affected Areas:', 0, 1)
    for area in data["affected_areas"]:
        pdf.cell(0, 10, f'• {area.replace("_", " ").title()}', 0, 1)
    
    # Save report
    reports_dir = 'reports'
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)
        
    filename = f'damage_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
    report_path = os.path.join(reports_dir, filename)
    pdf.output(report_path)
    
    return report_path