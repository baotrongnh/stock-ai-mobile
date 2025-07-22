import axiosClient from "./axiosClient";

/**
 * Lấy tất cả podcast đã được xuất bản (public)
 * @param {number} page - Trang hiện tại
 * @param {number} pageSize - Số lượng mỗi trang
 * @param {boolean} [featured] - Lọc theo featured
 * @param {string[]} [tags] - Lọc theo tags
 * @returns {Promise<Object>}
 */
export const getPublishedPodcasts = async (
  page,
  pageSize,
  status,
  featured,
  tags
) => {
  try {
    const params = {
      page,
      pageSize,
      status,
    };

    if (featured !== undefined) {
      params.featured = featured;
    }

    if (tags && tags.length > 0) {
      params.tags = tags.join(",");
    }

    return await axiosClient.get(`/public/podcasts/`, { params });
  } catch (error) {
    console.error("Error in getPublishedPodcasts:", error);
    throw error;
  }
};

/**
 * Lấy podcast được đề xuất (featured)
 * @param {number} page - Trang hiện tại
 * @param {number} pageSize - Số lượng mỗi trang
 * @returns {Promise<Object>}
 */
export const getFeaturedPodcasts = async (page = 1, pageSize = 5) => {
  try {
    return await axiosClient.get(`/public/podcasts/featured`, {
      params: {
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching featured podcasts:", error);
    throw error;
  }
};

/**
 * Lấy podcast theo ID
 * @param {number} id - ID của podcast
 * @returns {Promise<Object>}
 */
export const getPodcastById = async (id) => {
  try {
    return await axiosClient.get(`/public/podcasts/${id}`);
  } catch (error) {
    console.error("Error fetching podcast by ID:", error);
    throw error;
  }
};

/**
 * Tăng số lượt nghe của podcast
 * @param {number} id - ID của podcast
 * @returns {Promise<Object>}
 */
export const incrementPlayCount = async (id) => {
  try {
    return await axiosClient.post(`/public/podcasts/${id}/play`);
  } catch (error) {
    console.error("Error incrementing play count:", error);
    throw error;
  }
};

/**
 * Format thời lượng từ giây sang dạng MM:SS hoặc HH:MM:SS
 * @param {number|null} seconds - Thời lượng tính bằng giây
 * @returns {string} - Định dạng thời gian dễ đọc
 */
export const formatDuration = (seconds) => {
  if (!seconds) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Format kích thước file
 * @param {number|null} bytes - Kích thước file tính bằng byte
 * @returns {string} - Định dạng kích thước dễ đọc
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return "Unknown size";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Format thời gian tương đối (ví dụ: "3 giờ trước", "2 ngày trước")
 * @param {string} dateString - Chuỗi datetime (ISO)
 * @returns {string} - Định dạng thời gian tương đối
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
  return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
};
