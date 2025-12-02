export async function GET() {
  try {
    const response = await fetch('http://127.0.0.1:5000/cars');

    // --- Add this check ---
    if (!response.ok) {
      // Throw an error if the backend response wasn't successful (e.g., 404, 500)
      throw new Error(`Flask backend request failed: ${response.status} ${response.statusText}`);
    }
    // --- End of added check ---

    const data = await response.json();

    // --- Optional but recommended: Check if data is an array ---
    if (!Array.isArray(data)) {
        console.error("Data fetched from http://127.0.0.1:5000/cars is not an array:", data);
        // You might want to return an empty array or handle this differently
        return Response.json([]);
    }
    // --- End of optional check ---

    return Response.json(data);

  } catch (error: any) { // Add ': any' or a more specific type for error
    console.error('Failed to fetch cars from backend:', error);
    // Include the error message in the response for better debugging
    return Response.json({ success: false, error: error.message || 'Failed to fetch cars' }, { status: 500 });
  }
}