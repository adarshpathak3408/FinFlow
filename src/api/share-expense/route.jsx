export async function POST(request) {
    try {
      const data = await request.json()
      const { transaction, friends, yourShare } = data
  
      // In a real app, this would send emails or notifications to friends
      // For now, we'll just return a success response
  
      return new Response(
        JSON.stringify({
          success: true,
          message: "Expense shared successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to share expense",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }
  }  