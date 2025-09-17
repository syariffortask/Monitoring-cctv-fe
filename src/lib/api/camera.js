import api from "$lib/api";

export async function getCameras() {
    try {
        const response = await api.get("/cameras/");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateCamera(id, data) {
    try{
        const response = await api.put(`/cameras/${id}`, data);
        return response.data;
    } catch (error) {
        let message = 'Update Camera Failed';

        if(error.response){
            message = error.response.data?.detail || error.response.statusText;
        } else if(error.request){
            message = 'No response from server';
        } else {
            message = error.message;
        }
        throw new Error(message);

    }
}

export async function addCamera(data) {
    try{
        const response = await api.post('/cameras', data);
        return response.data;
    } catch (error) {
        let message = 'Add Camera Failed';

        if(error.response){
            message = error.response.data?.detail || error.response.statusText;
        } else if(error.request){
            message = 'No response from server';
        } else {
            message = error.message;
        }
        throw new Error(message);
    }
}

export async function deleteCamera(id){
    try{
        const response = await api.delete(`/cameras/${id}`);
        if(response.status === 204){
            return true;
        }
        return response.data;
    } catch (error) {
        let message = 'Delete Camera Failed';

        if(error.response){
            message = error.response.data?.detail || error.response.statusText;
        } else if(error.request){
            message = 'No response from server';
        } else {
            message = error.message;
        }
        throw new Error(message);
    }
}


export function generateColumns(data, exclude = ['id']) {
  if (!data || data.length === 0) return [];

  return Object.keys(data[0])
    .filter(key => !exclude.includes(key))
    .map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      field: key
    }));
}

export async function getCameraStatus() {
  try {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`);
    ws.onopen = () => {
        console.log('Connected to WebSocket');
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
            return data.status;
        }
    }
  } catch (error) {
    console.error('Cant connect to WebSocket:', error);
    throw error;
  }
}