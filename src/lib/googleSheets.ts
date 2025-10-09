interface SheetData {
  [key: string]: string | number;
}

export async function fetchSheetData(sheetId: string, range: string = 'Sheet1!A:Z'): Promise<SheetData[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
  
  console.log('Environment check:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length,
    sheetId: sheetId,
    range: range
  });
  
  if (!apiKey) {
    throw new Error('Google Sheets API key not configured');
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  
  try {
    console.log('Fetching from URL:', url);
    const response = await fetch(url, {
      next: { revalidate: 86400 }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Google Sheets API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    if (rows.length === 0) return [];
    
    // Convert to objects using first row as headers
    const headers = rows[0];
  return rows.slice(1).map((row: string[]) => {
      const obj: SheetData = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}