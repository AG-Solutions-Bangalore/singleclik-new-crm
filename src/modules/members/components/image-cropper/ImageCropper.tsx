import { useRef, useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import type { PercentCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import setCanvasPreview from "@/lib/image-canvas";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface ImageCropperProps {
  closeModal: () => void;
  updateAvatar: (imgSrc: string) => void;
  onFileChange?: (file: File) => void;
}

const ImageCropper = ({ closeModal, updateAvatar, onFileChange }: ImageCropperProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<PercentCrop | undefined>(undefined);
  const [error, setError] = useState("");

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileChange?.(file);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (event) => {
        if (error) setError("");
        const target = event.currentTarget as HTMLImageElement | null;
        const naturalWidth = target?.naturalWidth ?? 0;
        const naturalHeight = target?.naturalHeight ?? 0;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          setImgSrc("");
          return;
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const cropped = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(cropped, width, height);
    setCrop(centeredCrop);
  };

  const handleCrop = () => {
    const img = imgRef.current;
    const canvas = previewCanvasRef.current;
    if (!crop || !img || !canvas) return;
    setCanvasPreview(
      img,
      canvas,
      convertToPixelCrop(crop, img.width, img.height)
    );
    const dataUrl = canvas.toDataURL("image/jpeg", 0.3);
    const file = dataURLtoFile(dataUrl, "cropped-image.png");
    onFileChange?.(file);
    updateAvatar(dataUrl);
    closeModal();
  };

  // Function to convert data URL to file
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <>
      <label className="mb-3 block w-fit">
        <span className="sr-only">Choose profile photo</span>
        <Input type="file" accept="image/*" onChange={onSelectFile} />
      </label>
      {error && <p className="text-label-sm text-error">{error}</p>}
      {imgSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(_pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={handleCrop}
          >
            Crop Image
          </Button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};

export default ImageCropper;
