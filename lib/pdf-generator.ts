export async function generatePDF(result: any) {
  try {
    const response = await fetch('http://localhost:5000/api/generate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    })

    if (!response.ok) {
      throw new Error('Failed to generate PDF')
    }

    const data = await response.json()
    
    // Download the PDF
    window.open(`http://localhost:5000${data.report_url}`, '_blank')
  } catch (error) {
    console.error('PDF generation error:', error)
    throw error
  }
}