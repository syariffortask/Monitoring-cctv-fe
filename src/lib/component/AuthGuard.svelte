<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alertError } from '$lib/alert';

    // Cek token saat komponen dimuat
    export let allowRole = ['admin']; // Role yang diizinkan, bisa diubah sesuai kebutuhan

    function parseJWT(token){
        try{
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }



    onMount(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // kasih alert
            alertError('Silakan login terlebih dahulu.');
            goto('/');
            return;
        }
        const payload = parseJWT(token);
        if (!payload || !allowRole.includes(payload.role)) {
            alertError('Akses ditolak. Role tidak sesuai.');
            goto('/');
        }
    });
</script>