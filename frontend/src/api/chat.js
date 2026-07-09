const API = "http://127.0.0.1:8000";

export async function createConversation(title, token) {
  console.log("CREATE CONV - token:", token);
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API}/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create conversation");
  }

  return response.json();
}

export async function sendMessage(conversationId, message, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API}/chat`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ conversation_id: conversationId, message }),
  });

  const data = await response.json();
  return data.response;
}