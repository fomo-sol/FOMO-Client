import axiosInstance from "@/services/axios-instance";

export const getTelegramUrl = async (userId) => {
  const res = await axiosInstance.get(`/telegram/url?userId=${userId}`);
  return res.data.url;
};
