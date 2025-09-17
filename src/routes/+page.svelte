<script>
  import {goto} from '$app/navigation';
  import { alertError, alertSuccess } from '$lib/alert';
  import { login } from '$lib/api/auth';
  import Swal from 'sweetalert2';

  let username = '';
  let password = '';

  async function handleLogin() {
  if (!username || !password) {
    alertError('Login Failed', 'Please enter your username and password');
  }
  try {
    const token = await login(username, password);
   Swal.fire({
    icon: 'success',
    title: 'Login Success',
    text: 'Selamat datang di Pothole Image Detection',
    timer: 2000,
    showConfirmButton: false
   }).then(() => {
    goto('/dashboard');
   })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.message,
      timer: 2000,
      showConfirmButton: false
    })
  }
}
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white shadow-lg rounded-md overflow-hidden flex max-w-3xl w-full mx-4">
    <!-- Form -->
    <div class="w-full md:w-1/2 p-10">
      <h2 class="text-xl font-bold mb-1 text-gray-900 text-center">Pothole Image Detection</h2>
      <p class="text-sm text-gray-600 mb-6 text-center">Insert your credentials to login</p>
      <form class="space-y-4">
        <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input bind:value={username} id="username" autocomplete="off" class="mt-1 w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none" type="text" placeholder="Enter your username" />
        </div>

        <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input bind:value={password} id="password" autocomplete="current-password" class="mt-1 w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none" type="password" placeholder="********" />
        </div>

        <button type="submit" onclick={handleLogin} class="w-full bg-gray-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition">
          Login
        </button>
      </form>
    </div>

    <!-- Gambar -->
    <div class="hidden md:block md:w-1/2">
      <img src="/img/toll.jpeg" alt="Login"
           class="w-full h-full object-cover" />
    </div>
  </div>
</div>
