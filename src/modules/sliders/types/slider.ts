export interface SliderRow {
  id: number;
  slider_images?: string | null;
  slider_url?: string;
  slider_status?: string;
}

export interface SliderFormState {
  slider_images: string;
  slider_url: string;
  slider_status: string;
}
