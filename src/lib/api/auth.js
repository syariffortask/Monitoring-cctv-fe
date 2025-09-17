import api from "$lib/api";

export async function login(username, password) {
  try {
    const body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);

    const response = await api.post("/auth/login", body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      skipInterceptor: true // biar interceptor ngga maksa token
    });

    // axios simpan di response.data
    const { access_token, token_type } = response.data;

    // simpan token ke localStorage
    localStorage.setItem("token", access_token);

    return { access_token, token_type };
  } catch (error) {
    let message = "Login Failed";

    if (error.response) {
      message = error.response.data?.detail || error.response.statusText;
    } else if (error.request) {
      message = "No response from server";
    } else {
      message = error.message;
    }

    throw new Error(message);
  }
}
