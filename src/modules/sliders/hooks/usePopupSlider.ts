import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPopupSlider,
  fetchPopupSliderById,
  fetchPopupSliderList,
  updatePopupSlider,
} from "../api/popupSlider";

export function usePopupSliderList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["sliders", "popup", "list"],
    queryFn: fetchPopupSliderList,
    enabled: options?.enabled,
  });
}

export function usePopupSliderDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["sliders", "popup", "detail", id],
    queryFn: () => fetchPopupSliderById(id),
    enabled: !!id,
  });
}

export interface CreatePopupSliderInput {
  slider_url: string;
  selectedFile: File | null;
}

export function useCreatePopupSlider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePopupSliderInput) => {
      const data = new FormData();
      data.append("slider_url", input.slider_url);
      data.append("slider_images", input.selectedFile as unknown as Blob);
      return createPopupSlider(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sliders", "popup"] });
    },
  });
}

export interface UpdatePopupSliderInput {
  id: string | undefined;
  slider_url: string;
  slider_status: string;
  selectedFile: File | null;
}

export function useUpdatePopupSlider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePopupSliderInput) => {
      const formData = new FormData();
      formData.append("slider_url", input.slider_url);
      formData.append("slider_status", input.slider_status);
      formData.append("slider_images", input.selectedFile as unknown as Blob);
      return updatePopupSlider(input.id, formData);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sliders", "popup"] });
    },
  });
}
