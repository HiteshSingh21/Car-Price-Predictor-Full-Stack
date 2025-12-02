export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await fetch('http://127.0.0.1:5000/find_by_body', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Failed to fetch similar cars:', error)
    return Response.json({ success: false, error: 'Failed to fetch similar cars' }, { status: 500 })
  }
}
