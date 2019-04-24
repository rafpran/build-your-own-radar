docker volume create radar-data
docker build . -t radar-server
docker run -p3000:3000 --mount source=radar-data,target=/var/uploads radar-server