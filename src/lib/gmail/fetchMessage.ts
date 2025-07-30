import axios from "axios";

export async function fetchMessage(messageId: string, accessToken: string) {
  try {
    const res = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const message = res.data;
    return message;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
}
