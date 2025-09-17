FROM nginx:alpine

# hapus file default nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
# copy file nginx.conf ke dalam image
COPY nginx.conf /etc/nginx/conf.d/

# copy file hasil build ke dalam image
COPY build /usr/share/nginx/html

# expose port 80
EXPOSE 80

# jalankan nginx
CMD ["nginx", "-g", "daemon off;"]