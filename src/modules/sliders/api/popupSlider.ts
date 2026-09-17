import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth-storage";
import type { SliderFormState, SliderRow } from "../types/slider";

export const POPUP_SLIDER_LIST_URL = `${BASE_URL}/api/panel-fetch-popup-slider-list`;
export const POPUP_SLIDER_CREATE_URL = `${BASE_URL}/api/panel-create-popup-slider`;
export const popupSliderByIdUrl = (id: string | undefined) =>
  `${BASE_URL}/api/panel-fetch-popup-slider-by-id/${id}`;
export const popupSliderUpdateUrl = (id: string | undefined) =>
  `${BASE_URL}/api/panel-update-popup-slider/${id}?_method=PUT`;

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function fetchPopupSliderList(): Promise<SliderRow[]> {
  const response = await axios.get(POPUP_SLIDER_LIST_URL, { headers: authHeaders() });
  return (response.data?.slider || []) as SliderRow[];
}

export async function fetchPopupSliderById(id: string | undefined): Promise<SliderFormState> {
  const response = await axios.get(popupSliderByIdUrl(id), { headers: authHeaders() });
  return response.data.slider as SliderFormState;
}

export function createPopupSlider(data: FormData) {
  return axios({
    url: POPUP_SLIDER_CREATE_URL,
    method: "POST",
    data,
    headers: authHeaders(),
  });
}

export function updatePopupSlider(id: string | undefined, data: FormData) {
  return axios.post(popupSliderUpdateUrl(id), data, { headers: authHeaders() });
}
