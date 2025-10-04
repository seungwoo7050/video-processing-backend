FROM node:20

RUN apt-get update && apt-get install -y \
    ffmpeg libavcodec-dev libavformat-dev libavfilter-dev \
    build-essential python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]