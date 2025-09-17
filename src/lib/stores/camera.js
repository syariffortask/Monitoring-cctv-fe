import { writable } from "svelte/store";
import { getCameras } from "$lib/api/camera";

const WS_URL = import.meta.env.VITE_WS_URL

export const cameras = writable([]);

async function loadCameras() {
  try {
    const data = await getCameras();

    cameras.set(
      data.map(cam => ({
        ...cam,
        status: "online",
        time: null
      }))
    );
  } catch (err) {
    console.error("Gagal load cameras:", err.message);
  }
}

function connectWS() {
  const ws = new WebSocket(WS_URL);
  ws.onopen = () => console.log("WS connected");

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    cameras.update(list =>
      list.map(cam => {
        const wsData = msg[cam.id]; // id REST = key WS
        if (wsData) {
          return {
            ...cam,
            status: wsData.status ? "online" : "offline",
            time: wsData.last_checked
          };
        }
        return cam;
      })
    );
  };

  ws.onclose = () => {
    console.log("WS closed, reconnecting...");
    setTimeout(connectWS, 2000);
  };
}

export function initCameras() {
  loadCameras();
  connectWS();
}
