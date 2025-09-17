<script>
  import Modal from '$lib/component/Modal.svelte';
  import Table from '$lib/component/Table.svelte';
  import Button from '$lib/component/ui/Button.svelte';
  import AuthGuard from '$lib/component/AuthGuard.svelte';
  import { onMount } from 'svelte';
  import Swal from 'sweetalert2';
  import { json } from '@sveltejs/kit';
  import { deleteCamera, updateCamera,addCamera, getCameras, generateColumns } from '$lib/api/camera';
  import { alertError, alertSuccess } from '$lib/alert';


  let showModal = false;
  let showEditModal = false;
  let selectedItem = null;

  let columns = [];
  let data = [];

  const fields = [
    { label: 'Nama/Lokasi', name: 'name', placeholder: 'CCTV KM 1', required: true },
    { label: 'Alamat IP', name: 'ip', placeholder: 'Masukan IP: 192.168.x.x', required: true },
    { label: 'Username', name: 'username', placeholder: 'masukan username cctv', required: true },
    { label: 'Password', name: 'password', placeholder: 'masukan password cctv', required: true },
    { label: 'Endpoint', name: 'endpoint', placeholder: 'masukan endpoint', required: true },
    { label: 'Stream_url', name: 'stream_url', placeholder: 'masukan stream_url', required: false },
    { label: 'Latitude', name: 'latitude', placeholder: 'masukan latitude', required: false, type: 'number' },
    { label: 'Longitude', name: 'longitude', placeholder: 'masukan longitude', required: false, type: 'number' },
  ];

   onMount(async () => {
    try {
      const result = await getCameras();
      data = result;
      columns = generateColumns(data);
    } catch (err) {
      alertError('Error', 'Gagal mengambil data kamera');
    }
  });
  // handle save terus render ulang table
  const handleSave = async(json) => {
    if(data.some(item => item.ip === json.ip)){
      alertError('Gagal', 'IP sudah digunakan.');
      return;
    }
    try {
      const newData = await addCamera(json);
      // Tambahkan data baru ke tabel kalo newData true atau fetch ulang dari api

      alertSuccess('Success', 'Kamera berhasil ditambahkan');
      const result = await getCameras();
      data = result;
      columns = generateColumns(data);
      showModal = false;
    } catch (error) {
      alertError('Error', error.message);
      return;
    }
    
  };

  const handleEdit = (item) => {
    selectedItem = { ...item }; 
    showEditModal = true;
  };
  const handleUpdate = async (updatedData) => {
  const isDuplicate = data.some(item => item.ip === updatedData.ip && item.id !== selectedItem.id);
  if (isDuplicate) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'IP sudah digunakan oleh kamera lain.'
    });
    return;
  }
  try {
    const updated = await updateCamera(selectedItem.id, updatedData);
    data = data.map(item =>
      item.id === selectedItem.id
        ? { ...item, ...updatedData, ...updated } // pastikan id tetap ada
        : item
    );
    // console.log('data updated:', updated);
  
    showEditModal = false;
    alertSuccess('Success', 'Kamera berhasil diperbarui');
  } catch (error) {
    // kalo invalid  token harus login ulang
    alertError('Error', error.message);
    return;
  }
};
  
  async function handleDelete(row) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: '#1E2939',
      showCancelButton: true,
      confirmButtonColor: '#bfbfbd',
      cancelButtonColor: '#1E2939',
      confirmButtonText: 'Yes, delete it!'
    })
    if (result.isConfirmed) {
    try {
      await deleteCamera(row.id);
      data = data.filter(item => item.id !== row.id);
      alertSuccess('Deleted!', 'Camera has been deleted.');
    } catch (error) {
      alertError('Error', error.message || 'Failed to delete camera.');
    }
  }


  }
</script>
<AuthGuard allowRole={['admin']}/>

<Button onClick={() => showModal = true} color="gray">Add Camera</Button>


<Modal
  isOpen={showModal}
  onClose={() => showModal = false}
  modalTitle="Tambah Kamera"
  onSave={handleSave}
  fields={fields}
  initialValues={{}}
/>
<div class="w-full overflow-x-auto">
  <Table {columns} {data} on:edit={(e)=>handleEdit(e.detail)} on:delete={(e)=>handleDelete(e.detail)} />
</div>

<Modal
  isOpen={showEditModal}
  onClose={() => showEditModal = false}
  modalTitle="Edit Kamera"
  onSave={handleUpdate}
  fields={fields}
  initialValues={selectedItem}
/>