# Dashboard Monitoring CCTV
Frontend dashboard menggunakan svelte dan leafleat js untuk map dan kordinat nya
## Developing
```
npm install
```
## Copy env
sesuaikan url api dan WS api
```
cp .env.example .env
```

## Jalankan Dev Mode
```
npm run dev
```

## Building

```
npm run build
```

## Building image docker
pastikan sudah ada docker di server/pc untuk serving aplikasi lebih mudah
```
docker build -t cctv-monitor .
```

## run image
buka docker desktop atau docker cli saja untuk jalankan image, pastikan image sudah ada
```
docker image ls
docker run -d --name cctv_monitor -p 88:80 cctv-monitor
```
aplikasi jalan pada port 88





