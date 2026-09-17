import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdvSlider, fetchAdvSliderById, fetchAdvSliderList, updateAdvSlider } from "../api/advSlider";

export function useAdvSliderList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["sliders", "adv", "list"],
    queryFn: fetchAdvSliderList,
    enabled: options?.enabled,
  });
}

export function useAdvSliderDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["sliders", "adv", "detail", id],
    queryFn: () => fetchAdvSliderById(id),
    enabled: !!id,
  });
}

export interface CreateAdvSliderInput {
  slider_url: string;
  selectedFile: File | null;
}

export function useCreateAdvSlider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAdvSliderInput) => {
      const data = new FormData();
      data.append("slider_url", input.slider_url);
      data.append("slider_images", input.selectedFile as unknown as Blob);
      return createAdvSlider(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sliders", "adv"] });
    },
  });
}

export interface UpdateAdvSliderInput {
  id: string | undefined;
  slider_url: string;
  slider_status: string;
  selectedFile: File | null;
}

export function useUpdateAdvSlider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAdvSliderInput) => {
      const formData = new FormData();
      formData.append("slider_url", input.slider_url);
      formData.append("slider_status", input.slider_status);
      formData.append("slider_images", input.selectedFile as unknown as Blob);
      return updateAdvSlider(input.id, formData);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sliders", "adv"] });
    },
  });
}
