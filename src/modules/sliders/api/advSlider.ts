import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth-storage";
import type { SliderFormState, SliderRow } from "../types/slider";

export const ADV_SLIDER_LIST_URL = `${BASE_URL}/api/panel-fetch-adv-slider-list`;
export const ADV_SLIDER_CREATE_URL = `${BASE_URL}/api/panel-create-adv-slider`;
export const advSliderByIdUrl = (id: string | undefined) =>
  `${BASE_URL}/api/panel-fetch-adv-slider-by-id/${id}`;
export const advSliderUpdateUrl = (id: string | undefined) =>
  `${BASE_URL}/api/panel-update-adv-slider/${id}?_method=PUT`;

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function fetchAdvSliderList(): Promise<SliderRow[]> {
  const response = await axios.get(ADV_SLIDER_LIST_URL, { headers: authHeaders() });
  return (response.data?.slider || []) as SliderRow[];
}

export async function fetchAdvSliderById(id: string | undefined): Promise<SliderFormState> {
  const response = await axios.get(advSliderByIdUrl(id), { headers: authHeaders() });
  return response.data.slider as SliderFormState;
}

export function createAdvSlider(data: FormData) {
  return axios({
    url: ADV_SLIDER_CREATE_URL,
    method: "POST",
    data,
    headers: authHeaders(),
  });
}

export function updateAdvSlider(id: string | undefined, data: FormData) {
  return axios.post(advSliderUpdateUrl(id), data, { headers: authHeaders() });
}
