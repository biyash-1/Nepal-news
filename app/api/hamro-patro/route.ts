import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch('https://www.hamropatro.com/getMethod.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'actionName': 'getCalendarData', 
        'year': '2081',
        'month': 'Kartik'
      })
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
