const videos = [];
let nextId = 1;

export function getAllVideos() {
    return videos;
}

export function getVideoById(id) {
    return videos.find((v) => v.id === id);
}

export function createVideo(title, filename) {
    const newVideo = {
        id: nextId++,
        title,
        filename,
        status: "pending",
        createdAt: new Date().toISOString(),
    };
    
    videos.push(newVideo);
    return newVideo;
}

export function deleteVideo(id) {
    const index = videos.findIndex((v) => v.id === id);
    if (index === -1) return false;

    videos.splice(index, 1);
    return true;
}