FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy ONLY the files needed for your static site
COPY index.html /usr/share/nginx/html/

COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

